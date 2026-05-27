/**
 * One-time helper: generates src/ modules from scripts/_runtime-body.js
 * Run: node scripts/split-src.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const body = readFileSync(join(__dirname, '_runtime-body.js'), 'utf8').split('\n');

function slice(start, end) {
  return body.slice(start - 1, end).join('\n');
}

function exportify(code, { exportConsts = true, exportFuncs = true } = {}) {
  let out = code;
  if (exportConsts) {
    out = out.replace(/^  const ([A-Z][A-Z0-9_]*)/gm, 'export const $1');
  }
  if (exportFuncs) {
    out = out.replace(/^  function ([a-zA-Z0-9_]+)/gm, 'export function $1');
    out = out.replace(/^  const ([a-z][a-zA-Z0-9_]*) = \(/gm, 'export const $1 = (');
    out = out.replace(/^  async function ([a-zA-Z0-9_]+)/gm, 'export async function $1');
  }
  return out.replace(/^  /gm, '');
}

function write(rel, header, code, opts) {
  const dir = dirname(join(root, rel));
  mkdirSync(dir, { recursive: true });
  const content = `${header}\n${exportify(code, opts)}\n`;
  writeFileSync(join(root, rel), content);
  console.log('wrote', rel);
}

write(
  'src/config/index.js',
  '// Game constants and asset maps',
  slice(1, 131),
  { exportConsts: true, exportFuncs: true },
);

write(
  'src/content/spelling-lists.js',
  '// Word lists for picture spelling',
  slice(249, 268),
);

write(
  'src/content/arrow.js',
  `import { SPELLING_LISTS } from './spelling-lists.js';
import { shuffle, rnd } from '../utils/index.js';
import {
  ARROW_COLOR_IDS,
  ARROW_WORDS_MIN,
  ARROW_WORDS_MAX,
  ARROW_BOARDS_PER_ROUND,
} from '../config/index.js';

`,
  slice(133, 247),
);

write('src/state.js', '/** @typedef {import("./state.js").AppState} AppState */\n\n', slice(270, 321), {
  exportConsts: false,
  exportFuncs: false,
});

// state needs export
let stateFile = readFileSync(join(root, 'src/state.js'), 'utf8');
stateFile = stateFile.replace('const state =', 'export const state =');
writeFileSync(join(root, 'src/state.js'), stateFile);

write(
  'src/dom.js',
  '',
  slice(323, 413) +
    '\n\nexport function isTypingTarget(t) {\n  return !!(\n    t &&\n    t instanceof HTMLElement &&\n    (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))\n  );\n}\n',
  { exportConsts: true, exportFuncs: false },
);

// dom export prefersReducedMotion and els
let domFile = readFileSync(join(root, 'src/dom.js'), 'utf8');
domFile = domFile
  .replace('const prefersReducedMotion', 'export const prefersReducedMotion')
  .replace('const els =', 'export const els =');
writeFileSync(join(root, 'src/dom.js'), domFile);

console.log('split-src: base modules written. Add activity modules manually or extend this script.');
