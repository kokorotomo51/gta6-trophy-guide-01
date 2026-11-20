# Leonida Trophy Field Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kokorotomo51/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kokorotomo51/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Entered in [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01): a complete, offline trophy guide and tracker for **Grand Theft Auto VI** on PlayStation 5 — all 55 trophies, each with a method written in our own words, a roadmap to the platinum in about 200 hours, and a tracker that remembers what you have earned.

## What it is

- **Checklist** — every trophy with its official name, description and grade, a guide, and the sources behind it. Filter by grade, kind, or search; tick trophies off and your progress is saved in the browser; export or import it as JSON.
- **Roadmap to the platinum** — three steps (story, 100% checklist, cleanup), the 100% checklist at a glance, and the one missable trophy called out up front.
- **Spoiler-free mode** — hides story trophies until you earn them, so the guide never spoils the campaign.
- **Missable warning** — a dismissible banner about Positive Mental Attitude, the only trophy you can lock yourself out of: meditate at Jason's house in Chapter 1, after the mission Down to Earth.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network at runtime: the app is plain static files and loads only its own `app/data/trophies.json`. Source links are ordinary links — the app fetches nothing.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library. Running it twice produces byte-identical output.

## Facts

- 55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. 0 online trophies. 1 playthrough. About 200 hours. Difficulty 4/10.
- Exactly one missable trophy (Positive Mental Attitude). No mission replay, 15 manual save slots — keep a save at the start and end of each chapter.
- Cheats disable trophies and saving.
- 100% completion is closer to 60% true completion: 100 optional missions, 200 of 277 vehicles scanned, 100 of 255 animals studied, any 70 of 80 challenges.

## Sources

Every method in this guide is written in our own words from these two guides, which are cited beside each trophy:

- [PowerPyx — GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/) (main source)
- [Push Square — GTA 6 Trophy Guide & Roadmap](https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap) (cross-check)

Official trophy names, descriptions and grades are shown exactly as PlayStation publishes them. No Rockstar artwork, logos or game screenshots are used anywhere in the guide.
