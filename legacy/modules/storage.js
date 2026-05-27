import { BEST_SCORE_KEY } from './config.js';

export function getBestScore() {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
  } catch {
    return 0;
  }
}

export function setBestScore(value) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(value));
  } catch {
    // Ignore storage errors (e.g. private mode restrictions).
  }
}
