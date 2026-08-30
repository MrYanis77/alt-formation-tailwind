/** @typedef {'presentiel' | 'distanciel'} FormationModalite */

// Règles métier partagées par les écrans du catalogue de formations.
export const MODALITE_FILTERS = [
  { id: 'all', label: 'Toutes', hint: 'Présentiel et distanciel' },
  { id: 'presentiel', label: 'Présentiel', hint: 'En centre ou en salle' },
  { id: 'distanciel', label: 'Distanciel', hint: 'À distance, visio ou e-learning' },
];

// Les expressions couvrent les variantes historiques saisies librement dans les contenus.
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
  // Une valeur structurée et explicite est toujours plus fiable que l'analyse de texte.
  if (Array.isArray(data?.modalitesCatalogue) && data.modalitesCatalogue.length > 0) {
    return normalizeModalites(data.modalitesCatalogue);
  }

  // Tous les champs susceptibles de mentionner une modalité sont concaténés avant analyse.
  const chunks = [
    ...(data?.infosPratiques?.modalites?.points || []),
    ...(data?.stats?.map((s) => `${s.label} ${s.value}`) || []),
    data?.hero?.sousTitre || '',
    data?.presentation?.paragraphes || '',
    data?.presentation?.description || '',
  ].join(' ');

  // Les termes « mixte » et « hybride » court-circuitent les détections individuelles.
  if (MIXTE_RE.test(chunks)) {
    return ['presentiel', 'distanciel'];
  }

  const hasPresentiel = PRESENTIEL_RE.test(chunks);
  const hasDistanciel = DISTANCIEL_RE.test(chunks);

  if (hasPresentiel && hasDistanciel) return ['presentiel', 'distanciel'];
  if (hasDistanciel) return ['distanciel'];
  if (hasPresentiel) return ['presentiel'];

  // En l'absence d'information, ne pas exclure une formation des deux filtres.
  return ['presentiel', 'distanciel'];
}

/** Normalise, déduplique et filtre une valeur non fiable venant du JSON. @param {unknown} raw */
export function normalizeModalites(raw) {
  if (!Array.isArray(raw)) return ['presentiel', 'distanciel'];
  const set = new Set();
  for (const v of raw) {
    if (v === 'presentiel' || v === 'distanciel') set.add(v);
  }
  if (set.size === 0) return ['presentiel', 'distanciel'];
  return /** @type {FormationModalite[]} */ ([...set]);
}

/** Produit un libellé court pour le badge d'une carte. @param {FormationModalite[]} modalites */
export function getModaliteBadgeLabel(modalites) {
  const list = normalizeModalites(modalites);
  if (list.includes('presentiel') && list.includes('distanciel')) return 'Mixte';
  if (list.includes('presentiel')) return 'Présentiel';
  if (list.includes('distanciel')) return 'Distanciel';
  return null;
}

/** Vérifie un filtre en réutilisant systématiquement la normalisation. */
export function matchesModaliteFilter(modalites, filter) {
  if (!filter || filter === 'all') return true;
  return normalizeModalites(modalites).includes(filter);
}
