const THEMES = [
  { name: 'fruits', emojis: ['🍎', '🍋', '🍇'] },
  { name: 'animals', emojis: ['🐸', '🐶', '🐱'] },
  { name: 'space', emojis: ['🚀', '⭐', '🪐'] },
  { name: 'ocean', emojis: ['🐠', '🐙', '🦀'] },
  { name: 'jungle', emojis: ['🦁', '🐘', '🦒'] },
];

const PASTELS = ['#FFD6D6', '#FFE4C4', '#FFFACD', '#D4F1C0', '#C8E6FF', '#E8D5FF', '#FFD6F0', '#D6FFF6'];
const BEST_SCORE_KEY = 'kidsMathV3BestScore';

let theme;
let emoji;
let bgColor;
let questions = [];
let qIndex = 0;
let score = 0;
let selectedAnswer = null;
let crossedSet = new Set();
let placedCount = 0;
let currentQ = null;
let blocked = false;
let maxAnswer = 9;
let soundOn = true;
let hintOn = false;
let stats = { addCorrect: 0, addTotal: 0, subCorrect: 0, subTotal: 0 };
let audioCtx = null;
let soundFx = {};
let keyInputBuffer = '';
let keyInputTimer = null;
let addGroup1Count = 0;
let addGroup2Count = 0;

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

