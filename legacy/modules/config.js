export const GAME_CONFIG = {
  totalQuestions: 10,
  additionQuestions: 5,
  subtractionQuestions: 5,
  additionRange: { min: 1, max: 9 },
  subtractionMinA: 3,
  subtractionMaxA: 12,
  nextQuestionDelayMs: 1800,
  wrongAnswerUnlockDelayMs: 500,
  keyBufferResetMs: 700,
  confettiLifetimeMs: 3000,
  confettiStaggerMs: 40,
};

export const THEMES = [
  { name: 'fruits', emojis: ['🍎', '🍋', '🍇'] },
  { name: 'animals', emojis: ['🐸', '🐶', '🐱'] },
  { name: 'space', emojis: ['🚀', '⭐', '🪐'] },
  { name: 'ocean', emojis: ['🐠', '🐙', '🦀'] },
  { name: 'jungle', emojis: ['🦁', '🐘', '🦒'] },
];

export const PASTELS = ['#FFD6D6', '#FFE4C4', '#FFFACD', '#D4F1C0', '#C8E6FF', '#E8D5FF', '#FFD6F0', '#D6FFF6'];

export const BEST_SCORE_KEY = 'kidsMathV3BestScore';

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
