import { state } from '../state.js';
import { STORAGE } from '../config/index.js';

export function loadBigwordsPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE.bigwordsPrefs);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (['easy', 'medium', 'hard'].includes(data.difficulty)) {
      state.bigwordsDifficulty = data.difficulty;
    }
  } catch {
    // ignore
  }
}

export function saveBigwordsPrefs() {
  try {
    localStorage.setItem(
      STORAGE.bigwordsPrefs,
      JSON.stringify({ difficulty: state.bigwordsDifficulty }),
    );
  } catch {
    // ignore
  }
}
