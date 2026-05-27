import { state } from '../state.js';
import { els } from '../dom.js';
import { SOUND_FILES, ALPHA_SOUND_SRC, PHONICS_SOUND_SRC } from '../config/index.js';

let audioCtx = null;
let soundFx = {};
let alphaSoundFx = {};
let phonicsSoundFx = {};

export function ensureAudioCtx() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function playTone(freq, durationMs) {
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

export function initSoundFx() {
  soundFx = {};
  Object.entries(SOUND_FILES).forEach(([k, src]) => {
    const a = new Audio(src);
    a.preload = 'auto';
    soundFx[k] = a;
  });
}

export function initAlphaSounds() {
  alphaSoundFx = {};
  Object.entries(ALPHA_SOUND_SRC).forEach(([letter, src]) => {
    const a = new Audio(src);
    a.preload = 'auto';
    alphaSoundFx[letter] = a;
  });
}

export function initPhonicsSounds() {
  phonicsSoundFx = {};
  Object.entries(PHONICS_SOUND_SRC).forEach(([letter, src]) => {
    const a = new Audio(src);
    a.preload = 'auto';
    phonicsSoundFx[letter] = a;
  });
}

export function playPhonicsSound(letter) {
  if (!state.soundOn) return;
  const k = String(letter).toLowerCase();
  if (!PHONICS_SOUND_SRC[k]) return;
  const base = phonicsSoundFx[k];
  if (!base) return;
  const inst = base.cloneNode();
  inst.play().catch(() => {});
}

export function playPhonicsSoundAndWait(letter) {
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

export function playAlphaSound(letter) {
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
export function playAlphaSoundAndWait(letter) {
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

export function getSpellingSoundsInSlotOrder() {
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

export function updateSpellingHearButton() {
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

export async function playSpellWordLetterByLetter() {
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

export function playSound(name, fallbackFn) {
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

export function playCorrectSound() {
  playSound('correct', () => {
    playTone(660, 100);
    setTimeout(() => playTone(880, 120), 80);
  });
}

export function playClapSound() {
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

export function playCelebrationSound() {
  playSound('celebration', () => {
    playCorrectSound();
    setTimeout(playClapSound, 40);
    setTimeout(() => playTone(990, 130), 160);
  });
}

export const playWrongSound = () => playSound('wrong', () => playTone(220, 160));
export const playSelectSound = () => playSound('select', () => playTone(520, 60));
export const playToggleSound = () => playSound('toggle', () => playTone(360, 70));
export const playAddEmojiSound = () => playSound('addEmoji', () => playTone(430, 85));
export const playSubmitSound = () => playSound('submit', () => playTone(300, 55));

