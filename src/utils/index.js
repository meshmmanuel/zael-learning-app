import { state } from '../state.js';
import {
  MATH_MODES_ORDER,
  MATH_MODES_COMPARE,
  MATH_MODES_ARITH,
  ORDER_RANGES,
  COMPARE_PRESETS,
} from '../config/index.js';

export const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export function isOrderMode(mode = state.mathMode) {
  return MATH_MODES_ORDER.includes(mode);
}

export function isCompareMode(mode = state.mathMode) {
  return MATH_MODES_COMPARE.includes(mode);
}

export function isArithMode(mode = state.mathMode) {
  return MATH_MODES_ARITH.includes(mode);
}

export function usesNumberLineHelper() {
  return state.mathHelper === 'numberline' && isArithMode();
}

export function isOrderQuestion(q) {
  return q && (q.type === 'beforeAfter' || q.type === 'between');
}

export function isCompareQuestion(q) {
  return q && q.type === 'compare';
}

export function getOrderRange() {
  return ORDER_RANGES[state.mathDifficulty] || ORDER_RANGES.medium;
}

export function getComparePreset() {
  return COMPARE_PRESETS[state.mathDifficulty] || COMPARE_PRESETS.medium;
}

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function starLineForScore(score, total) {
  const ratio = score / total;
  if (ratio >= 0.9) return '⭐⭐⭐';
  if (ratio >= 0.6) return '⭐⭐';
  return '⭐';
}
