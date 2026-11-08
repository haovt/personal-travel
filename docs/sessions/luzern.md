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

Wikimedia Commons first (CC0 / PD / CC BY / CC BY-SA). If a minimum can't be met, use Flickr (CC, never ND), Unsplash or Pexels as described in the playbook (step B4b). Report gaps instead of padding.

## Map notes

Keep the bbox to the city and the lake shore. Mountains far away get off-screen hints.

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
