export const BASE_CONFIG = {
  totalQuestions: 10,
  mixedHalf: 5,
  nextQuestionDelayMs: 1800,
  wrongAnswerUnlockDelayMs: 500,
  keyBufferResetMs: 700,
  confettiLifetimeMs: 3000,
  confettiStaggerMs: 40,
  /** Safety ceiling only — no “stop at the right number” aid. */
  emojiBuildMax: 30,
};

export function canAddMoreEmojis(count) {
  return count < BASE_CONFIG.emojiBuildMax;
}

export const DIFFICULTY_PRESETS = {
  easy: {
    additionRange: { min: 1, max: 5 },
    subtractionMinA: 3,
    subtractionMaxA: 8,
  },
  medium: {
    additionRange: { min: 1, max: 9 },
    subtractionMinA: 3,
    subtractionMaxA: 12,
  },
  hard: {
    additionRange: { min: 1, max: 12 },
    subtractionMinA: 4,
    subtractionMaxA: 15,
  },
};

export const ORDER_RANGES = {
  easy: { min: 10, max: 30 },
  medium: { min: 30, max: 80 },
  hard: { min: 20, max: 99 },
};

/** Consecutive number-line layouts: more blanks on medium/hard, not just bigger numbers. */
export const ORDER_LAYOUT = {
  easy: {
    beforeAfter: { length: 3, shownIndices: [1] },
    between: { length: 3, shownIndices: [0, 2] },
  },
  medium: {
    beforeAfter: { length: 5, shownIndices: [1, 3] },
    between: { length: 5, shownIndices: [0, 4] },
  },
  hard: {
    beforeAfter: { length: 7, shownIndices: [2, 4] },
    between: { length: 7, shownIndices: [0, 6] },
  },
};

export const MATH_MODES_ARITH = ['mixed', 'add', 'sub'];
export const MATH_MODES_ORDER = ['beforeAfter', 'between'];
export const MATH_MODES_ALL = [...MATH_MODES_ARITH, ...MATH_MODES_ORDER];

export const THEMES = [
  { name: 'fruits', emojis: ['🍎', '🍋', '🍇'] },
  { name: 'animals', emojis: ['🐸', '🐶', '🐱'] },
  { name: 'space', emojis: ['🚀', '⭐', '🪐'] },
  { name: 'ocean', emojis: ['🐠', '🐙', '🦀'] },
  { name: 'jungle', emojis: ['🦁', '🐘', '🦒'] },
];

export const PASTELS = ['#FFD6D6', '#FFE4C4', '#FFFACD', '#D4F1C0', '#C8E6FF', '#E8D5FF', '#FFD6F0', '#D6FFF6'];
export const SOUND_FILES = {
  select: 'audio/click.mp3',
  wrong: 'audio/incorrect.mp3',
  correct: 'audio/correct.mp3',
  celebration: 'audio/celebration.mp3',
  endPerfect: 'audio/congratulations.mp3',
  endTryAgain: 'audio/try-again.mp3',
  addEmoji: 'audio/add.mp3',
  toggle: 'audio/toggle.mp3',
  submit: 'audio/submit.mp3',
};

export const ALPHA_SOUND_DIR = 'audio/alphasounds/';
export const ALPHA_SOUND_SRC = (() => {
  const m = {};
  for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(97 + i);
    m[c] = `${ALPHA_SOUND_DIR}alphasounds-${c}.mp3`;
  }
  m.o = `${ALPHA_SOUND_DIR}alphasounds-o-sh.mp3`;
  m.p = `${ALPHA_SOUND_DIR}alphasounds-p-2.mp3`;
  m.u = `${ALPHA_SOUND_DIR}alphasounds-u-sh.mp3`;
  return m;
})();

export const PHONICS_SOUND_SRC = {
  a: 'audio/phonics_audio/Short_Vowel/a-apple.mp3',
  e: 'audio/phonics_audio/Short_Vowel/e-elephant.mp3',
  i: 'audio/phonics_audio/Short_Vowel/i-igloo.mp3',
  o: 'audio/phonics_audio/Short_Vowel/o-octopus.mp3',
  u: 'audio/phonics_audio/Short_Vowel/u-up.mp3',
  b: 'audio/phonics_audio/Consonant/b-bat.mp3',
  c: 'audio/phonics_audio/Consonant/c-cut.mp3',
  d: 'audio/phonics_audio/Consonant/d-dip.mp3',
  f: 'audio/phonics_audio/Consonant/f-fun.mp3',
  g: 'audio/phonics_audio/Consonant/g-get.mp3',
  h: 'audio/phonics_audio/Consonant/h-hat.mp3',
  j: 'audio/phonics_audio/Consonant/j-jog.mp3',
  k: 'audio/phonics_audio/Consonant/k-kit.mp3',
  l: 'audio/phonics_audio/Consonant/l-lip.mp3',
  m: 'audio/phonics_audio/Consonant/m-mug.mp3',
  n: 'audio/phonics_audio/Consonant/n-nap.mp3',
  p: 'audio/phonics_audio/Consonant/p-pick.mp3',
  q: 'audio/phonics_audio/Consonant/qu-quest.mp3',
  r: 'audio/phonics_audio/Consonant/r-rid.mp3',
  s: 'audio/phonics_audio/Consonant/s-sit-mess.mp3',
  t: 'audio/phonics_audio/Consonant/t-tuck.mp3',
  v: 'audio/phonics_audio/Consonant/v-van.mp3',
  w: 'audio/phonics_audio/Consonant/w-will.mp3',
  x: 'audio/phonics_audio/Consonant/x-mix-rocks.mp3',
  y: 'audio/phonics_audio/Consonant/y-yes.mp3',
  z: 'audio/phonics_audio/Consonant/z-zip-buzz.mp3',
};

export const PHONICS_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const STORAGE = { mathPrefs: 'kidsAppV1MathPrefs', spellingPrefs: 'kidsAppV1SpellingPrefs' };
export const LEGACY_BEST_KEY = 'kidsMathV3BestScore';

export const SPELLING_TOTAL = 10;
export const SPELLING_DECOYS = 2;

export const ARROW_COLOR_IDS = ['red', 'green', 'blue', 'yellow', 'black'];
export const ARROW_BOARDS_PER_ROUND = 3;
export const ARROW_WORDS_MIN = 4;
export const ARROW_WORDS_MAX = 5;
