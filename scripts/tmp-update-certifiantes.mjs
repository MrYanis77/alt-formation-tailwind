/**
 * One-shot : formations-certifiantes.json — -30 € par montant, retrait stat Organisme,
 * nettoyage modalités + bloc Alt Formation (contact.js). Ne modifie pas `programme`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_PATH = path.join(__dirname, '../src/data/json/formations-certifiantes.json');

const DELTA = 30;

const ALT_MODALITES_EXTRA = [
  'Contact Alt Formation : 01 60 43 94 32 — formations@altrh.com',
  'Adresses : 3 rue du cochet, 77700 Bailly-Romainvilliers — 2-4 boulevard Michaël Faraday, 77700 Serris',
  'Horaires d\'accueil : lundi au vendredi, 9h00 – 18h00',
  'Inscriptions, calendrier et modalités détaillées : nos conseillers vous accompagnent pour monter votre dossier et choisir le format adapté.',
];

function parseFrenchAmount(str) {
  return parseFloat(String(str).replace(/\s/g, '').replace(',', '.'));
}

function formatFrenchAmount(n) {
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) {
    return String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  const [intPart, dec] = rounded.toFixed(2).split('.');
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + dec;
}

function reduceEurosInString(s) {
  if (typeof s !== 'string' || !s.includes('€')) return s;
  return s.replace(/(\d{1,3}(?:\s\d{3})*(?:,\d{2})?)\s*€/g, (full, numPart) => {
    const n = parseFrenchAmount(numPart);
    if (Number.isNaN(n)) return full;
    const newVal = Math.max(0, n - DELTA);
    return formatFrenchAmount(newVal) + ' €';
  });
}

function walkSkipProgramme(obj) {
  if (obj === null || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      if (typeof item === 'string') {
        obj[i] = reduceEurosInString(item);
      } else {
        walkSkipProgramme(item);
      }
    });
    return;
  }
  for (const k of Object.keys(obj)) {
    if (k === 'programme') continue;
    const v = obj[k];
    if (typeof v === 'string') {
      obj[k] = reduceEurosInString(v);
    } else if (typeof v === 'object' && v !== null) {
      walkSkipProgramme(v);
    }
  }
}

function stripUnwantedModaliteLine(line) {
  if (!line || typeof line !== 'string') return null;
  const L = line.trim();
  const dropPatterns = [
    /^Organisme\s*:/i,
    /^Référence\s*:/i,
    /@ihmisen\.com/i,
    /@ib\.cegos\.fr/i,
    /@m2iformation\.fr/i,
    /@sysdream\.com/i,
    /@learneo\.fr/i,
    /myAtlas/i,
    /Opco\s*Atlas/i,
    /OPCO\s*Atlas/i,
    /prestataire\s+(choisi|désigné)\s+par/i,
    /ENI Service est tenu/i,
    /voir le site (officiel des )?Editions ENI/i,
    /sur le site ENI/i,
    /^Signalement qualité/i,
    /^Accessibilité handicap\s*:/i,
    /^Service commercial\s*:/i,
    /^Contact\s*:\s*[^A]/i,
  ];
  if (dropPatterns.some((re) => re.test(L))) return null;
  if (/Quality@|quality@/i.test(L)) return null;
  if (/handicap@/i.test(L)) return null;
  if (/(51490|75018|92400|31490|92300).*L[ée]guevin|Courbevoie|Clignancourt|SYSDREAM|LEARNEO|IHMISEN|IB CEGOS|M2I Formation/i.test(L)) return null;
  return line;
}

function normalizeModalites(points) {
  if (!Array.isArray(points)) return points;
  const seen = new Set();
  const out = [];
  for (const p of points) {
    const cleaned = stripUnwantedModaliteLine(p);
    if (cleaned == null) continue;
    const key = cleaned.replace(/\s+/g, ' ');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  for (const alt of ALT_MODALITES_EXTRA) {
    if (!seen.has(alt)) {
      out.push(alt);
      seen.add(alt);
    }
  }
  return out;
}

const raw = fs.readFileSync(JSON_PATH, 'utf8');
const data = JSON.parse(raw);

for (const fid of Object.keys(data)) {
  const f = data[fid];
  if (f.stats) {
    f.stats = f.stats.filter((s) => s && s.label !== 'Organisme');
  }
  walkSkipProgramme(f);
  if (f.infosPratiques?.modalites?.points) {
    f.infosPratiques.modalites.points = normalizeModalites(f.infosPratiques.modalites.points);
  }
}

fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('OK', JSON_PATH);
