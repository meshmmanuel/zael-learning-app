/**
 * Generates modular src/ from scripts/_runtime-body.js
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const lines = readFileSync(join(__dirname, '_runtime-body.js'), 'utf8').split('\n');

function s(a, b) {
  return lines.slice(a - 1, b).join('\n').replace(/^  /gm, '');
}

function w(path, content) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content.trimEnd() + '\n');
  console.log(path);
}

const exportFn = (code) =>
  code
    .replace(/^function /gm, 'export function ')
    .replace(/^async function /gm, 'export async function ')
    .replace(/^const ([A-Z][A-Z0-9_]*)/gm, 'export const $1')
    .replace(/^const ([a-z][a-zA-Z0-9_]*) = \(/gm, 'export const $1 = (');

w('src/config/index.js', exportFn(s(1, 131)));

w('src/content/spelling-lists.js', exportFn(s(249, 268)));

w(
  'src/content/arrow.js',
  `import { SPELLING_LISTS } from './spelling-lists.js';
import { shuffle, rnd } from '../utils/index.js';
import {
  ARROW_COLOR_IDS,
  ARROW_WORDS_MIN,
  ARROW_WORDS_MAX,
  ARROW_BOARDS_PER_ROUND,
} from '../config/index.js';

${exportFn(s(133, 247))}`,
);

w('src/state.js', exportFn(s(270, 321)).replace('const state', 'export const state'));

w(
  'src/dom.js',
  `${exportFn(s(323, 324))}
${exportFn(s(325, 413))}`,
);

w(
  'src/utils/index.js',
  `import { state } from '../state.js';
import { MATH_MODES_ORDER, ORDER_RANGES } from '../config/index.js';

${exportFn(s(433, 460))}`,
);

w(
  'src/storage/math.js',
  `import { state } from '../state.js';
import { STORAGE, LEGACY_BEST_KEY, MATH_MODES_ALL } from '../config/index.js';

${exportFn(s(462, 513))}`,
);

w(
  'src/storage/spelling.js',
  `import { state } from '../state.js';
import { STORAGE } from '../config/index.js';

${exportFn(s(780, 808))}`,
);

console.log('done base');
