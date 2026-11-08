# Session brief — Montreux (`montreux`)

| | |
|---|---|
| Country | Thụy Sĩ (`thuy-si`) |
| Region field | `null` (Switzerland has no regions in the app) |
| Branch | `dest/montreux` (own git worktree recommended) |
| Your paths | `data/destinations/montreux/`, `assets/destinations/montreux/`, `assets/maps/montreux.geojson`, `docs/sessions/montreux.md` |
| URL when done | `#/thuy-si/montreux` |

## How to start this session

Start a new Claude Code session in this repository, on a new worktree or branch `dest/montreux`
from `main`, and paste:

> Read CLAUDE.md, docs/PLAYBOOK-destination.md and docs/sessions/montreux.md. Build the **Montreux**
> destination by following the playbook. Work only on branch dest/montreux and only in your own
> paths. Start with stage A (research) and present the proposal for my approval before building.

## Context (verify before you rely on it)

- Lake Geneva (Lac Léman) riviera. The owner chose "Lake Geneva – Montreux". Decide the Vietnamese display name with the owner (e.g. "Montreux – hồ Léman"; "hồ Genève" is also used).
- The **Lavaux vineyard terraces** (between Lausanne and Montreux) are a UNESCO World Heritage site (verify the year). Including them makes the bbox long and narrow along the lake.
- **Inland**: Lake Geneva comes from OSM water polygons. It is very large, so check clipping and rendering.
- Swiss freedom of panorama: check the Commons rules (e.g. for the Freddie Mercury statue, a modern work).

## Location ideas (starting points only, not facts)

Lâu đài Chillon; bờ hồ Montreux (Quai); tượng Freddie Mercury (check FoP); ruộng nho bậc thang Lavaux; Vevey (phố bên hồ); Rochers-de-Naye (tàu răng cưa, view → experience, far). Food: cá rô hồ (filets de perche), fondue moitié-moitié, rượu vang Lavaux (alcohol: present it as a regional speciality, factually).

Pick 5–8 locations with at least 2 food locations. Every coordinate and fact must come from a
source you read (OSM / Wikidata / Wikipedia). Location ids must be `montreux-<slug>`.

## Photos

Chillon and Lavaux are well covered on Commons.

Photo count (owner, updated 2026-11-08): **at most 3 photos per place**, both the destination and
each location (food too). Aim for exactly 3; fewer only if no suitable licensed photo exists.

Wikimedia Commons first (CC0 / PD / CC BY / CC BY-SA). If Commons can't supply 3, use Flickr (CC, never ND), Unsplash or Pexels as described in the playbook (step B4b). Report gaps instead of padding.

## Map notes

A long lake-shore strip: bbox from about Vevey to Villeneuve, adding Lavaux if size allows. `coreBbox`: central Montreux only.

---

## Proposal

Stage A, 2026-11-08. Sources read: Wikidata (SPARQL), OpenStreetMap (Overpass, incl. `check_date`),
English, French and Vietnamese Wikipedia, Commons (category sizes, Swiss copyright page) and the
venues' own websites (food only).

### Destination

- **Montreux**: a municipality on the north-east shore of Lake Geneva at the foot of the Alps, in the
  Riviera-Pays-d'Enhaut district of the canton of Vaud; 26,090 inhabitants (Dec 2020), about 85,000
  in the Vevey–Montreux agglomeration (2019). A tourist destination since the 19th century thanks to
  its mild climate, with Belle Époque palaces and hotels on the shore (en.wikipedia "Montreux").
  Montreux Jazz Festival founded 1967 by Claude Nobs (en.wikipedia "Montreux Jazz Festival").
