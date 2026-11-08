"""Build-time tool (not needed at runtime): destination photos, one destination at a time.

  python -I tools/photos.py <destination-id> meta      # licence/author/size of every selected file
  python -I tools/photos.py <destination-id> download  # download each approved file once (<= 2400 px wide)
  python -I tools/photos.py <destination-id> build     # WebP sizes + data/destinations/<id>/photo-credits.json

Input:   data/destinations/<id>/photo-selection.json   {"cover": [...], "locations": {"<loc-id>": [...]}}
Cache:   source-assets/commons/<id>/metadata.json, source-assets/commons/<id>/<owner>/NN.jpg  (git-ignored)
Output:  assets/destinations/<id>/<owner>/NN-<width>.webp   (owner = "cover" or a location id)
         data/destinations/<id>/photo-credits.json           (generated; do not edit by hand)

Photo ids: "<id>-NN" for cover photos, "<location-id>-NN" for location photos.

Each entry in photo-selection.json is either
  - a Wikimedia Commons file name (string): licence, author and size are read from the Commons API;
    only CC0, public domain, CC BY and CC BY-SA pass; or
  - an object for an approved non-Commons source (owner decision 2026-11-08), filled in by the
    session from the photo's own page (the tool cannot read these sites' licences itself):
      {"source": "flickr" | "unsplash" | "pexels",
       "page": "<photo page URL>", "file": "<direct image URL, ~2400 px wide if offered>",
       "creator": "<name as shown on the page>", "license": "<exact licence name>",
       "licenseUrl": "<licence URL>", "checked": "YYYY-MM-DD"}
    Flickr: CC0, Public Domain Mark, CC BY, CC BY-SA, CC BY-NC, CC BY-NC-SA (NC = only because
    this site is non-commercial; flagged nonCommercialOnly). Never ND ("NoDerivs") or
    "All rights reserved". Unsplash: "Unsplash License". Pexels: "Pexels License".
"""

import html
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wm_http  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
API = "https://commons.wikimedia.org/w/api.php"
UA = wm_http.UA
WIDTHS = [400, 800, 1200, 1800]
DOWNLOAD_WIDTH = 2400
FREE = re.compile(r"^(CC0|Public domain|PD\b|CC BY(-SA)? \d(\.\d)?)", re.I)
# Approved non-Commons sources (owner decision 2026-11-08) and the licence names each may carry.
OTHER_SOURCES = {
    "flickr": {"name": "Flickr", "host": "flickr.com",
               "licenses": re.compile(r"^(CC0( 1\.0)?|Public Domain Mark( 1\.0)?|CC BY(-SA|-NC|-NC-SA)? \d(\.\d)?)$", re.I)},
    "unsplash": {"name": "Unsplash", "host": "unsplash.com", "licenses": re.compile(r"^Unsplash License$", re.I)},
    "pexels": {"name": "Pexels", "host": "pexels.com", "licenses": re.compile(r"^Pexels License$", re.I)},
}


def other_ok(e):
    """Validate a non-Commons entry; returns an error string or None."""
    src = OTHER_SOURCES.get(e.get("source"))
    if not src:
        return f"unknown source {e.get('source')!r}"
    for k in ("page", "file", "creator", "license", "licenseUrl"):
        if not e.get(k):
            return f"missing {k}"
    if src["host"] not in e["page"]:
        return f"page is not on {src['host']}"
    lic = e["license"].strip()
    if re.search(r"\bND\b|NoDeriv|all rights reserved", lic, re.I) or not src["licenses"].match(lic):
        return f"licence not allowed: {lic}"
    return None


class Dest:
    def __init__(self, dest_id):
        self.id = dest_id
        self.data = ROOT / "data" / "destinations" / dest_id
        self.selection = self.data / "photo-selection.json"
        self.credits = self.data / "photo-credits.json"
        self.src = ROOT / "source-assets" / "commons" / dest_id
        self.meta = self.src / "metadata.json"
        self.assets = ROOT / "assets" / "destinations" / dest_id
        if not self.selection.exists():
            sys.exit(f"Missing {self.selection.relative_to(ROOT)}")

    def items(self):
        """(owner, index, file name) in gallery order; owner 'cover' = destination photos."""
        sel = json.loads(self.selection.read_text(encoding="utf-8"))
        for i, name in enumerate(sel.get("cover", []), 1):
            yield "cover", i, name
        for owner, files in sel.get("locations", {}).items():
            for i, name in enumerate(files, 1):
                yield owner, i, name

    def photo_id(self, owner, i):
        return f"{self.id if owner == 'cover' else owner}-{i:02d}"


def get_json(params):
    # All Wikimedia traffic goes through the shared, paced client (see tools/wm_http.py).
    return wm_http.api_get(params)


