/** @typedef {'presentiel' | 'distanciel'} FormationModalite */

export const MODALITE_FILTERS = [
  { id: 'all', label: 'Toutes', hint: 'Présentiel et distanciel' },
  { id: 'presentiel', label: 'Présentiel', hint: 'En centre ou en salle' },
  { id: 'distanciel', label: 'Distanciel', hint: 'À distance, visio ou e-learning' },
];

const PRESENTIEL_RE =
  /présentiel|presentiel|en centre|en salle|\bintra\b|sur site|formation mixte/i;
const DISTANCIEL_RE =
  /distanciel|à distance|e-learning|visio|téléprésentiel|telepresentiel|classe virtuelle|100\s*%\s*e-learning|zoom|synchrone immersif/i;
const MIXTE_RE =
  /mixte|hybride|blended|présentiel.*distanciel|distanciel.*présentiel|présentiel\s*\/\s*distanciel/i;

/**
 * Déduit les modalités proposées à partir du contenu JSON d'une formation.
 * @returns {FormationModalite[]}
 */
export function inferFormationModalites(data) {
  if (Array.isArray(data?.modalitesCatalogue) && data.modalitesCatalogue.length > 0) {
    return normalizeModalites(data.modalitesCatalogue);
  }

  const chunks = [
    ...(data?.infosPratiques?.modalites?.points || []),
    ...(data?.stats?.map((s) => `${s.label} ${s.value}`) || []),
    data?.hero?.sousTitre || '',
    data?.presentation?.paragraphes || '',
    data?.presentation?.description || '',
  ].join(' ');

  if (MIXTE_RE.test(chunks)) {
    return ['presentiel', 'distanciel'];
  }

  const hasPresentiel = PRESENTIEL_RE.test(chunks);
  const hasDistanciel = DISTANCIEL_RE.test(chunks);

  if (hasPresentiel && hasDistanciel) return ['presentiel', 'distanciel'];
  if (hasDistanciel) return ['distanciel'];
  if (hasPresentiel) return ['presentiel'];

  return ['presentiel', 'distanciel'];
}

/** @param {unknown} raw */
export function normalizeModalites(raw) {
  if (!Array.isArray(raw)) return ['presentiel', 'distanciel'];
  const set = new Set();
  for (const v of raw) {
    if (v === 'presentiel' || v === 'distanciel') set.add(v);
  }
  if (set.size === 0) return ['presentiel', 'distanciel'];
  return /** @type {FormationModalite[]} */ ([...set]);
}

/** @param {FormationModalite[]} modalites */
export function getModaliteBadgeLabel(modalites) {
  const list = normalizeModalites(modalites);
  if (list.includes('presentiel') && list.includes('distanciel')) return 'Mixte';
  if (list.includes('presentiel')) return 'Présentiel';
  if (list.includes('distanciel')) return 'Distanciel';
  return null;
}

/** @param {FormationModalite[]} modalites @param {string} filter */
export function matchesModaliteFilter(modalites, filter) {
  if (!filter || filter === 'all') return true;
  return normalizeModalites(modalites).includes(filter);
}
