"""Development-only static server (never needed by the site itself).

Usage:  python -I tools/dev-server.py [port]        (default 5520; the PORT env variable wins)

Serves the repository root (the folder above tools/) on 127.0.0.1, so each worktree serves its own
files whatever the current directory is. Differences from `python -m http.server`:
- It refuses a port that is already in use. On Windows, http.server sets SO_REUSEADDR, so a second
  server could bind the same port as another worktree's and requests went to either one.
- It sends `Cache-Control: no-store`, so the browser never runs stale JS/CSS after an edit.
"""

import functools
import http.server
import os
import pathlib
import socket
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class ExclusiveServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = False

    def server_bind(self):
        if hasattr(socket, "SO_EXCLUSIVEADDRUSE"):  # Windows
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


def main():
    port = int(os.environ.get("PORT") or (sys.argv[1] if len(sys.argv) > 1 else 5520))
    handler = functools.partial(NoCacheHandler, directory=str(ROOT))
    try:
        server = ExclusiveServer(("127.0.0.1", port), handler)
    except OSError as e:
        sys.exit(f"Port {port} is already in use ({e}). Pick another entry in .claude/launch.json "
                 f"(static-dev-2, -3, ...) or stop the other server.")
    print(f"Serving {ROOT} at http://127.0.0.1:{port}/ (no-store)", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
