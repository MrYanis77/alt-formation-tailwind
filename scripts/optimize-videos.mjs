/**
 * Optimise les vidéos MP4 sous public/assets/video/
 * Requiert ffmpeg installé et accessible dans le PATH.
 *
 * Usage: npm run optimize:videos
 *
 * Actions par fichier :
 * - MP4 H.264 720p, ~1.5 Mbps, faststart
 * - WebM VP9 (optionnel, si ffmpeg supporte libvpx-vp9)
 * - Poster WebP (frame à 1s) → même nom avec suffixe -poster.webp
 */
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, extname, basename, parse as parsePath } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const VIDEO_DIR = join(ROOT, 'public', 'assets', 'video');

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
    proc.on('error', reject);
  });
}

async function hasFfmpeg() {
  try {
    await run('ffmpeg', ['-version']);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (extname(entry.name).toLowerCase() === '.mp4' && !entry.name.includes('.optimized.')) {
      files.push(full);
    }
  }
  return files;
}

async function optimizeVideo(filePath) {
  const parsed = parsePath(filePath);
  const outMp4 = join(parsed.dir, `${parsed.name}.optimized.mp4`);
  const outWebm = join(parsed.dir, `${parsed.name}.webm`);
  const poster = join(parsed.dir, `${parsed.name}-poster.webp`);

  console.log(`\n▶ ${filePath.replace(ROOT, '')}`);

  await run('ffmpeg', [
    '-y', '-i', filePath,
    '-vf', 'scale=-2:720',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '28',
    '-maxrate', '1500k', '-bufsize', '3000k',
    '-movflags', '+faststart',
    '-an',
    outMp4,
  ]);

  const { rename, unlink } = await import('fs/promises');
  await unlink(filePath);
  await rename(outMp4, filePath);

  await run('ffmpeg', [
    '-y', '-i', filePath,
    '-ss', '1', '-vframes', '1',
    '-vf', 'scale=1280:-2',
    '-c:v', 'libwebp', '-quality', '80',
    poster,
  ]).catch(() => {
    console.warn('  Poster WebP ignoré (libwebp indisponible)');
  });

  try {
    await run('ffmpeg', [
      '-y', '-i', filePath,
      '-vf', 'scale=-2:720',
      '-c:v', 'libvpx-vp9', '-b:v', '1M', '-an',
      outWebm,
    ]);
    console.log(`  ✓ WebM: ${basename(outWebm)}`);
  } catch {
    console.warn('  WebM ignoré (libvpx-vp9 indisponible)');
  }

  const size = (await stat(filePath)).size;
  console.log(`  ✓ MP4 optimisé: ${(size / 1024 / 1024).toFixed(2)} Mo`);
}

async function main() {
  if (!(await hasFfmpeg())) {
    console.error('ffmpeg introuvable. Installez ffmpeg puis relancez npm run optimize:videos');
    console.error('Windows: winget install ffmpeg  |  macOS: brew install ffmpeg');
    process.exit(1);
  }

  if (!existsSync(VIDEO_DIR)) {
    await mkdir(VIDEO_DIR, { recursive: true });
    console.warn('Dossier video vide — ajoutez vos MP4 dans public/assets/video/');
    return;
  }

  const files = await walk(VIDEO_DIR);
  if (files.length === 0) {
    console.warn('Aucun MP4 trouvé dans', VIDEO_DIR);
    return;
  }

  for (const f of files) {
    await optimizeVideo(f);
  }
  console.log('\nTerminé.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
