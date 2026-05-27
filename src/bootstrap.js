import { state } from './state.js';
import { els, isTypingTarget } from './dom.js';
import { BASE_CONFIG } from './config/index.js';
import { showScreen, requestGoHome, getCurrentRoute } from './router.js';
import { pickRandomBg } from './ui/chrome.js';
import { updateSoundToggle, updateHintToggle } from './ui/toggles.js';
import {
  initSoundFx,
  initAlphaSounds,
  initPhonicsSounds,
  playSelectSound,
  playToggleSound,
  playSubmitSound,
  playSpellWordLetterByLetter,
  updateSpellingHearButton,
} from './audio/index.js';
import { loadMathPrefs } from './storage/math.js';
import { loadSpellingPrefs } from './storage/spelling.js';
import { syncMathSetupUI, setMathMode, setMathDifficulty } from './math/setup.js';
import {
  startMathRound,
  checkAnswer,
  selectNumber,
  updateAdditionZone,
  updateSubtractionZone,
} from './math/play.js';
import { isOrderQuestion } from './utils/index.js';
import {
  syncSpellingSetupUI,
  setSpellingMode,
  setSpellingCategory,
} from './spelling/setup.js';
import { startPhonicsPlay, playPhonicsAlphabet, updatePhonicsPlayAzButton } from './spelling/phonics.js';
import { startSpellingRound, checkSpellingAnswer } from './spelling/picture.js';
import {
  startArrowRound,
  checkArrowAnswer,
  playArrowWordLetterByLetter,
  updateArrowHearButton,
  scheduleArrowPathsRedraw,
} from './spelling/arrow.js';

