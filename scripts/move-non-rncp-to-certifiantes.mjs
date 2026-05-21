/**
 * Déplace les parcours longs sans certificationOfficielle (RNCP/RS)
 * de formation.json vers formations-certifiantes.json.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const formationPath = join(root, 'src/data/json/formation.json');
const certifiantesPath = join(root, 'src/data/json/formations-certifiantes.json');

const categorieById = {
  'formation-initiation-cybersecurite': 'cybersecurite-reseaux',
  'formation-implementer-politique-cybersecurite': 'cybersecurite-reseaux',
  'formation-cisco-configuration-administration': 'cybersecurite-reseaux',
  'formation-responsive-web-design': 'digital-developpement',
  'formation-php': 'digital-developpement',
  'formation-python-tosa': 'ia-data',
};

const formations = JSON.parse(readFileSync(formationPath, 'utf8'));
const certifiantes = JSON.parse(readFileSync(certifiantesPath, 'utf8'));

const toMove = Object.keys(formations).filter((id) => !formations[id].certificationOfficielle);

if (toMove.length === 0) {
  console.log('Aucune formation à déplacer.');
  process.exit(0);
}

for (const id of toMove) {
  if (certifiantes[id]) {
    console.warn(`⚠ ${id} existe déjà dans formations-certifiantes.json — ignoré`);
    delete formations[id];
    continue;
  }

  const entry = { ...formations[id] };
  entry.type = 'certifiante';
  entry.categorie = categorieById[id] || entry.categorie || 'digital-developpement';

  certifiantes[id] = entry;
  delete formations[id];
  console.log(`→ ${id} (${entry.categorie})`);
}

writeFileSync(formationPath, `${JSON.stringify(formations, null, 4)}\n`, 'utf8');
writeFileSync(certifiantesPath, `${JSON.stringify(certifiantes, null, 4)}\n`, 'utf8');
console.log(`\n✓ ${toMove.length} formation(s) déplacée(s)`);
console.log(`  formation.json: ${Object.keys(formations).length} entrées`);
console.log(`  formations-certifiantes.json: ${Object.keys(certifiantes).length} entrées`);
