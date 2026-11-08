"""Build-time tool (not needed at runtime): photos from Wikimedia Commons, one destination at a time.

  python -I tools/photos.py <destination-id> meta      # licence/author/size of every selected file
  python -I tools/photos.py <destination-id> download  # download each approved file once (<= 2400 px wide)
  python -I tools/photos.py <destination-id> build     # WebP sizes + data/destinations/<id>/photo-credits.json

Input:   data/destinations/<id>/photo-selection.json   {"cover": [...], "locations": {"<loc-id>": [...]}}
Cache:   source-assets/commons/<id>/metadata.json, source-assets/commons/<id>/<owner>/NN.jpg  (git-ignored)
Output:  assets/destinations/<id>/<owner>/NN-<width>.webp   (owner = "cover" or a location id)
         data/destinations/<id>/photo-credits.json           (generated; do not edit by hand)

Only files whose licence is CC0, public domain, CC BY or CC BY-SA are downloaded.
Photo ids: "<id>-NN" for cover photos, "<location-id>-NN" for location photos.
"""

import html
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://commons.wikimedia.org/w/api.php"
UA = "LocalLiveTravel/0.1 (personal non-commercial virtual travel atlas; build-time asset collection)"
WIDTHS = [400, 800, 1200, 1800]
DOWNLOAD_WIDTH = 2400
FREE = re.compile(r"^(CC0|Public domain|PD\b|CC BY(-SA)? \d(\.\d)?)", re.I)


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
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json", "formatversion": "2", "maxlag": "5"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(15 * (attempt + 1))
                continue
            raise
    raise RuntimeError("Commons API keeps rate-limiting; try again later")


def strip_html(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def clean_creator(s):
    # Commons signatures often end with a talk-page link: "Name (thảo luận)", "Name (talk)".
    return re.sub(r"\s*\((thảo luận|talk|discussion|contribs)\)\s*$", "", s, flags=re.I).strip()


def key(name):
    return "File:" + name.replace("_", " ")


def cmd_meta(d):
    d.src.mkdir(parents=True, exist_ok=True)
    items = list(d.items())
    meta = json.loads(d.meta.read_text(encoding="utf-8")) if d.meta.exists() else {}
    todo = [key(n) for _, _, n in items if key(n) not in meta]
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
            em = ii.get("extmetadata", {})
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
        time.sleep(2)
    d.meta.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    for owner, i, name in items:
        m = meta.get(key(name), {"missing": True})
        if m.get("missing"):
            print(f"MISSING {owner} #{i}: {name}")
        else:
            ok = "OK    " if FREE.match(m["license"]) else "REJECT"
            print(f"{ok} {owner} #{i}: {m['license']:<14} {m['width']}x{m['height']}  {m['artist'][:40]:<40} up {m['lastUploaded'][:4]}")


def cmd_download(d):
    meta = json.loads(d.meta.read_text(encoding="utf-8"))
    for owner, i, name in d.items():
        m = meta.get(key(name))
        if not m or m.get("missing") or not FREE.match(m["license"]):
            print(f"skip {owner} #{i} ({name})")
            continue
        dest = d.src / owner / f"{i:02d}.jpg"
        if dest.exists():
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(urllib.request.Request(m["downloadUrl"], headers={"User-Agent": UA}), timeout=120) as r:
            dest.write_bytes(r.read())
        print(f"downloaded {owner} #{i}: {dest.stat().st_size // 1024} kB")
        time.sleep(1.5)


def cmd_build(d):
    from PIL import Image, ImageOps

    meta = json.loads(d.meta.read_text(encoding="utf-8"))
    credits = []
    for owner, i, name in d.items():
        m = meta.get(key(name))
        src = d.src / owner / f"{i:02d}.jpg"
        if not m or m.get("missing") or not src.exists():
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