export function wireApp() {
  els.pickMath.addEventListener('click', () => {
    playSelectSound();
    pickRandomBg();
    showScreen('mathSetup');
    syncMathSetupUI();
  });

  if (els.pickSpelling) {
    els.pickSpelling.addEventListener('click', () => {
      playSelectSound();
      pickRandomBg();
      loadSpellingPrefs();
      syncSpellingSetupUI();
      showScreen('spellingSetup');
    });
  }

  if (els.spellingBackBtn) {
    els.spellingBackBtn.addEventListener('click', () => {
      playToggleSound();
      requestGoHome();
    });
  }

  if (els.spellingStartBtn) {
    els.spellingStartBtn.addEventListener('click', () => {
      playSubmitSound();
      if (state.spellingMode === 'phonics') startPhonicsPlay();
      else if (state.spellingMode === 'arrow') startArrowRound();
      else startSpellingRound();
    });
  }

  if (els.spellModePhonics) els.spellModePhonics.addEventListener('click', () => setSpellingMode('phonics'));
  if (els.spellModePicture) els.spellModePicture.addEventListener('click', () => setSpellingMode('picture'));
  if (els.spellModeArrow) els.spellModeArrow.addEventListener('click', () => setSpellingMode('arrow'));

  if (els.spellCatCvc) els.spellCatCvc.addEventListener('click', () => setSpellingCategory('cvc'));
  if (els.spellCatBlend) els.spellCatBlend.addEventListener('click', () => setSpellingCategory('blend'));
  if (els.spellCatDigraph) els.spellCatDigraph.addEventListener('click', () => setSpellingCategory('digraph'));
  if (els.spellCatMixed) els.spellCatMixed.addEventListener('click', () => setSpellingCategory('mixed'));

  if (els.spellingSubmitBtn) {
    els.spellingSubmitBtn.addEventListener('click', () => {
      playSubmitSound();
      checkSpellingAnswer();
    });
  }

  if (els.spellingHearWordBtn) {
    els.spellingHearWordBtn.addEventListener('click', () => {
      playSpellWordLetterByLetter();
    });
  }

  els.mathBackBtn.addEventListener('click', () => {
    playToggleSound();
    requestGoHome();
  });

  if (els.appNavHome) {
    els.appNavHome.addEventListener('click', () => requestGoHome());
  }

  els.mathStartBtn.addEventListener('click', () => {
    playSubmitSound();
    startMathRound();
  });

  els.modeMixed.addEventListener('click', () => setMathMode('mixed'));
  els.modeAdd.addEventListener('click', () => setMathMode('add'));
  els.modeSub.addEventListener('click', () => setMathMode('sub'));
  if (els.modeBeforeAfter) els.modeBeforeAfter.addEventListener('click', () => setMathMode('beforeAfter'));
  if (els.modeBetween) els.modeBetween.addEventListener('click', () => setMathMode('between'));
  els.diffEasy.addEventListener('click', () => setMathDifficulty('easy'));
  els.diffMedium.addEventListener('click', () => setMathDifficulty('medium'));
  els.diffHard.addEventListener('click', () => setMathDifficulty('hard'));

  els.submitBtn.addEventListener('click', () => {
    playSubmitSound();
    checkAnswer();
  });

  function onSoundToggleClick() {
    state.soundOn = !state.soundOn;
    updateSoundToggle();
    updateSpellingHearButton();
    updateArrowHearButton();
    updatePhonicsPlayAzButton();
    if (state.soundOn) playToggleSound();
  }

  els.soundToggle.addEventListener('click', onSoundToggleClick);
  if (els.spellingSoundToggle) els.spellingSoundToggle.addEventListener('click', onSoundToggleClick);
  if (els.phonicsSoundToggle) els.phonicsSoundToggle.addEventListener('click', onSoundToggleClick);
  if (els.arrowSoundToggle) els.arrowSoundToggle.addEventListener('click', onSoundToggleClick);

  if (els.phonicsPlayAzBtn) {
    els.phonicsPlayAzBtn.addEventListener('click', () => {
      playPhonicsAlphabet();
    });
  }

  if (els.arrowSubmitBtn) {
    els.arrowSubmitBtn.addEventListener('click', () => {
      playSubmitSound();
      checkArrowAnswer();
    });
  }

  if (els.arrowHearWordBtn) {
    els.arrowHearWordBtn.addEventListener('click', () => {
      playArrowWordLetterByLetter();
    });
  }

  els.hintToggle.addEventListener('click', () => {
    state.hintOn = !state.hintOn;
    updateHintToggle();
    if (state.soundOn) playToggleSound();
    if (state.currentQ && !isOrderQuestion(state.currentQ)) {
      if (state.currentQ.type === 'add') updateAdditionZone();
      else updateSubtractionZone();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (state.activeGame !== 'math') return;
    if (els.mainScreen.style.display === 'none') return;
    if (isTypingTarget(e.target)) return;
    if (e.key === 'Enter') {
      playSubmitSound();
      checkAnswer();
      return;
    }
    if (/^\d$/.test(e.key)) {
      state.keyInputBuffer += e.key;
      if (state.keyInputTimer) clearTimeout(state.keyInputTimer);
      state.keyInputTimer = setTimeout(() => {
        state.keyInputBuffer = '';
      }, BASE_CONFIG.keyBufferResetMs);
      let n = Number(state.keyInputBuffer);
      const maxKey = state.maxPickerValue;
      if (n > maxKey) {
        state.keyInputBuffer = e.key;
        n = Number(state.keyInputBuffer);
      }
      if (n <= maxKey) {
        const btn = [...document.querySelectorAll('.num-btn')].find((b) => Number(b.textContent) === n);
        if (btn) selectNumber(n, btn);
      }
    }
  });

  let arrowResizeTimer = null;
  window.addEventListener('resize', () => {
    if (getCurrentRoute() !== 'arrowPlay') return;
    if (arrowResizeTimer) clearTimeout(arrowResizeTimer);
    arrowResizeTimer = setTimeout(() => scheduleArrowPathsRedraw(), 120);
  });
}

export function initApp() {
  initSoundFx();
  initAlphaSounds();
  initPhonicsSounds();
  loadMathPrefs();
  loadSpellingPrefs();
  syncMathSetupUI();
  syncSpellingSetupUI();
  updateSoundToggle();
  updateHintToggle();
  updateSpellingHearButton();
  updateArrowHearButton();
  updatePhonicsPlayAzButton();
  state.activeGame = 'math';
  pickRandomBg();
  showScreen('home');
}
