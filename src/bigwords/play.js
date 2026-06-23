import { state } from '../state.js';
import { els } from '../dom.js';
import { BIGWORDS_TOTAL } from '../config/index.js';
import { wordsForDifficulty } from '../content/big-words.js';
import { showScreen, requestGoHome } from '../router.js';
import { pickRandomBg } from '../ui/chrome.js';
import { shuffle } from '../utils/index.js';
import { saveBigwordsPrefs } from '../storage/bigwords.js';
import { syncBigwordsSetupUI } from './setup.js';
import {
  playSelectSound,
  speakTextAndWait,
  cancelSpeech,
  updateBigwordsHearButtons,
} from '../audio/index.js';

function pickBigwordsRound() {
  const pool = wordsForDifficulty(state.bigwordsDifficulty);
  const picked = shuffle([...pool]).slice(0, BIGWORDS_TOTAL);
  while (picked.length < BIGWORDS_TOTAL && pool.length) {
    picked.push(pool[picked.length % pool.length]);
  }
  return picked.slice(0, BIGWORDS_TOTAL);
}

export function startBigwordsRound() {
  state.activeGame = 'bigwords';
  saveBigwordsPrefs();
  pickRandomBg();
  state.bigwordsEntries = pickBigwordsRound();
  state.bigwordsQIndex = 0;
  state.bigwordsListenGen += 1;
  state.bigwordsListenPlaying = false;
  showScreen('bigwordsPlay');
  loadBigword();
}

export function loadBigword() {
  cancelSpeech();
  state.bigwordsListenPlaying = false;
  state.bigwordsActiveChunk = null;

  const entry = state.bigwordsEntries[state.bigwordsQIndex];
  state.bigwordsCurrent = entry;

  els.bigwordsQLabel.textContent = `Word ${state.bigwordsQIndex + 1} of ${BIGWORDS_TOTAL}`;
  els.bigwordsProgressFill.style.width = `${((state.bigwordsQIndex + 1) / BIGWORDS_TOTAL) * 100}%`;
  els.bigwordsWord.textContent = entry.word.toUpperCase();
  els.bigwordsWord.setAttribute('aria-label', `Big word: ${entry.word}`);

  renderBigwordChunks(entry);
  updateBigwordsHearButtons();
}

function renderBigwordChunks(entry) {
  if (!els.bigwordsChunks) return;
  els.bigwordsChunks.innerHTML = '';
  entry.chunks.forEach((chunk, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bigwords-chunk';
    btn.textContent = chunk;
    btn.setAttribute('aria-label', `Hear chunk ${chunk}`);
    btn.onclick = () => onBigwordChunkTap(index);
    els.bigwordsChunks.appendChild(btn);
  });
}

function setActiveChunk(index) {
  state.bigwordsActiveChunk = index;
  if (!els.bigwordsChunks) return;
  els.bigwordsChunks.querySelectorAll('.bigwords-chunk').forEach((btn, i) => {
    btn.classList.toggle('bigwords-chunk--active', i === index);
    btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
  });
}

export async function onBigwordChunkTap(index) {
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

export async function repeatBigword() {
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

export function nextBigword() {
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

const DIFF_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export function showBigwordsEnd() {
  showScreen('end');
  const diffLabel = DIFF_LABELS[state.bigwordsDifficulty] || 'Medium';

  els.endScreen.innerHTML = `
    <div class="end-trophy">🎤</div>
    <div class="end-title">Great speaking practice!</div>
    <div class="end-score">You did ${BIGWORDS_TOTAL} words</div>
    <div class="stats">Big words → small words · ${diffLabel} · Adult guided (no score)</div>
    <div class="end-actions">
      <button class="play-again-btn" id="play-again-btn" type="button">Play again 🎮</button>
      <button class="secondary-btn" id="change-bigwords-btn" type="button">Change level ⚙️</button>
      <button class="secondary-btn" id="home-btn" type="button">Home 🏠</button>
    </div>
  `;

  document.getElementById('play-again-btn').onclick = () => startBigwordsRound();
  document.getElementById('change-bigwords-btn').onclick = () => {
    pickRandomBg();
    showScreen('bigwordsSetup');
    syncBigwordsSetupUI();
  };
  document.getElementById('home-btn').onclick = () => {
    state.activeGame = 'math';
    requestGoHome();
  };
}
