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

Commons has many Hội An photos; check categories such as the old town and the Japanese Covered Bridge. Cao lầu and cơm gà need ≥ 3 photos each (generic "Ảnh minh họa" allowed).

Minimums (owner):
- ≥ 5 destination photos;
- ≥ 3 per location;
- ≥ 3 per food location;
- up to 10 for food, beach and mountain/forest places.

Commons only (CC0 / PD / CC BY / CC BY-SA). Report gaps instead of padding.

## Map notes

Old town streets are dense: keep `coreBbox` tight around the old town.

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
