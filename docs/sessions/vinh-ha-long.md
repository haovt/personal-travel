# Session brief — Vịnh Hạ Long (`vinh-ha-long`)

| | |
|---|---|
| Country | Việt Nam (`viet-nam`) |
| Region field | `bac` (Miền Bắc) |
| Branch | `dest/vinh-ha-long` (own git worktree recommended) |
| Your paths | `data/destinations/vinh-ha-long/`, `assets/destinations/vinh-ha-long/`, `assets/maps/vinh-ha-long.geojson`, `docs/sessions/vinh-ha-long.md` |
| URL when done | `#/viet-nam/vinh-ha-long` |

## How to start this session

Start a new Claude Code session in this repository, on a new worktree or branch `dest/vinh-ha-long`
from `main`, and paste:

> Read CLAUDE.md, docs/PLAYBOOK-destination.md and docs/sessions/vinh-ha-long.md. Build the **Vịnh Hạ Long**
> destination by following the playbook. Work only on branch dest/vinh-ha-long and only in your own
> paths. Start with stage A (research) and present the proposal for my approval before building.

## Context (verify before you rely on it)

- Hạ Long Bay is a UNESCO World Heritage site (verify the inscription years).
- Mostly **sea with thousands of limestone islands**: the OSM coastline has many closed island rings. Watch the extract size, and check that islands render as land and the bay as water.
- Quảng Ninh province: check whether the 2025 reform changed anything relevant.

## Location ideas (starting points only, not facts)

Hang Sửng Sốt; động Thiên Cung; hòn Trống Mái; đảo Ti Tốp (bãi tắm, view); làng chài Cửa Vạn; Bãi Cháy; du thuyền / chèo kayak (experience). Food: chả mực Hạ Long, sá sùng, hải sản at a market (e.g. chợ Hạ Long 1).

Pick 5–8 locations with at least 2 food locations. Every coordinate and fact must come from a
source you read (OSM / Wikidata / Wikipedia). Location ids must be `vinh-ha-long-<slug>`.

## Photos

Many bay and cave photos exist on Commons. Modern structures (e.g. Bãi Cháy bridge, resorts, Ferris wheel): pre-2023 uploads only.

Photo count (owner, updated 2026-11-08): **at most 3 photos per place**, both the destination and
each location (food too). Aim for exactly 3; fewer only if no suitable licensed photo exists.

Wikimedia Commons first (CC0 / PD / CC BY / CC BY-SA). If Commons can't supply 3, use Flickr (CC, never ND), Unsplash or Pexels as described in the playbook (step B4b). Report gaps instead of padding.

## Map notes

A large bbox with many islands can exceed 1.5 MB. Keep it to the core bay plus Hạ Long city, and consider dropping `coreBbox` residential streets entirely. Labels: island names come from OSM `place=island/islet`.

---

## Proposal

Stage A research, 2026-11-08. Waiting for owner approval; nothing is built yet.

### Facts about the destination

- **UNESCO** (vi.wikipedia "Vịnh Hạ Long", Wikidata Q190128 P757/P1435):
  - **1994**: core zone inscribed as a natural World Heritage Site (criterion vii, aesthetic value).
  - **2000**: inscribed again for geology and geomorphology (criterion viii).
  - **16/9/2023**: extended as "Vịnh Hạ Long – Quần đảo Cát Bà", Vietnam's first World Heritage Site spanning two
    provinces/cities (vi.wiki). whc.unesco.org was not checked (it refused scripted reads for the Hội An session).
- **Size** (vi.wiki): about 1,553 km² with 1,969 islands, mostly limestone; the core zone is 335 km² with 775 islands.
- **Administration (changed since the brief was written):**
  - Quảng Ninh was kept as a province in the 2025 reform (Resolution 202/2025/QH15). Districts ended on 1/7/2025;
    the former Hạ Long city became wards: Hạ Long (Hồng Hà + Hồng Hải), Hồng Gai, Bãi Cháy, Tuần Châu, Cao Xanh, …
    (Resolution 1679/NQ-UBTVQH15; vi.wiki "Hạ Long (phường)", "Hồng Gai (phường)").
  - **Since 1/9/2026 Quảng Ninh is a centrally-governed city, "thành phố Quảng Ninh"** (Resolution 36/2026/QH16 of
    24/8/2026; vi.wiki "Quảng Ninh", revision of 2026-11-01). The bay's fishing villages are in phường Bãi Cháy;
    Ti Tốp is in phường Hồng Gai.
  - So the text will say "thành phố Quảng Ninh", never "tỉnh Quảng Ninh" or "TP Hạ Long".
