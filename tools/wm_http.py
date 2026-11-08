"""Build-time helper: polite, shared HTTP access to Wikimedia (Commons API + upload servers).

Every tool that talks to Wikimedia goes through this module, so parallel sessions (one per
destination, each in its own git worktree) don't trip Wikimedia's rate limits:

- One lock per host group, stored in the repository's shared git directory
  (`git rev-parse --git-common-dir`/livetravel-locks), so all worktrees see the same lock.
  Requests from all sessions are serialised and spaced by a minimum interval.
- HTTP 429/503 and API `maxlag` errors: wait exactly what the server asks (Retry-After), and make
  the other sessions wait too, then retry.
- A User-Agent with a contact URL, as Wikimedia's User-Agent policy asks.
"""

import json
import os
import subprocess
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "LocalLiveTravel/0.2 (https://github.com/haovt/personal-travel; personal non-commercial travel atlas) Python-urllib"
API = "https://commons.wikimedia.org/w/api.php"

# Minimum spacing between two requests to the same host group, across all sessions (seconds).
INTERVAL = {"api": 1.0, "upload": 0.35, "other": 0.5}


def _lock_dir():
    try:
        out = subprocess.run(["git", "rev-parse", "--git-common-dir"], cwd=ROOT, capture_output=True,
                             text=True, timeout=10).stdout.strip()
        if out:
            d = (ROOT / out).resolve() / "livetravel-locks"
            d.mkdir(parents=True, exist_ok=True)
            return d
    except (OSError, subprocess.SubprocessError):
        pass
    d = Path(tempfile.gettempdir()) / "livetravel-locks"
    d.mkdir(parents=True, exist_ok=True)
    return d


LOCK_DIR = _lock_dir()


class _HostLock:
    """Cross-process exclusive lock (Windows: msvcrt, elsewhere: fcntl)."""

    def __init__(self, group):
        self.path = LOCK_DIR / f"{group}.lock"
        self.stamp = LOCK_DIR / f"{group}.next"

    def __enter__(self):
        self.f = open(self.path, "a+b")
        while True:
            try:
                if os.name == "nt":
                    import msvcrt
                    self.f.seek(0)
                    msvcrt.locking(self.f.fileno(), msvcrt.LK_NBLCK, 1)
                else:
                    import fcntl
                    fcntl.flock(self.f, fcntl.LOCK_EX)
                return self
            except OSError:
                time.sleep(0.15)

    def __exit__(self, *exc):
        try:
            if os.name == "nt":
                import msvcrt
                self.f.seek(0)
                msvcrt.locking(self.f.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                import fcntl
                fcntl.flock(self.f, fcntl.LOCK_UN)
        finally:
            self.f.close()

    # Earliest time the next request to this host group may start (shared by all sessions).
    def next_allowed(self):
        try:
            return float(self.stamp.read_text())
        except (OSError, ValueError):
            return 0.0

    def set_next(self, t):
        self.stamp.write_text(f"{t:.3f}")


def _group(url):
    host = urllib.parse.urlparse(url).hostname or ""
    if host == "commons.wikimedia.org":
        return "api"
    if host.endswith("upload.wikimedia.org"):
        return "upload"
    return "other"


def fetch(url, *, retries=8, timeout=90):
    """GET `url` and return the body (bytes), paced and retried politely."""
    group = _group(url)
    for attempt in range(retries):
        with _HostLock(group) as lock:
            wait = lock.next_allowed() - time.time()
            if wait > 0:
                time.sleep(wait)
            lock.set_next(time.time() + INTERVAL[group])
            try:
                req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "identity"})
                with urllib.request.urlopen(req, timeout=timeout) as r:
                    return r.read()
            except urllib.error.HTTPError as e:
                if e.code not in (429, 500, 502, 503, 504):
                    raise
                retry_after = e.headers.get("Retry-After")
                backoff = float(retry_after) if retry_after and retry_after.isdigit() else min(60, 5 * 2 ** attempt)
                # Everyone backs off, not just this session.
                lock.set_next(time.time() + backoff)
                print(f"  {group}: HTTP {e.code}, waiting {backoff:.0f}s (attempt {attempt + 1}/{retries})", flush=True)
            except (urllib.error.URLError, TimeoutError) as e:
                backoff = min(60, 5 * 2 ** attempt)
                print(f"  {group}: {e}, waiting {backoff:.0f}s", flush=True)
        time.sleep(max(0.0, backoff))
    raise RuntimeError(f"Giving up on {url} after {retries} attempts")


def api_get(params):
    """Call the Commons API (formatversion 2) and return parsed JSON; handles maxlag."""
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json", "formatversion": "2", "maxlag": "5"})
    for attempt in range(6):
        data = json.loads(fetch(url))
        err = data.get("error", {})
        if err.get("code") == "maxlag":
            time.sleep(5 * (attempt + 1))
            continue
        if err:
            raise RuntimeError(f"Commons API error: {err}")
        return data
    raise RuntimeError("Commons API is lagged; try again later")
