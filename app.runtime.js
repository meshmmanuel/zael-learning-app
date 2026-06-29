(() => {
  // src/state.js
  var state = {
    activeGame: "math",
    spellingMode: "phonics",
    phonicsPlayGen: 0,
    phonicsAlphabetPlaying: false,
    spellingCategory: "cvc",
    spellingWords: [],
    spellQIndex: 0,
    spellScore: 0,
    spellBlocked: false,
    spellWord: "",
    spellEmoji: "",
    spellRevealMask: [],
    spellFilled: [],
    spellBank: [],
    spellPlacements: {},
    spellListenGen: 0,
    spellListenPlaying: false,
    arrowPuzzleIndex: 0,
    arrowPuzzles: [],
    arrowPickLeftIdx: null,
    arrowPickRightIdx: null,
    arrowFound: [],
    arrowBlocked: false,
    arrowScore: 0,
    arrowListenGen: 0,
    arrowListenPlaying: false,
    measureMode: "mixed",
    measureQuestions: [],
    measureQIndex: 0,
    measureScore: 0,
    measureBlocked: false,
    measureCurrentQ: null,
    measurePresentStep: "heaviest",
    measurePresentPicks: {},
    bigwordsDifficulty: "medium",
    bigwordsEntries: [],
    bigwordsQIndex: 0,
    bigwordsCurrent: null,
    bigwordsActiveChunk: null,
    bigwordsListenGen: 0,
    bigwordsListenPlaying: false,
    mathMode: "mixed",
    mathDifficulty: "medium",
    mathHelper: "emoji",
    mathQuestionCount: 10,
    mathHomeworkOp: "sub",
    mathHomeworkA: 8,
    mathHomeworkB: 5,
    theme: null,
    emoji: null,
    bgColor: null,
    questions: [],
    qIndex: 0,
    score: 0,
    selectedAnswer: null,
    orderAnswers: {},
    orderActiveBlankIndex: null,
    crossedSet: /* @__PURE__ */ new Set(),
    placedCount: 0,
    currentQ: null,
    blocked: false,
    maxAnswer: 9,
    soundOn: true,
    hintOn: false,
    stats: { addCorrect: 0, addTotal: 0, subCorrect: 0, subTotal: 0, orderCorrect: 0, orderTotal: 0, compareCorrect: 0, compareTotal: 0 },
    maxPickerValue: 9,
    keyInputBuffer: "",
    keyInputTimer: null,
    addGroup1Count: 0,
    addGroup2Count: 0
  };

  // src/dom.js
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = {
    app: document.getElementById("app"),
    appNavHome: document.getElementById("app-nav-home"),
    appNavTitle: document.getElementById("app-nav-title"),
    appModal: document.getElementById("app-modal"),
    appModalBackdrop: document.getElementById("app-modal-backdrop"),
    appModalTitle: document.getElementById("app-modal-title"),
    appModalMessage: document.getElementById("app-modal-message"),
    appModalCancel: document.getElementById("app-modal-cancel"),
    appModalConfirm: document.getElementById("app-modal-confirm"),
    homeScreen: document.getElementById("home-screen"),
    mathSetupScreen: document.getElementById("math-setup-screen"),
    mathHelperScreen: document.getElementById("math-helper-screen"),
    spellingSetupScreen: document.getElementById("spelling-setup-screen"),
    spellingPlayScreen: document.getElementById("spelling-play-screen"),
    phonicsPlayScreen: document.getElementById("phonics-play-screen"),
    arrowPlayScreen: document.getElementById("arrow-play-screen"),
    spellModePhonics: document.getElementById("spell-mode-phonics"),
    spellModePicture: document.getElementById("spell-mode-picture"),
    spellModeArrow: document.getElementById("spell-mode-arrow"),
    phonicsGrid: document.getElementById("phonics-grid"),
    phonicsPlayAzBtn: document.getElementById("phonics-play-az-btn"),
    phonicsSoundToggle: document.getElementById("phonics-sound-toggle"),
    spellingCatFieldset: document.getElementById("spelling-cat-fieldset"),
    spellingSetupHint: document.getElementById("spelling-setup-hint"),
    spellingStartBtn: document.getElementById("spelling-start-btn"),
    arrowQLabel: document.getElementById("arrow-q-label"),
    arrowProgressFill: document.getElementById("arrow-progress-fill"),
    arrowPrompt: document.getElementById("arrow-prompt"),
    arrowExample: document.getElementById("arrow-example"),
    arrowBoard: document.getElementById("arrow-board"),
    arrowBoardStage: document.getElementById("arrow-board-stage"),
    arrowPathsSvg: document.getElementById("arrow-paths-svg"),
    arrowBuilderSlots: document.getElementById("arrow-builder-slots"),
    arrowFoundList: document.getElementById("arrow-found-list"),
    arrowFeedback: document.getElementById("arrow-feedback"),
    arrowSubmitBtn: document.getElementById("arrow-submit-btn"),
    arrowSoundToggle: document.getElementById("arrow-sound-toggle"),
    arrowHearWordBtn: document.getElementById("arrow-hear-word-btn"),
    mainScreen: document.getElementById("main-screen"),
    endScreen: document.getElementById("end-screen"),
    pickMath: document.getElementById("pick-math"),
    pickSpelling: document.getElementById("pick-spelling"),
    pickMeasure: document.getElementById("pick-measure"),
    pickBigwords: document.getElementById("pick-bigwords"),
    bigwordsSetupScreen: document.getElementById("bigwords-setup-screen"),
    bigwordsPlayScreen: document.getElementById("bigwords-play-screen"),
    bigwordsDiffEasy: document.getElementById("bigwords-diff-easy"),
    bigwordsDiffMedium: document.getElementById("bigwords-diff-medium"),
    bigwordsDiffHard: document.getElementById("bigwords-diff-hard"),
    bigwordsSetupHint: document.getElementById("bigwords-setup-hint"),
    bigwordsBackBtn: document.getElementById("bigwords-back-btn"),
    bigwordsStartBtn: document.getElementById("bigwords-start-btn"),
    bigwordsQLabel: document.getElementById("bigwords-q-label"),
    bigwordsProgressFill: document.getElementById("bigwords-progress-fill"),
    bigwordsWord: document.getElementById("bigwords-word"),
    bigwordsChunks: document.getElementById("bigwords-chunks"),
    bigwordsAdultHint: document.getElementById("bigwords-adult-hint"),
    bigwordsRepeatBtn: document.getElementById("bigwords-repeat-btn"),
    bigwordsNextBtn: document.getElementById("bigwords-next-btn"),
    bigwordsSoundToggle: document.getElementById("bigwords-sound-toggle"),
    measureSetupScreen: document.getElementById("measure-setup-screen"),
    measurePlayScreen: document.getElementById("measure-play-screen"),
    measureModeMixed: document.getElementById("measure-mode-mixed"),
    measureModeHeavier: document.getElementById("measure-mode-heavier"),
    measureModeLighter: document.getElementById("measure-mode-lighter"),
    measureModePresents: document.getElementById("measure-mode-presents"),
    measureSetupHint: document.getElementById("measure-setup-hint"),
    measureBackBtn: document.getElementById("measure-back-btn"),
    measureStartBtn: document.getElementById("measure-start-btn"),
    measureQLabel: document.getElementById("measure-q-label"),
    measureProgressFill: document.getElementById("measure-progress-fill"),
    measurePrompt: document.getElementById("measure-prompt"),
    measureHint: document.getElementById("measure-hint"),
    measureScale: document.getElementById("measure-scale"),
    measureSides: document.getElementById("measure-sides"),
    measureFeedback: document.getElementById("measure-feedback"),
    measureSoundToggle: document.getElementById("measure-sound-toggle"),
    spellCatCvc: document.getElementById("spell-cat-cvc"),
    spellCatBlend: document.getElementById("spell-cat-blend"),
    spellCatDigraph: document.getElementById("spell-cat-digraph"),
    spellCatMixed: document.getElementById("spell-cat-mixed"),
    spellingBackBtn: document.getElementById("spelling-back-btn"),
    spellingQLabel: document.getElementById("spelling-q-label"),
    spellingProgressFill: document.getElementById("spelling-progress-fill"),
    spellingPrompt: document.getElementById("spelling-prompt"),
    spellingEmoji: document.getElementById("spelling-emoji"),
    spellingSlotsRow: document.getElementById("spelling-slots-row"),
    spellingBank: document.getElementById("spelling-bank"),
    spellingFeedback: document.getElementById("spelling-feedback"),
    spellingSubmitBtn: document.getElementById("spelling-submit-btn"),
    spellingSoundToggle: document.getElementById("spelling-sound-toggle"),
    spellingHearWordBtn: document.getElementById("spelling-hear-word-btn"),
    mathBackBtn: document.getElementById("math-back-btn"),
    mathHomeworkBtn: document.getElementById("math-homework-btn"),
    mathStartBtn: document.getElementById("math-start-btn"),
    homeworkBackBtn: document.getElementById("homework-back-btn"),
    homeworkNumA: document.getElementById("homework-num-a"),
    homeworkNumB: document.getElementById("homework-num-b"),
    homeworkAMinus10: document.getElementById("homework-a-minus-10"),
    homeworkAMinus1: document.getElementById("homework-a-minus-1"),
    homeworkAPlus1: document.getElementById("homework-a-plus-1"),
    homeworkAPlus10: document.getElementById("homework-a-plus-10"),
    homeworkBMinus10: document.getElementById("homework-b-minus-10"),
    homeworkBMinus1: document.getElementById("homework-b-minus-1"),
    homeworkBPlus1: document.getElementById("homework-b-plus-1"),
    homeworkBPlus10: document.getElementById("homework-b-plus-10"),
    homeworkOpAdd: document.getElementById("homework-op-add"),
    homeworkOpSub: document.getElementById("homework-op-sub"),
    homeworkOpenBtn: document.getElementById("homework-open-btn"),
    homeworkClearBtn: document.getElementById("homework-clear-btn"),
    homeworkLineTitle: document.getElementById("homework-line-title"),
    homeworkLineFeedback: document.getElementById("homework-line-feedback"),
    homeworkNumberLineRoot: document.getElementById("homework-number-line-root"),
    modeMixed: document.getElementById("math-mode-mixed"),
    modeAdd: document.getElementById("math-mode-add"),
    modeSub: document.getElementById("math-mode-sub"),
    modeBeforeAfter: document.getElementById("math-mode-before-after"),
    modeBetween: document.getElementById("math-mode-between"),
    modeLessThan: document.getElementById("math-mode-less-than"),
    modeGreaterThan: document.getElementById("math-mode-greater-than"),
    modeCompareMixed: document.getElementById("math-mode-compare-mixed"),
    mathHelperFieldset: document.getElementById("math-helper-fieldset"),
    mathHelperEmoji: document.getElementById("math-helper-emoji"),
    mathHelperNumberline: document.getElementById("math-helper-numberline"),
    mathDisplay: document.getElementById("math-display"),
    mathArithmeticView: document.getElementById("math-arithmetic-view"),
    mathOrderView: document.getElementById("math-order-view"),
    mathOrderPrompt: document.getElementById("math-order-prompt"),
    mathOrderSequence: document.getElementById("math-order-sequence"),
    mathOrderBlank: document.getElementById("math-order-blank"),
    mathCompareView: document.getElementById("math-compare-view"),
    mathComparePrompt: document.getElementById("math-compare-prompt"),
    mathCompareHints: document.getElementById("math-compare-hints"),
    mathComparePair: document.getElementById("math-compare-pair"),
    emojiZone: document.getElementById("emoji-zone"),
    diffEasy: document.getElementById("math-diff-easy"),
    diffMedium: document.getElementById("math-diff-medium"),
    diffHard: document.getElementById("math-diff-hard"),
    mathCount10: document.getElementById("math-count-10"),
    mathCount15: document.getElementById("math-count-15"),
    mathCount20: document.getElementById("math-count-20"),
    qLabel: document.getElementById("q-label"),
    progressFill: document.getElementById("progress-fill"),
    num1Val: document.getElementById("num1-val"),
    opSign: document.getElementById("op-sign"),
    num2Val: document.getElementById("num2-val"),
    mathBlank: document.getElementById("math-blank"),
    feedback: document.getElementById("feedback-msg"),
    mathAnswerSection: document.getElementById("math-answer-section"),
    mathAnswerLabel: document.getElementById("math-answer-label"),
    numberPicker: document.getElementById("number-picker"),
    emojiContent: document.getElementById("emoji-content"),
    numberLineRoot: document.getElementById("number-line-root"),
    emojiZoneTitle: document.getElementById("emoji-zone-title"),
    subHint: document.getElementById("sub-hint"),
    submitBtn: document.getElementById("submit-btn"),
    soundToggle: document.getElementById("sound-toggle"),
    hintToggle: document.getElementById("hint-toggle")
  };
  function isTypingTarget(t) {
    return !!(t && t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)));
  }

  // src/config/index.js
  var BASE_CONFIG2 = {
    totalQuestions: 10,
    mixedHalf: 5,
    nextQuestionDelayMs: 1800,
    wrongAnswerUnlockDelayMs: 500,
    keyBufferResetMs: 700,
    confettiLifetimeMs: 3e3,
    confettiStaggerMs: 40,
    /** Safety ceiling only — no “stop at the right number” aid. */
    emojiBuildMax: 30
  };
  function canAddMoreEmojis(count) {
    return count < BASE_CONFIG2.emojiBuildMax;
  }
  var DIFFICULTY_PRESETS = {
    easy: {
      additionRange: { min: 1, max: 5 },
      subtractionMinA: 3,
      subtractionMaxA: 8
    },
    medium: {
      additionRange: { min: 1, max: 9 },
      subtractionMinA: 3,
      subtractionMaxA: 12
    },
    hard: {
      additionRange: { min: 1, max: 12 },
      subtractionMinA: 4,
      subtractionMaxA: 15
    }
  };
  var ORDER_RANGES = {
    easy: { min: 10, max: 30 },
    medium: { min: 30, max: 80 },
    hard: { min: 100, max: 999 }
  };
  var ORDER_LAYOUT = {
    easy: {
      beforeAfter: { length: 3, shownIndices: [1] },
      between: { length: 3, shownIndices: [0, 2] }
    },
    medium: {
      beforeAfter: { length: 5, shownIndices: [1, 3] },
      between: { length: 5, shownIndices: [0, 4] }
    },
    hard: {
      beforeAfter: { length: 7, shownIndices: [2, 4] },
      between: { length: 7, shownIndices: [0, 6] }
    }
  };
  var MATH_MODES_ARITH = ["mixed", "add", "sub"];
  var MATH_HELPERS = ["emoji", "numberline"];
  var MATH_QUESTION_COUNTS = [10, 15, 20];
  var NUMBER_LINE_CAPS = {
    easy: 10,
    medium: 20,
    hard: 100
  };
  var MATH_MODES_ORDER = ["beforeAfter", "between"];
  var MATH_MODES_COMPARE = ["lessThan", "greaterThan", "compareMixed"];
  var COMPARE_PRESETS = {
    easy: {
      min: 1,
      max: 20,
      sameTensWeight: 0.1,
      minGap: 3
    },
    medium: {
      min: 10,
      max: 50,
      sameTensWeight: 0.5,
      minGap: 1
    },
    hard: {
      min: 100,
      max: 999,
      sameTensWeight: 0.4,
      minGap: 1,
      closeGapMax: 3
    }
  };
  var MATH_MODES_ALL = [...MATH_MODES_ARITH, ...MATH_MODES_ORDER, ...MATH_MODES_COMPARE];
  var THEMES = [
    { name: "fruits", emojis: ["\u{1F34E}", "\u{1F34B}", "\u{1F347}"] },
    { name: "animals", emojis: ["\u{1F438}", "\u{1F436}", "\u{1F431}"] },
    { name: "space", emojis: ["\u{1F680}", "\u2B50", "\u{1FA90}"] },
    { name: "ocean", emojis: ["\u{1F420}", "\u{1F419}", "\u{1F980}"] },
    { name: "jungle", emojis: ["\u{1F981}", "\u{1F418}", "\u{1F992}"] }
  ];
  var PASTELS = ["#FFD6D6", "#FFE4C4", "#FFFACD", "#D4F1C0", "#C8E6FF", "#E8D5FF", "#FFD6F0", "#D6FFF6"];
  var SOUND_FILES = {
    select: "audio/click.mp3",
    wrong: "audio/incorrect.mp3",
    correct: "audio/correct.mp3",
    celebration: "audio/celebration.mp3",
    endPerfect: "audio/congratulations.mp3",
    endTryAgain: "audio/try-again.mp3",
    addEmoji: "audio/add.mp3",
    toggle: "audio/toggle.mp3",
    submit: "audio/submit.mp3"
  };
  var ALPHA_SOUND_DIR = "audio/alphasounds/";
  var ALPHA_SOUND_SRC = (() => {
    const m = {};
    for (let i = 0; i < 26; i++) {
      const c = String.fromCharCode(97 + i);
      m[c] = `${ALPHA_SOUND_DIR}alphasounds-${c}.mp3`;
    }
    m.o = `${ALPHA_SOUND_DIR}alphasounds-o-sh.mp3`;
    m.p = `${ALPHA_SOUND_DIR}alphasounds-p-2.mp3`;
    m.u = `${ALPHA_SOUND_DIR}alphasounds-u-sh.mp3`;
    return m;
  })();
  var PHONICS_SOUND_SRC = {
    a: "audio/phonics_audio/Short_Vowel/a-apple.mp3",
    e: "audio/phonics_audio/Short_Vowel/e-elephant.mp3",
    i: "audio/phonics_audio/Short_Vowel/i-igloo.mp3",
    o: "audio/phonics_audio/Short_Vowel/o-octopus.mp3",
    u: "audio/phonics_audio/Short_Vowel/u-up.mp3",
    b: "audio/phonics_audio/Consonant/b-bat.mp3",
    c: "audio/phonics_audio/Consonant/c-cut.mp3",
    d: "audio/phonics_audio/Consonant/d-dip.mp3",
    f: "audio/phonics_audio/Consonant/f-fun.mp3",
    g: "audio/phonics_audio/Consonant/g-get.mp3",
    h: "audio/phonics_audio/Consonant/h-hat.mp3",
    j: "audio/phonics_audio/Consonant/j-jog.mp3",
    k: "audio/phonics_audio/Consonant/k-kit.mp3",
    l: "audio/phonics_audio/Consonant/l-lip.mp3",
    m: "audio/phonics_audio/Consonant/m-mug.mp3",
    n: "audio/phonics_audio/Consonant/n-nap.mp3",
    p: "audio/phonics_audio/Consonant/p-pick.mp3",
    q: "audio/phonics_audio/Consonant/qu-quest.mp3",
    r: "audio/phonics_audio/Consonant/r-rid.mp3",
    s: "audio/phonics_audio/Consonant/s-sit-mess.mp3",
    t: "audio/phonics_audio/Consonant/t-tuck.mp3",
    v: "audio/phonics_audio/Consonant/v-van.mp3",
    w: "audio/phonics_audio/Consonant/w-will.mp3",
    x: "audio/phonics_audio/Consonant/x-mix-rocks.mp3",
    y: "audio/phonics_audio/Consonant/y-yes.mp3",
    z: "audio/phonics_audio/Consonant/z-zip-buzz.mp3"
  };
  var PHONICS_ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
  var STORAGE = {
    mathPrefs: "kidsAppV1MathPrefs",
    spellingPrefs: "kidsAppV1SpellingPrefs",
    measurePrefs: "kidsAppV1MeasurePrefs",
    bigwordsPrefs: "kidsAppV1BigwordsPrefs"
  };
  var LEGACY_BEST_KEY = "kidsMathV3BestScore";
  var MEASURE_TOTAL = 10;
  var BIGWORDS_TOTAL = 10;
  var SPELLING_TOTAL = 10;
  var SPELLING_DECOYS = 2;
  var ARROW_COLOR_IDS = ["red", "green", "blue", "yellow", "black"];
  var ARROW_BOARDS_PER_ROUND = 3;
  var ARROW_WORDS_MIN = 4;
  var ARROW_WORDS_MAX = 5;

  // src/ui/chrome.js
  function pickRandomBg() {
    state.bgColor = PASTELS[Math.floor(Math.random() * PASTELS.length)];
    els.app.style.background = state.bgColor;
  }

  // src/activities/registry.js
  var ACTIVITIES = {
    math: {
      id: "math",
      label: "Numbers",
      setupRoute: "mathSetup",
      playRoute: "play"
    },
    spellingPicture: {
      id: "spellingPicture",
      label: "Picture words",
      setupRoute: "spellingSetup",
      playRoute: "spellingPlay"
    },
    spellingPhonics: {
      id: "spellingPhonics",
      label: "Letter sounds",
      setupRoute: "spellingSetup",
      playRoute: "phonicsPlay",
      onLeave(state2) {
        state2.phonicsPlayGen += 1;
        state2.phonicsAlphabetPlaying = false;
      }
    },
    spellingArrow: {
      id: "spellingArrow",
      label: "Arrow words",
      setupRoute: "spellingSetup",
      playRoute: "arrowPlay"
    },
    measurement: {
      id: "measurement",
      label: "Size & measure",
      setupRoute: "measureSetup",
      playRoute: "measurePlay"
    },
    bigwords: {
      id: "bigwords",
      label: "Big words \u2192 small words",
      setupRoute: "bigwordsSetup",
      playRoute: "bigwordsPlay",
      onLeave(state2) {
        state2.bigwordsListenGen += 1;
        state2.bigwordsListenPlaying = false;
      }
    }
  };
  var PLAY_ROUTES = /* @__PURE__ */ new Set(["play", "phonicsPlay", "spellingPlay", "arrowPlay", "measurePlay", "bigwordsPlay"]);

  // src/audio/index.js
  var audioCtx = null;
  var soundFx = {};
  var alphaSoundFx = {};
  var phonicsSoundFx = {};
  function ensureAudioCtx() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }
  function playTone(freq, durationMs) {
    if (!state.soundOn) return;
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(1e-4, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(1e-4, now + durationMs / 1e3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => osc.stop(), durationMs);
  }
  function initSoundFx() {
    soundFx = {};
    Object.entries(SOUND_FILES).forEach(([k, src]) => {
      const a = new Audio(src);
      a.preload = "auto";
      soundFx[k] = a;
    });
  }
  function initAlphaSounds() {
    alphaSoundFx = {};
    Object.entries(ALPHA_SOUND_SRC).forEach(([letter, src]) => {
      const a = new Audio(src);
      a.preload = "auto";
      alphaSoundFx[letter] = a;
    });
  }
  function initPhonicsSounds() {
    phonicsSoundFx = {};
    Object.entries(PHONICS_SOUND_SRC).forEach(([letter, src]) => {
      const a = new Audio(src);
      a.preload = "auto";
      phonicsSoundFx[letter] = a;
    });
  }
  function playPhonicsSound(letter) {
    if (!state.soundOn) return;
    const k = String(letter).toLowerCase();
    if (!PHONICS_SOUND_SRC[k]) return;
    const base = phonicsSoundFx[k];
    if (!base) return;
    const inst = base.cloneNode();
    inst.play().catch(() => {
    });
  }
  function playPhonicsSoundAndWait(letter) {
    return new Promise((resolve) => {
      let done = false;
      let safetyTimer = 0;
      const finish = () => {
        if (done) return;
        done = true;
        if (safetyTimer) clearTimeout(safetyTimer);
        resolve();
      };
      if (!state.soundOn) {
        finish();
        return;
      }
      const k = String(letter).toLowerCase();
      if (!PHONICS_SOUND_SRC[k]) {
        finish();
        return;
      }
      const base = phonicsSoundFx[k];
      if (!base) {
        finish();
        return;
      }
      const inst = base.cloneNode();
      inst.addEventListener("ended", finish, { once: true });
      inst.addEventListener("error", finish, { once: true });
      safetyTimer = setTimeout(finish, 2500);
      inst.play().catch(finish);
    });
  }
  function playAlphaSound(letter) {
    if (!state.soundOn) return;
    const k = String(letter).toLowerCase();
    if (!/^[a-z]$/.test(k)) return;
    const base = alphaSoundFx[k];
    if (!base) return;
    const inst = base.cloneNode();
    inst.play().catch(() => {
    });
  }
  function playAlphaSoundAndWait(letter) {
    return new Promise((resolve) => {
      let done = false;
      let safetyTimer = 0;
      const finish = () => {
        if (done) return;
        done = true;
        if (safetyTimer) clearTimeout(safetyTimer);
        resolve();
      };
      if (!state.soundOn) {
        finish();
        return;
      }
      const k = String(letter).toLowerCase();
      if (!/^[a-z]$/.test(k)) {
        finish();
        return;
      }
      const base = alphaSoundFx[k];
      if (!base) {
        finish();
        return;
      }
      const inst = base.cloneNode();
      inst.addEventListener("ended", finish);
      inst.addEventListener("error", finish);
      safetyTimer = setTimeout(() => finish(), 2800);
      inst.play().catch(() => finish());
    });
  }
  function getSpellingSoundsInSlotOrder() {
    const filled = state.spellFilled;
    if (!filled || !filled.length) return [];
    const out = [];
    for (let i = 0; i < filled.length; i++) {
      const ch = filled[i];
      if (ch === null || ch === void 0 || ch === "") continue;
      const c = String(ch).toLowerCase().charAt(0);
      if (/^[a-z]$/.test(c)) out.push(c);
    }
    return out;
  }
  function updateSpellingHearButton() {
    if (!els.spellingHearWordBtn) return;
    const busy = state.spellListenPlaying;
    const off = !state.soundOn;
    const seq = getSpellingSoundsInSlotOrder();
    const canPlay = seq.length > 0;
    els.spellingHearWordBtn.disabled = busy || off || !canPlay;
    els.spellingHearWordBtn.setAttribute("aria-disabled", busy || off || !canPlay ? "true" : "false");
    els.spellingHearWordBtn.title = off ? "Turn Sound on in the corner to use this step." : canPlay ? `Plays your letters in order: ${seq.join(" ").toUpperCase()}` : "Fill at least one letter first.";
    els.spellingHearWordBtn.setAttribute(
      "aria-label",
      state.spellListenPlaying ? "Playing your letters" : canPlay ? "Listen to the letters you have in the word, left to right" : "Add at least one letter before listening"
    );
  }
  async function playSpellWordLetterByLetter() {
    if (!state.soundOn || state.spellListenPlaying) return;
    const toPlay = getSpellingSoundsInSlotOrder();
    if (toPlay.length === 0) return;
    const genAtStart = state.spellListenGen;
    state.spellListenPlaying = true;
    updateSpellingHearButton();
    try {
      for (let i = 0; i < toPlay.length; i++) {
        if (state.spellListenGen !== genAtStart) return;
        if (!state.soundOn) break;
        await playAlphaSoundAndWait(toPlay[i]);
        if (state.spellListenGen !== genAtStart) return;
        if (i < toPlay.length - 1) await new Promise((r) => setTimeout(r, 90));
        if (state.spellListenGen !== genAtStart) return;
      }
    } finally {
      state.spellListenPlaying = false;
      updateSpellingHearButton();
    }
  }
  function playSound(name, fallbackFn) {
    if (!state.soundOn) return;
    const s = soundFx[name];
    if (!s) {
      if (fallbackFn) fallbackFn();
      return;
    }
    const i = s.cloneNode();
    i.play().catch(() => {
      if (fallbackFn) fallbackFn();
    });
  }
  function playCorrectSound() {
    playSound("correct", () => {
      playTone(660, 100);
      setTimeout(() => playTone(880, 120), 80);
    });
  }
  function playClapSound() {
    if (!state.soundOn) return;
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1700;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(1e-4, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.09);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    source.stop(now + 0.09);
  }
  function playCelebrationSound() {
    playSound("celebration", () => {
      playCorrectSound();
      setTimeout(playClapSound, 40);
      setTimeout(() => playTone(990, 130), 160);
    });
  }
  var playWrongSound = () => playSound("wrong", () => playTone(220, 160));
  var playSelectSound = () => playSound("select", () => playTone(520, 60));
  var playToggleSound2 = () => playSound("toggle", () => playTone(360, 70));
  var playAddEmojiSound = () => playSound("addEmoji", () => playTone(430, 85));
  var playSubmitSound = () => playSound("submit", () => playTone(300, 55));
  function cancelSpeech() {
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } catch (e) {
    }
  }
  function speakTextAndWait(text, opts = {}) {
    return new Promise((resolve) => {
      var _a, _b;
      let done = false;
      let safetyTimer = 0;
      const finish = () => {
        if (done) return;
        done = true;
        if (safetyTimer) clearTimeout(safetyTimer);
        resolve();
      };
      if (!state.soundOn || !text) {
        finish();
        return;
      }
      const synth = window.speechSynthesis;
      if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
        finish();
        return;
      }
      const utter = new SpeechSynthesisUtterance(String(text));
      utter.lang = opts.lang || "en-US";
      utter.rate = (_a = opts.rate) != null ? _a : 0.85;
      utter.pitch = (_b = opts.pitch) != null ? _b : 1;
      utter.onend = finish;
      utter.onerror = finish;
      safetyTimer = setTimeout(finish, Math.max(2500, String(text).length * 400));
      synth.cancel();
      synth.speak(utter);
    });
  }
  function updateBigwordsHearButtons() {
    const busy = state.bigwordsListenPlaying;
    const off = !state.soundOn;
    if (els.bigwordsRepeatBtn) {
      els.bigwordsRepeatBtn.disabled = busy || off;
      els.bigwordsRepeatBtn.setAttribute("aria-disabled", busy || off ? "true" : "false");
    }
    if (els.bigwordsNextBtn) {
      els.bigwordsNextBtn.disabled = busy;
      els.bigwordsNextBtn.setAttribute("aria-disabled", busy ? "true" : "false");
    }
    if (els.bigwordsChunks) {
      els.bigwordsChunks.querySelectorAll(".bigwords-chunk").forEach((btn) => {
        btn.disabled = busy || off;
      });
    }
  }

  // src/router.js
  var NAV_TITLE = {
    home: "Kids Learning Playground",
    mathSetup: "Numbers \u2014 Set up",
    mathHelper: "Numbers \u2014 Homework helper",
    spellingSetup: "Spelling \u2014 Set up",
    play: "Numbers \u2014 Practice",
    phonicsPlay: "Letter sounds",
    spellingPlay: "Spelling \u2014 Practice",
    arrowPlay: "Arrow words \u2014 Practice",
    measureSetup: "Size & measure \u2014 Set up",
    measurePlay: "Size & measure \u2014 Practice",
    bigwordsSetup: "Big words \u2014 Set up",
    bigwordsPlay: "Big words \u2014 Practice",
    end: "Round finished!"
  };
  var currentRoute = "home";
  function getCurrentRoute() {
    return currentRoute;
  }
  function updateAppNav(screenName) {
    if (els.appNavTitle) {
      els.appNavTitle.textContent = NAV_TITLE[screenName] || NAV_TITLE.home;
    }
    if (els.appNavHome) {
      const onDashboard = screenName === "home";
      els.appNavHome.disabled = onDashboard;
      els.appNavHome.setAttribute("aria-hidden", onDashboard ? "true" : "false");
    }
  }
  function openAppModal(opts) {
    if (!els.appModal || !els.appModalTitle || !els.appModalMessage || !els.appModalCancel || !els.appModalConfirm) {
      return Promise.resolve(window.confirm(opts.message || opts.title));
    }
    return new Promise((resolve) => {
      const prevOverflow = document.body.style.overflow;
      const prevFocus = document.activeElement;
      els.appModalTitle.textContent = opts.title;
      els.appModalMessage.textContent = opts.message;
      els.appModalConfirm.textContent = opts.confirmLabel || "OK";
      els.appModalCancel.textContent = opts.cancelLabel || "Cancel";
      const focusables = [els.appModalCancel, els.appModalConfirm];
      function cleanup() {
        els.appModalConfirm.onclick = null;
        els.appModalCancel.onclick = null;
        if (els.appModalBackdrop) els.appModalBackdrop.onclick = null;
        document.body.style.overflow = prevOverflow;
        document.removeEventListener("keydown", onKey, true);
        els.appModal.classList.remove("is-open");
        els.appModal.setAttribute("aria-hidden", "true");
        if (prevFocus && typeof prevFocus.focus === "function") {
          try {
            prevFocus.focus();
          } catch (e) {
          }
        }
      }
      function finish(value) {
        cleanup();
        resolve(value);
      }
      function onKey(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          finish(false);
          return;
        }
        if (e.key !== "Tab") return;
        const i = focusables.indexOf(document.activeElement);
        if (e.shiftKey) {
          if (i <= 0) {
            e.preventDefault();
            focusables[focusables.length - 1].focus();
          }
        } else if (i === focusables.length - 1 || i === -1) {
          e.preventDefault();
          focusables[0].focus();
        }
      }
      document.body.style.overflow = "hidden";
      els.appModal.classList.add("is-open");
      els.appModal.setAttribute("aria-hidden", "false");
      document.addEventListener("keydown", onKey, true);
      els.appModalConfirm.onclick = () => finish(true);
      els.appModalCancel.onclick = () => finish(false);
      if (els.appModalBackdrop) els.appModalBackdrop.onclick = () => finish(false);
      requestAnimationFrame(() => {
        els.appModalCancel.focus();
      });
    });
  }
  function requestGoHome() {
    if (PLAY_ROUTES.has(currentRoute)) {
      openAppModal({
        title: "Go home?",
        message: "This round will stop. You can start a new one anytime!",
        confirmLabel: "Go home \u{1F3E0}",
        cancelLabel: "Keep playing"
      }).then((ok) => {
        if (!ok) return;
        pickRandomBg();
        showScreen("home");
      });
      return;
    }
    pickRandomBg();
    showScreen("home");
  }
  function showScreen(name) {
    var _a, _b, _c, _d;
    if (currentRoute === ACTIVITIES.spellingPhonics.playRoute && name !== ACTIVITIES.spellingPhonics.playRoute) {
      (_b = (_a = ACTIVITIES.spellingPhonics).onLeave) == null ? void 0 : _b.call(_a, state);
    }
    if (currentRoute === ACTIVITIES.bigwords.playRoute && name !== ACTIVITIES.bigwords.playRoute) {
      cancelSpeech();
      (_d = (_c = ACTIVITIES.bigwords).onLeave) == null ? void 0 : _d.call(_c, state);
    }
    const screens = {
      home: els.homeScreen,
      mathSetup: els.mathSetupScreen,
      mathHelper: els.mathHelperScreen,
      spellingSetup: els.spellingSetupScreen,
      spellingPlay: els.spellingPlayScreen,
      phonicsPlay: els.phonicsPlayScreen,
      arrowPlay: els.arrowPlayScreen,
      measureSetup: els.measureSetupScreen,
      measurePlay: els.measurePlayScreen,
      bigwordsSetup: els.bigwordsSetupScreen,
      bigwordsPlay: els.bigwordsPlayScreen,
      play: els.mainScreen,
      end: els.endScreen
    };
    Object.values(screens).forEach((el) => {
      if (el) el.style.display = "none";
    });
    if (name === "home") {
      screens.home.style.display = "flex";
    } else if (name === "mathSetup") {
      screens.mathSetup.style.display = "flex";
    } else if (name === "mathHelper") {
      if (screens.mathHelper) screens.mathHelper.style.display = "flex";
    } else if (name === "spellingSetup") {
      screens.spellingSetup.style.display = "flex";
    } else if (name === "spellingPlay") {
      screens.spellingPlay.style.display = "flex";
    } else if (name === "phonicsPlay") {
      if (screens.phonicsPlay) screens.phonicsPlay.style.display = "flex";
    } else if (name === "arrowPlay") {
      if (screens.arrowPlay) screens.arrowPlay.style.display = "flex";
    } else if (name === "measureSetup") {
      if (screens.measureSetup) screens.measureSetup.style.display = "flex";
    } else if (name === "measurePlay") {
      if (screens.measurePlay) screens.measurePlay.style.display = "flex";
    } else if (name === "bigwordsSetup") {
      if (screens.bigwordsSetup) screens.bigwordsSetup.style.display = "flex";
    } else if (name === "bigwordsPlay") {
      if (screens.bigwordsPlay) screens.bigwordsPlay.style.display = "flex";
    } else if (name === "play") {
      screens.play.style.display = "flex";
    } else if (name === "end") {
      screens.end.style.display = "flex";
    }
    currentRoute = name;
    updateAppNav(name);
  }

  // src/ui/toggles.js
  function updateSoundToggle() {
    const on = state.soundOn ? "Sound: On" : "Sound: Off";
    const pressed = state.soundOn ? "true" : "false";
    if (els.soundToggle) {
      els.soundToggle.textContent = on;
      els.soundToggle.setAttribute("aria-pressed", pressed);
    }
    if (els.spellingSoundToggle) {
      els.spellingSoundToggle.textContent = on;
      els.spellingSoundToggle.setAttribute("aria-pressed", pressed);
    }
    if (els.phonicsSoundToggle) {
      els.phonicsSoundToggle.textContent = on;
      els.phonicsSoundToggle.setAttribute("aria-pressed", pressed);
    }
    if (els.arrowSoundToggle) {
      els.arrowSoundToggle.textContent = on;
      els.arrowSoundToggle.setAttribute("aria-pressed", pressed);
    }
  }
  function updateHintToggle() {
    els.hintToggle.textContent = state.hintOn ? "Hint: On" : "Hint: Off";
    els.hintToggle.setAttribute("aria-pressed", state.hintOn ? "true" : "false");
  }

  // src/storage/math.js
  function bestScoreStorageKey() {
    return `kidsMathBest_${state.mathMode}_${state.mathDifficulty}_${state.mathQuestionCount}`;
  }
  function getBestScore() {
    try {
      const key = bestScoreStorageKey();
      const cur = Number(localStorage.getItem(key));
      if (Number.isFinite(cur)) return cur;
      const legacy = Number(localStorage.getItem(LEGACY_BEST_KEY) || 0);
      return Number.isFinite(legacy) ? legacy : 0;
    } catch (e) {
      return 0;
    }
  }
  function setBestScore(v) {
    try {
      const key = bestScoreStorageKey();
      localStorage.setItem(key, String(v));
      const legacy = Number(localStorage.getItem(LEGACY_BEST_KEY) || 0);
      if (v > legacy) localStorage.setItem(LEGACY_BEST_KEY, String(v));
    } catch (e) {
    }
  }
  function loadMathPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE.mathPrefs);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (MATH_MODES_ALL.includes(data.mode)) {
        state.mathMode = data.mode;
      } else if (data.mode === "before" || data.mode === "after" || data.mode === "orderMixed") {
        state.mathMode = "beforeAfter";
      }
      if (data.difficulty === "easy" || data.difficulty === "medium" || data.difficulty === "hard") {
        state.mathDifficulty = data.difficulty;
      }
      if (MATH_HELPERS.includes(data.helper)) {
        state.mathHelper = data.helper;
      }
      if (MATH_QUESTION_COUNTS.includes(data.questionCount)) {
        state.mathQuestionCount = data.questionCount;
      }
    } catch (e) {
    }
  }
  function saveMathPrefs() {
    try {
      localStorage.setItem(STORAGE.mathPrefs, JSON.stringify({
        mode: state.mathMode,
        difficulty: state.mathDifficulty,
        helper: state.mathHelper,
        questionCount: state.mathQuestionCount
      }));
    } catch (e) {
    }
  }

  // src/storage/spelling.js
  function bestSpellingScoreKey() {
    if (state.spellingMode === "arrow") return "kidsSpellBest_arrow";
    return `kidsSpellBest_${state.spellingCategory}`;
  }
  function getSpellingBest() {
    try {
      const v = Number(localStorage.getItem(bestSpellingScoreKey()));
      return Number.isFinite(v) ? v : 0;
    } catch (e) {
      return 0;
    }
  }
  function setSpellingBest(v) {
    try {
      localStorage.setItem(bestSpellingScoreKey(), String(v));
    } catch (e) {
    }
  }
  function loadSpellingPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE.spellingPrefs);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.mode === "phonics" || data.mode === "picture" || data.mode === "arrow") state.spellingMode = data.mode;
      if (data.category === "cvc" || data.category === "blend" || data.category === "digraph" || data.category === "mixed") {
        state.spellingCategory = data.category;
      }
    } catch (e) {
    }
  }
  function saveSpellingPrefs() {
    try {
      localStorage.setItem(STORAGE.spellingPrefs, JSON.stringify({
        mode: state.spellingMode,
        category: state.spellingCategory
      }));
    } catch (e) {
    }
  }

  // src/storage/measurement.js
  function bestMeasureScoreKey() {
    return `kidsMeasureBest_${state.measureMode}`;
  }
  function getMeasureBest() {
    try {
      const v = Number(localStorage.getItem(bestMeasureScoreKey()));
      return Number.isFinite(v) ? v : 0;
    } catch (e) {
      return 0;
    }
  }
  function setMeasureBest(v) {
    try {
      localStorage.setItem(bestMeasureScoreKey(), String(v));
    } catch (e) {
    }
  }
  function loadMeasurePrefs() {
    try {
      const raw = localStorage.getItem(STORAGE.measurePrefs);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (["mixed", "heavier", "lighter", "presents"].includes(data.mode)) {
        state.measureMode = data.mode;
      }
    } catch (e) {
    }
  }
  function saveMeasurePrefs() {
    try {
      localStorage.setItem(STORAGE.measurePrefs, JSON.stringify({ mode: state.measureMode }));
    } catch (e) {
    }
  }

  // src/storage/bigwords.js
  function loadBigwordsPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE.bigwordsPrefs);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (["easy", "medium", "hard"].includes(data.difficulty)) {
        state.bigwordsDifficulty = data.difficulty;
      }
    } catch (e) {
    }
  }
  function saveBigwordsPrefs() {
    try {
      localStorage.setItem(
        STORAGE.bigwordsPrefs,
        JSON.stringify({ difficulty: state.bigwordsDifficulty })
      );
    } catch (e) {
    }
  }

  // src/measurement/setup.js
  var MODE_BTNS = {
    mixed: "measureModeMixed",
    heavier: "measureModeHeavier",
    lighter: "measureModeLighter",
    presents: "measureModePresents"
  };
  function syncMeasureSetupUI() {
    Object.entries(MODE_BTNS).forEach(([mode, id]) => {
      const btn = els[id];
      if (btn) btn.setAttribute("aria-pressed", state.measureMode === mode ? "true" : "false");
    });
    if (els.measureSetupHint) {
      const hints = {
        mixed: "10 questions: heavier, lighter, and presents. Heavy makes a side go down; light goes up!",
        heavier: "Pick the one that is heavier \u2014 look for the side touching the ground.",
        lighter: "Pick the one that is lighter \u2014 look for the side up in the air.",
        presents: "Tap the heaviest present (purple), then the lightest (green)."
      };
      els.measureSetupHint.textContent = hints[state.measureMode] || hints.mixed;
    }
  }
  function setMeasureMode(mode) {
    state.measureMode = mode;
    syncMeasureSetupUI();
    playSelectSound();
  }

  // src/content/measurement-items.js
  var MEASUREMENT_ITEMS = [
    {
      id: "seesaw-girl-boy",
      types: ["heavier", "mixed"],
      scene: "seesaw",
      promptHeavier: "Who is heavier?",
      promptLighter: "Who is lighter?",
      left: { emoji: "\u{1F467}", label: "Girl" },
      right: { emoji: "\u{1F466}", label: "Boy" },
      heavySide: "left"
    },
    {
      id: "cow-chick",
      types: ["lighter", "mixed"],
      scene: "balance",
      promptHeavier: "Which animal is heavier?",
      promptLighter: "Which animal is lighter?",
      left: { emoji: "\u{1F404}", label: "Cow" },
      right: { emoji: "\u{1F425}", label: "Chick" },
      heavySide: "left"
    },
    {
      id: "car-feather",
      types: ["intro", "mixed"],
      scene: "balance",
      intro: true,
      left: { emoji: "\u{1F697}", label: "Car", caption: "heavy" },
      right: { emoji: "\u{1FAB6}", label: "Feather", caption: "light" },
      heavySide: "left"
    },
    {
      id: "presents-small-big",
      types: ["presents", "mixed"],
      scene: "balance",
      promptPresents: "Tap the heaviest present, then the lightest.",
      left: { emoji: "\u{1F381}", label: "Small present", sizeClass: "measure-item--small" },
      right: { emoji: "\u{1F381}", label: "Big present", sizeClass: "measure-item--large" },
      heavySide: "right"
    },
    {
      id: "rock-balloon",
      types: ["heavier", "mixed"],
      scene: "balance",
      promptHeavier: "Which is heavier?",
      promptLighter: "Which is lighter?",
      left: { emoji: "\u{1FAA8}", label: "Rock" },
      right: { emoji: "\u{1F388}", label: "Balloon" },
      heavySide: "left"
    },
    {
      id: "elephant-mouse",
      types: ["lighter", "mixed"],
      scene: "balance",
      promptHeavier: "Which animal is heavier?",
      promptLighter: "Which animal is lighter?",
      left: { emoji: "\u{1F418}", label: "Elephant" },
      right: { emoji: "\u{1F42D}", label: "Mouse" },
      heavySide: "left"
    },
    {
      id: "presents-tall-short",
      types: ["presents", "mixed"],
      scene: "balance",
      promptPresents: "Tap the heaviest present, then the lightest.",
      left: { emoji: "\u{1F381}", label: "Tall present", sizeClass: "measure-item--large" },
      right: { emoji: "\u{1F381}", label: "Short present", sizeClass: "measure-item--small" },
      heavySide: "left"
    },
    {
      id: "dog-kitten",
      types: ["heavier", "mixed"],
      scene: "seesaw",
      promptHeavier: "Who is heavier?",
      promptLighter: "Who is lighter?",
      left: { emoji: "\u{1F415}", label: "Dog" },
      right: { emoji: "\u{1F431}", label: "Kitten" },
      heavySide: "left"
    },
    {
      id: "book-stack",
      types: ["lighter", "mixed"],
      scene: "balance",
      promptHeavier: "Which is heavier?",
      promptLighter: "Which is lighter?",
      left: { emoji: "\u{1F4DA}", label: "Thick book" },
      right: { emoji: "\u{1F4D6}", label: "Thin book" },
      heavySide: "left"
    },
    {
      id: "watermelon-apple",
      types: ["heavier", "mixed"],
      scene: "balance",
      promptHeavier: "Which fruit is heavier?",
      promptLighter: "Which fruit is lighter?",
      left: { emoji: "\u{1F349}", label: "Watermelon" },
      right: { emoji: "\u{1F34E}", label: "Apple" },
      heavySide: "left"
    }
  ];

  // src/ui/effects.js
  function launchConfetti(count = 30) {
    const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6BD6", "#FFA06B"];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const c = document.createElement("div");
        c.className = "confetti-piece";
        c.style.left = `${Math.random() * 100}vw`;
        c.style.top = "-20px";
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDuration = `${1.2 + Math.random() * 1.5}s`;
        c.style.animationDelay = `${Math.random() * 0.5}s`;
        c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), BASE_CONFIG2.confettiLifetimeMs);
      }, i * BASE_CONFIG2.confettiStaggerMs);
    }
  }

  // src/utils/index.js
  var rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  function isOrderMode(mode = state.mathMode) {
    return MATH_MODES_ORDER.includes(mode);
  }
  function isCompareMode(mode = state.mathMode) {
    return MATH_MODES_COMPARE.includes(mode);
  }
  function isArithMode(mode = state.mathMode) {
    return MATH_MODES_ARITH.includes(mode);
  }
  function usesNumberLineHelper() {
    return state.mathHelper === "numberline" && isArithMode();
  }
  function isOrderQuestion(q) {
    return q && (q.type === "beforeAfter" || q.type === "between");
  }
  function isCompareQuestion(q) {
    return q && q.type === "compare";
  }
  function getOrderRange() {
    return ORDER_RANGES[state.mathDifficulty] || ORDER_RANGES.medium;
  }
  function getComparePreset() {
    return COMPARE_PRESETS[state.mathDifficulty] || COMPARE_PRESETS.medium;
  }
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function starLineForScore(score, total) {
    const ratio = score / total;
    if (ratio >= 0.9) return "\u2B50\u2B50\u2B50";
    if (ratio >= 0.6) return "\u2B50\u2B50";
    return "\u2B50";
  }

  // src/measurement/play.js
  function resolveQuestionType(item) {
    if (state.measureMode === "presents") return "presents";
    if (state.measureMode === "heavier") return "heavier";
    if (state.measureMode === "lighter") return "lighter";
    if (item.types.includes("presents") && Math.random() < 0.25) return "presents";
    if (Math.random() < 0.5) return "heavier";
    return "lighter";
  }
  function pickMeasureQuestions() {
    const pool = MEASUREMENT_ITEMS.filter((item) => {
      if (item.intro) return false;
      if (state.measureMode === "mixed") return true;
      return item.types.includes(state.measureMode);
    });
    const picked = shuffle([...pool]).slice(0, MEASURE_TOTAL);
    while (picked.length < MEASURE_TOTAL && MEASUREMENT_ITEMS.length) {
      picked.push(MEASUREMENT_ITEMS[picked.length % MEASUREMENT_ITEMS.length]);
    }
    return picked.slice(0, MEASURE_TOTAL).map((item) => ({
      item,
      qType: resolveQuestionType(item)
    }));
  }
  function promptFor(q) {
    const { item, qType } = q;
    if (qType === "presents") return item.promptPresents || "Tap the heaviest, then the lightest.";
    if (qType === "lighter") return item.promptLighter || "Which is lighter?";
    return item.promptHeavier || "Which is heavier?";
  }
  function correctSideFor(q) {
    const heavy = q.item.heavySide;
    if (q.qType === "lighter") return heavy === "left" ? "right" : "left";
    return heavy;
  }
  function startMeasureRound() {
    state.activeGame = "measurement";
    saveMeasurePrefs();
    pickRandomBg();
    state.measureQuestions = pickMeasureQuestions();
    state.measureQIndex = 0;
    state.measureScore = 0;
    showScreen("measurePlay");
    loadMeasureQuestion();
  }
  function loadMeasureQuestion() {
    state.measureBlocked = false;
    state.measurePresentStep = "heaviest";
    state.measurePresentPicks = {};
    const q = state.measureQuestions[state.measureQIndex];
    state.measureCurrentQ = q;
    els.measureQLabel.textContent = `Question ${state.measureQIndex + 1} of ${MEASURE_TOTAL}`;
    els.measureProgressFill.style.width = `${(state.measureQIndex + 1) / MEASURE_TOTAL * 100}%`;
    els.measurePrompt.textContent = promptFor(q);
    els.measureFeedback.textContent = "";
    els.measureFeedback.className = "feedback-msg";
    els.measureHint.textContent = q.qType === "presents" ? "First tap the heaviest (purple), then the lightest (green)." : "Tip: the side touching the ground is heavier.";
    renderMeasureScene(q);
  }
  function renderMeasureScene(q) {
    const { item, qType } = q;
    const heavySide = item.heavySide;
    const tiltClass = heavySide === "left" ? "measure-scale--tilt-left" : "measure-scale--tilt-right";
    const sceneClass = item.scene === "seesaw" ? "measure-scale--seesaw" : "measure-scale--balance";
    els.measureScale.className = `measure-scale ${sceneClass} ${tiltClass}`;
    const isSeesaw = item.scene === "seesaw";
    const sides = [
      { key: "left", data: item.left },
      { key: "right", data: item.right }
    ];
    els.measureSides.innerHTML = "";
    els.measureSides.className = isSeesaw ? "measure-sides measure-sides--seesaw" : "measure-sides measure-sides--balance";
    sides.forEach(({ key, data }) => {
      const wrap = document.createElement("div");
      wrap.className = `measure-side measure-side--${key}`;
      const choice = document.createElement("button");
      choice.type = "button";
      choice.className = isSeesaw ? "measure-seat measure-choice" : "measure-platform measure-choice";
      choice.dataset.side = key;
      choice.setAttribute("aria-label", data.label);
      choice.addEventListener("click", () => onMeasurePick(key));
      const figure = document.createElement("div");
      figure.className = `measure-item ${data.sizeClass || ""}`.trim();
      figure.textContent = data.emoji;
      figure.setAttribute("aria-hidden", "true");
      choice.appendChild(figure);
      if (data.caption) {
        const cap = document.createElement("span");
        cap.className = "measure-caption";
        cap.textContent = data.caption;
        choice.appendChild(cap);
      }
      wrap.appendChild(choice);
      els.measureSides.appendChild(wrap);
    });
  }
  function markMeasureChoice(side, kind) {
    const choice = els.measureSides.querySelector(`.measure-choice[data-side="${side}"]`);
    if (!choice) return;
    choice.classList.remove("measure-choice--purple", "measure-choice--green", "measure-choice--correct", "measure-choice--wrong");
    if (kind === "purple") choice.classList.add("measure-choice--purple");
    if (kind === "green") choice.classList.add("measure-choice--green");
    if (kind === "correct") choice.classList.add("measure-choice--correct");
    if (kind === "wrong") choice.classList.add("measure-choice--wrong");
  }
  function clearMeasureChoiceMarks() {
    els.measureSides.querySelectorAll(".measure-choice").forEach((el) => {
      el.classList.remove("measure-choice--purple", "measure-choice--green", "measure-choice--correct", "measure-choice--wrong");
    });
  }
  function onMeasurePick(side) {
    if (state.measureBlocked) return;
    const q = state.measureCurrentQ;
    if (!q) return;
    playSelectSound();
    if (q.qType === "presents") {
      handlePresentPick(side);
      return;
    }
    const correct = correctSideFor(q);
    if (side === correct) {
      state.measureBlocked = true;
      state.measureScore++;
      markMeasureChoice(side, "correct");
      els.measureFeedback.textContent = ["Yes! \u{1F389}", "You got it! \u2B50", "Super! \u{1F31F}"][Math.floor(Math.random() * 3)];
      els.measureFeedback.className = "feedback-msg right";
      playCelebrationSound();
      if (!prefersReducedMotion) launchConfetti();
      setTimeout(nextMeasureQuestion, BASE_CONFIG2.nextQuestionDelayMs);
    } else {
      state.measureBlocked = true;
      markMeasureChoice(side, "wrong");
      els.measureFeedback.textContent = "Look at which side is down \u2014 that one is heavier! Try again \u{1F4AA}";
      els.measureFeedback.className = "feedback-msg wrong";
      playWrongSound();
      setTimeout(() => {
        state.measureBlocked = false;
        clearMeasureChoiceMarks();
        els.measureFeedback.textContent = "";
        els.measureFeedback.className = "feedback-msg";
      }, BASE_CONFIG2.wrongAnswerUnlockDelayMs);
    }
  }
  function handlePresentPick(side) {
    const heavy = state.measureCurrentQ.item.heavySide;
    const light = heavy === "left" ? "right" : "left";
    if (state.measurePresentStep === "heaviest") {
      if (side !== heavy) {
        state.measureBlocked = true;
        markMeasureChoice(side, "wrong");
        els.measureFeedback.textContent = "The heaviest goes down on the scale. Try the other one!";
        els.measureFeedback.className = "feedback-msg wrong";
        playWrongSound();
        setTimeout(() => {
          state.measureBlocked = false;
          clearMeasureChoiceMarks();
          els.measureFeedback.textContent = "";
        }, BASE_CONFIG2.wrongAnswerUnlockDelayMs);
        return;
      }
      state.measurePresentPicks.heaviest = side;
      markMeasureChoice(side, "purple");
      state.measurePresentStep = "lightest";
      els.measureFeedback.textContent = "Great! Now tap the lightest present.";
      els.measureFeedback.className = "feedback-msg";
      playSelectSound();
      return;
    }
    if (state.measurePresentStep === "lightest") {
      if (side !== light) {
        state.measureBlocked = true;
        markMeasureChoice(side, "wrong");
        els.measureFeedback.textContent = "The lightest side is up high. Try the other present!";
        els.measureFeedback.className = "feedback-msg wrong";
        playWrongSound();
        setTimeout(() => {
          state.measureBlocked = false;
          clearMeasureChoiceMarks();
          if (state.measurePresentPicks.heaviest) {
            markMeasureChoice(state.measurePresentPicks.heaviest, "purple");
          }
          els.measureFeedback.textContent = "Now tap the lightest present.";
        }, BASE_CONFIG2.wrongAnswerUnlockDelayMs);
        return;
      }
      state.measurePresentPicks.lightest = side;
      markMeasureChoice(side, "green");
      state.measureBlocked = true;
      state.measureScore++;
      els.measureFeedback.textContent = ["Perfect! \u{1F389}", "Both right! \u2B50"][Math.floor(Math.random() * 2)];
      els.measureFeedback.className = "feedback-msg right";
      playCelebrationSound();
      if (!prefersReducedMotion) launchConfetti();
      setTimeout(nextMeasureQuestion, BASE_CONFIG2.nextQuestionDelayMs);
    }
  }
  function nextMeasureQuestion() {
    state.measureQIndex++;
    if (state.measureQIndex >= MEASURE_TOTAL) {
      showMeasureEnd();
      return;
    }
    loadMeasureQuestion();
  }
  var MODE_LABELS = {
    mixed: "Mixed",
    heavier: "Heavier",
    lighter: "Lighter",
    presents: "Presents"
  };
  function showMeasureEnd() {
    showScreen("end");
    const total = MEASURE_TOTAL;
    const stars = starLineForScore(state.measureScore, total);
    const msg = state.measureScore === total ? "PERFECT!" : state.measureScore >= Math.ceil(total * 0.8) ? "Amazing!" : state.measureScore >= Math.ceil(total * 0.5) ? "Great job!" : "Keep going!";
    const best = Math.max(getMeasureBest(), state.measureScore);
    setMeasureBest(best);
    const modeLabel = MODE_LABELS[state.measureMode] || "Mixed";
    els.endScreen.innerHTML = `
    <div class="end-trophy">\u{1F3C6}</div>
    <div class="end-title">${msg}</div>
    <div class="end-score">${state.measureScore} / ${total}</div>
    <div class="end-stars">${stars}</div>
    <div class="best-score">Best (${modeLabel}): ${best} / ${total}</div>
    <div class="stats">Size &amp; measure round complete \xB7 ${modeLabel}</div>
    <div class="end-actions">
      <button class="play-again-btn" id="play-again-btn" type="button">Play again \u{1F3AE}</button>
      <button class="secondary-btn" id="change-measure-btn" type="button">Change mode \u2699\uFE0F</button>
      <button class="secondary-btn" id="home-btn" type="button">Home \u{1F3E0}</button>
    </div>
  `;
    document.getElementById("play-again-btn").onclick = () => startMeasureRound();
    document.getElementById("change-measure-btn").onclick = () => {
      pickRandomBg();
      showScreen("measureSetup");
      syncMeasureSetupUI();
    };
    document.getElementById("home-btn").onclick = () => {
      state.activeGame = "math";
      requestGoHome();
    };
    if (!prefersReducedMotion) launchConfetti(60);
    if (state.measureScore === total) playSound("endPerfect", playCelebrationSound);
    else playSound("endTryAgain", playWrongSound);
  }

  // src/bigwords/setup.js
  function syncBigwordsSetupUI() {
    const diffMap = {
      easy: els.bigwordsDiffEasy,
      medium: els.bigwordsDiffMedium,
      hard: els.bigwordsDiffHard
    };
    Object.values(diffMap).forEach((btn) => {
      if (btn) btn.setAttribute("aria-pressed", "false");
    });
    if (diffMap[state.bigwordsDifficulty]) {
      diffMap[state.bigwordsDifficulty].setAttribute("aria-pressed", "true");
    }
    if (els.bigwordsSetupHint) {
      const hints = {
        easy: "3\u20134 syllable words. Tap each chunk to hear it, then say it aloud!",
        medium: "5\u20137 syllable words. Break the big word into small sound chunks.",
        hard: "8\u201310 syllable words. Take your time \u2014 adult taps Next when ready."
      };
      els.bigwordsSetupHint.textContent = hints[state.bigwordsDifficulty] || hints.medium;
    }
  }
  function setBigwordsDifficulty(diff) {
    state.bigwordsDifficulty = diff;
    syncBigwordsSetupUI();
    playSelectSound();
  }

  // src/content/big-words.js
  var BIG_WORDS = [
    // Easy — 3 syllables
    { word: "banana", chunks: ["ba", "na", "na"] },
    { word: "tomato", chunks: ["to", "ma", "to"] },
    { word: "animal", chunks: ["an", "i", "mal"] },
    { word: "family", chunks: ["fam", "i", "ly"] },
    { word: "bicycle", chunks: ["bi", "cy", "cle"] },
    { word: "dinosaur", chunks: ["di", "no", "saur"] },
    { word: "umbrella", chunks: ["um", "brel", "la"] },
    { word: "elephant", chunks: ["el", "e", "phant"] },
    { word: "hospital", chunks: ["hos", "pi", "tal"] },
    { word: "pineapple", chunks: ["pine", "ap", "ple"] },
    { word: "chocolate", chunks: ["choc", "o", "late"] },
    { word: "kangaroo", chunks: ["kan", "ga", "roo"] },
    // Easy — 4 syllables
    { word: "butterfly", chunks: ["but", "ter", "fly"] },
    { word: "watermelon", chunks: ["wa", "ter", "mel", "on"] },
    { word: "celebration", chunks: ["cel", "e", "bra", "tion"] },
    { word: "adventure", chunks: ["ad", "ven", "ture"] },
    { word: "telephone", chunks: ["tel", "e", "phone"] },
    { word: "vegetable", chunks: ["veg", "e", "ta", "ble"] },
    { word: "helicopter", chunks: ["hel", "i", "cop", "ter"] },
    { word: "caterpillar", chunks: ["cat", "er", "pil", "lar"] },
    { word: "refrigerator", chunks: ["re", "frig", "er", "a", "tor"] },
    // Medium — 5 syllables
    { word: "imagination", chunks: ["im", "ag", "i", "na", "tion"] },
    { word: "opportunity", chunks: ["op", "por", "tu", "ni", "ty"] },
    { word: "multiplication", chunks: ["mul", "ti", "pli", "ca", "tion"] },
    { word: "accidentally", chunks: ["ac", "ci", "den", "tal", "ly"] },
    { word: "electricity", chunks: ["e", "lec", "tric", "i", "ty"] },
    { word: "pronunciation", chunks: ["pro", "nun", "ci", "a", "tion"] },
    { word: "encyclopedia", chunks: ["en", "cy", "clo", "pe", "di", "a"] },
    { word: "responsibility", chunks: ["re", "spon", "si", "bil", "i", "ty"] },
    // Medium — 6–7 syllables
    { word: "extraordinary", chunks: ["ex", "tra", "or", "di", "na", "ry"] },
    { word: "communication", chunks: ["com", "mu", "ni", "ca", "tion"] },
    { word: "environmental", chunks: ["en", "vi", "ron", "men", "tal"] },
    { word: "characteristic", chunks: ["char", "ac", "ter", "is", "tic"] },
    { word: "revolutionary", chunks: ["rev", "o", "lu", "tion", "ar", "y"] },
    { word: "individuality", chunks: ["in", "di", "vid", "u", "al", "i", "ty"] },
    { word: "international", chunks: ["in", "ter", "na", "tion", "al"] },
    // Hard — 8 syllables
    { word: "incomprehensibility", chunks: ["in", "com", "pre", "hen", "si", "bil", "i", "ty"] },
    { word: "internationalization", chunks: ["in", "ter", "na", "tion", "al", "i", "za", "tion"] },
    { word: "uncharacteristically", chunks: ["un", "char", "ac", "ter", "is", "ti", "cal", "ly"] },
    { word: "individualization", chunks: ["in", "di", "vid", "u", "al", "i", "za", "tion"] },
    { word: "institutionalization", chunks: ["in", "sti", "tu", "tion", "al", "i", "za", "tion"] },
    { word: "operationalization", chunks: ["op", "er", "a", "tion", "al", "i", "za", "tion"] },
    { word: "unintelligibility", chunks: ["un", "in", "tel", "lig", "i", "bil", "i", "ty"] },
    // Hard — 9–10 syllables
    { word: "overcommercialization", chunks: ["o", "ver", "com", "mer", "cial", "i", "za", "tion"] },
    { word: "interdisciplinary", chunks: ["in", "ter", "dis", "ci", "pli", "nar", "y"] },
    { word: "misinterpretation", chunks: ["mis", "in", "ter", "pre", "ta", "tion"] },
    { word: "electrification", chunks: ["e", "lec", "tri", "fi", "ca", "tion"] },
    { word: "personalization", chunks: ["per", "son", "al", "i", "za", "tion"] },
    { word: "deindustrialization", chunks: ["de", "in", "dus", "tri", "al", "i", "za", "tion"] }
  ];
  var DIFF_RANGES = {
    easy: { min: 3, max: 4 },
    medium: { min: 5, max: 7 },
    hard: { min: 8, max: 10 }
  };
  function wordsForDifficulty(difficulty) {
    const range = DIFF_RANGES[difficulty] || DIFF_RANGES.medium;
    return BIG_WORDS.filter((entry) => {
      const count = entry.chunks.length;
      return count >= range.min && count <= range.max;
    });
  }

  // src/bigwords/play.js
  function pickBigwordsRound() {
    const pool = wordsForDifficulty(state.bigwordsDifficulty);
    const picked = shuffle([...pool]).slice(0, BIGWORDS_TOTAL);
    while (picked.length < BIGWORDS_TOTAL && pool.length) {
      picked.push(pool[picked.length % pool.length]);
    }
    return picked.slice(0, BIGWORDS_TOTAL);
  }
  function startBigwordsRound() {
    state.activeGame = "bigwords";
    saveBigwordsPrefs();
    pickRandomBg();
    state.bigwordsEntries = pickBigwordsRound();
    state.bigwordsQIndex = 0;
    state.bigwordsListenGen += 1;
    state.bigwordsListenPlaying = false;
    showScreen("bigwordsPlay");
    loadBigword();
  }
  function loadBigword() {
    cancelSpeech();
    state.bigwordsListenPlaying = false;
    state.bigwordsActiveChunk = null;
    const entry = state.bigwordsEntries[state.bigwordsQIndex];
    state.bigwordsCurrent = entry;
    els.bigwordsQLabel.textContent = `Word ${state.bigwordsQIndex + 1} of ${BIGWORDS_TOTAL}`;
    els.bigwordsProgressFill.style.width = `${(state.bigwordsQIndex + 1) / BIGWORDS_TOTAL * 100}%`;
    els.bigwordsWord.textContent = entry.word.toUpperCase();
    els.bigwordsWord.setAttribute("aria-label", `Big word: ${entry.word}`);
    renderBigwordChunks(entry);
    updateBigwordsHearButtons();
  }
  function renderBigwordChunks(entry) {
    if (!els.bigwordsChunks) return;
    els.bigwordsChunks.innerHTML = "";
    entry.chunks.forEach((chunk, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bigwords-chunk";
      btn.textContent = chunk;
      btn.setAttribute("aria-label", `Hear chunk ${chunk}`);
      btn.onclick = () => onBigwordChunkTap(index);
      els.bigwordsChunks.appendChild(btn);
    });
  }
  function setActiveChunk(index) {
    state.bigwordsActiveChunk = index;
    if (!els.bigwordsChunks) return;
    els.bigwordsChunks.querySelectorAll(".bigwords-chunk").forEach((btn, i) => {
      btn.classList.toggle("bigwords-chunk--active", i === index);
      btn.setAttribute("aria-pressed", i === index ? "true" : "false");
    });
  }
  async function onBigwordChunkTap(index) {
    if (state.bigwordsListenPlaying) return;
    const entry = state.bigwordsCurrent;
    if (!entry || !entry.chunks[index]) return;
    playSelectSound();
    setActiveChunk(index);
    const genAtStart = state.bigwordsListenGen;
    state.bigwordsListenPlaying = true;
    updateBigwordsHearButtons();
    try {
      await speakTextAndWait(entry.chunks[index], { rate: 0.85 });
      if (state.bigwordsListenGen !== genAtStart) return;
    } finally {
      state.bigwordsListenPlaying = false;
      updateBigwordsHearButtons();
    }
  }
  async function repeatBigword() {
    if (state.bigwordsListenPlaying || !state.bigwordsCurrent) return;
    const genAtStart = state.bigwordsListenGen;
    state.bigwordsListenPlaying = true;
    setActiveChunk(null);
    updateBigwordsHearButtons();
    try {
      await speakTextAndWait(state.bigwordsCurrent.word, { rate: 0.8 });
      if (state.bigwordsListenGen !== genAtStart) return;
    } finally {
      state.bigwordsListenPlaying = false;
      updateBigwordsHearButtons();
    }
  }
  function nextBigword() {
    if (state.bigwordsListenPlaying) return;
    cancelSpeech();
    state.bigwordsListenGen += 1;
    state.bigwordsQIndex++;
    if (state.bigwordsQIndex >= BIGWORDS_TOTAL) {
      showBigwordsEnd();
      return;
    }
    loadBigword();
  }
  var DIFF_LABELS = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard"
  };
  function showBigwordsEnd() {
    showScreen("end");
    const diffLabel = DIFF_LABELS[state.bigwordsDifficulty] || "Medium";
    els.endScreen.innerHTML = `
    <div class="end-trophy">\u{1F3A4}</div>
    <div class="end-title">Great speaking practice!</div>
    <div class="end-score">You did ${BIGWORDS_TOTAL} words</div>
    <div class="stats">Big words \u2192 small words \xB7 ${diffLabel} \xB7 Adult guided (no score)</div>
    <div class="end-actions">
      <button class="play-again-btn" id="play-again-btn" type="button">Play again \u{1F3AE}</button>
      <button class="secondary-btn" id="change-bigwords-btn" type="button">Change level \u2699\uFE0F</button>
      <button class="secondary-btn" id="home-btn" type="button">Home \u{1F3E0}</button>
    </div>
  `;
    document.getElementById("play-again-btn").onclick = () => startBigwordsRound();
    document.getElementById("change-bigwords-btn").onclick = () => {
      pickRandomBg();
      showScreen("bigwordsSetup");
      syncBigwordsSetupUI();
    };
    document.getElementById("home-btn").onclick = () => {
      state.activeGame = "math";
      requestGoHome();
    };
  }

  // src/math/setup.js
  function syncMathHelperFieldset() {
    const show = isArithMode();
    if (els.mathHelperFieldset) els.mathHelperFieldset.hidden = !show;
  }
  function syncMathSetupUI() {
    const modeMap = {
      mixed: els.modeMixed,
      add: els.modeAdd,
      sub: els.modeSub,
      beforeAfter: els.modeBeforeAfter,
      between: els.modeBetween,
      lessThan: els.modeLessThan,
      greaterThan: els.modeGreaterThan,
      compareMixed: els.modeCompareMixed
    };
    Object.values(modeMap).forEach((btn) => {
      if (btn) btn.setAttribute("aria-pressed", "false");
    });
    if (modeMap[state.mathMode]) modeMap[state.mathMode].setAttribute("aria-pressed", "true");
    const diffMap = { easy: els.diffEasy, medium: els.diffMedium, hard: els.diffHard };
    Object.values(diffMap).forEach((btn) => {
      if (btn) btn.setAttribute("aria-pressed", "false");
    });
    if (diffMap[state.mathDifficulty]) diffMap[state.mathDifficulty].setAttribute("aria-pressed", "true");
    const countMap = { 10: els.mathCount10, 15: els.mathCount15, 20: els.mathCount20 };
    Object.values(countMap).forEach((btn) => {
      if (btn) btn.setAttribute("aria-pressed", "false");
    });
    if (countMap[state.mathQuestionCount]) countMap[state.mathQuestionCount].setAttribute("aria-pressed", "true");
    const helperMap = { emoji: els.mathHelperEmoji, numberline: els.mathHelperNumberline };
    Object.values(helperMap).forEach((btn) => {
      if (btn) btn.setAttribute("aria-pressed", "false");
    });
    if (helperMap[state.mathHelper]) helperMap[state.mathHelper].setAttribute("aria-pressed", "true");
    syncMathHelperFieldset();
  }
  function setMathMode(mode) {
    state.mathMode = mode;
    syncMathSetupUI();
    playSelectSound();
  }
  function setMathDifficulty(diff) {
    state.mathDifficulty = diff;
    syncMathSetupUI();
    playSelectSound();
  }
  function setMathQuestionCount(count) {
    state.mathQuestionCount = count;
    syncMathSetupUI();
    playSelectSound();
  }
  function setMathHelper(helper) {
    state.mathHelper = helper;
    syncMathSetupUI();
    playSelectSound();
  }

  // src/math/questions.js
  function buildSequenceChoices(correctValues, sequenceValues, rangeMin, rangeMax) {
    const correctSet = new Set(correctValues);
    const extras = /* @__PURE__ */ new Set();
    for (const v of sequenceValues) {
      for (let d = -4; d <= 4; d++) {
        const n = v + d;
        if (n >= rangeMin && n <= rangeMax && !correctSet.has(n)) extras.add(n);
      }
    }
    const minChoices = Math.max(8, correctSet.size + 2);
    let guard = 0;
    while (correctSet.size + extras.size < minChoices && guard < 50) {
      const n = rnd(rangeMin, rangeMax);
      if (!correctSet.has(n)) extras.add(n);
      guard++;
    }
    const pickedExtras = shuffle([...extras]).slice(0, minChoices - correctSet.size);
    return shuffle([...correctSet, ...pickedExtras]);
  }
  function genOrderQuestion(kind) {
    var _a;
    const { min, max } = getOrderRange();
    const layout = ((_a = ORDER_LAYOUT[state.mathDifficulty]) == null ? void 0 : _a[kind]) || ORDER_LAYOUT.medium[kind];
    const { length, shownIndices } = layout;
    const start = rnd(min, max - length + 1);
    const values = Array.from({ length }, (_, i) => start + i);
    const shownSet = new Set(shownIndices);
    const blankIndices = [];
    const answers = {};
    for (let i = 0; i < length; i++) {
      if (!shownSet.has(i)) {
        blankIndices.push(i);
        answers[i] = values[i];
      }
    }
    return {
      type: kind,
      values,
      shownIndices,
      blankIndices,
      answers,
      choices: buildSequenceChoices(Object.values(answers), values, min, max)
    };
  }
  function orderBlankCount(q) {
    var _a, _b;
    return (_b = (_a = q.blankIndices) == null ? void 0 : _a.length) != null ? _b : 0;
  }
  function firstUnfilledBlankIndex(q) {
    var _a;
    return (_a = q.blankIndices.find((i) => state.orderAnswers[i] === void 0)) != null ? _a : null;
  }
  function genComparePair(preset) {
    const { min, max, sameTensWeight = 0, minGap = 1, closeGapMax } = preset;
    const useSameTens = Math.random() < sameTensWeight && max >= 20;
    const useCloseGap = closeGapMax && Math.random() < 0.6;
    for (let attempt = 0; attempt < 50; attempt++) {
      let a2;
      let b2;
      if (useCloseGap && max - min > closeGapMax) {
        a2 = rnd(min, max - closeGapMax);
        b2 = a2 + rnd(1, closeGapMax);
        if (Math.random() < 0.5) [a2, b2] = [b2, a2];
      } else if (useSameTens) {
        const tensMin = Math.max(1, Math.floor(min / 10));
        const tensMax = Math.floor(max / 10);
        if (tensMax < tensMin) continue;
        const tens = rnd(tensMin, tensMax);
        const low = Math.max(min, tens * 10);
        const high = Math.min(max, tens * 10 + 9);
        if (high <= low) continue;
        a2 = rnd(low, high);
        b2 = rnd(low, high);
        let guard = 0;
        while (b2 === a2 && guard < 20) {
          b2 = rnd(low, high);
          guard++;
        }
        if (b2 === a2) continue;
      } else {
        a2 = rnd(min, max);
        b2 = rnd(min, max);
        let guard = 0;
        while (b2 === a2 && guard < 20) {
          b2 = rnd(min, max);
          guard++;
        }
        if (b2 === a2) continue;
      }
      if (Math.abs(a2 - b2) < minGap) continue;
      return [a2, b2];
    }
    const a = rnd(min, Math.max(min, max - minGap));
    const b = rnd(a + minGap, max);
    return [a, b];
  }
  function resolveCompareDirection(mode) {
    if (mode === "lessThan") return "less";
    if (mode === "greaterThan") return "greater";
    return Math.random() < 0.5 ? "less" : "greater";
  }
  function genCompareQuestion(direction) {
    const preset = getComparePreset();
    const [left, right] = genComparePair(preset);
    const smallerSide = left < right ? "left" : "right";
    const correctSide = direction === "less" ? smallerSide : smallerSide === "left" ? "right" : "left";
    return {
      type: "compare",
      direction,
      left,
      right,
      correctSide
    };
  }
  function genQuestions() {
    const total = state.mathQuestionCount;
    if (isCompareMode()) {
      const qs2 = [];
      for (let i = 0; i < total; i++) {
        qs2.push(genCompareQuestion(resolveCompareDirection(state.mathMode)));
      }
      return shuffle(qs2);
    }
    if (isOrderMode()) {
      const qs2 = [];
      for (let i = 0; i < total; i++) {
        qs2.push(genOrderQuestion(state.mathMode));
      }
      return shuffle(qs2);
    }
    const preset = DIFFICULTY_PRESETS[state.mathDifficulty];
    const qs = [];
    let addCount = 0;
    let subCount = 0;
    if (state.mathMode === "add") addCount = total;
    else if (state.mathMode === "sub") subCount = total;
    else {
      addCount = Math.floor(total / 2);
      subCount = total - addCount;
    }
    for (let i = 0; i < addCount; i++) {
      const a = rnd(preset.additionRange.min, preset.additionRange.max);
      const b = rnd(preset.additionRange.min, preset.additionRange.max);
      qs.push({ type: "add", a, b, ans: a + b });
    }
    for (let i = 0; i < subCount; i++) {
      const a = rnd(preset.subtractionMinA, preset.subtractionMaxA);
      const b = rnd(1, a - 1);
      qs.push({ type: "sub", a, b, ans: a - b });
    }
    return shuffle(qs);
  }

  // src/math/compare-visual.js
  function decomposeNumber(n) {
    return {
      hundreds: Math.floor(n / 100),
      tens: Math.floor(n % 100 / 10),
      ones: n % 10
    };
  }
  function placeValueLabel(n) {
    const { hundreds, tens, ones } = decomposeNumber(n);
    const parts = [];
    if (hundreds) parts.push(`${hundreds} group${hundreds > 1 ? "s" : ""} of one hundred`);
    if (tens) parts.push(`${tens} bundle${tens > 1 ? "s" : ""} of ten`);
    if (ones) parts.push(`${ones} stick${ones > 1 ? "s" : ""}`);
    return parts.join(" plus ") || "zero";
  }
  function createBundleEl() {
    const bundle = document.createElement("span");
    bundle.className = "compare-bundle";
    bundle.setAttribute("aria-hidden", "true");
    const sticks = document.createElement("span");
    sticks.className = "compare-bundle-sticks";
    for (let i = 0; i < 10; i++) {
      const stick = document.createElement("span");
      stick.className = "compare-bundle-stick";
      sticks.appendChild(stick);
    }
    const band = document.createElement("span");
    band.className = "compare-bundle-band";
    sticks.appendChild(band);
    bundle.appendChild(sticks);
    return bundle;
  }
  function createStickEl() {
    const stick = document.createElement("span");
    stick.className = "compare-stick";
    stick.setAttribute("aria-hidden", "true");
    return stick;
  }
  function createHundredEl() {
    const block = document.createElement("span");
    block.className = "compare-hundred";
    block.setAttribute("aria-hidden", "true");
    block.textContent = "100";
    return block;
  }
  function createPlaceValueVisual(n) {
    const { hundreds, tens, ones } = decomposeNumber(n);
    const visual = document.createElement("div");
    visual.className = "compare-place-value";
    if (hundreds > 0) {
      const row = document.createElement("div");
      row.className = "compare-place-row compare-place-row--hundreds";
      for (let i = 0; i < hundreds; i++) row.appendChild(createHundredEl());
      visual.appendChild(row);
    }
    if (tens > 0) {
      const row = document.createElement("div");
      row.className = "compare-place-row compare-place-row--tens";
      for (let i = 0; i < tens; i++) row.appendChild(createBundleEl());
      visual.appendChild(row);
    }
    if (ones > 0) {
      const row = document.createElement("div");
      row.className = "compare-place-row compare-place-row--ones";
      for (let i = 0; i < ones; i++) row.appendChild(createStickEl());
      visual.appendChild(row);
    }
    if (hundreds === 0 && tens === 0 && ones === 0) {
      const row = document.createElement("div");
      row.className = "compare-place-row compare-place-row--empty";
      row.textContent = "0";
      visual.appendChild(row);
    }
    return visual;
  }
  function createHintBundle() {
    return createBundleEl();
  }
  function createHintStick() {
    return createStickEl();
  }
  function createHintHundred() {
    return createHundredEl();
  }

  // src/math/number-line.js
  function cancelNumberLineAnimation() {
  }
  function getNumberLineWindow(q, difficulty = state.mathDifficulty) {
    var _a;
    const isAdd = q.type === "add";
    const start = q.a;
    const jumps = q.b;
    const end = isAdd ? start + jumps : start - jumps;
    const pad = difficulty === "easy" ? 2 : 1;
    let min = Math.max(0, Math.min(start, end) - pad);
    let max = Math.max(start, end) + pad;
    const baseCap = (_a = NUMBER_LINE_CAPS[difficulty]) != null ? _a : NUMBER_LINE_CAPS.medium;
    const requiredSpan = Math.abs(end - start) + pad * 2 + 1;
    const cap = Math.max(baseCap, requiredSpan);
    if (max - min > cap - 1) {
      if (isAdd) {
        min = Math.max(0, end - cap + 1);
        max = min + cap - 1;
      } else {
        min = Math.max(0, start - cap + 1);
        max = min + cap - 1;
      }
    }
    return { min, max, start, end, jumps, isAdd };
  }
  function tickX(value, min, max, padX, innerWidth) {
    if (max === min) return padX + innerWidth / 2;
    return padX + (value - min) / (max - min) * innerWidth;
  }
  function arcPath(x1, x2, y, height) {
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${y} Q ${mid} ${y - height} ${x2} ${y}`;
  }
  function describeJumps(win) {
    const dir = win.isAdd ? "forward" : "back";
    return `Start at ${win.start}, jump ${dir} ${win.jumps} time${win.jumps === 1 ? "" : "s"}, land on ${win.end}`;
  }
  function numberLineTitle(q) {
    const win = getNumberLineWindow(q);
    return `Start at ${win.start}. Use \u2212 and + to count!`;
  }
  function createJumpArc(svg, arcsGroup, fromVal, toVal, win, padX, innerWidth, lineY, arcH) {
    const x1 = tickX(fromVal, win.min, win.max, padX, innerWidth);
    const x2 = tickX(toVal, win.min, win.max, padX, innerWidth);
    const goingForward = toVal > fromVal;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "number-line-jump");
    path.setAttribute("d", arcPath(x1, x2, lineY, arcH));
    path.setAttribute("stroke", goingForward ? "#2563eb" : "#dc2626");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-dasharray", "6 4");
    arcsGroup.appendChild(path);
    return path;
  }
  function renderNumberLine(root, q, opts = {}) {
    if (!root || !q) return;
    cancelNumberLineAnimation();
    const { wide = false } = opts;
    const win = getNumberLineWindow(q);
    const padX = 28;
    const ticks = Math.max(2, win.max - win.min + 1);
    const maxLabelChars = Math.max(String(win.min).length, String(win.max).length);
    const labelStepPx = maxLabelChars * 10 + 14;
    const baseStepPx = wide ? 30 : 22;
    const stepPx = Math.max(baseStepPx, labelStepPx);
    const width = Math.max(320, (ticks - 1) * stepPx + padX * 2);
    const height = 120;
    const lineY = 72;
    const arcH = 22;
    const startColor = "#dc2626";
    const currentColor = "#2563eb";
    const innerWidth = width - padX * 2;
    const values = [];
    for (let n = win.min; n <= win.max; n++) values.push(n);
    root.innerHTML = "";
    root.hidden = false;
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", describeJumps(win));
    root.classList.toggle("number-line-root--wide", wide);
    const wrap = document.createElement("div");
    wrap.className = "number-line-wrap";
    const stage = document.createElement("div");
    stage.className = "number-line-stage";
    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "number-line-side-btn";
    backBtn.innerHTML = '<span class="number-line-side-symbol" aria-hidden="true">\u2212</span>';
    backBtn.setAttribute("aria-label", "Minus one on the number line");
    const svgWrap = document.createElement("div");
    svgWrap.className = "number-line-svg-wrap";
    const forwardBtn = document.createElement("button");
    forwardBtn.type = "button";
    forwardBtn.className = "number-line-side-btn";
    forwardBtn.innerHTML = '<span class="number-line-side-symbol" aria-hidden="true">+</span>';
    forwardBtn.setAttribute("aria-label", "Plus one on the number line");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "number-line-svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("aria-hidden", "true");
    if (wide) svg.style.width = `${width}px`;
    const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axis.setAttribute("class", "number-line-axis");
    axis.setAttribute("x1", String(padX - 8));
    axis.setAttribute("y1", String(lineY));
    axis.setAttribute("x2", String(width - padX + 8));
    axis.setAttribute("y2", String(lineY));
    svg.appendChild(axis);
    values.forEach((n) => {
      const x = tickX(n, win.min, win.max, padX, innerWidth);
      const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tick.setAttribute("class", "number-line-tick");
      tick.setAttribute("x1", String(x));
      tick.setAttribute("y1", String(lineY - 6));
      tick.setAttribute("x2", String(x));
      tick.setAttribute("y2", String(lineY + 6));
      svg.appendChild(tick);
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("class", "number-line-label");
      label.setAttribute("x", String(x));
      label.setAttribute("y", String(lineY + 24));
      label.setAttribute("text-anchor", "middle");
      label.textContent = String(n);
      svg.appendChild(label);
    });
    const arcsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    arcsGroup.setAttribute("class", "number-line-arcs");
    svg.appendChild(arcsGroup);
    const startDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    startDot.setAttribute("class", "number-line-dot number-line-dot--start");
    startDot.setAttribute("cx", String(tickX(win.start, win.min, win.max, padX, innerWidth)));
    startDot.setAttribute("cy", String(lineY));
    startDot.setAttribute("r", "5");
    startDot.setAttribute("fill", startColor);
    svg.appendChild(startDot);
    const currentDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    currentDot.setAttribute("class", "number-line-dot number-line-dot--current");
    currentDot.setAttribute("cx", String(tickX(win.start, win.min, win.max, padX, innerWidth)));
    currentDot.setAttribute("cy", String(lineY));
    currentDot.setAttribute("r", "6");
    currentDot.setAttribute("fill", currentColor);
    svg.appendChild(currentDot);
    const endDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    endDot.setAttribute("class", "number-line-dot number-line-dot--end");
    endDot.setAttribute("cx", String(tickX(win.end, win.min, win.max, padX, innerWidth)));
    endDot.setAttribute("cy", String(lineY));
    endDot.setAttribute("r", "5");
    endDot.setAttribute("fill", currentColor);
    endDot.setAttribute("opacity", "0");
    svg.appendChild(endDot);
    svgWrap.appendChild(svg);
    stage.appendChild(backBtn);
    stage.appendChild(svgWrap);
    stage.appendChild(forwardBtn);
    wrap.appendChild(stage);
    root.appendChild(wrap);
    let currentPos = win.start;
    const moveCurrentDot = (pos) => {
      currentDot.setAttribute("cx", String(tickX(pos, win.min, win.max, padX, innerWidth)));
      endDot.setAttribute("opacity", pos === win.end ? "1" : "0");
    };
    const syncSideButtons = () => {
      const blocked = state.blocked;
      backBtn.disabled = blocked || currentPos <= win.min;
      forwardBtn.disabled = blocked || currentPos >= win.max;
    };
    const stepForward = () => {
      if (state.blocked || currentPos >= win.max) return;
      const from = currentPos;
      const to = currentPos + 1;
      createJumpArc(svg, arcsGroup, from, to, win, padX, innerWidth, lineY, arcH);
      currentPos = to;
      moveCurrentDot(currentPos);
      syncSideButtons();
      if (state.soundOn) playSelectSound();
    };
    const stepBack = () => {
      if (state.blocked || currentPos <= win.min) return;
      const from = currentPos;
      const to = currentPos - 1;
      createJumpArc(svg, arcsGroup, from, to, win, padX, innerWidth, lineY, arcH);
      currentPos = to;
      moveCurrentDot(currentPos);
      syncSideButtons();
      if (state.soundOn) playSelectSound();
    };
    forwardBtn.onclick = stepForward;
    backBtn.onclick = stepBack;
    syncSideButtons();
  }
  function hideNumberLine(root) {
    cancelNumberLineAnimation();
    if (!root) return;
    root.hidden = true;
    root.innerHTML = "";
    root.removeAttribute("aria-label");
  }

  // src/math/play.js
  function syncMathAnswerSection(compareRound = isCompareMode()) {
    const hidePicker = compareRound;
    if (els.mathAnswerLabel) els.mathAnswerLabel.hidden = hidePicker;
    if (els.numberPicker) els.numberPicker.hidden = hidePicker;
    if (els.submitBtn) els.submitBtn.hidden = hidePicker;
  }
  function startMathRound() {
    state.activeGame = "math";
    saveMathPrefs();
    pickRandomBg();
    state.theme = THEMES[Math.floor(Math.random() * THEMES.length)];
    state.emoji = state.theme.emojis[Math.floor(Math.random() * state.theme.emojis.length)];
    state.questions = genQuestions();
    const orderRound = isOrderMode();
    const compareRound = isCompareMode();
    state.maxAnswer = Math.max(...state.questions.map((q) => {
      if (isOrderQuestion(q)) return Math.max(...Object.values(q.answers));
      if (isCompareQuestion(q)) return Math.max(q.left, q.right);
      return q.ans;
    }));
    state.maxPickerValue = orderRound ? Math.max(...state.questions.flatMap((q) => q.choices)) : state.maxAnswer;
    state.qIndex = 0;
    state.score = 0;
    state.stats = {
      addCorrect: 0,
      addTotal: 0,
      subCorrect: 0,
      subTotal: 0,
      orderCorrect: 0,
      orderTotal: 0,
      compareCorrect: 0,
      compareTotal: 0
    };
    const hideHelpers = orderRound || compareRound;
    const numberLineRound = usesNumberLineHelper() && !hideHelpers;
    if (els.hintToggle) {
      els.hintToggle.style.display = hideHelpers || numberLineRound ? "none" : "";
    }
    if (els.emojiZone) els.emojiZone.style.display = hideHelpers ? "none" : "";
    syncMathAnswerSection(compareRound);
    showScreen("play");
    loadQuestion();
  }
  function orderSlotId(index) {
    return `math-order-slot-${index}`;
  }
  function setOrderSlot(index, text) {
    const slot = document.getElementById(orderSlotId(index));
    if (!slot) return;
    const value = text === null || text === void 0 ? "?" : String(text);
    slot.textContent = value;
    slot.classList.toggle("math-order-num--filled", value !== "?");
    slot.setAttribute(
      "aria-label",
      value === "?" ? "Blank to fill" : `Answer ${value}, tap to change`
    );
  }
  function updateOrderStepHint() {
    if (!els.mathOrderPrompt || !isOrderQuestion(state.currentQ)) return;
    const q = state.currentQ;
    const total = orderBlankCount(q);
    const filled = q.blankIndices.filter((i) => state.orderAnswers[i] !== void 0).length;
    if (filled >= total) {
      els.mathOrderPrompt.textContent = q.type === "beforeAfter" ? "Before & after \u2014 tap submit when ready! (tap a filled ? to change)" : "Between \u2014 tap submit when ready! (tap a filled ? to change)";
      return;
    }
    const step = filled + 1;
    els.mathOrderPrompt.textContent = q.type === "beforeAfter" ? `Fill in the missing numbers (${step} of ${total}) \u2B05\uFE0F\u27A1\uFE0F` : `Fill in the missing numbers (${step} of ${total}) \u2194\uFE0F`;
  }
  function highlightActiveOrderSlot() {
    const q = state.currentQ;
    if (!(q == null ? void 0 : q.blankIndices)) return;
    q.blankIndices.forEach((i) => {
      const slot = document.getElementById(orderSlotId(i));
      if (slot) slot.classList.toggle("math-order-num--active", i === state.orderActiveBlankIndex);
    });
  }
  function clearOrderBlankAt(index) {
    if (state.blocked || !isOrderQuestion(state.currentQ)) return;
    const q = state.currentQ;
    if (!q.blankIndices.includes(index)) return;
    const startPos = q.blankIndices.indexOf(index);
    for (let j = startPos; j < q.blankIndices.length; j++) {
      const i = q.blankIndices[j];
      delete state.orderAnswers[i];
      setOrderSlot(i, null);
    }
    state.orderActiveBlankIndex = index;
    document.querySelectorAll(".num-btn").forEach((b) => {
      b.classList.remove("selected");
      b.setAttribute("aria-pressed", "false");
    });
    updateOrderStepHint();
    highlightActiveOrderSlot();
    updateSubmitState();
    playToggleSound2();
  }
  function renderOrderQuestion() {
    const q = state.currentQ;
    if (els.mathArithmeticView) els.mathArithmeticView.hidden = true;
    if (els.mathOrderView) els.mathOrderView.hidden = false;
    if (els.mathCompareView) els.mathCompareView.hidden = true;
    if (els.mathDisplay) els.mathDisplay.classList.add("math-display--order");
    if (els.mathDisplay) els.mathDisplay.classList.remove("math-display--compare");
    if (els.mathOrderBlank) els.mathOrderBlank.hidden = true;
    if (els.mathBlank) els.mathBlank.textContent = "?";
    if (els.mathOrderPrompt) {
      els.mathOrderPrompt.textContent = q.type === "beforeAfter" ? "Fill in the numbers before and after!" : "Fill in the numbers between!";
    }
    if (!els.mathOrderSequence) return;
    els.mathOrderSequence.innerHTML = "";
    els.mathOrderSequence.removeAttribute("aria-hidden");
    els.mathOrderSequence.classList.toggle("math-order-sequence--long", q.values.length >= 7);
    const shownSet = new Set(q.shownIndices);
    q.values.forEach((value, i) => {
      if (i > 0) els.mathOrderSequence.appendChild(createOrderGap());
      if (shownSet.has(i)) {
        els.mathOrderSequence.appendChild(createOrderNum(value));
        return;
      }
      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "math-order-num math-order-num--answer";
      slot.id = orderSlotId(i);
      slot.textContent = "?";
      slot.setAttribute("aria-label", "Blank to fill");
      slot.onclick = () => clearOrderBlankAt(i);
      els.mathOrderSequence.appendChild(slot);
    });
    updateOrderStepHint();
    highlightActiveOrderSlot();
  }
  function createOrderNum(n) {
    const el = document.createElement("span");
    el.className = "math-order-num";
    el.textContent = n;
    return el;
  }
  function createOrderGap() {
    const el = document.createElement("span");
    el.className = "math-order-gap";
    el.textContent = "\xB7";
    el.setAttribute("aria-hidden", "true");
    return el;
  }
  function resetMathAnswerBlank() {
    if (els.mathBlank) els.mathBlank.textContent = "?";
    if (els.mathOrderBlank) {
      els.mathOrderBlank.textContent = "?";
      els.mathOrderBlank.hidden = true;
    }
  }
  function compareSymbolBetween(q) {
    return q.left < q.right ? "<" : ">";
  }
  function comparePromptText(q) {
    if (q.direction === "less") return "Tap the number that is less";
    return "Tap the number that is greater";
  }
  function compareFeedbackLine(q) {
    const smaller = q.left < q.right ? q.left : q.right;
    const larger = q.left < q.right ? q.right : q.left;
    return `${smaller} < ${larger}`;
  }
  function clearCompareChoiceMarks() {
    if (!els.mathComparePair) return;
    els.mathComparePair.querySelectorAll(".math-compare-choice").forEach((el) => {
      el.classList.remove("math-compare-choice--correct", "math-compare-choice--wrong");
    });
  }
  function markCompareChoice(side, kind) {
    var _a;
    const choice = (_a = els.mathComparePair) == null ? void 0 : _a.querySelector(`.math-compare-choice[data-side="${side}"]`);
    if (!choice) return;
    choice.classList.remove("math-compare-choice--correct", "math-compare-choice--wrong");
    if (kind === "correct") choice.classList.add("math-compare-choice--correct");
    if (kind === "wrong") choice.classList.add("math-compare-choice--wrong");
  }
  function onComparePick(side) {
    if (state.blocked || !isCompareQuestion(state.currentQ)) return;
    const q = state.currentQ;
    playSelectSound();
    if (side === q.correctSide) {
      state.blocked = true;
      state.stats.compareTotal++;
      state.stats.compareCorrect++;
      state.score++;
      markCompareChoice(side, "correct");
      els.feedback.textContent = `${compareFeedbackLine(q)} \u2014 ${["Amazing! \u{1F389}", "You got it! \u2B50", "Brilliant! \u{1F31F}"][Math.floor(Math.random() * 3)]}`;
      els.feedback.className = "feedback-msg right";
      playCelebrationSound();
      if (!prefersReducedMotion) launchConfetti();
      setTimeout(nextQuestion, BASE_CONFIG2.nextQuestionDelayMs);
      return;
    }
    state.blocked = true;
    state.stats.compareTotal++;
    markCompareChoice(side, "wrong");
    els.feedback.textContent = q.direction === "less" ? "Pick the smaller number! Try again \u{1F4AA}" : "Pick the bigger number! Try again \u{1F4AA}";
    els.feedback.className = "feedback-msg wrong";
    playWrongSound();
    setTimeout(() => {
      state.blocked = false;
      clearCompareChoiceMarks();
      els.feedback.textContent = "";
      els.feedback.className = "feedback-msg";
    }, BASE_CONFIG2.wrongAnswerUnlockDelayMs);
  }
  function renderCompareHints() {
    if (!els.mathCompareHints) return;
    els.mathCompareHints.innerHTML = "";
    const label = document.createElement("span");
    label.className = "compare-hints-label";
    label.textContent = "Hints:";
    els.mathCompareHints.appendChild(label);
    const items = [];
    if (state.mathDifficulty === "hard") {
      items.push({ visual: createHintHundred(), text: "= 100" });
    }
    items.push({ visual: createHintBundle(), text: "= 10" });
    items.push({ visual: createHintStick(), text: "= 1" });
    items.forEach(({ visual, text }) => {
      const item = document.createElement("span");
      item.className = "compare-hint-item";
      item.appendChild(visual);
      const eq = document.createElement("span");
      eq.className = "compare-hint-eq";
      eq.textContent = text;
      item.appendChild(eq);
      els.mathCompareHints.appendChild(item);
    });
  }
  function renderCompareQuestion() {
    const q = state.currentQ;
    if (els.mathArithmeticView) els.mathArithmeticView.hidden = true;
    if (els.mathOrderView) els.mathOrderView.hidden = true;
    if (els.mathCompareView) els.mathCompareView.hidden = false;
    if (els.mathBlank) els.mathBlank.hidden = true;
    if (els.mathOrderBlank) els.mathOrderBlank.hidden = true;
    if (els.mathDisplay) els.mathDisplay.classList.remove("math-display--order");
    if (els.mathDisplay) els.mathDisplay.classList.add("math-display--compare");
    if (els.mathComparePrompt) els.mathComparePrompt.textContent = comparePromptText(q);
    renderCompareHints();
    if (!els.mathComparePair) return;
    els.mathComparePair.innerHTML = "";
    const symbol = compareSymbolBetween(q);
    const parts = [
      { side: "left", value: q.left },
      { side: "right", value: q.right }
    ];
    parts.forEach(({ side, value }, index) => {
      if (index > 0) {
        const sign = document.createElement("span");
        sign.className = "math-compare-symbol";
        sign.textContent = symbol;
        sign.setAttribute("aria-hidden", "true");
        els.mathComparePair.appendChild(sign);
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "math-compare-choice";
      btn.dataset.side = side;
      btn.setAttribute("aria-label", `Number ${value}, ${placeValueLabel(value)}`);
      const num = document.createElement("span");
      num.className = "math-compare-num";
      num.textContent = String(value);
      btn.appendChild(num);
      btn.appendChild(createPlaceValueVisual(value));
      btn.onclick = () => onComparePick(side);
      els.mathComparePair.appendChild(btn);
    });
  }
  function renderArithmeticQuestion() {
    if (els.mathArithmeticView) els.mathArithmeticView.hidden = false;
    if (els.mathOrderView) els.mathOrderView.hidden = true;
    if (els.mathCompareView) els.mathCompareView.hidden = true;
    if (els.mathBlank) els.mathBlank.hidden = false;
    if (els.mathDisplay) els.mathDisplay.classList.remove("math-display--order");
    if (els.mathDisplay) els.mathDisplay.classList.remove("math-display--compare");
    if (els.mathOrderSequence) {
      els.mathOrderSequence.innerHTML = "";
      els.mathOrderSequence.setAttribute("aria-hidden", "true");
    }
    resetMathAnswerBlank();
    els.num1Val.textContent = state.currentQ.a;
    els.opSign.textContent = state.currentQ.type === "sub" ? "\u2212" : "+";
    els.num2Val.textContent = state.currentQ.b;
  }
  function loadQuestion() {
    cancelNumberLineAnimation();
    state.blocked = false;
    state.selectedAnswer = null;
    state.orderAnswers = {};
    state.orderActiveBlankIndex = null;
    state.crossedSet.clear();
    state.placedCount = 0;
    state.addGroup1Count = 0;
    state.addGroup2Count = 0;
    state.keyInputBuffer = "";
    state.currentQ = state.questions[state.qIndex];
    const total = state.mathQuestionCount;
    const orderQ = isOrderQuestion(state.currentQ);
    const compareQ = isCompareQuestion(state.currentQ);
    els.qLabel.textContent = `Question ${state.qIndex + 1} of ${total}`;
    els.progressFill.style.width = `${(state.qIndex + 1) / total * 100}%`;
    els.feedback.textContent = "";
    els.feedback.className = "feedback-msg";
    if (compareQ) {
      renderCompareQuestion();
    } else if (orderQ) {
      state.orderActiveBlankIndex = firstUnfilledBlankIndex(state.currentQ);
      renderOrderQuestion();
    } else {
      renderArithmeticQuestion();
    }
    if (!compareQ) buildNumberPicker();
    if (compareQ || orderQ) {
      if (els.emojiZone) els.emojiZone.style.display = "none";
      hideNumberLine(els.numberLineRoot);
    } else {
      if (els.emojiZone) els.emojiZone.style.display = "";
      buildMathHelperZone();
    }
    updateSubmitState();
  }
  function buildNumberPicker() {
    els.numberPicker.innerHTML = "";
    const q = state.currentQ;
    const nums = isOrderQuestion(q) ? shuffle([...q.choices]) : Array.from({ length: state.maxAnswer + 1 }, (_, i) => i);
    for (const n of nums) {
      const btn = document.createElement("button");
      btn.className = "num-btn";
      btn.type = "button";
      btn.textContent = n;
      btn.setAttribute("aria-label", `Answer ${n}`);
      btn.onclick = () => selectNumber(n, btn);
      els.numberPicker.appendChild(btn);
    }
  }
  function selectNumber(n, btn) {
    if (state.blocked) return;
    const q = state.currentQ;
    if (!isOrderQuestion(q) && state.selectedAnswer === n && btn.classList.contains("selected")) {
      state.selectedAnswer = null;
      if (els.mathBlank) els.mathBlank.textContent = "?";
      btn.classList.remove("selected");
      btn.setAttribute("aria-pressed", "false");
      updateSubmitState();
      playToggleSound2();
      return;
    }
    if (isOrderQuestion(q)) {
      const idx = state.orderActiveBlankIndex;
      if (idx === null) return;
      state.orderAnswers[idx] = n;
      setOrderSlot(idx, n);
      state.orderActiveBlankIndex = firstUnfilledBlankIndex(q);
      document.querySelectorAll(".num-btn").forEach((b) => {
        b.classList.remove("selected");
        b.setAttribute("aria-pressed", "false");
      });
      updateOrderStepHint();
      highlightActiveOrderSlot();
      updateSubmitState();
      playSelectSound();
      return;
    }
    state.selectedAnswer = n;
    if (els.mathBlank) els.mathBlank.textContent = n;
    document.querySelectorAll(".num-btn").forEach((b) => {
      b.classList.remove("selected");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("selected");
    btn.setAttribute("aria-pressed", "true");
    updateSubmitState();
    playSelectSound();
  }
  function buildMathHelperZone() {
    const q = state.currentQ;
    const useLine = usesNumberLineHelper();
    if (useLine) {
      if (els.emojiContent) els.emojiContent.innerHTML = "";
      if (els.emojiZoneTitle) els.emojiZoneTitle.textContent = numberLineTitle(q);
      if (els.subHint) els.subHint.style.display = "none";
      renderNumberLine(els.numberLineRoot, q);
      return;
    }
    hideNumberLine(els.numberLineRoot);
    buildEmojiZone();
  }
  function buildEmojiZone() {
    els.emojiContent.innerHTML = "";
    if (state.currentQ.type === "add") updateAdditionZone();
    else updateSubtractionZone();
  }
  function updateAdditionZone() {
    const goalA = state.currentQ.a;
    const goalB = state.currentQ.b;
    els.emojiZoneTitle.textContent = `First group: ${goalA}. Second group: ${goalB}. Too many? Tap \u2796`;
    els.subHint.style.display = state.hintOn ? "block" : "none";
    els.subHint.textContent = `${state.addGroup1Count} + ${state.addGroup2Count} \u2014 ${goalA} + ${goalB} = ?`;
    els.emojiContent.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "add-builder";
    const createAddCard = (label, target, count, onAdd, onRemove) => {
      const card = document.createElement("div");
      card.className = "add-card";
      const title = document.createElement("div");
      title.className = "add-card-title";
      title.textContent = label;
      const countLabel = document.createElement("div");
      countLabel.className = "add-card-count";
      countLabel.textContent = `${count} / ${target}`;
      const items = document.createElement("div");
      items.className = "add-card-items";
      for (let i = 0; i < count; i++) {
        const e = document.createElement("span");
        e.className = "emoji-item";
        e.textContent = state.emoji;
        items.appendChild(e);
      }
      const controls = document.createElement("div");
      controls.className = "add-card-controls";
      const addBtn = document.createElement("button");
      addBtn.className = "mini-btn";
      addBtn.type = "button";
      addBtn.textContent = "\u2795";
      addBtn.setAttribute("aria-label", `Add one ${state.emoji}`);
      addBtn.disabled = !canAddMoreEmojis(count) || state.blocked;
      addBtn.onclick = onAdd;
      const removeBtn = document.createElement("button");
      removeBtn.className = "mini-btn";
      removeBtn.type = "button";
      removeBtn.textContent = "\u2796";
      removeBtn.setAttribute("aria-label", `Remove one ${state.emoji}`);
      removeBtn.disabled = count <= 0 || state.blocked;
      removeBtn.onclick = onRemove;
      controls.appendChild(removeBtn);
      controls.appendChild(addBtn);
      card.appendChild(title);
      card.appendChild(countLabel);
      card.appendChild(items);
      card.appendChild(controls);
      return card;
    };
    wrap.appendChild(createAddCard("First Number", state.currentQ.a, state.addGroup1Count, () => {
      if (state.blocked || !canAddMoreEmojis(state.addGroup1Count)) return;
      state.addGroup1Count++;
      playAddEmojiSound();
      updateAdditionZone();
    }, () => {
      if (state.blocked || state.addGroup1Count <= 0) return;
      state.addGroup1Count--;
      playToggleSound2();
      updateAdditionZone();
    }));
    const plus = document.createElement("div");
    plus.className = "plus-sign";
    plus.textContent = "+";
    wrap.appendChild(plus);
    wrap.appendChild(createAddCard("Second Number", state.currentQ.b, state.addGroup2Count, () => {
      if (state.blocked || !canAddMoreEmojis(state.addGroup2Count)) return;
      state.addGroup2Count++;
      playAddEmojiSound();
      updateAdditionZone();
    }, () => {
      if (state.blocked || state.addGroup2Count <= 0) return;
      state.addGroup2Count--;
      playToggleSound2();
      updateAdditionZone();
    }));
    els.emojiContent.appendChild(wrap);
  }
  function removeLastSubEmoji() {
    if (state.blocked || state.placedCount <= 0) return;
    const removeIdx = state.placedCount - 1;
    const newCrossed = /* @__PURE__ */ new Set();
    for (const i of state.crossedSet) {
      if (i < removeIdx) newCrossed.add(i);
    }
    state.crossedSet = newCrossed;
    state.placedCount--;
    playToggleSound2();
    updateSubtractionZone();
  }
  function updateSubtractionZone() {
    const takeB = state.currentQ.b;
    const remaining = state.placedCount - state.crossedSet.size;
    if (state.placedCount === 0) {
      els.emojiZoneTitle.textContent = `Add ${state.emoji}s, then cross out ${takeB}. Too many? Tap \u2796`;
    } else {
      els.emojiZoneTitle.textContent = `${state.placedCount} ${state.emoji}s \u2014 cross out ${takeB}. Extra? Tap \u2796`;
    }
    els.subHint.style.display = state.hintOn ? "block" : "none";
    els.subHint.textContent = `${state.placedCount} added - ${state.crossedSet.size} crossed out - ${remaining} left`;
    els.emojiContent.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "sub-grid";
    for (let i = 0; i < state.placedCount; i++) {
      const btn = document.createElement("button");
      btn.className = `sub-animal${state.crossedSet.has(i) ? " crossed" : ""}`;
      btn.type = "button";
      btn.textContent = state.emoji;
      btn.setAttribute("aria-label", state.crossedSet.has(i) ? "Undo cross out" : "Cross out");
      btn.onclick = () => {
        if (state.blocked) return;
        if (state.crossedSet.has(i)) state.crossedSet.delete(i);
        else state.crossedSet.add(i);
        playToggleSound2();
        updateSubtractionZone();
      };
      grid.appendChild(btn);
    }
    els.emojiContent.appendChild(grid);
    const controls = document.createElement("div");
    controls.className = "sub-controls";
    const removeBtn = document.createElement("button");
    removeBtn.className = "add-animal-btn";
    removeBtn.type = "button";
    removeBtn.textContent = "\u2796";
    removeBtn.setAttribute("aria-label", `Remove last ${state.emoji}`);
    removeBtn.disabled = state.placedCount <= 0 || state.blocked;
    removeBtn.onclick = () => removeLastSubEmoji();
    const addBtn = document.createElement("button");
    addBtn.className = "add-animal-btn";
    addBtn.type = "button";
    addBtn.textContent = "\u2795";
    addBtn.setAttribute("aria-label", `Add one ${state.emoji}`);
    addBtn.disabled = !canAddMoreEmojis(state.placedCount) || state.blocked;
    addBtn.onclick = () => {
      if (state.blocked || !canAddMoreEmojis(state.placedCount)) return;
      state.placedCount++;
      playAddEmojiSound();
      updateSubtractionZone();
    };
    controls.appendChild(removeBtn);
    controls.appendChild(addBtn);
    els.emojiContent.appendChild(controls);
  }
  function isOrderAnswerComplete() {
    const q = state.currentQ;
    return q.blankIndices.every((i) => state.orderAnswers[i] !== void 0);
  }
  function isOrderAnswerCorrect() {
    const q = state.currentQ;
    return q.blankIndices.every((i) => state.orderAnswers[i] === q.answers[i]);
  }
  function showOrderCorrectAnswers() {
    const q = state.currentQ;
    q.blankIndices.forEach((i) => setOrderSlot(i, q.answers[i]));
  }
  function resetOrderAnswersForRetry() {
    const q = state.currentQ;
    state.orderAnswers = {};
    state.orderActiveBlankIndex = firstUnfilledBlankIndex(q);
    q.blankIndices.forEach((i) => setOrderSlot(i, null));
    updateOrderStepHint();
    highlightActiveOrderSlot();
  }
  function checkAnswer() {
    if (state.blocked) return;
    const orderQ = isOrderQuestion(state.currentQ);
    if (orderQ && !isOrderAnswerComplete()) {
      const left = orderBlankCount(state.currentQ) - Object.keys(state.orderAnswers).length;
      const msg = left > 1 ? `Fill in all ${orderBlankCount(state.currentQ)} numbers first! \u{1F446}` : "Fill in the missing number first! \u{1F446}";
      els.feedback.textContent = msg;
      els.feedback.className = "feedback-msg wrong";
      playWrongSound();
      return;
    }
    if (!orderQ && state.selectedAnswer === null) {
      els.feedback.textContent = "Pick a number first! \u{1F446}";
      els.feedback.className = "feedback-msg wrong";
      playWrongSound();
      return;
    }
    state.blocked = true;
    updateSubmitState();
    const correct = orderQ ? isOrderAnswerCorrect() : state.selectedAnswer === state.currentQ.ans;
    if (orderQ) state.stats.orderTotal++;
    else if (state.currentQ.type === "add") state.stats.addTotal++;
    else state.stats.subTotal++;
    if (correct) {
      if (orderQ) state.stats.orderCorrect++;
      else if (state.currentQ.type === "add") state.stats.addCorrect++;
      else state.stats.subCorrect++;
      state.score++;
      els.feedback.textContent = ["Amazing! \u{1F389}", "You got it! \u2B50", "Brilliant! \u{1F31F}", "Wonderful! \u{1F388}", "Super smart! \u{1F98B}"][Math.floor(Math.random() * 5)];
      els.feedback.className = "feedback-msg right";
      if (orderQ) showOrderCorrectAnswers();
      else if (els.mathBlank) els.mathBlank.textContent = state.currentQ.ans;
      if (!orderQ) {
        document.querySelectorAll(".emoji-item,.sub-animal:not(.crossed)").forEach((e) => {
          e.style.animation = "none";
          setTimeout(() => {
            e.style.animation = "bounce 0.5s ease";
          }, 10);
        });
      }
      playCelebrationSound();
      if (!prefersReducedMotion) launchConfetti();
      setTimeout(nextQuestion, BASE_CONFIG2.nextQuestionDelayMs);
    } else {
      els.feedback.textContent = "Oops! Try again \u{1F648}";
      els.feedback.className = "feedback-msg wrong";
      els.numberPicker.classList.add("shake");
      playWrongSound();
      setTimeout(() => {
        els.numberPicker.classList.remove("shake");
        state.blocked = false;
        if (orderQ) resetOrderAnswersForRetry();
        document.querySelectorAll(".num-btn").forEach((b) => {
          b.classList.remove("selected");
          b.setAttribute("aria-pressed", "false");
        });
        updateSubmitState();
      }, BASE_CONFIG2.wrongAnswerUnlockDelayMs);
    }
  }
  function nextQuestion() {
    state.qIndex++;
    if (state.qIndex >= state.mathQuestionCount) {
      showEnd();
      return;
    }
    loadQuestion();
  }
  function showEnd() {
    state.activeGame = "math";
    showScreen("end");
    const total = state.mathQuestionCount;
    const stars = starLineForScore(state.score, total);
    const msg = state.score === total ? "PERFECT!" : state.score >= Math.ceil(total * 0.8) ? "Amazing!" : state.score >= Math.ceil(total * 0.5) ? "Great job!" : "Keep going!";
    const best = Math.max(getBestScore(), state.score);
    setBestScore(best);
    const addPct = state.stats.addTotal ? Math.round(state.stats.addCorrect / state.stats.addTotal * 100) : 0;
    const subPct = state.stats.subTotal ? Math.round(state.stats.subCorrect / state.stats.subTotal * 100) : 0;
    const orderPct = state.stats.orderTotal ? Math.round(state.stats.orderCorrect / state.stats.orderTotal * 100) : 0;
    const comparePct = state.stats.compareTotal ? Math.round(state.stats.compareCorrect / state.stats.compareTotal * 100) : 0;
    const statsLine = isCompareMode() ? `Comparing numbers: ${comparePct}%` : isOrderMode() ? `Number order: ${orderPct}%` : `Addition: ${addPct}% \xB7 Subtraction: ${subPct}%`;
    els.endScreen.innerHTML = `
    <div class="end-trophy">\u{1F3C6}</div>
    <div class="end-title">${msg}</div>
    <div class="end-score">${state.score} / ${total}</div>
    <div class="end-stars">${stars}</div>
    <div class="best-score">Best for this level: ${best} / ${total}</div>
    <div class="stats">${statsLine}</div>
    <div class="end-actions">
      <button class="play-again-btn" id="play-again-btn" type="button">Play again \u{1F3AE}</button>
      <button class="secondary-btn" id="change-math-btn" type="button">Change math \u2699\uFE0F</button>
      <button class="secondary-btn" id="home-btn" type="button">Home \u{1F3E0}</button>
    </div>
  `;
    document.getElementById("play-again-btn").onclick = () => startMathRound();
    document.getElementById("change-math-btn").onclick = () => {
      pickRandomBg();
      showScreen("mathSetup");
      syncMathSetupUI();
      if (els.hintToggle) els.hintToggle.style.display = usesNumberLineHelper() ? "none" : "";
      if (els.emojiZone) els.emojiZone.style.display = "";
      syncMathAnswerSection(false);
    };
    document.getElementById("home-btn").onclick = () => {
      state.activeGame = "math";
      requestGoHome();
    };
    if (!prefersReducedMotion) launchConfetti(60);
    if (state.score === total) playSound("endPerfect", playCelebrationSound);
    else playSound("endTryAgain", playWrongSound);
  }
  function updateSubmitState() {
    const orderQ = state.currentQ && isOrderQuestion(state.currentQ);
    const compareQ = state.currentQ && isCompareQuestion(state.currentQ);
    const ready = orderQ ? isOrderAnswerComplete() : state.selectedAnswer !== null;
    if (els.submitBtn) els.submitBtn.disabled = state.blocked || !ready || compareQ;
  }

  // src/math/helper.js
  function safeHomeworkNumber(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(999, Math.trunc(value)));
  }
  function setMathHomeworkOp(op) {
    state.mathHomeworkOp = op === "add" ? "add" : "sub";
    syncMathHomeworkUI();
  }
  function syncMathHomeworkUI() {
    state.mathHomeworkA = safeHomeworkNumber(state.mathHomeworkA);
    state.mathHomeworkB = safeHomeworkNumber(state.mathHomeworkB);
    if (els.homeworkOpAdd) {
      els.homeworkOpAdd.setAttribute("aria-pressed", state.mathHomeworkOp === "add" ? "true" : "false");
    }
    if (els.homeworkOpSub) {
      els.homeworkOpSub.setAttribute("aria-pressed", state.mathHomeworkOp === "sub" ? "true" : "false");
    }
    if (els.homeworkNumA) els.homeworkNumA.textContent = String(state.mathHomeworkA);
    if (els.homeworkNumB) els.homeworkNumB.textContent = String(state.mathHomeworkB);
  }
  function adjustMathHomeworkValue(which, delta) {
    if (which === "a") state.mathHomeworkA = safeHomeworkNumber(state.mathHomeworkA + delta);
    if (which === "b") state.mathHomeworkB = safeHomeworkNumber(state.mathHomeworkB + delta);
    syncMathHomeworkUI();
  }
  function homeworkQuestionFromState() {
    const a = state.mathHomeworkA;
    const b = state.mathHomeworkB;
    if (state.mathHomeworkOp === "sub" && b > a) return null;
    return {
      type: state.mathHomeworkOp,
      a,
      b,
      ans: state.mathHomeworkOp === "add" ? a + b : a - b
    };
  }
  function clearMathHomeworkLine() {
    hideNumberLine(els.homeworkNumberLineRoot);
    if (els.homeworkLineTitle) els.homeworkLineTitle.textContent = "Set your question and tap Open number line";
    if (els.homeworkLineFeedback) els.homeworkLineFeedback.textContent = "";
  }
  function renderMathHomeworkLine() {
    const q = homeworkQuestionFromState();
    if (!q) {
      clearMathHomeworkLine();
      if (els.homeworkLineFeedback) {
        els.homeworkLineFeedback.textContent = "For subtraction, use a bigger first number (like 8 \u2212 5).";
      }
      return;
    }
    state.blocked = false;
    renderNumberLine(els.homeworkNumberLineRoot, q, { wide: true });
    if (els.homeworkLineTitle) els.homeworkLineTitle.textContent = numberLineTitle(q);
    if (els.homeworkLineFeedback) els.homeworkLineFeedback.textContent = "";
  }

  // src/spelling/setup.js
  function syncSpellingSetupUI() {
    const modeMap = {
      phonics: els.spellModePhonics,
      picture: els.spellModePicture,
      arrow: els.spellModeArrow
    };
    Object.values(modeMap).forEach((btn) => {
      if (btn) btn.setAttribute("aria-pressed", "false");
    });
    if (modeMap[state.spellingMode]) modeMap[state.spellingMode].setAttribute("aria-pressed", "true");
    const catMap = {
      cvc: els.spellCatCvc,
      blend: els.spellCatBlend,
      digraph: els.spellCatDigraph,
      mixed: els.spellCatMixed
    };
    Object.values(catMap).forEach((btn) => {
      if (btn) btn.setAttribute("aria-pressed", "false");
    });
    if (catMap[state.spellingCategory]) catMap[state.spellingCategory].setAttribute("aria-pressed", "true");
    const isPhonics = state.spellingMode === "phonics";
    const isArrow = state.spellingMode === "arrow";
    if (els.spellingCatFieldset) els.spellingCatFieldset.hidden = isPhonics || isArrow;
    if (els.spellingSetupHint) {
      if (isPhonics) {
        els.spellingSetupHint.textContent = "Tap any letter to hear its sound (phonics). Try Play A to Z when you are ready!";
      } else if (isArrow) {
        els.spellingSetupHint.textContent = "Look at the colored lines on the board. Pick any start and end letters, hear your word, then submit when you are ready!";
      } else {
        els.spellingSetupHint.textContent = "Each round: tap Hear my letters to hear what you put in the word (left to right), then fix or submit. Letter buttons still play their sound.";
      }
    }
    if (els.spellingStartBtn) {
      if (isPhonics) els.spellingStartBtn.textContent = "Let\u2019s hear letters! \u{1F50A}";
      else if (isArrow) els.spellingStartBtn.textContent = "Let\u2019s find words! \u{1F500}";
      else els.spellingStartBtn.textContent = "Let\u2019s spell! \u270F\uFE0F";
    }
  }
  function setSpellingMode(mode) {
    state.spellingMode = mode;
    syncSpellingSetupUI();
    playSelectSound();
  }
  function setSpellingCategory(cat) {
    state.spellingCategory = cat;
    syncSpellingSetupUI();
    playSelectSound();
  }

  // src/spelling/phonics.js
  function startPhonicsPlay() {
    state.activeGame = "phonics";
    saveSpellingPrefs();
    pickRandomBg();
    state.phonicsPlayGen += 1;
    state.phonicsAlphabetPlaying = false;
    showScreen("phonicsPlay");
    renderPhonicsGrid();
    updatePhonicsPlayAzButton();
  }
  function renderPhonicsGrid() {
    if (!els.phonicsGrid) return;
    els.phonicsGrid.innerHTML = "";
    PHONICS_ALPHABET.forEach((letter) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "phonics-letter";
      btn.textContent = letter.toUpperCase();
      btn.setAttribute("aria-label", `Letter ${letter.toUpperCase()}`);
      btn.disabled = state.phonicsAlphabetPlaying;
      btn.onclick = () => {
        if (state.phonicsAlphabetPlaying) return;
        playPhonicsSound(letter);
      };
      els.phonicsGrid.appendChild(btn);
    });
  }
  function updatePhonicsPlayAzButton() {
    if (!els.phonicsPlayAzBtn) return;
    const off = !state.soundOn;
    els.phonicsPlayAzBtn.disabled = state.phonicsAlphabetPlaying || off;
    els.phonicsPlayAzBtn.setAttribute("aria-disabled", state.phonicsAlphabetPlaying || off ? "true" : "false");
    els.phonicsPlayAzBtn.title = off ? "Turn Sound on to play the alphabet." : state.phonicsAlphabetPlaying ? "Playing A to Z\u2026" : "Hear every letter sound from A to Z";
  }
  async function playPhonicsAlphabet() {
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

  // src/content/spelling-lists.js
  var SPELLING_LISTS = {
    cvc: [
      { w: "sun", e: "\u2600\uFE0F" },
      { w: "cat", e: "\u{1F431}" },
      { w: "dog", e: "\u{1F436}" },
      { w: "hat", e: "\u{1F3A9}" },
      { w: "bed", e: "\u{1F6CF}\uFE0F" },
      { w: "pig", e: "\u{1F437}" },
      { w: "fox", e: "\u{1F98A}" },
      { w: "jam", e: "\u{1F353}" },
      { w: "cup", e: "\u2615" },
      { w: "map", e: "\u{1F5FA}\uFE0F" },
      { w: "pen", e: "\u270F\uFE0F" },
      { w: "log", e: "\u{1FAB5}" },
      { w: "tub", e: "\u{1F6C1}" },
      { w: "wig", e: "\u{1F487}" }
    ],
    blend: [
      { w: "crab", e: "\u{1F980}" },
      { w: "frog", e: "\u{1F438}" },
      { w: "slip", e: "\u{1F9E6}" },
      { w: "drum", e: "\u{1F941}" },
      { w: "plum", e: "\u{1F7E3}" },
      { w: "star", e: "\u2B50" },
      { w: "tree", e: "\u{1F333}" },
      { w: "crib", e: "\u{1F6CF}\uFE0F" },
      { w: "snap", e: "\u{1F4F8}" },
      { w: "swan", e: "\u{1F9A2}" },
      { w: "clip", e: "\u{1F4CE}" },
      { w: "gift", e: "\u{1F381}" },
      { w: "brush", e: "\u{1FAA5}" },
      { w: "clock", e: "\u{1F550}" }
    ],
    digraph: [
      { w: "fish", e: "\u{1F41F}" },
      { w: "ship", e: "\u{1F6A2}" },
      { w: "bath", e: "\u{1F6C1}" },
      { w: "ring", e: "\u{1F48D}" },
      { w: "chop", e: "\u2702\uFE0F" },
      { w: "duck", e: "\u{1F986}" },
      { w: "shell", e: "\u{1F41A}" },
      { w: "moth", e: "\u{1F98B}" },
      { w: "chess", e: "\u265F\uFE0F" },
      { w: "chin", e: "\u{1F60A}" },
      { w: "dash", e: "\u{1F4A8}" },
      { w: "wish", e: "\u{1F320}" },
      { w: "thorn", e: "\u{1F339}" },
      { w: "shark", e: "\u{1F988}" }
    ]
  };

  // src/spelling/picture.js
  function buildRevealMask(word) {
    const L = word.length;
    const mask = new Array(L).fill(false);
    if (L <= 0) return mask;
    mask[0] = true;
    for (let i = 1; i < L; i++) mask[i] = false;
    if (L >= 4) mask[L - 1] = true;
    let hidden = mask.reduce((n, m, i) => n + (!m ? 1 : 0), 0);
    if (hidden === 0) {
      const j = L > 1 ? 1 : 0;
      mask[j] = false;
      hidden = 1;
    }
    return mask;
  }
  function pickSpellingWords() {
    const n = SPELLING_TOTAL;
    let pool = [];
    if (state.spellingCategory === "mixed") {
      const third = Math.floor(n / 3);
      const take = (list, c) => shuffle([...list]).slice(0, c);
      pool = pool.concat(take(SPELLING_LISTS.cvc, third));
      pool = pool.concat(take(SPELLING_LISTS.blend, third));
      pool = pool.concat(take(SPELLING_LISTS.digraph, n - pool.length));
    } else {
      pool = shuffle([...SPELLING_LISTS[state.spellingCategory]]).slice(0, n);
    }
    while (pool.length < n) {
      const fallback = SPELLING_LISTS.cvc[pool.length % SPELLING_LISTS.cvc.length];
      pool.push(fallback);
    }
    return shuffle(pool).slice(0, n);
  }
  function decoyLetters(word) {
    const used = new Set(word.toLowerCase().split(""));
    const decoys = [];
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const candidates = shuffle(alphabet.split("")).filter((c) => !used.has(c));
    for (let i = 0; i < SPELLING_DECOYS && i < candidates.length; i++) decoys.push(candidates[i]);
    return decoys;
  }
  function startSpellingRound() {
    state.activeGame = "spelling";
    saveSpellingPrefs();
    pickRandomBg();
    state.spellingWords = pickSpellingWords();
    state.spellQIndex = 0;
    state.spellScore = 0;
    showScreen("spellingPlay");
    loadSpellQuestion();
  }
  function loadSpellQuestion() {
    state.spellListenGen += 1;
    state.spellBlocked = false;
    state.spellPlacements = {};
    const item = state.spellingWords[state.spellQIndex];
    state.spellWord = item.w.toLowerCase();
    state.spellEmoji = item.e;
    state.spellRevealMask = buildRevealMask(state.spellWord);
    state.spellFilled = state.spellWord.split("").map((ch, i) => state.spellRevealMask[i] ? ch : null);
    const need = [];
    for (let i = 0; i < state.spellWord.length; i++) {
      if (!state.spellRevealMask[i]) need.push(state.spellWord[i]);
    }
    const poolChars = need.concat(decoyLetters(state.spellWord));
    state.spellBank = shuffle(poolChars.map((ch, idx) => ({ id: `b${idx}-${ch}`, ch, used: false })));
    els.spellingQLabel.textContent = `Word ${state.spellQIndex + 1} of ${SPELLING_TOTAL}`;
    els.spellingProgressFill.style.width = `${(state.spellQIndex + 1) / SPELLING_TOTAL * 100}%`;
    els.spellingPrompt.textContent = "What word goes with this picture?";
    els.spellingEmoji.textContent = state.spellEmoji;
    els.spellingFeedback.textContent = "";
    els.spellingFeedback.className = "feedback-msg";
    renderSpellSlots();
    renderSpellBank();
    updateSpellingSubmitState();
    updateSpellingHearButton();
  }
  function renderSpellSlots() {
    els.spellingSlotsRow.innerHTML = "";
    for (let i = 0; i < state.spellWord.length; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "spell-slot";
      const isHint = state.spellRevealMask[i];
      if (isHint) {
        btn.classList.add("spell-slot--hint");
        btn.textContent = state.spellWord[i];
        btn.setAttribute("aria-label", `Letter ${state.spellWord[i]}, tap to hear`);
        const hintCh = state.spellWord[i];
        btn.onclick = () => {
          if (state.spellBlocked) return;
          playAlphaSound(hintCh);
        };
      } else {
        const v = state.spellFilled[i];
        if (v) {
          btn.classList.add("spell-slot--filled");
          btn.textContent = v;
          btn.setAttribute("aria-label", `Your letter ${v}, tap to clear`);
        } else {
          btn.classList.add("spell-slot--blank");
          btn.textContent = "\xB7";
          btn.setAttribute("aria-label", "Empty space");
        }
        const idx = i;
        btn.onclick = () => {
          if (state.spellBlocked) return;
          if (isHint) return;
          if (!state.spellFilled[idx]) return;
          const bid = state.spellPlacements[idx];
          if (bid) {
            const entry = state.spellBank.find((b) => b.id === bid);
            if (entry) entry.used = false;
            delete state.spellPlacements[idx];
          }
          state.spellFilled[idx] = null;
          playToggleSound();
          renderSpellSlots();
          renderSpellBank();
          updateSpellingSubmitState();
        };
      }
      els.spellingSlotsRow.appendChild(btn);
    }
  }
  function renderSpellBank() {
    els.spellingBank.innerHTML = "";
    state.spellBank.forEach((entry) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "spell-bank-letter";
      btn.textContent = entry.ch;
      btn.setAttribute("aria-label", `Letter ${entry.ch}`);
      btn.disabled = entry.used || state.spellBlocked;
      btn.onclick = () => {
        if (state.spellBlocked || entry.used) return;
        playAlphaSound(entry.ch);
        const emptyIdx = state.spellFilled.findIndex((v, i) => !state.spellRevealMask[i] && v === null);
        if (emptyIdx === -1) {
          playWrongSound();
          return;
        }
        state.spellFilled[emptyIdx] = entry.ch;
        entry.used = true;
        state.spellPlacements[emptyIdx] = entry.id;
        renderSpellSlots();
        renderSpellBank();
        updateSpellingSubmitState();
      };
      els.spellingBank.appendChild(btn);
    });
  }
  function spellingWordComplete() {
    return state.spellFilled.every((c, i) => c === state.spellWord[i]);
  }
  function updateSpellingSubmitState() {
    if (!els.spellingSubmitBtn) return;
    const ready = state.spellFilled.every((c) => c !== null && c !== void 0);
    els.spellingSubmitBtn.disabled = state.spellBlocked || !ready;
    updateSpellingHearButton();
  }
  function checkSpellingAnswer() {
    if (state.spellBlocked) return;
    const ready = state.spellFilled.every((c) => c !== null && c !== void 0);
    if (!ready) {
      els.spellingFeedback.textContent = "Fill every space first! \u{1F446}";
      els.spellingFeedback.className = "feedback-msg wrong";
      playWrongSound();
      return;
    }
    state.spellBlocked = true;
    updateSpellingSubmitState();
    const ok = spellingWordComplete();
    if (ok) {
      state.spellScore++;
      els.spellingFeedback.textContent = ["Great spelling! \u{1F389}", "You did it! \u2B50", "Super! \u{1F31F}"][Math.floor(Math.random() * 3)];
      els.spellingFeedback.className = "feedback-msg right";
      playCelebrationSound();
      if (!prefersReducedMotion) launchConfetti();
      setTimeout(nextSpellQuestion, BASE_CONFIG.nextQuestionDelayMs);
    } else {
      els.spellingFeedback.textContent = "Not quite \u2014 try again \u{1F4AA}";
      els.spellingFeedback.className = "feedback-msg wrong";
      els.spellingBank.classList.add("shake");
      playWrongSound();
      setTimeout(() => {
        els.spellingBank.classList.remove("shake");
        state.spellBlocked = false;
        updateSpellingSubmitState();
      }, BASE_CONFIG.wrongAnswerUnlockDelayMs);
    }
  }
  function nextSpellQuestion() {
    state.spellQIndex++;
    if (state.spellQIndex >= SPELLING_TOTAL) {
      showSpellingEnd();
      return;
    }
    loadSpellQuestion();
  }
  function showSpellingEnd() {
    showScreen("end");
    const total = SPELLING_TOTAL;
    const stars = starLineForScore(state.spellScore, total);
    const msg = state.spellScore === total ? "PERFECT!" : state.spellScore >= Math.ceil(total * 0.8) ? "Amazing!" : state.spellScore >= Math.ceil(total * 0.5) ? "Great job!" : "Keep going!";
    const best = Math.max(getSpellingBest(), state.spellScore);
    setSpellingBest(best);
    const catLabel = { cvc: "CVC", blend: "Blends", digraph: "Digraphs", mixed: "Mixed" }[state.spellingCategory] || "";
    els.endScreen.innerHTML = `
    <div class="end-trophy">\u{1F3C6}</div>
    <div class="end-title">${msg}</div>
    <div class="end-score">${state.spellScore} / ${total}</div>
    <div class="end-stars">${stars}</div>
    <div class="best-score">Best (${catLabel}): ${best} / ${total}</div>
    <div class="stats">Spelling round complete \xB7 ${catLabel}</div>
    <div class="end-actions">
      <button class="play-again-btn" id="play-again-btn" type="button">Play again \u{1F3AE}</button>
      <button class="secondary-btn" id="change-spell-btn" type="button">Change spelling \u2699\uFE0F</button>
      <button class="secondary-btn" id="home-btn" type="button">Home \u{1F3E0}</button>
    </div>
  `;
    document.getElementById("play-again-btn").onclick = () => startSpellingRound();
    document.getElementById("change-spell-btn").onclick = () => {
      pickRandomBg();
      showScreen("spellingSetup");
      syncSpellingSetupUI();
    };
    document.getElementById("home-btn").onclick = () => {
      state.activeGame = "math";
      requestGoHome();
    };
    if (!prefersReducedMotion) launchConfetti(60);
    if (state.spellScore === total) playSound("endPerfect", playCelebrationSound);
    else playSound("endTryAgain", playWrongSound);
  }

  // src/content/arrow.js
  var ARROW_CVC_EXTRA = [
    "fan",
    "ram",
    "mat",
    "bag",
    "mad",
    "bat",
    "sap",
    "car",
    "rat",
    "lap",
    "ran",
    "cap",
    "tap",
    "pan",
    "red",
    "hen",
    "net",
    "pet",
    "wet",
    "leg",
    "sit",
    "bin",
    "fin",
    "dig",
    "big",
    "fig",
    "pot",
    "hot",
    "cop",
    "mop",
    "top",
    "pop",
    "bug",
    "hug",
    "mud",
    "bus",
    "cut",
    "nut"
  ];
  var ARROW_COLORS = {
    red: { label: "Red", stroke: "#e53935", light: "#ffcdd2" },
    green: { label: "Green", stroke: "#43a047", light: "#c8e6c9" },
    blue: { label: "Blue", stroke: "#1e88e5", light: "#bbdefb" },
    yellow: { label: "Yellow", stroke: "#f9a825", light: "#fff9c4" },
    black: { label: "Black", stroke: "#424242", light: "#e0e0e0" }
  };
  function getArrowCvcPool() {
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    const add = (w) => {
      const word = w.toLowerCase();
      if (word.length !== 3 || !/^[a-z]{3}$/.test(word) || seen.has(word)) return;
      seen.add(word);
      out.push(word);
    };
    SPELLING_LISTS.cvc.forEach((item) => add(item.w));
    ARROW_CVC_EXTRA.forEach(add);
    return out;
  }
  function groupCvcByVowel(pool) {
    const groups = {};
    pool.forEach((w) => {
      const vowel = w[1];
      if (!groups[vowel]) groups[vowel] = [];
      groups[vowel].push(w);
    });
    return groups;
  }
  function buildArrowPuzzle(center, wordList) {
    const words = wordList.slice(0, ARROW_WORDS_MAX);
    const n = words.length;
    const left = words.map((w) => w[0]);
    const right = new Array(n);
    const perm = shuffle([...Array(n).keys()]);
    perm.forEach((slot, i) => {
      right[slot] = words[i][2];
    });
    const colorOrder = shuffle([...ARROW_COLOR_IDS]);
    const puzzleWords = words.map((w, i) => ({
      w,
      leftIdx: i,
      rightIdx: perm[i],
      color: colorOrder[i % colorOrder.length]
    }));
    const hint = puzzleWords[0];
    return {
      center,
      hintWord: hint.w,
      hintColor: hint.color,
      left,
      right,
      words: puzzleWords
    };
  }
  function buildArrowRound() {
    const groups = groupCvcByVowel(getArrowCvcPool());
    const vowels = shuffle(
      Object.keys(groups).filter((v) => groups[v].length >= ARROW_WORDS_MIN)
    );
    const boards = [];
    const used = /* @__PURE__ */ new Set();
    for (let i = 0; i < ARROW_BOARDS_PER_ROUND; i++) {
      let vowel = vowels[i];
      if (!vowel) {
        vowel = Object.keys(groups).find((v) => groups[v].length >= ARROW_WORDS_MIN);
      }
      if (!vowel) break;
      const maxCount = Math.min(ARROW_WORDS_MAX, groups[vowel].length);
      const count = rnd(ARROW_WORDS_MIN, maxCount);
      const candidates = shuffle([...groups[vowel]]).filter((w) => !used.has(w));
      let picked = candidates.slice(0, count);
      if (picked.length < ARROW_WORDS_MIN) {
        picked = shuffle([...groups[vowel]]).filter((w) => !used.has(w)).slice(0, count);
      }
      if (picked.length < ARROW_WORDS_MIN) continue;
      picked.forEach((w) => used.add(w));
      boards.push(buildArrowPuzzle(vowel, picked));
    }
    while (boards.length < ARROW_BOARDS_PER_ROUND) {
      const avail = shuffle(
        Object.keys(groups).filter((v) => groups[v].length >= ARROW_WORDS_MIN)
      );
      if (!avail.length) break;
      const vowel = avail[0];
      const maxCount = Math.min(ARROW_WORDS_MAX, groups[vowel].length);
      const count = rnd(ARROW_WORDS_MIN, maxCount);
      const picked = shuffle([...groups[vowel]]).filter((w) => !used.has(w)).slice(0, count);
      if (picked.length < ARROW_WORDS_MIN) break;
      picked.forEach((w) => used.add(w));
      boards.push(buildArrowPuzzle(vowel, picked));
    }
    return boards;
  }

  // src/spelling/arrow-helpers.js
  function arrowRoundWordGoal() {
    return state.arrowPuzzles.reduce((n, p) => n + p.words.length, 0);
  }
  function currentArrowPuzzle() {
    return state.arrowPuzzles[state.arrowPuzzleIndex];
  }

  // src/spelling/arrow.js
  function startArrowRound() {
    state.activeGame = "arrow";
    saveSpellingPrefs();
    pickRandomBg();
    state.arrowPuzzles = buildArrowRound();
    state.arrowPuzzleIndex = 0;
    state.arrowScore = 0;
    showScreen("arrowPlay");
    loadArrowPuzzle();
  }
  function clearArrowPicks() {
    state.arrowPickLeftIdx = null;
    state.arrowPickRightIdx = null;
    state.arrowListenGen += 1;
  }
  function arrowPathForPair(leftIdx, rightIdx) {
    const puzzle = currentArrowPuzzle();
    if (!puzzle) return null;
    return puzzle.words.find(
      (entry) => entry.leftIdx === leftIdx && entry.rightIdx === rightIdx
    ) || null;
  }
  function arrowBuiltWord() {
    const puzzle = currentArrowPuzzle();
    if (!puzzle || state.arrowPickLeftIdx === null || state.arrowPickRightIdx === null) return "";
    const left = puzzle.left[state.arrowPickLeftIdx];
    const right = puzzle.right[state.arrowPickRightIdx];
    if (!left || !right) return "";
    return `${left}${puzzle.center}${right}`;
  }
  function findArrowWordMatch() {
    if (state.arrowPickLeftIdx === null || state.arrowPickRightIdx === null) return null;
    const puzzle = currentArrowPuzzle();
    if (!puzzle) return null;
    const entry = arrowPathForPair(state.arrowPickLeftIdx, state.arrowPickRightIdx);
    if (!entry || state.arrowFound.includes(entry.w)) return null;
    return entry.w === arrowBuiltWord() ? entry : null;
  }
  function scheduleArrowPathsRedraw() {
    requestAnimationFrame(() => renderArrowPaths());
  }
  function loadArrowPuzzle() {
    const puzzle = currentArrowPuzzle();
    if (!puzzle) return;
    state.arrowBlocked = false;
    state.arrowFound = [];
    clearArrowPicks();
    const totalBoards = state.arrowPuzzles.length;
    const goal = puzzle.words.length;
    els.arrowQLabel.textContent = `Board ${state.arrowPuzzleIndex + 1} of ${totalBoards}`;
    els.arrowProgressFill.style.width = `${(state.arrowPuzzleIndex + 1) / totalBoards * 100}%`;
    els.arrowPrompt.textContent = `Use the colored lines to find ${goal} words through \u201C${puzzle.center}\u201D!`;
    if (els.arrowExample) {
      els.arrowExample.hidden = true;
      els.arrowExample.textContent = "";
    }
    els.arrowFeedback.textContent = "";
    els.arrowFeedback.className = "feedback-msg";
    renderArrowBoard();
    renderArrowBuilder();
    renderArrowFoundList();
    updateArrowSubmitState();
    updateArrowHearButton();
    scheduleArrowPathsRedraw();
  }
  function renderArrowBoard() {
    if (!els.arrowBoard) return;
    const puzzle = currentArrowPuzzle();
    els.arrowBoard.innerHTML = "";
    const leftCol = document.createElement("div");
    leftCol.className = "arrow-col";
    const leftLabel = document.createElement("span");
    leftLabel.className = "arrow-col-label";
    leftLabel.textContent = "Start";
    leftCol.appendChild(leftLabel);
    puzzle.left.forEach((ch, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "arrow-letter";
      btn.textContent = ch;
      btn.dataset.arrowSide = "left";
      btn.dataset.arrowIdx = String(i);
      btn.setAttribute("aria-label", `Start letter ${ch}`);
      btn.disabled = state.arrowBlocked;
      btn.onclick = () => {
        if (state.arrowBlocked) return;
        state.arrowPickLeftIdx = i;
        playAlphaSound(ch);
        els.arrowFeedback.textContent = "";
        els.arrowFeedback.className = "feedback-msg";
        renderArrowBuilder();
        updateArrowSubmitState();
        updateArrowHearButton();
      };
      leftCol.appendChild(btn);
    });
    const center = document.createElement("div");
    center.className = "arrow-center";
    center.dataset.arrowCenter = "true";
    center.setAttribute("aria-hidden", "true");
    center.textContent = puzzle.center;
    const rightCol = document.createElement("div");
    rightCol.className = "arrow-col";
    const rightLabel = document.createElement("span");
    rightLabel.className = "arrow-col-label";
    rightLabel.textContent = "End";
    rightCol.appendChild(rightLabel);
    puzzle.right.forEach((ch, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "arrow-letter";
      btn.textContent = ch;
      btn.dataset.arrowSide = "right";
      btn.dataset.arrowIdx = String(i);
      btn.setAttribute("aria-label", `End letter ${ch}`);
      btn.disabled = state.arrowBlocked;
      btn.onclick = () => {
        if (state.arrowBlocked) return;
        state.arrowPickRightIdx = i;
        playAlphaSound(ch);
        els.arrowFeedback.textContent = "";
        els.arrowFeedback.className = "feedback-msg";
        renderArrowBuilder();
        updateArrowSubmitState();
        updateArrowHearButton();
      };
      rightCol.appendChild(btn);
    });
    els.arrowBoard.appendChild(leftCol);
    els.arrowBoard.appendChild(center);
    els.arrowBoard.appendChild(rightCol);
    scheduleArrowPathsRedraw();
  }
  function renderArrowPaths() {
    const svg = els.arrowPathsSvg;
    const stage = els.arrowBoardStage;
    const board = els.arrowBoard;
    if (!svg || !stage || !board) return;
    const puzzle = currentArrowPuzzle();
    const stageRect = stage.getBoundingClientRect();
    if (stageRect.width < 1 || stageRect.height < 1) return;
    svg.setAttribute("width", String(stageRect.width));
    svg.setAttribute("height", String(stageRect.height));
    svg.setAttribute("viewBox", `0 0 ${stageRect.width} ${stageRect.height}`);
    svg.innerHTML = "";
    const centerEl = board.querySelector("[data-arrow-center]");
    if (!centerEl) return;
    const pointFor = (el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - stageRect.left,
        y: r.top + r.height / 2 - stageRect.top
      };
    };
    const centerPt = pointFor(centerEl);
    puzzle.words.forEach((entry) => {
      const leftEl = board.querySelector(`[data-arrow-side="left"][data-arrow-idx="${entry.leftIdx}"]`);
      const rightEl = board.querySelector(`[data-arrow-side="right"][data-arrow-idx="${entry.rightIdx}"]`);
      if (!leftEl || !rightEl) return;
      const meta = ARROW_COLORS[entry.color] || ARROW_COLORS.black;
      const found = state.arrowFound.includes(entry.w);
      const leftPt = pointFor(leftEl);
      const rightPt = pointFor(rightEl);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const c1x = (leftPt.x + centerPt.x) / 2;
      const c2x = (centerPt.x + rightPt.x) / 2;
      const d = `M ${leftPt.x} ${leftPt.y} Q ${c1x} ${leftPt.y}, ${centerPt.x} ${centerPt.y} Q ${c2x} ${rightPt.y}, ${rightPt.x} ${rightPt.y}`;
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", meta.stroke);
      path.setAttribute("stroke-width", found ? "2.5" : "3.5");
      path.setAttribute("stroke-opacity", found ? "0.3" : "0.8");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      if (found) path.classList.add("arrow-path--found");
      svg.appendChild(path);
    });
  }
  function renderArrowBuilder() {
    if (!els.arrowBuilderSlots) return;
    const puzzle = currentArrowPuzzle();
    const leftCh = state.arrowPickLeftIdx !== null ? puzzle.left[state.arrowPickLeftIdx] : null;
    const rightCh = state.arrowPickRightIdx !== null ? puzzle.right[state.arrowPickRightIdx] : null;
    els.arrowBuilderSlots.innerHTML = "";
    const parts = [
      { ch: leftCh, label: "first letter" },
      { ch: puzzle.center, label: "middle letter", center: true },
      { ch: rightCh, label: "last letter" }
    ];
    parts.forEach((part) => {
      const slot = document.createElement("span");
      slot.className = "arrow-build-slot";
      if (part.center) slot.classList.add("arrow-build-slot--center");
      if (part.ch) {
        slot.classList.add("arrow-build-slot--filled");
        slot.textContent = part.ch;
        slot.setAttribute("aria-label", part.label + " " + part.ch);
      } else {
        slot.classList.add("arrow-build-slot--blank");
        slot.textContent = "\xB7";
        slot.setAttribute("aria-label", "Empty " + part.label);
      }
      els.arrowBuilderSlots.appendChild(slot);
    });
  }
  function renderArrowFoundList() {
    if (!els.arrowFoundList) return;
    els.arrowFoundList.innerHTML = "";
    const puzzle = currentArrowPuzzle();
    const goal = puzzle.words.length;
    if (state.arrowFound.length === 0) {
      const li = document.createElement("li");
      li.className = "arrow-found-empty";
      li.textContent = `Your words will show up here (0 / ${goal})`;
      els.arrowFoundList.appendChild(li);
      return;
    }
    state.arrowFound.forEach((w) => {
      const li = document.createElement("li");
      li.textContent = w;
      els.arrowFoundList.appendChild(li);
    });
  }
  function updateArrowSubmitState() {
    if (!els.arrowSubmitBtn) return;
    const ready = state.arrowPickLeftIdx !== null && state.arrowPickRightIdx !== null;
    els.arrowSubmitBtn.disabled = state.arrowBlocked || !ready;
    updateArrowHearButton();
  }
  function getArrowSoundsInOrder() {
    const puzzle = currentArrowPuzzle();
    if (!puzzle) return [];
    const out = [];
    if (state.arrowPickLeftIdx !== null) out.push(puzzle.left[state.arrowPickLeftIdx]);
    out.push(puzzle.center);
    if (state.arrowPickRightIdx !== null) out.push(puzzle.right[state.arrowPickRightIdx]);
    return out.filter(Boolean);
  }
  function updateArrowHearButton() {
    if (!els.arrowHearWordBtn) return;
    const busy = state.arrowListenPlaying;
    const off = !state.soundOn;
    const seq = getArrowSoundsInOrder();
    const canPlay = seq.length >= 3;
    els.arrowHearWordBtn.disabled = busy || off || !canPlay;
    els.arrowHearWordBtn.setAttribute("aria-disabled", busy || off || !canPlay ? "true" : "false");
    els.arrowHearWordBtn.title = off ? "Turn Sound on in the corner to use this step." : canPlay ? `Plays: ${seq.join(" ").toUpperCase()}` : "Trace a colored path first (start and end).";
    els.arrowHearWordBtn.setAttribute(
      "aria-label",
      state.arrowListenPlaying ? "Playing your word" : canPlay ? "Listen to the letters in your word" : "Trace a colored path before listening"
    );
  }
  async function playArrowWordLetterByLetter() {
    if (!state.soundOn || state.arrowListenPlaying) return;
    const toPlay = getArrowSoundsInOrder();
    if (toPlay.length < 2) return;
    const genAtStart = state.arrowListenGen;
    state.arrowListenPlaying = true;
    updateArrowHearButton();
    try {
      for (let i = 0; i < toPlay.length; i++) {
        if (state.arrowListenGen !== genAtStart) return;
        if (!state.soundOn) break;
        await playAlphaSoundAndWait(toPlay[i]);
        if (state.arrowListenGen !== genAtStart) return;
        if (i < toPlay.length - 1) await new Promise((r) => setTimeout(r, 90));
      }
    } finally {
      state.arrowListenPlaying = false;
      updateArrowHearButton();
    }
  }
  function checkArrowAnswer() {
    if (state.arrowBlocked) return;
    if (state.arrowPickLeftIdx === null || state.arrowPickRightIdx === null) {
      els.arrowFeedback.textContent = "Pick a start letter and an end letter, then submit! \u{1F446}";
      els.arrowFeedback.className = "feedback-msg wrong";
      playWrongSound();
      return;
    }
    const word = arrowBuiltWord();
    const puzzle = currentArrowPuzzle();
    state.arrowBlocked = true;
    updateArrowSubmitState();
    if (state.arrowFound.includes(word)) {
      els.arrowFeedback.textContent = "You found that word already \u2014 try another! \u{1F4A1}";
      els.arrowFeedback.className = "feedback-msg wrong";
      playWrongSound();
      setTimeout(() => {
        state.arrowBlocked = false;
        clearArrowPicks();
        renderArrowBoard();
        renderArrowBuilder();
        updateArrowSubmitState();
        scheduleArrowPathsRedraw();
      }, BASE_CONFIG2.wrongAnswerUnlockDelayMs);
      return;
    }
    const match = findArrowWordMatch();
    if (!match) {
      els.arrowFeedback.textContent = "Not a word on this board \u2014 try again! \u{1F4AA}";
      els.arrowFeedback.className = "feedback-msg wrong";
      if (els.arrowBoardStage) els.arrowBoardStage.classList.add("shake");
      playWrongSound();
      setTimeout(() => {
        if (els.arrowBoardStage) els.arrowBoardStage.classList.remove("shake");
        state.arrowBlocked = false;
        renderArrowBoard();
        updateArrowSubmitState();
      }, BASE_CONFIG2.wrongAnswerUnlockDelayMs);
      return;
    }
    state.arrowFound.push(word);
    state.arrowScore++;
    els.arrowFeedback.textContent = ["Yes! " + word + "! \u{1F389}", "You traced " + word + "! \u2B50", "Great word! \u{1F31F}"][Math.floor(Math.random() * 3)];
    els.arrowFeedback.className = "feedback-msg right";
    playCelebrationSound();
    if (!prefersReducedMotion) launchConfetti();
    renderArrowFoundList();
    clearArrowPicks();
    state.arrowBlocked = false;
    renderArrowBoard();
    renderArrowBuilder();
    updateArrowSubmitState();
    scheduleArrowPathsRedraw();
    if (state.arrowFound.length >= puzzle.words.length) {
      setTimeout(nextArrowPuzzle, BASE_CONFIG2.nextQuestionDelayMs);
      return;
    }
  }
  function nextArrowPuzzle() {
    state.arrowPuzzleIndex++;
    if (state.arrowPuzzleIndex >= state.arrowPuzzles.length) {
      showArrowEnd();
      return;
    }
    loadArrowPuzzle();
  }
  function showArrowEnd() {
    showScreen("end");
    const total = arrowRoundWordGoal();
    const stars = starLineForScore(state.arrowScore, total);
    const msg = state.arrowScore === total ? "PERFECT!" : state.arrowScore >= Math.ceil(total * 0.8) ? "Amazing!" : state.arrowScore >= Math.ceil(total * 0.5) ? "Great job!" : "Keep going!";
    const best = Math.max(getSpellingBest(), state.arrowScore);
    setSpellingBest(best);
    els.endScreen.innerHTML = `
    <div class="end-trophy">\u{1F3C6}</div>
    <div class="end-title">${msg}</div>
    <div class="end-score">${state.arrowScore} / ${total}</div>
    <div class="end-stars">${stars}</div>
    <div class="best-score">Best (Arrow words): ${best} / ${total}</div>
    <div class="stats">Arrow words round complete</div>
    <div class="end-actions">
      <button class="play-again-btn" id="play-again-btn" type="button">Play again \u{1F3AE}</button>
      <button class="secondary-btn" id="change-spell-btn" type="button">Change spelling \u2699\uFE0F</button>
      <button class="secondary-btn" id="home-btn" type="button">Home \u{1F3E0}</button>
    </div>
  `;
    document.getElementById("play-again-btn").onclick = () => startArrowRound();
    document.getElementById("change-spell-btn").onclick = () => {
      pickRandomBg();
      showScreen("spellingSetup");
      syncSpellingSetupUI();
    };
    document.getElementById("home-btn").onclick = () => {
      state.activeGame = "math";
      requestGoHome();
    };
    if (!prefersReducedMotion) launchConfetti(60);
    if (state.arrowScore === total) playSound("endPerfect", playCelebrationSound);
    else playSound("endTryAgain", playWrongSound);
  }

  // src/bootstrap.js
  var SETUP_PICK_GUARD_MS = 450;
  var lastMathSetupPickAt = 0;
  function wireMathSetupPick(btn, handler) {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      lastMathSetupPickAt = Date.now();
      handler();
    });
  }
  function wireInteractionGuards() {
    const root = els.app;
    if (!root) return;
    root.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    root.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });
    root.addEventListener("selectstart", (e) => {
      e.preventDefault();
    });
  }
  function wireApp() {
    wireInteractionGuards();
    els.pickMath.addEventListener("click", () => {
      playSelectSound();
      pickRandomBg();
      state.activeGame = "math";
      showScreen("mathSetup");
      syncMathSetupUI();
    });
    if (els.pickSpelling) {
      els.pickSpelling.addEventListener("click", () => {
        playSelectSound();
        pickRandomBg();
        loadSpellingPrefs();
        syncSpellingSetupUI();
        showScreen("spellingSetup");
      });
    }
    if (els.pickMeasure) {
      els.pickMeasure.addEventListener("click", () => {
        playSelectSound();
        pickRandomBg();
        loadMeasurePrefs();
        syncMeasureSetupUI();
        showScreen("measureSetup");
      });
    }
    if (els.pickBigwords) {
      els.pickBigwords.addEventListener("click", () => {
        playSelectSound();
        pickRandomBg();
        loadBigwordsPrefs();
        syncBigwordsSetupUI();
        showScreen("bigwordsSetup");
      });
    }
    if (els.bigwordsBackBtn) {
      els.bigwordsBackBtn.addEventListener("click", () => {
        playToggleSound2();
        requestGoHome();
      });
    }
    if (els.bigwordsStartBtn) {
      els.bigwordsStartBtn.addEventListener("click", () => {
        playSubmitSound();
        startBigwordsRound();
      });
    }
    if (els.bigwordsDiffEasy) els.bigwordsDiffEasy.addEventListener("click", () => setBigwordsDifficulty("easy"));
    if (els.bigwordsDiffMedium) els.bigwordsDiffMedium.addEventListener("click", () => setBigwordsDifficulty("medium"));
    if (els.bigwordsDiffHard) els.bigwordsDiffHard.addEventListener("click", () => setBigwordsDifficulty("hard"));
    if (els.bigwordsRepeatBtn) {
      els.bigwordsRepeatBtn.addEventListener("click", () => {
        repeatBigword();
      });
    }
    if (els.bigwordsNextBtn) {
      els.bigwordsNextBtn.addEventListener("click", () => {
        playSubmitSound();
        nextBigword();
      });
    }
    if (els.measureBackBtn) {
      els.measureBackBtn.addEventListener("click", () => {
        playToggleSound2();
        requestGoHome();
      });
    }
    if (els.measureStartBtn) {
      els.measureStartBtn.addEventListener("click", () => {
        playSubmitSound();
        startMeasureRound();
      });
    }
    if (els.measureModeMixed) els.measureModeMixed.addEventListener("click", () => setMeasureMode("mixed"));
    if (els.measureModeHeavier) els.measureModeHeavier.addEventListener("click", () => setMeasureMode("heavier"));
    if (els.measureModeLighter) els.measureModeLighter.addEventListener("click", () => setMeasureMode("lighter"));
    if (els.measureModePresents) els.measureModePresents.addEventListener("click", () => setMeasureMode("presents"));
    if (els.spellingBackBtn) {
      els.spellingBackBtn.addEventListener("click", () => {
        playToggleSound2();
        requestGoHome();
      });
    }
    if (els.spellingStartBtn) {
      els.spellingStartBtn.addEventListener("click", () => {
        playSubmitSound();
        if (state.spellingMode === "phonics") startPhonicsPlay();
        else if (state.spellingMode === "arrow") startArrowRound();
        else startSpellingRound();
      });
    }
    if (els.spellModePhonics) els.spellModePhonics.addEventListener("click", () => setSpellingMode("phonics"));
    if (els.spellModePicture) els.spellModePicture.addEventListener("click", () => setSpellingMode("picture"));
    if (els.spellModeArrow) els.spellModeArrow.addEventListener("click", () => setSpellingMode("arrow"));
    if (els.spellCatCvc) els.spellCatCvc.addEventListener("click", () => setSpellingCategory("cvc"));
    if (els.spellCatBlend) els.spellCatBlend.addEventListener("click", () => setSpellingCategory("blend"));
    if (els.spellCatDigraph) els.spellCatDigraph.addEventListener("click", () => setSpellingCategory("digraph"));
    if (els.spellCatMixed) els.spellCatMixed.addEventListener("click", () => setSpellingCategory("mixed"));
    if (els.spellingSubmitBtn) {
      els.spellingSubmitBtn.addEventListener("click", () => {
        playSubmitSound();
        checkSpellingAnswer();
      });
    }
    if (els.spellingHearWordBtn) {
      els.spellingHearWordBtn.addEventListener("click", () => {
        playSpellWordLetterByLetter();
      });
    }
    els.mathBackBtn.addEventListener("click", () => {
      playToggleSound2();
      requestGoHome();
    });
    if (els.mathHomeworkBtn) {
      els.mathHomeworkBtn.addEventListener("click", () => {
        playSelectSound();
        clearMathHomeworkLine();
        syncMathHomeworkUI();
        showScreen("mathHelper");
      });
    }
    if (els.homeworkBackBtn) {
      els.homeworkBackBtn.addEventListener("click", () => {
        playToggleSound2();
        clearMathHomeworkLine();
        showScreen("mathSetup");
        syncMathSetupUI();
      });
    }
    if (els.homeworkOpAdd) els.homeworkOpAdd.addEventListener("click", () => setMathHomeworkOp("add"));
    if (els.homeworkOpSub) els.homeworkOpSub.addEventListener("click", () => setMathHomeworkOp("sub"));
    if (els.homeworkAMinus10) els.homeworkAMinus10.addEventListener("click", () => adjustMathHomeworkValue("a", -10));
    if (els.homeworkAMinus1) els.homeworkAMinus1.addEventListener("click", () => adjustMathHomeworkValue("a", -1));
    if (els.homeworkAPlus1) els.homeworkAPlus1.addEventListener("click", () => adjustMathHomeworkValue("a", 1));
    if (els.homeworkAPlus10) els.homeworkAPlus10.addEventListener("click", () => adjustMathHomeworkValue("a", 10));
    if (els.homeworkBMinus10) els.homeworkBMinus10.addEventListener("click", () => adjustMathHomeworkValue("b", -10));
    if (els.homeworkBMinus1) els.homeworkBMinus1.addEventListener("click", () => adjustMathHomeworkValue("b", -1));
    if (els.homeworkBPlus1) els.homeworkBPlus1.addEventListener("click", () => adjustMathHomeworkValue("b", 1));
    if (els.homeworkBPlus10) els.homeworkBPlus10.addEventListener("click", () => adjustMathHomeworkValue("b", 10));
    if (els.homeworkOpenBtn) els.homeworkOpenBtn.addEventListener("click", () => renderMathHomeworkLine());
    if (els.homeworkClearBtn) els.homeworkClearBtn.addEventListener("click", () => clearMathHomeworkLine());
    if (els.appNavHome) {
      els.appNavHome.addEventListener("click", () => requestGoHome());
    }
    els.mathStartBtn.addEventListener("click", (e) => {
      if (getCurrentRoute() !== "mathSetup") return;
      if (Date.now() - lastMathSetupPickAt < SETUP_PICK_GUARD_MS) {
        e.preventDefault();
        return;
      }
      playSubmitSound();
      startMathRound();
    });
    wireMathSetupPick(els.modeMixed, () => setMathMode("mixed"));
    wireMathSetupPick(els.modeAdd, () => setMathMode("add"));
    wireMathSetupPick(els.modeSub, () => setMathMode("sub"));
    wireMathSetupPick(els.modeBeforeAfter, () => setMathMode("beforeAfter"));
    wireMathSetupPick(els.modeBetween, () => setMathMode("between"));
    wireMathSetupPick(els.modeLessThan, () => setMathMode("lessThan"));
    wireMathSetupPick(els.modeGreaterThan, () => setMathMode("greaterThan"));
    wireMathSetupPick(els.modeCompareMixed, () => setMathMode("compareMixed"));
    wireMathSetupPick(els.diffEasy, () => setMathDifficulty("easy"));
    wireMathSetupPick(els.diffMedium, () => setMathDifficulty("medium"));
    wireMathSetupPick(els.diffHard, () => setMathDifficulty("hard"));
    wireMathSetupPick(els.mathCount10, () => setMathQuestionCount(10));
    wireMathSetupPick(els.mathCount15, () => setMathQuestionCount(15));
    wireMathSetupPick(els.mathCount20, () => setMathQuestionCount(20));
    wireMathSetupPick(els.mathHelperEmoji, () => setMathHelper("emoji"));
    wireMathSetupPick(els.mathHelperNumberline, () => setMathHelper("numberline"));
    els.submitBtn.addEventListener("click", () => {
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
      if (state.soundOn) playToggleSound2();
    }
    els.soundToggle.addEventListener("click", onSoundToggleClick);
    if (els.spellingSoundToggle) els.spellingSoundToggle.addEventListener("click", onSoundToggleClick);
    if (els.phonicsSoundToggle) els.phonicsSoundToggle.addEventListener("click", onSoundToggleClick);
    if (els.arrowSoundToggle) els.arrowSoundToggle.addEventListener("click", onSoundToggleClick);
    if (els.measureSoundToggle) els.measureSoundToggle.addEventListener("click", onSoundToggleClick);
    if (els.bigwordsSoundToggle) els.bigwordsSoundToggle.addEventListener("click", onSoundToggleClick);
    if (els.phonicsPlayAzBtn) {
      els.phonicsPlayAzBtn.addEventListener("click", () => {
        playPhonicsAlphabet();
      });
    }
    if (els.arrowSubmitBtn) {
      els.arrowSubmitBtn.addEventListener("click", () => {
        playSubmitSound();
        checkArrowAnswer();
      });
    }
    if (els.arrowHearWordBtn) {
      els.arrowHearWordBtn.addEventListener("click", () => {
        playArrowWordLetterByLetter();
      });
    }
    els.hintToggle.addEventListener("click", () => {
      state.hintOn = !state.hintOn;
      updateHintToggle();
      if (state.soundOn) playToggleSound2();
      if (state.currentQ && !isOrderQuestion(state.currentQ) && !isCompareQuestion(state.currentQ)) {
        if (usesNumberLineHelper()) buildMathHelperZone();
        else if (state.currentQ.type === "add") updateAdditionZone();
        else updateSubtractionZone();
      }
    });
    document.addEventListener("keydown", (e) => {
      var _a;
      if (isTypingTarget(e.target)) return;
      if (state.activeGame === "bigwords" && ((_a = els.bigwordsPlayScreen) == null ? void 0 : _a.style.display) !== "none") {
        if (e.key === "Enter") {
          e.preventDefault();
          playSubmitSound();
          nextBigword();
          return;
        }
        if (e.key === "r" || e.key === "R") {
          e.preventDefault();
          repeatBigword();
          return;
        }
        return;
      }
      if (state.activeGame !== "math") return;
      if (getCurrentRoute() !== "play") return;
      if (isTypingTarget(e.target)) return;
      if (e.key === "Enter") {
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
          state.keyInputBuffer = "";
        }, BASE_CONFIG2.keyBufferResetMs);
        let n = Number(state.keyInputBuffer);
        const maxKey = state.maxPickerValue;
        if (n > maxKey) {
          state.keyInputBuffer = e.key;
          n = Number(state.keyInputBuffer);
        }
        if (n <= maxKey) {
          const btn = [...document.querySelectorAll(".num-btn")].find((b) => Number(b.textContent) === n);
          if (btn) selectNumber(n, btn);
        }
      }
    });
    let arrowResizeTimer = null;
    window.addEventListener("resize", () => {
      if (getCurrentRoute() !== "arrowPlay") return;
      if (arrowResizeTimer) clearTimeout(arrowResizeTimer);
      arrowResizeTimer = setTimeout(() => scheduleArrowPathsRedraw(), 120);
    });
  }
  function initApp() {
    initSoundFx();
    initAlphaSounds();
    initPhonicsSounds();
    loadMathPrefs();
    loadSpellingPrefs();
    loadMeasurePrefs();
    loadBigwordsPrefs();
    syncMathSetupUI();
    syncMathHomeworkUI();
    syncSpellingSetupUI();
    syncMeasureSetupUI();
    syncBigwordsSetupUI();
    updateSoundToggle();
    updateHintToggle();
    updateSpellingHearButton();
    updateArrowHearButton();
    updatePhonicsPlayAzButton();
    updateBigwordsHearButtons();
    state.activeGame = "math";
    pickRandomBg();
    showScreen("home");
  }

  // src/main.js
  wireApp();
  initApp();
})();