- **Destination point:** OSM node/2707025319 (label node "Vịnh Hạ Long"), 20.90844, 107.06828.
  Wikidata Q190128 gives a coarse 20.9, 107.2 (about 14 km east, in Bái Tử Long); not used.
- **Draft summary:** "Vịnh biển với gần 2.000 hòn đảo đá vôi, được UNESCO công nhận là di sản thiên nhiên thế giới
  năm 1994 và 2000." (vi.wiki)

### Locations (8 proposed: 6 sights + 2 food)

Distances are straight-line from the cruise port (Cảng tàu khách quốc tế Hạ Long, OSM node/12759133301, Bãi Cháy).

| # | id | Tên | Category | lat, lon | Coordinate source | Facts (source) |
|---|---|---|---|---|---|---|
| 1 | `vinh-ha-long-hang-sung-sot` | Hang Sửng Sốt | nature (+attraction) | 20.84400, 107.09126 | OSM node/3494812595 (cave entrance). Wikidata Q10765376 gives 20.84441, 107.09144 (50 m) | On đảo Bồ Hòn · about 10,000 m², 25 m above sea level, two chambers · Named "Grotte des surprises" by the French · Lit and paved by the bay authority in 1999 (vi.wiki "Vịnh Hạ Long", "Hang Sửng Sốt") · ~13 km from port |
| 2 | `vinh-ha-long-dong-thien-cung` | Động Thiên Cung | nature | 20.91268, 107.01721 | OSM node/4730928605 (cave entrance). (Wikidata Q124453533 "Thien Cung Cave" is a different cave in Ninh Bình) | On đảo Canh Độc (Vạn Cảnh), 25 m above sea level, about 100 m from Hang Đầu Gỗ · Opened to visitors on 1/5/1998 (vi.wiki "Động Thiên Cung", "Vịnh Hạ Long") · ~6 km from port |
| 3 | `vinh-ha-long-hon-trong-mai` | Hòn Trống Mái (Gà Chọi) | nature (+attraction) | 20.89049, 107.02623 | OSM way/480056722 (islet "Hòn Gà chọi", centroid). No Wikidata item with coordinates | Two rocks shaped like a cock and a hen, a little over 10 m high · Symbol on the Hạ Long Bay logo · ~5 km from Bãi Cháy port (vi.wiki "Vịnh Hạ Long") |
| 4 | `vinh-ha-long-dao-ti-top` | Đảo Ti Tốp | nature (+experience) | 20.85920, 107.08027 | OSM way/342805164 (centroid). Wikidata Q16481033 gives 20.859, 107.08014 (25 m) | Named on 22/1/1962, when Hồ Chí Minh visited with cosmonaut Gherman Titov · Crescent-shaped white beach; visitors climb to the top for the view (vi.wiki "Đảo Ti Tốp") |
| 5 | `vinh-ha-long-hang-luon` | Chèo thuyền qua Hang Luồn | experience | 20.85309, 107.09487 | OSM node/3560283504 (cave entrance). The vi.wiki disambiguation page "Hang Luồn" gives 20°51′10″, 107°05′43″ (60 m). The article "Hang Luồn Hạ Long" gives a point ~1 km south, near Hang Sửng Sốt; not used | Tunnel about 100 m long through đảo Bồ Hòn, opening 4 m wide and 3 m high, ending in an enclosed lagoon (vi.wiki "Hang Luồn Hạ Long") · Visited by kayak or rowing boat (Wikivoyage "Ha Long Bay", rev. 2026-04-12; prices not used) |
| 6 | `vinh-ha-long-lang-chai-cua-van` | Làng chài Cửa Vạn | culture | 20.80724, 107.11794 | OSM node/4730877540 (tourism=attraction "Cửa Vạn"). No Wikidata item (Q31909546 is another Cửa Vạn, in Khánh Hòa) | One of the bay's fishing villages (with Ba Hang, Cặp Dè), phường Bãi Cháy; about 1,540 people live on the bay · Villagers keep hát đúm, hò biển and wedding songs (vi.wiki "Vịnh Hạ Long") · ~17 km from port |
| 7 | `vinh-ha-long-hai-san` | Hải sản tươi (chợ Hạ Long I) | food (+market) | 20.94980, 107.08231 | OSM way/673096988 "Chợ Hòn Gai (Hon Gai Market)", check_date 2025-03-15 | vi.wiki "Hồng Gai (phường)": chợ Hạ Long 1 sells live seafood and souvenirs. ⚠ No source states that OSM's "Chợ Hòn Gai" **is** chợ Hạ Long I; see question 2 |
| 8 | `vinh-ha-long-cha-muc` | Chả mực | food | **open** | **No verified venue found** (see question 3) | Squid paste shaped into patties and fried; Hạ Long and Cẩm Phả are known for it · In the Vietnam Records Center's top 50 Vietnamese specialities (vi.wiki "Chả mực") |

