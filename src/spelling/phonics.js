import { state } from '../state.js';
import { els } from '../dom.js';
import { PHONICS_ALPHABET } from '../config/index.js';
import { showScreen } from '../router.js';
import { pickRandomBg } from '../ui/chrome.js';
import { saveSpellingPrefs } from '../storage/spelling.js';
import { playPhonicsSound, playPhonicsSoundAndWait } from '../audio/index.js';

export function startPhonicsPlay() {
  state.activeGame = 'phonics';
  saveSpellingPrefs();
  pickRandomBg();
  state.phonicsPlayGen += 1;
  state.phonicsAlphabetPlaying = false;
  showScreen('phonicsPlay');
  renderPhonicsGrid();
  updatePhonicsPlayAzButton();
}

export function renderPhonicsGrid() {
  if (!els.phonicsGrid) return;
  els.phonicsGrid.innerHTML = '';
  PHONICS_ALPHABET.forEach((letter) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'phonics-letter';
    btn.textContent = letter.toUpperCase();
    btn.setAttribute('aria-label', `Letter ${letter.toUpperCase()}`);
    btn.disabled = state.phonicsAlphabetPlaying;
    btn.onclick = () => {
      if (state.phonicsAlphabetPlaying) return;
      playPhonicsSound(letter);
    };
    els.phonicsGrid.appendChild(btn);
  });
}

export function updatePhonicsPlayAzButton() {
  if (!els.phonicsPlayAzBtn) return;
  const off = !state.soundOn;
  els.phonicsPlayAzBtn.disabled = state.phonicsAlphabetPlaying || off;
  els.phonicsPlayAzBtn.setAttribute('aria-disabled', state.phonicsAlphabetPlaying || off ? 'true' : 'false');
  els.phonicsPlayAzBtn.title = off
    ? 'Turn Sound on to play the alphabet.'
    : state.phonicsAlphabetPlaying
      ? 'Playing A to Z…'
      : 'Hear every letter sound from A to Z';
}

export async function playPhonicsAlphabet() {
  if (!state.soundOn || state.phonicsAlphabetPlaying) return;
  const genAtStart = state.phonicsPlayGen;
  state.phonicsAlphabetPlaying = true;
  updatePhonicsPlayAzButton();
  renderPhonicsGrid();
  try {
    for (let i = 0; i < PHONICS_ALPHABET.length; i++) {
      if (state.phonicsPlayGen !== genAtStart) return;
      if (!state.soundOn) break;
      await playPhonicsSoundAndWait(PHONICS_ALPHABET[i]);
      if (state.phonicsPlayGen !== genAtStart) return;
      if (i < PHONICS_ALPHABET.length - 1) await new Promise((r) => setTimeout(r, 120));
    }
  } finally {
    state.phonicsAlphabetPlaying = false;
    updatePhonicsPlayAzButton();
    renderPhonicsGrid();
  }
}

