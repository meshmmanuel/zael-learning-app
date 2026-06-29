import { state } from '../state.js';
import { NUMBER_LINE_CAPS } from '../config/index.js';
import { playSelectSound } from '../audio/index.js';

export function cancelNumberLineAnimation() {
  // No async animation to cancel when watch mode is removed.
}

export function getNumberLineWindow(q, difficulty = state.mathDifficulty) {
  const isAdd = q.type === 'add';
  const start = q.a;
  const jumps = q.b;
  const end = isAdd ? start + jumps : start - jumps;
  const pad = difficulty === 'easy' ? 2 : 1;
  let min = Math.max(0, Math.min(start, end) - pad);
  let max = Math.max(start, end) + pad;
  const cap = NUMBER_LINE_CAPS[difficulty] ?? NUMBER_LINE_CAPS.medium;
  if (max - min > cap - 1) {
    if (isAdd) {
      min = Math.max(0, start - pad);
      max = Math.min(cap - 1, end + pad);
    } else {
      min = Math.max(0, end - pad);
      max = Math.min(cap - 1, start + pad);
    }
  }
  return { min, max, start, end, jumps, isAdd };
}

function tickX(value, min, max, padX, innerWidth) {
  if (max === min) return padX + innerWidth / 2;
  return padX + ((value - min) / (max - min)) * innerWidth;
}

