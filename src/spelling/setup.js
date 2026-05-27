import { state } from '../state.js';
import { els } from '../dom.js';
import { playSelectSound } from '../audio/index.js';

export function syncSpellingSetupUI() {
  const modeMap = {
    phonics: els.spellModePhonics,
    picture: els.spellModePicture,
    arrow: els.spellModeArrow,
  };
  Object.values(modeMap).forEach((btn) => { if (btn) btn.setAttribute('aria-pressed', 'false'); });
  if (modeMap[state.spellingMode]) modeMap[state.spellingMode].setAttribute('aria-pressed', 'true');

  const catMap = {
    cvc: els.spellCatCvc,
    blend: els.spellCatBlend,
    digraph: els.spellCatDigraph,
    mixed: els.spellCatMixed,
  };
  Object.values(catMap).forEach((btn) => { if (btn) btn.setAttribute('aria-pressed', 'false'); });
  if (catMap[state.spellingCategory]) catMap[state.spellingCategory].setAttribute('aria-pressed', 'true');

  const isPhonics = state.spellingMode === 'phonics';
  const isArrow = state.spellingMode === 'arrow';
  if (els.spellingCatFieldset) els.spellingCatFieldset.hidden = isPhonics || isArrow;
  if (els.spellingSetupHint) {
    if (isPhonics) {
      els.spellingSetupHint.textContent = 'Tap any letter to hear its sound (phonics). Try Play A to Z when you are ready!';
    } else if (isArrow) {
      els.spellingSetupHint.textContent = 'Look at the colored lines on the board. Pick any start and end letters, hear your word, then submit when you are ready!';
    } else {
      els.spellingSetupHint.textContent = 'Each round: tap Hear my letters to hear what you put in the word (left to right), then fix or submit. Letter buttons still play their sound.';
    }
  }
  if (els.spellingStartBtn) {
    if (isPhonics) els.spellingStartBtn.textContent = 'Let’s hear letters! 🔊';
    else if (isArrow) els.spellingStartBtn.textContent = 'Let’s find words! 🔀';
    else els.spellingStartBtn.textContent = 'Let’s spell! ✏️';
  }
}

export function setSpellingMode(mode) {
  state.spellingMode = mode;
  syncSpellingSetupUI();
  playSelectSound();
}

export function setSpellingCategory(cat) {
  state.spellingCategory = cat;
  syncSpellingSetupUI();
  playSelectSound();
}

