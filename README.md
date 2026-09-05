# Shadow Temple — The Lost Tablet

Dark, realistic 2D archaeological exploration and puzzle game built with Phaser. The player explores an ancient temple, reads clues, collects objects, and gradually uncovers what happened there.

## Current system

- English game language.
- Main menu: `Start New Game`, `Continue Saved Game`, `Exit Game`.
- New game opens the first temple room.
- `Esc` pause menu: `Resume Game`, `Main Menu`, `Exit Game`.
- Full-screen temple environment using `assets/temple-entrance.png`.
- No decorative objects are drawn over the reference image; doors and objects use invisible hitboxes aligned to the image.
- Three doors: left, middle, and right.
- Three discoverable objects: sentinel statue, broken pot, and shovel.
- Hovering an object shows an inspection clue; hovering a door shows `Continue through this door`.
- Discoverable objects have a soft breathing highlight instead of permanent labels; hovering one reveals a magnifying-glass marker.
- Clue panel flow: an atmospheric line appears first, and `Read more` reveals the detailed clue.
- Sword cursor: `assets/sword-cursor.svg`.
- Inventory button in the lower-right corner; capacity is 10 items and collected items show their clues on hover.
- Browser-generated tense ambient drone and filtered noise bed begin when starting a new game or continuing a save; the lower-left sound controls mute them and adjust their volume.
- Local Git history and GitHub remote: `https://github.com/ceren52/arkeoloji-bulmaca-oyunu.git`.

## Run locally

```powershell
python -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## Next Steps

When a feature is completed, change its checkbox to `✅`.

- ✅ New-game introduction: a typewriter-style aged-paper letter introduces Leyla Demir and her missing uncle Elias.
- [ ] Combine inventory items: obsidian fragment + tablet.
- [ ] Combine inventory items: shovel + excavation mark.
- [ ] Combine inventory items: wall painting + star map.
- [ ] Add a lower-left mini-map showing the current room.
- ✅ Show a small magnifying-glass or glow indicator when hovering an object.
- ✅ Replace permanent labels with subtle object shimmer/highlight.
- ✅ Clue boxes: atmospheric short line first, detailed clue behind `Read more`.
- ✅ Add tense atmospheric background music and sound controls.
- [ ] Make each of the three doors open a separate room.
- [ ] Add room-specific clues and save room progress.

## Design direction

The game should feel like a slow archaeological mystery: inspect the environment, notice relationships between objects, combine clues, and decide what the evidence means. The player should ask “What happened here?” rather than simply “What do I click?”

## Project history

The project began as a small browser puzzle, then moved toward a Phaser-based 2D exploration game with a dark realistic visual style. Code stays in this repository; long-term project decisions are documented in this README and general session memory stays in the Obsidian companion folder.

## Documentation protocol

This README is the single project note. A Codex `Stop` hook checks that code changes are accompanied by a README update before committing. After every meaningful change, update the relevant section before finishing the session:

1. Record completed behavior under `Current system`.
2. Mark the matching item under `Next Steps` as `✅`, or leave it unchecked if only partially done.
3. Add a short `Project history` entry with the change, reason, test result, and next step.
4. Keep code in the project folder and keep this README synchronized with the implementation.

## Change log

- 2026-09-06 — Added the project documentation protocol so future Codex sessions update this README and keep the roadmap honest.
- 2026-09-06 — Added the new-game story introduction: the player identity and Uncle Elias’ disappearance appear on an aged paper with a typewriter reveal before entering the temple.
- 2026-09-06 — Added a browser-generated ambient drone and filtered noise bed with mute and volume controls; they start from the new-game intro or saved-game flow. Tested with JavaScript syntax checks; next step is to tune the atmosphere after playtesting.
- 2026-09-06 — Increased the default ambient mix so the tension layer is clearly audible while remaining adjustable from the lower-left volume slider.
- 2026-09-06 — Reworked object discovery: invisible hitboxes now produce a soft shimmer, a magnifying-glass hover marker, and a two-step atmospheric clue panel with `Read more`. Tested with JavaScript syntax and local HTTP checks; next step is implementing separate door rooms.
