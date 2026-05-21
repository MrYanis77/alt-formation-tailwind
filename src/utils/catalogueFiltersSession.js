export const STORAGE_KEY = 'alt-formations-catalogue-filters';

export const DEFAULT_CATALOGUE_FILTERS = {
  q: '',
  repertoire: 'all',
  domain: 'all',
  type: 'all',
  modalite: 'all',
};

const VALID_REPERTOIRE = new Set(['all', 'RNCP', 'RS']);
const VALID_TYPE = new Set(['all', 'diplomantes', 'certifiantes']);
const VALID_MODALITE = new Set(['all', 'presentiel', 'distanciel']);
const MAX_Q_LENGTH = 120;

function sanitizeQ(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_Q_LENGTH);
}

function sanitizeRepertoire(value) {
  return VALID_REPERTOIRE.has(value) ? value : 'all';
}

function sanitizeType(value) {
  return VALID_TYPE.has(value) ? value : 'all';
}

function sanitizeModalite(value) {
  return VALID_MODALITE.has(value) ? value : 'all';
}

function sanitizeDomain(value) {
  if (value === 'all') return 'all';
  if (typeof value === 'string' && value.startsWith('catalogue-') && value.length > 'catalogue-'.length) {
    return value;
  }
  return 'all';
}

function normalizeFilters(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_CATALOGUE_FILTERS };
  return {
    q: sanitizeQ(raw.q),
    repertoire: sanitizeRepertoire(raw.repertoire),
    domain: sanitizeDomain(raw.domain),
    type: sanitizeType(raw.type),
    modalite: sanitizeModalite(raw.modalite),
  };
}

/** Type dérivé du hash / param (même logique que le hub). */
export function getCatalogueTypeFromUrl(hash, typeQuery) {
  const h = (hash || '').replace(/^#/, '');
  if (typeQuery === 'certifiantes') return 'certifiantes';
  if (!h) return 'all';
  if (h === 'diplomantes' || h.startsWith('diplomantes-')) return 'diplomantes';
  if (h === 'certifiantes' || h.startsWith('certifiantes-')) return 'certifiantes';
  return 'all';
}

/** Domaine depuis le hash (#catalogue-*, legacy #diplomantes-*). */
export function parseDomainFromHash(hash) {
  const h = (hash || '').replace(/^#/, '');
  if (!h || h === 'diplomantes' || h === 'certifiantes' || h === 'catalogue') return null;

  let effective = h;
  if (h.startsWith('diplomantes-')) {
    effective = `catalogue-${h.slice('diplomantes-'.length)}`;
  } else if (h.startsWith('certifiantes-')) {
    effective = `catalogue-${h.slice('certifiantes-'.length)}`;
  }

  if (!effective.startsWith('catalogue-')) return null;

  if (effective === 'catalogue-comptabilite-gestion') return 'catalogue-ressources-humaines';
  if (
    effective === 'catalogue-devops' ||
    effective === 'catalogue-digital-developpement' ||
    effective === 'catalogue-ia-data'
  ) {
    return 'catalogue-digital-ia-devops';
  }

  return effective;
}

export function readCatalogueFilters() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CATALOGUE_FILTERS };
    return normalizeFilters(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_CATALOGUE_FILTERS };
  }
}

export function writeCatalogueFilters(partial) {
  try {
    const current = readCatalogueFilters();
    const next = normalizeFilters({ ...current, ...partial });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function clearCatalogueFilters() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // mode privé / quota
  }
}

/** Modalité depuis ?modalite=presentiel|distanciel */
export function getModaliteFromUrl(modaliteQuery) {
  return sanitizeModalite(modaliteQuery || 'all');
}

/**
 * Fusion URL (prioritaire) + session pour l’hydratation initiale.
 */
export function resolveCatalogueFilters(hash, typeQuery, modaliteQuery) {
  const session = readCatalogueFilters();
  const urlType = getCatalogueTypeFromUrl(hash, typeQuery);
  const urlHasType = urlType !== 'all';

  const domainFromUrl = parseDomainFromHash(hash);
  const urlHasDomain = domainFromUrl != null;

  const urlModalite = getModaliteFromUrl(modaliteQuery);
  const urlHasModalite = urlModalite !== 'all';

  return {
    q: session.q,
    repertoire: session.repertoire,
    domain: urlHasDomain ? domainFromUrl : session.domain,
    type: urlHasType ? urlType : session.type,
    modalite: urlHasModalite ? urlModalite : session.modalite,
    needsTypeNavigation: !urlHasType && session.type !== 'all',
    typeToNavigate: session.type,
  };
}
