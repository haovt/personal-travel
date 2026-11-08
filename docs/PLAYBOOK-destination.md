# Playbook — building one destination

How any destination (Vietnam or Switzerland) is added to the atlas. Đà Nẵng is the reference: copy
its file shapes from `data/destinations/da-nang/`. Read `CLAUDE.md` first, especially "Hard rules",
"Content style decision", "Photo source decision" and **"Working in parallel"**. Then read your
brief in `docs/sessions/<id>.md`.

Everything the user sees is **Vietnamese**, also for Switzerland. Proper names keep their usual
spelling (Zürich, Luzern, Montreux). **Never invent** coordinates, facts or licences: every
coordinate and fact needs a source you actually read.

---

## 0. Set up (once)

- Work on your own branch: `dest/<id>` (ideally a git worktree, so parallel sessions don't share
  a working folder).
- In a new worktree, git-ignored inputs are missing. Before the map steps, get the Natural Earth
  file only if you need it (you normally don't). For the local map, the `fetch` step downloads the
  OSM extract.
- Dev server: `python -m http.server 5520` (or VS Code Live Server). Python's server lets browsers
  cache CSS/JS, so hard-refresh after edits.
- Your URLs: `#/<country>/<id>` and `#/<country>/<id>/<location-id>`. Country ids: `viet-nam`,
  `thuy-si`.
- Allowed downloads (owner approval 2026-11-08):
  - one Overpass extract for your area;
  - single photos from **Wikimedia Commons, Flickr, Unsplash, Pexels** that pass the licence rules
    (step B4/B4b);
  - Wikidata / OSM / Wikipedia pages for research.

  Ask the owner before downloading from any other source.

## A. Research and proposal (no building yet)

1. **Facts about the place.** Its region, administrative status after Vietnam's 2025 merger
   (63 → 34 provinces) if relevant, and what it is known for. Verify everything you state.
2. **Choose 5–8 locations** with a mix of categories (`data/categories.json`: `attraction`,
   `nature`, `food`, `culture`, `history`, `market`, `experience`). Include **at least 2 food
   locations**.
   - A dish is pinned at one verified, long-running place that serves it, or at a food market, with
     `venue` `{name, address}`.
   - The text says it is "một địa chỉ tiêu biểu", not "the best".
   - Pin only places with a recent OSM `check_date`, or confirm they still operate.
3. **Coordinates** for each location from OpenStreetMap (Overpass/Nominatim, record the id) and/or
   Wikidata P625 (record the QID). If two sources disagree by more than 200 m, record both and
   explain your choice.
4. **1–3 short verified facts** per location (opening year, height, length…), each with its
   source URL. Opening hours and prices only if verified, with a check date. Otherwise leave
   them out.
5. **Map area.**
   - `bbox`: all locations plus a margin. Keep it reasonably small, because the extract size grows
     with area.
   - `coreBbox`: the dense centre, where residential streets are included. Keep it small.
   - `initialView`: what the first view shows.
   - A far-away location (e.g. Bà Nà, 26 km) is fine: an off-screen hint pill points to it.
6. **Photo plan** (owner rules):
   - **≥ 5 destination (cover) photos.**
   - **≥ 3 per location**, and **≥ 3 per food location**. Generic dish photos tagged
     "Ảnh minh họa" (`"illustrative": true`) count.
   - **Up to 10** for food, beach and mountain/forest places.
   - **Wikimedia Commons first** (CC0, public domain, CC BY, CC BY-SA).
   - If Commons can't meet a minimum, use **Flickr** (CC0, Public Domain Mark, CC BY, CC BY-SA,
     CC BY-NC, CC BY-NC-SA; **never ND or "All rights reserved"**), **Unsplash** or **Pexels**
     (step B4b).
   - Vietnam has no freedom of panorama since 2023. For modern copyrighted works (new bridges,
     statues, modern buildings) use only files uploaded **before 2023**.
   - Switzerland: check `Commons:Copyright rules by territory/Switzerland` (freedom of panorama)
     before choosing photos of modern works, and note what you found.
   - If even these sources can't reach a minimum, list it as a gap and ask the owner (for example
     about their own photos). Never pad with unrelated photos.
