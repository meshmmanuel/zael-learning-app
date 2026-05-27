import { state } from '../state.js';
import { STORAGE, LEGACY_BEST_KEY, MATH_MODES_ALL } from '../config/index.js';

export function bestScoreStorageKey() {
  return `kidsMathBest_${state.mathMode}_${state.mathDifficulty}`;
}

export function getBestScore() {
  try {
    const key = bestScoreStorageKey();
    const cur = Number(localStorage.getItem(key));
    if (Number.isFinite(cur)) return cur;
    const legacy = Number(localStorage.getItem(LEGACY_BEST_KEY) || 0);
    return Number.isFinite(legacy) ? legacy : 0;
  } catch {
    return 0;
  }
}

export function setBestScore(v) {
  try {
    const key = bestScoreStorageKey();
    localStorage.setItem(key, String(v));
    const legacy = Number(localStorage.getItem(LEGACY_BEST_KEY) || 0);
    if (v > legacy) localStorage.setItem(LEGACY_BEST_KEY, String(v));
  } catch {
    // ignore
  }
}

export function loadMathPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE.mathPrefs);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (MATH_MODES_ALL.includes(data.mode)) {
      state.mathMode = data.mode;
    } else if (data.mode === 'before' || data.mode === 'after' || data.mode === 'orderMixed') {
      state.mathMode = 'beforeAfter';
    }
    if (data.difficulty === 'easy' || data.difficulty === 'medium' || data.difficulty === 'hard') {
      state.mathDifficulty = data.difficulty;
    }
  } catch {
    // ignore
  }
}

export function saveMathPrefs() {
  try {
    localStorage.setItem(STORAGE.mathPrefs, JSON.stringify({ mode: state.mathMode, difficulty: state.mathDifficulty }));
  } catch {
    // ignore
  }
}

