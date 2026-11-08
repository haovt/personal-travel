"""Build-time helper (not needed at runtime): find candidate photos on Wikimedia Commons.

For each place in CANDIDATE_SOURCES it lists files from Commons categories and/or a file search,
keeps only freely licensed, large, reasonably landscape files, and writes:
  - <out>/candidates.json      metadata per place (title, licence, author, size, upload year)
  - <out>/<place>.jpg          numbered contact sheet of small previews, for picking by eye

Usage: python -I tools/commons_candidates.py <out_dir> [place ...]
Nothing here is shipped; picked files go into tools/photo-selection.json and through photos.py.
"""

import io
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

UA = "LocalLiveTravel/0.1 (personal non-commercial virtual travel atlas; build-time asset collection)"
API = "https://commons.wikimedia.org/w/api.php"
FREE = re.compile(r"^(CC0|Public domain|PD\b|CC BY(-SA)? \d(\.\d)?)", re.I)

# Places that contain copyrighted modern works (no freedom of panorama in Vietnam since 2023):
# only files uploaded before 2023 are accepted for these.
CANDIDATE_SOURCES = {
    # Destination (city) views; cityscapes often include modern bridges/buildings -> pre-2023 only.
    "da-nang": {"cats": ["Category:Skylines of Da Nang", "Category:Han River (Vietnam)", "Category:Views of Da Nang",
                         "Category:Da Nang at night"],
                "search": ["Da Nang skyline", "Da Nang city view", "Đà Nẵng toàn cảnh"],
                "min_w": 1800, "pre2023": True},
    "bai-bien-my-khe": {"cats": ["Category:My Khe Beach"], "min_w": 1600},
    "ngu-hanh-son": {"cats": ["Category:Ngũ Hành Sơn", "Category:Thuy Son", "Category:Views from Thuy Son",
                              "Category:Huyen Khong Cave", "Category:Pagodas in the Marble Mountains"], "min_w": 1600},
    "ba-na-cau-vang": {"cats": ["Category:Ba Na Hills", "Category:Golden Bridge (Vietnam)", "Category:Ba Na Hills Cable Car"],
                       "min_w": 1600, "pre2023": True},
    "cho-con": {"cats": ["Category:Con Market"], "search": ["Chợ Cồn Đà Nẵng", "Con market Da Nang"], "min_w": 1200},
    "mi-quang": {"cats": ["Category:Mì quảng"], "search": ["Mì Quảng"], "min_w": 1200},
    "bun-cha-ca": {"search": ["bún chả cá", "bun cha ca", "fish cake noodle soup Vietnam"], "min_w": 1200},
}


def api(params):
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json", "formatversion": "2", "maxlag": "5"})
    for attempt in range(5):
        time.sleep(2.5)
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=90) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(20 * (attempt + 1))
                continue
            raise
    raise RuntimeError("Commons API keeps rate-limiting")


def strip(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()


II = {"prop": "imageinfo", "iiprop": "url|size|extmetadata|timestamp|mime", "iiurlwidth": "320",
      "iiextmetadatafilter": "LicenseShortName|Artist|ImageDescription"}


def files_from(generator_params):
    out, cont = [], {}
    while True:
        data = api({"action": "query", **generator_params, **II, **cont})
        out += data.get("query", {}).get("pages", [])
        if "continue" not in data:
            return out
        cont = data["continue"]


def collect(place, spec, existing):
    pages = []
    for cat in spec.get("cats", []):
        pages += files_from({"generator": "categorymembers", "gcmtitle": cat, "gcmtype": "file", "gcmlimit": "50"})
    for term in spec.get("search", []):
        pages += files_from({"generator": "search", "gsrsearch": term, "gsrnamespace": "6", "gsrlimit": "40"})
    seen, keep = set(), []
    for p in pages:
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
        if not FREE.match(lic) or w < spec["min_w"] or not (0.6 <= w / h <= 2.4):
            continue
        if spec.get("pre2023") and year >= 2023:
            continue
        if title.replace(" ", "_")[5:] in existing:
            continue
        keep.append({
            "title": title, "license": lic, "artist": strip(em.get("Artist", {}).get("value"))[:60],
            "width": w, "height": h, "uploaded": year, "thumb": ii.get("thumburl"),
            "description": strip(em.get("ImageDescription", {}).get("value"))[:200],
        })
    keep.sort(key=lambda c: -c["width"] * c["height"])
    return keep[:60]


def contact_sheet(cands, path):
    from PIL import Image, ImageDraw
    W, H, cols = 320, 220, 6
    rows = (len(cands) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * W, max(1, rows) * (H + 20)), "white")
    draw = ImageDraw.Draw(sheet)
    for i, c in enumerate(cands):
        try:
            req = urllib.request.Request(c["thumb"], headers={"User-Agent": UA})
            im = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=60).read())).convert("RGB")
            im.thumbnail((W - 4, H))
            time.sleep(0.4)
        except Exception as e:  # noqa: BLE001 — a failed preview just stays blank
            print("preview failed", c["title"], e)
            continue
        x, y = (i % cols) * W, (i // cols) * (H + 20)
        sheet.paste(im, (x, y))
        draw.text((x + 4, y + H + 3), f"#{i} {c['uploaded']} {c['license']}", fill="black")
    sheet.save(path, quality=82)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    places = sys.argv[2:] or list(CANDIDATE_SOURCES)
    sel = json.loads((Path(__file__).parent / "photo-selection.json").read_text(encoding="utf-8"))
    existing = {f for files in sel["locations"].values() for f in files}
    result_path = out / "candidates.json"
    result = json.loads(result_path.read_text(encoding="utf-8")) if result_path.exists() else {}
    for place in places:
        cands = collect(place, CANDIDATE_SOURCES[place], existing)
        result[place] = cands
        result_path.write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
        contact_sheet(cands, out / f"{place}.jpg")
        print(f"{place}: {len(cands)} candidates")


if __name__ == "__main__":
    main()
