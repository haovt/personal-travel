# Session brief — Hội An (`hoi-an`)

| | |
|---|---|
| Country | Việt Nam (`viet-nam`) |
| Region field | `trung` (Miền Trung) |
| Branch | `dest/hoi-an` (own git worktree recommended) |
| Your paths | `data/destinations/hoi-an/`, `assets/destinations/hoi-an/`, `assets/maps/hoi-an.geojson`, `docs/sessions/hoi-an.md` |
| URL when done | `#/viet-nam/hoi-an` |

## How to start this session

Start a new Claude Code session in this repository, on a new worktree or branch `dest/hoi-an`
from `main`, and paste:

> Read CLAUDE.md, docs/PLAYBOOK-destination.md and docs/sessions/hoi-an.md. Build the **Hội An**
> destination by following the playbook. Work only on branch dest/hoi-an and only in your own
> paths. Start with stage A (research) and present the proposal for my approval before building.

## Context (verify before you rely on it)

- Hội An Ancient Town is a UNESCO World Heritage site (verify the year and wording on whc.unesco.org).
- Since the 2025 reform the old town is in **phường Hội An, TP Đà Nẵng** (Phase 0 found this on thuvienphapluat.vn; re-check). The owner decided Hội An is its **own destination**, separate from Đà Nẵng.
- Coastal: the map should include the old town, the Thu Bồn / Hoài river and the beach (An Bàng / Cửa Đại) if the bbox stays reasonable.

## Location ideas (starting points only, not facts)

Chùa Cầu (Japanese Covered Bridge); phố cổ Hội An; một hội quán (e.g. Phúc Kiến); một nhà cổ (e.g. Tấn Ký); chợ Hội An; sông Hoài về đêm (đèn lồng, thả đèn hoa đăng → experience); biển An Bàng; làng gốm Thanh Hà; rừng dừa Bảy Mẫu (Cẩm Thanh). Food: cao lầu, cơm gà Hội An, bánh mì, mì Quảng.

Pick 5–8 locations with at least 2 food locations. Every coordinate and fact must come from a
source you read (OSM / Wikidata / Wikipedia). Location ids must be `hoi-an-<slug>`.

## Photos

Commons has many Hội An photos; check categories such as the old town and the Japanese Covered Bridge. Cao lầu and cơm gà need 3 photos each (generic "Ảnh minh họa" allowed).

Photo count (owner, updated 2026-11-08): **at most 3 photos per place**, both the destination and
each location (food too). Aim for exactly 3; fewer only if no suitable licensed photo exists.

Wikimedia Commons first (CC0 / PD / CC BY / CC BY-SA). If Commons can't supply 3, use Flickr (CC, never ND), Unsplash or Pexels as described in the playbook (step B4b). Report gaps instead of padding.

## Map notes

Old town streets are dense: keep `coreBbox` tight around the old town.

---

## Proposal

Stage A research, 2026-11-08. Waiting for owner approval; nothing is built yet.

### Facts about the destination

- **UNESCO:** Hội An Ancient Town is a World Heritage Site, inscribed in **1999**.
  - Wikidata Q5965459 has P757 = 948 and P1435 = World Heritage Site.
  - vi.wikipedia "Phố cổ Hội An" gives 4/12/1999 (23rd session); en.wikipedia "Hội An Old Town" gives 12/12/1999.
    Only the year is used.
  - whc.unesco.org/en/list/948 refuses scripted reads (HTTP 403), so the date wasn't checked there.
- **Since the 2025 reform:** the old town is in **phường Hội An, TP Đà Nẵng** (vi.wikipedia "Hội An (phường)").
  - Quảng Nam and Đà Nẵng merged on 12/6/2025 (Resolution 202/2025/QH15).
  - The former city of Hội An is split into phường Hội An, Hội An Đông and Hội An Tây. An Bàng and Thanh Hà
    are in Hội An Tây; Cẩm Thanh (Bảy Mẫu) is in Hội An Đông.
- **Destination point:** OSM node/110506070 (place=city "Hội An"), 15.87959, 108.33194.
  Wikidata Q36160 gives 15.87767, 108.33265, about 220 m away.
- **Draft summary:** "Đô thị cổ bên sông Thu Bồn, từng là thương cảng sầm uất thế kỷ 17–18, được UNESCO công nhận
  di sản thế giới năm 1999." Sources: vi.wikipedia "Phố cổ Hội An", Wikidata Q5965459.

### Locations (8 proposed)

