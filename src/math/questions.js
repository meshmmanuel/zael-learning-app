import { state } from '../state.js';
import {
  BASE_CONFIG,
  DIFFICULTY_PRESETS,
  ORDER_LAYOUT,
} from '../config/index.js';
import {
  rnd,
  shuffle,
  isOrderMode,
  isOrderQuestion,
  getOrderRange,
} from '../utils/index.js';

export function buildSequenceChoices(correctValues, sequenceValues, rangeMin, rangeMax) {
  const correctSet = new Set(correctValues);
  const extras = new Set();
  for (const v of sequenceValues) {
    for (let d = -4; d <= 4; d++) {
      const n = v + d;
      if (n >= rangeMin && n <= rangeMax && !correctSet.has(n)) extras.add(n);
    }
  }
  const minChoices = Math.max(8, correctSet.size + 2);
  let guard = 0;
  while (correctSet.size + extras.size < minChoices && guard < 50) {
    const n = rnd(rangeMin, rangeMax);
    if (!correctSet.has(n)) extras.add(n);
    guard++;
  }
  const pickedExtras = shuffle([...extras]).slice(0, minChoices - correctSet.size);
  return shuffle([...correctSet, ...pickedExtras]);
}

export function genOrderQuestion(kind) {
  const { min, max } = getOrderRange();
  const layout = ORDER_LAYOUT[state.mathDifficulty]?.[kind] || ORDER_LAYOUT.medium[kind];
  const { length, shownIndices } = layout;
  const start = rnd(min, max - length + 1);
  const values = Array.from({ length }, (_, i) => start + i);
  const shownSet = new Set(shownIndices);
  const blankIndices = [];
  const answers = {};
  for (let i = 0; i < length; i++) {
    if (!shownSet.has(i)) {
      blankIndices.push(i);
      answers[i] = values[i];
    }
  }
  return {
    type: kind,
    values,
    shownIndices,
    blankIndices,
    answers,
    choices: buildSequenceChoices(Object.values(answers), values, min, max),
  };
}

export function orderBlankCount(q) {
  return q.blankIndices?.length ?? 0;
}

export function firstUnfilledBlankIndex(q) {
  return q.blankIndices.find((i) => state.orderAnswers[i] === undefined) ?? null;
}

export function genQuestions() {
  const total = BASE_CONFIG.totalQuestions;

  if (isOrderMode()) {
    const qs = [];
    for (let i = 0; i < total; i++) {
      qs.push(genOrderQuestion(state.mathMode));
    }
    return shuffle(qs);
  }

  const preset = DIFFICULTY_PRESETS[state.mathDifficulty];
  const qs = [];

  let addCount = 0;
  let subCount = 0;
  if (state.mathMode === 'add') addCount = total;
  else if (state.mathMode === 'sub') subCount = total;
  else {
    addCount = BASE_CONFIG.mixedHalf;
    subCount = total - addCount;
  }

  for (let i = 0; i < addCount; i++) {
    const a = rnd(preset.additionRange.min, preset.additionRange.max);
    const b = rnd(preset.additionRange.min, preset.additionRange.max);
    qs.push({ type: 'add', a, b, ans: a + b });
  }
  for (let i = 0; i < subCount; i++) {
    const a = rnd(preset.subtractionMinA, preset.subtractionMaxA);
    const b = rnd(1, a - 1);
    qs.push({ type: 'sub', a, b, ans: a - b });
  }
  return shuffle(qs);
}

