export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const els = {
  app: document.getElementById('app'),
  mainScreen: document.getElementById('main-screen'),
  endScreen: document.getElementById('end-screen'),
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

export function isTypingTarget(target) {
  if (!target || !(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}
