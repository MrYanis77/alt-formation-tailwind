/**
 * Normalise presentation.titre → "Le métier"
 * et raccourcit les points modalités / public & prérequis trop longs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const FILES = [
  'src/data/json/formation.json',
  'src/data/json/formation-courtes.json',
  'src/data/json/formations-certifiantes.json',
];

const MAX_POINT = 72;
const MAX_STAT_PUBLIC = 42;

const GLOBAL_REPLACEMENTS = [
  [
    /Inscriptions, calendrier et modalités détaillées\s*:\s*nos conseillers vous accompagnent pour monter votre dossier et choisir le format adapté\./gi,
    'Inscriptions : nos conseillers vous accompagnent (dossier, format).',
  ],
  [
    /Adresses\s*:\s*3 rue du cochet, 77700 Bailly-Romainvilliers\s*—\s*2-4 boulevard Michaël Faraday, 77700 Serris/gi,
    'Lieux : Bailly-Romainvilliers & Serris (77)',
  ],
  [
    /Personnes ayant une forte appétence pour les relations humaines, titulaires d'un Bac ou équivalent, avec un bon sens de l'organisation\./g,
    'Bac ou équivalent, goût pour les relations humaines et organisation.',
  ],
  [
    /Personnes rigoureuses, avec un goût prononcé pour les chiffres\. Titulaires d'un Bac ou équivalent/g,
    'Bac ou équivalent, rigueur et goût pour les chiffres',
  ],
  [
    /Public visé\s*:\s*Professionnels impliqués dans le développement et la fourniture de services informatiques/gi,
    'Public visé : professionnels IT et services numériques',
  ],
  [
    /Public visé\s*:\s*Professionnels de la sécurité, Managers, Consultants, Experts techniques, Conseillers experts en sécurité du cloud/gi,
    'Public visé : pros sécurité, managers, consultants cloud',
  ],
  [
    /Public visé\s*:\s*Responsables webmarketing\/digitaux, dirigeants, managers, PME, directeurs commerciaux, responsables de la relation client, étudiants/gi,
    'Public visé : marketing digital, dirigeants, managers, étudiants',
  ],
  [
    /Public visé\s*:\s*Professionnels de la cybersécurité, Pentesters, Chercheurs en sécurité, Développeurs/gi,
    'Public visé : cybersécurité, pentesters, développeurs',
  ],
  [
    /Ou connaissances équivalentes aux stages Linux industriel \(LXT\) et BSP UBoot \(BLE\)/g,
    'Équivalent stages Linux (LXT) et BSP U-Boot (BLE)',
  ],
  [
    /100 % e-learning\s*—\s*7 rentrées par an \(janvier, février, mars, avril, juin, septembre, novembre[^)]*\)/gi,
    '100 % e-learning — 7 rentrées / an',
  ],
  [
    /Présentiel mixte\s*—\s*rentrées de mars et septembre \(cours en centre \+ visio \+ espace e-learning[^)]*\)/gi,
    'Présentiel mixte — rentrées mars & sept. (centre + visio)',
  ],
  [
    /Financement\s*:\s*Éligible CPF \(certification DiGiTT\), cofinancement entreprise ou Pôle Emploi/gi,
    'Financement : CPF (DiGiTT), entreprise ou France Travail',
  ],
  [
    /La connaissance fondamentale des principes Agile, Scrum, Lean et ITSM est bénéfique\./gi,
    'Notions Agile, Scrum, Lean et ITSM appréciées.',
  ],
  [
    /Sessions\s*:\s*calendrier inter ou intra communiqué lors de votre prise de contact avec Alt RH Formations/gi,
    'Sessions : calendrier inter/intra sur demande',
  ],
];

function applyGlobalReplacements(text) {
  let out = text;
  for (const [re, repl] of GLOBAL_REPLACEMENTS) {
    out = out.replace(re, repl);
  }
  return out;
}

function shortenPublicViséLine(text, maxBody = 48) {
  const m = text.match(/^(Public visé\s*:\s*)(.+)$/i);
  if (!m) return text;
  const prefix = m[1];
  let body = m[2].trim();
  if (body.length <= maxBody) return prefix + body;
  const parts = body.split(/,\s*/).filter(Boolean);
  if (parts.length > 3) {
    body = `${parts.slice(0, 3).join(', ')}…`;
  } else if (body.length > maxBody) {
    body = `${body.slice(0, maxBody - 1).trim()}…`;
  }
  return prefix + body;
}

function shortenPoint(text, max = MAX_POINT) {
  let out = applyGlobalReplacements(text);
  if (/^Public visé\s*:/i.test(out)) {
    out = shortenPublicViséLine(out);
  }
  if (out.length <= max) return out;
  const cut = out.lastIndexOf(', ', max - 1);
  if (cut > 40) return `${out.slice(0, cut)}…`;
  return `${out.slice(0, max - 1).trim()}…`;
}

function shortenStatPublic(value) {
  if (!value || value.length <= MAX_STAT_PUBLIC) return value;
  const parts = value.split(/,\s*\/\s*|,\s*/).filter(Boolean);
  if (parts.length > 2) {
    return `${parts.slice(0, 2).join(', ')}…`;
  }
  return value.length > MAX_STAT_PUBLIC
    ? `${value.slice(0, MAX_STAT_PUBLIC - 1).trim()}…`
    : value;
}

function processFormation(slug, form) {
  let changed = false;

  if (form.presentation && form.presentation.titre !== 'Le métier') {
    form.presentation.titre = 'Le métier';
    changed = true;
  }

  if (form.stats?.length) {
    for (const stat of form.stats) {
      if (/public/i.test(stat.label) && stat.value?.length > MAX_STAT_PUBLIC) {
        const next = shortenStatPublic(stat.value);
        if (next !== stat.value) {
          stat.value = next;
          changed = true;
        }
      }
    }
  }

  const ip = form.infosPratiques;
  if (!ip) return changed;

  for (const key of ['modalites', 'prerequis']) {
    const block = ip[key];
    if (!block?.points?.length) continue;
    block.points = block.points.map((p) => {
      const next = shortenPoint(p);
      if (next !== p) changed = true;
      return next;
    });
  }

  return changed;
}

let totalChanged = 0;
for (const rel of FILES) {
  const filePath = path.join(ROOT, rel);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let fileChanged = false;
  for (const [slug, form] of Object.entries(data)) {
    if (processFormation(slug, form)) fileChanged = true;
  }
  if (fileChanged) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 4)}\n`, 'utf8');
    totalChanged++;
    console.log('Updated:', rel);
  } else {
    console.log('No changes:', rel);
  }
}

// Verification
for (const rel of FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  let badTitre = 0;
  let longPoints = 0;
  for (const form of Object.values(data)) {
    if (form.presentation?.titre !== 'Le métier') badTitre++;
    for (const key of ['modalites', 'prerequis']) {
      for (const p of form.infosPratiques?.[key]?.points || []) {
        if (p.length > MAX_POINT) longPoints++;
      }
    }
  }
  console.log(`Verify ${rel}: titre≠Le métier=${badTitre}, points>${MAX_POINT}=${longPoints}`);
}
