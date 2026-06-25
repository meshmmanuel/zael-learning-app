import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const watch = process.argv.includes('--watch');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

mkdirSync(join(root, 'scripts'), { recursive: true });

const ctx = await esbuild.context({
  entryPoints: [join(root, 'src/main.js')],
  bundle: true,
  outfile: join(root, 'app.runtime.js'),
  format: 'iife',
  target: ['es2018'],
  legalComments: 'none',
});

function assemblePublic() {
  const outDir = join(root, 'public');
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  cpSync(join(root, 'index.html'), join(outDir, 'index.html'));
  cpSync(join(root, 'styles.css'), join(outDir, 'styles.css'));
  cpSync(join(root, 'app.runtime.js'), join(outDir, 'app.runtime.js'));
  cpSync(join(root, 'audio'), join(outDir, 'audio'), { recursive: true });

  console.log('Assembled public/ for deploy');
}

if (watch) {
  await ctx.watch();
  console.log('Watching src/ → app.runtime.js');
} else {
  await ctx.rebuild();
  await ctx.dispose();
  console.log('Built app.runtime.js');
  assemblePublic();
}