**Layout:** 1, 4 and 5 are within 1.5 km of each other in the centre of the bay; 2 and 3 are near the port; 6 is
furthest out (~17 km); 7 is in Hồng Gai on the mainland. Off-screen hint pills will point to whichever are outside the
view.

**Alternates** (researched, not in the 8):
- **Hang Đầu Gỗ** (history): next to Thiên Cung (OSM node/4730928606). Legend: Trần Hưng Đạo hid the stakes for the
  Bạch Đằng battle of 1288 here. Only 1 Commons file, so it is better as a fact under Thiên Cung.
- **Bãi Cháy beach** (nature): artificial beach over 1,000 m long, 100 m wide (vi.wiki "Bãi Cháy"). No Commons category.
- **Bảo tàng Quảng Ninh** (culture; Wikidata Q112182634): modern building, so pre-2023 photos only; 18 Commons files.
- **Núi Bài Thơ** (history; OSM node/4453536667, 188 m).

### Map area

- `bbox` (lon/lat): **[106.95, 20.76, 107.19, 21.00]**, about 25 × 27 km.
  - About 2× the initial view, so the area lock's minimum zoom stays below the initial zoom (the Hội An lesson).
  - Overpass count for this box: 736 coastline ways, 37,273 coastline nodes. Mostly island rings plus the mainland;
    the north tip of Cát Bà (Hải Phòng) falls in the south-west corner.
  - `build-local-map.mjs` turns closed coastline rings straight into land polygons, so islands should draw as land
    and the bay as water. I'll check that in B2.
  - Roads: mainland Hạ Long only (motorway → tertiary).
- `coreBbox` (residential streets): **[107.075, 20.944, 107.090, 20.956]**, just around the market in Hồng Gai.
  Can be dropped entirely if the file is too big.
- `initialView`: [[20.80, 107.00], [20.96, 107.13]] (port, central islands and Cửa Vạn).
- **Built with (2026-11-08):** `bbox` [106.93, 20.75, 107.21, 21.01] and `initialView` [[20.835, 107.005], [20.925, 107.10]]
  (see the status log). `bounds` in `destination.json` matches the bbox.
- Labels:
  - The tool only labels OSM `place=island/islet` **nodes**, but the key islands here are **ways** (Bồ Hòn,
    Đầu Gỗ, Ti Tốp, Gà Chọi). I'll add a few `mapLabels` (`kind: "area"`) at their OSM centroids instead of changing
    the tool.
  - `mapLabels`: Vịnh Hạ Long (sea, OSM node/2707025319), Đảo Tuần Châu, Bồ Hòn, Đảo Cát Bà (OSM relation/15981536).

### Photo plan (Commons first; at most 3 per place)

