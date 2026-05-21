/**
 * Génère le tableau certifications dans certification.js depuis formation.json.
 * Usage:
 *   node scripts/sync-certification-from-formation.mjs
 *   node scripts/sync-certification-from-formation.mjs --check
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const formationPath = join(root, 'src/data/json/formation.json');
const certPath = join(root, 'src/data/certification.js');
const checkOnly = process.argv.includes('--check');

const categoryMap = {
  'formations-administrateur-dinfrastructures-securisees-ais': 'cybersecurite-reseaux',
  'formations-technicien-superieur-systemes-et-reseaux': 'cybersecurite-reseaux',
  'administrateur-reseaux-netops': 'cybersecurite-reseaux',
  'administrateursysteme-devops': 'digital-developpement',
  'technicien-reseaux-cybersecurite': 'cybersecurite-reseaux',
  'formations-developpeur-web-mobile': 'digital-developpement',
  'formations-developpeur-dapplications-multimedia': 'digital-developpement',
  'formations-concepteur-developpeur-dapplications': 'digital-developpement',
  'formations-concepteur-designer-ui': 'digital-developpement',
  'formations-lead-developpeur-web': 'digital-developpement',
  'executive-mastere-ingenierie-logiciel': 'digital-developpement',
  'creer-site-internet-html-css-wordpress': 'digital-developpement',
  'formations-assistante-ressources-humaines': 'ressources-humaines',
  'formations-conseiller-insertion-professionnelle': 'ressources-humaines',
  'formations-assistante-de-direction': 'ressources-humaines',
  'formations-assistante-administratifve': 'ressources-humaines',
  'formations-assistante-commerciale': 'ressources-humaines',
  'formations-conseillerere-relation-client-a-distance': 'ressources-humaines',
  'formations-community-manager': 'comptabilite-gestion',
  'formations-secretaire-comptable': 'comptabilite-gestion',
  'gestionnaire-comptable-fiscal': 'comptabilite-gestion',
  'formations-comptable-assistant': 'comptabilite-gestion',
  'formations-responsable-etablissement-marchand': 'comptabilite-gestion',
  'formations-assistant-immobilier': 'comptabilite-gestion',
  'formations-assistant-import-export': 'comptabilite-gestion',
  'formations-conseiller-de-vente': 'comptabilite-gestion',
  'formations-employe-commercial': 'comptabilite-gestion',
};

const categoryToCertPage = {
  'cybersecurite-reseaux': 'Systèmes & Réseaux',
  'digital-developpement': 'Digital & Web',
  'ia-data': 'Digital & Web',
  'ressources-humaines': 'RH & Gestion',
  'comptabilite-gestion': 'RH & Gestion',
};

const relationClientIds = new Set([
  'formations-conseillerere-relation-client-a-distance',
  'formations-conseiller-de-vente',
  'formations-employe-commercial',
  'formations-assistante-commerciale',
]);

const formationsJsPath = join(root, 'src/data/formations.js');

function parseImageMapFromFormationsJs() {
  const src = readFileSync(formationsJsPath, 'utf8');
  const block = src.match(/export const imageMap = \{([\s\S]*?)\n\};/);
  if (!block) return {};
  const imageMap = {};
  for (const m of block[1].matchAll(/'([^']+)':\s*'([^']+)'/g)) {
    imageMap[m[1]] = m[2];
  }
  return imageMap;
}

const formations = JSON.parse(readFileSync(formationPath, 'utf8'));
const imageMap = parseImageMapFromFormationsJs();

const entries = Object.entries(formations)
  .filter(([, data]) => data.certificationOfficielle)
  .map(([id, data], index) => {
    const c = data.certificationOfficielle;
    const catKey = categoryMap[id] || data.categorie || 'autre';
    let category = categoryToCertPage[catKey] || 'Digital & Web';
    if (relationClientIds.has(id)) category = 'Relation Client';

    const nom =
      c.intituleOfficiel || data.hero?.titre?.replace(/^Devenez\s+/i, '') || id;

    return {
      id: index + 1,
      nom,
      rncp: c.code,
      repertoire: c.repertoire,
      niveau: c.niveau != null ? String(c.niveau) : '',
      category,
      href: `/formation/${id}`,
      lienFranceCompetence: c.url,
      imageUrl: imageMap[id] || '/assets/images/certification.jpg',
    };
  })
  .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));

const certSource = readFileSync(certPath, 'utf8');
const certBlock = `export const certifications = ${JSON.stringify(entries, null, 2)
  .replace(/"repertoire":/g, '// repertoire preserved in JSON only — field below for sync\n    repertoire:')
  .replace(/"(\w+)":/g, '$1:')};`;

// Build proper JS object string manually for readability
const lines = entries.map((e, i) => {
  const comma = i < entries.length - 1 ? ',' : '';
  const niveauLine = e.niveau ? `\n    niveau: "${e.niveau}",` : '\n    niveau: "",';
  return `  {
    id: ${e.id},
    nom: ${JSON.stringify(e.nom)},
    rncp: "${e.rncp}",
    repertoire: "${e.repertoire}",${niveauLine}
    category: ${JSON.stringify(e.category)},
    href: ${JSON.stringify(e.href)},
    lienFranceCompetence: ${JSON.stringify(e.lienFranceCompetence)},
    imageUrl: ${JSON.stringify(e.imageUrl)}
  }${comma}`;
});

const newCertArray = `export const certifications = [\n${lines.join('\n')}\n];`;

if (checkOnly) {
  const currentMatch = certSource.match(/export const certifications = \[[\s\S]*?\n\];/);
  if (!currentMatch) {
    console.error('Impossible de lire certifications dans certification.js');
    process.exit(1);
  }
  if (currentMatch[0].trim() !== newCertArray.trim()) {
    console.error('✗ certification.js est désynchronisé — exécutez npm run sync:certification');
    process.exit(1);
  }
  console.log('✓ certification.js est à jour');
  process.exit(0);
}

const updated = certSource.replace(
  /export const certifications = \[[\s\S]*?\n\];/,
  newCertArray,
);

writeFileSync(certPath, updated, 'utf8');
console.log(`✓ ${entries.length} certifications écrites dans certification.js`);
