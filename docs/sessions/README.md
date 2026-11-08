# Destination sessions

One Claude Code session per destination, each on its own branch `dest/<id>` (a separate git
worktree is best). They can run **in parallel**: each session writes only to its own folders
(see `CLAUDE.md` → "Working in parallel" and `docs/PLAYBOOK-destination.md`).

| Destination | Country | Brief | Branch |
|---|---|---|---|
| Hội An | Việt Nam | [hoi-an.md](hoi-an.md) | `dest/hoi-an` |
| Vịnh Hạ Long | Việt Nam | [vinh-ha-long.md](vinh-ha-long.md) | `dest/vinh-ha-long` |
| Ninh Bình | Việt Nam | [ninh-binh.md](ninh-binh.md) | `dest/ninh-binh` |
| Đà Lạt | Việt Nam | [da-lat.md](da-lat.md) | `dest/da-lat` |
| Nha Trang | Việt Nam | [nha-trang.md](nha-trang.md) | `dest/nha-trang` |
| Vũng Tàu | Việt Nam | [vung-tau.md](vung-tau.md) | `dest/vung-tau` |
| Cần Giờ | Việt Nam | [can-gio.md](can-gio.md) | `dest/can-gio` |
| Zürich | Thụy Sĩ | [zurich.md](zurich.md) | `dest/zurich` |
| Luzern | Thụy Sĩ | [luzern.md](luzern.md) | `dest/luzern` |
| Montreux (hồ Léman) | Thụy Sĩ | [montreux.md](montreux.md) | `dest/montreux` |

**Starting a session:** create the branch or worktree from `main`, open a session in it, and paste
the prompt from the brief's "How to start this session".

**Practical limits when running many at once:**
- Wikimedia Commons and Overpass are shared free services that rate-limit heavy use. Running all
  10 sessions at the same moment will make their downloads slow. Three or four at a time is
  smoother.
- Each session asks you to approve its proposal (stage A) before building.

**Merging (owner or main session):** merge `dest/<id>` into `main` when its brief's "Result" says
it is done. Branches touch disjoint paths, so merges shouldn't conflict. Then the main session
handles any "Requests for the main session".
