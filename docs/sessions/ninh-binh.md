# Session brief — Ninh Bình (`ninh-binh`)

| | |
|---|---|
| Country | Việt Nam (`viet-nam`) |
| Region field | `bac` (Miền Bắc) |
| Branch | `dest/ninh-binh` (own git worktree recommended) |
| Your paths | `data/destinations/ninh-binh/`, `assets/destinations/ninh-binh/`, `assets/maps/ninh-binh.geojson`, `docs/sessions/ninh-binh.md` |
| URL when done | `#/viet-nam/ninh-binh` |

## How to start this session

Start a new Claude Code session in this repository, on a new worktree or branch `dest/ninh-binh`
from `main`, and paste:

> Read CLAUDE.md, docs/PLAYBOOK-destination.md and docs/sessions/ninh-binh.md. Build the **Ninh Bình**
> destination by following the playbook. Work only on branch dest/ninh-binh and only in your own
> paths. Start with stage A (research) and present the proposal for my approval before building.

## Context (verify before you rely on it)

- The Tràng An Landscape Complex is a UNESCO World Heritage site (mixed natural/cultural; verify the year).
- Ninh Bình province was merged with neighbours in 2025 (verify which; the 2025 reform cut 63 → 34 provinces).
- Probably **inland** within the bbox: the tool then uses the whole area as land. Rivers and karst landscape dominate.

## Location ideas (starting points only, not facts)

Tràng An (đi thuyền); Tam Cốc – Bích Động; Hang Múa (view); chùa Bái Đính (modern buildings → pre-2023 photos); cố đô Hoa Lư; Thung Nham. Vườn quốc gia Cúc Phương is far: include only if the bbox stays sensible. Food: cơm cháy Ninh Bình, thịt dê núi.

Pick 5–8 locations with at least 2 food locations. Every coordinate and fact must come from a
source you read (OSM / Wikidata / Wikipedia). Location ids must be `ninh-binh-<slug>`.

## Photos

Plenty on Commons for Tràng An, Tam Cốc and Hang Múa. Food photos may be scarce: ask the owner early if a dish can't reach 3 even with Flickr/Unsplash/Pexels.

Photo count (owner, updated 2026-11-08): **at most 3 photos per place**, both the destination and
each location (food too). Aim for exactly 3; fewer only if no suitable licensed photo exists.

Wikimedia Commons first (CC0 / PD / CC BY / CC BY-SA). If Commons can't supply 3, use Flickr (CC, never ND), Unsplash or Pexels as described in the playbook (step B4b). Report gaps instead of padding.

## Map notes

Wide rural area: keep `coreBbox` small (e.g. Tam Cốc village) or leave it out.

---

## Proposal

Stage A research, 2026-11-08. Waiting for approval (via the main session); nothing is built yet.

### Facts about the destination

- **Administration** (vi.wiki "Ninh Bình", revision 2026-11-07):
  - Resolution 202/2025/QH15 (12/6/2025) merged **Hà Nam and Nam Định into Ninh Bình**; the name stays
    **tỉnh Ninh Bình** (3,942.62 km², 4,412,264 people). It is still a province: the article only says it aims to
    become a centrally-governed city by 2028.
  - Earlier, Resolution 1318/NQ-UBTVQH15 (from 1/1/2025) joined thành phố Ninh Bình and huyện Hoa Lư into
    **thành phố Hoa Lư**. Districts ended on 1/7/2025; communes were rearranged by Resolution 1674/NQ-UBTVQH15.
    The province now has 129 communes and wards, and its seat is **phường Hoa Lư**.
  - The sights are in **phường Tây Hoa Lư** (Tràng An wharf, cố đô Hoa Lư, Bái Đính), **phường Nam Hoa Lư**
    (Tam Cốc, Bích Động, Thung Nham) and **phường Hoa Lư** (Hang Múa, thôn Khê Đầu Hạ) (vi.wiki articles below; OSM
    ward relations 19539162, 19539190, 19539208). The text will use these ward names, never "huyện Hoa Lư" or
    "TP Ninh Bình".
- **UNESCO:** Quần thể danh thắng Tràng An was inscribed on **23/6/2014** (Doha) as Vietnam's first **mixed**
  (cultural and natural) World Heritage Site; core zone over 6,172 ha (vi.wiki "Quần thể danh thắng Tràng An";
  Wikidata Q10810559 P1435 = Q9259). whc.unesco.org not checked.
- **Inland:** the whole bbox is inland (the coast is ~35 km south-east), so the map tool uses it all as land. Rivers:
  sông Sào Khê (Tràng An boat route), sông Ngô Đồng (Tam Cốc), sông Bến Đang (west edge), sông Chanh (east edge).
- **Destination point:** OSM node/369486919 "Hoa Lư" (place=city, Wikidata Q131417547), 20.25725, 105.97189, the
  provincial seat. Wikidata Q36900 gives a coarse province point 20.25, 105.833 (14 km west); not used.
- **Draft summary:** "Vùng núi đá vôi, sông nước và hang động quanh cố đô Hoa Lư, với quần thể Tràng An là di sản
  thế giới hỗn hợp đầu tiên của Việt Nam (2014)."