def strip_html(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def clean_creator(s):
    # Commons signatures often end with a talk-page link: "Name (thảo luận)", "Name (talk)".
    # Also drops a trailing wiki signature timestamp: "Xocolatl (talk) 21:25, 12 April 2022 (UTC)".
    s = re.sub(r"\s*\d{1,2}:\d{2}, \d{1,2} \w+ \d{4} \(UTC\)\s*$", "", s)
    return re.sub(r"\s*\((thảo luận|talk|discussion|contribs)\)\s*$", "", s, flags=re.I).strip()


def key(entry):
    if isinstance(entry, dict):
        return entry.get("page", "")
    return "File:" + entry.replace("_", " ")


def cmd_meta(d):
    d.src.mkdir(parents=True, exist_ok=True)
    items = list(d.items())
    meta = json.loads(d.meta.read_text(encoding="utf-8")) if d.meta.exists() else {}
    for _, _, n in items:
        if isinstance(n, dict):
            err = other_ok(n)
            meta[key(n)] = {"error": err} if err else {
                "page": n["page"], "downloadUrl": n["file"], "lastUploaded": "",
                "artist": n["creator"], "license": n["license"].strip(), "licenseUrl": n["licenseUrl"],
                "attributionRequired": n["source"] == "flickr" and n["license"].upper().startswith("CC BY"),
                "sourceName": OTHER_SOURCES[n["source"]]["name"],
                "nonCommercialOnly": "-NC" in n["license"].upper(),
                "checked": n.get("checked", ""),
            }
    todo = [key(n) for _, _, n in items if not isinstance(n, dict) and key(n) not in meta]
    for start in range(0, len(todo), 20):
        data = get_json({
            "action": "query", "titles": "|".join(todo[start:start + 20]), "prop": "imageinfo",
            "iiprop": "url|size|extmetadata|timestamp", "iiurlwidth": str(DOWNLOAD_WIDTH),
        })
        for page in data["query"]["pages"]:
            if page.get("missing") or "imageinfo" not in page:
                meta[page["title"]] = {"missing": True}
                continue
            ii = page["imageinfo"][0]
            em = ii.get("extmetadata") or {}  # Commons sometimes returns [] instead of {}
            val = lambda k: em.get(k, {}).get("value", "")  # noqa: E731
            meta[page["title"]] = {
                "page": ii.get("descriptionurl"),
                "width": ii["width"], "height": ii["height"],
                "downloadUrl": ii.get("thumburl") or ii["url"],
                "lastUploaded": ii.get("timestamp"),
                "artist": strip_html(val("Artist")),
                "license": strip_html(val("LicenseShortName")),
                "licenseUrl": val("LicenseUrl"),
                "attributionRequired": val("AttributionRequired") == "true",
                "description": strip_html(val("ImageDescription"))[:300],
            }
    d.meta.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    for owner, i, name in items:
        m = meta.get(key(name), {"missing": True})
        if m.get("missing"):
            print(f"MISSING {owner} #{i}: {name}")
        elif m.get("error"):
            print(f"REJECT {owner} #{i}: {m['error']} ({key(name)})")
        elif isinstance(name, dict):
            print(f"OK     {owner} #{i}: {m['license']:<14} {m['sourceName']:<9} {m['artist'][:40]}")
        else:
            ok = "OK    " if FREE.match(m["license"]) else "REJECT"
            print(f"{ok} {owner} #{i}: {m['license']:<14} {m['width']}x{m['height']}  {m['artist'][:40]:<40} up {m['lastUploaded'][:4]}")


def usable(m):
    if not m or m.get("missing") or m.get("error"):
        return False
    return bool(m.get("sourceName")) or bool(FREE.match(m["license"]))


def cmd_download(d):
    meta = json.loads(d.meta.read_text(encoding="utf-8"))
    for owner, i, name in d.items():
        m = meta.get(key(name))
        if not usable(m):
            print(f"skip {owner} #{i} ({key(name)})")
            continue
        dest = d.src / owner / f"{i:02d}.jpg"
        if dest.exists():
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(wm_http.fetch(m["downloadUrl"], timeout=120))
        print(f"downloaded {owner} #{i}: {dest.stat().st_size // 1024} kB", flush=True)


def cmd_build(d):
    from PIL import Image, ImageOps

    meta = json.loads(d.meta.read_text(encoding="utf-8"))
    credits = []
    for owner, i, name in d.items():
        m = meta.get(key(name))
        src = d.src / owner / f"{i:02d}.jpg"
        if not usable(m) or not src.exists():
            print(f"skip {owner} #{i}")
            continue
        out_dir = d.assets / owner
        out_dir.mkdir(parents=True, exist_ok=True)
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            w, h = im.size
            files = {}
            for target in WIDTHS:
                if target > w and target != WIDTHS[0]:
                    continue
                tw = min(target, w)
                out = out_dir / f"{i:02d}-{target}.webp"
                if not out.exists() or out.stat().st_mtime < src.stat().st_mtime:
                    im.resize((tw, round(h * tw / w)), Image.LANCZOS).save(out, "WEBP", quality=78, method=6)
                files[str(target)] = out.relative_to(ROOT).as_posix()
        credits.append({
            "id": d.photo_id(owner, i),
            "destinationId": d.id,
            "owner": d.id if owner == "cover" else owner,
            "ownerType": "destination" if owner == "cover" else "location",
            "files": files,
            "width": w, "height": h,
            "source": m["page"],
            "creator": clean_creator(m["artist"]),
            "license": m["license"],
            "licenseUrl": m["licenseUrl"],
            "attributionRequired": m["attributionRequired"],
            "sourceName": m.get("sourceName", "Wikimedia Commons"),
            **({"nonCommercialOnly": True} if m.get("nonCommercialOnly") else {}),
            "modified": "đã thu nhỏ kích thước",
            "uploaded": (m["lastUploaded"] or "")[:10],
            "retrieved": time.strftime("%Y-%m-%d"),
        })
    d.credits.write_text(json.dumps(credits, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(credits)} photos -> {d.credits.relative_to(ROOT)}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) != 3 or sys.argv[2] not in ("meta", "download", "build"):
        sys.exit("Usage: python -I tools/photos.py <destination-id> meta|download|build")
    {"meta": cmd_meta, "download": cmd_download, "build": cmd_build}[sys.argv[2]](Dest(sys.argv[1]))
