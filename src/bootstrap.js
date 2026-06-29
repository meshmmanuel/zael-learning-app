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
  updateBigwordsHearButtons,
} from './audio/index.js';
import { loadMathPrefs } from './storage/math.js';
import { loadSpellingPrefs } from './storage/spelling.js';
import { loadMeasurePrefs } from './storage/measurement.js';
import { loadBigwordsPrefs } from './storage/bigwords.js';
import { syncMeasureSetupUI, setMeasureMode } from './measurement/setup.js';
import { startMeasureRound } from './measurement/play.js';
import { syncBigwordsSetupUI, setBigwordsDifficulty } from './bigwords/setup.js';
import { startBigwordsRound, nextBigword, repeatBigword } from './bigwords/play.js';
import { syncMathSetupUI, setMathMode, setMathDifficulty, setMathHelper, setMathQuestionCount } from './math/setup.js';
import {
  startMathRound,
  checkAnswer,
  selectNumber,
  updateAdditionZone,
  updateSubtractionZone,
  buildMathHelperZone,
} from './math/play.js';
import { isOrderQuestion, isCompareQuestion, usesNumberLineHelper } from './utils/index.js';
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

const SETUP_PICK_GUARD_MS = 450;
let lastMathSetupPickAt = 0;

function wireMathSetupPick(btn, handler) {
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    lastMathSetupPickAt = Date.now();
    handler();
  });
}

function wireInteractionGuards() {
  const root = els.app;
  if (!root) return;

  root.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  root.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  root.addEventListener('selectstart', (e) => {
    e.preventDefault();
  });
}