function rnd(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function genQuestions() {
  const qs = [];
  for (let i = 0; i < 5; i++) {
    const a = rnd(1, 9);
    const b = rnd(1, 9);
    qs.push({ type: 'add', a, b, ans: a + b });
  }
  for (let i = 0; i < 5; i++) {
    const a = rnd(3, 12);
    const b = rnd(1, a - 1);
    qs.push({ type: 'sub', a, b, ans: a - b });
  }
  return shuffle(qs);
}

function init() {
  theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  emoji = theme.emojis[Math.floor(Math.random() * theme.emojis.length)];
  bgColor = PASTELS[Math.floor(Math.random() * PASTELS.length)];
  document.getElementById('app').style.background = bgColor;
  questions = genQuestions();
  maxAnswer = Math.max(...questions.map((q) => q.ans));
  qIndex = 0;
  score = 0;
  stats = { addCorrect: 0, addTotal: 0, subCorrect: 0, subTotal: 0 };
  document.getElementById('main-screen').style.display = 'flex';
  document.getElementById('end-screen').style.display = 'none';
  initSoundFx();
  loadQuestion();
}

function loadQuestion() {
  blocked = false;
  selectedAnswer = null;
  crossedSet.clear();
  placedCount = 0;
  addGroup1Count = 0;
  addGroup2Count = 0;
  currentQ = questions[qIndex];
  document.getElementById('q-label').textContent = `Question ${qIndex + 1} of 10`;
  document.getElementById('progress-fill').style.width = `${((qIndex + 1) / 10) * 100}%`;
  document.getElementById('num1-val').textContent = currentQ.a;
  document.getElementById('op-sign').textContent = currentQ.type === 'sub' ? '−' : '+';
  document.getElementById('num2-val').textContent = currentQ.b;
  document.getElementById('math-blank').textContent = '?';
  const fb = document.getElementById('feedback-msg');
  fb.textContent = '';
  fb.className = 'feedback-msg';
  buildNumberPicker();
  buildEmojiZone();
}

function buildNumberPicker() {
  const picker = document.getElementById('number-picker');
  picker.innerHTML = '';
  for (let n = 0; n <= maxAnswer; n++) {
    const btn = document.createElement('button');
    btn.className = 'num-btn';
    btn.type = 'button';
    btn.textContent = n;
    btn.setAttribute('aria-label', `Answer ${n}`);
    btn.onclick = () => selectNumber(n, btn);
    picker.appendChild(btn);
  }
}

function selectNumber(n, btn) {
  if (blocked) return;
  selectedAnswer = n;
  document.getElementById('math-blank').textContent = n;
  document.querySelectorAll('.num-btn').forEach((b) => {
    b.classList.remove('selected');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('selected');
  btn.setAttribute('aria-pressed', 'true');
  playSelectSound();
}

function buildEmojiZone() {
  const content = document.getElementById('emoji-content');
  content.innerHTML = '';
  if (currentQ.type === 'add') {
    updateAdditionZone();
  } else {
    updateSubtractionZone();
  }
}

function updateAdditionZone() {
  const content = document.getElementById('emoji-content');
  const hint = document.getElementById('sub-hint');
  const doneA = addGroup1Count >= currentQ.a;
  const doneB = addGroup2Count >= currentQ.b;

  if (!doneA) {
    document.getElementById('emoji-zone-title').textContent = `Build the first group: ${currentQ.a}`;
  } else if (!doneB) {
    document.getElementById('emoji-zone-title').textContent = `Great! Now build the second group: ${currentQ.b}`;
  } else {
    document.getElementById('emoji-zone-title').textContent = 'Both groups built! Count them all.';
  }

  hint.style.display = hintOn ? 'block' : 'none';
  if (doneA && doneB) {
    hint.textContent = `${currentQ.a} + ${currentQ.b} = ?`;
  } else {
    hint.textContent = `Progress: ${addGroup1Count}/${currentQ.a} + ${addGroup2Count}/${currentQ.b}`;
  }

  content.innerHTML = '';
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
      e.textContent = emoji;
      items.appendChild(e);
    }

    const controls = document.createElement('div');
    controls.className = 'add-card-controls';

    const addBtn = document.createElement('button');
    addBtn.className = 'mini-btn';
    addBtn.type = 'button';
    addBtn.textContent = '➕';
    addBtn.setAttribute('aria-label', `Add one ${emoji}`);
    addBtn.disabled = count >= target || blocked;
    addBtn.onclick = onAdd;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'mini-btn';
    removeBtn.type = 'button';
    removeBtn.textContent = '➖';
    removeBtn.setAttribute('aria-label', `Remove one ${emoji}`);
    removeBtn.disabled = count <= 0 || blocked;
    removeBtn.onclick = onRemove;

    controls.appendChild(removeBtn);
    controls.appendChild(addBtn);
    card.appendChild(title);
    card.appendChild(countLabel);
    card.appendChild(items);
    card.appendChild(controls);
    return card;
  };

  wrap.appendChild(
    createAddCard(
      'First Number',
      currentQ.a,
      addGroup1Count,
      () => {
        if (blocked || addGroup1Count >= currentQ.a) return;
        addGroup1Count++;
        playAddEmojiSound();
        updateAdditionZone();
      },
      () => {
        if (blocked || addGroup1Count <= 0) return;
        addGroup1Count--;
        playToggleSound();
        updateAdditionZone();
      }
    )
  );

  const plus = document.createElement('div');
  plus.className = 'plus-sign';
  plus.textContent = '+';
  wrap.appendChild(plus);

  wrap.appendChild(
    createAddCard(
      'Second Number',
      currentQ.b,
      addGroup2Count,
      () => {
        if (blocked || addGroup2Count >= currentQ.b) return;
        addGroup2Count++;
        playAddEmojiSound();
        updateAdditionZone();
      },
      () => {
        if (blocked || addGroup2Count <= 0) return;
        addGroup2Count--;
        playToggleSound();
        updateAdditionZone();
      }
    )
  );

  content.appendChild(wrap);
}

function updateSubtractionZone() {
  const content = document.getElementById('emoji-content');
  const hint = document.getElementById('sub-hint');
  const remaining = placedCount - crossedSet.size;
  const canAdd = placedCount < currentQ.a;

  if (placedCount === 0) {
    document.getElementById('emoji-zone-title').textContent = `Tap ➕ to add your ${emoji}`;
  } else if (canAdd) {
    document.getElementById('emoji-zone-title').textContent = `${placedCount} added - add more or cross some out!`;
  } else {
    document.getElementById('emoji-zone-title').textContent = `Cross out ${currentQ.b} to take away!`;
  }

  hint.style.display = hintOn ? 'block' : 'none';
  hint.textContent = `${placedCount} added - ${crossedSet.size} crossed out - ${remaining} left`;

  content.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'sub-grid';

  for (let i = 0; i < placedCount; i++) {
    const btn = document.createElement('button');
    btn.className = `sub-animal${crossedSet.has(i) ? ' crossed' : ''}`;
    btn.type = 'button';
    btn.textContent = emoji;
    btn.setAttribute('aria-label', crossedSet.has(i) ? 'Undo cross out' : 'Cross out');
    btn.onclick = () => {
      if (blocked) return;
      if (crossedSet.has(i)) crossedSet.delete(i);
      else crossedSet.add(i);
      playToggleSound();
      updateSubtractionZone();
    };
    grid.appendChild(btn);
  }

  content.appendChild(grid);
  if (canAdd) {
    const controls = document.createElement('div');
    controls.className = 'sub-controls';
    const addBtn = document.createElement('button');
    addBtn.className = 'add-animal-btn';
    addBtn.type = 'button';
    addBtn.textContent = '➕';
    addBtn.setAttribute('aria-label', `Add one ${emoji}`);
    addBtn.title = `Add a ${emoji}`;
    addBtn.onclick = () => {
      if (blocked || placedCount >= currentQ.a) return;
      placedCount++;
      playAddEmojiSound();
      updateSubtractionZone();
    };
    controls.appendChild(addBtn);
    content.appendChild(controls);
  }
}

function checkAnswer() {
  if (blocked) return;
  if (selectedAnswer === null) {
    const fb = document.getElementById('feedback-msg');
    fb.textContent = 'Pick a number first! 👆';
    fb.className = 'feedback-msg wrong';
    playWrongSound();
    return;
  }

  blocked = true;
  const correct = selectedAnswer === currentQ.ans;
  const fb = document.getElementById('feedback-msg');
  if (currentQ.type === 'add') stats.addTotal++;
  else stats.subTotal++;

  if (correct) {
    score++;
    if (currentQ.type === 'add') stats.addCorrect++;
    else stats.subCorrect++;
    fb.textContent = ['Amazing! 🎉', 'You got it! ⭐', 'Brilliant! 🌟', 'Wonderful! 🎈', 'Super smart! 🦋'][Math.floor(Math.random() * 5)];
    fb.className = 'feedback-msg right';
    document.getElementById('math-blank').textContent = currentQ.ans;
    document.querySelectorAll('.emoji-item,.sub-animal:not(.crossed)').forEach((e) => {
      e.style.animation = 'none';
      setTimeout(() => {
        e.style.animation = 'bounce 0.5s ease';
      }, 10);
    });
    playCelebrationSound();
    launchConfetti();
    setTimeout(nextQuestion, 1800);
  } else {
    fb.textContent = 'Oops! Try again 🙈';
    fb.className = 'feedback-msg wrong';
    const picker = document.getElementById('number-picker');
    picker.classList.add('shake');
    playWrongSound();
    setTimeout(() => {
      picker.classList.remove('shake');
      blocked = false;
    }, 500);
  }
}

function nextQuestion() {
  qIndex++;
  if (qIndex >= 10) {
    showEnd();
    return;
  }
  loadQuestion();
}

function showEnd() {
  document.getElementById('main-screen').style.display = 'none';
  const end = document.getElementById('end-screen');
  const stars = score >= 9 ? '⭐⭐⭐' : score >= 6 ? '⭐⭐' : '⭐';
  const msg = score === 10 ? 'PERFECT!' : score >= 8 ? 'Amazing!' : score >= 5 ? 'Great job!' : 'Keep going!';
  const priorBest = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
  const best = Math.max(priorBest, score);
  localStorage.setItem(BEST_SCORE_KEY, String(best));
  const addPct = stats.addTotal ? Math.round((stats.addCorrect / stats.addTotal) * 100) : 0;
  const subPct = stats.subTotal ? Math.round((stats.subCorrect / stats.subTotal) * 100) : 0;
  end.innerHTML = `<div class="end-trophy">🏆</div>
  <div class="end-title">${msg}</div>
  <div class="end-score">${score} / 10</div>
  <div class="end-stars">${stars}</div>
  <div class="best-score">Best score: ${best} / 10</div>
  <div class="stats">Addition: ${addPct}% · Subtraction: ${subPct}%</div>
  <button class="play-again-btn" id="play-again-btn" type="button">Play Again! 🎮</button>`;
  end.style.display = 'flex';
  document.getElementById('play-again-btn').onclick = init;
  launchConfetti(60);
  if (score === 10) {
    playSound('endPerfect', playCelebrationSound);
  } else {
    playSound('endTryAgain', playWrongSound);
  }
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
      setTimeout(() => c.remove(), 3000);
    }, i * 40);
  }
}

