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

Wikimedia Commons first (CC0 / PD / CC BY / CC BY-SA). If a minimum can't be met, use Flickr (CC, never ND), Unsplash or Pexels as described in the playbook (step B4b). Report gaps instead of padding.

## Map notes

A large bbox with many islands can exceed 1.5 MB. Keep it to the core bay plus Hạ Long city, and consider dropping `coreBbox` residential streets entirely. Labels: island names come from OSM `place=island/islet`.

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
