# Session brief — Zürich (`zurich`)

| | |
|---|---|
| Country | Thụy Sĩ (`thuy-si`) |
| Region field | `null` (Switzerland has no regions in the app) |
| Branch | `dest/zurich` (own git worktree recommended) |
| Your paths | `data/destinations/zurich/`, `assets/destinations/zurich/`, `assets/maps/zurich.geojson`, `docs/sessions/zurich.md` |
| URL when done | `#/thuy-si/zurich` |

## How to start this session

Start a new Claude Code session in this repository, on a new worktree or branch `dest/zurich`
from `main`, and paste:

> Read CLAUDE.md, docs/PLAYBOOK-destination.md and docs/sessions/zurich.md. Build the **Zürich**
> destination by following the playbook. Work only on branch dest/zurich and only in your own
> paths. Start with stage A (research) and present the proposal for my approval before building.

## Context (verify before you rely on it)

- Largest Swiss city, on Lake Zürich and the Limmat. All texts are in Vietnamese; proper names keep their spelling (Grossmünster, Bahnhofstrasse…).
- **Inland**: the whole area is land, and Lake Zürich and the Limmat come from OSM water polygons. Check that the lake renders as one water body.
- Swiss freedom of panorama: check `Commons:Copyright rules by territory/Switzerland` before using photos of modern works.

## Location ideas (starting points only, not facts)

Phố cổ (Altstadt); Grossmünster; Fraumünster (Chagall windows: an artwork, so check copyright/FoP); Lindenhof (view); Bahnhofstrasse; bờ hồ Zürich; Uetliberg (view, may be outside a compact bbox); Bảo tàng Quốc gia Thụy Sĩ (Landesmuseum). Food: Zürcher Geschnetzeltes, Rösti, chocolate/pastry (e.g. Luxemburgerli at a long-running shop: verify).

Pick 5–8 locations with at least 2 food locations. Every coordinate and fact must come from a
source you read (OSM / Wikidata / Wikipedia). Location ids must be `zurich-<slug>`.

## Photos

Commons coverage is excellent. Use ≥ 5 cover photos (lake, old town, Limmat). Swiss dishes have generic photos on Commons (tag them "Ảnh minh họa").

Minimums (owner):
- ≥ 5 destination photos;
- ≥ 3 per location;
- ≥ 3 per food location;
- up to 10 for food, beach and mountain/forest places.

Wikimedia Commons first (CC0 / PD / CC BY / CC BY-SA). If a minimum can't be met, use Flickr (CC, never ND), Unsplash or Pexels as described in the playbook (step B4b). Report gaps instead of padding.

## Map notes

A dense city: keep `coreBbox` to the Altstadt. OSM labels are German; that's acceptable (proper names). Vietnamese `mapLabels` can add "Hồ Zürich" and "Sông Limmat".

---

## Proposal

Stage A, 2026-11-08. Sources read: Wikidata (SPARQL), OpenStreetMap (Overpass, tags incl.
`check_date`), English and German Wikipedia, and the Commons page
`Commons:Copyright rules by territory/Switzerland`.

### Destination

- **Zürich**: the largest city in Switzerland (en.wikipedia "Swiss National Museum"). It lies at the
  outflow of Lake Zürich, where the Limmat begins (en.wikipedia "Limmat").