### Locations (8 proposed: 6 sights + 2 food)

| # | id | Tên | Category | lat, lon | Coordinate source | Facts (source) |
|---|---|---|---|---|---|---|
| 1 | `ninh-binh-trang-an` | Tràng An (đi thuyền) | experience (+nature) | 20.25273, 105.91808 | OSM way/474685617 "Khu Du lịch sinh Thái Tràng An" (boat tour start). Wikivoyage listing 20.252872, 105.917795 (same). Wikidata Q10810559 gives 20.2557, 105.9156 (complex point, ~400 m) | UNESCO mixed heritage 23/6/2014 · Boat routes on sông Sào Khê through water caves and valleys · Wharf on đại lộ Tràng An, ~7 km from phường Hoa Lư (vi.wiki "Quần thể danh thắng Tràng An") |
| 2 | `ninh-binh-tam-coc` | Tam Cốc | nature (+experience) | 20.21634, 105.93746 | OSM node/4567308091 "Tam Cốc - Bích Động" (Tam Coc Boat Ride, by bến Văn Lâm). Wikidata Q1406000 gives 20.2185, 105.916 (near chùa Bích Động, ~2.2 km, coarse precision) | "Ba hang": hang Cả 127 m, hang Hai 60 m, hang Ba 50 m, cut by sông Ngô Đồng · Round trip by boat about 2 hours · Called "vịnh Hạ Long trên cạn" (vi.wiki "Tam Cốc – Bích Động") |
| 3 | `ninh-binh-hang-mua` | Hang Múa | attraction (+nature) | 20.22946, 105.93380 | OSM node/937741359 "Lying Dragon Top" (natural=peak, the summit with the dragon). vi.wiki "Hang Múa" gives 20.228611, 105.931667 (~230 m); ticket gate OSM node/7019043060 (check_date 2026-10-01) | 486 stone steps to the summit · Opened for tourism in 2000 · In the core zone of Tràng An, thôn Khê Đầu Hạ, phường Hoa Lư (vi.wiki "Hang Múa") |
| 4 | `ninh-binh-bai-dinh` | Chùa Bái Đính | culture | 20.27366, 105.86439 | OSM way/449263549 (place_of_worship, centroid). Wikidata Q3360468 gives 20.27694, 105.86278 (~400 m, further up the slope); old pagoda OSM node/5544886521 | Old pagoda plus a new complex built from 2003 · Phase 1 inaugurated at the 2008 world Vesak; hosted UN Vesak 2014 · Bell of 36 tonnes, 500 stone La Hán statues (vi.wiki "Chùa Bái Đính") |
| 5 | `ninh-binh-co-do-hoa-lu` | Cố đô Hoa Lư – đền vua Đinh | history | 20.28461, 105.90514 | OSM way/772041809 "Đền vua Đinh Tiên Hoàng". Wikidata Q10841714 / vi.wiki gives 20.285556, 105.903333 (~200 m). OSM area way/1362974362 (Q2421186) marks the whole ancient capital; Wikidata Q2421186's own point (20.2553, 105.9542) is wrong (it lies in phường Hoa Lư) | Capital of Đại Cồ Việt 968–1010, under the Đinh, Tiền Lê and early Lý · Đền vua Đinh stands on the old palace ground in làng cổ Trường Yên; đền vua Lê is ~300 m away (vi.wiki "Cố đô Hoa Lư", "Đền thờ Vua Đinh Tiên Hoàng") |
| 6 | `ninh-binh-thung-nham` | Thung Nham (vườn chim) | nature | 20.21692, 105.89328 | OSM node/6366200011 "Thung Nham Bird Park" (ticket). Wikivoyage listing 20.218, 105.89234 (~150 m). A second OSM ticket node/3887717277 is 900 m east; not used | Bird garden of over 300 ha, about 40,000 birds of 46 species · Động Vái Giời: 439 steps, 3 levels (vi.wiki "Khu du lịch sinh thái Thung Nham") |
| 7 | `ninh-binh-de-nui` | Dê núi Ninh Bình | food | 20.24758, 105.93435 | OSM node/5892247985 "Nhà hàng dê Chính Thư" (plus a duplicate node/4949207722 "Quán dê Chính Thư" at the same spot). No check_date ⚠ (question 2) | Goat dishes; protected geographical indication since 2018 · In the Vietnam Records Center's top 50 specialities (7/9/2012) (vi.wiki "Dê núi Ninh Bình") · Venue: open since 2008, 200+ goat dishes (wanderlog.com, mia.vn: travel sites, not strong sources) |
| 8 | `ninh-binh-com-chay` | Cơm cháy Ninh Bình | food | 20.28960, 105.88912 | OSM node/3889399634 "Nhà hàng Thăng Long – đặc sản dê núi Ninh Bình", thôn Chi Phong, phường Tây Hoa Lư. Wikivoyage "Ninh Binh" lists it at the same point (listing edited 2026-09-02): serves "local mountain goat dishes, com chay (crispy rice)", 07:00–22:30 | Rice crust dried in the sun, fried crisp, eaten with stir-fried goat or pork · Recognised as an Asian-record dish on 1/8/2012 (vi.wiki "Cơm cháy") |

