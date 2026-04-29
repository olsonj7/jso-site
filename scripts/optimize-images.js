#!/usr/bin/env node
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const repoRoot = path.join(__dirname, '..');
const inputDir = path.join(repoRoot, 'assets', 'images');
const outDir = path.join(inputDir, 'optimized');

if (!fs.existsSync(inputDir)) {
  console.error('Input images directory not found:', inputDir);
  process.exit(1);
}
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const patterns = ['**/*.jpg', '**/*.jpeg', '**/*.png'];
const sizes = [320, 640, 1280];

async function processFile(absPath) {
  const rel = path.relative(inputDir, absPath);
  const base = path.basename(absPath, path.extname(absPath)).replace(/\s+/g, '-').toLowerCase();
  const results = [];

  for (const w of sizes) {
    const outJ = path.join(outDir, `${base}-${w}w.jpg`);
    const outW = path.join(outDir, `${base}-${w}w.webp`);
    await sharp(absPath)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outJ);
    await sharp(absPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outW);
    results.push({ width: w, jpg: path.relative(inputDir, outJ), webp: path.relative(inputDir, outW) });
  }

  // optimized original as webp
  const outOrigWebp = path.join(outDir, `${base}-orig.webp`);
  await sharp(absPath).webp({ quality: 80 }).toFile(outOrigWebp);
  results.push({ width: 'orig', webp: path.relative(inputDir, outOrigWebp) });

  return { original: rel, variants: results };
}

async function main(){
  try {
    const files = patterns.flatMap(p => glob.sync(p, { cwd: inputDir, absolute: true, nodir: true }));
    // remove files already in optimized folder
    const filtered = files.filter(f => !f.includes(path.join('assets', 'images', 'optimized')) && !f.includes(`${path.sep}optimized${path.sep}`));
    console.log('Found', filtered.length, 'image(s) to process');
    const manifest = {};

    for (const f of filtered) {
      try {
        const res = await processFile(f);
        manifest[res.original] = res.variants;
        console.log('Processed:', res.original);
      } catch (e) {
        console.error('Failed processing', f, e.message || e);
      }
    }

    fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('Done. Optimized images are in', outDir);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
