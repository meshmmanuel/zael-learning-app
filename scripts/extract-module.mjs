import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const lines = readFileSync(join(__dirname, '_runtime-body.js'), 'utf8').split('\n');

const [outPath, start, end, header = '', mode = 'export-top'] = process.argv.slice(2);
const startN = Number(start);
const endN = Number(end);

let code = lines
  .slice(startN - 1, endN)
  .map((line) => (line.startsWith('  ') ? line.slice(2) : line))
  .join('\n');

if (mode === 'export-top') {
  code = code
    .split('\n')
    .map((line) => {
      if (/^function /.test(line)) return `export ${line}`;
      if (/^async function /.test(line)) return `export ${line}`;
      if (/^const ([A-Z][A-Z0-9_]*)/.test(line)) return `export ${line}`;
      if (/^const ([a-z][a-zA-Z0-9_]*) = \(/.test(line)) return `export ${line}`;
      return line;
    })
    .join('\n');
}

mkdirSync(dirname(join(root, outPath)), { recursive: true });
writeFileSync(join(root, outPath), header + code + '\n');
console.log('wrote', outPath);
