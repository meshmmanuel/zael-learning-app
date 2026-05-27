import { state } from '../state.js';
import { els } from '../dom.js';

export function updateSoundToggle() {
  const on = state.soundOn ? 'Sound: On' : 'Sound: Off';
  const pressed = state.soundOn ? 'true' : 'false';
  if (els.soundToggle) {
    els.soundToggle.textContent = on;
    els.soundToggle.setAttribute('aria-pressed', pressed);
  }
  if (els.spellingSoundToggle) {
    els.spellingSoundToggle.textContent = on;
    els.spellingSoundToggle.setAttribute('aria-pressed', pressed);
  }
  if (els.phonicsSoundToggle) {
    els.phonicsSoundToggle.textContent = on;
    els.phonicsSoundToggle.setAttribute('aria-pressed', pressed);
  }
  if (els.arrowSoundToggle) {
    els.arrowSoundToggle.textContent = on;
    els.arrowSoundToggle.setAttribute('aria-pressed', pressed);
  }
}

export function updateHintToggle() {
  els.hintToggle.textContent = state.hintOn ? 'Hint: On' : 'Hint: Off';
  els.hintToggle.setAttribute('aria-pressed', state.hintOn ? 'true' : 'false');
}
