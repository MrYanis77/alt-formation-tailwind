/**
 * Génère src/data/json/formations-index.json — map id → fichier source JSON.
 * Usage: npm run generate:formations-index
 */
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const JSON_DIR = join(ROOT, 'src', 'data', 'json');

const SOURCES = [
  { file: 'formation.json', key: 'formation' },
  { file: 'formation-courtes.json', key: 'formation-courtes' },
  { file: 'formations-certifiantes.json', key: 'formations-certifiantes' },
];

async function main() {
  const index = {};
  for (const { file, key } of SOURCES) {
    const raw = await readFile(join(JSON_DIR, file), 'utf8');
    const data = JSON.parse(raw);
    for (const id of Object.keys(data)) {
      index[id] = key;
    }
  }
  const out = join(JSON_DIR, 'formations-index.json');
  await writeFile(out, JSON.stringify(index, null, 2) + '\n', 'utf8');
  console.log(`✓ ${Object.keys(index).length} formations → ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
