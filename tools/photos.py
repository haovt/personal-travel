"""Build-time tool (not needed at runtime): photos from Wikimedia Commons.

Steps (run in order, each is safe to re-run):
  python -I tools/photos.py meta      # read licence/author/size of every selected file -> source-assets/commons/metadata.json
  python -I tools/photos.py download  # download each approved file once (scaled to <= 2400 px wide), one at a time
  python -I tools/photos.py build     # write WebP sizes to assets/... and data/photo-credits.json

Only files whose licence is CC0, public domain, CC BY or CC BY-SA are downloaded.
The selection lives in tools/photo-selection.json.
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
SELECTION = ROOT / "tools" / "photo-selection.json"
SRC = ROOT / "source-assets" / "commons"
META = SRC / "metadata.json"
CREDITS = ROOT / "data" / "photo-credits.json"
API = "https://commons.wikimedia.org/w/api.php"
UA = "LocalLiveTravel/0.1 (personal non-commercial virtual travel atlas; build-time asset collection)"
WIDTHS = [400, 800, 1200, 1800]
DOWNLOAD_WIDTH = 2400
FREE = re.compile(r"^(CC0|Public domain|PD\b|CC BY(-SA)? \d(\.\d)?)", re.I)


def get_json(params):
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json", "formatversion": "2"})
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def strip_html(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def clean_creator(s):
    # Commons signatures often end with a talk-page link: "Name (thảo luận)", "Name (talk)".
    return re.sub(r"\s*\((thảo luận|talk|discussion|contribs)\)\s*$", "", s, flags=re.I).strip()


def selection_items():
    sel = json.loads(SELECTION.read_text(encoding="utf-8"))
    for kind in ("destinations", "locations"):
        for owner, files in sel[kind].items():
            for i, name in enumerate(files, 1):
                yield kind, owner, i, name


def cmd_meta():
    SRC.mkdir(parents=True, exist_ok=True)
    items = list(selection_items())
    titles = ["File:" + name for _, _, _, name in items]
    meta = {}
    for start in range(0, len(titles), 20):
        batch = titles[start:start + 20]
        data = get_json({
            "action": "query", "titles": "|".join(batch), "prop": "imageinfo",
            "iiprop": "url|size|extmetadata|timestamp", "iiurlwidth": str(DOWNLOAD_WIDTH),
        })
        for page in data["query"]["pages"]:
            key = page["title"]
            if page.get("missing") or "imageinfo" not in page:
                meta[key] = {"missing": True}
                continue
            ii = page["imageinfo"][0]
            em = ii.get("extmetadata", {})
            val = lambda k: em.get(k, {}).get("value", "")
            meta[key] = {
                "page": ii.get("descriptionurl"),
                "width": ii["width"], "height": ii["height"],
                "downloadUrl": ii.get("thumburl") or ii["url"],
                "lastUploaded": ii.get("timestamp"),
                "artist": strip_html(val("Artist")),
                "credit": strip_html(val("Credit")),
                "license": strip_html(val("LicenseShortName")),
                "licenseUrl": val("LicenseUrl"),
                "attributionRequired": val("AttributionRequired") == "true",
                "description": strip_html(val("ImageDescription"))[:300],
                "dateTaken": strip_html(val("DateTimeOriginal"))[:40],
            }
        time.sleep(1)
    META.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    for kind, owner, i, name in items:
        m = meta.get("File:" + name.replace("_", " "), {"missing": True})
        if m.get("missing"):
            print(f"MISSING  {owner} #{i}: {name}")
            continue
        ok = "OK  " if FREE.match(m["license"]) else "REJECT"
        print(f"{ok} {owner} #{i}: {m['license']:<14} {m['width']}x{m['height']}  {m['artist'][:40]:<40} up {m['lastUploaded'][:4]}")


def load_meta():
    return json.loads(META.read_text(encoding="utf-8"))


def source_path(owner, i):
    return SRC / owner / f"{i:02d}.jpg"


def cmd_download():
    meta = load_meta()
    for kind, owner, i, name in selection_items():
        m = meta.get("File:" + name.replace("_", " "))
        if not m or m.get("missing") or not FREE.match(m["license"]):
            print(f"skip {owner} #{i} ({name})")
            continue
        dest = source_path(owner, i)
        if dest.exists():
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(m["downloadUrl"], headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=120) as r:
            dest.write_bytes(r.read())
        print(f"downloaded {owner} #{i}: {dest.stat().st_size // 1024} kB")
        time.sleep(1.5)


def cmd_build():
    from PIL import Image, ImageOps  # imported here so meta/download work without Pillow

    meta = load_meta()
    credits = []
    for kind, owner, i, name in selection_items():
        m = meta.get("File:" + name.replace("_", " "))
        src = source_path(owner, i)
        if not m or m.get("missing") or not src.exists():
            print(f"skip {owner} #{i}")
            continue
        out_dir = ROOT / "assets" / ("destinations" if kind == "destinations" else "locations") / owner
        out_dir.mkdir(parents=True, exist_ok=True)
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            w, h = im.size
            files = {}
            for target in WIDTHS:
                if target > w and target != WIDTHS[0]:
                    continue
                tw = min(target, w)
                th = round(h * tw / w)
                out = out_dir / f"{i:02d}-{target}.webp"
                im.resize((tw, th), Image.LANCZOS).save(out, "WEBP", quality=78, method=6)
                files[str(target)] = out.relative_to(ROOT).as_posix()
        credits.append({
            "id": f"{owner}-{i:02d}",
            "owner": owner,
            "ownerType": "destination" if kind == "destinations" else "location",
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
        print(f"built {owner} #{i}: {w}x{h} -> {', '.join(files)}")
    CREDITS.write_text(json.dumps(credits, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(credits)} photos -> {CREDITS.relative_to(ROOT)}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    {"meta": cmd_meta, "download": cmd_download, "build": cmd_build}[sys.argv[1]]()
