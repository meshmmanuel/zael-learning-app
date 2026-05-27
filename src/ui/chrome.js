import { state } from '../state.js';
import { els } from '../dom.js';
import { PASTELS } from '../config/index.js';

export function pickRandomBg() {
  state.bgColor = PASTELS[Math.floor(Math.random() * PASTELS.length)];
  els.app.style.background = state.bgColor;
}
