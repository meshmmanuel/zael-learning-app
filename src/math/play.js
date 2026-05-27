import { state } from '../state.js';
import { els, prefersReducedMotion } from '../dom.js';
import { BASE_CONFIG, THEMES, canAddMoreEmojis } from '../config/index.js';
import { showScreen, requestGoHome } from '../router.js';
import { pickRandomBg } from '../ui/chrome.js';
import { launchConfetti } from '../ui/effects.js';
import { syncMathSetupUI } from './setup.js';
import {
  genQuestions,
  orderBlankCount,
  firstUnfilledBlankIndex,
} from './questions.js';
import { saveMathPrefs, getBestScore, setBestScore } from '../storage/math.js';
import { isOrderMode, isOrderQuestion, shuffle, starLineForScore } from '../utils/index.js';
import {
  playCelebrationSound,
  playWrongSound,
  playSelectSound,
  playToggleSound,
  playAddEmojiSound,
  playSubmitSound,
  playSound,
} from '../audio/index.js';

export function startMathRound() {
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

export function orderSlotId(index) {
  return `math-order-slot-${index}`;
}

export function setOrderSlot(index, text) {
  const slot = document.getElementById(orderSlotId(index));
  if (!slot) return;
  const value = text === null || text === undefined ? '?' : String(text);
  slot.textContent = value;
  slot.classList.toggle('math-order-num--filled', value !== '?');
  slot.setAttribute(
    'aria-label',
    value === '?' ? 'Blank to fill' : `Answer ${value}, tap to change`,
  );
}

export function updateOrderStepHint() {
  if (!els.mathOrderPrompt || !isOrderQuestion(state.currentQ)) return;
  const q = state.currentQ;
  const total = orderBlankCount(q);
  const filled = q.blankIndices.filter((i) => state.orderAnswers[i] !== undefined).length;
  if (filled >= total) {
    els.mathOrderPrompt.textContent = q.type === 'beforeAfter'
      ? 'Before & after — tap submit when ready! (tap a filled ? to change)'
      : 'Between — tap submit when ready! (tap a filled ? to change)';
    return;
  }
  const step = filled + 1;
  els.mathOrderPrompt.textContent = q.type === 'beforeAfter'
    ? `Fill in the missing numbers (${step} of ${total}) ⬅️➡️`
    : `Fill in the missing numbers (${step} of ${total}) ↔️`;
}

export function highlightActiveOrderSlot() {
  const q = state.currentQ;
  if (!q?.blankIndices) return;
  q.blankIndices.forEach((i) => {
    const slot = document.getElementById(orderSlotId(i));
    if (slot) slot.classList.toggle('math-order-num--active', i === state.orderActiveBlankIndex);
  });
}

export function clearOrderBlankAt(index) {
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
  document.querySelectorAll('.num-btn').forEach((b) => {
    b.classList.remove('selected');
    b.setAttribute('aria-pressed', 'false');
  });
  updateOrderStepHint();
  highlightActiveOrderSlot();
  updateSubmitState();
  playToggleSound();
}

export function renderOrderQuestion() {
  const q = state.currentQ;
  if (els.mathArithmeticView) els.mathArithmeticView.hidden = true;
  if (els.mathOrderView) els.mathOrderView.hidden = false;
  if (els.mathDisplay) els.mathDisplay.classList.add('math-display--order');
  if (els.mathArithmeticView) els.mathArithmeticView.hidden = true;
  if (els.mathOrderBlank) els.mathOrderBlank.hidden = true;
  if (els.mathBlank) els.mathBlank.textContent = '?';

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
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'math-order-num math-order-num--answer';
    slot.id = orderSlotId(i);
    slot.textContent = '?';
    slot.setAttribute('aria-label', 'Blank to fill');
    slot.onclick = () => clearOrderBlankAt(i);
    els.mathOrderSequence.appendChild(slot);
  });

  updateOrderStepHint();
  highlightActiveOrderSlot();
}

export function createOrderNum(n) {
  const el = document.createElement('span');
  el.className = 'math-order-num';
  el.textContent = n;
  return el;
}

export function createOrderGap() {
  const el = document.createElement('span');
  el.className = 'math-order-gap';
  el.textContent = '·';
  el.setAttribute('aria-hidden', 'true');
  return el;
}

export function resetMathAnswerBlank() {
  if (els.mathBlank) els.mathBlank.textContent = '?';
  if (els.mathOrderBlank) {
    els.mathOrderBlank.textContent = '?';
    els.mathOrderBlank.hidden = true;
  }
}

export function renderArithmeticQuestion() {
  if (els.mathArithmeticView) els.mathArithmeticView.hidden = false;
  if (els.mathOrderView) els.mathOrderView.hidden = true;
  if (els.mathDisplay) els.mathDisplay.classList.remove('math-display--order');
  if (els.mathOrderSequence) {
    els.mathOrderSequence.innerHTML = '';
    els.mathOrderSequence.setAttribute('aria-hidden', 'true');
  }
  resetMathAnswerBlank();
  els.num1Val.textContent = state.currentQ.a;
  els.opSign.textContent = state.currentQ.type === 'sub' ? '−' : '+';
  els.num2Val.textContent = state.currentQ.b;
}

