import { GAME_CONFIG } from './config.js';

function rnd(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function genQuestions() {
  const qs = [];
  for (let i = 0; i < GAME_CONFIG.additionQuestions; i++) {
    const a = rnd(GAME_CONFIG.additionRange.min, GAME_CONFIG.additionRange.max);
    const b = rnd(GAME_CONFIG.additionRange.min, GAME_CONFIG.additionRange.max);
    qs.push({ type: 'add', a, b, ans: a + b });
  }
  for (let i = 0; i < GAME_CONFIG.subtractionQuestions; i++) {
    const a = rnd(GAME_CONFIG.subtractionMinA, GAME_CONFIG.subtractionMaxA);
    const b = rnd(1, a - 1);
    qs.push({ type: 'sub', a, b, ans: a - b });
  }
  return shuffle(qs);
}
