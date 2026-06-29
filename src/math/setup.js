import { state } from '../state.js';
import { els } from '../dom.js';
import { playSelectSound } from '../audio/index.js';
import { isArithMode } from '../utils/index.js';

export function syncMathHelperFieldset() {
  const show = isArithMode();
  if (els.mathHelperFieldset) els.mathHelperFieldset.hidden = !show;
}

export function syncMathSetupUI() {
  const modeMap = {
    mixed: els.modeMixed,
    add: els.modeAdd,
    sub: els.modeSub,
    beforeAfter: els.modeBeforeAfter,
    between: els.modeBetween,
    lessThan: els.modeLessThan,
    greaterThan: els.modeGreaterThan,
    compareMixed: els.modeCompareMixed,
  };
  Object.values(modeMap).forEach((btn) => {
    if (btn) btn.setAttribute('aria-pressed', 'false');
  });
  if (modeMap[state.mathMode]) modeMap[state.mathMode].setAttribute('aria-pressed', 'true');

  const diffMap = { easy: els.diffEasy, medium: els.diffMedium, hard: els.diffHard };
  Object.values(diffMap).forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
  if (diffMap[state.mathDifficulty]) diffMap[state.mathDifficulty].setAttribute('aria-pressed', 'true');

  const helperMap = { emoji: els.mathHelperEmoji, numberline: els.mathHelperNumberline };
  Object.values(helperMap).forEach((btn) => {
    if (btn) btn.setAttribute('aria-pressed', 'false');
  });
  if (helperMap[state.mathHelper]) helperMap[state.mathHelper].setAttribute('aria-pressed', 'true');

  syncMathHelperFieldset();
}

export function setMathMode(mode) {
  state.mathMode = mode;
  syncMathSetupUI();
  playSelectSound();
}

export function setMathDifficulty(diff) {
  state.mathDifficulty = diff;
  syncMathSetupUI();
  playSelectSound();
}

export function setMathHelper(helper) {
  state.mathHelper = helper;
  syncMathSetupUI();
  playSelectSound();
}

