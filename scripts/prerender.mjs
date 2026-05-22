/**
 * Prerender des routes SEO statiques après build Vite.
 * Usage: npm run prerender  (après npm run build)
 */
import { spawn } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  '/accueil',
  '/formations',
  '/contact',
  '/faq',
  '/certification',
  '/campus',
  '/financements',
  '/bilan-de-competences',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/reglement-interieur',
];

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function startPreview() {
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
      cwd: ROOT,
      shell: true,
      stdio: 'pipe',
    });
    proc.stdout?.on('data', (d) => {
      if (String(d).includes('Local:')) resolve(proc);
    });
    proc.stderr?.on('data', (d) => console.error(String(d)));
    proc.on('error', reject);
    setTimeout(() => resolve(proc), 8000);
  });
}

async function main() {
  if (!existsSync(DIST)) {
    console.error('dist/ absent. Lancez npm run build d\'abord.');
    process.exit(1);
  }

  console.log('Démarrage vite preview…');
  const preview = await startPreview();
  await wait(2000);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const route of ROUTES) {
    const url = `${BASE}${route}`;
    console.log(`Prerender ${route}…`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await wait(500);
    const html = await page.content();

    const outDir = route === '/accueil'
      ? DIST
      : join(DIST, route.replace(/^\//, ''));
    if (route !== '/accueil') await mkdir(outDir, { recursive: true });
    const outFile = join(outDir, 'index.html');
    await writeFile(outFile, html, 'utf8');
  }

  await browser.close();
  preview.kill();
  console.log(`✓ ${ROUTES.length} routes prerendered dans dist/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
