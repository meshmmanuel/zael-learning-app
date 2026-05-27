import { state } from '../state.js';
import { els, prefersReducedMotion } from '../dom.js';
import { BASE_CONFIG } from '../config/index.js';
import { buildArrowRound, ARROW_COLORS } from '../content/arrow.js';
import { showScreen, requestGoHome } from '../router.js';
import { pickRandomBg } from '../ui/chrome.js';
import { launchConfetti } from '../ui/effects.js';
import { saveSpellingPrefs, getSpellingBest, setSpellingBest } from '../storage/spelling.js';
import { shuffle, starLineForScore } from '../utils/index.js';
import {
  playCelebrationSound,
  playWrongSound,
  playAlphaSound,
  playAlphaSoundAndWait,
  playSubmitSound,
  playSound,
} from '../audio/index.js';
import { currentArrowPuzzle, arrowRoundWordGoal } from './arrow-helpers.js';
import { syncSpellingSetupUI } from './setup.js';

export function startArrowRound() {
  state.activeGame = 'arrow';
  saveSpellingPrefs();
  pickRandomBg();
  state.arrowPuzzles = buildArrowRound();
  state.arrowPuzzleIndex = 0;
  state.arrowScore = 0;
  showScreen('arrowPlay');
  loadArrowPuzzle();
}

export function clearArrowPicks() {
  state.arrowPickLeftIdx = null;
  state.arrowPickRightIdx = null;
  state.arrowListenGen += 1;
}

export function arrowPathForPair(leftIdx, rightIdx) {
  const puzzle = currentArrowPuzzle();
  if (!puzzle) return null;
  return puzzle.words.find(
    (entry) => entry.leftIdx === leftIdx && entry.rightIdx === rightIdx
  ) || null;
}

export function arrowBuiltWord() {
  const puzzle = currentArrowPuzzle();
  if (!puzzle || state.arrowPickLeftIdx === null || state.arrowPickRightIdx === null) return '';
  const left = puzzle.left[state.arrowPickLeftIdx];
  const right = puzzle.right[state.arrowPickRightIdx];
  if (!left || !right) return '';
  return `${left}${puzzle.center}${right}`;
}

export function findArrowWordMatch() {
  if (state.arrowPickLeftIdx === null || state.arrowPickRightIdx === null) return null;
  const puzzle = currentArrowPuzzle();
  if (!puzzle) return null;
  const entry = arrowPathForPair(state.arrowPickLeftIdx, state.arrowPickRightIdx);
  if (!entry || state.arrowFound.includes(entry.w)) return null;
  return entry.w === arrowBuiltWord() ? entry : null;
}

export function scheduleArrowPathsRedraw() {
  requestAnimationFrame(() => renderArrowPaths());
}

export function loadArrowPuzzle() {
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

export function renderArrowBoard() {
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

export function renderArrowPaths() {
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

export function renderArrowBuilder() {
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

export function renderArrowFoundList() {
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

export function updateArrowSubmitState() {
  if (!els.arrowSubmitBtn) return;
  const ready = state.arrowPickLeftIdx !== null && state.arrowPickRightIdx !== null;
  els.arrowSubmitBtn.disabled = state.arrowBlocked || !ready;
  updateArrowHearButton();
}

export function getArrowSoundsInOrder() {
  const puzzle = currentArrowPuzzle();
  if (!puzzle) return [];
  const out = [];
  if (state.arrowPickLeftIdx !== null) out.push(puzzle.left[state.arrowPickLeftIdx]);
  out.push(puzzle.center);
  if (state.arrowPickRightIdx !== null) out.push(puzzle.right[state.arrowPickRightIdx]);
  return out.filter(Boolean);
}

export function updateArrowHearButton() {
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

export async function playArrowWordLetterByLetter() {
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

export function checkArrowAnswer() {
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

export function nextArrowPuzzle() {
  state.arrowPuzzleIndex++;
  if (state.arrowPuzzleIndex >= state.arrowPuzzles.length) {
    showArrowEnd();
    return;
  }
  loadArrowPuzzle();
}

export function showArrowEnd() {
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