export function loadQuestion() {
  state.blocked = false;
  state.selectedAnswer = null;
  state.orderAnswers = {};
  state.orderActiveBlankIndex = null;
  state.crossedSet.clear();
  state.placedCount = 0;
  state.addGroup1Count = 0;
  state.addGroup2Count = 0;
  state.keyInputBuffer = '';
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

export function buildNumberPicker() {
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

export function selectNumber(n, btn) {
  if (state.blocked) return;
  const q = state.currentQ;

  if (!isOrderQuestion(q) && state.selectedAnswer === n && btn.classList.contains('selected')) {
    state.selectedAnswer = null;
    if (els.mathBlank) els.mathBlank.textContent = '?';
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
    updateSubmitState();
    playToggleSound();
    return;
  }

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

export function buildEmojiZone() {
  els.emojiContent.innerHTML = '';
  if (state.currentQ.type === 'add') updateAdditionZone();
  else updateSubtractionZone();
}

export function updateAdditionZone() {
  const goalA = state.currentQ.a;
  const goalB = state.currentQ.b;
  els.emojiZoneTitle.textContent = `First group: ${goalA}. Second group: ${goalB}. Too many? Tap ➖`;

  els.subHint.style.display = state.hintOn ? 'block' : 'none';
  els.subHint.textContent = `${state.addGroup1Count} + ${state.addGroup2Count} — ${goalA} + ${goalB} = ?`;

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
    addBtn.disabled = !canAddMoreEmojis(count) || state.blocked;
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
    if (state.blocked || !canAddMoreEmojis(state.addGroup1Count)) return;
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
    if (state.blocked || !canAddMoreEmojis(state.addGroup2Count)) return;
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

export function removeLastSubEmoji() {
  if (state.blocked || state.placedCount <= 0) return;
  const removeIdx = state.placedCount - 1;
  const newCrossed = new Set();
  for (const i of state.crossedSet) {
    if (i < removeIdx) newCrossed.add(i);
  }
  state.crossedSet = newCrossed;
  state.placedCount--;
  playToggleSound();
  updateSubtractionZone();
}

export function updateSubtractionZone() {
  const takeB = state.currentQ.b;
  const remaining = state.placedCount - state.crossedSet.size;
  if (state.placedCount === 0) {
    els.emojiZoneTitle.textContent = `Add ${state.emoji}s, then cross out ${takeB}. Too many? Tap ➖`;
  } else {
    els.emojiZoneTitle.textContent = `${state.placedCount} ${state.emoji}s — cross out ${takeB}. Extra? Tap ➖`;
  }

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

  const controls = document.createElement('div');
  controls.className = 'sub-controls';
  const removeBtn = document.createElement('button');
  removeBtn.className = 'add-animal-btn';
  removeBtn.type = 'button';
  removeBtn.textContent = '➖';
  removeBtn.setAttribute('aria-label', `Remove last ${state.emoji}`);
  removeBtn.disabled = state.placedCount <= 0 || state.blocked;
  removeBtn.onclick = () => removeLastSubEmoji();
  const addBtn = document.createElement('button');
  addBtn.className = 'add-animal-btn';
  addBtn.type = 'button';
  addBtn.textContent = '➕';
  addBtn.setAttribute('aria-label', `Add one ${state.emoji}`);
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

export function isOrderAnswerComplete() {
  const q = state.currentQ;
  return q.blankIndices.every((i) => state.orderAnswers[i] !== undefined);
}

export function isOrderAnswerCorrect() {
  const q = state.currentQ;
  return q.blankIndices.every((i) => state.orderAnswers[i] === q.answers[i]);
}

export function showOrderCorrectAnswers() {
  const q = state.currentQ;
  q.blankIndices.forEach((i) => setOrderSlot(i, q.answers[i]));
}

export function resetOrderAnswersForRetry() {
  const q = state.currentQ;
  state.orderAnswers = {};
  state.orderActiveBlankIndex = firstUnfilledBlankIndex(q);
  q.blankIndices.forEach((i) => setOrderSlot(i, null));
  updateOrderStepHint();
  highlightActiveOrderSlot();
}

export function checkAnswer() {
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

export function nextQuestion() {
  state.qIndex++;
  if (state.qIndex >= BASE_CONFIG.totalQuestions) {
    showEnd();
    return;
  }
  loadQuestion();
}

export function showEnd() {
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

export function updateSubmitState() {
  const orderQ = state.currentQ && isOrderQuestion(state.currentQ);
  const ready = orderQ ? isOrderAnswerComplete() : state.selectedAnswer !== null;
  els.submitBtn.disabled = state.blocked || !ready;
}

