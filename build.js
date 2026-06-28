const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building iqc-canvas...\n');

// Pastikan folder dist ada
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
  console.log('📁 Created dist/ folder');
}

try {
  // Build untuk CommonJS
  console.log('⚙️  Building CommonJS...');
  esbuild.buildSync({
    entryPoints: ['index.js'],
    bundle: false,
    platform: 'node',
    format: 'cjs',
    outfile: 'dist/index.cjs',
    target: 'node14'
  });
  console.log('✅ CommonJS build complete: dist/index.cjs\n');

  // Build untuk ESM
  console.log('⚙️  Building ES Module...');
  esbuild.buildSync({
    entryPoints: ['index.js'],
    bundle: false,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/index.mjs',
    target: 'node14',
    banner: {
      js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`
    }
  });
  console.log('✅ ES Module build complete: dist/index.mjs\n');

  // Validasi output files
  const cjsExists = fs.existsSync('dist/index.cjs');
  const mjsExists = fs.existsSync('dist/index.mjs');

  if (cjsExists && mjsExists) {
    const cjsSize = (fs.statSync('dist/index.cjs').size / 1024).toFixed(2);
    const mjsSize = (fs.statSync('dist/index.mjs').size / 1024).toFixed(2);
    
    console.log('📦 Build Summary:');
    console.log(`   - CommonJS: ${cjsSize} KB`);
    console.log(`   - ES Module: ${mjsSize} KB`);
    console.log('\n🎉 Build completed successfully!');
    console.log('\n💡 Test builds:');
    console.log('   npm run test:cjs');
    console.log('   npm run test:esm');
  } else {
    throw new Error('Build files not found');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}