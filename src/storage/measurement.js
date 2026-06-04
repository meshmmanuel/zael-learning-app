import { state } from '../state.js';
import { STORAGE } from '../config/index.js';

export function bestMeasureScoreKey() {
  return `kidsMeasureBest_${state.measureMode}`;
}

export function getMeasureBest() {
  try {
    const v = Number(localStorage.getItem(bestMeasureScoreKey()));
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

export function setMeasureBest(v) {
  try {
    localStorage.setItem(bestMeasureScoreKey(), String(v));
  } catch {
    // ignore
  }
}

export function loadMeasurePrefs() {
  try {
    const raw = localStorage.getItem(STORAGE.measurePrefs);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (['mixed', 'heavier', 'lighter', 'presents'].includes(data.mode)) {
      state.measureMode = data.mode;
    }
  } catch {
    // ignore
  }
}

export function saveMeasurePrefs() {
  try {
    localStorage.setItem(STORAGE.measurePrefs, JSON.stringify({ mode: state.measureMode }));
  } catch {
    // ignore
  }
}
