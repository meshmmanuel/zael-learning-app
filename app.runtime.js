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

  const STORAGE = { mathPrefs: 'kidsAppV1MathPrefs', spellingPrefs: 'kidsAppV1SpellingPrefs' };
  const LEGACY_BEST_KEY = 'kidsMathV3BestScore';

  const SPELLING_TOTAL = 10;
  const SPELLING_DECOYS = 2;

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
    mathMode: 'mixed',
    mathDifficulty: 'medium',
    theme: null,
    emoji: null,
    bgColor: null,
    questions: [],
    qIndex: 0,
    score: 0,
    selectedAnswer: null,
    crossedSet: new Set(),
    placedCount: 0,
    currentQ: null,
    blocked: false,
    maxAnswer: 9,
    soundOn: true,
    hintOn: false,
    stats: { addCorrect: 0, addTotal: 0, subCorrect: 0, subTotal: 0 },
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
    mainScreen: document.getElementById('main-screen'),
    endScreen: document.getElementById('end-screen'),
    pickMath: document.getElementById('pick-math'),
    pickSpelling: document.getElementById('pick-spelling'),
    spellCatCvc: document.getElementById('spell-cat-cvc'),
    spellCatBlend: document.getElementById('spell-cat-blend'),
    spellCatDigraph: document.getElementById('spell-cat-digraph'),
    spellCatMixed: document.getElementById('spell-cat-mixed'),
    spellingBackBtn: document.getElementById('spelling-back-btn'),
    spellingStartBtn: document.getElementById('spelling-start-btn'),
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

  let currentRoute = 'home';

  const NAV_TITLE = {
    home: 'Kids Learning Playground',
    mathSetup: 'Numbers — Set up',
    spellingSetup: 'Spelling — Set up',
    play: 'Numbers — Practice',
    spellingPlay: 'Spelling — Practice',
    end: 'Round finished!',
  };

  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

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
      if (data.mode === 'mixed' || data.mode === 'add' || data.mode === 'sub') state.mathMode = data.mode;
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
    const modeMap = { mixed: els.modeMixed, add: els.modeAdd, sub: els.modeSub };
    Object.values(modeMap).forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
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
    if (currentRoute === 'play' || currentRoute === 'spellingPlay') {
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
    const screens = {
      home: els.homeScreen,
      mathSetup: els.mathSetupScreen,
      spellingSetup: els.spellingSetupScreen,
      spellingPlay: els.spellingPlayScreen,
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
    } else if (name === 'play') {
      screens.play.style.display = 'flex';
    } else if (name === 'end') {
      screens.end.style.display = 'flex';
    }
    currentRoute = name;
    updateAppNav(name);
  }

  function genQuestions() {
    const preset = DIFFICULTY_PRESETS[state.mathDifficulty];
    const qs = [];
    const total = BASE_CONFIG.totalQuestions;

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
    return `kidsSpellBest_${state.spellingCategory}`;
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
      if (data.category === 'cvc' || data.category === 'blend' || data.category === 'digraph' || data.category === 'mixed') {
        state.spellingCategory = data.category;
      }
    } catch {
      // ignore
    }
  }

  function saveSpellingPrefs() {
    try {
      localStorage.setItem(STORAGE.spellingPrefs, JSON.stringify({ category: state.spellingCategory }));
    } catch {
      // ignore
    }
  }

  function syncSpellingSetupUI() {
    const map = {
      cvc: els.spellCatCvc,
      blend: els.spellCatBlend,
      digraph: els.spellCatDigraph,
      mixed: els.spellCatMixed,
    };
    Object.values(map).forEach((btn) => { if (btn) btn.setAttribute('aria-pressed', 'false'); });
    if (map[state.spellingCategory]) map[state.spellingCategory].setAttribute('aria-pressed', 'true');
  }

  function setSpellingCategory(cat) {
    state.spellingCategory = cat;
    syncSpellingSetupUI();
    playSelectSound();
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
          playAlphaSound(state.spellFilled[idx]);
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

  function playAlphaSound(letter) {
    if (!state.soundOn) return;
    const k = String(letter).toLowerCase();
    if (!/^[a-z]$/.test(k)) return;
    const base = alphaSoundFx[k];
    if (!base) return;
    const inst = base.cloneNode();
    inst.play().catch(() => {});
  }

  /** Last resort so every slot letter is audible if the MP3 path fails (decode, autoplay, or missing file). */
  function speakLetterFallback(letter) {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      if (!state.soundOn) {
        finish();
        return;
      }
      const syn = window.speechSynthesis;
      if (!syn || typeof SpeechSynthesisUtterance === 'undefined') {
        finish();
        return;
      }
      const k = String(letter).toLowerCase();
      if (!/^[a-z]$/.test(k)) {
        finish();
        return;
      }
      const u = new SpeechSynthesisUtterance(k);
      u.rate = 0.92;
      u.onend = finish;
      u.onerror = finish;
      try {
        syn.speak(u);
      } catch {
        finish();
        return;
      }
      setTimeout(finish, 2600);
    });
  }

  /** Plays one letter clip and resolves when it ends (or on error / timeout). */
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
      const src = ALPHA_SOUND_SRC[k];
      if (!src) {
        speakLetterFallback(k).then(finish);
        return;
      }
      const inst = new Audio(src);
      inst.preload = 'auto';
      let usedFallback = false;
      const onEnded = () => finish();
      const tryFallback = () => {
        if (usedFallback) return;
        usedFallback = true;
        inst.removeEventListener('ended', onEnded);
        inst.removeEventListener('error', tryFallback);
        if (safetyTimer) clearTimeout(safetyTimer);
        speakLetterFallback(k).then(finish);
      };
      inst.addEventListener('ended', onEnded);
      inst.addEventListener('error', tryFallback);
      safetyTimer = setTimeout(() => finish(), 2800);
      inst.play().catch(() => {
        inst.removeEventListener('ended', onEnded);
        inst.removeEventListener('error', tryFallback);
        tryFallback();
      });
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
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // ignore
      }
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
    state.maxAnswer = Math.max(...state.questions.map((q) => q.ans));
    state.qIndex = 0;
    state.score = 0;
    state.stats = { addCorrect: 0, addTotal: 0, subCorrect: 0, subTotal: 0 };
    showScreen('play');
    loadQuestion();
  }

  function loadQuestion() {
    state.blocked = false;
    state.selectedAnswer = null;
    state.crossedSet.clear();
    state.placedCount = 0;
    state.addGroup1Count = 0;
    state.addGroup2Count = 0;
    state.currentQ = state.questions[state.qIndex];
    const total = BASE_CONFIG.totalQuestions;
    els.qLabel.textContent = `Question ${state.qIndex + 1} of ${total}`;
    els.progressFill.style.width = `${((state.qIndex + 1) / total) * 100}%`;
    els.num1Val.textContent = state.currentQ.a;
    els.opSign.textContent = state.currentQ.type === 'sub' ? '−' : '+';
    els.num2Val.textContent = state.currentQ.b;
    els.mathBlank.textContent = '?';
    els.feedback.textContent = '';
    els.feedback.className = 'feedback-msg';
    buildNumberPicker();
    buildEmojiZone();
    updateSubmitState();
  }

  function buildNumberPicker() {
    els.numberPicker.innerHTML = '';
    for (let n = 0; n <= state.maxAnswer; n++) {
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
    state.selectedAnswer = n;
    els.mathBlank.textContent = n;
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

  function checkAnswer() {
    if (state.blocked) return;
    if (state.selectedAnswer === null) {
      els.feedback.textContent = 'Pick a number first! 👆';
      els.feedback.className = 'feedback-msg wrong';
      playWrongSound();
      return;
    }
    state.blocked = true;
    updateSubmitState();
    const correct = state.selectedAnswer === state.currentQ.ans;
    if (state.currentQ.type === 'add') state.stats.addTotal++;
    else state.stats.subTotal++;

    if (correct) {
      if (state.currentQ.type === 'add') state.stats.addCorrect++;
      else state.stats.subCorrect++;
      state.score++;
      els.feedback.textContent = ['Amazing! 🎉', 'You got it! ⭐', 'Brilliant! 🌟', 'Wonderful! 🎈', 'Super smart! 🦋'][Math.floor(Math.random() * 5)];
      els.feedback.className = 'feedback-msg right';
      els.mathBlank.textContent = state.currentQ.ans;
      document.querySelectorAll('.emoji-item,.sub-animal:not(.crossed)').forEach((e) => {
        e.style.animation = 'none';
        setTimeout(() => { e.style.animation = 'bounce 0.5s ease'; }, 10);
      });
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

    els.endScreen.innerHTML = `
      <div class="end-trophy">🏆</div>
      <div class="end-title">${msg}</div>
      <div class="end-score">${state.score} / ${total}</div>
      <div class="end-stars">${stars}</div>
      <div class="best-score">Best for this level: ${best} / ${total}</div>
      <div class="stats">Addition: ${addPct}% · Subtraction: ${subPct}%</div>
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
  }

  function updateHintToggle() {
    els.hintToggle.textContent = state.hintOn ? 'Hint: On' : 'Hint: Off';
    els.hintToggle.setAttribute('aria-pressed', state.hintOn ? 'true' : 'false');
  }

  function updateSubmitState() {
    els.submitBtn.disabled = state.blocked || state.selectedAnswer === null;
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
      startSpellingRound();
    });
  }

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
    if (state.soundOn) playToggleSound();
  }

  els.soundToggle.addEventListener('click', onSoundToggleClick);
  if (els.spellingSoundToggle) els.spellingSoundToggle.addEventListener('click', onSoundToggleClick);

  els.hintToggle.addEventListener('click', () => {
    state.hintOn = !state.hintOn;
    updateHintToggle();
    if (state.soundOn) playToggleSound();
    if (state.currentQ) {
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
      if (n > state.maxAnswer) {
        state.keyInputBuffer = e.key;
        n = Number(state.keyInputBuffer);
      }
      if (n <= state.maxAnswer) {
        const btn = [...document.querySelectorAll('.num-btn')].find((b) => Number(b.textContent) === n);
        if (btn) selectNumber(n, btn);
      }
    }
  });

  initSoundFx();
  initAlphaSounds();
  loadMathPrefs();
  loadSpellingPrefs();
  syncMathSetupUI();
  syncSpellingSetupUI();
  updateSoundToggle();
  updateHintToggle();
  updateSpellingHearButton();
  state.activeGame = 'math';
  pickRandomBg();
  showScreen('home');
})();
