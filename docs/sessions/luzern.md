# Session brief — Luzern (`luzern`)

| | |
|---|---|
| Country | Thụy Sĩ (`thuy-si`) |
| Region field | `null` (Switzerland has no regions in the app) |
| Branch | `dest/luzern` (own git worktree recommended) |
| Your paths | `data/destinations/luzern/`, `assets/destinations/luzern/`, `assets/maps/luzern.geojson`, `docs/sessions/luzern.md` |
| URL when done | `#/thuy-si/luzern` |

## How to start this session

Start a new Claude Code session in this repository, on a new worktree or branch `dest/luzern`
from `main`, and paste:

> Read CLAUDE.md, docs/PLAYBOOK-destination.md and docs/sessions/luzern.md. Build the **Luzern**
> destination by following the playbook. Work only on branch dest/luzern and only in your own
> paths. Start with stage A (research) and present the proposal for my approval before building.

## Context (verify before you rely on it)

- City on Lake Lucerne (Vierwaldstättersee) and the Reuss. Vietnamese texts; proper names keep their spelling. Vietnamese also says "Lucerne": choose one name with the owner.
- **Inland**: lakes and rivers come from OSM water polygons. Lake Lucerne is a large multipolygon, so check it renders.
- Swiss freedom of panorama: check the Commons rules before using photos of modern works.

## Location ideas (starting points only, not facts)

Cầu Kapellbrücke & tháp nước (Wasserturm); phố cổ; tượng Sư tử Lucerne (Löwendenkmal); cầu Spreuerbrücke; tường thành Musegg; du thuyền hồ Lucerne (experience); núi Pilatus / Rigi (far, only via an off-screen hint or a larger bbox); KKL (modern building: check FoP). Food: Luzerner Chügelipastete, fondue, Swiss chocolate.

Pick 5–8 locations with at least 2 food locations. Every coordinate and fact must come from a
source you read (OSM / Wikidata / Wikipedia). Location ids must be `luzern-<slug>`.

## Photos

Commons coverage is excellent for Kapellbrücke and the Lion Monument.

Photo count (owner, updated 2026-11-08): **at most 3 photos per place**, both the destination and
each location (food too). Aim for exactly 3; fewer only if no suitable licensed photo exists.

Wikimedia Commons first (CC0 / PD / CC BY / CC BY-SA). If Commons can't supply 3, use Flickr (CC, never ND), Unsplash or Pexels as described in the playbook (step B4b). Report gaps instead of padding.

## Map notes

Keep the bbox to the city and the lake shore. Mountains far away get off-screen hints.

---

## Proposal

Stage A, 2026-11-08. Sources read: Wikidata (SPARQL), OpenStreetMap (Overpass, tags incl.
`check_date`), English and German Wikipedia, and the venues' own websites (food only).

### Destination

- **Luzern**: capital of the canton of Luzern, about 86,700 inhabitants (2025), the most populous
  city in Central Switzerland. It lies on Lake Lucerne where the Reuss flows out, within sight of
  Pilatus and Rigi (en.wikipedia "Lucerne").
- Name: vi.wikipedia's article is titled **"Luzern"** (Wikidata Q4191 sitelink), consistent with
  "Zürich". Proposed: city "Luzern", lake "hồ Luzern" (German Vierwaldstättersee). See question 1.
