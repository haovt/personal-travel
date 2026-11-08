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

_(Stage A: fill in, then ask the owner to approve.)_

## Status log

| Date | Item |
|---|---|
| 2026-11-08 | Brief created by the main session. Placeholder `destination.json` exists with `"status": "planned"`. |

## Result

_(Stage C: what works, photo counts (target 3 per place), known gaps.)_

## Requests for the main session

_(Shared-code bugs or changes you need. Don't edit shared files yourself.)_