| Item | Target | Commons source | Expected | Risk |
|---|---|---|---|---|
| Cover | 3 | Category:Ha Long Bay (947 files) + Panoramics / Limestone islands subcats | 3 | low |
| Hang Sửng Sốt | 3 | Category:Sung Sot Cave (154) | 3 | low |
| Động Thiên Cung | 3 | Category:Thien Cung Cave (33) | 3 | low |
| Hòn Trống Mái | 3 | Category:Kissing Rocks (Ha Long Bay); files "Hon Trong Mai.jpg", "Hòn Trống mái..jpg" | 3 | low/medium |
| Đảo Ti Tốp | 3 | Category:Titov Island (48). Avoid the Titov bust (modern artwork) unless uploaded before 2023 | 3 | low |
| Hang Luồn | 3 | Category:Luồn Cave (42) | 3 | low |
| Làng chài Cửa Vạn | 3 | "Cua Van Floating Village.jpg", Category:Halong Bay floating village, Category:Floating fishing village, Halong Bay | 1–3 | **medium**: other files may show other floating villages; I'll use only ones that name Cửa Vạn or match it |
| Hải sản (chợ Hạ Long I) | 3 | "Cho Ha long.jpg" (2017, the market); seafood stall photos from Category:Boat vendors in Ha Long, marked "Ảnh minh họa" | 2–3 | medium |
| Chả mực | 3 | "Chả mực.jpg" (2013, Hạ Long), "Chả mực Hạ Long, Quảng Ninh, Việt Nam.jpg" (2025), "Tết 2024…chả mực rán…" (homemade). Dish photos, tagged "Ảnh minh họa" where generic | 3 | low |

Natural caves and islands are not copyrighted works, so the pre-2023 rule applies only to modern structures (Bãi Cháy
bridge, the Titov bust, resorts). If Commons can't reach 3, I'll use Flickr/Unsplash/Pexels as in B4b.

### Open questions for the owner

1. Are these 8 locations right, or should one be swapped for an alternate (Hang Đầu Gỗ, Bãi Cháy beach, Bảo tàng
   Quảng Ninh, Núi Bài Thơ)?
2. **Seafood pin:** OSM has no object named "Chợ Hạ Long I". The nearest candidate is "Chợ Hòn Gai (Hon Gai Market)"
   (way/673096988, checked 2025-03-15), 1 km from "Chợ Hạ Long II" (way/673558390). I believe it is chợ Hạ Long I but
   found no source that says so. Pin it there with that caveat in the note?
3. **Chả mực has no verifiable venue:** OSM has no shop whose name mentions chả mực, and I found no reliable source
   for a long-running shop (one restaurant website I checked had spam content). Options: (a) you name a shop you know
   and I verify it in OSM; (b) pin chả mực at the same market as the seafood, which no source confirms sells it;
   (c) replace it with another location, accepting only 1 food location.

## Status log

| Date | Item |
|---|---|
| 2026-11-08 | Brief created by the main session. Placeholder `destination.json` exists with `"status": "planned"`. |
| 2026-11-08 | Session started on branch `dest/vinh-ha-long`. Stage A research done and proposal written. Found that Quảng Ninh has been "thành phố Quảng Ninh" (centrally governed) since 1/9/2026. Waiting for owner approval. |
| 2026-11-08 | **Owner approved** the 6 sights, the map area and the photo plan. Seafood: name the venue "Chợ Hòn Gai" as in OSM, without claiming it is chợ Hạ Long I. Chả mực: pin it at the same market (no source confirms the market sells it; recorded in the coordinate note). |
| 2026-11-08 | Map built. The first bbox ([106.95, 20.76, 107.19, 21.00]) gave a minimum zoom equal to the landing zoom, so it was widened once to [106.93, 20.75, 107.21, 21.01] (one more Overpass fetch) and the initial view was tightened to the central cluster. 1.24 MB (262 kB gzipped). Islands draw as land and the bay as water. |
| 2026-11-08 | The OSM UNESCO boundary "Vịnh Hạ Long – Quần đảo Cát Bà" (relation 19465352, `boundary=protected_area`, `maritime=yes`) was drawn by the tool as a reserve fill over the whole bay, making the sea look like land. **Workaround:** that one `k: "reserve"` feature was removed from `assets/maps/vinh-ha-long.geojson` after the build (see the requests below). |
| 2026-11-08 | Photos: 27 Commons files (3 per place), all `OK` in `photos.py meta`, built and checked on a contact sheet. The panoramio "Fishing Village in Ha Long Bay" set was rejected: its sign reads "Làng chài Con Đò Cổ Tích" and its geotag is in Bái Tử Long, not Cửa Vạn. "Cho Ha long.jpg" (a building signed "Chợ Hạ Long") was not used, so as not to imply that Chợ Hòn Gai is chợ Hạ Long. |
| 2026-11-08 | B6 passed at 1440 × 900 and 390 × 844. `status: "published"`. Committed on `dest/vinh-ha-long` (not pushed, not merged). |

