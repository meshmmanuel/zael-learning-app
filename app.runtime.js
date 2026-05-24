(() => {
  const BASE_CONFIG = {
    totalQuestions: 10,
    mixedHalf: 5,
    nextQuestionDelayMs: 1800,
    wrongAnswerUnlockDelayMs: 500,
    keyBufferResetMs: 700,
    confettiLifetimeMs: 3000,
    confettiStaggerMs: 40,
  };

  const DIFFICULTY_PRESETS = {
    easy: {
      additionRange: { min: 1, max: 5 },
      subtractionMinA: 3,
      subtractionMaxA: 8,
    },
    medium: {
      additionRange: { min: 1, max: 9 },
      subtractionMinA: 3,
      subtractionMaxA: 12,
    },
    hard: {
      additionRange: { min: 1, max: 12 },
      subtractionMinA: 4,
      subtractionMaxA: 15,
    },
  };

  const ORDER_RANGES = {
    easy: { min: 10, max: 30 },
    medium: { min: 30, max: 80 },
    hard: { min: 20, max: 99 },
  };

  /** Consecutive number-line layouts: more blanks on medium/hard, not just bigger numbers. */
  const ORDER_LAYOUT = {
    easy: {
      beforeAfter: { length: 3, shownIndices: [1] },
      between: { length: 3, shownIndices: [0, 2] },
    },
    medium: {
      beforeAfter: { length: 5, shownIndices: [1, 3] },
      between: { length: 5, shownIndices: [0, 4] },
    },
    hard: {
      beforeAfter: { length: 7, shownIndices: [2, 4] },
      between: { length: 7, shownIndices: [0, 6] },
    },
  };

  const MATH_MODES_ARITH = ['mixed', 'add', 'sub'];
  const MATH_MODES_ORDER = ['beforeAfter', 'between'];
  const MATH_MODES_ALL = [...MATH_MODES_ARITH, ...MATH_MODES_ORDER];

  const THEMES = [
    { name: 'fruits', emojis: ['🍎', '🍋', '🍇'] },
    { name: 'animals', emojis: ['🐸', '🐶', '🐱'] },
    { name: 'space', emojis: ['🚀', '⭐', '🪐'] },
    { name: 'ocean', emojis: ['🐠', '🐙', '🦀'] },
    { name: 'jungle', emojis: ['🦁', '🐘', '🦒'] },
  ];

  const PASTELS = ['#FFD6D6', '#FFE4C4', '#FFFACD', '#D4F1C0', '#C8E6FF', '#E8D5FF', '#FFD6F0', '#D6FFF6'];
  const SOUND_FILES = {
    select: 'audio/click.mp3',
    wrong: 'audio/incorrect.mp3',
    correct: 'audio/correct.mp3',
    celebration: 'audio/celebration.mp3',
    endPerfect: 'audio/congratulations.mp3',
    endTryAgain: 'audio/try-again.mp3',
    addEmoji: 'audio/add.mp3',
    toggle: 'audio/toggle.mp3',
    submit: 'audio/submit.mp3',
  };

  const ALPHA_SOUND_DIR = 'audio/alphasounds/';
  const ALPHA_SOUND_SRC = (() => {
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

  const PHONICS_SOUND_SRC = {
    a: 'audio/phonics_audio/Short_Vowel/a-apple.mp3',
    e: 'audio/phonics_audio/Short_Vowel/e-elephant.mp3',
    i: 'audio/phonics_audio/Short_Vowel/i-igloo.mp3',
    o: 'audio/phonics_audio/Short_Vowel/o-octopus.mp3',
    u: 'audio/phonics_audio/Short_Vowel/u-up.mp3',
    b: 'audio/phonics_audio/Consonant/b-bat.mp3',
    c: 'audio/phonics_audio/Consonant/c-cut.mp3',
    d: 'audio/phonics_audio/Consonant/d-dip.mp3',
    f: 'audio/phonics_audio/Consonant/f-fun.mp3',
    g: 'audio/phonics_audio/Consonant/g-get.mp3',
    h: 'audio/phonics_audio/Consonant/h-hat.mp3',
    j: 'audio/phonics_audio/Consonant/j-jog.mp3',
    k: 'audio/phonics_audio/Consonant/k-kit.mp3',
    l: 'audio/phonics_audio/Consonant/l-lip.mp3',
    m: 'audio/phonics_audio/Consonant/m-mug.mp3',
    n: 'audio/phonics_audio/Consonant/n-nap.mp3',
    p: 'audio/phonics_audio/Consonant/p-pick.mp3',
    q: 'audio/phonics_audio/Consonant/qu-quest.mp3',
    r: 'audio/phonics_audio/Consonant/r-rid.mp3',
    s: 'audio/phonics_audio/Consonant/s-sit-mess.mp3',
    t: 'audio/phonics_audio/Consonant/t-tuck.mp3',
    v: 'audio/phonics_audio/Consonant/v-van.mp3',
    w: 'audio/phonics_audio/Consonant/w-will.mp3',
    x: 'audio/phonics_audio/Consonant/x-mix-rocks.mp3',
    y: 'audio/phonics_audio/Consonant/y-yes.mp3',
    z: 'audio/phonics_audio/Consonant/z-zip-buzz.mp3',
  };

  const PHONICS_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const STORAGE = { mathPrefs: 'kidsAppV1MathPrefs', spellingPrefs: 'kidsAppV1SpellingPrefs' };
  const LEGACY_BEST_KEY = 'kidsMathV3BestScore';

  const SPELLING_TOTAL = 10;
  const SPELLING_DECOYS = 2;

  const ARROW_COLOR_IDS = ['red', 'green', 'blue', 'yellow', 'black'];
  const ARROW_BOARDS_PER_ROUND = 3;
  const ARROW_WORDS_MIN = 4;
  const ARROW_WORDS_MAX = 5;

  const ARROW_CVC_EXTRA = [
    'fan', 'ram', 'mat', 'bag', 'mad', 'bat', 'sap', 'car', 'rat', 'lap', 'ran', 'cap', 'tap', 'pan',
    'red', 'hen', 'net', 'pet', 'wet', 'leg',
    'sit', 'bin', 'fin', 'dig', 'big', 'fig',
    'pot', 'hot', 'cop', 'mop', 'top', 'pop',
    'bug', 'hug', 'mud', 'bus', 'cut', 'nut',
  ];

  const ARROW_COLORS = {
    red: { label: 'Red', stroke: '#e53935', light: '#ffcdd2' },
    green: { label: 'Green', stroke: '#43a047', light: '#c8e6c9' },
    blue: { label: 'Blue', stroke: '#1e88e5', light: '#bbdefb' },
    yellow: { label: 'Yellow', stroke: '#f9a825', light: '#fff9c4' },
    black: { label: 'Black', stroke: '#424242', light: '#e0e0e0' },
  };

  function getArrowCvcPool() {
    const seen = new Set();
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
      color: colorOrder[i % colorOrder.length],
    }));
    const hint = puzzleWords[0];
    return {
      center,
      hintWord: hint.w,
      hintColor: hint.color,
      left,
      right,
      words: puzzleWords,
    };
  }

  function buildArrowRound() {
    const groups = groupCvcByVowel(getArrowCvcPool());
    const vowels = shuffle(
      Object.keys(groups).filter((v) => groups[v].length >= ARROW_WORDS_MIN)
    );
    const boards = [];
    const used = new Set();

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

  const SPELLING_LISTS = {
    cvc: [
      { w: 'sun', e: '☀️' }, { w: 'cat', e: '🐱' }, { w: 'dog', e: '🐶' }, { w: 'hat', e: '🎩' },
      { w: 'bed', e: '🛏️' }, { w: 'pig', e: '🐷' }, { w: 'fox', e: '🦊' }, { w: 'jam', e: '🍓' },
      { w: 'cup', e: '☕' }, { w: 'map', e: '🗺️' }, { w: 'pen', e: '✏️' }, { w: 'log', e: '🪵' },
      { w: 'tub', e: '🛁' }, { w: 'wig', e: '💇' },
    ],
    blend: [
      { w: 'crab', e: '🦀' }, { w: 'frog', e: '🐸' }, { w: 'slip', e: '🧦' }, { w: 'drum', e: '🥁' },
      { w: 'plum', e: '🟣' }, { w: 'star', e: '⭐' }, { w: 'tree', e: '🌳' }, { w: 'crib', e: '🛏️' },
      { w: 'snap', e: '📸' }, { w: 'swan', e: '🦢' }, { w: 'clip', e: '📎' }, { w: 'gift', e: '🎁' },
      { w: 'brush', e: '🪥' }, { w: 'clock', e: '🕐' },
    ],
    digraph: [
      { w: 'fish', e: '🐟' }, { w: 'ship', e: '🚢' }, { w: 'bath', e: '🛁' }, { w: 'ring', e: '💍' },
      { w: 'chop', e: '✂️' }, { w: 'duck', e: '🦆' }, { w: 'shell', e: '🐚' }, { w: 'moth', e: '🦋' },
      { w: 'chess', e: '♟️' }, { w: 'chin', e: '😊' }, { w: 'dash', e: '💨' }, { w: 'wish', e: '🌠' },
      { w: 'thorn', e: '🌹' }, { w: 'shark', e: '🦈' },
    ],
  };

  const state = {
    activeGame: 'math',
    spellingMode: 'phonics',
    phonicsPlayGen: 0,
    phonicsAlphabetPlaying: false,
    spellingCategory: 'cvc',
    spellingWords: [],
    spellQIndex: 0,
    spellScore: 0,
    spellBlocked: false,
    spellWord: '',
    spellEmoji: '',
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
    mathMode: 'mixed',
    mathDifficulty: 'medium',
    theme: null,
    emoji: null,
    bgColor: null,
    questions: [],
    qIndex: 0,
    score: 0,
    selectedAnswer: null,
    orderAnswers: {},
    orderActiveBlankIndex: null,
    crossedSet: new Set(),
    placedCount: 0,
    currentQ: null,
    blocked: false,
    maxAnswer: 9,
    soundOn: true,
    hintOn: false,
    stats: { addCorrect: 0, addTotal: 0, subCorrect: 0, subTotal: 0, orderCorrect: 0, orderTotal: 0 },
    maxPickerValue: 9,
    keyInputBuffer: '',
    keyInputTimer: null,
    addGroup1Count: 0,
    addGroup2Count: 0,
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const els = {
    app: document.getElementById('app'),
    appNavHome: document.getElementById('app-nav-home'),
    appNavTitle: document.getElementById('app-nav-title'),
    appModal: document.getElementById('app-modal'),
    appModalBackdrop: document.getElementById('app-modal-backdrop'),
    appModalTitle: document.getElementById('app-modal-title'),
    appModalMessage: document.getElementById('app-modal-message'),
    appModalCancel: document.getElementById('app-modal-cancel'),
    appModalConfirm: document.getElementById('app-modal-confirm'),
    homeScreen: document.getElementById('home-screen'),
    mathSetupScreen: document.getElementById('math-setup-screen'),
    spellingSetupScreen: document.getElementById('spelling-setup-screen'),
    spellingPlayScreen: document.getElementById('spelling-play-screen'),
    phonicsPlayScreen: document.getElementById('phonics-play-screen'),
    arrowPlayScreen: document.getElementById('arrow-play-screen'),
    spellModePhonics: document.getElementById('spell-mode-phonics'),
    spellModePicture: document.getElementById('spell-mode-picture'),
    spellModeArrow: document.getElementById('spell-mode-arrow'),
    phonicsGrid: document.getElementById('phonics-grid'),
    phonicsPlayAzBtn: document.getElementById('phonics-play-az-btn'),
    phonicsSoundToggle: document.getElementById('phonics-sound-toggle'),
    spellingCatFieldset: document.getElementById('spelling-cat-fieldset'),
    spellingSetupHint: document.getElementById('spelling-setup-hint'),
    spellingStartBtn: document.getElementById('spelling-start-btn'),
    arrowQLabel: document.getElementById('arrow-q-label'),
    arrowProgressFill: document.getElementById('arrow-progress-fill'),
    arrowPrompt: document.getElementById('arrow-prompt'),
    arrowExample: document.getElementById('arrow-example'),
    arrowBoard: document.getElementById('arrow-board'),
    arrowBoardStage: document.getElementById('arrow-board-stage'),
    arrowPathsSvg: document.getElementById('arrow-paths-svg'),
    arrowBuilderSlots: document.getElementById('arrow-builder-slots'),
    arrowFoundList: document.getElementById('arrow-found-list'),
    arrowFeedback: document.getElementById('arrow-feedback'),
    arrowSubmitBtn: document.getElementById('arrow-submit-btn'),
    arrowSoundToggle: document.getElementById('arrow-sound-toggle'),
    arrowHearWordBtn: document.getElementById('arrow-hear-word-btn'),
    mainScreen: document.getElementById('main-screen'),
    endScreen: document.getElementById('end-screen'),
    pickMath: document.getElementById('pick-math'),
    pickSpelling: document.getElementById('pick-spelling'),
    spellCatCvc: document.getElementById('spell-cat-cvc'),
    spellCatBlend: document.getElementById('spell-cat-blend'),
    spellCatDigraph: document.getElementById('spell-cat-digraph'),
    spellCatMixed: document.getElementById('spell-cat-mixed'),
    spellingBackBtn: document.getElementById('spelling-back-btn'),
    spellingQLabel: document.getElementById('spelling-q-label'),
    spellingProgressFill: document.getElementById('spelling-progress-fill'),
    spellingPrompt: document.getElementById('spelling-prompt'),
    spellingEmoji: document.getElementById('spelling-emoji'),
    spellingSlotsRow: document.getElementById('spelling-slots-row'),
    spellingBank: document.getElementById('spelling-bank'),
    spellingFeedback: document.getElementById('spelling-feedback'),
    spellingSubmitBtn: document.getElementById('spelling-submit-btn'),
    spellingSoundToggle: document.getElementById('spelling-sound-toggle'),
    spellingHearWordBtn: document.getElementById('spelling-hear-word-btn'),
    mathBackBtn: document.getElementById('math-back-btn'),
    mathStartBtn: document.getElementById('math-start-btn'),
    modeMixed: document.getElementById('math-mode-mixed'),
    modeAdd: document.getElementById('math-mode-add'),
    modeSub: document.getElementById('math-mode-sub'),
    modeBeforeAfter: document.getElementById('math-mode-before-after'),
    modeBetween: document.getElementById('math-mode-between'),
    mathDisplay: document.getElementById('math-display'),
    mathArithmeticView: document.getElementById('math-arithmetic-view'),
    mathOrderView: document.getElementById('math-order-view'),
    mathOrderPrompt: document.getElementById('math-order-prompt'),
    mathOrderSequence: document.getElementById('math-order-sequence'),
    mathOrderBlank: document.getElementById('math-order-blank'),
    emojiZone: document.getElementById('emoji-zone'),
    diffEasy: document.getElementById('math-diff-easy'),
    diffMedium: document.getElementById('math-diff-medium'),
    diffHard: document.getElementById('math-diff-hard'),
    qLabel: document.getElementById('q-label'),
    progressFill: document.getElementById('progress-fill'),
    num1Val: document.getElementById('num1-val'),
    opSign: document.getElementById('op-sign'),
    num2Val: document.getElementById('num2-val'),
    mathBlank: document.getElementById('math-blank'),
    feedback: document.getElementById('feedback-msg'),
    numberPicker: document.getElementById('number-picker'),
    emojiContent: document.getElementById('emoji-content'),
    emojiZoneTitle: document.getElementById('emoji-zone-title'),
    subHint: document.getElementById('sub-hint'),
    submitBtn: document.getElementById('submit-btn'),
    soundToggle: document.getElementById('sound-toggle'),
    hintToggle: document.getElementById('hint-toggle'),
  };

  let audioCtx = null;
  let soundFx = {};
  let alphaSoundFx = {};
  let phonicsSoundFx = {};

  let currentRoute = 'home';

  const NAV_TITLE = {
    home: 'Kids Learning Playground',
    mathSetup: 'Numbers — Set up',
    spellingSetup: 'Spelling — Set up',
    play: 'Numbers — Practice',
    phonicsPlay: 'Letter sounds',
    spellingPlay: 'Spelling — Practice',
    arrowPlay: 'Arrow words — Practice',
    end: 'Round finished!',
  };

  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

  function isOrderMode(mode = state.mathMode) {
    return MATH_MODES_ORDER.includes(mode);
  }

  function isOrderQuestion(q) {
    return q && (q.type === 'beforeAfter' || q.type === 'between');
  }

  function getOrderRange() {
    return ORDER_RANGES[state.mathDifficulty] || ORDER_RANGES.medium;
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
    if (ratio >= 0.9) return '⭐⭐⭐';
    if (ratio >= 0.6) return '⭐⭐';
    return '⭐';
  }

  function bestScoreStorageKey() {
    return `kidsMathBest_${state.mathMode}_${state.mathDifficulty}`;
  }

  function getBestScore() {
    try {
      const key = bestScoreStorageKey();
      const cur = Number(localStorage.getItem(key));
      if (Number.isFinite(cur)) return cur;
      const legacy = Number(localStorage.getItem(LEGACY_BEST_KEY) || 0);
      return Number.isFinite(legacy) ? legacy : 0;
    } catch {
      return 0;
    }
  }

  function setBestScore(v) {
    try {
      const key = bestScoreStorageKey();
      localStorage.setItem(key, String(v));
      const legacy = Number(localStorage.getItem(LEGACY_BEST_KEY) || 0);
      if (v > legacy) localStorage.setItem(LEGACY_BEST_KEY, String(v));
    } catch {
      // ignore
    }
  }

  function loadMathPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE.mathPrefs);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (MATH_MODES_ALL.includes(data.mode)) {
        state.mathMode = data.mode;
      } else if (data.mode === 'before' || data.mode === 'after' || data.mode === 'orderMixed') {
        state.mathMode = 'beforeAfter';
      }
      if (data.difficulty === 'easy' || data.difficulty === 'medium' || data.difficulty === 'hard') {
        state.mathDifficulty = data.difficulty;
      }
    } catch {
      // ignore
    }
  }

  function saveMathPrefs() {
    try {
      localStorage.setItem(STORAGE.mathPrefs, JSON.stringify({ mode: state.mathMode, difficulty: state.mathDifficulty }));
    } catch {
      // ignore
    }
  }

  function syncMathSetupUI() {
    const modeMap = {
      mixed: els.modeMixed,
      add: els.modeAdd,
      sub: els.modeSub,
      beforeAfter: els.modeBeforeAfter,
      between: els.modeBetween,
    };
    Object.values(modeMap).forEach((btn) => {
      if (btn) btn.setAttribute('aria-pressed', 'false');
    });
    if (modeMap[state.mathMode]) modeMap[state.mathMode].setAttribute('aria-pressed', 'true');

    const diffMap = { easy: els.diffEasy, medium: els.diffMedium, hard: els.diffHard };
    Object.values(diffMap).forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
    if (diffMap[state.mathDifficulty]) diffMap[state.mathDifficulty].setAttribute('aria-pressed', 'true');
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

  function pickRandomBg() {
    state.bgColor = PASTELS[Math.floor(Math.random() * PASTELS.length)];
    els.app.style.background = state.bgColor;
  }

  function updateAppNav(screenName) {
    if (els.appNavTitle) {
      els.appNavTitle.textContent = NAV_TITLE[screenName] || NAV_TITLE.home;
    }
    if (els.appNavHome) {
      const onDashboard = screenName === 'home';
      els.appNavHome.disabled = onDashboard;
      els.appNavHome.setAttribute('aria-hidden', onDashboard ? 'true' : 'false');
    }
  }

  /** Themed confirm dialog; returns a Promise (true = confirmed). */
  function openAppModal(opts) {
    if (!els.appModal || !els.appModalTitle || !els.appModalMessage || !els.appModalCancel || !els.appModalConfirm) {
      return Promise.resolve(window.confirm(opts.message || opts.title));
    }

    return new Promise((resolve) => {
      const prevOverflow = document.body.style.overflow;
      const prevFocus = document.activeElement;

      els.appModalTitle.textContent = opts.title;
      els.appModalMessage.textContent = opts.message;
      els.appModalConfirm.textContent = opts.confirmLabel || 'OK';
      els.appModalCancel.textContent = opts.cancelLabel || 'Cancel';

      const focusables = [els.appModalCancel, els.appModalConfirm];

      function cleanup() {
        els.appModalConfirm.onclick = null;
        els.appModalCancel.onclick = null;
        if (els.appModalBackdrop) els.appModalBackdrop.onclick = null;
        document.body.style.overflow = prevOverflow;
        document.removeEventListener('keydown', onKey, true);
        els.appModal.classList.remove('is-open');
        els.appModal.setAttribute('aria-hidden', 'true');
        if (prevFocus && typeof prevFocus.focus === 'function') {
          try {
            prevFocus.focus();
          } catch {
            // ignore
          }
        }
      }

      function finish(value) {
        cleanup();
        resolve(value);
      }

      function onKey(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          finish(false);
          return;
        }
        if (e.key !== 'Tab') return;
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

      document.body.style.overflow = 'hidden';
      els.appModal.classList.add('is-open');
      els.appModal.setAttribute('aria-hidden', 'false');
      document.addEventListener('keydown', onKey, true);

      els.appModalConfirm.onclick = () => finish(true);
      els.appModalCancel.onclick = () => finish(false);
      if (els.appModalBackdrop) els.appModalBackdrop.onclick = () => finish(false);

      requestAnimationFrame(() => {
        els.appModalCancel.focus();
      });
    });
  }

  function requestGoHome() {
    if (currentRoute === 'play' || currentRoute === 'phonicsPlay' || currentRoute === 'spellingPlay' || currentRoute === 'arrowPlay') {
      openAppModal({
        title: 'Go home?',
        message: 'This round will stop. You can start a new one anytime!',
        confirmLabel: 'Go home 🏠',
        cancelLabel: 'Keep playing',
      }).then((ok) => {
        if (!ok) return;
        pickRandomBg();
        showScreen('home');
      });
      return;
    }
    pickRandomBg();
    showScreen('home');
  }

  function showScreen(name) {
    if (currentRoute === 'phonicsPlay' && name !== 'phonicsPlay') {
      state.phonicsPlayGen += 1;
      state.phonicsAlphabetPlaying = false;
    }
    const screens = {
      home: els.homeScreen,
      mathSetup: els.mathSetupScreen,
      spellingSetup: els.spellingSetupScreen,
      spellingPlay: els.spellingPlayScreen,
      phonicsPlay: els.phonicsPlayScreen,
      arrowPlay: els.arrowPlayScreen,
      play: els.mainScreen,
      end: els.endScreen,
    };
    Object.values(screens).forEach((el) => {
      if (el) el.style.display = 'none';
    });
    if (name === 'home') {
      screens.home.style.display = 'flex';
    } else if (name === 'mathSetup') {
      screens.mathSetup.style.display = 'flex';
    } else if (name === 'spellingSetup') {
      screens.spellingSetup.style.display = 'flex';
    } else if (name === 'spellingPlay') {
      screens.spellingPlay.style.display = 'flex';
    } else if (name === 'phonicsPlay') {
      if (screens.phonicsPlay) screens.phonicsPlay.style.display = 'flex';
    } else if (name === 'arrowPlay') {
      if (screens.arrowPlay) screens.arrowPlay.style.display = 'flex';
    } else if (name === 'play') {
      screens.play.style.display = 'flex';
    } else if (name === 'end') {
      screens.end.style.display = 'flex';
    }
    currentRoute = name;
    updateAppNav(name);
  }

  function buildSequenceChoices(correctValues, sequenceValues, rangeMin, rangeMax) {
    const correctSet = new Set(correctValues);
    const extras = new Set();
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
    const { min, max } = getOrderRange();
    const layout = ORDER_LAYOUT[state.mathDifficulty]?.[kind] || ORDER_LAYOUT.medium[kind];
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
      choices: buildSequenceChoices(Object.values(answers), values, min, max),
    };
  }

  function orderBlankCount(q) {
    return q.blankIndices?.length ?? 0;
  }

  function firstUnfilledBlankIndex(q) {
    return q.blankIndices.find((i) => state.orderAnswers[i] === undefined) ?? null;
  }

  function genQuestions() {
    const total = BASE_CONFIG.totalQuestions;

    if (isOrderMode()) {
      const qs = [];
      for (let i = 0; i < total; i++) {
        qs.push(genOrderQuestion(state.mathMode));
      }
      return shuffle(qs);
    }

    const preset = DIFFICULTY_PRESETS[state.mathDifficulty];
    const qs = [];

    let addCount = 0;
    let subCount = 0;
    if (state.mathMode === 'add') addCount = total;
    else if (state.mathMode === 'sub') subCount = total;
    else {
      addCount = BASE_CONFIG.mixedHalf;
      subCount = total - addCount;
    }

    for (let i = 0; i < addCount; i++) {
      const a = rnd(preset.additionRange.min, preset.additionRange.max);
      const b = rnd(preset.additionRange.min, preset.additionRange.max);
      qs.push({ type: 'add', a, b, ans: a + b });
    }
    for (let i = 0; i < subCount; i++) {
      const a = rnd(preset.subtractionMinA, preset.subtractionMaxA);
      const b = rnd(1, a - 1);
      qs.push({ type: 'sub', a, b, ans: a - b });
    }
    return shuffle(qs);
  }

  function bestSpellingScoreKey() {
    if (state.spellingMode === 'arrow') return 'kidsSpellBest_arrow';
    return `kidsSpellBest_${state.spellingCategory}`;
  }

  function arrowRoundWordGoal() {
    return state.arrowPuzzles.reduce((n, p) => n + p.words.length, 0);
  }

  function currentArrowPuzzle() {
    return state.arrowPuzzles[state.arrowPuzzleIndex];
  }

  function getSpellingBest() {
    try {
      const v = Number(localStorage.getItem(bestSpellingScoreKey()));
      return Number.isFinite(v) ? v : 0;
    } catch {
      return 0;
    }
  }

  function setSpellingBest(v) {
    try {
      localStorage.setItem(bestSpellingScoreKey(), String(v));
    } catch {
      // ignore
    }
  }

  function loadSpellingPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE.spellingPrefs);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.mode === 'phonics' || data.mode === 'picture' || data.mode === 'arrow') state.spellingMode = data.mode;
      if (data.category === 'cvc' || data.category === 'blend' || data.category === 'digraph' || data.category === 'mixed') {
        state.spellingCategory = data.category;
      }
    } catch {
      // ignore
    }
  }

  function saveSpellingPrefs() {
    try {
      localStorage.setItem(STORAGE.spellingPrefs, JSON.stringify({
        mode: state.spellingMode,
        category: state.spellingCategory,
      }));
    } catch {
      // ignore
    }
  }

  function syncSpellingSetupUI() {
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

  function startPhonicsPlay() {
    state.activeGame = 'phonics';
    saveSpellingPrefs();
    pickRandomBg();
    state.phonicsPlayGen += 1;
    state.phonicsAlphabetPlaying = false;
    showScreen('phonicsPlay');
    renderPhonicsGrid();
    updatePhonicsPlayAzButton();
  }

  function renderPhonicsGrid() {
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

  function updatePhonicsPlayAzButton() {
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
    if (state.spellingCategory === 'mixed') {
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
    const used = new Set(word.toLowerCase().split(''));
    const decoys = [];
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const candidates = shuffle(alphabet.split('')).filter((c) => !used.has(c));
    for (let i = 0; i < SPELLING_DECOYS && i < candidates.length; i++) decoys.push(candidates[i]);
    return decoys;
  }

  function startSpellingRound() {
    state.activeGame = 'spelling';
    saveSpellingPrefs();
    pickRandomBg();
    state.spellingWords = pickSpellingWords();
    state.spellQIndex = 0;
    state.spellScore = 0;
    showScreen('spellingPlay');
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
    state.spellFilled = state.spellWord.split('').map((ch, i) => (state.spellRevealMask[i] ? ch : null));

    const need = [];
    for (let i = 0; i < state.spellWord.length; i++) {
      if (!state.spellRevealMask[i]) need.push(state.spellWord[i]);
    }
    const poolChars = need.concat(decoyLetters(state.spellWord));
    state.spellBank = shuffle(poolChars.map((ch, idx) => ({ id: `b${idx}-${ch}`, ch, used: false })));

    els.spellingQLabel.textContent = `Word ${state.spellQIndex + 1} of ${SPELLING_TOTAL}`;
    els.spellingProgressFill.style.width = `${((state.spellQIndex + 1) / SPELLING_TOTAL) * 100}%`;
    els.spellingPrompt.textContent = 'What word goes with this picture?';
    els.spellingEmoji.textContent = state.spellEmoji;
    els.spellingFeedback.textContent = '';
    els.spellingFeedback.className = 'feedback-msg';
    renderSpellSlots();
    renderSpellBank();
    updateSpellingSubmitState();
    updateSpellingHearButton();
  }

  function renderSpellSlots() {
    els.spellingSlotsRow.innerHTML = '';
    for (let i = 0; i < state.spellWord.length; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'spell-slot';
      const isHint = state.spellRevealMask[i];
      if (isHint) {
        btn.classList.add('spell-slot--hint');
        btn.textContent = state.spellWord[i];
        btn.setAttribute('aria-label', `Letter ${state.spellWord[i]}, tap to hear`);
        const hintCh = state.spellWord[i];
        btn.onclick = () => {
          if (state.spellBlocked) return;
          playAlphaSound(hintCh);
        };
      } else {
        const v = state.spellFilled[i];
        if (v) {
          btn.classList.add('spell-slot--filled');
          btn.textContent = v;
          btn.setAttribute('aria-label', `Your letter ${v}, tap to clear`);
        } else {
          btn.classList.add('spell-slot--blank');
          btn.textContent = '·';
          btn.setAttribute('aria-label', 'Empty space');
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
    els.spellingBank.innerHTML = '';
    state.spellBank.forEach((entry) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'spell-bank-letter';
      btn.textContent = entry.ch;
      btn.setAttribute('aria-label', `Letter ${entry.ch}`);
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
    const ready = state.spellFilled.every((c) => c !== null && c !== undefined);
    els.spellingSubmitBtn.disabled = state.spellBlocked || !ready;
    updateSpellingHearButton();
  }

  function checkSpellingAnswer() {
    if (state.spellBlocked) return;
    const ready = state.spellFilled.every((c) => c !== null && c !== undefined);
    if (!ready) {
      els.spellingFeedback.textContent = 'Fill every space first! 👆';
      els.spellingFeedback.className = 'feedback-msg wrong';
      playWrongSound();
      return;
    }
    state.spellBlocked = true;
    updateSpellingSubmitState();
    const ok = spellingWordComplete();
    if (ok) {
      state.spellScore++;
      els.spellingFeedback.textContent = ['Great spelling! 🎉', 'You did it! ⭐', 'Super! 🌟'][Math.floor(Math.random() * 3)];
      els.spellingFeedback.className = 'feedback-msg right';
      playCelebrationSound();
      if (!prefersReducedMotion) launchConfetti();
      setTimeout(nextSpellQuestion, BASE_CONFIG.nextQuestionDelayMs);
    } else {
      els.spellingFeedback.textContent = 'Not quite — try again 💪';
      els.spellingFeedback.className = 'feedback-msg wrong';
      els.spellingBank.classList.add('shake');
      playWrongSound();
      setTimeout(() => {
        els.spellingBank.classList.remove('shake');
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
    showScreen('end');
    const total = SPELLING_TOTAL;
    const stars = starLineForScore(state.spellScore, total);
    const msg = state.spellScore === total ? 'PERFECT!' : state.spellScore >= Math.ceil(total * 0.8) ? 'Amazing!' : state.spellScore >= Math.ceil(total * 0.5) ? 'Great job!' : 'Keep going!';
    const best = Math.max(getSpellingBest(), state.spellScore);
    setSpellingBest(best);
    const catLabel = { cvc: 'CVC', blend: 'Blends', digraph: 'Digraphs', mixed: 'Mixed' }[state.spellingCategory] || '';

    els.endScreen.innerHTML = `
      <div class="end-trophy">🏆</div>
      <div class="end-title">${msg}</div>
      <div class="end-score">${state.spellScore} / ${total}</div>
      <div class="end-stars">${stars}</div>
      <div class="best-score">Best (${catLabel}): ${best} / ${total}</div>
      <div class="stats">Spelling round complete · ${catLabel}</div>
      <div class="end-actions">
        <button class="play-again-btn" id="play-again-btn" type="button">Play again 🎮</button>
        <button class="secondary-btn" id="change-spell-btn" type="button">Change spelling ⚙️</button>
        <button class="secondary-btn" id="home-btn" type="button">Home 🏠</button>
      </div>
    `;

    document.getElementById('play-again-btn').onclick = () => startSpellingRound();
    document.getElementById('change-spell-btn').onclick = () => {
      pickRandomBg();
      showScreen('spellingSetup');
      syncSpellingSetupUI();
    };
    document.getElementById('home-btn').onclick = () => {
      state.activeGame = 'math';
      requestGoHome();
    };

    if (!prefersReducedMotion) launchConfetti(60);
    if (state.spellScore === total) playSound('endPerfect', playCelebrationSound);
    else playSound('endTryAgain', playWrongSound);
  }

  function startArrowRound() {
    state.activeGame = 'arrow';
    saveSpellingPrefs();
    pickRandomBg();
    state.arrowPuzzles = buildArrowRound();
    state.arrowPuzzleIndex = 0;
    state.arrowScore = 0;
    showScreen('arrowPlay');
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
    if (!puzzle || state.arrowPickLeftIdx === null || state.arrowPickRightIdx === null) return '';
    const left = puzzle.left[state.arrowPickLeftIdx];
    const right = puzzle.right[state.arrowPickRightIdx];
    if (!left || !right) return '';
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
    els.arrowProgressFill.style.width = `${((state.arrowPuzzleIndex + 1) / totalBoards) * 100}%`;
    els.arrowPrompt.textContent = `Use the colored lines to find ${goal} words through “${puzzle.center}”!`;
    if (els.arrowExample) {
      els.arrowExample.hidden = true;
      els.arrowExample.textContent = '';
    }
    els.arrowFeedback.textContent = '';
    els.arrowFeedback.className = 'feedback-msg';
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
    els.arrowBoard.innerHTML = '';

    const leftCol = document.createElement('div');
    leftCol.className = 'arrow-col';
    const leftLabel = document.createElement('span');
    leftLabel.className = 'arrow-col-label';
    leftLabel.textContent = 'Start';
    leftCol.appendChild(leftLabel);
    puzzle.left.forEach((ch, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'arrow-letter';
      btn.textContent = ch;
      btn.dataset.arrowSide = 'left';
      btn.dataset.arrowIdx = String(i);
      btn.setAttribute('aria-label', `Start letter ${ch}`);
      btn.disabled = state.arrowBlocked;
      btn.onclick = () => {
        if (state.arrowBlocked) return;
        state.arrowPickLeftIdx = i;
        playAlphaSound(ch);
        els.arrowFeedback.textContent = '';
        els.arrowFeedback.className = 'feedback-msg';
        renderArrowBuilder();
        updateArrowSubmitState();
        updateArrowHearButton();
      };
      leftCol.appendChild(btn);
    });

    const center = document.createElement('div');
    center.className = 'arrow-center';
    center.dataset.arrowCenter = 'true';
    center.setAttribute('aria-hidden', 'true');
    center.textContent = puzzle.center;

    const rightCol = document.createElement('div');
    rightCol.className = 'arrow-col';
    const rightLabel = document.createElement('span');
    rightLabel.className = 'arrow-col-label';
    rightLabel.textContent = 'End';
    rightCol.appendChild(rightLabel);
    puzzle.right.forEach((ch, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'arrow-letter';
      btn.textContent = ch;
      btn.dataset.arrowSide = 'right';
      btn.dataset.arrowIdx = String(i);
      btn.setAttribute('aria-label', `End letter ${ch}`);
      btn.disabled = state.arrowBlocked;
      btn.onclick = () => {
        if (state.arrowBlocked) return;
        state.arrowPickRightIdx = i;
        playAlphaSound(ch);
        els.arrowFeedback.textContent = '';
        els.arrowFeedback.className = 'feedback-msg';
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

    svg.setAttribute('width', String(stageRect.width));
    svg.setAttribute('height', String(stageRect.height));
    svg.setAttribute('viewBox', `0 0 ${stageRect.width} ${stageRect.height}`);
    svg.innerHTML = '';

    const centerEl = board.querySelector('[data-arrow-center]');
    if (!centerEl) return;

    const pointFor = (el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - stageRect.left,
        y: r.top + r.height / 2 - stageRect.top,
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

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const c1x = (leftPt.x + centerPt.x) / 2;
      const c2x = (centerPt.x + rightPt.x) / 2;
      const d = `M ${leftPt.x} ${leftPt.y} Q ${c1x} ${leftPt.y}, ${centerPt.x} ${centerPt.y} Q ${c2x} ${rightPt.y}, ${rightPt.x} ${rightPt.y}`;
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', meta.stroke);
      path.setAttribute('stroke-width', found ? '2.5' : '3.5');
      path.setAttribute('stroke-opacity', found ? '0.3' : '0.8');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      if (found) path.classList.add('arrow-path--found');
      svg.appendChild(path);
    });
  }

  function renderArrowBuilder() {
    if (!els.arrowBuilderSlots) return;
    const puzzle = currentArrowPuzzle();
    const leftCh = state.arrowPickLeftIdx !== null ? puzzle.left[state.arrowPickLeftIdx] : null;
    const rightCh = state.arrowPickRightIdx !== null ? puzzle.right[state.arrowPickRightIdx] : null;
    els.arrowBuilderSlots.innerHTML = '';
    const parts = [
      { ch: leftCh, label: 'first letter' },
      { ch: puzzle.center, label: 'middle letter', center: true },
      { ch: rightCh, label: 'last letter' },
    ];
    parts.forEach((part) => {
      const slot = document.createElement('span');
      slot.className = 'arrow-build-slot';
      if (part.center) slot.classList.add('arrow-build-slot--center');
      if (part.ch) {
        slot.classList.add('arrow-build-slot--filled');
        slot.textContent = part.ch;
        slot.setAttribute('aria-label', part.label + ' ' + part.ch);
      } else {
        slot.classList.add('arrow-build-slot--blank');
        slot.textContent = '·';
        slot.setAttribute('aria-label', 'Empty ' + part.label);
      }
      els.arrowBuilderSlots.appendChild(slot);
    });
  }

  function renderArrowFoundList() {
    if (!els.arrowFoundList) return;
    els.arrowFoundList.innerHTML = '';
    const puzzle = currentArrowPuzzle();
    const goal = puzzle.words.length;
    if (state.arrowFound.length === 0) {
      const li = document.createElement('li');
      li.className = 'arrow-found-empty';
      li.textContent = `Your words will show up here (0 / ${goal})`;
      els.arrowFoundList.appendChild(li);
      return;
    }
    state.arrowFound.forEach((w) => {
      const li = document.createElement('li');
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
    els.arrowHearWordBtn.setAttribute('aria-disabled', busy || off || !canPlay ? 'true' : 'false');
    els.arrowHearWordBtn.title = off
      ? 'Turn Sound on in the corner to use this step.'
      : canPlay
        ? `Plays: ${seq.join(' ').toUpperCase()}`
        : 'Trace a colored path first (start and end).';
    els.arrowHearWordBtn.setAttribute(
      'aria-label',
      state.arrowListenPlaying
        ? 'Playing your word'
        : canPlay
          ? 'Listen to the letters in your word'
          : 'Trace a colored path before listening'
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
      els.arrowFeedback.textContent = 'Pick a start letter and an end letter, then submit! 👆';
      els.arrowFeedback.className = 'feedback-msg wrong';
      playWrongSound();
      return;
    }

    const word = arrowBuiltWord();
    const puzzle = currentArrowPuzzle();
    state.arrowBlocked = true;
    updateArrowSubmitState();

    if (state.arrowFound.includes(word)) {
      els.arrowFeedback.textContent = 'You found that word already — try another! 💡';
      els.arrowFeedback.className = 'feedback-msg wrong';
      playWrongSound();
      setTimeout(() => {
        state.arrowBlocked = false;
        clearArrowPicks();
        renderArrowBoard();
        renderArrowBuilder();
        updateArrowSubmitState();
        scheduleArrowPathsRedraw();
      }, BASE_CONFIG.wrongAnswerUnlockDelayMs);
      return;
    }

    const match = findArrowWordMatch();
    if (!match) {
      els.arrowFeedback.textContent = 'Not a word on this board — try again! 💪';
      els.arrowFeedback.className = 'feedback-msg wrong';
      if (els.arrowBoardStage) els.arrowBoardStage.classList.add('shake');
      playWrongSound();
      setTimeout(() => {
        if (els.arrowBoardStage) els.arrowBoardStage.classList.remove('shake');
        state.arrowBlocked = false;
        renderArrowBoard();
        updateArrowSubmitState();
      }, BASE_CONFIG.wrongAnswerUnlockDelayMs);
      return;
    }

    state.arrowFound.push(word);
    state.arrowScore++;
    els.arrowFeedback.textContent = ['Yes! ' + word + '! 🎉', 'You traced ' + word + '! ⭐', 'Great word! 🌟'][Math.floor(Math.random() * 3)];
    els.arrowFeedback.className = 'feedback-msg right';
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
      setTimeout(nextArrowPuzzle, BASE_CONFIG.nextQuestionDelayMs);
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
    showScreen('end');
    const total = arrowRoundWordGoal();
    const stars = starLineForScore(state.arrowScore, total);
    const msg = state.arrowScore === total ? 'PERFECT!' : state.arrowScore >= Math.ceil(total * 0.8) ? 'Amazing!' : state.arrowScore >= Math.ceil(total * 0.5) ? 'Great job!' : 'Keep going!';
    const best = Math.max(getSpellingBest(), state.arrowScore);
    setSpellingBest(best);

    els.endScreen.innerHTML = `
      <div class="end-trophy">🏆</div>
      <div class="end-title">${msg}</div>
      <div class="end-score">${state.arrowScore} / ${total}</div>
      <div class="end-stars">${stars}</div>
      <div class="best-score">Best (Arrow words): ${best} / ${total}</div>
      <div class="stats">Arrow words round complete</div>
      <div class="end-actions">
        <button class="play-again-btn" id="play-again-btn" type="button">Play again 🎮</button>
        <button class="secondary-btn" id="change-spell-btn" type="button">Change spelling ⚙️</button>
        <button class="secondary-btn" id="home-btn" type="button">Home 🏠</button>
      </div>
    `;

    document.getElementById('play-again-btn').onclick = () => startArrowRound();
    document.getElementById('change-spell-btn').onclick = () => {
      pickRandomBg();
      showScreen('spellingSetup');
      syncSpellingSetupUI();
    };
    document.getElementById('home-btn').onclick = () => {
      state.activeGame = 'math';
      requestGoHome();
    };

    if (!prefersReducedMotion) launchConfetti(60);
    if (state.arrowScore === total) playSound('endPerfect', playCelebrationSound);
    else playSound('endTryAgain', playWrongSound);
  }

  function isTypingTarget(t) {
    return !!(t && t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)));
  }

  function ensureAudioCtx() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playTone(freq, durationMs) {
    if (!state.soundOn) return;
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => osc.stop(), durationMs);
  }

  function initSoundFx() {
    soundFx = {};
    Object.entries(SOUND_FILES).forEach(([k, src]) => {
      const a = new Audio(src);
      a.preload = 'auto';
      soundFx[k] = a;
    });
  }

  function initAlphaSounds() {
    alphaSoundFx = {};
    Object.entries(ALPHA_SOUND_SRC).forEach(([letter, src]) => {
      const a = new Audio(src);
      a.preload = 'auto';
      alphaSoundFx[letter] = a;
    });
  }

  function initPhonicsSounds() {
    phonicsSoundFx = {};
    Object.entries(PHONICS_SOUND_SRC).forEach(([letter, src]) => {
      const a = new Audio(src);
      a.preload = 'auto';
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
    inst.play().catch(() => {});
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
      inst.addEventListener('ended', finish, { once: true });
      inst.addEventListener('error', finish, { once: true });
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
    inst.play().catch(() => {});
  }

  /**
   * Plays one letter MP3 from `audio/alphasounds/` (same preloads as `playAlphaSound`).
   * Used by “Hear my letters” only—no speech synthesis fallback.
   */
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
      inst.addEventListener('ended', finish);
      inst.addEventListener('error', finish);
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
      if (ch === null || ch === undefined || ch === '') continue;
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
    els.spellingHearWordBtn.setAttribute('aria-disabled', busy || off || !canPlay ? 'true' : 'false');
    els.spellingHearWordBtn.title = off
      ? 'Turn Sound on in the corner to use this step.'
      : canPlay
        ? `Plays your letters in order: ${seq.join(' ').toUpperCase()}`
        : 'Fill at least one letter first.';
    els.spellingHearWordBtn.setAttribute(
      'aria-label',
      state.spellListenPlaying
        ? 'Playing your letters'
        : canPlay
          ? 'Listen to the letters you have in the word, left to right'
          : 'Add at least one letter before listening'
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
    playSound('correct', () => {
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
    filter.type = 'bandpass';
    filter.frequency.value = 1700;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    source.stop(now + 0.09);
  }

  function playCelebrationSound() {
    playSound('celebration', () => {
      playCorrectSound();
      setTimeout(playClapSound, 40);
      setTimeout(() => playTone(990, 130), 160);
    });
  }

  const playWrongSound = () => playSound('wrong', () => playTone(220, 160));
  const playSelectSound = () => playSound('select', () => playTone(520, 60));
  const playToggleSound = () => playSound('toggle', () => playTone(360, 70));
  const playAddEmojiSound = () => playSound('addEmoji', () => playTone(430, 85));
  const playSubmitSound = () => playSound('submit', () => playTone(300, 55));

  function startMathRound() {
    state.activeGame = 'math';
    saveMathPrefs();
    pickRandomBg();
    state.theme = THEMES[Math.floor(Math.random() * THEMES.length)];
    state.emoji = state.theme.emojis[Math.floor(Math.random() * state.theme.emojis.length)];
    state.questions = genQuestions();
    const orderRound = isOrderMode();
    state.maxAnswer = Math.max(...state.questions.map((q) => {
      if (isOrderQuestion(q)) return Math.max(...Object.values(q.answers));
      return q.ans;
    }));
    state.maxPickerValue = orderRound
      ? Math.max(...state.questions.flatMap((q) => q.choices))
      : state.maxAnswer;
    state.qIndex = 0;
    state.score = 0;
    state.stats = { addCorrect: 0, addTotal: 0, subCorrect: 0, subTotal: 0, orderCorrect: 0, orderTotal: 0 };
    if (els.hintToggle) els.hintToggle.style.display = orderRound ? 'none' : '';
    if (els.emojiZone) els.emojiZone.style.display = orderRound ? 'none' : '';
    showScreen('play');
    loadQuestion();
  }

  function orderSlotId(index) {
    return `math-order-slot-${index}`;
  }

  function setOrderSlot(index, text) {
    const slot = document.getElementById(orderSlotId(index));
    if (!slot) return;
    const value = text === null || text === undefined ? '?' : String(text);
    slot.textContent = value;
    slot.classList.toggle('math-order-num--filled', value !== '?');
  }

  function updateOrderStepHint() {
    if (!els.mathOrderPrompt || !isOrderQuestion(state.currentQ)) return;
    const q = state.currentQ;
    const total = orderBlankCount(q);
    const filled = q.blankIndices.filter((i) => state.orderAnswers[i] !== undefined).length;
    if (filled >= total) {
      els.mathOrderPrompt.textContent = q.type === 'beforeAfter'
        ? 'Before & after — tap submit when ready!'
        : 'Between — tap submit when ready!';
      return;
    }
    const step = filled + 1;
    els.mathOrderPrompt.textContent = q.type === 'beforeAfter'
      ? `Fill in the missing numbers (${step} of ${total}) ⬅️➡️`
      : `Fill in the missing numbers (${step} of ${total}) ↔️`;
  }

  function highlightActiveOrderSlot() {
    const q = state.currentQ;
    if (!q?.blankIndices) return;
    q.blankIndices.forEach((i) => {
      const slot = document.getElementById(orderSlotId(i));
      if (slot) slot.classList.toggle('math-order-num--active', i === state.orderActiveBlankIndex);
    });
  }

  function renderOrderQuestion() {
    const q = state.currentQ;
    if (els.mathArithmeticView) els.mathArithmeticView.hidden = true;
    if (els.mathOrderView) els.mathOrderView.hidden = false;
    if (els.mathDisplay) els.mathDisplay.classList.add('math-display--order');
    if (els.mathOrderBlank) els.mathOrderBlank.hidden = true;

    if (els.mathOrderPrompt) {
      els.mathOrderPrompt.textContent = q.type === 'beforeAfter'
        ? 'Fill in the numbers before and after!'
        : 'Fill in the numbers between!';
    }

    if (!els.mathOrderSequence) return;
    els.mathOrderSequence.innerHTML = '';
    els.mathOrderSequence.removeAttribute('aria-hidden');
    els.mathOrderSequence.classList.toggle('math-order-sequence--long', q.values.length >= 7);
    const shownSet = new Set(q.shownIndices);

    q.values.forEach((value, i) => {
      if (i > 0) els.mathOrderSequence.appendChild(createOrderGap());
      if (shownSet.has(i)) {
        els.mathOrderSequence.appendChild(createOrderNum(value));
        return;
      }
      const slot = document.createElement('span');
      slot.className = 'math-order-num math-order-num--answer';
      slot.id = orderSlotId(i);
      slot.textContent = '?';
      els.mathOrderSequence.appendChild(slot);
    });

    updateOrderStepHint();
    highlightActiveOrderSlot();
  }

  function createOrderNum(n) {
    const el = document.createElement('span');
    el.className = 'math-order-num';
    el.textContent = n;
    return el;
  }

  function createOrderGap() {
    const el = document.createElement('span');
    el.className = 'math-order-gap';
    el.textContent = '·';
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  function renderArithmeticQuestion() {
    if (els.mathArithmeticView) els.mathArithmeticView.hidden = false;
    if (els.mathOrderView) els.mathOrderView.hidden = true;
    if (els.mathDisplay) els.mathDisplay.classList.remove('math-display--order');
    if (els.mathOrderSequence) {
      els.mathOrderSequence.innerHTML = '';
      els.mathOrderSequence.setAttribute('aria-hidden', 'true');
    }
    els.num1Val.textContent = state.currentQ.a;
    els.opSign.textContent = state.currentQ.type === 'sub' ? '−' : '+';
    els.num2Val.textContent = state.currentQ.b;
  }

  function loadQuestion() {
    state.blocked = false;
    state.selectedAnswer = null;
    state.orderAnswers = {};
    state.orderActiveBlankIndex = null;
    state.crossedSet.clear();
    state.placedCount = 0;
    state.addGroup1Count = 0;
    state.addGroup2Count = 0;
    state.currentQ = state.questions[state.qIndex];
    const total = BASE_CONFIG.totalQuestions;
    const orderQ = isOrderQuestion(state.currentQ);
    els.qLabel.textContent = `Question ${state.qIndex + 1} of ${total}`;
    els.progressFill.style.width = `${((state.qIndex + 1) / total) * 100}%`;
    els.feedback.textContent = '';
    els.feedback.className = 'feedback-msg';
    if (orderQ) {
      state.orderActiveBlankIndex = firstUnfilledBlankIndex(state.currentQ);
      renderOrderQuestion();
    } else {
      renderArithmeticQuestion();
    }
    buildNumberPicker();
    if (orderQ) {
      if (els.emojiZone) els.emojiZone.style.display = 'none';
    } else {
      if (els.emojiZone) els.emojiZone.style.display = '';
      buildEmojiZone();
    }
    updateSubmitState();
  }

  function buildNumberPicker() {
    els.numberPicker.innerHTML = '';
    const q = state.currentQ;
    const nums = isOrderQuestion(q)
      ? shuffle([...q.choices])
      : Array.from({ length: state.maxAnswer + 1 }, (_, i) => i);
    for (const n of nums) {
      const btn = document.createElement('button');
      btn.className = 'num-btn';
      btn.type = 'button';
      btn.textContent = n;
      btn.setAttribute('aria-label', `Answer ${n}`);
      btn.onclick = () => selectNumber(n, btn);
      els.numberPicker.appendChild(btn);
    }
  }

  function selectNumber(n, btn) {
    if (state.blocked) return;
    const q = state.currentQ;

    if (isOrderQuestion(q)) {
      const idx = state.orderActiveBlankIndex;
      if (idx === null) return;
      state.orderAnswers[idx] = n;
      setOrderSlot(idx, n);
      state.orderActiveBlankIndex = firstUnfilledBlankIndex(q);
      document.querySelectorAll('.num-btn').forEach((b) => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      updateOrderStepHint();
      highlightActiveOrderSlot();
      updateSubmitState();
      playSelectSound();
      return;
    }

    state.selectedAnswer = n;
    if (els.mathBlank) els.mathBlank.textContent = n;
    document.querySelectorAll('.num-btn').forEach((b) => {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('selected');
    btn.setAttribute('aria-pressed', 'true');
    updateSubmitState();
    playSelectSound();
  }

  function buildEmojiZone() {
    els.emojiContent.innerHTML = '';
    if (state.currentQ.type === 'add') updateAdditionZone();
    else updateSubtractionZone();
  }

  function updateAdditionZone() {
    const doneA = state.addGroup1Count >= state.currentQ.a;
    const doneB = state.addGroup2Count >= state.currentQ.b;
    if (!doneA) els.emojiZoneTitle.textContent = `Build the first group: ${state.currentQ.a}`;
    else if (!doneB) els.emojiZoneTitle.textContent = `Great! Now build the second group: ${state.currentQ.b}`;
    else els.emojiZoneTitle.textContent = 'Both groups built! Count them all.';

    els.subHint.style.display = state.hintOn ? 'block' : 'none';
    els.subHint.textContent = doneA && doneB
      ? `${state.currentQ.a} + ${state.currentQ.b} = ?`
      : `Progress: ${state.addGroup1Count}/${state.currentQ.a} + ${state.addGroup2Count}/${state.currentQ.b}`;

    els.emojiContent.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'add-builder';

    const createAddCard = (label, target, count, onAdd, onRemove) => {
      const card = document.createElement('div');
      card.className = 'add-card';
      const title = document.createElement('div');
      title.className = 'add-card-title';
      title.textContent = label;
      const countLabel = document.createElement('div');
      countLabel.className = 'add-card-count';
      countLabel.textContent = `${count} / ${target}`;
      const items = document.createElement('div');
      items.className = 'add-card-items';
      for (let i = 0; i < count; i++) {
        const e = document.createElement('span');
        e.className = 'emoji-item';
        e.textContent = state.emoji;
        items.appendChild(e);
      }
      const controls = document.createElement('div');
      controls.className = 'add-card-controls';
      const addBtn = document.createElement('button');
      addBtn.className = 'mini-btn';
      addBtn.type = 'button';
      addBtn.textContent = '➕';
      addBtn.setAttribute('aria-label', `Add one ${state.emoji}`);
      addBtn.disabled = count >= target || state.blocked;
      addBtn.onclick = onAdd;
      const removeBtn = document.createElement('button');
      removeBtn.className = 'mini-btn';
      removeBtn.type = 'button';
      removeBtn.textContent = '➖';
      removeBtn.setAttribute('aria-label', `Remove one ${state.emoji}`);
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

    wrap.appendChild(createAddCard('First Number', state.currentQ.a, state.addGroup1Count, () => {
      if (state.blocked || state.addGroup1Count >= state.currentQ.a) return;
      state.addGroup1Count++;
      playAddEmojiSound();
      updateAdditionZone();
    }, () => {
      if (state.blocked || state.addGroup1Count <= 0) return;
      state.addGroup1Count--;
      playToggleSound();
      updateAdditionZone();
    }));

    const plus = document.createElement('div');
    plus.className = 'plus-sign';
    plus.textContent = '+';
    wrap.appendChild(plus);

    wrap.appendChild(createAddCard('Second Number', state.currentQ.b, state.addGroup2Count, () => {
      if (state.blocked || state.addGroup2Count >= state.currentQ.b) return;
      state.addGroup2Count++;
      playAddEmojiSound();
      updateAdditionZone();
    }, () => {
      if (state.blocked || state.addGroup2Count <= 0) return;
      state.addGroup2Count--;
      playToggleSound();
      updateAdditionZone();
    }));

    els.emojiContent.appendChild(wrap);
  }

  function updateSubtractionZone() {
    const remaining = state.placedCount - state.crossedSet.size;
    const canAdd = state.placedCount < state.currentQ.a;
    if (state.placedCount === 0) els.emojiZoneTitle.textContent = `Tap ➕ to add your ${state.emoji}`;
    else if (canAdd) els.emojiZoneTitle.textContent = `${state.placedCount} added - add more or cross some out!`;
    else els.emojiZoneTitle.textContent = `Cross out ${state.currentQ.b} to take away!`;

    els.subHint.style.display = state.hintOn ? 'block' : 'none';
    els.subHint.textContent = `${state.placedCount} added - ${state.crossedSet.size} crossed out - ${remaining} left`;

    els.emojiContent.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'sub-grid';
    for (let i = 0; i < state.placedCount; i++) {
      const btn = document.createElement('button');
      btn.className = `sub-animal${state.crossedSet.has(i) ? ' crossed' : ''}`;
      btn.type = 'button';
      btn.textContent = state.emoji;
      btn.setAttribute('aria-label', state.crossedSet.has(i) ? 'Undo cross out' : 'Cross out');
      btn.onclick = () => {
        if (state.blocked) return;
        if (state.crossedSet.has(i)) state.crossedSet.delete(i);
        else state.crossedSet.add(i);
        playToggleSound();
        updateSubtractionZone();
      };
      grid.appendChild(btn);
    }
    els.emojiContent.appendChild(grid);

    if (canAdd) {
      const controls = document.createElement('div');
      controls.className = 'sub-controls';
      const addBtn = document.createElement('button');
      addBtn.className = 'add-animal-btn';
      addBtn.type = 'button';
      addBtn.textContent = '➕';
      addBtn.setAttribute('aria-label', `Add one ${state.emoji}`);
      addBtn.title = `Add a ${state.emoji}`;
      addBtn.onclick = () => {
        if (state.blocked || state.placedCount >= state.currentQ.a) return;
        state.placedCount++;
        playAddEmojiSound();
        updateSubtractionZone();
      };
      controls.appendChild(addBtn);
      els.emojiContent.appendChild(controls);
    }
  }

  function isOrderAnswerComplete() {
    const q = state.currentQ;
    return q.blankIndices.every((i) => state.orderAnswers[i] !== undefined);
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
      const msg = left > 1
        ? `Fill in all ${orderBlankCount(state.currentQ)} numbers first! 👆`
        : 'Fill in the missing number first! 👆';
      els.feedback.textContent = msg;
      els.feedback.className = 'feedback-msg wrong';
      playWrongSound();
      return;
    }
    if (!orderQ && state.selectedAnswer === null) {
      els.feedback.textContent = 'Pick a number first! 👆';
      els.feedback.className = 'feedback-msg wrong';
      playWrongSound();
      return;
    }
    state.blocked = true;
    updateSubmitState();
    const correct = orderQ ? isOrderAnswerCorrect() : state.selectedAnswer === state.currentQ.ans;
    if (orderQ) state.stats.orderTotal++;
    else if (state.currentQ.type === 'add') state.stats.addTotal++;
    else state.stats.subTotal++;

    if (correct) {
      if (orderQ) state.stats.orderCorrect++;
      else if (state.currentQ.type === 'add') state.stats.addCorrect++;
      else state.stats.subCorrect++;
      state.score++;
      els.feedback.textContent = ['Amazing! 🎉', 'You got it! ⭐', 'Brilliant! 🌟', 'Wonderful! 🎈', 'Super smart! 🦋'][Math.floor(Math.random() * 5)];
      els.feedback.className = 'feedback-msg right';
      if (orderQ) showOrderCorrectAnswers();
      else if (els.mathBlank) els.mathBlank.textContent = state.currentQ.ans;
      if (!orderQ) {
        document.querySelectorAll('.emoji-item,.sub-animal:not(.crossed)').forEach((e) => {
          e.style.animation = 'none';
          setTimeout(() => { e.style.animation = 'bounce 0.5s ease'; }, 10);
        });
      }
      playCelebrationSound();
      if (!prefersReducedMotion) launchConfetti();
      setTimeout(nextQuestion, BASE_CONFIG.nextQuestionDelayMs);
    } else {
      els.feedback.textContent = 'Oops! Try again 🙈';
      els.feedback.className = 'feedback-msg wrong';
      els.numberPicker.classList.add('shake');
      playWrongSound();
      setTimeout(() => {
        els.numberPicker.classList.remove('shake');
        state.blocked = false;
        if (orderQ) resetOrderAnswersForRetry();
        document.querySelectorAll('.num-btn').forEach((b) => {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
        });
        updateSubmitState();
      }, BASE_CONFIG.wrongAnswerUnlockDelayMs);
    }
  }

  function nextQuestion() {
    state.qIndex++;
    if (state.qIndex >= BASE_CONFIG.totalQuestions) {
      showEnd();
      return;
    }
    loadQuestion();
  }

  function showEnd() {
    state.activeGame = 'math';
    showScreen('end');
    const total = BASE_CONFIG.totalQuestions;
    const stars = starLineForScore(state.score, total);
    const msg = state.score === total ? 'PERFECT!' : state.score >= Math.ceil(total * 0.8) ? 'Amazing!' : state.score >= Math.ceil(total * 0.5) ? 'Great job!' : 'Keep going!';
    const best = Math.max(getBestScore(), state.score);
    setBestScore(best);
    const addPct = state.stats.addTotal ? Math.round((state.stats.addCorrect / state.stats.addTotal) * 100) : 0;
    const subPct = state.stats.subTotal ? Math.round((state.stats.subCorrect / state.stats.subTotal) * 100) : 0;
    const orderPct = state.stats.orderTotal ? Math.round((state.stats.orderCorrect / state.stats.orderTotal) * 100) : 0;
    const statsLine = isOrderMode()
      ? `Number order: ${orderPct}%`
      : `Addition: ${addPct}% · Subtraction: ${subPct}%`;

    els.endScreen.innerHTML = `
      <div class="end-trophy">🏆</div>
      <div class="end-title">${msg}</div>
      <div class="end-score">${state.score} / ${total}</div>
      <div class="end-stars">${stars}</div>
      <div class="best-score">Best for this level: ${best} / ${total}</div>
      <div class="stats">${statsLine}</div>
      <div class="end-actions">
        <button class="play-again-btn" id="play-again-btn" type="button">Play again 🎮</button>
        <button class="secondary-btn" id="change-math-btn" type="button">Change math ⚙️</button>
        <button class="secondary-btn" id="home-btn" type="button">Home 🏠</button>
      </div>
    `;

    document.getElementById('play-again-btn').onclick = () => startMathRound();
    document.getElementById('change-math-btn').onclick = () => {
      pickRandomBg();
      showScreen('mathSetup');
      syncMathSetupUI();
      if (els.hintToggle) els.hintToggle.style.display = '';
      if (els.emojiZone) els.emojiZone.style.display = '';
    };
    document.getElementById('home-btn').onclick = () => {
      state.activeGame = 'math';
      requestGoHome();
    };

    if (!prefersReducedMotion) launchConfetti(60);
    if (state.score === total) playSound('endPerfect', playCelebrationSound);
    else playSound('endTryAgain', playWrongSound);
  }

  function launchConfetti(count = 30) {
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BD6', '#FFA06B'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        c.style.left = `${Math.random() * 100}vw`;
        c.style.top = '-20px';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDuration = `${1.2 + Math.random() * 1.5}s`;
        c.style.animationDelay = `${Math.random() * 0.5}s`;
        c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), BASE_CONFIG.confettiLifetimeMs);
      }, i * BASE_CONFIG.confettiStaggerMs);
    }
  }

  function updateSoundToggle() {
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

  function updateHintToggle() {
    els.hintToggle.textContent = state.hintOn ? 'Hint: On' : 'Hint: Off';
    els.hintToggle.setAttribute('aria-pressed', state.hintOn ? 'true' : 'false');
  }

  function updateSubmitState() {
    const orderQ = state.currentQ && isOrderQuestion(state.currentQ);
    const ready = orderQ
      ? isOrderAnswerComplete()
      : state.selectedAnswer !== null;
    els.submitBtn.disabled = state.blocked || !ready;
  }

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
      state.keyInputTimer = setTimeout(() => { state.keyInputBuffer = ''; }, BASE_CONFIG.keyBufferResetMs);
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
    if (currentRoute !== 'arrowPlay') return;
    if (arrowResizeTimer) clearTimeout(arrowResizeTimer);
    arrowResizeTimer = setTimeout(() => scheduleArrowPathsRedraw(), 120);
  });

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
})();