export function wireApp() {
  wireInteractionGuards();

  els.pickMath.addEventListener('click', () => {
    playSelectSound();
    pickRandomBg();
    state.activeGame = 'math';
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

  if (els.pickMeasure) {
    els.pickMeasure.addEventListener('click', () => {
      playSelectSound();
      pickRandomBg();
      loadMeasurePrefs();
      syncMeasureSetupUI();
      showScreen('measureSetup');
    });
  }

  if (els.pickBigwords) {
    els.pickBigwords.addEventListener('click', () => {
      playSelectSound();
      pickRandomBg();
      loadBigwordsPrefs();
      syncBigwordsSetupUI();
      showScreen('bigwordsSetup');
    });
  }

  if (els.bigwordsBackBtn) {
    els.bigwordsBackBtn.addEventListener('click', () => {
      playToggleSound();
      requestGoHome();
    });
  }

  if (els.bigwordsStartBtn) {
    els.bigwordsStartBtn.addEventListener('click', () => {
      playSubmitSound();
      startBigwordsRound();
    });
  }

  if (els.bigwordsDiffEasy) els.bigwordsDiffEasy.addEventListener('click', () => setBigwordsDifficulty('easy'));
  if (els.bigwordsDiffMedium) els.bigwordsDiffMedium.addEventListener('click', () => setBigwordsDifficulty('medium'));
  if (els.bigwordsDiffHard) els.bigwordsDiffHard.addEventListener('click', () => setBigwordsDifficulty('hard'));

  if (els.bigwordsRepeatBtn) {
    els.bigwordsRepeatBtn.addEventListener('click', () => {
      repeatBigword();
    });
  }

  if (els.bigwordsNextBtn) {
    els.bigwordsNextBtn.addEventListener('click', () => {
      playSubmitSound();
      nextBigword();
    });
  }

  if (els.measureBackBtn) {
    els.measureBackBtn.addEventListener('click', () => {
      playToggleSound();
      requestGoHome();
    });
  }

  if (els.measureStartBtn) {
    els.measureStartBtn.addEventListener('click', () => {
      playSubmitSound();
      startMeasureRound();
    });
  }

  if (els.measureModeMixed) els.measureModeMixed.addEventListener('click', () => setMeasureMode('mixed'));
  if (els.measureModeHeavier) els.measureModeHeavier.addEventListener('click', () => setMeasureMode('heavier'));
  if (els.measureModeLighter) els.measureModeLighter.addEventListener('click', () => setMeasureMode('lighter'));
  if (els.measureModePresents) els.measureModePresents.addEventListener('click', () => setMeasureMode('presents'));

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

  els.mathStartBtn.addEventListener('click', (e) => {
    if (getCurrentRoute() !== 'mathSetup') return;
    if (Date.now() - lastMathSetupPickAt < SETUP_PICK_GUARD_MS) {
      e.preventDefault();
      return;
    }
    playSubmitSound();
    startMathRound();
  });

  wireMathSetupPick(els.modeMixed, () => setMathMode('mixed'));
  wireMathSetupPick(els.modeAdd, () => setMathMode('add'));
  wireMathSetupPick(els.modeSub, () => setMathMode('sub'));
  wireMathSetupPick(els.modeBeforeAfter, () => setMathMode('beforeAfter'));
  wireMathSetupPick(els.modeBetween, () => setMathMode('between'));
  wireMathSetupPick(els.modeLessThan, () => setMathMode('lessThan'));
  wireMathSetupPick(els.modeGreaterThan, () => setMathMode('greaterThan'));
  wireMathSetupPick(els.modeCompareMixed, () => setMathMode('compareMixed'));
  wireMathSetupPick(els.diffEasy, () => setMathDifficulty('easy'));
  wireMathSetupPick(els.diffMedium, () => setMathDifficulty('medium'));
  wireMathSetupPick(els.diffHard, () => setMathDifficulty('hard'));
  wireMathSetupPick(els.mathCount10, () => setMathQuestionCount(10));
  wireMathSetupPick(els.mathCount15, () => setMathQuestionCount(15));
  wireMathSetupPick(els.mathCount20, () => setMathQuestionCount(20));
  wireMathSetupPick(els.mathHelperEmoji, () => setMathHelper('emoji'));
  wireMathSetupPick(els.mathHelperNumberline, () => setMathHelper('numberline'));

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
    updateBigwordsHearButtons();
    if (state.soundOn) playToggleSound();
  }

  els.soundToggle.addEventListener('click', onSoundToggleClick);
  if (els.spellingSoundToggle) els.spellingSoundToggle.addEventListener('click', onSoundToggleClick);
  if (els.phonicsSoundToggle) els.phonicsSoundToggle.addEventListener('click', onSoundToggleClick);
  if (els.arrowSoundToggle) els.arrowSoundToggle.addEventListener('click', onSoundToggleClick);
  if (els.measureSoundToggle) els.measureSoundToggle.addEventListener('click', onSoundToggleClick);
  if (els.bigwordsSoundToggle) els.bigwordsSoundToggle.addEventListener('click', onSoundToggleClick);

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
    if (state.currentQ && !isOrderQuestion(state.currentQ) && !isCompareQuestion(state.currentQ)) {
      if (usesNumberLineHelper()) buildMathHelperZone();
      else if (state.currentQ.type === 'add') updateAdditionZone();
      else updateSubtractionZone();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (isTypingTarget(e.target)) return;

    if (state.activeGame === 'bigwords' && els.bigwordsPlayScreen?.style.display !== 'none') {
      if (e.key === 'Enter') {
        e.preventDefault();
        playSubmitSound();
        nextBigword();
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        repeatBigword();
        return;
      }
      return;
    }

    if (state.activeGame !== 'math') return;
    if (getCurrentRoute() !== 'play') return;
    if (isTypingTarget(e.target)) return;
    if (e.key === 'Enter') {
      if (isCompareQuestion(state.currentQ)) return;
      playSubmitSound();
      checkAnswer();
      return;
    }
    if (/^\d$/.test(e.key)) {
      if (isCompareQuestion(state.currentQ)) return;
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
  loadMeasurePrefs();
  loadBigwordsPrefs();
  syncMathSetupUI();
  syncSpellingSetupUI();
  syncMeasureSetupUI();
  syncBigwordsSetupUI();
  updateSoundToggle();
  updateHintToggle();
  updateSpellingHearButton();
  updateArrowHearButton();
  updatePhonicsPlayAzButton();
  updateBigwordsHearButtons();
  state.activeGame = 'math';
  pickRandomBg();
  showScreen('home');
}
