# Travel atlas (Việt Nam, Thụy Sĩ) — instructions for Claude sessions

Read this file first in every session. Then read:
- `docs/SPEC.md` — the owner's full original specification plus dated amendments (authoritative).
- `docs/phase-0-proposal.md` — the Phase 0 research and architecture proposal.
- **Destination session?** If you were started to build one destination, read
  `docs/PLAYBOOK-destination.md` (how to build any destination) and your brief
  `docs/sessions/<destination-id>.md`. Follow "Working in parallel" below strictly.

The **main session** (integration, shared code) updates the **Status and decision log** at the end
of this file. **Destination sessions never edit this file**; they log progress in their own brief.

## What this is

A static, offline, interactive "digital travel atlas" with four levels:
world (pick a country) → country overview map → destination local map → location detail (real
photos, Vietnamese text). Countries: **Việt Nam** and **Thụy Sĩ** (Switzerland), added 2026-11-08.
All UI and text are Vietnamese, for Switzerland too. It is NOT a booking site, blog, Google Maps
clone, game or VR app.

## Hard rules

- **Vietnamese only** in everything the user sees: UI labels, categories, descriptions, alt text,
  error messages, audio. Natural, fluent Vietnamese with correct diacritics (Unicode NFC).
  Code identifiers, filenames, comments and technical docs stay in English.
- **Stack:** HTML5, CSS3, vanilla JavaScript (ES modules), JSON data, SVG where useful,
  LocalStorage for favourites/preferences. No React/Angular/Vue, no backend, no database, no auth,
  no runtime external APIs, no API keys, no paid map services. Must run from a simple static
  server (e.g. VS Code Live Server locally, **GitHub Pages** in production) and work offline once
  assets are local.
  Node/Python may be used only as **build-time tools** (data extraction, image resizing, audio
  generation) and are never required to run the site.
