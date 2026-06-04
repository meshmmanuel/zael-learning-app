import { state } from '../state.js';
import { els, prefersReducedMotion } from '../dom.js';
import { BASE_CONFIG, MEASURE_TOTAL } from '../config/index.js';
import { MEASUREMENT_ITEMS } from '../content/measurement-items.js';
import { showScreen, requestGoHome } from '../router.js';
import { pickRandomBg } from '../ui/chrome.js';
import { launchConfetti } from '../ui/effects.js';
import { saveMeasurePrefs, getMeasureBest, setMeasureBest } from '../storage/measurement.js';
import { shuffle, starLineForScore } from '../utils/index.js';
import { playCelebrationSound, playWrongSound, playSelectSound, playSound } from '../audio/index.js';
import { syncMeasureSetupUI } from './setup.js';

function resolveQuestionType(item) {
  if (state.measureMode === 'presents') return 'presents';
  if (state.measureMode === 'heavier') return 'heavier';
  if (state.measureMode === 'lighter') return 'lighter';
  if (item.types.includes('presents') && Math.random() < 0.25) return 'presents';
  if (Math.random() < 0.5) return 'heavier';
  return 'lighter';
}

export function pickMeasureQuestions() {
  const pool = MEASUREMENT_ITEMS.filter((item) => {
    if (item.intro) return false;
    if (state.measureMode === 'mixed') return true;
    return item.types.includes(state.measureMode);
  });
  const picked = shuffle([...pool]).slice(0, MEASURE_TOTAL);
  while (picked.length < MEASURE_TOTAL && MEASUREMENT_ITEMS.length) {
    picked.push(MEASUREMENT_ITEMS[picked.length % MEASUREMENT_ITEMS.length]);
  }
  return picked.slice(0, MEASURE_TOTAL).map((item) => ({
    item,
    qType: resolveQuestionType(item),
  }));
}

function promptFor(q) {
  const { item, qType } = q;
  if (qType === 'presents') return item.promptPresents || 'Tap the heaviest, then the lightest.';
  if (qType === 'lighter') return item.promptLighter || 'Which is lighter?';
  return item.promptHeavier || 'Which is heavier?';
}

function correctSideFor(q) {
  const heavy = q.item.heavySide;
  if (q.qType === 'lighter') return heavy === 'left' ? 'right' : 'left';
  return heavy;
}

export function startMeasureRound() {
  state.activeGame = 'measurement';
  saveMeasurePrefs();
  pickRandomBg();
  state.measureQuestions = pickMeasureQuestions();
  state.measureQIndex = 0;
  state.measureScore = 0;
  showScreen('measurePlay');
  loadMeasureQuestion();
}

export function loadMeasureQuestion() {
  state.measureBlocked = false;
  state.measurePresentStep = 'heaviest';
  state.measurePresentPicks = {};

  const q = state.measureQuestions[state.measureQIndex];
  state.measureCurrentQ = q;

  els.measureQLabel.textContent = `Question ${state.measureQIndex + 1} of ${MEASURE_TOTAL}`;
  els.measureProgressFill.style.width = `${((state.measureQIndex + 1) / MEASURE_TOTAL) * 100}%`;
  els.measurePrompt.textContent = promptFor(q);
  els.measureFeedback.textContent = '';
  els.measureFeedback.className = 'feedback-msg';
  els.measureHint.textContent =
    q.qType === 'presents'
      ? 'First tap the heaviest (purple), then the lightest (green).'
      : 'Tip: the side touching the ground is heavier.';

  renderMeasureScene(q);
}

