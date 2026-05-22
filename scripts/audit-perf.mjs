/**
 * Audit performance post-build : tailles bundle + assets lourds.
 * Usage: npm run audit:perf
 */
import { readdir, stat, readFile } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const ASSETS = join(ROOT, 'public', 'assets');
const HEAVY_THRESHOLD = 500 * 1024;

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} failed`))));
  });
}

async function walk(dir) {
  const out = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) out.push(...(await walk(p)));
      else out.push(p);
    }
  } catch {
    /* skip */
  }
  return out;
}

async function reportHeavyFiles(dir, label) {
  const files = await walk(dir);
  const heavy = [];
  for (const f of files) {
    const s = await stat(f);
    if (s.size >= HEAVY_THRESHOLD) {
      heavy.push({ path: f.replace(ROOT, ''), size: s.size });
    }
  }
  heavy.sort((a, b) => b.size - a.size);
  console.log(`\n── ${label} (> ${HEAVY_THRESHOLD / 1024} Ko) ──`);
  if (heavy.length === 0) {
    console.log('  Aucun fichier au-dessus du seuil.');
  } else {
    heavy.slice(0, 25).forEach(({ path, size }) => {
      console.log(`  ${(size / 1024).toFixed(0)} Ko  ${path}`);
    });
  }
}

async function reportBundle() {
  if (!existsSync(DIST)) {
    console.warn('dist/ absent — lancez npm run build d\'abord.');
    return;
  }
  const jsFiles = (await walk(join(DIST, 'assets'))).filter((f) => extname(f) === '.js');
  const sizes = [];
  for (const f of jsFiles) {
    const buf = await readFile(f);
    sizes.push({ name: f.split(/[/\\]/).pop(), raw: buf.length, gzip: buf.length });
  }
  sizes.sort((a, b) => b.raw - a.raw);
  console.log('\n── Chunks JS (dist/assets) ──');
  sizes.slice(0, 15).forEach(({ name, raw }) => {
    console.log(`  ${(raw / 1024).toFixed(1)} Ko  ${name}`);
  });
  const indexChunk = sizes.find((s) => s.name.startsWith('index-'));
  if (indexChunk) {
    console.log(`\n  Bundle initial (index): ${(indexChunk.raw / 1024).toFixed(1)} Ko`);
  }
}

async function main() {
  console.log('=== Audit performance Alt RH ===\n');
  console.log('1/3 Build production…');
  await run('npm', ['run', 'build'], { cwd: ROOT });

  console.log('\n2/3 Analyse bundle…');
  await reportBundle();

  console.log('\n3/3 Analyse assets public…');
  await reportHeavyFiles(ASSETS, 'public/assets');

  console.log('\n✓ Audit terminé. Vérifiez aussi PageSpeed Insights après déploiement.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
