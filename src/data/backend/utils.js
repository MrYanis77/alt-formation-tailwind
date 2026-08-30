/**
 * Utilitaires partagés côté backend.
 */

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
};

/**
 * Échappe les caractères HTML dans une chaîne.
 * À utiliser pour insérer du texte utilisateur dans un email HTML, etc.
 */
export function escapeHtml(input) {
  return String(input ?? '').replace(/[&<>"'/`]/g, (c) => HTML_ESCAPE_MAP[c] || c);
}

/**
 * Trim + slice avec garde non-string.
 */
export function clean(str, max) {
  return String(str ?? '').trim().slice(0, max);
}

/**
 * Parse un id positif, renvoie null si invalide.
 */
export function parseId(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0 || n > Number.MAX_SAFE_INTEGER) {
    return null;
  }
  return n;
}

/**
 * Détecte si une chaîne contient du texte qui ressemble à du HTML/JS.
 * Beaucoup plus permissive que le blacklist précédent (utile pour le français).
 * Ne sert qu'à empêcher d'évidents payloads, le rendu HTML reste responsable de l'échappement.
 */
export function looksLikeInjection(str) {
  if (!str) return false;
  const value = String(str);
  return /<(?:\/?)(?:script|iframe|object|embed|svg|img)\b/i.test(value)
    || /\bon[a-z]+\s*=/i.test(value);
}
