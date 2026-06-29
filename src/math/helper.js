import { state } from '../state.js';
import { els } from '../dom.js';
import { renderNumberLine, hideNumberLine, numberLineTitle } from './number-line.js';

function safeHomeworkNumber(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(999, Math.trunc(value)));
}

export function setMathHomeworkOp(op) {
  state.mathHomeworkOp = op === 'add' ? 'add' : 'sub';
  syncMathHomeworkUI();
}

export function syncMathHomeworkUI() {
  state.mathHomeworkA = safeHomeworkNumber(state.mathHomeworkA);
  state.mathHomeworkB = safeHomeworkNumber(state.mathHomeworkB);

  if (els.homeworkOpAdd) {
    els.homeworkOpAdd.setAttribute('aria-pressed', state.mathHomeworkOp === 'add' ? 'true' : 'false');
  }
  if (els.homeworkOpSub) {
    els.homeworkOpSub.setAttribute('aria-pressed', state.mathHomeworkOp === 'sub' ? 'true' : 'false');
  }
  if (els.homeworkNumA) els.homeworkNumA.textContent = String(state.mathHomeworkA);
  if (els.homeworkNumB) els.homeworkNumB.textContent = String(state.mathHomeworkB);
}

export function adjustMathHomeworkValue(which, delta) {
  if (which === 'a') state.mathHomeworkA = safeHomeworkNumber(state.mathHomeworkA + delta);
  if (which === 'b') state.mathHomeworkB = safeHomeworkNumber(state.mathHomeworkB + delta);
  syncMathHomeworkUI();
}

function homeworkQuestionFromState() {
  const a = state.mathHomeworkA;
  const b = state.mathHomeworkB;
  if (state.mathHomeworkOp === 'sub' && b > a) return null;
  return {
    type: state.mathHomeworkOp,
    a,
    b,
    ans: state.mathHomeworkOp === 'add' ? a + b : a - b,
  };
}

export function clearMathHomeworkLine() {
  hideNumberLine(els.homeworkNumberLineRoot);
  if (els.homeworkLineTitle) els.homeworkLineTitle.textContent = 'Set your question and tap Open number line';
  if (els.homeworkLineFeedback) els.homeworkLineFeedback.textContent = '';
}

export function renderMathHomeworkLine() {
  const q = homeworkQuestionFromState();
  if (!q) {
    clearMathHomeworkLine();
    if (els.homeworkLineFeedback) {
      els.homeworkLineFeedback.textContent = 'For subtraction, use a bigger first number (like 8 − 5).';
    }
    return;
  }
  state.blocked = false;
  renderNumberLine(els.homeworkNumberLineRoot, q);
  if (els.homeworkLineTitle) els.homeworkLineTitle.textContent = numberLineTitle(q);
  if (els.homeworkLineFeedback) els.homeworkLineFeedback.textContent = '';
}
