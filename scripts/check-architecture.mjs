/** Vérification légère des frontières d'imports, sans dépendance d'analyse supplémentaire. */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const SOURCE_ROOT = path.resolve('src');
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.mjs']);
const violations = [];

// Parcourt récursivement uniquement les extensions pouvant contenir des imports ESM.
async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(fullPath);
    return SOURCE_EXTENSIONS.has(path.extname(entry.name)) ? [fullPath] : [];
  }));
  return nested.flat();
}

// Les slashs uniformes rendent les expressions régulières identiques sous Windows et Linux.
function normalizedRelative(file) {
  return path.relative(SOURCE_ROOT, file).replaceAll('\\', '/');
}

// Retourne le nom d'une autre feature lorsqu'une dépendance transversale interdite est détectée.
function importedFeature(importer, specifier) {
  const match = importer.match(/^features\/([^/]+)\//);
  if (!match) return null;
  const resolved = path.resolve(path.dirname(path.join(SOURCE_ROOT, importer)), specifier);
  const relative = normalizedRelative(resolved);
  const imported = relative.match(/^features\/([^/]+)\//)?.[1];
  return imported && imported !== match[1] ? imported : null;
}

// Chaque import relatif est résolu exactement comme un chemin local avant l'application des règles.
for (const file of await collectFiles(SOURCE_ROOT)) {
  const importer = normalizedRelative(file);
  const source = await readFile(file, 'utf8');
  const imports = source.matchAll(/(?:import|export)\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g);

  for (const [, specifier] of imports) {
    if (!specifier.startsWith('.')) continue;
    const target = normalizedRelative(path.resolve(path.dirname(file), specifier));

    // Le socle partagé doit rester indépendant des couches fonctionnelles et de présentation.
    if (importer.startsWith('shared/') && /^(features|pages|components|data\/backend)\//.test(target)) {
      violations.push(`${importer}: shared ne peut pas dependre de ${target}`);
    }
    // Une page peut composer plusieurs features, mais les features ne se couplent pas entre elles.
    const otherFeature = importedFeature(importer, specifier);
    if (otherFeature) violations.push(`${importer}: dependance interdite vers ${otherFeature}`);
    if (/^features\/[^/]+\/domain\//.test(importer) && /\/(api|hooks)\//.test(target)) {
      violations.push(`${importer}: le domaine ne peut pas dependre de ${target}`);
    }
    if (!importer.startsWith('data/backend/') && target.startsWith('data/backend/')) {
      violations.push(`${importer}: le frontend ne peut pas importer le serveur ${target}`);
    }
  }
}

// Une violation produit un code de sortie non nul exploitable par npm et la CI.
if (violations.length) {
  console.error('Frontieres d architecture non respectees :');
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exitCode = 1;
} else {
  console.log('Architecture: frontieres respectees.');
}
