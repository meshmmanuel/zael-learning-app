# Kids Math Game

A lightweight browser-based math game for kids.

## What it does
- Home screen to pick **Numbers** (math) or **Spelling**.
- Math setup: choose **adding & taking away** (both, add only, subtract only) or **number order** (before, between, after, or all three), plus difficulty.
- Number order uses number-line style questions (e.g. what comes before 67, between 35 and 37) with kid-friendly multiple-choice answers.
- Spelling setup (in order): **Letter sounds** → **Picture words** → **Arrow words**.
- **Letter sounds**: tap A–Z to hear phonics sounds from `audio/phonics_audio/` (Consonant + Short Vowel folders), or **Play A to Z**. MP3s are from [Read Naturally](https://www.readnaturally.com) (see `scripts/download_phonics_audio.py` if the folder is empty).
- Picture spelling: **CVC**, **Blends**, **Digraphs**, or **Mixed** — fill in missing letters with a letter bank (picture + hints). Uses `audio/alphasounds/` for letter names while building words.
- Arrow words: **random** CVC boards each round — follow **colored arrows** from start → middle vowel → end, submit each word, and find every path on the board (3 boards per round).
- Shows 10 questions per round with the same emoji counting interactions as before.
- Tracks score and best score in local storage (per math setup, with legacy fallback).
- Spelling best score is saved **per spelling category**.
- Includes optional sound effects and hints.

## Project structure
- `index.html` - app shell
- `styles.css` - styles and animations
- `app.runtime.js` - full game logic (works when you open `index.html` from disk)
- Optional ES module sources (for a local dev server only; not for `file://`):
  - `config.js`, `state.js`, `dom.js`, `questions.js`, `audio.js`, `storage.js`

## Run locally
Open `index.html` in a browser (double-click or drag into a tab).

### Optional: run with a local server (for ES modules)
From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in the browser.