- Coordinates: Wikidata [Q4191](https://www.wikidata.org/wiki/Q4191) P625 = 47.0523, 8.3059.
- Draft summary: "Thành phố bên hồ Luzern, nơi sông Reuss chảy qua phố cổ với những cây cầu gỗ có
  mái che, nhìn ra núi Pilatus và Rigi."

### Locations (8)

| id | Tên (vi) | Category (tags) | lat, lon | Coordinate source | Facts (source) |
|---|---|---|---|---|---|
| `luzern-kapellbrucke` | Cầu Kapellbrücke và tháp nước | attraction (history) | 47.05163, 8.30741 | OSM [way 396669328](https://www.openstreetmap.org/way/396669328) (covered bridge). WD [Q25225](https://www.wikidata.org/wiki/Q25225) ≈ 9 m | Xây khoảng năm 1365. Dài 204,7 m, cây cầu gỗ có mái che cổ nhất châu Âu. Cháy ngày 18/8/1993, mở lại 14/4/1994. Tháp nước (Wasserturm) hình bát giác cao 34,5 m. ([en.wikipedia](https://en.wikipedia.org/wiki/Kapellbr%C3%BCcke)) |
| `luzern-lowendenkmal` | Tượng Sư tử Luzern (Löwendenkmal) | history (culture) | 47.05844, 8.31087 | OSM [node 1485039642](https://www.openstreetmap.org/node/1485039642). WD [Q688214](https://www.wikidata.org/wiki/Q688214) ≈ 1 m | Tạc vào vách đá năm 1820–1821 theo thiết kế của Bertel Thorvaldsen. Tưởng niệm lính cận vệ Thụy Sĩ tử trận tại điện Tuileries (Paris) năm 1792. Dài 10 m, cao 6 m. ([en.wikipedia](https://en.wikipedia.org/wiki/Lion_Monument)) |
| `luzern-spreuerbrucke` | Cầu Spreuerbrücke | history (culture) | 47.05179, 8.30183 | OSM [way 396669333](https://www.openstreetmap.org/way/396669333). WD [Q680284](https://www.wikidata.org/wiki/Q680284) ≈ 15 m | Cầu gỗ có mái che thứ hai còn lại ở Luzern, dựng lại sau trận lũ năm 1566. Loạt tranh "Vũ điệu tử thần" (Totentanz) vẽ năm 1616–1637, còn 45 trên 67 bức. ([en.wikipedia](https://en.wikipedia.org/wiki/Spreuer_Bridge)) |
| `luzern-museggmauer` | Tường thành Musegg | history (attraction) | 47.05433, 8.30464 | OSM [relation 21285991](https://www.openstreetmap.org/relation/21285991) (centroid). WD [Q1571757](https://www.wikidata.org/wiki/Q1571757) ≈ 34 m (the wall is 870 m long) | Khởi công muộn nhất khoảng năm 1370. Dài 870 m, cao trung bình khoảng 9 m, có 9 tháp. Tháp Zytturm (1442) được quyền điểm chuông trước mọi đồng hồ khác trong thành phố một phút. ([de.wikipedia Museggmauer](https://de.wikipedia.org/wiki/Museggmauer), [Zytturm](https://de.wikipedia.org/wiki/Zytturm_(Luzern))) |
| `luzern-pho-co` | Phố cổ và quảng trường Weinmarkt | culture (attraction) | 47.05200, 8.30471 | OSM [way 134989600](https://www.openstreetmap.org/way/134989600) (square). WD [Q110626674](https://www.wikidata.org/wiki/Q110626674) | Phố cổ nằm chủ yếu ở bờ bắc sông Reuss, còn nhiều nhà khung gỗ với mặt tiền vẽ tranh. Lễ hội hóa trang Fasnacht diễn ra trên các con phố này mỗi cuối đông. ([en.wikipedia](https://en.wikipedia.org/wiki/Lucerne)) |
| `luzern-du-thuyen` | Du thuyền trên hồ Luzern | experience (nature) | 47.05113, 8.31174 | OSM [relation 17371811](https://www.openstreetmap.org/relation/17371811) "Luzern Bahnhofquai" (SGV landing stages, centroid) | Công ty SGV có nguồn gốc từ năm 1836; tàu hơi nước đầu tiên chạy năm 1837. Đội tàu có 5 tàu hơi nước bánh guồng cổ. Tàu chủ lực "Stadt Luzern" (1928) là tàu hơi nước cuối cùng được đóng cho một hồ ở Thụy Sĩ. ([en.wikipedia](https://en.wikipedia.org/wiki/Lake_Lucerne_Navigation_Company), [de.wikipedia](https://de.wikipedia.org/wiki/Stadt_Luzern_(Schiff,_1928))) |
| `luzern-chugelipastete` | Luzerner Chügelipastete (bánh vỏ ngàn lớp nhân thịt viên) | food | 47.05096, 8.30080 | Venue **Wirtshaus Galliker**, Schützenstrasse 1: OSM [way 93459848](https://www.openstreetmap.org/way/93459848) (no check_date; the official site, read 2026-11-08, shows 2026 opening hours) | Vỏ bánh ngàn lớp, nhân ragu thịt bê, thịt viên, nấm và nho khô; được ghi chép từ thế kỷ 18. ([de.wikipedia](https://de.wikipedia.org/wiki/Luzerner_Ch%C3%BCgelipastete)). Galliker serves "Lozärner Chügelipastetli"; family tradition since 1856 ([wirtshaus-galliker.ch/…/tradition](https://wirtshaus-galliker.ch/restaurant-galliker/tradition)). Text: "một địa chỉ tiêu biểu". |
| `luzern-socola` | Sô-cô-la Thụy Sĩ ở Confiserie Bachmann | food (market) | 47.05376, 8.30863 | Venue **Confiserie Bachmann**, Schwanenplatz 7: OSM [node 3497527550](https://www.openstreetmap.org/node/3497527550), check_date 2026-03-05 | Tiệm bánh kẹo của gia đình Bachmann ở Luzern từ năm 1897 ([confiserie.ch/…/geschichte](https://www.confiserie.ch/ueber-uns/geschichte/)). Text: "một địa chỉ tiêu biểu". |

- Category mix: attraction 1, history 3, culture 1, experience 1, food 2.
- Spread: all within ~1 km (Galliker west to Bahnhofquai east, Löwendenkmal north).
- No opening hours or prices (OSM has some, without recent check dates).

**Alternates (verified, not proposed):**
- **Núi Pilatus** (nature): Pilatus Kulm station, OSM [node 11184000039](https://www.openstreetmap.org/node/11184000039)
  (WD [Q33511147](https://www.wikidata.org/wiki/Q33511147)), 46.97926, 8.25564, ≈ 9 km SW of the old town.
  Facts: highest peak Tomlishorn 2,128.5 m; reached by the Pilatusbahn (1889), the world's steepest
  cog railway, max gradient 48% (en/de.wikipedia). Commons: Pilatus (57 files + subcats),
  Pilatusbahn (199). Needs a much larger bbox (see question 2).
- **Bảo tàng Giao thông Thụy Sĩ (Verkehrshaus)**: OSM way 135207248, WD Q670595, opened 1959, ≈ 2 km east.
- **Vườn Sông băng (Gletschergarten)**: OSM way 104278766, WD Q1531237, next to the Lion Monument.
- **KKL Luzern**: OSM relation 1661451, WD Q665311 (modern building; Swiss FoP allows exterior photos).
- **Max Chocolatier** (founded 2009 in Luzern by Patrik König, official site): the shop's street
  address could not be confirmed on its own site, so Bachmann is proposed instead.
- **Restaurant Pfistern** (guild house, guild 1408): rejected, closed for renovation until spring 2027
  (its own website).

### Map area

| | value |
|---|---|
| `bbox` (map-config, lon/lat) | `[8.270, 47.030, 8.345, 47.070]` (≈ 5.7 × 4.4 km: city, the Lucerne basin of the lake, Verkehrshaus shore) |
| `coreBbox` | `[8.298, 47.048, 8.316, 47.060]` (old town, Musegg, station, Schwanenplatz) |
| `bounds` (destination.json) | `[[47.030, 8.270], [47.070, 8.345]]` |
| `initialView` | `[[47.047, 8.296], [47.061, 8.318]]` |

- With Pilatus (question 2): `bbox` `[8.235, 46.965, 8.345, 47.070]` (≈ 8.4 × 11.7 km); Pilatus is then
  reached through an off-screen hint pill.
- `mapLabels` (vi): "Hồ Luzern" (water), "Sông Reuss" (water). Positions set after viewing the map.
- Inland: Lake Lucerne is OSM relation 1442399 (a large multipolygon); check it renders as one body.

### Photo plan (Commons first)

**Swiss freedom of panorama**: as recorded by the Zürich session from
[Commons:Copyright rules by territory/Switzerland](https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/Switzerland):
yes for works permanently in public places (2D and 3D, Art. 27 URG), not for interiors. All proposed
subjects are old (bridge paintings 17th c., Lion Monument 1821) or outdoor public views, so FoP is
not a constraint here. KKL (1998) exteriors would also be fine, but it is not proposed.

| Place | Commons category (files) | Target | Notes |
|---|---|---|---|
| cover | Lucerne (294), Views of Luzern, Lake Lucerne (272) | 3 | Kapellbrücke skyline with the lake and Pilatus |
| Kapellbrücke | Kapellbrücke (135) + Wasserturm Luzern | 3 | |
| Löwendenkmal | Löwendenkmal (Lucerne) (122) | 3 | |
| Spreuerbrücke | Spreuerbrücke (104) | 3 | exterior + a Totentanz panel |
| Musegg | Museggmauer (69 + 10 tower subcats) | 3 | |
| Phố cổ | Buildings in Lucerne, Views of Luzern | 3 | painted façades, Weinmarkt |
| Du thuyền | Stadt Luzern (ship, 1928) (78), Luzern Bahnhofquai (11) | 3 | |
| Chügelipastete | Luzerner Chügelipastete (4) | 3 | generic dish photos, "Ảnh minh họa"; may need Flickr |
| Sô-cô-la (Bachmann) | Chocolate shops in Switzerland (8), searches | 3 | likely generic chocolate photos, "Ảnh minh họa"; possible gap → Flickr/Unsplash/Pexels |

- Expected total: 27 photos. Gap risk only for the two food places.

### Open questions for the owner

1. Names: city **"Luzern"** (as vi.wikipedia) and lake **"hồ Luzern"**? Or "Lucerne"?
2. **Pilatus**: keep the compact city map (recommended, brief says keep the bbox to the city and lake
   shore), or swap Spreuerbrücke for Pilatus with the larger bbox?
3. Approve these 8 locations and the two food venues (Galliker, Bachmann)?

## Status log

| Date | Item |
|---|---|
| 2026-11-08 | Brief created by the main session. Placeholder `destination.json` exists with `"status": "planned"`. |
| 2026-11-08 | Stage A research done on branch `dest/luzern`; proposal written above (8 locations, compact bbox, Pilatus as an option). Waiting for owner approval. |
| 2026-11-08 | **Owner approved** all 8 locations, the compact city map (no Pilatus) and the names "Luzern" / "hồ Luzern". |
| 2026-11-08 | Local map built: OSM extract 2.1 MB → `assets/maps/luzern.geojson` 247 kB. Inland: whole area is land; Lake Lucerne (relation 1442399, 51 outer ways, all closed) and the Reuss render correctly. |
| 2026-11-08 | Photos: 27 (3 per place). 24 from Commons; 3 from Flickr (owner approved downloading them through the browser, because Flickr returns HTTP 429 to `photos.py`). Every built photo checked on a contact sheet. |
| 2026-11-08 | B6 passed at 1440 × 900 and 390 × 844; `status: "published"`. Committed on `dest/luzern` (not pushed, not merged). |

## Result

**Published** (`#/thuy-si/luzern`), 8 locations, 27 photos (exactly 3 per place, including the cover).

- **Works (tested at 1440 × 900 and 390 × 844):** world → Thụy Sĩ → Luzern (from the list card) → fly-in
  and local map fade-in; area lock (dragging can't leave the bbox; min zoom 14.5 on iPhone 13);
  category chips (e.g. "Ẩm thực" shows the 2 food pins and the list "2 địa điểm"); each location's
  gallery, thumbnails, full-screen viewer (arrow keys, Esc), credit line and "Xem trên Google Maps";
  back from location → destination → country (sheet button and top-bar arrow); the credits page lists
  all Luzern photos, with "chỉ dùng phi thương mại" on the 2 NC Flickr photos. No 404s or console
  errors after a reload.
- **Map:** 247 kB. Labels: "Hồ Luzern", "Sông Reuss" and the OSM suburb "Reussbühl".
- **Photos per place:** cover 3, Kapellbrücke 3, Löwendenkmal 3, Spreuerbrücke 3, Musegg 3, phố cổ 3,
  du thuyền 3, Chügelipastete 3, sô-cô-la 3.
  - Chügelipastete: all 3 tagged "Ảnh minh họa" (none was taken at Wirtshaus Galliker): one plated
    dish (Commons), one home-made (Flickr, CC BY-NC-SA 2.0) and one photo of a **replica** pie from an
    exhibition (Commons, "Nachbildung"); the alt text says "Mô hình".
  - Sô-cô-la: #1 chocolate counter inside Confiserie Bachmann Luzern (Flickr, CC BY-NC-SA 2.0, taken
    2006), #2 the Bachmann shop front next to Gübelin (Flickr, CC BY-SA 2.0, 2007, small "eirikso.com"
    watermark), #3 a chocolate shop in Luzern that isn't Bachmann (Commons, tagged "Ảnh minh họa").
  - NC photos (remove if the site ever becomes commercial): `luzern-chugelipastete-02`, `luzern-socola-01`.
- **Known gaps / notes:**
  - Wirtshaus Galliker has no OSM `check_date`; its own website (read 2026-11-08) shows 2026 hours and
    the dish. Bachmann's Schwanenplatz shop has check_date 2026-03-05.
  - The Bachmann shop photos are from 2006–2007; the shop front may look different today.
  - On iPhone 13 at the lowest zoom the 8 pins sit close together, so only some names are shown until
    the user zooms in (normal collision handling).

## Requests for the main session

1. **`tools/photos.py` caches originals by position, not by file.** I inserted a Flickr entry at #2 of a
   place that already had a Commons file cached as `02.jpg`. `download` skipped #2 ("exists") and the
   old file would have been built under the new photo's credit; the Commons file was also downloaded
   again as `03.jpg`. I fixed it by hand (deleted the stale `02.jpg`). Suggestion: store the source
   file name or URL next to each `NN.jpg` (e.g. in `metadata.json`) and re-download when it differs,
   or warn.
2. **`.claude/launch.json` hardcodes port 5520 in `runtimeArgs`.** With several worktrees, another
   session's server already held 5520, so `preview_start` "moved" to 5521 while python still bound
   5520 and served the other worktree. I served this worktree with a temporary
   `python -m http.server 5531` instead (I couldn't edit the shared file). Suggestion: one entry per
   worktree port, or a launcher that reads the port from the environment.
3. **Playbook B4b:** Chrome blocks a second script-triggered download from the same site; clicking
   Flickr's own "Download the Large 2048 size" link on the `/sizes/k/` page works. Worth a line in B4b.
4. Status of 1–3: fixed on main (2026-11-08): `photos.py` tracks each cached file's source (`NN.source.json`), `tools/dev-server.py` with one launch entry per port, and the Flickr download steps are in B4b.
