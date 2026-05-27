# Kids Learning Playground

A lightweight browser-based learning app for kids (math and spelling).

## What it does
- Home screen to pick **Numbers** (math) or **Spelling**.
- Math setup: choose **adding & taking away** (both, add only, subtract only) or **number order** (**before & after** or **between**), plus difficulty.
- **Before & after** / **Between**: fill missing numbers on a number line. Easy = 1–2 blanks; medium = more blanks on a longer line; hard = even longer (difficulty grows by unknowns, not just bigger numbers).
- Spelling setup (in order): **Letter sounds** → **Picture words** → **Arrow words**.
- **Letter sounds**: tap A–Z to hear phonics sounds from `audio/phonics_audio/` (Consonant + Short Vowel folders), or **Play A to Z**. MP3s are from [Read Naturally](https://www.readnaturally.com) (see `scripts/download_phonics_audio.py` if the folder is empty).
- Picture spelling: **CVC**, **Blends**, **Digraphs**, or **Mixed** — fill in missing letters with a letter bank (picture + hints). Uses `audio/alphasounds/` for letter names while building words.
- Arrow words: **random** CVC boards each round — follow **colored arrows** from start → middle vowel → end, submit each word, and find every path on the board (3 boards per round).
- Shows 10 questions per round with emoji counting interactions.
- Tracks score and best score in local storage (per math setup, with legacy fallback).
- Spelling best score is saved **per spelling category**.
- Includes optional sound effects and hints.

## Project structure

| Path | Purpose |
|------|---------|
| `index.html` | App shell (screens and controls) |
| `styles.css` | Layout, themes, animations |
| `app.runtime.js` | **Shipped bundle** — open `index.html` from disk (`file://`) |
| `src/` | ES module source (edit here) |
| `src/main.js` | Entry point |
| `src/activities/registry.js` | Activity routes — register new homework modes here |
| `src/config/` | Constants, audio maps, difficulty presets |
| `src/content/` | Word lists and puzzle data |
| `src/math/`, `src/spelling/` | Activity logic |
| `src/router.js` | Screen navigation |
| `src/bootstrap.js` | Event wiring and startup |
| `legacy/modules/` | Old standalone module drafts (not used in the build) |

## Run locally

**Play (no install):** open `index.html` in a browser.

**Develop:** after changing files under `src/`, rebuild the bundle:

```bash
npm install   # once
npm run build # writes app.runtime.js
npm run watch # rebuild on save (optional)
```

Then refresh the browser.

## Adding a new homework activity

1. Add content under `src/content/` if the activity needs word lists or JSON-like data.
2. Create `src/activities/<name>.js` (or a folder) with setup + play functions.
3. Register the activity in `src/activities/registry.js` (routes, optional `onLeave`).
4. Add any new screens to `index.html` and styles to `styles.css`.
5. Wire buttons in `src/bootstrap.js`.
6. Run `npm run build` and test on a phone-sized window.

Reuse existing patterns: **pick-one** (number pad), **fill blanks** (spelling slots), **explore** (phonics grid), **path board** (arrow words).
