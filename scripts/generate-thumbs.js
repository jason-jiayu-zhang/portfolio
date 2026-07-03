import fs from 'fs';
import path from 'path';

const WORKSPACE_DIR = process.cwd();
const EXPERIMENTS_DIR = path.join(WORKSPACE_DIR, 'public/images/experiments');
const THUMB_WIDTH = 400;
const QUALITY = 70;

const sharp = (await import('sharp')).default;

async function run() {
  const files = fs.readdirSync(EXPERIMENTS_DIR).filter(
    (f) => f.endsWith('.webp') && !f.endsWith('-thumb.webp')
  );

  for (const file of files) {
    const srcPath = path.join(EXPERIMENTS_DIR, file);
    const thumbName = `${path.basename(file, '.webp')}-thumb.webp`;
    const thumbPath = path.join(EXPERIMENTS_DIR, thumbName);

    await sharp(srcPath).resize(THUMB_WIDTH).webp({ quality: QUALITY }).toFile(thumbPath);

    const srcKb = (fs.statSync(srcPath).size / 1024).toFixed(1);
    const thumbKb = (fs.statSync(thumbPath).size / 1024).toFixed(1);
    console.log(`${file}: ${srcKb}KB -> ${thumbName}: ${thumbKb}KB`);
  }
}

run().catch(console.error);