- Coordinates: Wikidata [Q72](https://www.wikidata.org/wiki/Q72) P625 = 47.374444, 8.541111.
- Draft summary: "Thành phố lớn nhất Thụy Sĩ, nằm bên hồ Zürich, nơi sông Limmat bắt đầu chảy qua
  phố cổ."

### Locations (8)

| id | Tên (vi) | Category (tags) | lat, lon | Coordinate source | Facts (source) |
|---|---|---|---|---|---|
| `zurich-grossmunster` | Nhà thờ Grossmünster | attraction (history) | 47.37010, 8.54397 | OSM [way 36916418](https://www.openstreetmap.org/way/36916418), check_date 2025-11-22. WD [Q684948](https://www.wikidata.org/wiki/Q684948) ≈ 20 m away | Xây dựng khoảng 1100–1220. Hai tháp dựng 1487–1492, mái tháp hiện nay hoàn thành năm 1787. Zwingli khởi xướng cuộc Cải cách tôn giáo tại đây từ năm 1520. ([en.wikipedia](https://en.wikipedia.org/wiki/Grossm%C3%BCnster)) |
| `zurich-fraumunster` | Nhà thờ Fraumünster | culture (history) | 47.36971, 8.54120 | OSM [way 89967877](https://www.openstreetmap.org/way/89967877), check_date 2026-07-04. WD [Q690944](https://www.wikidata.org/wiki/Q690944) ≈ 7 m | Tu viện thành lập năm 853. Năm ô kính màu của Marc Chagall, lắp năm 1970 (text only, no photos: see the photo plan). ([en.wikipedia](https://en.wikipedia.org/wiki/Fraum%C3%BCnster)) |
| `zurich-lindenhof` | Đồi Lindenhof | history (attraction) | 47.37299, 8.54080 | OSM [way 10594810](https://www.openstreetmap.org/way/10594810) (square). WD [Q39374](https://www.wikidata.org/wiki/Q39374) ≈ 8 m | Thành lũy La Mã từ thời hoàng đế Valentinian I (364–375). Di sản quốc gia của Thụy Sĩ. View over the Limmat and old town. ([en.wikipedia](https://en.wikipedia.org/wiki/Lindenhof_hill)) |
| `zurich-landesmuseum` | Bảo tàng Quốc gia Thụy Sĩ (Landesmuseum) | culture | 47.37924, 8.54015 | OSM [relation 4281153](https://www.openstreetmap.org/relation/4281153). WD [Q691896](https://www.wikidata.org/wiki/Q691896) ≈ 34 m | Tòa nhà năm 1898 của kiến trúc sư Gustav Gull, dáng lâu đài. Mở rộng 2013–2016. ([en.wikipedia](https://en.wikipedia.org/wiki/Swiss_National_Museum)) |
| `zurich-zurichhorn` | Bờ hồ Zürichhorn | nature (experience) | 47.35360, 8.55211 | WD [Q248693](https://www.wikidata.org/wiki/Q248693). OSM [node 8026420964](https://www.openstreetmap.org/node/8026420964) "Zürichhorn" ≈ 83 m (the park has no single OSM object) | Công viên ven hồ được yêu thích nhất thành phố. Khoảng 20 phút đi bộ từ Bellevue. Gần đó có Vườn Trung Hoa, quà tặng của thành phố kết nghĩa Côn Minh. ([en.wikipedia Zürichhorn](https://en.wikipedia.org/wiki/Z%C3%BCrichhorn), [Chinese Garden](https://en.wikipedia.org/wiki/Chinese_Garden,_Zurich)) |
| `zurich-uetliberg` | Núi Uetliberg | nature (experience) | 47.34945, 8.49197 | OSM [node 29971007](https://www.openstreetmap.org/node/29971007) (peak, ele 871). WD [Q16524](https://www.wikidata.org/wiki/Q16524) ≈ 2 m | "Ngọn núi nhà" của Zürich, cao 870 m, nhìn bao quát thành phố và hồ. Trên đỉnh có tháp ngắm cảnh và tháp truyền hình cao 186 m. ([en.wikipedia](https://en.wikipedia.org/wiki/Uetliberg)) About 4.5 km SW of the centre, so it gets an off-screen hint pill. |
| `zurich-geschnetzeltes` | Zürcher Geschnetzeltes (thịt bê sốt kem kiểu Zürich) | food | 47.37037, 8.53992 | Venue **Zeughauskeller**, Bahnhofstrasse 28a: OSM [node 105459350](https://www.openstreetmap.org/node/105459350), check_date 2026-01-20 | Thịt bê thái sợi nấu với vang trắng và kem. Được ghi chép lần đầu trong một sách nấu ăn năm 1947. ([en.wikipedia](https://en.wikipedia.org/wiki/Z%C3%BCrcher_Geschnetzeltes)) Text: "một địa chỉ tiêu biểu". Commons has two photos of this dish taken at Zeughauskeller. |
| `zurich-luxemburgerli` | Bánh Luxemburgerli ở Sprüngli | food | 47.36948, 8.53914 | Venue **Confiserie Sprüngli**, Bahnhofstrasse 21 (Paradeplatz): OSM [node 648907100](https://www.openstreetmap.org/node/648907100), check_date 2026-04-27. WD Sprüngli-Haus [Q30321652](https://www.wikidata.org/wiki/Q30321652) ≈ 12 m | Sprüngli thành lập năm 1836. Cửa hàng ở Paradeplatz mở từ năm 1859. Bán chiếc Luxemburgerli (macaron nhỏ) đầu tiên năm 1957. ([en.wikipedia](https://en.wikipedia.org/wiki/Confiserie_Spr%C3%BCngli)) |

- Category mix: attraction 1, culture 2, history 1, nature 2, food 2.
- No opening hours or prices. OSM has hours, but without a recent check date for most places;
  leave them out.

**Alternates (verified, not proposed):**
- **Kronenhalle** (Rämistrasse 4, OSM [node 268467807](https://www.openstreetmap.org/node/268467807), no
  check_date; WD [Q1789864](https://www.wikidata.org/wiki/Q1789864)). Restaurant since 1924, famous for
  its "Geschnetzeltes". de.wikipedia says it is explicitly *not* the Zürcher version, so it's a weaker
  pin for the dish. Interior photos are excluded because of the copyrighted art inside.
- **Hiltl** (Sihlstrasse 28, OSM [node 119247298](https://www.openstreetmap.org/node/119247298),
  check_date 2026-05-25). Guinness record as the oldest continuously open vegetarian restaurant in
  the world (en.wikipedia).
- **Nhà thờ St. Peter**: its clock face is among the largest in Europe. en.wikipedia contradicts
  itself (8.7 m and "largest" vs. 8.64 m and "second-largest"), so the number would be left out.
- **Bahnhofstrasse**: the shopping street. The Sprüngli pin already sits on it.
- **Vườn Trung Hoa (Chinagarten)**: could be folded into Zürichhorn instead.

### Map area

| | value (lon/lat order, `map-config.json`) |
|---|---|
| `bbox` | `[8.475, 47.337, 8.575, 47.392]` (≈ 7.5 × 6.1 km: Uetliberg to Zürichhorn, Landesmuseum + margin) |
| `coreBbox` | `[8.535, 47.365, 8.550, 47.380]` (Altstadt, Bahnhofstrasse, Bellevue) |
| `bounds` (destination.json) | `[[47.337, 8.475], [47.392, 8.575]]` |
| `initialView` | `[[47.352, 8.528], [47.382, 8.558]]` (old town to Zürichhorn; Uetliberg via hint pill) |

- Vietnamese `mapLabels`: "Hồ Zürich" (water) and "Sông Limmat" (water). Positions are set after
  viewing the built map.
- `riverLabels`: `["Sihl"]` (the OSM name; acceptable as a proper name).
- Inland area: the lake comes from the OSM `natural=water` relation. Check that it renders as one body.

### Photo plan (Commons; CC0 / PD / CC BY / CC BY-SA)

**Swiss freedom of panorama** (read on
[Commons:Copyright rules by territory/Switzerland](https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/Switzerland)):
- **Yes** for works permanently in public places, both 2D and 3D (Art. 27 URG). So outdoor views of
  modern buildings and sculptures are fine (Landesmuseum extension 2016, Uetliberg towers 1990,
  outdoor sculptures at Zürichhorn).
- **Not** for interiors. Commons treats church interiors and **stained-glass windows** as interior,
  even when seen from outside. The copyright term is life + 70 years.
- Therefore:
  - **No photos of the Chagall windows** in the Fraumünster (Chagall died 1985, protected until 2055).
  - No Kronenhalle interiors (Picasso, Miró, Chagall works).
  - No photos of modern exhibits inside the Landesmuseum.
  - The Augusto Giacometti windows (he died 1947, so they are PD in Switzerland) only if the
    Commons file is tagged PD.

| Place | Commons category (files) | Target | Notes |
|---|---|---|---|
| cover | Limmat in Zürich (778), panoramas | 6–8 | lake, Limmat, old town, Grossmünster skyline |
| Grossmünster | Grossmünster (203) | 5 | exterior, towers, from the Limmat |
| Fraumünster | Fraumünster (222) | 3–4 | exterior and Münsterhof only |
| Lindenhof | Lindenhof (Zürich) (25) + views | 4 | square, linden trees, view |
| Landesmuseum | Swiss National Museum (61) + Landesmuseum Zürich (63) | 4 | exteriors, courtyard |
| Zürichhorn | Zürichhorn (365) | 6–8 | lake shore, park, Chinagarten |
| Uetliberg | Uetliberg (215), Views from Uetliberg (128) | 6–8 | summit, tower, panorama |
| Geschnetzeltes | Zürcher Geschnetzeltes (13), Rösti (66) | 4–6 | 2 photos at Zeughauskeller; the rest are generic dishes tagged "Ảnh minh họa" |
| Luxemburgerli | Luxemburgerli (9), Confiserie Sprüngli (27) | 4–6 | macarons and the Paradeplatz shop front |

- Expected total: about 45–55 photos. No gaps are expected against the minimums (≥ 5 cover, ≥ 3 per
  location, ≥ 3 per food location).
- Note: the Wikimedia APIs are returning HTTP 429 from this IP right now, probably because several
  parallel sessions share it. The photo stage will be slow; the tools already back off.

### Open questions for the owner

1. Approve these 8 locations, or swap in an alternate (Hiltl, St. Peter, Bahnhofstrasse, Kronenhalle)?
2. The dish venue: **Zeughauskeller** (recommended: OSM checked 2026, and Commons has photos of the
   dish taken there) or Kronenhalle?
3. Including Uetliberg widens the map to ≈ 7.5 × 6 km. Keep it, or drop it for a compact old-town map?

## Status log

| Date | Item |
|---|---|
| 2026-11-08 | Brief created by the main session. Placeholder `destination.json` exists with `"status": "planned"`. |
| 2026-11-08 | Session started in worktree `dest-zurich-43a9bc`, branch `dest/zurich`; test server on port 5523. |
| 2026-11-08 | Stage A research done; proposal above. Waiting for owner approval. |
| 2026-11-08 | **Owner approved**: all 8 locations, the dish at Zeughauskeller, and keeping Uetliberg (≈ 7.5 × 6 km map). |
| 2026-11-08 | Local map: one Overpass fetch (4.5 MB raw) → `assets/maps/zurich.geojson` **479 kB**. The lake renders as one water body; the Limmat and Sihl are drawn; 20 OSM labels (German quarter and peak names). Vietnamese `mapLabels`: "Hồ Zürich", "Sông Limmat". The tool needed a workaround for the space in the worktree path (see requests). |
| 2026-11-08 | `destination.json` and `locations.json` written (8 locations, facts as in the proposal). |
| 2026-11-08 | Photo candidate search run; picks recorded in `photo-selection.json` for Geschnetzeltes 8, Luxemburgerli 7, Grossmünster 7, Fraumünster 5 (exteriors only, no Chagall windows) and Landesmuseum 7 (exteriors plus historic interiors). Still to do: Zürichhorn, Uetliberg, cover, and a Lindenhof rerun (its first search returned unrelated aerial photos). **Stopped at the owner's request**, because the photo rule is being updated in the main session. Nothing has been downloaded or built (`photos.py` not run). |

## Result

_(Stage C: what works, photo counts vs. minimums, known gaps.)_

## Requests for the main session

1. **`tools/build-local-map.mjs` fails when the repo path contains a space** (e.g. this worktree,
   `C:\Work\Claude worktree\…`).
   - Cause: `root` comes from `new URL(import.meta.url).pathname`, which keeps `%20`. The tool
     then prints only its usage line, because the config file "doesn't exist".
   - Fix: `import { fileURLToPath } from 'node:url'` and
     `path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')`.
   - Workaround used here: run it through a junction without spaces, with
     `node --preserve-symlinks --preserve-symlinks-main tools/build-local-map.mjs zurich …`.
2. Note for the photo stage: Wikimedia APIs often answer HTTP 429 when several destination sessions
   run at once from the same IP. The tools back off, but the runs are slow.
