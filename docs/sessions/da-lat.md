# Session brief — Đà Lạt (`da-lat`)

| | |
|---|---|
| Country | Việt Nam (`viet-nam`) |
| Region field | `nam` (Miền Nam, as listed in the spec) |
| Branch | `dest/da-lat` (own git worktree recommended) |
| Your paths | `data/destinations/da-lat/`, `assets/destinations/da-lat/`, `assets/maps/da-lat.geojson`, `docs/sessions/da-lat.md` |
| URL when done | `#/viet-nam/da-lat` |

## How to start this session

Start a new Claude Code session in this repository, on a new worktree or branch `dest/da-lat`
from `main`, and paste:

> Read CLAUDE.md, docs/PLAYBOOK-destination.md and docs/sessions/da-lat.md. Build the **Đà Lạt**
> destination by following the playbook. Work only on branch dest/da-lat and only in your own
> paths. Start with stage A (research) and present the proposal for my approval before building.

## Context (verify before you rely on it)

- Highland city in Lâm Đồng. Lâm Đồng was merged with neighbouring provinces in 2025 (verify).
- **Inland**: the whole area is land, and lakes (Hồ Xuân Hương, Tuyền Lâm) come from OSM water polygons. Check they render.
- Region: the spec lists Đà Lạt under Southern Vietnam (`nam`). Keep that unless the owner says otherwise.

## Location ideas (starting points only, not facts)

Hồ Xuân Hương; chợ Đà Lạt (+ chợ đêm); ga Đà Lạt; dinh Bảo Đại (Dinh III); thiền viện Trúc Lâm & hồ Tuyền Lâm; thác Datanla; nhà thờ Chánh tòa (Con Gà) Đà Lạt; quảng trường Lâm Viên (modern → pre-2023 photos). Langbiang and the Cầu Đất tea hills are far: only if the bbox allows. Food: bánh căn, bánh tráng nướng, lẩu gà lá é, sữa đậu nành.

Pick 5–8 locations with at least 2 food locations. Every coordinate and fact must come from a
source you read (OSM / Wikidata / Wikipedia). Location ids must be `da-lat-<slug>`.

## Photos

Commons coverage is good for the lake, the station and the cathedral. Waterfall and mountain places can have up to 10 photos.

Minimums (owner):
- ≥ 5 destination photos;
- ≥ 3 per location;
- ≥ 3 per food location;
- up to 10 for food, beach and mountain/forest places.

Wikimedia Commons first (CC0 / PD / CC BY / CC BY-SA). If a minimum can't be met, use Flickr (CC, never ND), Unsplash or Pexels as described in the playbook (step B4b). Report gaps instead of padding.

## Map notes

Hilly city with many roads: keep `coreBbox` around the centre and Hồ Xuân Hương.

---

## Proposal

Stage A research, 2026-11-08. Sources were read on that date: Wikidata, OSM (Nominatim and the
OSM API, including object history), and vi/en Wikipedia articles. Nothing is built yet.

### The place

- **Đà Lạt** is the former provincial city and capital of Lâm Đồng.
  - Since 1 July 2025 there are no district-level units (Resolution 203/2025/QH15), so the city
    was dissolved.
  - Its area is now the wards Xuân Hương – Đà Lạt, Cam Ly – Đà Lạt, Xuân Trường – Đà Lạt,
    Lâm Viên – Đà Lạt, and part of Lang Biang – Đà Lạt.
  - The new Lâm Đồng province (2025) merges the old Lâm Đồng, Đắk Nông and Bình Thuận provinces.
  - Sources: vi.wikipedia "Đà Lạt" and "Lâm Đồng".
  - All proposed locations are in phường Xuân Hương – Đà Lạt (per OSM/Nominatim addresses and
    vi.wikipedia).
