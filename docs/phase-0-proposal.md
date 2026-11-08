# Phase 0 — Research and Architecture Proposal (Đà Nẵng)

Status: **reviewed. The owner answered all section-10 decisions on 2026-11-08** (summary at the
end of this file; the binding record is in `CLAUDE.md`). No implementation has started.
Date: 2026-11-08. Scope: Vietnam overview map + one destination, **Đà Nẵng**.
Hosting: GitHub Pages; target devices are a PC and an iPhone 13 (see `CLAUDE.md`).

Every coordinate, fact and licence below comes from a source that was read during research
(Wikidata, OpenStreetMap, Wikipedia, Wikimedia Commons file pages, official licence pages).
Items that could not be verified are marked **UNVERIFIED**. Facts will be checked again against
their sources when the Vietnamese text is written (Phase 3), and every source is recorded in the
data files.

---

## 1. Summary of recommendations

| Topic | Recommendation |
|---|---|
| Map engine | **Leaflet 1.9.4** (BSD-2, ~40 kB gzipped), stored locally, **no tile layer**; local GeoJSON drawn with editorial styling |
| Vietnam outline | **Natural Earth 1:10m, Vietnam point-of-view file** (`ne_10m_admin_0_countries_vnm`, public domain), simplified at build time |
| Hoàng Sa / Trường Sa | Must appear as Vietnamese and be labelled in Vietnamese. Check whether the Vietnam-POV file already includes them; if not, add them from OSM relations 17296617 / 17296618 (ODbL) |
| Đà Nẵng local map | One-off **OpenStreetMap extract** (coastline, sea, Hàn river, main roads, green areas, labels), trimmed to a small GeoJSON, credited "© OpenStreetMap contributors" (ODbL) |
| Transition | **One Leaflet map instance** for both levels: `flyToBounds` from Vietnam to Đà Nẵng with a cross-fade of layers, so the zoom is continuous rather than a page change |
| Navigation state | Hash routes `#/`, `#/da-nang`, `#/da-nang/cau-rong`: browser back and iPhone swipe-back work, deep links work on GitHub Pages without server rewrites |
| Locations (v1) | 9 places: 6 sights + 3 food (section 4) |
| Photos | Wikimedia Commons, freely licensed files only. Prefer files uploaded **before 2023** for copyrighted modern works (Vietnamese freedom-of-panorama issue, section 5.2) |
| Narration | **Piper TTS, voice `vi_VN-vais1000-medium`** (dataset CC BY 4.0), generated offline at build time. Owner's own recordings can replace any file later |
| Offline | Service worker + web app manifest on GitHub Pages (HTTPS) |

---

## 2. Map implementation

### 2.1 Options evaluated

| Option | Verdict | Why |
|---|---|---|
| **A. Hand-built SVG maps** + own zoom/pan code | Not chosen | Fully local, but we would have to write projection, inertia, pinch-zoom, marker clustering and fly animations ourselves. Leaflet does all of that, reliably on iOS Safari. |
| **B. Leaflet + local GeoJSON, no tiles** | **Recommended** | Small, mature, touch-friendly, fractional zoom (`zoomSnap`), animated `flyTo`/`flyToBounds`, Web Mercator built in. Works from any static server. No API key, no network. |
| C. Protomaps PMTiles + MapLibre GL | Possible later | Gives a full street-level basemap, but needs WebGL, HTTP Range support, local glyphs/sprites/style, and is heavier. Extract size for Đà Nẵng is **UNVERIFIED**. Overkill for v1. |
| D. Pre-downloaded OSM raster tiles | **Not allowed** | The OSM Foundation tile policy prohibits bulk download and offline use of tile.openstreetmap.org. |
| GADM boundaries | **Not allowed** | Its licence does not permit redistribution. |

Sources: leafletjs.com/reference.html, github.com/Leaflet/Leaflet,
operations.osmfoundation.org/policies/tiles/, gadm.org/license.html, docs.protomaps.com.

### 2.2 Level 1 — Vietnam overview

- **Geometry:** Natural Earth v5.1.1 admin-0, 1:10m, **Vietnam point-of-view** variant
  (`ne_10m_admin_0_countries_vnm`). Natural Earth is public domain; POV files follow each
  country's de jure view. Neighbouring countries (China, Laos, Cambodia, Thailand) are drawn in a
  muted tone for context. Source: naturalearthdata.com/blog/admin-0-countries-point-of-views/.