**Layout:** 1, 5 and 8 are in the north-centre around the Tràng An wharf and Trường Yên; 2, 3 and 6 are in the south
(Tam Cốc area, ~4–5 km from Tràng An); 4 (Bái Đính) is ~5.7 km west of Tràng An; 7 is on the road between Tràng An and
phường Hoa Lư. Hint pills will point to whichever are off-screen.

**Alternates** (researched, not in the 8):
- **Chùa Bích Động** (culture; OSM node/1540779110, Wikidata Q10748377): "Nam thiên đệ nhị động", next to Tam Cốc;
  36 files in Category:Bich Dong Pagoda. Could replace Thung Nham.
- **Đền vua Lê Đại Hành** (history; OSM way/772041801, Q10841710): better as a fact under #5.
- **Vườn quốc gia Cúc Phương**: ~25 km west; the bbox would triple. Left out, as the brief suggests.

### Map area

- `bbox` (lon/lat): **[105.84, 20.19, 105.99, 20.31]**, about 15.6 × 13.3 km: all 8 pins plus a margin, and phường
  Hoa Lư (the provincial seat) at the east edge. Roughly twice the initial view, so the area lock's minimum zoom stays
  below the initial zoom.
- `coreBbox` (residential streets): **[105.932, 20.212, 105.945, 20.220]**, Tam Cốc village only (as the brief
  suggests). Dropped if the file gets too big.
- `initialView`: [[20.21, 105.855], [20.295, 105.945]] (all 8 locations).
- `riverLabels`: ["Sông Sào Khê", "Sông Ngô Đồng", "Sông Bến Đang"] if those names exist on OSM waterways; checked
  at build time.
- `mapLabels`: possibly "Tràng An" (area); decided after looking at the built map.

### Photo plan (Commons first; at most 3 per place)

| Item | Target | Commons source | Expected | Risk |
|---|---|---|---|---|
| Cover | 3 | Category:Tràng An Landscape Complex (250 files), Category:Tam Coc (234) | 3 | low |
| Tràng An | 3 | Category:Tràng An (43) + the Landscape Complex category | 3 | low |
| Tam Cốc | 3 | Category:Tam Coc (234), Category:Caves in Tam Coc | 3 | low |
| Hang Múa | 3 | Category:Mua Cave (4) + ~8 search hits ("View from Hang Mua.jpg", "Dragon Mountain (29843112887).jpg", …). The stairway, towers and dragon are **modern works** → only files uploaded before 2023 when they show them; views of the landscape from the top are fine | 2–3 | **medium** |
| Chùa Bái Đính | 3 | Category:Bai Dinh Pagoda (159). New complex from 2003 → **only files uploaded before 2023** | 3 | low |
| Cố đô Hoa Lư | 3 | Category:Dinh Bo Linh Shrine (26), Category:Hoa Lu (96) | 3 | low |
| Thung Nham | 3 | Category:Thung Nham (20), "Thung Nham NN.JPG" series | 3 | low |
| Dê núi | 3 | "Thịt dê Ninh Bình.JPG", "Tái dê.jpg", Category:Goat meat of Vietnam (25; several from Đông Hà, so "Ảnh minh họa") | 2–3 | medium |
| Cơm cháy | 3 | "Cơm cháy Ninh Bình.JPG", "Cơm cháy thịt dê Ninh Bình.JPG". Other Commons hits are cơm cháy kho quẹt from Quảng Trị (a different dish; not used) | 2 | **medium**: Flickr/Unsplash/Pexels for the third, as in B4b |

Natural caves, karst and rivers are not copyrighted works, so the pre-2023 rule only matters for Bái Đính's new
buildings, Hang Múa's stairway and statues, and any other new structures.

### Open questions (for the owner, via the main session)

1. Are these 8 locations right, or should one be swapped (e.g. Thung Nham → chùa Bích Động)?
2. **Dê núi venue:** "Nhà hàng dê Chính Thư" is in OSM but has no check_date; only travel sites (wanderlog, mia.vn)
   say it has been open since 2008. Accept it, or pin dê núi at Nhà hàng Thăng Long too (Wikivoyage, edited
   September 2026, confirms it serves goat dishes and cơm cháy)? Then both food pins share one point (the map
   spreads them apart).
3. OK to use Flickr/Unsplash/Pexels for the third cơm cháy photo (and possibly dê núi and Hang Múa) if Commons runs
   short, as the playbook allows?

## Status log

| Date | Item |
|---|---|
| 2026-11-08 | Brief created by the main session. Placeholder `destination.json` exists with `"status": "planned"`. |
| 2026-11-08 | Branch `dest/ninh-binh` created. Stage A research done (vi.wiki, Wikidata, OSM Overpass, Wikivoyage, Commons category counts); proposal written above. Waiting for approval via the main session. |

## Result

_(Stage C: what works, photo counts (target 3 per place), known gaps.)_

## Requests for the main session

_(Shared-code bugs or changes you need. Don't edit shared files yourself.)_