- **Destination point:** OSM `place=city` node
  [369486906](https://www.openstreetmap.org/node/369486906) at 11.94024, 108.43758. Wikidata
  [Q25281](https://www.wikidata.org/wiki/Q25281) gives 11.94000, 108.43750 (the same place).
- **Region:** `nam`, as in the brief.
- **Draft summary:** "Thành phố cao nguyên giữa rừng thông, quanh hồ Xuân Hương, với nhà thờ, nhà
  ga và dinh thự từ thời Pháp."

### Locations (9 proposed)

The playbook says 5–8. Đà Nẵng has 9. See question 1.

| # | id | Tên | Category (tags) | lat, lon | Coordinate source | Facts (source) |
|---|---|---|---|---|---|---|
| 1 | `da-lat-ho-xuan-huong` | Hồ Xuân Hương | nature | 11.94508, 108.44872 | OSM [relation 2390139](https://www.openstreetmap.org/relation/2390139) (point tested inside the lake polygon); [Q10772055](https://www.wikidata.org/wiki/Q10772055) gives 11.94185, 108.44683 (≈ 410 m, also on the water) | Rộng: khoảng 25 ha · Chu vi: khoảng 5 km · Ngăn suối Cam Ly làm hồ: 1919 · Mang tên Xuân Hương từ 1953 (vi.wikipedia "Hồ Xuân Hương (hồ nước)") |
| 2 | `da-lat-nha-tho-chinh-toa` | Nhà thờ chính tòa Đà Lạt (nhà thờ Con Gà) | culture | 11.93624, 108.43769 | OSM [way 452519411](https://www.openstreetmap.org/way/452519411) (`check_date` 2026-07-01); [Q10800904](https://www.wikidata.org/wiki/Q10800904) ≈ 30 m | Khởi công: 19/7/1931 · Khánh thành: 25/1/1942 · Tháp chuông cao: 47 m · Địa chỉ: 13 Trần Phú (vi.wikipedia "Nhà thờ chính tòa Đà Lạt") |
| 3 | `da-lat-ga-da-lat` | Ga Đà Lạt | history (attraction) | 11.94160, 108.45443 | OSM [relation 17877171](https://www.openstreetmap.org/relation/17877171); [Q3096348](https://www.wikidata.org/wiki/Q3096348) ≈ 70 m (low precision) | Xây dựng: 1932–1938 · Di tích quốc gia: 2001 · Tàu du lịch Đà Lạt – Trại Mát: 7 km (vi + en.wikipedia "Ga Đà Lạt" / "Da Lat station") |
| 4 | `da-lat-dinh-bao-dai` | Dinh III (Dinh Bảo Đại) | history | 11.93005, 108.42967 | OSM [node 5274759821](https://www.openstreetmap.org/node/5274759821); [Q10755588](https://www.wikidata.org/wiki/Q10755588) ≈ 15 m | Xây dựng: 1933–1938 · Kiến trúc sư: Paul Veysseyre, Arthur Kruze (vi.wikipedia "Dinh III") |
| 5 | `da-lat-thien-vien-truc-lam` | Thiền viện Trúc Lâm & hồ Tuyền Lâm | culture (nature) | 11.90416, 108.43479 | OSM [way 1356287796](https://www.openstreetmap.org/way/1356287796) (centroid); [Q7847137](https://www.wikidata.org/wiki/Q7847137) gives 11.9025, 108.436 (≈ 210 m, low precision, inside the same grounds) | Xây dựng: 1993–1994 · Hồ Tuyền Lâm: khoảng 320 ha (vi.wikipedia "Thiền viện Trúc Lâm Đà Lạt", "Hồ Tuyền Lâm") |
| 6 | `da-lat-thac-datanla` | Thác Datanla | nature (experience) | 11.90118, 108.44884 | OSM [node 4502225092](https://www.openstreetmap.org/node/4502225092) (= Wikidata [Q10825643](https://www.wikidata.org/wiki/Q10825643) P11693) | Thác đổ từ ghềnh cao: 20 m · Tên gọi theo tiếng K'Ho: "dưới lá có nước" (vi.wikipedia "Thác Datanla") |
| 7 | `da-lat-cho-da-lat` | Chợ Đà Lạt | market | 11.94344, 108.43718 | OSM [relation 4119185](https://www.openstreetmap.org/relation/4119185); [Q10748819](https://www.wikidata.org/wiki/Q10748819) ≈ 65 m | Xây dựng: 1958–1960 · Chợ đêm được tổ chức chính thức từ 2013 (vi.wikipedia "Chợ Đà Lạt", en.wikipedia "Da Lat Market") |
| 8 | `da-lat-banh-trang-nuong` | Bánh tráng nướng | food (market) | 11.94150, 108.43727 | Venue: **Chợ đêm Đà Lạt**, đường Nguyễn Thị Minh Khai, OSM [way 407704132](https://www.openstreetmap.org/way/407704132) (last edited 2025-02-05) | en.wikipedia "Da Lat" says the city is known for bánh tráng nướng; en.wikipedia "Da Lat Market" says the night market sells street food. Text: "một địa chỉ tiêu biểu". |
| 9 | `da-lat-banh-can` | Bánh căn | food | 11.94398, 108.43512 | Venue: **UNVERIFIED**. OSM [node 7003724800](https://www.openstreetmap.org/node/7003724800), "bánh căn", 07 Tăng Bạt Hổ, mapped 2019 and never re-checked. | vi.wikipedia "Bánh căn" names Lâm Đồng (old Bình Thuận), not Đà Lạt itself. See question 2. |

Notes:
- Opening hours exist only as OSM tags without a check date (Dinh III, Trúc Lâm), so they are
  left out.
- Wikipedia mentions the Datanla alpine coaster (1,000 m). It is left out because there is no
  current verification.
- Alternates (not proposed): Quảng trường Lâm Viên (modern square, [Q56072444](https://www.wikidata.org/wiki/Q56072444),
  OSM way 1303837487), Dinh I, the Đà Lạt cable car, and sữa đậu nành (OSM stall, 2018,
  unverified). Langbiang (12.047 N, about 12 km north) is too far for a compact bbox.

### Map area

- `map-config.json` (lon/lat order):
  - `bbox` `[108.400, 11.865, 108.475, 11.960]`: about 8 × 10.5 km. It covers all of Hồ Tuyền
    Lâm (OSM bbox 11.871–11.910 N, 108.409–108.440 E), Datanla, and the city up to the station.
  - `coreBbox` `[108.425, 11.930, 108.462, 11.952]`: the centre around Hồ Xuân Hương, the
    market, the cathedral and the station.
  - `riverLabels` `["Hồ Xuân Hương", "Hồ Tuyền Lâm", "Suối Cam Ly"]`, kept only if OSM has
    those names.
- `bounds` = `[[11.865, 108.400], [11.960, 108.475]]`.
- `initialView` = `[[11.926, 108.424], [11.952, 108.462]]`: the centre. Trúc Lâm and Datanla
  (about 4.5 km south) get off-screen hint pills.
- Inland, so the whole area is land. Hồ Xuân Hương (relation 2390139) and Hồ Tuyền Lâm
  (way 125165263) are OSM `water=reservoir` polygons. Check that they render.
- `mapLabels`: possibly "Đồi Cù" or "Rừng thông" (`area`), only if OSM gives verified positions.

### Photo plan (Wikimedia Commons; CC0 / PD / CC BY / CC BY-SA)

Category sizes were checked on 2026-11-08.

| Place | Commons source | Files | Target | Note |
|---|---|---|---|---|
| Cover (≥ 5) | Category:Da Lat, Views of Da Lat, Xuan Huong Lake | 24 + 46 + 106 | 6–8 | City panoramas, lake, pine hills |
| Hồ Xuân Hương | Category:Xuan Huong Lake | 106 | 6–10 | |
| Nhà thờ chính tòa | Category:Cathedral of Da Lat | 47 | 4–6 | |
| Ga Đà Lạt | Category:Da Lat Station | 38 | 4–6 | |
| Dinh III | Category:Palace III | 67 | 4–6 | No close-ups of artworks |
| Trúc Lâm & Tuyền Lâm | Category:Truc Lam Monastery of Da Lat, Tuyen Lam Lake | 136 + 94 | 6–10 | Built 1993–94, a modern work: **pre-2023 uploads only** |
| Thác Datanla | Category:Datanla Waterfall | 27 | 5–10 | Coaster structures: pre-2023 only |
| Chợ Đà Lạt | Category:Da Lat Market (+ "Dalat night market - panoramio" files) | 53 (+5) | 4–6 | 1958–60 building: pre-2023 only |
| Bánh tráng nướng | Category:Bánh tráng nướng (+ night-market photos) | 5 | 3–6 | Generic dish photos, `illustrative: true` |
| Bánh căn | Search "bánh căn": 4 dish files | 4 | 3–4 | Generic (one taken in Phan Rang), `illustrative: true`. **Risk:** if fewer than 3 pass the licence check, this is a gap. |

Expected: every place meets its minimum. The only risk is bánh căn, which reaches 3 only if 3
of the 4 files pass.

### Open questions for the owner

1. **9 locations or 8?** The playbook says 5–8. Đà Nẵng has 9. If 8, drop Chợ Đà Lạt and
   mention the market in the bánh tráng nướng (night market) text.
2. **Bánh căn venue.** No long-running stall can be verified from OSM or Wikipedia: the OSM
   stalls are untagged and were last checked in 2016–2019.
   - Options: (a) pin it at the OSM stall at 07 Tăng Bạt Hổ if you confirm it still operates;
     (b) you name a stall you know; (c) drop bánh căn and make Chợ Đà Lạt the second food pin
     (`food`, tag `market`). en.wikipedia "Da Lat Market" says its oldest building "focuses on
     food". That leaves 8 locations.

## Status log

| Date | Item |
|---|---|
| 2026-11-08 | Brief created by the main session. Placeholder `destination.json` exists with `"status": "planned"`. |
| 2026-11-08 | Session started in worktree `dest-da-lat-6efe33`, branch `dest/da-lat`; test server on port 5522. Stage A research done (Wikidata, OSM, Wikipedia); proposal written above, waiting for owner approval. |
| 2026-11-08 | **Owner approved the proposal**, with option (c) for question 2: drop bánh căn; Chợ Đà Lạt becomes the second food location (`food`, tag `market`). So **8 locations**: 1–8 of the table, with #7 recategorised. Stage B started. |
| 2026-11-08 | Built: `destination.json` (kept `draft`), `map-config.json`, `locations.json`, and `assets/maps/da-lat.geojson` (210 kB; one Overpass fetch, OSM base 2026-11-08T05:18Z). The map checked OK in the browser at 1440 × 900: both lakes are water, roads and labels show, all 8 pins appear, and the Trúc Lâm hint pill works. |
| 2026-11-08 | Photos: the candidate search ran once per place; 54 files were picked by eye and written to `photo-selection.json` (cover 6, Hồ Xuân Hương 9, nhà thờ 6, ga 6, Dinh III 6, Trúc Lâm 6, Datanla 8, chợ 6, bánh tráng nướng 5). `meta`: all 54 OK. `download` hit Commons HTTP 429 repeatedly: **16/54 originals** downloaded; 10 built to WebP before the stop. **Stopped at the owner's request** (the owner is updating the photo rule in the main session). Resume under the new rule. |
| 2026-11-08 | Photo gap: Commons has only **one full-size bánh tráng nướng photo** (a TP.HCM street stall, generic, to be tagged "Ảnh minh họa"); the other 4 files are 500–600 px. The location's other 4 photos show the Đà Lạt night market (the venue). |

## Result

_(Stage C: what works, photo counts vs. minimums, known gaps.)_

## Requests for the main session

_(Shared-code bugs or changes you need. Don't edit shared files yourself.)_

1. **`tools/build-local-map.mjs` fails when the repository path contains a space.** This
   worktree is under `C:\Work\Claude worktree\…`.
   - Cause: the tool builds `root` from `new URL(import.meta.url).pathname`, which keeps `%20`,
     so `map-config.json` is "not found" and the tool prints its usage line.
   - Fix: `fileURLToPath(import.meta.url)` from `node:url`.
   - Workaround used: a directory junction without spaces, run with
     `node --preserve-symlinks-main <junction>\tools\build-local-map.mjs da-lat fetch|build`.
2. **`tools/photos.py download` stops at the first HTTP 429.** Commons allowed only about two
   original downloads per burst on 2026-11-08.
   - Suggestion: catch 429 in `cmd_download`, wait (honouring `Retry-After`) and retry, as
     `get_json` already does.
   - Workaround used: re-ran `download` with a 75-second pause between runs. Each file is
     still downloaded only once.
