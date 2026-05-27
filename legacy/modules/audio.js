export function createAudioController(soundFiles, isSoundOn) {
  let audioCtx = null;
  let soundFx = {};

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
    if (!isSoundOn()) return;
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
    setTimeout(() => {
      osc.stop();
    }, durationMs);
  }

  function initSoundFx() {
    soundFx = {};
    Object.entries(soundFiles).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      soundFx[key] = audio;
    });
  }

  function playSound(name, fallbackFn) {
    if (!isSoundOn()) return;
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
    if (!isSoundOn()) return;
    const ctx = ensureAudioCtx();
    if (!ctx) return;
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

  return {
    initSoundFx,
    playSound,
    playCorrectSound,
    playCelebrationSound,
    playWrongSound,
    playSelectSound,
    playToggleSound,
    playAddEmojiSound,
    playSubmitSound,
  };
}