7. **Write the proposal** in the "Proposal" section of your brief:
   - the locations table (Vietnamese name, category, lat/lon, source, facts);
   - the bbox values;
   - the photo plan with expected counts and gaps;
   - open questions.

   Then **stop and ask the owner to approve it** (use the question dialog). Don't build before
   approval.

## B. Build (after approval)

### B1. Destination file — `data/destinations/<id>/destination.json`

Replace the `planned` placeholder. Shape (see `da-nang`):

```json
{
  "id": "<id>", "countryId": "viet-nam", "name": "Hội An", "type": "city", "region": "trung",
  "status": "draft",
  "coordinates": { "lat": 0, "lon": 0, "source": "https://www.openstreetmap.org/node/…" },
  "bounds": [[minLat, minLon], [maxLat, maxLon]],
  "initialView": [[…], […]],
  "mapData": "assets/maps/<id>.geojson",
  "mapAttribution": "© <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener\">OpenStreetMap</a>",
  "mapLabels": [{ "text": "Sông Hoài", "kind": "water", "lat": 0, "lon": 0 }],
  "summary": "One Vietnamese sentence.",
  "images": [{ "photo": "<id>-01", "alt": "…" }],
  "locationIds": ["<id>-…"],
  "sources": ["…"]
}
```

- `region`: `bac` | `trung` | `nam` for Vietnam; `null` for Switzerland.
- `bounds` **must equal** the `bbox` in `map-config.json` (same values, in lat/lon order). The map
  is locked to this area.
- `mapLabels` kinds: `water`, `sea` and `area`. Positions are cartographic text placements.
- Keep `"status": "draft"` while building (it stays hidden). Switch to `"published"` only when B6
  passes.

### B2. Local map

1. Write `data/destinations/<id>/map-config.json`:
   `{ "bbox": [minLon, minLat, maxLon, maxLat], "coreBbox": [...], "riverLabels": ["Sông …"] }`.
   Note that this is **lon/lat order**, unlike `bounds`.
2. Run `node tools/build-local-map.mjs <id> fetch` **once** (Overpass is a shared free service).
3. Run `node tools/build-local-map.mjs <id> build` → `assets/maps/<id>.geojson`.
   - Target **≤ ~1.5 MB**. If it's bigger, shrink `coreBbox` or `bbox` and rebuild. Re-fetch only
     if the bbox grew.
   - Inland areas (no sea coast) automatically get the whole area as land; lakes and rivers come
     from OSM water polygons.
4. Look at it in the browser. Check land vs. sea, rivers or lakes, roads, and labels. A wrong land
   or sea fill means a coastline problem: report it, don't hack the tool.

### B3. Locations — `data/destinations/<id>/locations.json`

- **Every location id is `<id>-<slug>`** (e.g. `hoi-an-chua-cau`). That keeps ids unique across
  parallel sessions. Photo ids derive from it.
- Shape as in `da-nang/locations.json`:
  - `id`, `destinationId`, `name`, `category`, `tags`;
  - `coordinates {lat, lon, source, wikidata?, note?}`;
  - `summary`: **one sentence**;
  - `facts [{label, value}]`: short lines;
  - `venue` for food;
  - `images`, `audio: null`, `sources`, `status: "published"`;
  - optional `mapsQuery` if the name alone finds the wrong place on Google Maps.

### B4. Photos

1. Add `candidateSources` to `data/destinations/<id>/photo-selection.json`:
   `{"cover": {"cats": ["Category:…"], "search": ["…"], "min_w": 1800, "pre2023": true}, "<location-id>": {…}}`.
2. Run `python -I tools/commons_candidates.py <id> <scratch-dir> <place> [<place>]`.
   - Do one or two places per run, because Commons rate-limits.
   - It writes a numbered contact sheet per place. **Look at it**, and read titles and descriptions
     in `candidates.json`.
3. Put the chosen file names into `photo-selection.json` (`cover`, `locations.<location-id>`), in
   gallery order: the best photo first.
