/**
 * Journalisation distante des erreurs importantes du navigateur.
 * Contrairement au debug local, ces événements sont envoyés à l'API PHP.
 */
const LOG_ENDPOINT = '/api/log.php';
// Niveaux stables partages par toutes les features du frontend.
const VALID_LEVELS = new Set(['info', 'warning', 'error', 'critical']);

function normalizeLevel(level) {
  return VALID_LEVELS.has(level) ? level : 'error';
}

// Supprime les caractères de contrôle et borne la taille avant l'envoi réseau.
function cleanString(value, max = 1000) {
  return Array.from(String(value ?? ''))
    .filter((char) => {
      const code = char.codePointAt(0);
      return code > 31 && code !== 127;
    })
    .join('')
    .trim()
    .slice(0, max);
}

/** Construit le contrat minimal accepté par `/api/log.php`. */
export function buildSystemLogPayload({ level = 'error', message, context = {} } = {}) {
  const safeContext = {};
  Object.entries(context || {}).slice(0, 30).forEach(([key, value]) => {
    const safeKey = cleanString(key, 80);
    if (!safeKey) return;
    if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) {
      safeContext[safeKey] = typeof value === 'string' ? cleanString(value) : value;
    }
  });

  // Le chemin et le navigateur facilitent le diagnostic sans envoyer l'état complet de la page.
  return {
    level: normalizeLevel(level),
    message: cleanString(message || 'Erreur frontend', 2000),
    context: {
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 255) : '',
      ...safeContext,
    },
  };
}

/**
 * Envoie un événement sans bloquer la navigation : sendBeacon est prioritaire,
 * puis fetch keepalive sert de repli pour les navigateurs non compatibles.
 */
export function logFrontendEvent(payload) {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify(buildSystemLogPayload(payload));

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(LOG_ENDPOINT, blob);
      return;
    }
  } catch {
    // fallback fetch below
  }

  fetch(LOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

/** Installe une seule fois les deux garde-fous d'erreurs globales du navigateur. */
export function installGlobalErrorLogging() {
  if (typeof window === 'undefined' || window.__altFormationErrorLoggingInstalled) return;
  window.__altFormationErrorLoggingInstalled = true;

  window.addEventListener('error', (event) => {
    logFrontendEvent({
      level: 'error',
      message: event.message,
      context: {
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
      },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    logFrontendEvent({
      level: 'error',
      message: reason?.message || String(reason || 'Unhandled promise rejection'),
      context: {
        type: 'unhandledrejection',
        stack: reason?.stack,
      },
    });
  });
}