- **UNVERIFIED, to check first in Phase 1:** whether the VNM POV polygon includes Hoàng Sa and
  Trường Sa (attribute `fclass_vn`). If it does not, add them from OSM claim relations
  17296617 (Hoàng Sa) and 17296618 (Trường Sa). Either way, label them **"Quần đảo Hoàng Sa
  (Đà Nẵng)"** and **"Quần đảo Trường Sa (Khánh Hòa)"**.
  - The Hoàng Sa label is confirmed: Hoàng Sa became đặc khu Hoàng Sa of Đà Nẵng (Nghị quyết 1659/NQ-UBTVQH15).
  - The Trường Sa label (đặc khu of Khánh Hòa after the 2025 reform) is **UNVERIFIED** and must
    be checked before use.
- **Simplification:** at build time (e.g. mapshaper) to about 100–300 kB of GeoJSON. Islands
  stay visible because tiny polygons are not dropped.
- **No province borders.** Vietnam went from 63 to 34 provinces in 2025 (Resolution 202/2025/QH15),
  and open ADM1 datasets (geoBoundaries) still show the 2008 boundaries. Drawing outdated borders
  would be wrong, so v1 shows the country outline only.
- **Pins:** Đà Nẵng is the only active destination pin. Proposal: show **Hà Nội** and **TP. Hồ
  Chí Minh** as small, non-clickable reference labels so the map is recognisable, with coordinates
  verified from Wikidata/OSM in Phase 1. *(Owner may veto.)*
- **Region filter (Bắc / Trung / Nam):** implemented in the data model and UI. With one
  destination it only highlights Miền Trung, but it is ready for future destinations.

### 2.3 Level 2 — Đà Nẵng local map

- **Data:** one-off Overpass query for the area below, converted to GeoJSON at build time:
  land/coastline, sea, Hàn river, main roads (trunk/primary/secondary), parks and forest
  (Sơn Trà, Ngũ Hành Sơn), place labels. Trimmed and simplified to a target of **under ~1.5 MB**
  (estimate; actual size is measured in Phase 2).
- **Area (bounding box)**, padded from the verified coordinates:
  lat **15.985 – 16.110**, lon **107.985 – 108.290**.
  - This includes Bà Nà Hills / Cầu Vàng, about 26 km west of the centre.
  - The initial view frames the central city.
  - Bà Nà gets an off-screen direction hint, or is reached by zooming out.
  - If Hải Vân Quan is added later, the max latitude grows to about 16.20.
- **Licence:** shipping GeoJSON derived from OSM counts as distributing the database, so it stays
  ODbL with visible "© OpenStreetMap contributors" attribution. Source:
  osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ, openstreetmap.org/copyright.
- **Limitation:** this is a cartographic overview, not a street-level navigation map. That fits
  the spec (no route planning, not a Google Maps clone).
