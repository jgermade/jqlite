import { build } from 'esbuild';

const common = {
  bundle: true,
  target: 'es2020',
  logLevel: 'info'
};

await build({
  ...common,
  entryPoints: ['src/index.js'],
  format: 'esm',
  outfile: 'dist/jqlite.mjs'
});

await build({
  ...common,
  entryPoints: ['src/index.js'],
  format: 'cjs',
  outfile: 'dist/jqlite.cjs',
  footer: { js: 'module.exports = Object.assign(module.exports.default, module.exports);' }
});

await build({
  ...common,
  entryPoints: ['src/global.js'],
  format: 'iife',
  outfile: 'dist/jqlite.global.js'
});

await build({
  ...common,
  entryPoints: ['src/global.js'],
  format: 'iife',
  minify: true,
  outfile: 'dist/jqlite.global.min.js'
});