- Coordinates: Wikidata [Q69354](https://www.wikidata.org/wiki/Q69354) P625 = 46.435, 6.9125.
- Names: vi.wikipedia titles are "Montreux", "Hồ Genève", "Lâu đài Chillon", "Lavaux". Proposed:
  destination "Montreux", lake label "Hồ Genève". See question 1.
- Draft summary: "Thị trấn nghỉ dưỡng bên bờ hồ Genève, dưới chân dãy Alpes, nổi tiếng với lâu đài
  Chillon, lễ hội nhạc jazz và những ruộng nho bậc thang Lavaux gần đó."

### Locations (8)

| id | Tên (vi) | Category (tags) | lat, lon | Coordinate source | Facts (source) |
|---|---|---|---|---|---|
| `montreux-chillon` | Lâu đài Chillon | history (attraction) | 46.41424, 6.92760 | OSM [relation 6501627](https://www.openstreetmap.org/relation/6501627) (castle, centroid). WD [Q372647](https://www.wikidata.org/wiki/Q372647) ≈ 8 m | Lâu đài trên một mỏm đá vôi nhô ra hồ, giữa Montreux và Villeneuve; tháp chính có từ thế kỷ 11. Quân Bern chiếm năm 1536 và giải thoát François Bonivard; năm 1816 Byron viết bài thơ "Người tù ở Chillon". Theo trang web của lâu đài, đây là di tích lịch sử được tham quan nhiều nhất Thụy Sĩ. ([en.wikipedia](https://en.wikipedia.org/wiki/Chillon_Castle), [fr.wikipedia](https://fr.wikipedia.org/wiki/Ch%C3%A2teau_de_Chillon)) |
| `montreux-tuong-freddie-mercury` | Tượng Freddie Mercury bên bờ hồ | culture (attraction) | 46.43276, 6.90951 | OSM [node 1226470695](https://www.openstreetmap.org/node/1226470695) (artwork, start_date 1996, artist Irena Sedlecká). WD [Q12138448](https://www.wikidata.org/wiki/Q12138448) / [Q63145175](https://www.wikidata.org/wiki/Q63145175) ≈ 65–75 m south; OSM node chosen (mapped in place) | Tượng đồng cao 3 m của nhà điêu khắc Séc Irena Sedlecká, tạc Freddie Mercury như lúc mở màn buổi diễn ở Wembley năm 1986. Khánh thành ngày 25/11/1996, có mặt Brian May và Roger Taylor. Nằm cuối quảng trường Place du Marché, trên kè Quai de la Rouvenaz. ([fr.wikipedia](https://fr.wikipedia.org/wiki/Statue_de_Freddie_Mercury)) |
| `montreux-lavaux` | Ruộng nho bậc thang Lavaux | nature (culture) | 46.47318, 6.79596 | Pinned at the village of **Saint-Saphorin** (inside the UNESCO area, start of the "Terrasses de Lavaux" trail): OSM [node 240024056](https://www.openstreetmap.org/node/240024056), WD [Q70535](https://www.wikidata.org/wiki/Q70535). Lavaux itself is WD [Q688060](https://www.wikidata.org/wiki/Q688060) (46.4919, 6.7461, a centroid 5 km further west) | 830 ha ruộng nho bậc thang trải khoảng 30 km dọc bờ bắc hồ Genève; có từ thế kỷ 11 dưới thời các tu viện. Di sản thế giới UNESCO từ tháng 7/2007. Giống nho chính: Chasselas. ([en.wikipedia](https://en.wikipedia.org/wiki/Lavaux)). Saint-Saphorin: nhà thờ hiện nay xây năm 1517–1521 ([fr.wikipedia](https://fr.wikipedia.org/wiki/Saint-Saphorin_(Lavaux))) |
| `montreux-rochers-de-naye` | Núi Rochers-de-Naye và tàu răng cưa | experience (nature) | 46.43182, 6.97605 | OSM [node 26864467](https://www.openstreetmap.org/node/26864467) (summit, ele 2042). WD [Q676030](https://www.wikidata.org/wiki/Q676030) ≈ 14 m | Đỉnh núi cao 2.042 m nhìn xuống hồ Genève. Tàu răng cưa Montreux–Glion–Rochers-de-Naye dài 10,36 km, vượt độ cao khoảng 1.600 m trong 55 phút; đoạn Glion–Rochers-de-Naye mở năm 1892. Ga trên đỉnh ở độ cao 1.968 m. ([en.wikipedia](https://en.wikipedia.org/wiki/Rochers_de_Naye), [en.wikipedia railway](https://en.wikipedia.org/wiki/Montreux%E2%80%93Glion%E2%80%93Rochers-de-Naye_railway), [fr.wikipedia](https://fr.wikipedia.org/wiki/Rochers_de_Naye)) |
| `montreux-fourchette-vevey` | Chiếc nĩa khổng lồ ở Vevey (La Fourchette) | attraction (culture) | 46.45776, 6.84626 | OSM [node 2368669635](https://www.openstreetmap.org/node/2368669635). WD [Q38250820](https://www.wikidata.org/wiki/Q38250820) ≈ 1 m | Chiếc nĩa bằng thép không gỉ cao 8 m cắm trong hồ, do nghệ sĩ Thụy Sĩ Jean-Pierre Zaugg làm năm 1995 nhân kỷ niệm 10 năm bảo tàng Alimentarium; được giữ lại vĩnh viễn từ cuối năm 2008. Cách tượng Charlie Chaplin (John Doubleday, 1982) khoảng 10 m; Chaplin sống ở vùng Vevey từ năm 1952 đến khi mất. ([fr.wikipedia](https://fr.wikipedia.org/wiki/Fourchette_de_Vevey), OSM node 2995879219 / WD Q63341652, [en.wikipedia Vevey](https://en.wikipedia.org/wiki/Vevey)) |
| `montreux-filets-de-perche` | Phi lê cá rô hồ (filets de perche) | food | 46.39577, 6.92389 | Venue **Café-Restaurant L'Étoile**, Grand-Rue 74, 1844 Villeneuve: OSM [node 918022476](https://www.openstreetmap.org/node/918022476) (check_date 2023-11-11; its website, read 2026-11-08, shows © 2026 and current hours) | Món phi lê cá rô (perche) áp chảo bơ kiểu meunière, rất phổ biến ở các nhà hàng quanh hồ Genève ([fr.wikipedia Cuisine suisse](https://fr.wikipedia.org/wiki/Cuisine_suisse), [en.wikipedia Swiss cuisine](https://en.wikipedia.org/wiki/Swiss_cuisine)). L'Étoile: "depuis 1997", menu mentions "évidemment le filet de perche" ([restaurantetoile.ch](https://www.restaurantetoile.ch/)). Text: "một địa chỉ tiêu biểu". |
| `montreux-fondue` | Fondue phô mai | food | 46.43354, 6.91328 | Venue **Caveau des Vignerons**, Rue Industrielle 30bis, 1820 Montreux: OSM [node 6195576914](https://www.openstreetmap.org/node/6195576914), check_date 2026-06-19 | Phô mai nấu chảy với rượu vang trắng trong nồi chung, chấm bánh mì bằng nĩa dài; được quảng bá thành món quốc hồn quốc túy của Thụy Sĩ từ thập niên 1930 ([en.wikipedia](https://en.wikipedia.org/wiki/Fondue)). Kiểu "moitié-moitié" (nửa Gruyère, nửa Vacherin fribourgeois) là đặc sản của bang Fribourg láng giềng ([fr.wikipedia](https://fr.wikipedia.org/wiki/Fondue_moiti%C3%A9-moiti%C3%A9)). The venue's menu lists "Fondue traditionnelle" (not stated as moitié-moitié, so the text won't claim it). Text: "một địa chỉ tiêu biểu". |
| `montreux-vang-lavaux` | Rượu vang Lavaux | food (experience) | 46.47490, 6.77743 | Venue **Lavaux Vinorama**, Route du Lac 2, 1071 Rivaz: OSM [node 6005394385](https://www.openstreetmap.org/node/6005394385) (no check_date; its website, read 2026-11-08, announces a closure time for 18 November, so it operates) | Đặc sản của vùng: vang trắng chủ yếu từ giống nho Chasselas, giống nho có nguồn gốc ở miền tây Thụy Sĩ ([en.wikipedia Chasselas](https://en.wikipedia.org/wiki/Chasselas)). Dézaley grand cru là một vùng vang Chasselas 54 ha trong Lavaux ([fr.wikipedia](https://fr.wikipedia.org/wiki/Viticulture_dans_le_canton_de_Vaud)). Vinorama trưng bày gần 300 loại vang của Lavaux ([lavaux-vinorama.ch](https://lavaux-vinorama.ch/)). Presented factually as a regional speciality, no drinking encouragement. |

- Category mix: history 1, culture 1, nature 1, experience 1, attraction 1, food 3.
- Spread along ~20 km of shore: Lavaux/Rivaz (west) → Vevey → Montreux → Chillon → Villeneuve
  (south-east), plus Rochers-de-Naye 5.5 km east of the centre and 1,650 m higher.
- No opening hours or prices (OSM has some, but without recent check dates).

**Alternates (verified, not proposed):**
- **Chợ có mái che Montreux (Marché couvert)**, market: OSM way 287883888, WD Q3289846. Built
  1891–1892 by Henri Chaudet with an 80,000-franc gift from Henri Nestlé; an all-metal market hall,
  class A cultural property (fr.wikipedia). It stands ~50 m from the Freddie Mercury statue, so the
  two pins would overlap; offered as a swap for one of the 8.
- **Chaplin's World** (museum, Corsier-sur-Vevey): OSM node 4171388059, WD Q23903492. Opening year
  not yet read from a source.
- **Alimentarium** (food museum, Vevey): OSM node 9067146693, WD Q2836938.

### Map area

Option A (recommended) includes Lavaux and the Vinorama:

| | value |
|---|---|
| `bbox` (map-config, lon/lat) | `[6.765, 46.385, 6.990, 46.490]` (≈ 17.3 × 11.7 km: Rivaz/Saint-Saphorin → Vevey → Montreux → Chillon → Villeneuve, and Rochers-de-Naye) |
| `coreBbox` | `[6.900, 46.425, 6.925, 46.442]` (central Montreux, ≈ 1.9 × 1.9 km) |
| `bounds` (destination.json) | `[[46.385, 6.765], [46.490, 6.990]]` |
| `initialView` | `[[46.405, 6.835], [46.470, 6.960]]` (Vevey → Chillon) |

- Option B (compact, without Lavaux and wine): `bbox` `[6.825, 46.385, 6.990, 46.475]`
  (≈ 12.7 × 10 km), about 30% less area; two locations would then be replaced by alternates.
- The extra Lavaux strip is mostly lake and vineyards with few roads, so A should stay well under
  1.5 MB; if not, I shrink `coreBbox` first. Much of the bbox is lake: the south-west half is water.
- Lake Geneva is OSM relation 332617 (very large multipolygon); I will check that it is clipped and
  filled as one water body, and report it (not hack the tool) if not.
- Town names: the tool only labels OSM suburbs/quarters, so I'd add `mapLabels` (kind `area`)
  "Montreux", "Vevey", "Villeneuve", "Lavaux", plus "Hồ Genève" (water). Positions after viewing.
  "Rochers de Naye" appears automatically as a named peak.
- On phones the area lock will land at about zoom 11.5 for the whole strip; Rochers-de-Naye and
  Lavaux get off-screen hint pills from the Montreux view.

### Photo plan (Commons first)

**Swiss freedom of panorama** (read on
[Commons:Copyright rules by territory/Switzerland](https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/Switzerland),
2026-11-08): "Freedom of panorama: Yes" for works permanently in public places (Art. 27 URG),
including 3D works; not interiors. So the **Freddie Mercury statue (1996)** and **La Fourchette
(1995/2008)**, both permanently outdoors, may be photographed and the photos used.

| Place | Commons source (files) | Target | Notes |
|---|---|---|---|
| cover | Views of Montreux (69), Montreux (25) | 3 | riviera with lake and Alps |
| Chillon | Château de Chillon (56 + 17 subcats) | 3 | |
| Freddie Mercury | Statue of Freddie Mercury, Montreux (56) | 3 | |
| Lavaux | Lavaux Vineyard Terraces (213), Saint-Saphorin (Lavaux) (91) | 3 | |
| Rochers-de-Naye | Rochers de Naye (115 + 11 subcats) | 3 | include the cog railway |
| La Fourchette | La Fourchette (30), Statue of Charlie Chaplin in Vevey (21) | 3 | |
| Filets de perche | Perch dishes (12), e.g. "Filets de perches du Léman - 1.JPG" | 3 | generic dish photos, "Ảnh minh họa" |
| Fondue | Cheese fondue (43) | 3 | generic, "Ảnh minh họa" |
| Vang Lavaux | Rivaz (130), Wines of Switzerland (20) | 3 | possible gap (Vinorama/wine glass) → Flickr/Unsplash/Pexels |

Expected: 27 photos, with a possible gap only for the wine place.

### Open questions (for the owner, via the main session)

1. **Names:** destination "Montreux" and lake label "Hồ Genève" (vi.wikipedia), or "Montreux – hồ
   Léman" / "hồ Léman"? Recommendation: "Montreux" + "Hồ Genève".
2. **Map area:** Option A (with Lavaux and the Vinorama, ≈ 17 × 12 km) or Option B (compact
   Vevey–Villeneuve, ≈ 13 × 10 km)? Recommendation: A.
3. **Locations:** approve the 8 above? In particular: wine as a food location (presented factually as
   a regional speciality); the fondue text says "fondue phô mai" and mentions moitié-moitié only as a
   Fribourg style, because the Montreux venue doesn't say which blend it uses; Vevey is represented by
   La Fourchette (+ Chaplin statue). Swap in the Marché couvert instead of one of them?

## Status log

| Date | Item |
|---|---|
| 2026-11-08 | Brief created by the main session. Placeholder `destination.json` exists with `"status": "planned"`. |
| 2026-11-08 | Session started on branch `dest/montreux`. Stage A research done; proposal written above. Waiting for approval via the main session. |
| 2026-11-08 | **Stage A approved via main session**: names "Montreux" / "Hồ Genève"; map Option A (bbox `[6.765, 46.385, 6.990, 46.490]`, shrink `coreBbox` first if > 1.5 MB); all 8 locations; photo plan incl. B4b (Flickr/Unsplash/Pexels) and browser downloads of the listed files. Lavaux area re-checked: en.wikipedia says 830 ha, fr.wikipedia 806 ha (2015), so the text says "hơn 800 ha". |
| 2026-11-08 | Map: one Overpass fetch (13.8 MB raw), build → `assets/maps/montreux.geojson` **681 kB** (134 kB gzipped). No coastline → whole area land; Lake Geneva (relation 332617) is clipped to the bbox and drawn as one water polygon with its harbour/island holes. 19 peak labels from OSM; `mapLabels` for "Hồ Genève", Montreux, Vevey, Villeneuve, Lavaux. |
| 2026-11-08 | Photos: all 27 from Commons (no Flickr needed). Chillon's top category holds only archival drawings, so candidates came from its "viewed from …" subcategories. `meta` all OK, downloaded, built; every `-400.webp` checked on a contact sheet. |
| 2026-11-08 | B6 tests passed at 1440 × 900 and 390 × 844 (see Result). `status: "published"`. |

## Result

**Published**, 8 locations, **27 photos (3 per place, all Wikimedia Commons)**, map 681 kB.

- Tested in the in-app browser at 1440 × 900 and 390 × 844:
  - world → Thụy Sĩ → Montreux pin → fly-in; the local map fades in; the area lock holds the bbox
    (desktop lands at zoom 13.25, phone at 13; panning stops at the bbox corner);
  - each of the 8 locations opens with 3 photos, credit line, thumbnails and a Google Maps link with
    its `mapsQuery`; full-screen viewer and Esc; swipe to 3/3 on the phone sheet;
  - "Ảnh minh họa" tag on the perch and fondue photos; category chips filter (Ẩm thực → 3);
  - back from location → destination → country; "Nguồn ảnh & bản quyền" lists the Montreux photos;
  - no console errors, no failed requests.
- Photos: cover 3, Chillon 3, Freddie Mercury 3, Lavaux 3, Rochers-de-Naye 3, La Fourchette (+ Chaplin
  statue) 3, filets de perche 3 (illustrative; one is "Filets de perches du Léman"), fondue 3
  (illustrative), vang Lavaux 3 (Lavaux Vinorama entrance, a Lavaux AOC bottle, Rivaz/Chexbres).
  Licences: CC BY-SA 2.0–4.0, CC BY 2.0, CC0. No NC, no ND.
- Known gaps / notes:
  - The Lavaux wine bottle photo is a red Lavaux AOC (Gamaret-Garanoir), while the text says the
    region's wine is mainly white Chasselas; the alt text describes it as a red Lavaux AOC.
  - The fondue venue's menu doesn't name its cheese blend, so moitié-moitié is mentioned only as the
    Fribourg style.
  - On desktop the Lavaux pin lands under the chip row, and the off-screen hint pill for it sits on top
    of the La Fourchette pin near Vevey (see request 1). Panning fixes both.

## Requests for the main session

1. **Hint pill over a visible pin (cosmetic, `offscreen-hints.js`).** At 1440 × 900 on
   `#/thuy-si/montreux`, the Lavaux pin is inside the map but hidden under the chip row, so it gets
   an off-screen pill. The pill is placed over the La Fourchette pin at Vevey and hides it until the
   user pans. Maybe skip pills for pins inside the viewport, or avoid covering other pins.
2. **Phone attribution position (observation, shared).** At 390 × 844 the "Nguồn & bản quyền |
   © OpenStreetMap" attribution sits at the top right, just under the chips (top ≈ 112 px), not
   bottom-left as the CLAUDE.md table says. Luzern shows the same, so it is not Montreux-specific.
