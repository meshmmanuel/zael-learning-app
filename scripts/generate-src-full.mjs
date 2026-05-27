import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const lines = readFileSync(join(__dirname, '_runtime-body.js'), 'utf8').split('\n');

function s(a, b) {
  return lines.slice(a - 1, b).join('\n').replace(/^  /gm, '');
}

function exportFn(code) {
  return code
    .replace(/^function /gm, 'export function ')
    .replace(/^async function /gm, 'export async function ')
    .replace(/^const ([A-Z][A-Z0-9_]*)/gm, 'export const $1')
    .replace(/^const ([a-z][a-zA-Z0-9_]*) = \(/gm, 'export const $1 = (')
    .replace(/^let /gm, 'let ');
}

function w(path, content) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content.trimEnd() + '\n');
  console.log(path);
}

w(
  'src/router.js',
  `import { state } from './state.js';
import { els, prefersReducedMotion } from './dom.js';
import { pickRandomBg } from './ui/chrome.js';

export const NAV_TITLE = ${JSON.stringify(
    {
      home: 'Kids Learning Playground',
      mathSetup: 'Numbers — Set up',
      spellingSetup: 'Spelling — Set up',
      play: 'Numbers — Practice',
      phonicsPlay: 'Letter sounds',
      spellingPlay: 'Spelling — Practice',
      arrowPlay: 'Arrow words — Practice',
      end: 'Round finished!',
    },
    null,
    2,
  ).replace(/\n/g, '\n')};

let currentRoute = 'home';

export function getCurrentRoute() {
  return currentRoute;
}

${exportFn(s(550, 689))}`,
);

w(
  'src/ui/chrome.js',
  `import { state } from '../state.js';
import { els } from '../dom.js';
import { PASTELS } from '../config/index.js';

${exportFn(s(545, 548))}

${exportFn(s(550, 559))}`,
);

// Remove duplicate updateAppNav from router - chrome has pickRandomBg only
// Fix: chrome should only have pickRandomBg, updateAppNav stays in router

let chrome = readFileSync(join(root, 'src/ui/chrome.js'), 'utf8');
chrome = chrome.replace(/export function updateAppNav[\s\S]*?^}/m, '').trim() + '\n';
writeFileSync(join(root, 'src/ui/chrome.js'), chrome);

let router = readFileSync(join(root, 'src/router.js'), 'utf8');
if (!router.includes('export function updateAppNav')) {
  router = router.replace(
    'export function openAppModal',
    `${exportFn(s(550, 559))}\n\nexport function openAppModal`,
  );
}
writeFileSync(join(root, 'src/router.js'), router);

w(
  'src/math/setup.js',
  `import { state } from '../state.js';
import { els } from '../dom.js';
import { MATH_MODES_ALL } from '../config/index.js';
import { STORAGE } from '../config/index.js';
import { playSelectSound } from '../audio/index.js';

${exportFn(s(515, 543))}`,
);

w(
  'src/math/questions.js',
  `import { state } from '../state.js';
import {
  BASE_CONFIG,
  DIFFICULTY_PRESETS,
  ORDER_LAYOUT,
} from '../config/index.js';
import {
  rnd,
  shuffle,
  isOrderMode,
  isOrderQuestion,
  getOrderRange,
} from '../utils/index.js';

${exportFn(s(691, 778))}`,
);

w(
  'src/audio/index.js',
  `import { state } from '../state.js';
import {
  SOUND_FILES,
  ALPHA_SOUND_SRC,
  PHONICS_SOUND_SRC,
} from '../config/index.js';

let audioCtx = null;
let soundFx = {};
let alphaSoundFx = {};
let phonicsSoundFx = {};

${exportFn(s(1621, 1880))}`,
);

w(
  'src/ui/effects.js',
  `import { prefersReducedMotion } from '../dom.js';
import { BASE_CONFIG } from '../config/index.js';

${exportFn(s(2446, 2462))}`,
);

w(
  'src/ui/toggles.js',
  `import { state } from '../state.js';
import { els } from '../dom.js';
import { playToggleSound } from '../audio/index.js';

${exportFn(s(2464, 2496))}`,
);

console.log('phase 2 done');