- **Data-driven:** all content lives in `data/`. Adding a destination, location or country must need
  data and assets only, never a code change. Each destination owns its own folder (see "Project
  layout").
- **Never invent** coordinates, facts, opening hours, prices, image sources, authors or licenses.
  Every coordinate records its source (Wikidata QID / OSM id / URL). Every asset is in the asset
  manifest with source URL, creator, license, attribution. If something can't be verified or found,
  mark it `MISSING`/`UNVERIFIED` and report it; do not substitute.
- **Real photographs only.** No illustrations or AI-generated images of real places without the
  owner's explicit approval. No bulk scraping.
- **Map sovereignty:** maps must show Hoàng Sa and Trường Sa as part of Vietnam, labelled in
  Vietnamese (Hoàng Sa is a special zone, đặc khu, of Đà Nẵng since the 2025 reform).
- **Work phase by phase** (Phase 0 → 5 in the spec). Đà Nẵng was built first as the reference
  destination. Since 2026-11-08 the owner builds further destinations **in parallel sessions**, one
  per destination, each following `docs/PLAYBOOK-destination.md`. At the end of every phase or
  destination, report what works, what is incomplete, and which decisions need the owner, then
  wait for review.

## Target devices

Desktop, tablet and mobile. **iPhone 13 (iOS Safari) is a primary target**, so design and test
for it explicitly, not as an afterthought:
- Viewport 390 × 844 CSS px, device pixel ratio 3 (iPhone 13 / 13 Pro; the 13 mini is 375 × 812).
  Design mobile-first; verify at 390 × 844 in both portrait and landscape.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
  and pad fixed UI with `env(safe-area-inset-*)` for the notch and home indicator.
- Use `100dvh`/`100svh` (not `100vh`) for full-height layouts, because Safari's toolbars resize the
  viewport.
- Touch-first: tap targets at least 44 × 44 pt; nothing that only works on hover; one-finger pan
  and pinch-zoom on maps; the page itself must not zoom or scroll when the user drags the map.
- Mobile layout: map full-screen; category filters as a horizontally scrollable chip row; the
  location detail opens as a bottom sheet / full-screen view with swipeable photos and a clear
  "back to map" control.
- Audio only starts on a user tap (iOS autoplay policy); controls must be thumb-reachable.
- Images: responsive `srcset`, with a version about 1170 px wide for full-width photos on a 3×
  screen, and lazy loading. Keep file sizes small for mobile data and storage.
- Test with Safari's responsive mode or Chrome DevTools at 390 × 844 during development, and on the
  real iPhone 13 through the GitHub Pages URL (or Live Server's LAN address before deploying).

### Layout and position per device

| Element | PC (desktop ≥ 1024 px) | iPhone 13 portrait (390 × 844) | iPhone landscape / tablet |
|---|---|---|---|
| Map | Fills the window | Full screen, edge to edge under the notch | Full screen |
| Top bar (title, back, search) | Top-left, compact | Top, inside `safe-area-inset-top`; back button on the left, at most one line of title | Top, compact |
| Region / category filters | Row under the top bar, or left rail | Horizontally scrollable chips under the top bar | Chips under the top bar |
| Location detail | Right-side panel (~40% width, max ~560 px); map stays visible and interactive | Bottom sheet with peek → half → full states; swipe down to close | Right-side panel |
| Photo gallery | Large image with thumbnails; arrow keys | Full-width swipeable images; tap opens full-screen view | Swipeable |
| Audio player | Inside the detail panel | Sticky at the bottom of the sheet, above `safe-area-inset-bottom` (home indicator) | Inside the panel |
| Map zoom controls | Visible +/− buttons | Hidden; pinch to zoom (keep a "re-centre" button within thumb reach, bottom-right) | Pinch to zoom |
| Attribution (©OSM, photo credits) | Small, bottom-right of the map | Small, bottom-left, above the safe area; full credits on a "Nguồn ảnh & bản quyền" page | Same as iPhone |

Put the most-used controls (back, filters, play/pause) where the thumb can reach them. Never put
anything interactive under the notch, the Dynamic Island area, or the home indicator.

## Hosting and deployment

- The site will be **published on GitHub Pages** (static, HTTPS) and used from a PC and an iPhone 13
  through that URL. Owner decision, 2026-11-08.
- **Offline:** because Pages is HTTPS, a service worker can cache the app shell, data, map GeoJSON,
  images and audio, so the site keeps working without a connection after it has been opened once.
  The owner can also add it to the iPhone home screen (standalone display through a web app
  manifest).
- **Relative URLs only.** A Pages project site is served under `/<repo-name>/`, so never use
  root-absolute paths (`/data/...`). Use `./data/...`, and make the service-worker scope relative
  to the site.
- **Paths are case-sensitive on Pages**, although Windows is not. Use lowercase kebab-case filenames
  and reference them exactly.
- **Keep the repository and site small.** Commit only resized web images (not the originals),
  compressed audio and trimmed GeoJSON. GitHub Pages limits apply: sites up to about 1 GB, and a
  soft bandwidth limit. Keep originals and build caches out of git with `.gitignore`.
- **The site is public**, so licence compliance is visible.
  - Ship an attribution page in Vietnamese, "Nguồn ảnh & bản quyền", listing every photo's author,
    licence and source link, with "© OpenStreetMap contributors" and the ODbL notice for the
    local map data, and credits for the narration voice and the libraries.
  - CC BY-SA photos that are cropped or resized are adaptations and stay CC BY-SA. Note "đã chỉnh
    sửa kích thước" in the credit.
- **Git:** the repository is `https://github.com/haovt/personal-travel` (remote `origin`, branch
  `main`). Commit and push only when the owner asks. Destination sessions commit only to their own
  branch (`dest/<destination-id>`) and never push to or merge into `main`; the owner (or the main
  session, when asked) merges them. Commit messages end with the co-author line from the harness.
  `.gitattributes` keeps LF line endings.

## Project layout

```text
index.html
css/      main.css, map.css, details.css, animations.css, fonts.css
js/       app.js (levels + routing glue), router.js, data.js, map-core.js,
          world-map.js, country-map.js, local-map.js, offscreen-hints.js,
          panel.js (top bar, chips, sheet), gallery.js, credits.js
data/     countries.json        countries: map, bounds, Vietnamese texts, regions, labels, destination ids
          categories.json       location categories (shared)
          assets-manifest.json  shared assets (maps, fonts, libraries)
          destinations/<id>/    ONE FOLDER PER DESTINATION, owned by that destination's session:
            destination.json    the destination (status: planned | draft | published | reference)
            locations.json      its locations
            photo-selection.json  chosen Commons files (+ "candidateSources" for the candidate finder)
            photo-credits.json  GENERATED by tools/photos.py
            map-config.json     local map bbox / coreBbox / riverLabels
assets/   maps/world.geojson, maps/country-<country>.geojson, maps/<destination-id>.geojson
          destinations/<id>/cover/…, destinations/<id>/<location-id>/…   (WebP photos)
          fonts/, icons/
vendor/   leaflet/ (1.9.4, BSD-2)
tools/    build-time only: build-country-map.mjs, build-local-map.mjs, photos.py,
          commons_candidates.py
docs/     SPEC.md, phase-0-proposal.md, PLAYBOOK-destination.md, sessions/<id>.md
source-assets/  originals and caches (git-ignored): naturalearth/, osm/, commons/<destination-id>/
```

Routes: `#/` world · `#/<country>` · `#/<country>/<destination>` · `#/<country>/<destination>/<location>`
· `#/nguon-anh` credits. Country ids: `viet-nam`, `thuy-si`.

## Working in parallel (destination sessions)

Each new destination is built in its **own session, on its own branch** (`dest/<id>`, ideally a
separate git worktree). To keep the sessions from conflicting:
- **Write only inside your own paths:** `data/destinations/<id>/`, `assets/destinations/<id>/`,
  `assets/maps/<id>.geojson`, `source-assets/…/<id>…`, and your brief `docs/sessions/<id>.md`.
- **Do not edit shared files:** `js/`, `css/`, `index.html`, `tools/`, `data/countries.json`,
  `data/categories.json`, `data/assets-manifest.json`, `CLAUDE.md`, `docs/SPEC.md`,
  `docs/PLAYBOOK-destination.md`, or other destinations' folders. (`countries.json` already lists
  every planned destination id.)
- If you find a bug or need a shared change (a new category, a tool option, a CSS fix), **don't make
  it**. Describe it under "Requests for the main session" in your brief, and work around it if
  possible.
- Status log: write progress and decisions in the "Status log" section of your brief, not here.

## Status and decision log

| Date | Item |
|---|---|
| 2026-11-08 | Spec received and saved to `docs/SPEC.md`. |
| 2026-11-08 | Owner chose **Đà Nẵng** as the single first destination. |
| 2026-11-08 | Owner added **iPhone 13 / mobile** as a primary target. |
| 2026-11-08 | Owner decided **hosting on GitHub Pages**, used from a PC and an iPhone 13. iPhone offline use will be done with a service worker (see "Hosting and deployment"). |
| 2026-11-08 | Phase 0 research complete. Proposal written: `docs/phase-0-proposal.md`. |
| 2026-11-08 | **Owner decided all 8 Phase 0 questions** (see "Owner decisions" below). |
| 2026-11-08 | Phase 1 implemented (see "Phase 1 status" below). During Phase 1 the owner also chose a Google-like map style and a Vietnam-only overview (no neighbouring countries). Owner said "Start Phase 2". |
| 2026-11-08 | Phase 2 implemented (see "Phase 2 status"); area lock added at owner's request. Owner said "Start Phase 3". |
| 2026-11-08 | Phase 3 implemented (see "Phase 3 status"). The owner asked about using Google Images: answered no, since search results aren't licences. Possible wider sources are listed under Phase 3 status. |
| 2026-11-08 | Phase 3 extended (see "Phase 3 extension"): 48 photos, a wider photo-first detail view, and a Google Maps link. |
| 2026-11-08 | **Owner: new destinations.** Việt Nam: Đà Lạt, Vũng Tàu, Cần Giờ, Hội An, Vịnh Hạ Long, Ninh Bình, Nha Trang. Thụy Sĩ: Zürich, Luzern, Montreux (Lake Geneva). Same site with a country picker; Vietnamese for Switzerland too; git set up with `haovt/personal-travel`. |
| 2026-11-08 | **Owner approved extra photo sources:** Flickr (CC, NC allowed for this non-commercial site, never ND), Unsplash, Pexels (see "Approved photo sources"). `tools/photos.py` accepts object entries for them, and the credits show the source and Vietnamese licence labels. Google Maps/Images photos stay forbidden. |
| 2026-11-08 | **Faster, polite photo tools:** `tools/wm_http.py` puts all Wikimedia traffic from all sessions/worktrees through one paced queue (lock in `.git/livetravel-locks`, Retry-After back-off, User-Agent with the repo URL). `commons_candidates.py` caps files per place, caches API results, draws smaller sheets and keeps relevance order. A candidate run for one place takes ~10 s, down from 11+ min. |
| 2026-11-08 | **Merged `dest/da-lat` and `dest/zurich`** (8 locations each, published). The owner chose to trim both to 3 photos per place: 60 → 27 and 61 → 27, renumbered 01–03 with selection and credits kept consistent. Main-session fixes from their requests: map tools work in paths with spaces (`fileURLToPath`), wiki signature timestamps are stripped from authors, `__pycache__` is untracked, and B4b documents manual browser downloads for Flickr files that refuse scripts. Also fixed: jumping directly between destinations (history or links) kept the old area lock. Known cosmetic (Đà Lạt): on phones the pins sit near the top because the bbox's north edge is close to the city. |
| 2026-11-08 | **Owner: at most 3 photos per place** (destinations and locations), aiming for exactly 3, to cut download time. Replaces the ≥ 5 / up to 10 rules. |
| 2026-11-08 | **Restructured for parallel work** (commit `10b0116`): world level, `data/countries.json`, one folder per destination, per-destination tools, and `status: "planned"` placeholders for the 10 new destinations. Playbook and session briefs in `docs/`. **Next:** the owner starts one session per brief; the main session later merges branches and continues Phase 4 (search, favourites, featured, related places/food) and Phase 5 (offline, Pages). |

### Phase 3 extension (2026-11-08): more photos, wider detail, Google Maps link

- **Wider detail view.** Desktop: `body.is-detail` sets `--panel-width: clamp(560px, 56vw, 980px)`
  for both the panel and the top bar. The photo is 58vh tall, with a thumbnail strip, and the
  text below is in two columns on screens ≥ 1100 px. Phones: the detail sheet is up to 86dvh,
  with a thumbnail strip when there are more than 2 photos.
- **"Xem trên Google Maps"** link on every location (see "Photo source decision").
- **Photos are now 48:** Mỹ Khê 10, Ngũ Hành Sơn 10, Bà Nà 10, and 3 each for Cầu Rồng,
  Chùa Linh Ứng, Bảo tàng Chăm and Chợ Cồn.
  - New files were picked visually from contact sheets made by
    `python -I tools/commons_candidates.py <destination-id> <out_dir> [place…]`. It filters by licence, size and
    aspect, and accepts only pre-2023 uploads where modern copyrighted works appear.
  - The tool is slow because Commons rate-limits it. The owner stopped it mid-run.
- **Known gaps, accepted by the owner for now ("use what we have"):**
  - Đà Nẵng destination: 2 photos (rule now: 3).
  - Mì Quảng: 2 (rule: ≥ 3).
  - Bún chả cá: 2 (rule: ≥ 3).
  - Fill these later with a quick targeted Commons pass, or ask the owner about another source.

### Phase 3 status (2026-11-08)

Works. Tested in the in-app browser at 1440 × 900 and 390 × 844. Not yet on a real iPhone.
- **Photos:** 27 real photos from Wikimedia Commons (2–4 per location, 2 for the destination).
  - Pipeline: `tools/photo-selection.json` → `python -I tools/photos.py meta | download | build`.
  - The `meta` step reads each file's licence and author from the Commons API. Only CC0, public
    domain, CC BY and CC BY-SA are downloaded, one at a time, at most 2,400 px wide.
  - Output: WebP at 400/800/1200/1800 px in `assets/locations/<id>/NN-<w>.webp` and
    `assets/destinations/<id>/`, about 11.8 MB in total.
  - Credits per photo in `data/photo-credits.json` (generated, don't edit by hand).
  - Originals stay in `source-assets/commons/` (git-ignored).
  - Every photo was checked visually on a contact sheet. Notes: Bà Nà #1 shows the flower gardens,
    not Cầu Vàng. Both bún chả cá photos are generic and flagged `illustrative: true`, so they
    show an "Ảnh minh họa" tag.
- **Data:** each location has `images: [{photo, alt, illustrative?}]` (gallery order,
  Vietnamese alt text) and `facts: [{label, value}]`, which are short fact lines from verified
  sources only. Summaries are one sentence. The destination has `images` too.
- **Detail view** (`js/gallery.js`, `css/details.css`): photos first.
  - A swipeable scroll-snap gallery with a counter and a per-photo credit line (author →
    source link, licence → licence link). Arrows appear on desktop hover.
  - Below it: category · destination, the title, the one-line summary and the fact list.
  - Tapping a photo opens a full-screen viewer (swipe, arrow keys, Esc, safe-area aware).
  - On phones the detail sheet is up to 78dvh tall; on desktop the panel is 420 px wide.
  - The open location is re-centred above the sheet after a resize, rotation or sheet toggle.
- **Lists:** destination and location cards show photo thumbnails with a category dot.
- **Credits page** `#/nguon-anh` (`js/credits.js`): every photo with thumbnail, author, licence
  link, "đã thu nhỏ kích thước" and a link to the original. Also map data (Natural Earth;
  OpenStreetMap ODbL), fonts (OFL) and Leaflet (BSD-2).
  - Linked from the map attribution ("Nguồn & bản quyền") and the overview sheet.
  - Back returns to the map view underneath.
- **Attribution:** shortened to "Nguồn & bản quyền | © OpenStreetMap" (the OSM part only while
  the local map is shown). Natural Earth and Leaflet are credited on the credits page.
- **Fix:** `viewPadding` now treats any sheet wider than 80% of the screen as a bottom sheet;
  previously the tall detail sheet was mistaken for a side panel.
- **No audio** (owner decision). The `audio` field stays `null`.
- **Wider photo sources** if the owner wants more choice:
  - Flickr photos under CC BY or CC BY-SA, checked on the Flickr page.
  - Unsplash or Pexels, only when the place is visually confirmed.
  - The owner's own photos, or photos used with a photographer's written permission.
  - Never Google Images results as such.

### Phase 2 status (2026-11-08)

Works. Tested in the in-app browser at 1440 × 900 and 390 × 844. Animations were checked with
the pane visible. Not yet tested on a real iPhone.
- **Local map:** `assets/maps/da-nang.geojson` (1.48 MB, ≈ 232 kB gzipped), from one Overpass
  extract (`source-assets/osm/`, git-ignored) via `node tools/build-local-map.mjs da-nang`.
  - Land is built by joining OSM coastlines (land on the left) and closing them along the bbox.
  - Contents: water, rivers, parks/forest/protected areas, the airport, and roads from motorway
    to tertiary everywhere. Residential streets only in the centre (lat 16.03–16.09,
    lon 108.19–108.26).
  - Labels: OSM suburb, peak and river names, plus `mapLabels` from `destinations.json`
    (Vịnh Đà Nẵng, Biển Đông, Bán đảo Sơn Trà).
  - Drawn on canvas in a Google-like style; road widths scale with zoom, and minor roads appear
    from z13.5.
  - Credit: "Dữ liệu bản đồ © OpenStreetMap" in the attribution while the local map is active.
- **9 locations** in `data/locations.json`, with approved coordinates and sources. Summaries use
  only facts verified in Phase 0. `sections`, `images` and `dishes` are empty until Phase 3.
- **Pins:** category-coloured teardrop pins. Name labels use collision-aware layout (right, then
  left, never off screen); the active pin gets priority.
- **Category chips:** only the categories present. They filter pins and the sheet list (with
  count) and are remembered per destination in `sessionStorage`.
- **Off-screen hint pills** for filtered locations outside the view (e.g. Bà Nà, about 27 km
  away); tapping one flies there. Pills that would overlap a nearer one are dropped.
- **Area lock** (`createAreaLock` in `map-core.js`, added at the owner's request):
  - Once a flight lands on a destination or location, the map can't be panned past the
    destination's `bounds` (= the OSM data bbox).
  - It also can't be zoomed out further than the zoom where that area fills the screen, e.g.
    12.5 on iPhone 13. This avoids empty blue areas that look like sea.
  - Recomputed on resize. Removed before flying back to the overview.
  - Leaving the destination is only via ← or browser back, not by zooming out.
  - While a finger is still dragging, only a pre-rendered margin of about 40% of the viewport
    exists (Leaflet canvas `padding: 0.4`); the rest draws on release. This is intentional for
    iPhone memory.
- **Routes:** `#/da-nang/<locationId>` opens a location preview in the sheet: category, name,
  venue and address for food, summary, and a "sẽ được bổ sung" notice. Back returns to the
  destination's previous view; back again returns to the overview's previous view.
- **Transition:**
  - The local layer cross-fades in only after the flight lands (`zoomend`). During a flight,
    the canvas still holds geometry simplified for the starting zoom.
  - On the way back, the local layer fades out at the start and is removed after landing.
  - The Vietnam outline has no stroke, because an SVG stroke scales into a thick band
    mid-flight.
  - Known cosmetic issue (Phase 5): mid-flight the country shape looks soft and blurry.
- **Dev notes:**
  - Python's `http.server` lets browsers cache CSS/JS heuristically. After edits, hard-refresh,
    or use Live Server.
  - `window.__vv` is a debug handle on localhost only.
- **Files added:** `js/local-map.js`, `js/offscreen-hints.js`, `data/locations.json`,
  `assets/maps/da-nang.geojson`, `assets/icons/favicon.svg`, `tools/build-local-map.mjs`.
- **Data bbox:** extended north to 16.17 (from the proposal's 16.110) so the whole Sơn Trà
  peninsula is drawn. Location coordinates are unchanged.

### Phase 1 status (2026-11-08)

Works, tested at 1440 × 900 and 390 × 844 in the in-app browser (not yet on a real iPhone):
- Overview map from local GeoJSON (Natural Earth VNM POV, 38 kB), Vietnam only, flat road-map
  palette. Hoàng Sa (7 islands) and Trường Sa (12 + Đảo Trường Sa Lớn) appear as visible dots with
  Vietnamese labels; sea labels Biển Đông, Vịnh Bắc Bộ, Vịnh Thái Lan.
  - Verified: the VNM POV file puts both island groups inside Vietnam's own polygon.
  - Natural Earth 10m lacks Đảo Trường Sa Lớn, so it was added from Wikidata Q3273381.
- Đà Nẵng pin (clickable). Hà Nội and TP. Hồ Chí Minh are grey reference labels (Wikidata Q1858,
  Q1854).
- Region chips (Tất cả / Miền Bắc / Miền Trung / Miền Nam) dim other places and fly to the
  region; the choice persists in `sessionStorage`.
- Hash routing `#/` and `#/da-nang`; the top-bar back button and browser back both work; the
  overview view is restored on return; deep links work.
- Layout: side panel on desktop. On phones, a bottom sheet that starts collapsed in portrait,
  with a handle to expand. Respects safe areas. Zoom buttons are hidden on touch devices.
- Until a destination has `assets/maps/<id>.geojson`, entering it flies only to zoom 7.5,
  because the country outline is too coarse for city zoom. The sheet then shows a "đang được
  hoàn thiện" notice. Phase 2 removes both.

Files: `index.html`; `css/{fonts,main,map,animations}.css`;
`js/{app,data,router,map-core,vietnam-map,panel}.js`;
`data/{destinations,regions,categories,map-labels,assets-manifest}.json`;
`assets/maps/vietnam.geojson`; `assets/fonts/*`; `vendor/leaflet/*`;
`tools/build-vietnam-map.mjs`; `.claude/launch.json` (dev server:
`python -m http.server 5520`, dev only).

Deviations from the proposal:
- Navigation is split into `router.js` and `panel.js`; map helpers live in `map-core.js`.
- Island labels have no province suffix, because "(Khánh Hòa)" for Trường Sa is still unverified.
- All 15 font subset files are loaded. Trim the unused weights in Phase 5.

### Content style decision (2026-11-08, after Phase 2), binding

**Images first, text short.** Users prefer photos over reading.
- Location detail: a large photo gallery is the main content and comes first. Text comes after it
  and stays brief: a one-sentence summary, then at most 2–3 short sections of 1–3 sentences each,
  or a few compact fact lines (e.g. "Khánh thành: 29/3/2013", "Dài: 666 m").
- No long essays and no history lectures. Cut anything that isn't interesting at a glance.
- Map previews and list items: name, category and one short line at most.
- Still factual and sourced, as before. Short does not mean invented.
- **Photo counts (owner, updated 2026-11-08, because downloading photos is the bottleneck):**
  **at most 3 photos for every place**, both destinations (cities) and locations. Aim for exactly
  3; use fewer only when no more suitable licensed photos exist, and report that as a gap.
  - Food locations also get 3; generic dish photos tagged "Ảnh minh họa" count.
  - If Commons can't supply 3, use the approved extra sources below (Flickr, Unsplash, Pexels)
    before accepting fewer. Never pad with unrelated photos.
  - This replaces the earlier "≥ 5 per destination" and "up to 10" rules. Đà Nẵng's existing
    10-photo galleries (Mỹ Khê, Ngũ Hành Sơn, Bà Nà) were already downloaded and stay as they are
    (owner confirmed 2026-11-08).
- **Approved photo sources (owner, 2026-11-08):**
  1. **Wikimedia Commons** first: CC0, public domain, CC BY, CC BY-SA.
  2. **Flickr**, when Commons can't meet a minimum or a much better photo exists. Licences:
     CC0, Public Domain Mark, CC BY, CC BY-SA, CC BY-NC, CC BY-NC-SA.
     - NC is acceptable only because this site is personal and non-commercial; such photos are
       flagged `nonCommercialOnly` and must be removed if that ever changes.
     - **Never ND ("NoDerivs")** (we resize/crop) and never "All rights reserved".
  3. **Unsplash** (Unsplash License) and **Pexels** (Pexels License).
     - Their location tags are typed by users: use a photo only when the place is **visually
       confirmed** (a recognisable landmark, or matching other verified photos).
     - Credit the photographer anyway.
  - Read the licence on each photo's own page; never assume. Record it in `photo-selection.json`
    as an object entry (see `tools/photos.py`). Download single files only, never bulk.
  - The Vietnam freedom-of-panorama rule still applies whatever the source: photos of modern
    copyrighted works must be published before 2023.
  - Still **not allowed**: Google Images, Google Maps photos, social media or blog photos, unless
    the author gave written permission (record it).
- **Photo source decision (owner, 2026-11-08):** photos stay **local and licensed**.
  - **Never** load Google Maps / Google Places photos into the site: that needs an API key with
    billing in public code, Google's terms bar Places content next to a non-Google map, and
    caching isn't allowed, so offline use would break.
  - Instead, each location has a **"Xem trên Google Maps"** link: a Google Maps URL
    (`https://www.google.com/maps/search/?api=1&query=…`, no API key). It opens Google Maps in a
    new tab or in the app, where the user can browse that place's own photos and reviews.
  - The query is `mapsQuery` if set; otherwise the venue name (or place name), the address if
    any, and the destination name.
- **The location detail view is the main focus:** a wide panel on desktop (the gallery
  dominates, the map shrinks beside it) and nearly full-screen on phones.

### Map style decision (2026-11-08, during Phase 1), binding

The owner wants the **map style to look like a default Google Maps road map**: flat vector
cartography, no satellite imagery, no terrain or "earth" rendering. This replaces the "warm paper
atlas" map styling in section 6 of the proposal. The rest of the editorial design (detail views,
typography, photos) is unchanged.
- **Palette:** land light grey `#f1f3f4` (neighbouring countries the same, with grey borders);
  water light blue `#aadaff`; parks/forest soft green `#c8e6c9`; minor roads white with a light grey
  casing; main roads pale yellow `#fde293` with an amber casing. Country border: dark grey
  `#9aa0a6`, dashed for disputed sea areas if any are drawn.
- **Labels:** dark grey `#3c4043` text with a white halo; cities a bit bolder; sea/island names
  in blue-grey italics (e.g. "Biển Đông", "Quần đảo Hoàng Sa").
- **Markers:** Google-like teardrop pins coloured by category, with a white glyph.
- No Google logos, fonts, icons or tiles. It is a look-alike palette built from our own data, not
  a clone. The spec's "not a Google Maps clone" refers to features (no routing, no search of
  businesses).
- **Vietnam only (2026-11-08):** the overview map shows **no neighbouring countries** and no
  country-name labels. Only Vietnam's land, its islands, sea and island-group labels, on the water
  colour. The owner accepted that land borders then read like coastline. Set
  `INCLUDE_NEIGHBOURS` in `tools/build-vietnam-map.mjs` to bring them back.
- Phase 2: the Đà Nẵng OSM extract needs enough road classes for this look (motorway → tertiary,
  plus named residential streets in the centre if the size allows).

### Owner decisions (2026-11-08), binding

1. **Map:** Leaflet 1.9.4 with local GeoJSON and no tiles. Natural Earth 10m Vietnam-POV outline
   for Level 1; a one-time OSM extract for Đà Nẵng at Level 2.
2. **Đà Nẵng scope:** the city core plus Bà Nà Hills. Bounding box lat 15.985–16.110,
   lon 107.985–108.290. Hội An and Mỹ Sơn will be separate destinations later.
3. **Locations (9, approved):** Cầu Rồng, Bãi biển Mỹ Khê, Ngũ Hành Sơn (Thủy Sơn),
   Chùa Linh Ứng Bãi Bụt, Bảo tàng Điêu khắc Chăm, Bà Nà Hills – Cầu Vàng, Chợ Cồn,
   Mì Quảng (at Mì Quảng 1A), Bún chả cá (at Bún chả cá 109). Coordinates and sources are in
   section 4 of the proposal. Alternates are held in reserve.
4. **Narration: none in v1.** Build no TTS pipeline and download no voice model. Keep `audio`
   optional in the data model, and have the player appear automatically when an audio file is
   present, so narration can be added later without code changes.
5. **Food photos:** generic, freely licensed dish photos are allowed. Caption them as the dish
   only; never present them as the specific eatery or as taken in Đà Nẵng.
6. **Overview map:** Hà Nội and TP. Hồ Chí Minh are shown as small, non-clickable reference labels
   (verify their coordinates from Wikidata/OSM). Đà Nẵng is the only active pin.
7. **Downloads approved** for exactly the files named in the proposal: Leaflet 1.9.4, Natural
   Earth VNM POV, one OSM extract of Đà Nẵng (plus the OSM island relations if needed), the
   listed Commons photos one by one, and the Be Vietnam Pro and Noto Serif fonts. Record each in
   the asset manifest. **Ask before downloading anything else.**
8. **GitHub:** set it up later, after Phase 3. Until then, develop and test locally: the browser at
   390 × 844, and the iPhone through Live Server on the same Wi-Fi. Don't create a repo, commit
   or push until then, and only when the owner asks.

### Phase 0 findings so far (verify again before relying on them)

- **Map approach (leaning, not yet approved):** Leaflet 1.9.4 (BSD-2) with local GeoJSON and no tile
  layer.
  - Level 1: Vietnam outline from Natural Earth 10m admin-0 **Vietnam point-of-view** file
    `ne_10m_admin_0_countries_vnm` (public domain). UNVERIFIED: whether that file includes Hoàng Sa
    and Trường Sa in Vietnam's polygon; check `fclass_vn` at build time. If not, add them from the
    OSM claim relations 17296617 (Hoàng Sa) and 17296618 (Trường Sa), which are ODbL.
  - Level 2: a one-off OpenStreetMap extract of Đà Nẵng (coastline, rivers, main roads, landmarks),
    shipped under ODbL with the credit "© OpenStreetMap contributors".
  - Bulk or offline use of tiles from tile.openstreetmap.org is **prohibited** by the OSMF tile
    policy. GADM can't be redistributed. Open province boundaries mostly predate the 2025 reform,
    so don't draw province borders unless a current, licensed source is verified.
  - Alternative: Protomaps PMTiles with MapLibre gives a richer basemap but needs WebGL, HTTP Range
    support, and local glyphs/sprites.
- **2025 reform:** 63 provinces became 34 (Resolution 202/2025/QH15; the new local government
  started on 1 July 2025). Quảng Nam merged into Đà Nẵng, so Hội An (phường Hội An) and Mỹ Sơn are
  now in Đà Nẵng. Decision pending: whether the Đà Nẵng map covers only the old city area or the
  new merged city.
- **Narration:** no Vietnamese voice is installed on this PC.
  - Cleanest offline synthetic voice: Piper `vi_VN-vais1000-medium` (dataset CC BY 4.0; credit it).
  - Best overall: the owner records their own voice.
  - edge-tts sounds most natural but uses an online Microsoft service and its terms for publishing
    the output are unclear.
  - Avoid the Windows "An" voice, Piper 25hours_single (license unknown), and the
    non-commercial/research-only models unless the owner accepts those terms.

### Open decisions for the owner

None at the moment. All Phase 0 decisions are recorded above.

## How to resume in a new session

1. Read this file, then `docs/SPEC.md`, then `docs/phase-0-proposal.md` if it exists.
2. Find the latest row of the status log and the open decisions; continue from there. Don't redo
   finished research unless its facts need to be checked again.
3. Before implementing a phase, confirm the owner approved it (look in the log).
4. Record new decisions and verified facts in the log before ending the session.
