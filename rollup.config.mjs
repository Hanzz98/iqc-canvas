import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const external = [
  '@napi-rs/canvas',
  'path',
  'fs',
  'url',
  'emoji-db',
  './lib/emoji-image',
];

const plugins = [
  resolve({ preferBuiltins: true }),
  commonjs(),
  json(),
];

export default [
  {
    input: 'iqc.js',
    external,
    plugins,
    output: {
      file: 'dist/esm/index.js',
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true,
      paths: {
        './lib/emoji-image': '../../lib/emoji-image',
      },
    },
  },
  {
    input: 'iqc.js',
    external,
    plugins,
    output: {
      file: 'dist/cjs/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      interop: 'auto',
      inlineDynamicImports: true,
      paths: {
        './lib/emoji-image': '../../lib/emoji-image',
      },
    },
  },
];
