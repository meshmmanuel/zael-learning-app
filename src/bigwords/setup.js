import { state } from '../state.js';
import { els } from '../dom.js';
import { playSelectSound } from '../audio/index.js';

export function syncBigwordsSetupUI() {
  const diffMap = {
    easy: els.bigwordsDiffEasy,
    medium: els.bigwordsDiffMedium,
    hard: els.bigwordsDiffHard,
  };
  Object.values(diffMap).forEach((btn) => {
    if (btn) btn.setAttribute('aria-pressed', 'false');
  });
  if (diffMap[state.bigwordsDifficulty]) {
    diffMap[state.bigwordsDifficulty].setAttribute('aria-pressed', 'true');
  }

  if (els.bigwordsSetupHint) {
    const hints = {
      easy: '3–4 syllable words. Tap each chunk to hear it, then say it aloud!',
      medium: '5–7 syllable words. Break the big word into small sound chunks.',
      hard: '8–10 syllable words. Take your time — adult taps Next when ready.',
    };
    els.bigwordsSetupHint.textContent = hints[state.bigwordsDifficulty] || hints.medium;
  }
}

export function setBigwordsDifficulty(diff) {
  state.bigwordsDifficulty = diff;
  syncBigwordsSetupUI();
  playSelectSound();
}