function arcPath(x1, x2, y, height) {
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y} Q ${mid} ${y - height} ${x2} ${y}`;
}

function describeJumps(win) {
  const dir = win.isAdd ? 'forward' : 'back';
  return `Start at ${win.start}, jump ${dir} ${win.jumps} time${win.jumps === 1 ? '' : 's'}, land on ${win.end}`;
}

export function numberLineTitle(q) {
  const win = getNumberLineWindow(q);
  return `Start at ${win.start}. Use ⬅️ and ➡️ to count!`;
}

function createJumpArc(svg, arcsGroup, fromVal, toVal, win, padX, innerWidth, lineY, arcH) {
  const x1 = tickX(fromVal, win.min, win.max, padX, innerWidth);
  const x2 = tickX(toVal, win.min, win.max, padX, innerWidth);
  const goingForward = toVal > fromVal;
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('class', 'number-line-jump');
  path.setAttribute('d', arcPath(x1, x2, lineY, arcH));
  path.setAttribute('stroke', goingForward ? '#2563eb' : '#dc2626');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', '2.5');
  path.setAttribute('stroke-dasharray', '6 4');
  arcsGroup.appendChild(path);
  return path;
}

export function renderNumberLine(root, q) {
  if (!root || !q) return;
  cancelNumberLineAnimation();
  const win = getNumberLineWindow(q);
  const padX = 28;
  const width = 320;
  const height = 120;
  const lineY = 72;
  const arcH = 22;
  const startColor = '#dc2626';
  const currentColor = '#2563eb';
  const innerWidth = width - padX * 2;
  const values = [];
  for (let n = win.min; n <= win.max; n++) values.push(n);

  root.innerHTML = '';
  root.hidden = false;
  root.setAttribute('role', 'group');
  root.setAttribute('aria-label', describeJumps(win));

  const wrap = document.createElement('div');
  wrap.className = 'number-line-wrap';

  const stage = document.createElement('div');
  stage.className = 'number-line-stage';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'number-line-side-btn';
  backBtn.innerHTML = '<span aria-hidden="true">⬅️</span>';
  backBtn.setAttribute('aria-label', 'Jump back one on the number line');

  const svgWrap = document.createElement('div');
  svgWrap.className = 'number-line-svg-wrap';

  const forwardBtn = document.createElement('button');
  forwardBtn.type = 'button';
  forwardBtn.className = 'number-line-side-btn';
  forwardBtn.innerHTML = '<span aria-hidden="true">➡️</span>';
  forwardBtn.setAttribute('aria-label', 'Jump forward one on the number line');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'number-line-svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('aria-hidden', 'true');

  const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  axis.setAttribute('class', 'number-line-axis');
  axis.setAttribute('x1', String(padX - 8));
  axis.setAttribute('y1', String(lineY));
  axis.setAttribute('x2', String(width - padX + 8));
  axis.setAttribute('y2', String(lineY));
  svg.appendChild(axis);

  values.forEach((n) => {
    const x = tickX(n, win.min, win.max, padX, innerWidth);
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('class', 'number-line-tick');
    tick.setAttribute('x1', String(x));
    tick.setAttribute('y1', String(lineY - 6));
    tick.setAttribute('x2', String(x));
    tick.setAttribute('y2', String(lineY + 6));
    svg.appendChild(tick);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'number-line-label');
    label.setAttribute('x', String(x));
    label.setAttribute('y', String(lineY + 24));
    label.setAttribute('text-anchor', 'middle');
    label.textContent = String(n);
    svg.appendChild(label);
  });

  const arcsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  arcsGroup.setAttribute('class', 'number-line-arcs');
  svg.appendChild(arcsGroup);

  const startDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  startDot.setAttribute('class', 'number-line-dot number-line-dot--start');
  startDot.setAttribute('cx', String(tickX(win.start, win.min, win.max, padX, innerWidth)));
  startDot.setAttribute('cy', String(lineY));
  startDot.setAttribute('r', '5');
  startDot.setAttribute('fill', startColor);
  svg.appendChild(startDot);

  const currentDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  currentDot.setAttribute('class', 'number-line-dot number-line-dot--current');
  currentDot.setAttribute('cx', String(tickX(win.start, win.min, win.max, padX, innerWidth)));
  currentDot.setAttribute('cy', String(lineY));
  currentDot.setAttribute('r', '6');
  currentDot.setAttribute('fill', currentColor);
  svg.appendChild(currentDot);

  const endDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  endDot.setAttribute('class', 'number-line-dot number-line-dot--end');
  endDot.setAttribute('cx', String(tickX(win.end, win.min, win.max, padX, innerWidth)));
  endDot.setAttribute('cy', String(lineY));
  endDot.setAttribute('r', '5');
  endDot.setAttribute('fill', currentColor);
  endDot.setAttribute('opacity', '0');
  svg.appendChild(endDot);

  svgWrap.appendChild(svg);
  stage.appendChild(backBtn);
  stage.appendChild(svgWrap);
  stage.appendChild(forwardBtn);
  wrap.appendChild(stage);

  root.appendChild(wrap);

  let currentPos = win.start;

  const moveCurrentDot = (pos) => {
    currentDot.setAttribute('cx', String(tickX(pos, win.min, win.max, padX, innerWidth)));
    endDot.setAttribute('opacity', pos === win.end ? '1' : '0');
  };

  const syncSideButtons = () => {
    const blocked = state.blocked;
    backBtn.disabled = blocked || currentPos <= win.min;
    forwardBtn.disabled = blocked || currentPos >= win.max;
  };

  const stepForward = () => {
    if (state.blocked || currentPos >= win.max) return;
    const from = currentPos;
    const to = currentPos + 1;
    createJumpArc(svg, arcsGroup, from, to, win, padX, innerWidth, lineY, arcH);
    currentPos = to;
    moveCurrentDot(currentPos);
    syncSideButtons();
    if (state.soundOn) playSelectSound();
  };

  const stepBack = () => {
    if (state.blocked || currentPos <= win.min) return;
    const from = currentPos;
    const to = currentPos - 1;
    createJumpArc(svg, arcsGroup, from, to, win, padX, innerWidth, lineY, arcH);
    currentPos = to;
    moveCurrentDot(currentPos);
    syncSideButtons();
    if (state.soundOn) playSelectSound();
  };

  forwardBtn.onclick = stepForward;
  backBtn.onclick = stepBack;
  syncSideButtons();
}

export function hideNumberLine(root) {
  cancelNumberLineAnimation();
  if (!root) return;
  root.hidden = true;
  root.innerHTML = '';
  root.removeAttribute('aria-label');
}