- **The 2025 merger:** Quảng Nam merged into Đà Nẵng, so Hội An and Mỹ Sơn are now in the city.
  v1 covers the **historic Đà Nẵng core plus Bà Nà**. Hội An is better as its own future
  destination (it is in the spec's list), even though it is administratively in Đà Nẵng now.
  *(Decision 2.)*

### 2.4 Zoom, transitions and navigation

- **One map, two layers:** the Vietnam layer is visible at zoom ~5–7. When a destination is
  chosen, `map.flyToBounds(destination.bounds)` animates (~1.5 s, eased). As it passes about
  zoom 9, the country layer fades out and the Đà Nẵng layer fades in. The Đà Nẵng GeoJSON is
  fetched lazily and prefetched when the pin is hovered or tapped.
- **Back to Vietnam:** reverse `flyToBounds` to the country bounds; layers cross-fade back.
  Map position per level is remembered in memory and `sessionStorage`, so returning restores
  context.
- **Location detail:** opening a location does not move the map away. On PC the map pans
  slightly so the marker isn't hidden behind the side panel. On iPhone it pans so the marker
  stays above the bottom sheet.
- **Routes:** `#/` (Vietnam), `#/da-nang` (local map), `#/da-nang/<location-id>` (detail).
  Hash routing works on GitHub Pages without a 404 fallback and keeps browser history meaningful.
- **Reduced motion:** with `prefers-reduced-motion`, flights become instant cuts with a short fade.
- **Touch:** Leaflet handles one-finger pan and pinch-zoom. The page itself does not scroll while
  the user drags the map. The +/− buttons are hidden on touch devices.

---

## 3. Data model

All user-facing strings are Vietnamese. Ids and keys are English kebab-case. Every coordinate
and fact carries its source. Adding a destination = adding JSON entries + assets, no code change.

### 3.1 Files

```text
data/
├── destinations.json      # destinations (Đà Nẵng now; more later)
├── locations.json         # all locations, each referencing destinationId
├── categories.json        # category ids, Vietnamese labels, marker colours, icon names
├── regions.json           # bac / trung / nam with Vietnamese labels
└── assets-manifest.json   # every photo / audio / map file with source, creator, licence
```

### 3.2 Destination (example with verified values)

```json
{
  "id": "da-nang",
  "name": "Đà Nẵng",
  "region": "trung",
  "coordinates": { "lat": 16.06850, "lon": 108.22402,
                   "source": "https://www.openstreetmap.org/node/369487028" },
  "bounds": [[15.985, 107.985], [16.110, 108.290]],
  "initialView": { "bounds": [[16.000, 108.180], [16.110, 108.290]] },
  "mapData": "assets/maps/da-nang.geojson",
  "cover": "da-nang-cover-01",
  "summary": "…Vietnamese text…",
  "introduction": "…Vietnamese text…",
  "locationIds": ["cau-rong", "bai-bien-my-khe", "…"],
  "status": "published"
}
```

The overview pin uses the OSM `place=city` node. Wikidata Q25282 gives a point about 1.5 km away
(16.06944, 108.20972). At country zoom the difference is invisible; both are recorded.

### 3.3 Location

```json
{
  "id": "cau-rong",
  "destinationId": "da-nang",
  "name": "Cầu Rồng",
  "category": "attraction",
  "tags": ["experience"],
  "coordinates": { "lat": 16.06117, "lon": 108.22790,
                   "source": "https://www.openstreetmap.org/way/694831926",
                   "wikidata": "Q5305270" },
  "summary": "…one-sentence Vietnamese teaser…",
  "sections": [
    { "type": "introduction", "title": "Giới thiệu", "body": "…" },
    { "type": "why-famous",   "title": "Vì sao nổi tiếng", "body": "…" },
    { "type": "experience",   "title": "Trải nghiệm", "body": "…" },
    { "type": "history",      "title": "Lịch sử", "body": "…" }
  ],
  "facts": [
    { "label": "Khánh thành", "value": "29/3/2013",
      "source": "https://en.wikipedia.org/wiki/Dragon_Bridge_(Da_Nang)" }
  ],
  "practical": [],
  "dishes": [],
  "relatedFoodIds": ["mi-quang"],
  "images": ["cau-rong-01", "cau-rong-02", "cau-rong-03"],
  "audio": { "asset": "cau-rong-narration", "transcriptSection": "introduction" },
  "sources": ["https://www.wikidata.org/wiki/Q5305270", "…"],
  "status": "published"
}
```

- `category` is the main category, which sets the marker style. `tags` give secondary
  categories for filtering.
- `practical` (opening hours, fees) is filled **only** with verified data plus a check date,
  otherwise left empty. Prices are in VND (e.g. "100.000 đồng").
- `dishes` lets a place such as Chợ Cồn feature several dishes without inventing an eatery for
  each.
- `relatedFoodIds` drives "Món ngon gần đây". **Nearby places** are computed from coordinates
  (haversine), not hand-maintained.
- Audio is optional. Without it the player is hidden and the text remains.

### 3.4 Categories

| id | Label (vi) | Notes |
|---|---|---|
| `attraction` | Địa danh | Landmarks, icons |
| `nature` | Thiên nhiên | Beaches, mountains, peninsula |
| `food` | Ẩm thực | Dishes and food places |
| `culture` | Văn hóa | Pagodas, craft villages |
| `history` | Lịch sử | Museums, relics |
| `market` | Chợ | Markets |
| `experience` | Trải nghiệm | Cable car, fire show, walking streets |

### 3.5 Food

The spec says dishes are destinations worth exploring, not restaurant listings. Each food
location is **a dish story pinned at one verified, long-running place where it's served**, and
the text says this is "một địa chỉ tiêu biểu" (one representative place), not a ranking. Chợ Cồn
is the food-market location and features several dishes inside it.

### 3.6 Asset manifest entry

```json
{
  "id": "cau-rong-01",
  "type": "image",
  "files": { "1600": "assets/locations/cau-rong/01-1600.webp",
             "1170": "assets/locations/cau-rong/01-1170.webp",
             "800":  "assets/locations/cau-rong/01-800.webp",
             "400":  "assets/locations/cau-rong/01-400.webp" },
  "alt": "…Vietnamese alt text…",
  "source": "https://commons.wikimedia.org/wiki/File:Remote_view_of_the_Dragon_Bridge_in_Da_Nang.jpg",
  "creator": "Christophe95",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
  "attributionRequired": true,
  "modified": "resized",
  "uploadedToSource": "2020",
  "notes": ""
}
```

---

## 4. Initial location list (Đà Nẵng v1)

Coordinates from OSM (preferred) with Wikidata cross-check. Distance is measured from Cầu Rồng.
Facts listed are the ones verified so far and are candidates for the text.

| # | Location | Category | Lat, Lon | Source | Verified facts (to cite) |
|---|---|---|---|---|---|
| 1 | **Cầu Rồng** | Địa danh (+ Trải nghiệm) | 16.06117, 108.22790 | OSM way/694831926; Wikidata Q5305270 (~130 m apart) | Opened 29/3/2013; 666 m long, 37.5 m wide, 6 lanes; breathes fire and water on Saturday and Sunday evenings at 21:00 (en-wiki) |
| 2 | **Bãi biển Mỹ Khê** | Thiên nhiên | 16.07563, 108.24688 | OSM relation/19000664 centroid; Wikidata Q10796763 is ~590 m away (long beach, both on the sand) | One of the city's busiest beaches (vi-wiki). The length figures in sources conflict, so no length is used. |
| 3 | **Ngũ Hành Sơn – Thủy Sơn** | Thiên nhiên (+ Văn hóa) | 16.00430, 108.26353 | OSM node/1758586662 (Thủy Sơn peak); massif centroid OSM relation/8552348 | Five marble/limestone hills named after the five elements; caves incl. Huyền Không; Thủy Sơn can be climbed; Chùa Linh Ứng Non Nước stands on it (en/vi-wiki). Elevation **UNVERIFIED**. |
| 4 | **Chùa Linh Ứng Bãi Bụt** | Văn hóa | 16.10014, 108.27844 | OSM way/486703049; Wikidata Q18277260 (~200 m apart) | Foundation stone 2004, inaugurated 30/7/2010; Quán Thế Âm statue 67 m (vi/en-wiki; Wikidata heights inconsistent, not used) |
| 5 | **Bảo tàng Điêu khắc Chăm** | Lịch sử | 16.06020, 108.22317 | OSM way/302872188; Wikidata Q6940790 (agree) | Founded 1915 (Musée Henri Parmentier) per en-wiki, which hedges it with "reportedly", so it must be re-verified; first building opened 1919; expanded 2002 |
| 6 | **Bà Nà Hills – Cầu Vàng** | Trải nghiệm | 15.99492, 107.99623 (Cầu Vàng) | OSM way/683416736; Wikidata Q55954790 (agree); Bà Nà Q5004763 | Hill station founded 1919 at ~1,500 m; cable car opened 29/3/2013, 5,801 m; Cầu Vàng opened 6/2018, 150 m, held by two giant hands (en-wiki). ~26 km from the centre. |
| 7 | **Chợ Cồn** | Ẩm thực (+ Chợ) | 16.06813, 108.21452 | OSM way/204790989 (Nominatim centroid), 290 Hùng Vương | Name dates from the 1940s; rebuilt 12/1984; renamed back to Chợ Cồn in 2012 (vi-wiki). Features bánh xèo, bánh tráng cuốn thịt heo and other snacks as `dishes`. The food area isn't mapped separately in OSM. |
| 8 | **Mì Quảng** (at Mì Quảng 1A) | Ẩm thực | 16.07238, 108.21913 | OSM node/4430077491, 1A Hải Phòng | Listed as Michelin Selected 2026 per the city tourism portal danangfantasticity.com (**re-verify**); founding year **UNVERIFIED** |
| 9 | **Bún chả cá** (at Bún chả cá 109) | Ẩm thực | 16.07439, 108.22080 | OSM node/5484764821, 109 Nguyễn Chí Thanh | OSM check_date 2026-11-03; Bib Gourmand 2026 per the same portal (**re-verify**) |

**Alternates**, also verified, ready to swap in:

| Location | Category | Lat, Lon | Source |
|---|---|---|---|
| Chợ Hàn | Chợ | 16.06826, 108.22439 | OSM way/204885903 (119 Trần Phú; formed 1940, rebuilt 1989) |
| Nhà thờ Chính tòa Đà Nẵng (Nhà thờ Con Gà) | Lịch sử | 16.06668, 108.22306 | OSM way/404714309; Wikidata Q10800905 (built 1923–1924) |
| Cầu sông Hàn | Địa danh | 16.07214, 108.22681 | OSM node/7276380289; Q10752400 (opened 29/3/2000, swing bridge) |
| Bán đảo Sơn Trà | Thiên nhiên | 16.11778, 108.27361 | Wikidata Q32173911 (OSM locality node is ~1 km away; nature reserve since 1992) |
| Hải Vân Quan | Lịch sử | 16.18775, 108.13129 | OSM way/466418347; Q131186991 (built 1826; national relic 2017) |
| Làng đá mỹ nghệ Non Nước | Văn hóa | 16.00095, 108.26664 | OSM node/10709724107 |
| Bánh xèo (at Bánh xèo Bà Dưỡng) | Ẩm thực | 16.05880, 108.21603 | OSM node/4541527689, K280/23 Hoàng Diệu (check_date 2026-10-30) |

**Not proposed:** Bánh tráng cuốn thịt heo pinned at a specific eatery. The two candidates have
conflicting addresses or no confirmed current status, so the dish is featured inside Chợ Cồn.

---

## 5. Asset inventory and sourcing strategy

### 5.1 Photo candidates

All are on Wikimedia Commons; author, licence and size were read from each file page.
"Upl." is the upload year where known. Full URLs: `https://commons.wikimedia.org/wiki/File:<name>`.

| Location | Primary candidates (author · licence) | Gaps / risk |
|---|---|---|
| Cover — Đà Nẵng | `Han_River_in_Da_Nang_at_sunrise.jpg` (Christophe95 · CC BY-SA 4.0); `Da_Nang_and_the_Son_Tra_Peninsula.jpg` (Christophe95 · CC BY-SA 4.0) | — |
| Cầu Rồng | `Remote_view_of_the_Dragon_Bridge_in_Da_Nang.jpg` (Christophe95 · CC BY-SA 4.0 · upl. 2020); `Da_Nang_Dragon_Bridge_2020_IMG_4019.jpg` (Kuroczynski · CC BY-SA 4.0 · 2020); `Dragon_Bridge_Da_Nang_1.jpg` (Christophe95 · CC BY-SA 4.0 · 2020) | Copyrighted modern structure; uses only pre-2023 uploads. Skip the "CC0" Pixabay file (its CC0 claim is doubtful). |
| Bãi biển Mỹ Khê | `My_Khe_Beach,_Da_Nang,_Vietnam.jpg` (. Ray in Manila · CC BY 2.0); `My_Khe_Beach_seen_from_the_Son_Tra_Mountain.jpg` (Christophe95 · CC BY-SA 4.0); `Bai_bien_My_Khe.jpg` (Viethavvh · public domain) | Avoid `Palm_trees_beach_Da_Nang.jpg`: its description says Non Nước beach. |
| Ngũ Hành Sơn | `Marble_Mountains_20190919.jpg` (Suicasmo · CC BY-SA 4.0); `The_Marble_Mountains_(45485988652).jpg` (Raita Futo · CC BY 2.0); `Huyen_Khong_Cave_1.jpg` (Christophe95 · CC BY-SA 4.0); `Sunlight_Huyen_Khong_Cave.jpg` (Vyacheslav Argenberg · CC BY 2.0); panorama `Marble_Mountains.jpg` (Chrismiceli · CC0, 14566×2375) | — |
| Chùa Linh Ứng Bãi Bụt | `Linh_Ung_Pagoda_2.jpg` (Christophe95 · CC BY-SA 4.0); `Chùa_Linh_Ứng.jpg` (Khoitran1957 · CC BY-SA 4.0); `Lady_Buddha_Da_Nang.jpg` (Christophe95 · CC BY-SA 4.0 · 2020, portrait) | Commons mixes three different "Linh Ứng" pagodas, so only files described as Sơn Trà/Bãi Bụt are listed. No landscape photo of the statue was found; the portrait one fits the iPhone layout. |
| Bảo tàng Điêu khắc Chăm | `Terrace_-_Museum_of_Cham_Sculpture_-_Danang,_Vietnam_-_DSC01987.JPG` (Daderot · CC0); `Interior_view_-_…_DSC01931.JPG` (Daderot · CC0); `Le_musée_de_sculpture_Cham_(Da_Nang)_(4394725713).jpg` (Jean-Pierre Dalbéra · CC BY 2.0) | — |
| Bà Nà – Cầu Vàng | `Golden_Bridge,_Ba_Na_Hills,_Vietnam_(49056923018).jpg` (Nick · CC BY 2.0 · 2021); `Vietnam,_Ba_Na_Hill,_Golden_Bridge_-_Laslovarga.jpg` (Laslovarga · CC BY-SA 4.0 · 2019) | Only these two safe pre-2023 uploads; later ones carry deletion risk. |
| Chợ Cồn | `Con_Market_1.jpg`, `Con_Market_at_sunset.jpg` (Christophe95 · CC BY-SA 4.0); `Con_Market_across_intersection.JPG` (Dragfyre · CC BY-SA 3.0) | No interior / food-stall photo found yet. |
| Mì Quảng | `Mi_Quang_1A_Danang.jpg` (Jpatokal · CC BY-SA 4.0), taken at Mì Quảng 1A itself; `My_Quang_Da_Nang.JPG` (Dragfyre · CC BY-SA 3.0) | — |
| Bún chả cá | `Bun_cha_ca.jpg` (Everyday English · CC BY-SA 4.0); `Bún_chả_cá,_tháng_8_năm_2018.JPG` (Phương Huy · public domain) | **Not from Đà Nẵng**; generic dish photos only. |
| Bánh xèo / bánh tráng cuốn (inside Chợ Cồn) | `Bánh_xèo.jpg` (DuyTran16 · public domain); `Bánh_tráng_cuốn_thịt_heo.jpg` (Lê Huỳnh Bộ · CC BY-SA 4.0) | **Not from Đà Nẵng**; place not stated. |

**Missing or weak:** Đà Nẵng-specific photos of bún chả cá, bánh xèo and bánh tráng cuốn thịt
heo; Chợ Cồn food stalls; a landscape photo of the Lady Buddha. Proposal: use the generic dish
photos captioned as the dish only, never as a specific eatery. *(Decision 5.)*

### 5.2 Licensing notes

- **Freedom of panorama (FoP) in Vietnam.** Law 07/2022/QH15 (in force 1/1/2023) allows
  photographing works in public places "not for commercial purposes" only. Wikimedia Commons
  therefore treats uploads from 2023 onward of copyrighted architecture/artworks (Cầu Rồng 2013,
  Cầu Vàng 2018, Lady Buddha 2010) as deletable.
  - Our site is personal and non-commercial, which fits the exception. This is not legal advice.
  - The practical risk is that a source page disappears. We store the licence data in the
    manifest and prefer pre-2023 uploads.
  - Source: commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/Vietnam.
- **CC BY / CC BY-SA** need the author, licence link and a "modified" note. A resized CC BY-SA
  photo stays CC BY-SA. All credits are shown on the Vietnamese page **"Nguồn ảnh & bản quyền"**
  and in short form under each photo.
- **Unsplash / Pexels** are allowed by their licences without attribution, but their location
  tags are user-typed. Use them only as a fallback, and only when the place is visually
  confirmed.
- **Wikipedia text is CC BY-SA.** We write **original Vietnamese text** from verified facts and
  don't copy article prose.

### 5.3 Collection workflow (Phases 2–3, after your approval)

1. Read the file's licence and author through the Commons API and record them in
   `assets-manifest.json` before downloading.
2. Download the single original file (no bulk scraping) into a git-ignored `source-assets/`.
3. Build-time script resizes it to widths 1600 / 1170 / 800 / 400. WebP plus a JPEG fallback;
   iPhone 13 Safari supports WebP. Strip EXIF GPS; target ≤ 250 kB for 1170 px.
4. Only the resized files are committed.

### 5.4 Narration

| Option | Naturalness | Licence | Offline | Verdict |
|---|---|---|---|---|
| Owner's own recording | Best | Owner's own | Yes | Best quality; any file can replace a generated one later |
| **Piper `vi_VN-vais1000-medium`** | Moderate (northern accent, synthetic) | Dataset CC BY 4.0, credit required; Piper notes it is "for personal use and research" | Yes, pip wheel for Windows | **Recommended for v1** |
| VieNeu-TTS | Probably more natural (**UNVERIFIED**) | Conflicting dataset licences, output watermark | Yes | Not now |
| MMS-TTS-vie (Meta) | **UNVERIFIED** | CC BY-NC 4.0 | Yes | Acceptable fallback (non-commercial site) |
| edge-tts (Microsoft online voices) | Best synthetic | No terms grant rights to publish output; online at generation | No | Not recommended |
| Windows "An" voice | Robotic | Publishing terms unclear | Yes | Not recommended; also not installed here |

Plan:
- In Phase 3, generate **one sample** (Cầu Rồng) for you to listen to before producing the rest.
- Narration covers the introduction section, about 45–90 s.
- Files are mono MP3/AAC at about 48–64 kbps (≈0.4–0.5 MB per minute).
- Needs an encoder (ffmpeg or similar) at build time. Availability on this PC is still to be checked.
- Ambient background sounds: deferred, and optional in the spec.

### 5.5 Other assets

| Asset | Source | Licence |
|---|---|---|
| Leaflet 1.9.4 | github.com/Leaflet/Leaflet | BSD-2-Clause |
| Vietnam outline | Natural Earth 10m, VNM POV | Public domain |
| Đà Nẵng map data, Hoàng Sa/Trường Sa if needed | OpenStreetMap | ODbL |
| Fonts (proposal) | **Be Vietnam Pro** (UI) + **Noto Serif** (headings) | SIL OFL. Vietnamese coverage and licence to be confirmed at download; self-hosted WOFF2 subsets |
| Marker / UI icons | Hand-drawn simple SVG in this project | Own work |

---

## 6. Visual design direction

**Mood:** a modern editorial travel atlas, between a printed map and a travel magazine. The
photographs carry the colour; the interface stays quiet.

- **Palette:** warm paper land (sand/ivory), muted grey-blue sea, ink-dark text, and one accent,
  lacquer red, used sparingly for the selected item.
  - Category markers use muted, distinct hues (sea blue for nature, jade for culture, ochre for
    food, and so on).
  - Dark mode keeps the same hues on a deep navy sea.
- **Map styling:** no street clutter.
  - Thin coastline, soft green for Sơn Trà / Ngũ Hành Sơn, the Hàn river clearly drawn.
  - Neighbourhood names in small-caps serif.
  - Markers are small dots with a white ring; labels appear only when zoomed in or selected.
  - The selected marker grows and shows its name.
- **Typography:** Noto Serif for titles and pull quotes; Be Vietnam Pro for UI and body. The
  font was designed with Vietnamese diacritics in mind, so stacked accents such as "Ngũ Hành
  Sơn" render cleanly.
- **Detail view as a magazine spread:**
  - Full-bleed hero photo with the credit in small type.
  - A category kicker ("VĂN HÓA · ĐÀ NẴNG") above the serif title.
  - A one-sentence teaser, then the narration player.
  - The sections Giới thiệu / Vì sao nổi tiếng / Trải nghiệm / Lịch sử.
  - A swipeable gallery, "Món ngon gần đây", and "Gần đây" (nearby, with distances in km).
- **Motion:** flights of about 1.5 s, ease-in-out, layer cross-fades, and a sheet that slides up.
  No bouncing, parallax overload or confetti. `prefers-reduced-motion` is respected.
- **Avoided:** booking-style cards, star ratings, "Book now", stock icons everywhere, gradient
  banners, cartoon or 3D styles.
- **Device layouts:** as in `CLAUDE.md` → "Layout and position per device".
  - PC: side panel.
  - iPhone 13 portrait: full-screen map with a bottom sheet in three states, respecting the
    safe areas.

---

## 7. Proposed project structure

```text
index.html
manifest.webmanifest        # add to home screen (iPhone)
sw.js                       # service worker: offline cache (root, relative scope)
css/   main.css, map.css, destinations.css, details.css, animations.css
js/    app.js            # bootstrap, loads data
       router.js         # hash routes, history, context restore
       vietnam-map.js    # Level 1 layer, pins, region filter
       local-map.js      # Level 2 layer, markers, category filter
       locations.js      # data access, nearby computation
       details.js        # detail panel / bottom sheet
       gallery.js        # swipeable gallery, full-screen view
       audio.js          # narration player
       favorites.js      # LocalStorage (Phase 4)
       search.js         # (Phase 4)
data/  destinations.json, locations.json, categories.json, regions.json, assets-manifest.json
assets/maps/        vietnam.geojson, da-nang.geojson
assets/destinations/da-nang/
assets/locations/<location-id>/
assets/audio/
assets/fonts/
assets/icons/
vendor/leaflet/     leaflet.js, leaflet.css, LICENSE
tools/              build-time scripts (not needed at runtime): map extraction,
                    image resizing, audio generation, manifest validation
docs/               SPEC.md, phase-0-proposal.md, ATTRIBUTIONS.md
source-assets/      originals (git-ignored)
```

Compared with the suggested structure:
- `navigation.js` is split into `router.js` (state) and `details.js` (UI).
- `sw.js` and `manifest.webmanifest` are added for iPhone offline use.
- `regions.json` and `assets-manifest.json` are added.

---

## 8. Development roadmap (single destination)

| Phase | Deliverable | Done when |
|---|---|---|
| **1. Vietnam map** | Page shell (PC + iPhone layouts, safe areas); Vietnam outline incl. Hoàng Sa/Trường Sa labels; Đà Nẵng pin; reference labels; region filter; pan/zoom; hash router; tap Đà Nẵng → fly in (empty Đà Nẵng layer) | Works at 1440 px and at 390×844; islands verified; outline credited |
| **2. Đà Nẵng map** | OSM extract → styled layer; 9 markers with categories; category chips; Bà Nà off-screen hint; back to Vietnam; context restore | All markers match their sources; smooth transitions both ways on iPhone |
| **3. Location details** | Side panel / bottom sheet; magazine layout; Vietnamese text for 9 locations; photo gallery with credits; "Nguồn ảnh & bản quyền" page; narration sample → your approval → all narrations | The 9-step flow in the spec's "Complete one destination" works end to end |
| **4. Discovery** | Search, favourites (LocalStorage), featured on the home page, nearby places and related food | — |
| **5. Quality & release** | Service worker offline cache; manifest; image/performance tuning; real iPhone 13 test via GitHub Pages; accessibility pass; link and licence audit | Lighthouse-style checks pass; site works offline on the iPhone after first visit |

GitHub Pages deployment can start as early as Phase 1, so you can test on the iPhone from the
start, but only if you want it and create (or let me create) the repository.

---

## 9. Risks and limitations

| Risk | Mitigation |
|---|---|
| The Natural Earth Vietnam-POV file may not include Hoàng Sa/Trường Sa | Verified first in Phase 1; fallback to OSM claim relations |
| OSM-derived Level 2 map is less detailed than Google Maps | Intentional (spec says not a Google Maps clone); editorial style |
| Photos of modern works may be deleted from Commons (FoP) | Prefer pre-2023 uploads; keep licence data locally; non-commercial use |
| No Đà Nẵng-specific food photos | Generic dish photos captioned honestly, or your own photos |
| Piper voice sounds synthetic | Sample approval first; owner recordings can replace any file |
| Eateries close or move | Pins only at places with recent OSM check dates; data records a check date; text avoids claiming "best" |
| Facts drift (opening hours, fees) | `practical` shows only verified data with check dates |
| GitHub Pages size/bandwidth | Resized media only; originals git-ignored |
| iOS Safari quirks (viewport height, audio, gestures) | `dvh`/safe-area CSS, tap-started audio, testing at 390×844 and on the device |

---

## 10. Decisions needed from you

1. **Map approach:** approve Leaflet 1.9.4 + local GeoJSON (Natural Earth Vietnam POV + OSM
   extract), no tiles.
2. **Đà Nẵng scope:** historic core + Bà Nà for v1, with Hội An as a separate future destination
   (recommended); or include Hội An / Mỹ Sơn from the merged city now.
3. **Location list:** approve the 9 locations in section 4, or swap with alternates.
4. **Narration:** Piper `vi_VN-vais1000-medium` with a sample for approval first (recommended);
   or your own recordings; or no audio in v1.
5. **Food photos:** OK to use generic (not Đà Nẵng-specific) dish photos, captioned as the dish
   only?
6. **Overview map:** show Hà Nội and TP. Hồ Chí Minh as non-clickable reference labels?
7. **Downloads:** permission to download, in Phase 1–3, the specific files named here (Leaflet,
   Natural Earth VNM POV, one OSM extract, the listed Commons photos, fonts, the Piper voice
   model). Each will be recorded in the manifest.
8. **GitHub repository:** create it now so Phase 1 can be tested on the iPhone, or later?

### Owner answers (2026-11-08)

| # | Decision | Answer |
|---|---|---|
| 1 | Map approach | Leaflet + local GeoJSON (as recommended) |
| 2 | Đà Nẵng scope | City core + Bà Nà; Hội An later as its own destination |
| 3 | Locations | All 9 approved |
| 4 | Narration | **No audio in v1.** Section 5.4 and the narration steps of Phase 3 are deferred; the audio model stays optional |
| 5 | Food photos | Generic dish photos, captioned as the dish only |
| 6 | Reference labels | Show Hà Nội and TP. Hồ Chí Minh as non-clickable labels |
| 7 | Downloads | Approved for the files named in this proposal (minus the Piper voice, which is not needed now) |
| 8 | GitHub | Later, after Phase 3; test locally and via Live Server on Wi-Fi until then |

**Later change (2026-11-08, Phase 1):** the owner asked for a map style similar to the default
Google Maps road map (flat, no satellite or terrain). This replaces the "Map styling" bullet of
section 6; see `CLAUDE.md` → "Map style decision".
