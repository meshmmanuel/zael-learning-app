import { state } from '../state.js';
import { els } from '../dom.js';
import { playSelectSound } from '../audio/index.js';

const MODE_BTNS = {
  mixed: 'measureModeMixed',
  heavier: 'measureModeHeavier',
  lighter: 'measureModeLighter',
  presents: 'measureModePresents',
};

export function syncMeasureSetupUI() {
  Object.entries(MODE_BTNS).forEach(([mode, id]) => {
    const btn = els[id];
    if (btn) btn.setAttribute('aria-pressed', state.measureMode === mode ? 'true' : 'false');
  });
  if (els.measureSetupHint) {
    const hints = {
      mixed: '10 questions: heavier, lighter, and presents. Heavy makes a side go down; light goes up!',
      heavier: 'Pick the one that is heavier — look for the side touching the ground.',
      lighter: 'Pick the one that is lighter — look for the side up in the air.',
      presents: 'Tap the heaviest present (purple), then the lightest (green).',
    };
    els.measureSetupHint.textContent = hints[state.measureMode] || hints.mixed;
  }
}

export function setMeasureMode(mode) {
  state.measureMode = mode;
  syncMeasureSetupUI();
  playSelectSound();
}
