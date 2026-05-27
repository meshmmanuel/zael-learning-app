import { state } from '../state.js';
import { els, prefersReducedMotion } from '../dom.js';
import { SPELLING_TOTAL, SPELLING_DECOYS } from '../config/index.js';
import { SPELLING_LISTS } from '../content/spelling-lists.js';
import { showScreen, requestGoHome } from '../router.js';
import { pickRandomBg } from '../ui/chrome.js';
import { launchConfetti } from '../ui/effects.js';
import { saveSpellingPrefs, getSpellingBest, setSpellingBest } from '../storage/spelling.js';
import { shuffle, starLineForScore } from '../utils/index.js';
import {
  playCelebrationSound,
  playWrongSound,
  playAlphaSound,
  playSubmitSound,
  playSound,
} from '../audio/index.js';
import { updateSpellingHearButton, playSpellWordLetterByLetter } from '../audio/index.js';
import { syncSpellingSetupUI } from './setup.js';

export function buildRevealMask(word) {
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

export function pickSpellingWords() {
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

export function decoyLetters(word) {
  const used = new Set(word.toLowerCase().split(''));
  const decoys = [];
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const candidates = shuffle(alphabet.split('')).filter((c) => !used.has(c));
  for (let i = 0; i < SPELLING_DECOYS && i < candidates.length; i++) decoys.push(candidates[i]);
  return decoys;
}

export function startSpellingRound() {
  state.activeGame = 'spelling';
  saveSpellingPrefs();
  pickRandomBg();
  state.spellingWords = pickSpellingWords();
  state.spellQIndex = 0;
  state.spellScore = 0;
  showScreen('spellingPlay');
  loadSpellQuestion();
}

export function loadSpellQuestion() {
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

export function renderSpellSlots() {
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

export function renderSpellBank() {
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

export function spellingWordComplete() {
  return state.spellFilled.every((c, i) => c === state.spellWord[i]);
}

export function updateSpellingSubmitState() {
  if (!els.spellingSubmitBtn) return;
  const ready = state.spellFilled.every((c) => c !== null && c !== undefined);
  els.spellingSubmitBtn.disabled = state.spellBlocked || !ready;
  updateSpellingHearButton();
}

export function checkSpellingAnswer() {
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

export function nextSpellQuestion() {
  state.spellQIndex++;
  if (state.spellQIndex >= SPELLING_TOTAL) {
    showSpellingEnd();
    return;
  }
  loadSpellQuestion();
}

export function showSpellingEnd() {
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

