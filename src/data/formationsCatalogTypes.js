/**
 * Normalise le paramètre d’URL `?type=` sur `/formations`.
 *
 * Comportement catalogue :
 * - `elearning` : vue E-Learning seule (`?type=elearning`), avec ancres `#<catégorie>` non préfixées.
 * - sinon : page combinée avec un seul bloc catalogue (`#catalogue`, domaines `#catalogue-<id>`) ;
 *   les anciens liens `#diplomantes*`, `#certifiantes*` restent gérés côté UI.
 * - `?type=certifiantes` (liens hérités) : même page, scroll vers `#catalogue`.
 *
 * @param {string | null | undefined} raw
 * @returns {'diplomantes' | 'certifiantes' | 'elearning'}
 */
export function normalizeCatalogType(raw) {
  const v = (raw || '').toLowerCase().trim();
  if (v === 'certifiante' || v === 'certifiantes' || v === 'certifiant') return 'certifiantes';
  if (v === 'e-learning' || v === 'elearning' || v === 'courtes' || v === 'courte') return 'elearning';
  if (v === 'diplomantes' || v === 'diplomante' || v === 'longue') return 'diplomantes';
  return 'diplomantes';
}