| # | id | Tên | Category | lat, lon | Coordinate source | Facts (source) |
|---|---|---|---|---|---|---|
| 1 | `hoi-an-chua-cau` | Chùa Cầu | attraction (+history) | 15.87712, 108.32602 | OSM way/39268284 (centre). Wikidata Q1091054 gives 15.87719, 108.32597 (8 m) | Dài khoảng 18 m (vi.wiki, Wikidata P2043) · Chúa Nguyễn Phúc Chu đặt tên Lai Viễn Kiều năm 1719 (vi/en.wiki) · Đại trùng tu xong 3/8/2024 (vi.wiki) |
| 2 | `hoi-an-hoi-quan-phuc-kien` | Hội quán Phúc Kiến | culture | 15.87814, 108.33099 | OSM way/320722329 (centre) | 46 Trần Phú · Lớn nhất trong năm hội quán người Hoa ở Hội An · Đổi thành hội quán năm 1792 (vi.wiki "Phố cổ Hội An") |
| 3 | `hoi-an-nha-co-tan-ky` | Nhà cổ Tấn Ký | history | 15.87646, 108.32783 | OSM way/595299310 (centre). Wikidata Q140915999 gives 15.87645, 108.32781 | 101 Nguyễn Thái Học (Wikivoyage) |
| 4 | `hoi-an-song-hoai` | Sông Hoài về đêm | experience | 15.87649, 108.32646 | OSM way/35952574 (Cầu An Hội, centre) | Đêm rằm phố cổ: từ năm 1998, mỗi đêm 14 âm lịch, phố cổ tắt điện, thắp đèn lồng, thả hoa đăng (vi.wiki "Phố cổ Hội An") |
| 5 | `hoi-an-bien-an-bang` | Bãi biển An Bàng | nature | 15.9137, 108.34074 | Wikivoyage "Hoi An" (edited 2026-06-20). The point lies inside OSM beach relation/7456917 (checked with Overpass is_in). Wikidata Q141622910 has no coordinates | Thuộc dải bờ biển Hội An dài hơn 7 km (vi.wiki "Bãi biển An Bàng") |
| 6 | `hoi-an-rung-dua-bay-mau` | Rừng dừa Bảy Mẫu | nature (+experience) | 15.875, 108.37417 | Wikidata Q138660353. OSM node/12295680120 (a basket-boat tour on the forest road) gives 15.87614, 108.37379 (140 m) | Rừng dừa nước hơn 80 ha · Di tích cấp tỉnh năm 2007 · Tham quan bằng thuyền thúng (vi.wiki) |
| 7 | `hoi-an-cao-lau` | Cao lầu | food | 15.87950, 108.32944 | OSM node/6892599587 "Quan Cao Lau Ba Le", 49/3 Trần Hưng Đạo | Venue **Cao lầu Bá Lễ**. Legend: the noodles are soaked in water from the old Bá Lễ well (en.wiki "Cao lầu"; the well is OSM node/12065583507, about 100 m away). ⚠ OSM check_date 2023-01-03, last edited 2024-11 |
| 8 | `hoi-an-com-ga` | Cơm gà | food | 15.87849, 108.33043 | OSM node/4120953690, 22 Phan Châu Trinh | Venue: OSM tags it "Cơm gà Bà Bụi". It is widely known as "Bà Buội", but I found no Wikipedia/OSM source for that spelling. ⚠ OSM check_date 2023-01-03 |

**Distances:** 1–4 and 7–8 are all in the old town, within about 600 m. An Bàng is about 4 km north. Bảy Mẫu is
about 5 km east and gets an off-screen hint pill at old-town zoom.

**Alternates** (researched, not in the 8):
- **Bánh mì Phượng** (food, 2B Phan Châu Trinh, OSM node/4279536690). Best-verified food venue: own vi.wikipedia
  article, opened in the 1990s, OSM check_date 2025-02-18, Commons category with 6 files.
- **Chợ Hội An** (market, OSM way/35952504). Wikivoyage mentions a food court.
- **Làng gốm Thanh Hà** (culture, Wikidata Q139986764, OSM node/4171964390). Its craft has been on the national
  intangible heritage list since 2019. No Commons category found.

### Map area

- `bbox` (lon/lat): **[108.295, 15.855, 108.395, 15.930]**, about 10.7 × 8.3 km, much smaller than Đà Nẵng.
  - Covers the old town, Thanh Hà, the Thu Bồn estuary at Cửa Đại, Bảy Mẫu and An Bàng.
- `coreBbox` (residential streets): **[108.318, 15.871, 108.338, 15.885]**, the old town and An Hội only.
- `initialView`: [[15.866, 108.312], [15.918, 108.385]].
- `riverLabels`: Sông Thu Bồn.
- Possible `mapLabels`: Biển Đông (sea), Phố cổ Hội An (area).
- The area is coastal, so the coastline step is needed.
- **Built with (2026-11-08):** `bbox` widened to [108.24, 15.835, 108.43, 15.955], about 2× the initial view, so the
  area lock's minimum zoom stays below the initial view's zoom. `bounds` in `destination.json` matches.

### Photo plan (Commons, CC0/PD/CC BY/CC BY-SA)

