/**
 * Injecte certificationOfficielle dans formation.json et harmonise les textes RNCP.
 * Usage: node scripts/inject-certification-officielle.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  certificationOfficielleMap,
  buildCertificationOfficielle,
  harmonizeFormationText,
} from './data/certification-officielle-map.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const formationPath = join(root, 'src/data/json/formation.json');

const formations = JSON.parse(readFileSync(formationPath, 'utf8'));

for (const [id, entry] of Object.entries(certificationOfficielleMap)) {
  if (!formations[id]) {
    console.warn(`⚠ Formation absente: ${id}`);
    continue;
  }
  const cert = buildCertificationOfficielle(entry);
  const harmonized = harmonizeFormationText(formations, id, cert);
  formations[id] = { certificationOfficielle: cert, ...harmonized };
}

writeFileSync(formationPath, `${JSON.stringify(formations, null, 4)}\n`, 'utf8');
console.log(
  `✓ ${Object.keys(certificationOfficielleMap).length} fiches mises à jour dans formation.json`,
);