function playTone(freq, durationMs) {
  if (!soundOn) return;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioCtx = new AudioCtx();
  }
  const ctx = audioCtx;
  if (ctx.state === 'suspended') ctx.resume();
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
  setTimeout(() => {
    osc.stop();
  }, durationMs);
}

function initSoundFx() {
  soundFx = {};
  Object.entries(SOUND_FILES).forEach(([key, src]) => {
    const audio = new Audio(src);
    audio.preload = 'auto';
    soundFx[key] = audio;
  });
}

function playSound(name, fallbackFn) {
  if (!soundOn) return;
  const sound = soundFx[name];
  if (!sound) {
    if (fallbackFn) fallbackFn();
    return;
  }
  const instance = sound.cloneNode();
  instance.play().catch(() => {
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
  if (!soundOn) return;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioCtx = new AudioCtx();
  }
  const ctx = audioCtx;
  if (ctx.state === 'suspended') ctx.resume();

  const bufferSize = Math.floor(ctx.sampleRate * 0.08);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

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

function playWrongSound() {
  playSound('wrong', () => playTone(220, 160));
}

function playSelectSound() {
  playSound('select', () => playTone(520, 60));
}

function playToggleSound() {
  playSound('toggle', () => playTone(360, 70));
}

function playAddEmojiSound() {
  playSound('addEmoji', () => playTone(430, 85));
}

function playSubmitSound() {
  playSound('submit', () => playTone(300, 55));
}

function updateSoundToggle() {
  const btn = document.getElementById('sound-toggle');
  btn.textContent = soundOn ? 'Sound: On' : 'Sound: Off';
  btn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
}

function updateHintToggle() {
  const btn = document.getElementById('hint-toggle');
  btn.textContent = hintOn ? 'Hint: On' : 'Hint: Off';
  btn.setAttribute('aria-pressed', hintOn ? 'true' : 'false');
}

document.getElementById('submit-btn').addEventListener('click', () => {
  playSubmitSound();
  checkAnswer();
});

document.getElementById('sound-toggle').addEventListener('click', () => {
  soundOn = !soundOn;
  updateSoundToggle();
  if (soundOn) playToggleSound();
});

document.getElementById('hint-toggle').addEventListener('click', () => {
  hintOn = !hintOn;
  updateHintToggle();
  if (soundOn) playToggleSound();
  if (currentQ) {
    if (currentQ.type === 'add') updateAdditionZone();
    else updateSubtractionZone();
  }
});

document.addEventListener('keydown', (e) => {
  if (document.getElementById('main-screen').style.display === 'none') return;

  if (e.key === 'Enter') {
    playSubmitSound();
    checkAnswer();
    return;
  }

  if (/^\d$/.test(e.key)) {
    keyInputBuffer += e.key;
    if (keyInputTimer) clearTimeout(keyInputTimer);
    keyInputTimer = setTimeout(() => {
      keyInputBuffer = '';
    }, 700);

    let n = Number(keyInputBuffer);
    if (n > maxAnswer) {
      keyInputBuffer = e.key;
      n = Number(keyInputBuffer);
    }

    if (n <= maxAnswer) {
      const btn = [...document.querySelectorAll('.num-btn')].find((b) => Number(b.textContent) === n);
      if (btn) selectNumber(n, btn);
    }
  }
});

updateSoundToggle();
updateHintToggle();
init();