_Superseded by the owner's 3-per-place rule (2026-11-08); see Result for what was built._

The sites are old buildings, so the pre-2023 rule doesn't apply to them. Chùa Cầu was restored in 2022–2024: lead
with photos of how it looks now, then add older photos.

| Item | Target | Commons source | Expected | Risk |
|---|---|---|---|---|
| Cover (destination) | ≥ 5 | Category:Hoi An Old Town (378 files), Lanterns in Hoi An (71), Thu Bon River in Hoi An (78) | 6–8 | low |
| Chùa Cầu | ≥ 3 | Category:Japanese Bridge (126) | 5–6 | low |
| Hội quán Phúc Kiến | ≥ 3 | Fujian Assembly Hall, Hoi An (37) + Tam Quan (18) | 4–5 | low |
| Nhà cổ Tấn Ký | ≥ 3 | Tan Ky Old House (9) | 3 | medium (small category, interiors) |
| Sông Hoài về đêm | ≥ 3 | Lanterns in Hoi An (71), Hội An lantern festival (7), Thu Bon River in Hoi An (78) | 5–6 | low |
| Bãi biển An Bàng | ≥ 3, up to 10 | An Bang Beach (12) | 5–8 | low |
| Rừng dừa Bảy Mẫu | ≥ 3, up to 10 | no category; file search "Cam Thanh coconut", "basket boat Hoi An" | 3–6 | **medium/high** |
| Cao lầu | ≥ 3 | Category:Cao lầu (12), generic dish photos marked "Ảnh minh họa" | 3–5 | low |
| Cơm gà | ≥ 3 | no category; file search "cơm gà Hội An". Generic chicken-rice photos may not match the Hội An style | 0–3 | **high**: possible gap |

### Open questions for the owner

1. Are the 8 locations right, or should one be swapped for Bánh mì Phượng, Chợ Hội An or Làng gốm Thanh Hà?
2. Both food venues (Cao lầu Bá Lễ, Cơm gà at 22 Phan Châu Trinh) were last checked in OSM in 2023. Can they be
   pinned with that note, or should a dish be pinned at Chợ Hội An or replaced by Bánh mì Phượng (checked 2025)?
3. If Commons can't supply 3 cơm gà photos, should I report the gap, or do you want to suggest another source?

## Status log

