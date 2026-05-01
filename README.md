# Kids Math Game

A lightweight browser-based math game for kids.

## What it does
- Home screen to pick **Numbers** (math) or **Spelling**.
- Math setup: choose practice type (both, adding only, taking away only) and difficulty.
- Spelling setup: choose **CVC**, **Blends**, **Digraphs**, or **Mixed** — then fill in missing letters with a letter bank (picture + hints). No letter-recorded audio yet.
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