function renderMeasureScene(q) {
  const { item, qType } = q;
  const heavySide = item.heavySide;
  const tiltClass = heavySide === 'left' ? 'measure-scale--tilt-left' : 'measure-scale--tilt-right';
  const sceneClass = item.scene === 'seesaw' ? 'measure-scale--seesaw' : 'measure-scale--balance';

  els.measureScale.className = `measure-scale ${sceneClass} ${tiltClass}`;

  const isSeesaw = item.scene === 'seesaw';
  const sides = [
    { key: 'left', data: item.left },
    { key: 'right', data: item.right },
  ];

  els.measureSides.innerHTML = '';
  els.measureSides.className = isSeesaw ? 'measure-sides measure-sides--seesaw' : 'measure-sides measure-sides--balance';

  sides.forEach(({ key, data }) => {
    const wrap = document.createElement('div');
    wrap.className = `measure-side measure-side--${key}`;

    const choice = document.createElement('button');
    choice.type = 'button';
    choice.className = isSeesaw ? 'measure-seat measure-choice' : 'measure-platform measure-choice';
    choice.dataset.side = key;
    choice.setAttribute('aria-label', data.label);
    choice.addEventListener('click', () => onMeasurePick(key));

    const figure = document.createElement('div');
    figure.className = `measure-item ${data.sizeClass || ''}`.trim();
    figure.textContent = data.emoji;
    figure.setAttribute('aria-hidden', 'true');

    choice.appendChild(figure);

    if (data.caption) {
      const cap = document.createElement('span');
      cap.className = 'measure-caption';
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
  choice.classList.remove('measure-choice--purple', 'measure-choice--green', 'measure-choice--correct', 'measure-choice--wrong');
  if (kind === 'purple') choice.classList.add('measure-choice--purple');
  if (kind === 'green') choice.classList.add('measure-choice--green');
  if (kind === 'correct') choice.classList.add('measure-choice--correct');
  if (kind === 'wrong') choice.classList.add('measure-choice--wrong');
}

function clearMeasureChoiceMarks() {
  els.measureSides.querySelectorAll('.measure-choice').forEach((el) => {
    el.classList.remove('measure-choice--purple', 'measure-choice--green', 'measure-choice--correct', 'measure-choice--wrong');
  });
}

function onMeasurePick(side) {
  if (state.measureBlocked) return;
  const q = state.measureCurrentQ;
  if (!q) return;

  playSelectSound();

  if (q.qType === 'presents') {
    handlePresentPick(side);
    return;
  }

  const correct = correctSideFor(q);
  if (side === correct) {
    state.measureBlocked = true;
    state.measureScore++;
    markMeasureChoice(side, 'correct');
    els.measureFeedback.textContent = ['Yes! 🎉', 'You got it! ⭐', 'Super! 🌟'][Math.floor(Math.random() * 3)];
    els.measureFeedback.className = 'feedback-msg right';
    playCelebrationSound();
    if (!prefersReducedMotion) launchConfetti();
    setTimeout(nextMeasureQuestion, BASE_CONFIG.nextQuestionDelayMs);
  } else {
    state.measureBlocked = true;
    markMeasureChoice(side, 'wrong');
    els.measureFeedback.textContent = 'Look at which side is down — that one is heavier! Try again 💪';
    els.measureFeedback.className = 'feedback-msg wrong';
    playWrongSound();
    setTimeout(() => {
      state.measureBlocked = false;
      clearMeasureChoiceMarks();
      els.measureFeedback.textContent = '';
      els.measureFeedback.className = 'feedback-msg';
    }, BASE_CONFIG.wrongAnswerUnlockDelayMs);
  }
}

function handlePresentPick(side) {
  const heavy = state.measureCurrentQ.item.heavySide;
  const light = heavy === 'left' ? 'right' : 'left';

  if (state.measurePresentStep === 'heaviest') {
    if (side !== heavy) {
      state.measureBlocked = true;
      markMeasureChoice(side, 'wrong');
      els.measureFeedback.textContent = 'The heaviest goes down on the scale. Try the other one!';
      els.measureFeedback.className = 'feedback-msg wrong';
      playWrongSound();
      setTimeout(() => {
        state.measureBlocked = false;
        clearMeasureChoiceMarks();
        els.measureFeedback.textContent = '';
      }, BASE_CONFIG.wrongAnswerUnlockDelayMs);
      return;
    }
    state.measurePresentPicks.heaviest = side;
    markMeasureChoice(side, 'purple');
    state.measurePresentStep = 'lightest';
    els.measureFeedback.textContent = 'Great! Now tap the lightest present.';
    els.measureFeedback.className = 'feedback-msg';
    playSelectSound();
    return;
  }

  if (state.measurePresentStep === 'lightest') {
    if (side !== light) {
      state.measureBlocked = true;
      markMeasureChoice(side, 'wrong');
      els.measureFeedback.textContent = 'The lightest side is up high. Try the other present!';
      els.measureFeedback.className = 'feedback-msg wrong';
      playWrongSound();
      setTimeout(() => {
        state.measureBlocked = false;
        clearMeasureChoiceMarks();
        if (state.measurePresentPicks.heaviest) {
          markMeasureChoice(state.measurePresentPicks.heaviest, 'purple');
        }
        els.measureFeedback.textContent = 'Now tap the lightest present.';
      }, BASE_CONFIG.wrongAnswerUnlockDelayMs);
      return;
    }
    state.measurePresentPicks.lightest = side;
    markMeasureChoice(side, 'green');
    state.measureBlocked = true;
    state.measureScore++;
    els.measureFeedback.textContent = ['Perfect! 🎉', 'Both right! ⭐'][Math.floor(Math.random() * 2)];
    els.measureFeedback.className = 'feedback-msg right';
    playCelebrationSound();
    if (!prefersReducedMotion) launchConfetti();
    setTimeout(nextMeasureQuestion, BASE_CONFIG.nextQuestionDelayMs);
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

const MODE_LABELS = {
  mixed: 'Mixed',
  heavier: 'Heavier',
  lighter: 'Lighter',
  presents: 'Presents',
};

export function showMeasureEnd() {
  showScreen('end');
  const total = MEASURE_TOTAL;
  const stars = starLineForScore(state.measureScore, total);
  const msg =
    state.measureScore === total
      ? 'PERFECT!'
      : state.measureScore >= Math.ceil(total * 0.8)
        ? 'Amazing!'
        : state.measureScore >= Math.ceil(total * 0.5)
          ? 'Great job!'
          : 'Keep going!';
  const best = Math.max(getMeasureBest(), state.measureScore);
  setMeasureBest(best);
  const modeLabel = MODE_LABELS[state.measureMode] || 'Mixed';

  els.endScreen.innerHTML = `
    <div class="end-trophy">🏆</div>
    <div class="end-title">${msg}</div>
    <div class="end-score">${state.measureScore} / ${total}</div>
    <div class="end-stars">${stars}</div>
    <div class="best-score">Best (${modeLabel}): ${best} / ${total}</div>
    <div class="stats">Size &amp; measure round complete · ${modeLabel}</div>
    <div class="end-actions">
      <button class="play-again-btn" id="play-again-btn" type="button">Play again 🎮</button>
      <button class="secondary-btn" id="change-measure-btn" type="button">Change mode ⚙️</button>
      <button class="secondary-btn" id="home-btn" type="button">Home 🏠</button>
    </div>
  `;

  document.getElementById('play-again-btn').onclick = () => startMeasureRound();
  document.getElementById('change-measure-btn').onclick = () => {
    pickRandomBg();
    showScreen('measureSetup');
    syncMeasureSetupUI();
  };
  document.getElementById('home-btn').onclick = () => {
    state.activeGame = 'math';
    requestGoHome();
  };

  if (!prefersReducedMotion) launchConfetti(60);
  if (state.measureScore === total) playSound('endPerfect', playCelebrationSound);
  else playSound('endTryAgain', playWrongSound);
}
