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

_(Stage A: fill in, then ask the owner to approve.)_

## Status log

| Date | Item |
|---|---|
| 2026-11-08 | Brief created by the main session. Placeholder `destination.json` exists with `"status": "planned"`. |

## Result

_(Stage C: what works, photo counts vs. minimums, known gaps.)_

## Requests for the main session

_(Shared-code bugs or changes you need. Don't edit shared files yourself.)_
