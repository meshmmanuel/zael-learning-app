import { state } from '../state.js';
import { STORAGE } from '../config/index.js';

export function bestSpellingScoreKey() {
  if (state.spellingMode === 'arrow') return 'kidsSpellBest_arrow';
  return `kidsSpellBest_${state.spellingCategory}`;
}

export function getSpellingBest() {
  try {
    const v = Number(localStorage.getItem(bestSpellingScoreKey()));
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

export function setSpellingBest(v) {
  try {
    localStorage.setItem(bestSpellingScoreKey(), String(v));
  } catch {
    // ignore
  }
}

export function loadSpellingPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE.spellingPrefs);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.mode === 'phonics' || data.mode === 'picture' || data.mode === 'arrow') state.spellingMode = data.mode;
    if (data.category === 'cvc' || data.category === 'blend' || data.category === 'digraph' || data.category === 'mixed') {
      state.spellingCategory = data.category;
    }
  } catch {
    // ignore
  }
}

export function saveSpellingPrefs() {
  try {
    localStorage.setItem(STORAGE.spellingPrefs, JSON.stringify({
      mode: state.spellingMode,
      category: state.spellingCategory,
    }));
  } catch {
    // ignore
  }
}