## Result

**Works** (tested 2026-11-08 in the in-app browser at 1440 × 900 and 390 × 844; not on a real iPhone):
- Country map: the Vịnh Hạ Long pin and list card (Miền Bắc); tapping flies in, the local map fades in after landing.
- Local map: about 750 island and mainland land polygons on water, Cát Bà forest, Hạ Long roads, ward labels from OSM and
  `mapLabels` (Vịnh Hạ Long, Đảo Bồ Hòn, Hòn Đầu Gỗ, Đảo Tuần Châu, Đảo Cát Bà). The area lock stops panning at the bbox.
- 8 locations: Hang Sửng Sốt, Động Thiên Cung, Hòn Trống Mái, Đảo Ti Tốp, Chèo thuyền qua Hang Luồn, Làng chài Cửa Vạn,
  Hải sản tươi and Chả mực (both at Chợ Hòn Gai). Each has a one-sentence summary, 1–3 sourced facts, a Google Maps link
  and 3 photos.
- Gallery: arrows, thumbnails, swipe (2/3 after a swipe on the phone), full-screen viewer with arrow keys and Esc, credit
  line. Food photos show "Ảnh minh họa".
- Category chips (e.g. Ẩm thực → 2 địa điểm), the off-screen hint pills (Hải sản tươi 8 km, Làng chài Cửa Vạn 11 km),
  back at each level, and the credits page lists the destination's photos.
- No failed requests in the final page load.

**Photos: 27/27, exactly 3 per place.** Sources: Wikimedia Commons only (CC BY 2.0/3.0/4.0, CC BY-SA 2.0/4.0, CC0, public
domain). 13 MB of WebP.
- Cửa Vạn: the three photos are by one Flickr author (David Stanley, via Commons) and only 1024 px wide, so the largest
  built size is 800 px. They are the only Commons files that explicitly name Cửa Vạn.
- Seafood: one photo is from Hạ Long Bay (a seller on a boat); the other two are generic Vietnamese fish markets. All three
  are tagged "Ảnh minh họa". None shows Chợ Hòn Gai itself.
- Chả mực: two photos described as chả mực Hạ Long and one home-made; all tagged "Ảnh minh họa".

**Known gaps and cosmetic issues:**
- The two food locations share one point, so their pins sit on top of each other (both names show, one on each side; the
  list reaches both). See request 2.
- No source confirms that Chợ Hòn Gai sells chả mực (owner decision to pin it there anyway).
- On a 390 × 844 phone the landing zoom equals the area lock's minimum zoom (12.25), so the user can pan but not zoom out.
  Desktop has 0.25 zoom levels of room. Widening the bbox further north/south would fix it but needs another Overpass
  fetch and a bigger file.
- OSM peak "May Bau" has no diacritics in OSM; it shows as is.
- Pins of tiny islets (Hòn Trống Mái) sit in open water at landing zoom because the islet is only a few metres wide.

## Requests for the main session

1. **`tools/build-local-map.mjs`: skip maritime protected areas.** OSM relation 19465352 (UNESCO "Vịnh Hạ Long – Quần đảo
   Cát Bà", `boundary=protected_area`, `maritime=yes`) covers the whole bay, and the tool draws it as a `reserve` polygon,
   so the sea looks like land. Suggested fix: ignore protected areas tagged `maritime=yes` (or ones whose area is mostly
   outside the land polygons). Until then, `assets/maps/vinh-ha-long.geojson` has that one feature removed by hand after
   the build; **a plain rebuild will bring it back**.
2. **`js/local-map.js`: spread pins that share a point**, like `layoutPins` on the country map. Hải sản tươi and Chả mực
   both sit at Chợ Hòn Gai (owner decision), so one pin hides the other; tapping always opens the top one.
3. (Minor) `tools/build-local-map.mjs` labels only `place=island/islet` **nodes**. In Hạ Long most named islands are
   **ways/relations** (Bồ Hòn, Đầu Gỗ, Ti Tốp, Tuần Châu), so I added them as `mapLabels`. Labelling named island
   ways/relations at their centroid would help Hạ Long, Nha Trang and Cần Giờ.
