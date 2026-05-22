/**
 * Optimise les images sous public/assets/images/
 * Génère des variantes WebP (400w, 800w, 1200w) + recompresse le JPEG/PNG source.
 *
 * Usage: npm run optimize:images
 */
import { readdir, stat } from 'fs/promises';
import { join, dirname, extname, basename, parse as parsePath } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_DIR = join(ROOT, 'public', 'assets', 'images');
const WIDTHS = [400, 800, 1200];
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} Ko`;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (IMAGE_EXT.has(extname(entry.name).toLowerCase())) {
      if (!/-\d+w\.webp$/i.test(entry.name)) {
        files.push(full);
      }
    }
  }
  return files;
}

async function optimizeFile(filePath) {
  const before = (await stat(filePath)).size;
  const parsed = parsePath(filePath);
  const baseName = parsed.name;
  const relDir = dirname(filePath).replace(IMAGES_DIR, '').replace(/\\/g, '/');
  const outDir = dirname(filePath);

  let totalAfter = 0;

  for (const w of WIDTHS) {
    const out = join(outDir, `${baseName}-${w}w.webp`);
    await sharp(filePath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    totalAfter += (await stat(out)).size;
  }

  const ext = extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    const tmp = join(outDir, `${baseName}.__tmp.jpg`);
    await sharp(filePath).jpeg({ quality: 82, mozjpeg: true }).toFile(tmp);
    const { rename, unlink } = await import('fs/promises');
    await unlink(filePath);
    await rename(tmp, filePath);
  } else if (ext === '.png') {
    const tmp = join(outDir, `${baseName}.__tmp.png`);
    await sharp(filePath).png({ quality: 82, compressionLevel: 9 }).toFile(tmp);
    const { rename, unlink } = await import('fs/promises');
    await unlink(filePath);
    await rename(tmp, filePath);
  }

  const afterSource = (await stat(filePath)).size;
  totalAfter += afterSource;

  const rel = `/assets/images${relDir}/${basename(filePath)}`.replace(/\/+/g, '/');
  console.log(`  ${rel}: ${formatKb(before)} → source ${formatKb(afterSource)} + webp ${formatKb(totalAfter - afterSource)}`);
}

async function createFallback() {
  const candidates = [
    join(IMAGES_DIR, 'blog.jpg'),
    join(IMAGES_DIR, 'campus', 'img2.jpeg'),
  ];
  let source = null;
  for (const c of candidates) {
    try {
      await stat(c);
      source = c;
      break;
    } catch {
      /* skip */
    }
  }
  const out = join(IMAGES_DIR, 'fallback.webp');
  if (source) {
    await sharp(source).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 75 }).toFile(out);
    console.log(`\n✓ fallback.webp créé depuis ${basename(source)}`);
  } else {
    await sharp({
      create: { width: 800, height: 450, channels: 3, background: { r: 0, g: 40, b: 69 } },
    })
      .webp({ quality: 60 })
      .toFile(out);
    console.log('\n✓ fallback.webp créé (placeholder bleu)');
  }
}

async function main() {
  console.log('Optimisation images —', IMAGES_DIR);
  let files;
  try {
    files = await walk(IMAGES_DIR);
  } catch (err) {
    console.error('Dossier introuvable:', IMAGES_DIR, err.message);
    process.exit(1);
  }

  if (files.length === 0) {
    console.warn('Aucune image trouvée. Copiez vos assets dans public/assets/images/ puis relancez.');
  } else {
    for (const f of files) {
      if (basename(f) === 'fallback.webp') continue;
      await optimizeFile(f);
    }
  }

  await createFallback();
  console.log('\nTerminé.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