| Date | Item |
|---|---|
| 2026-11-08 | Brief created by the main session. Placeholder `destination.json` exists with `"status": "planned"`. |
| 2026-11-08 | Session started in worktree, branch renamed to `dest/hoi-an`, dev server on port 5521. Stage A research done (Wikidata SPARQL, Overpass, OSM API, vi/en Wikipedia, Wikivoyage, Commons category counts). Proposal written; waiting for approval. Note: Wikimedia APIs rate-limit hard (HTTP 429), probably because parallel sessions share the IP. |
| 2026-11-08 | Owner approved the 8 locations; both food venues pinned with an OSM check-date note; a cơm gà photo shortfall is to be reported as a gap. |
| 2026-11-08 | Built: `destination.json` (temporarily `published` for browser testing), `locations.json`, `map-config.json`. Local map built; bbox widened to [108.24, 15.835, 108.43, 15.955] (see Requests 4) and island holes fixed (Requests 1). Checked at 1440 × 900 with the Browser pane hidden, so animations were not checked. |
| 2026-11-08 | Photos picked in `photo-selection.json` (not yet run through `photos.py`): cover 6, Chùa Cầu 6, Phúc Kiến 5, Tấn Ký 4, Sông Hoài 6, An Bàng 6. **Image search stopped at the owner's request** (a new photo rule is coming from the main session) before Bảy Mẫu, cao lầu and cơm gà. |
| 2026-11-08 | Committed the draft, merged `main` (no conflicts; main's photo-rule wording kept in this brief). Rebuilt the map with the fixed tool, no junction and no post-processing: islands draw as land. |
| 2026-11-08 | Cut every place to 3 photos. Found cao lầu (3), cơm gà (3) and one Bảy Mẫu photo on Commons; added 2 Bảy Mẫu photos from Pexels (no CC-licensed Flickr photos of the forest; every candidate was "All rights reserved"; Unsplash showed a bot check). `photos.py` meta/download/build: 27 photos, all OK, 12 MB. Each built photo checked on a contact sheet; Vietnamese alt text written. |
| 2026-11-08 | B6 passed at 1440 × 900 and 390 × 844 with the Browser pane visible: world → country → Hội An (fly-in, local map fade, area lock holds), all 8 locations (3/3 gallery, thumbnails, full-screen viewer, credit line, Google Maps link), back buttons, category chips, credits page. No console errors. Status set to `published`. |
| 2026-11-08 | Owner: drop the third Bảy Mẫu photo (Pexels 38116999, place unconfirmed). Removed from selection, locations and assets; credits rebuilt (26 photos). Bảy Mẫu: 2 photos, reported as a gap. |

## Result

**Published 2026-11-08.** `#/viet-nam/hoi-an`, 8 locations, 26 photos (3 per place except Bảy Mẫu with 2; 25 Wikimedia Commons, 1 Pexels).

| Place | Photos | Notes |
|---|---|---|
| Cover | 3 | River with boats, riverside houses, lantern street at night |
| Chùa Cầu | 3 | Two after the 2022–2024 restoration, one from before |
| Hội quán Phúc Kiến | 3 | Gate, main hall, dragon fountain |
| Nhà cổ Tấn Ký | 3 | Facade, interior, corridor |
| Sông Hoài về đêm | 3 | Floating lanterns, river at night, boats |
| Bãi biển An Bàng | 3 | Beach at dusk, sand and waves, "Bãi tắm An Bàng" stone |
| Rừng dừa Bảy Mẫu | **2** | 1 Commons (CC0, Cẩm Thanh) + 1 Pexels (described as Hội An). **Gap: 1 photo** |
| Cao lầu | 3 | All "Ảnh minh họa" (Hội An bowls, not the pinned eatery) |
| Cơm gà | 3 | All "Ảnh minh họa" (generic cơm gà, CC0) |

- Map: 347 kB, built by the fixed `build-local-map.mjs` with no post-processing.
- **Gap:** Rừng dừa Bảy Mẫu has 2 photos, not 3.
  - The owner dropped a third Pexels photo (38116999) because its page didn't confirm the place.
  - Commons has only one photo of the forest. Every Flickr candidate was "All rights reserved", and Unsplash
    showed a bot check.
  - The owner's own photo, or a later Unsplash or Flickr pass, could fill it.
- **Check, please:**
  - Venue names: "Cao lầu Bá Lễ" (OSM writes "Ba Le"; the accents are my reading after the nearby Bá Lễ well) and
    "Cơm gà Bà Buội" (from OSM's second-branch node). Both venues were last checked in OSM in 2023.

## Requests for the main session

1. **`tools/build-local-map.mjs`: multipolygon holes go to every outer ring.**
   - In `addPolygon`, every inner ring of a relation is attached to *every* outer ring.
   - The Thu Bồn river relation has several outers, so the small extra outers carry all the island holes. Drawn on
     their own, those holes are filled blue: An Hội islet and Cẩm Nam island showed as water with streets on top.
   - Fix: keep a hole only if it lies inside the outer ring, e.g. `.filter((h) => h.some((p) => pointInRing(ring, p)))`
     before pushing the polygon.
   - Workaround here: after `build`, I ran a one-off script that drops holes outside their own outer ring
     (21 holes, 1 polygon). It is noted in the GeoJSON `properties.postProcessed`. A rebuild with the fixed tool gives
     the same result. Đà Nẵng may have the same problem (not checked).
2. **`tools/build-local-map.mjs` fails when the repo path contains a space.**
   - The worktree is under `C:\Work\Claude worktree\…`. `new URL(import.meta.url).pathname` keeps `%20`, so the tool
     can't find `map-config.json`.
   - Fix: `fileURLToPath(import.meta.url)` from `node:url`.
   - Workaround here: ran it through a directory junction without spaces, with `node --preserve-symlinks-main`.
3. **`tools/commons_candidates.py` crashes when a file has no extmetadata.**
   - Commons returns `"extmetadata": []` instead of `{}` for some files, so `em.get(...)` raises `AttributeError`.
   - Fix: `em = ii.get("extmetadata") or {}`.
   - Workaround here: a scratch wrapper that imports the module and normalises the field.
4. **`js/app.js:302` throws `Invalid LatLng object: (NaN, NaN)` on the first fly-in to a destination after a page load.**
   - Seen for Đà Nẵng too.
   - It looks like the area lock (`lockWhenLanded`) is applied before the fly starts, so `flyToBounds` targets the
     view the map is already at, and Leaflet's `flyTo` divides by zero.
   - Tested only with the Browser pane hidden (animations throttled), so please re-check with the pane visible.
   - For Hội An I made the bbox about 2× the initial view, like Đà Nẵng's, so the lock's minimum zoom stays below
     the initial view's zoom.
5. **Country map: the Hội An pin overlaps Đà Nẵng's** at country zoom (about 25 km apart), and their labels collide.
   A click on the Hội An pin at 1440 × 900 didn't open it; the list works. Maybe use label collision or an
   offset/cluster for nearby pins.
6. **Accessibility:** the destination list items on the country sheet are buttons with no accessible name
   (`read_page` shows them unnamed); an `aria-label` with the destination name would help screen readers.
7. Status of 1–4: fixed on main (2026-11-08) and confirmed here: rebuild without workaround, no NaN error on first
   fly-in.