4. Run `python -I tools/photos.py <id> meta`. Every line must say `OK`; drop `REJECT` and `MISSING`
   files.
5. Run `python -I tools/photos.py <id> download`, then `python -I tools/photos.py <id> build`.
6. **Check every built photo yourself** (make a contact sheet from the `-400.webp` files). It must
   show the right place: Commons categories sometimes mix places. Write a short Vietnamese `alt`
   for each, describing only what is visible. Set `"illustrative": true` on generic dish photos.

### B4b. Photos from Flickr, Unsplash or Pexels (when Commons isn't enough)

1. Search the site in the browser. On Flickr, use the licence filter; Unsplash and Pexels photos all
   carry their site licence. Pick single photos; no bulk downloading.
2. **Open each photo's own page and read the licence there.**
   - Flickr shows it under the photo (e.g. "Some rights reserved" → CC BY 2.0).
   - Allowed: CC0, Public Domain Mark, CC BY, CC BY-SA, CC BY-NC, CC BY-NC-SA.
   - **Reject** anything with ND / "NoDerivs" and "All rights reserved".
3. **Unsplash/Pexels location tags are typed by users:** accept a photo only if it visibly shows
   the place (a recognisable landmark, or matching your verified Commons photos). Dish photos can
   be generic and get `"illustrative": true`.
4. Add an **object entry** to the place's list in `photo-selection.json`, in gallery order:
   ```json
   {"source": "flickr", "page": "https://www.flickr.com/photos/<user>/<id>/",
    "file": "https://live.staticflickr.com/…_b.jpg", "creator": "Name as shown",
    "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "checked": "YYYY-MM-DD"}
   ```
   - `file` is the direct image URL. Prefer one about 2000–2400 px wide (Flickr "Large"/"_b" or
     bigger; Unsplash/Pexels `?w=2400`).
   - Unsplash: `"license": "Unsplash License"`, `"licenseUrl": "https://unsplash.com/license"`.
   - Pexels: `"license": "Pexels License"`, `"licenseUrl": "https://www.pexels.com/license/"`.
5. Run `photos.py <id> meta`. It validates these entries (source host, allowed licence, required
   fields) and prints `OK`/`REJECT`. Then run `download` and `build` as usual.
   - The credits page shows the source name.
   - NC photos are flagged "chỉ dùng phi thương mại".
6. Check each photo visually as in B4 step 6.

### B5. Text rules (owner: images first, text short)

- Summary: one sentence.
- Facts: 0–4 short lines.
- No essays, no "best", nothing unverified.
- Natural Vietnamese with correct diacritics.

### B6. Test, then publish

1. Set `"status": "published"` and fill `locationIds`.
2. In the browser, at **1440 × 900** and **390 × 844** (iPhone 13), go through:
   - world → country → your pin → destination (fly-in lands, the local map fades in, the map
     can't be dragged outside the area);
   - each location: gallery swipe, thumbnails, full-screen viewer, credits line, Google Maps
     button;
   - back at each level;
   - the category chips;
   - the "Nguồn ảnh & bản quyền" page (your photos are listed).
3. The console must have no errors.

## C. Finish

1. Update your brief:
   - **Status log** (dated lines);
   - **Result** (what works, photo counts, known gaps);
   - **Requests for the main session**, if any.
2. Commit **only your own paths** on `dest/<id>`:
   ```bash
   git add data/destinations/<id> assets/destinations/<id> assets/maps/<id>.geojson docs/sessions/<id>.md
   ```
   Use a clear message ending with the co-author line. **Don't push and don't merge** unless the
   owner asks.
3. Report to the owner: what works, the photo counts against the minimums, gaps, and decisions
   needed.

## Things not to do

- Don't edit shared files (see `CLAUDE.md` → "Working in parallel"), other destinations, or
  `CLAUDE.md`.
- Don't use Google Images, Google Maps photos, social media or blog photos, or any source other
  than Commons, Flickr, Unsplash and Pexels (unless the author gave written permission, recorded
  with the owner's OK).
- Don't add coordinates "by eye" from a map.
- Don't re-run Overpass fetches or Commons candidate searches in loops.
