import fs from 'fs';
import path from 'path';

const WORKSPACE_DIR = process.cwd();
const IMAGES_DIR = path.join(WORKSPACE_DIR, 'public/images');

// Import sharp
const sharp = (await import('sharp')).default;

async function compressHeadshot(fileName, maxWidth = 800, quality = 82) {
  const filePath = path.join(IMAGES_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  const outputPath = path.join(IMAGES_DIR, `${baseName}.webp`);

  console.log(`Processing headshot: ${fileName} -> ${baseName}.webp`);

  try {
    const pipeline = sharp(filePath);
    pipeline.rotate(); // Auto-orient based on EXIF metadata
    pipeline.resize({ width: maxWidth, withoutEnlargement: true });

    await pipeline
      .webp({ quality })
      .toFile(outputPath);

    const oldSize = fs.statSync(filePath).size;
    const newSize = fs.statSync(outputPath).size;
    console.log(`Compressed: ${(oldSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024).toFixed(2)}KB`);

    // Remove the original file
    fs.unlinkSync(filePath);
    console.log(`Deleted original file: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
  }
}

async function run() {
  await compressHeadshot('jason-headshot-1.jpg', 800, 82);
  await compressHeadshot('jason-headshot-2.jpg', 800, 82);
  
  // Also delete unused jason-headshot-3.jpg and jason-headshot-4.jpg to save disk/repo space if they exist
  for (const file of ['jason-headshot-3.jpg', 'jason-headshot-4.jpg']) {
    const p = path.join(IMAGES_DIR, file);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`Deleted unused headshot: ${file}`);
    }
  }
}

run().catch(console.error);
