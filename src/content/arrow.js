import { SPELLING_LISTS } from './spelling-lists.js';
import { shuffle, rnd } from '../utils/index.js';
import {
  ARROW_COLOR_IDS,
  ARROW_WORDS_MIN,
  ARROW_WORDS_MAX,
  ARROW_BOARDS_PER_ROUND,
} from '../config/index.js';

export const ARROW_CVC_EXTRA = [
  'fan', 'ram', 'mat', 'bag', 'mad', 'bat', 'sap', 'car', 'rat', 'lap', 'ran', 'cap', 'tap', 'pan',
  'red', 'hen', 'net', 'pet', 'wet', 'leg',
  'sit', 'bin', 'fin', 'dig', 'big', 'fig',
  'pot', 'hot', 'cop', 'mop', 'top', 'pop',
  'bug', 'hug', 'mud', 'bus', 'cut', 'nut',
];

export const ARROW_COLORS = {
  red: { label: 'Red', stroke: '#e53935', light: '#ffcdd2' },
  green: { label: 'Green', stroke: '#43a047', light: '#c8e6c9' },
  blue: { label: 'Blue', stroke: '#1e88e5', light: '#bbdefb' },
  yellow: { label: 'Yellow', stroke: '#f9a825', light: '#fff9c4' },
  black: { label: 'Black', stroke: '#424242', light: '#e0e0e0' },
};

export function getArrowCvcPool() {
  const seen = new Set();
  const out = [];
  const add = (w) => {
    const word = w.toLowerCase();
    if (word.length !== 3 || !/^[a-z]{3}$/.test(word) || seen.has(word)) return;
    seen.add(word);
    out.push(word);
  };
  SPELLING_LISTS.cvc.forEach((item) => add(item.w));
  ARROW_CVC_EXTRA.forEach(add);
  return out;
}

export function groupCvcByVowel(pool) {
  const groups = {};
  pool.forEach((w) => {
    const vowel = w[1];
    if (!groups[vowel]) groups[vowel] = [];
    groups[vowel].push(w);
  });
  return groups;
}

export function buildArrowPuzzle(center, wordList) {
  const words = wordList.slice(0, ARROW_WORDS_MAX);
  const n = words.length;
  const left = words.map((w) => w[0]);
  const right = new Array(n);
  const perm = shuffle([...Array(n).keys()]);
  perm.forEach((slot, i) => {
    right[slot] = words[i][2];
  });
  const colorOrder = shuffle([...ARROW_COLOR_IDS]);
  const puzzleWords = words.map((w, i) => ({
    w,
    leftIdx: i,
    rightIdx: perm[i],
    color: colorOrder[i % colorOrder.length],
  }));
  const hint = puzzleWords[0];
  return {
    center,
    hintWord: hint.w,
    hintColor: hint.color,
    left,
    right,
    words: puzzleWords,
  };
}

export function buildArrowRound() {
  const groups = groupCvcByVowel(getArrowCvcPool());
  const vowels = shuffle(
    Object.keys(groups).filter((v) => groups[v].length >= ARROW_WORDS_MIN)
  );
  const boards = [];
  const used = new Set();

  for (let i = 0; i < ARROW_BOARDS_PER_ROUND; i++) {
    let vowel = vowels[i];
    if (!vowel) {
      vowel = Object.keys(groups).find((v) => groups[v].length >= ARROW_WORDS_MIN);
    }
    if (!vowel) break;

    const maxCount = Math.min(ARROW_WORDS_MAX, groups[vowel].length);
    const count = rnd(ARROW_WORDS_MIN, maxCount);
    const candidates = shuffle([...groups[vowel]]).filter((w) => !used.has(w));
    let picked = candidates.slice(0, count);
    if (picked.length < ARROW_WORDS_MIN) {
      picked = shuffle([...groups[vowel]]).filter((w) => !used.has(w)).slice(0, count);
    }
    if (picked.length < ARROW_WORDS_MIN) continue;
    picked.forEach((w) => used.add(w));
    boards.push(buildArrowPuzzle(vowel, picked));
  }

  while (boards.length < ARROW_BOARDS_PER_ROUND) {
    const avail = shuffle(
      Object.keys(groups).filter((v) => groups[v].length >= ARROW_WORDS_MIN)
    );
    if (!avail.length) break;
    const vowel = avail[0];
    const maxCount = Math.min(ARROW_WORDS_MAX, groups[vowel].length);
    const count = rnd(ARROW_WORDS_MIN, maxCount);
    const picked = shuffle([...groups[vowel]]).filter((w) => !used.has(w)).slice(0, count);
    if (picked.length < ARROW_WORDS_MIN) break;
    picked.forEach((w) => used.add(w));
    boards.push(buildArrowPuzzle(vowel, picked));
  }

  return boards;
}
