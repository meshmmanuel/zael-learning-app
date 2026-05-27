import * as esbuild from 'esbuild';
import { mkdirSync } from 'fs';

const watch = process.argv.includes('--watch');

mkdirSync('scripts', { recursive: true });

const ctx = await esbuild.context({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'app.runtime.js',
  format: 'iife',
  target: ['es2018'],
  legalComments: 'none',
});

if (watch) {
  await ctx.watch();
  console.log('Watching src/ → app.runtime.js');
} else {
  await ctx.rebuild();
  await ctx.dispose();
  console.log('Built app.runtime.js');
}
