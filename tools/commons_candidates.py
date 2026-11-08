"""Build-time helper (not needed at runtime): find candidate photos on Wikimedia Commons.

For each place it lists files from Commons categories and/or a file search, keeps only freely
licensed, large, reasonably landscape files, and writes:
  - <out>/candidates.json      metadata per place (title, licence, author, size, upload year)
  - <out>/<place>.jpg          numbered contact sheet of small previews, for picking by eye

Usage: python -I tools/commons_candidates.py <destination-id> <out_dir> [place ...]
       options: --max-files N (default 100 per place), --sheet N (default 30 previews), --refresh

Sources per place come from data/destinations/<id>/photo-selection.json -> "candidateSources":
  {"<place>": {"cats": ["Category:…"], "search": ["…"], "min_w": 1600, "pre2023": true}}
Use "cover" as the place for destination (city) photos.
Prefer categories (precise). For "search", use precise CirrusSearch syntax, e.g.
  'intitle:"Con Market"', 'incategory:"Markets in Da Nang"', '"Chợ Cồn" Đà Nẵng'
Free-text words match loosely and bring unrelated files. Results keep relevance order:
category files first (largest first), then search hits by rank. "pre2023": true keeps only uploads before
2023 (Vietnam: no freedom of panorama for modern copyrighted works since 2023).

Speed and politeness:
- All Wikimedia requests go through tools/wm_http.py: one shared, paced queue for every session
  and worktree, with Retry-After back-off.
- API results are cached in source-assets/commons-cache/ (git-ignored), so a re-run or a second
  place that uses the same category costs nothing. Use --refresh to ignore the cache.
- At most --max-files files are inspected per place and --sheet previews are drawn.
Nothing here is shipped; picked files go into photo-selection.json and through photos.py.
"""

import argparse
import hashlib
import io
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wm_http  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "source-assets" / "commons-cache"
FREE = re.compile(r"^(CC0|Public domain|PD\b|CC BY(-SA)? \d(\.\d)?)", re.I)
PAGE = 50
II = {"prop": "imageinfo", "iiprop": "url|size|extmetadata|timestamp|mime", "iiurlwidth": "240",
      "iiextmetadatafilter": "LicenseShortName|Artist|ImageDescription"}


def strip(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()


def files_from(generator_params, limit, refresh):
    """Pages (with imageinfo) from one generator, at most `limit` files; cached on disk."""
    key = hashlib.sha1(json.dumps([generator_params, limit, II], sort_keys=True).encode()).hexdigest()[:16]
    cache = CACHE / f"{key}.json"
    if cache.exists() and not refresh:
        return json.loads(cache.read_text(encoding="utf-8"))
    out, cont = [], {}
    while len(out) < limit:
        data = wm_http.api_get({"action": "query", **generator_params, **II, **cont})
        out += data.get("query", {}).get("pages", [])
        if "continue" not in data:
            break
        cont = data["continue"]
    out = out[:limit]
    CACHE.mkdir(parents=True, exist_ok=True)
    cache.write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    return out


def collect(spec, existing, max_files, refresh):
    pages = []   # (origin, page) in relevance order: category files first, then search hits by rank
    sources = [("cat", c) for c in spec.get("cats", [])] + [("search", s) for s in spec.get("search", [])]
    per_source = max(PAGE, max_files // max(1, len(sources)))
    for kind, value in sources:
        if len(pages) >= max_files * 2:
            break
        if kind == "cat":
            params = {"generator": "categorymembers", "gcmtitle": value, "gcmtype": "file", "gcmlimit": str(PAGE)}
        else:
            params = {"generator": "search", "gsrsearch": value, "gsrnamespace": "6", "gsrlimit": str(PAGE)}
        found = files_from(params, per_source, refresh)
        if kind == "cat":
            found.sort(key=lambda p: -(p.get("imageinfo") or [{}])[0].get("width", 0) * (p.get("imageinfo") or [{}])[0].get("height", 0))
        else:
            found.sort(key=lambda p: p.get("index", 0))   # search rank
        pages += [(f"{kind}: {value}", p) for p in found]
    seen, keep = set(), []
    for origin, p in pages:
        title = p["title"]
        if title in seen or "imageinfo" not in p:
            continue
        seen.add(title)
        ii = p["imageinfo"][0]
        em = ii.get("extmetadata", {})
        lic = strip(em.get("LicenseShortName", {}).get("value"))
        w, h = ii["width"], ii["height"]
        year = int(ii["timestamp"][:4])
        if ii.get("mime") not in ("image/jpeg", "image/png", "image/webp"):
            continue
        if not FREE.match(lic) or w < spec.get("min_w", 1200) or not (0.6 <= w / h <= 2.4):
            continue
        if spec.get("pre2023") and year >= 2023:
            continue
        if title.replace(" ", "_")[5:] in existing:
            continue
        keep.append({
            "title": title, "license": lic, "artist": strip(em.get("Artist", {}).get("value"))[:60],
            "width": w, "height": h, "uploaded": year, "thumb": ii.get("thumburl"),
            "description": strip(em.get("ImageDescription", {}).get("value"))[:200],
            "from": origin,
        })
    return keep


def contact_sheet(cands, path):
    from PIL import Image, ImageDraw
    W, H, cols = 250, 175, 6
    rows = (len(cands) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * W, max(1, rows) * (H + 18)), "white")
    draw = ImageDraw.Draw(sheet)
    for i, c in enumerate(cands):
        try:
            im = Image.open(io.BytesIO(wm_http.fetch(c["thumb"]))).convert("RGB")
            im.thumbnail((W - 4, H))
        except Exception as e:  # noqa: BLE001 — a failed preview just stays blank
            print("  preview failed", c["title"], e)
            continue
        x, y = (i % cols) * W, (i // cols) * (H + 18)
        sheet.paste(im, (x, y))
        draw.text((x + 3, y + H + 2), f"#{i} {c['uploaded']} {c['license']}", fill="black")
    sheet.save(path, quality=82)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("dest")
    ap.add_argument("out")
    ap.add_argument("places", nargs="*")
    ap.add_argument("--max-files", type=int, default=100)
    ap.add_argument("--sheet", type=int, default=30)
    ap.add_argument("--refresh", action="store_true")
    a = ap.parse_args()
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    sel = json.loads((ROOT / "data" / "destinations" / a.dest / "photo-selection.json").read_text(encoding="utf-8"))
    sources = sel.get("candidateSources", {})
    places = a.places or list(sources)
    # Already chosen Commons files (object entries are Flickr/Unsplash/Pexels and never collide).
    chosen = [f for f in sel.get("cover", [])] + [f for files in sel.get("locations", {}).values() for f in files]
    existing = {f for f in chosen if isinstance(f, str)}
    result_path = out / "candidates.json"
    result = json.loads(result_path.read_text(encoding="utf-8")) if result_path.exists() else {}
    for place in places:
        if place not in sources:
            print(f"{place}: no candidateSources entry, skipped")
            continue
        cands = collect(sources[place], existing, a.max_files, a.refresh)[: a.sheet]
        result[place] = cands
        result_path.write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
        contact_sheet(cands, out / f"{place}.jpg")
        print(f"{place}: {len(cands)} candidates -> {out / (place + '.jpg')}", flush=True)


if __name__ == "__main__":
    main()
