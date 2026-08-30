/**
 * Logger de diagnostic local, structuré et désactivable en production.
 * Les protections ci-dessous empêchent les traces de devenir une fuite de secrets.
 */
const DEBUG_STORAGE_KEY = 'nexytal:debug';
const SENSITIVE_KEY_RE = /authorization|cookie|password|passwd|secret|token|api[_-]?key|cv|resume/i;
const MAX_DEPTH = 3;
const MAX_ITEMS = 20;

function defaultEnabled() {
  // Vite active les traces en développement ; le stockage permet un diagnostic ponctuel.
  if (import.meta.env?.DEV) return true;
  try {
    return globalThis.localStorage?.getItem(DEBUG_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Nettoie récursivement une valeur tout en bornant volume et profondeur. */
function sanitizeValue(value, depth, seen) {
  if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
  if (value instanceof Error) {
    return { name: value.name, message: value.message, code: value.code };
  }
  if (depth >= MAX_DEPTH) return '[TRUNCATED]';
  if (typeof value !== 'object') return String(value);
  // Une structure circulaire ne doit jamais faire échouer JSON.stringify ou la console.
  if (seen.has(value)) return '[CIRCULAR]';

  seen.add(value);
  if (Array.isArray(value)) {
    const result = value.slice(0, MAX_ITEMS).map((item) => sanitizeValue(item, depth + 1, seen));
    seen.delete(value);
    return result;
  }

  const result = {};
  Object.entries(value).slice(0, MAX_ITEMS).forEach(([key, item]) => {
    // Le masquage se fait sur le nom de champ avant toute descente récursive.
    result[key] = SENSITIVE_KEY_RE.test(key)
      ? '[REDACTED]'
      : sanitizeValue(item, depth + 1, seen);
  });
  seen.delete(value);
  return result;
}

/** Retourne une copie sûre du contexte fourni par le développeur. */
export function sanitizeDebugContext(context = {}) {
  return sanitizeValue(context, 0, new WeakSet());
}

/**
 * Crée un logger par espace fonctionnel (`api`, `catalogue`, etc.).
 * `sink` et `now` sont injectables pour produire des tests déterministes.
 */
export function createDebugLogger(namespace, {
  enabled = defaultEnabled(),
  sink = console,
  now = () => new Date().toISOString(),
} = {}) {
  const emit = (level, event, context = {}) => {
    if (!enabled) return;
    // Un payload objet facilite le filtrage dans les DevTools et les outils de collecte.
    const payload = {
      timestamp: now(),
      namespace,
      event,
      context: sanitizeDebugContext(context),
    };
    const writer = sink[level] || sink.log;
    writer?.call(sink, `[${namespace}] ${event}`, payload);
  };

  return {
    debug: (event, context) => emit('debug', event, context),
    info: (event, context) => emit('info', event, context),
    warn: (event, context) => emit('warn', event, context),
    error: (event, context) => emit('error', event, context),
  };
}

// Exportée pour documenter et partager la clé d'activation sans chaîne magique.
export { DEBUG_STORAGE_KEY };
