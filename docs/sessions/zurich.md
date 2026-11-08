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

Commons only (CC0 / PD / CC BY / CC BY-SA). Report gaps instead of padding.

## Map notes

A dense city: keep `coreBbox` to the Altstadt. OSM labels are German; that's acceptable (proper names). Vietnamese `mapLabels` can add "Hồ Zürich" and "Sông Limmat".

---

## Proposal

_(Stage A: fill in, then ask the owner to approve.)_

## Status log

| Date | Item |
|---|---|
| 2026-11-08 | Brief created by the main session. Placeholder `destination.json` exists with `"status": "planned"`. |

## Result

_(Stage C: what works, photo counts vs. minimums, known gaps.)_

## Requests for the main session

_(Shared-code bugs or changes you need. Don't edit shared files yourself.)_
