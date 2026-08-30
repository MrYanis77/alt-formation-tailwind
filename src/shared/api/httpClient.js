/**
 * Client HTTP générique du frontend.
 * Il centralise timeout, annulation, parsing JSON, erreurs stables et observabilité.
 */
import { logFrontendEvent } from '../observability/systemLogger.js';
import { createDebugLogger } from '../observability/debugLogger.js';

// Dix secondes évitent de laisser l'interface bloquée sur une requête réseau perdue.
export const DEFAULT_API_TIMEOUT_MS = 10_000;
const defaultDebugLogger = createDebugLogger('api');

/** Erreur normalisée consommable de la même manière par tous les modules métier. */
export class ApiError extends Error {
  constructor(message, { status = 0, code = 'API_ERROR', details = null, cause } = {}) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Ajoute des paramètres à une URL relative ou absolue sans perdre son fragment.
 * Les tableaux produisent plusieurs paramètres identiques, utiles pour les filtres.
 */
export function buildRequestUrl(path, query = {}) {
  const [withoutHash, hash = ''] = String(path).split('#', 2);
  const params = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined || rawValue === null || rawValue === '') continue;
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    values.forEach((value) => params.append(key, String(value)));
  }

  const serialized = params.toString();
  if (!serialized) return String(path);
  const separator = withoutHash.includes('?') ? '&' : '?';
  const hashSuffix = hash ? `#${hash}` : '';
  return `${withoutHash}${separator}${serialized}${hashSuffix}`;
}

function describeRequestFailure(timedOut, aborted) {
  if (timedOut) {
    return {
      code: 'REQUEST_TIMEOUT',
      message: 'Le serveur met trop de temps a repondre.',
      debugLevel: 'warn',
      reportRemotely: true,
    };
  }
  if (aborted) {
    return {
      code: 'REQUEST_ABORTED',
      message: 'Requete annulee.',
      debugLevel: 'debug',
      reportRemotely: false,
    };
  }
  return {
    code: 'NETWORK_ERROR',
    message: 'Impossible de joindre le serveur.',
    debugLevel: 'error',
    reportRemotely: true,
  };
}

function report(logger, event) {
  try {
    logger?.(event);
  } catch {
    // La journalisation ne doit jamais masquer l'erreur metier initiale.
  }
}

// Assemble une base configurable tout en laissant intactes les URL déjà absolues.
function joinBaseUrl(baseUrl, path) {
  if (!baseUrl || /^https?:\/\//i.test(path)) return path;
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

/**
 * Fabrique un client injectable : `fetch`, les loggers et le timeout peuvent être
 * remplacés dans les tests sans dépendre du navigateur ni d'un véritable serveur.
 */
export function createHttpClient({
  baseUrl = '',
  fetchImpl = globalThis.fetch,
  logger = logFrontendEvent,
  debugLogger = defaultDebugLogger,
  defaultTimeoutMs = DEFAULT_API_TIMEOUT_MS,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new TypeError('Une implementation de fetch est requise.');
  }

  async function request(path, options = {}) {
    const {
      query,
      timeoutMs = defaultTimeoutMs,
      signal: parentSignal,
      cache = 'no-store',
      headers,
      ...fetchOptions
    } = options;
    const url = buildRequestUrl(joinBaseUrl(baseUrl, path), query);
    const controller = new AbortController();
    let timedOut = false;
    const startedAt = Date.now();

    // Les traces ne contiennent jamais le body, susceptible d'inclure des données personnelles.
    debugLogger?.debug('request:start', {
      method: fetchOptions.method || 'GET',
      url,
      timeoutMs,
    });

    // Un contrôleur interne fusionne l'annulation de l'appelant et le timeout local.
    const abortFromParent = () => controller.abort(parentSignal?.reason);
    if (parentSignal?.aborted) abortFromParent();
    else parentSignal?.addEventListener('abort', abortFromParent, { once: true });

    const timeoutId = timeoutMs > 0
      ? setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, timeoutMs)
      : null;

    try {
      let response;
      try {
        response = await fetchImpl(url, {
          cache,
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });
      } catch (error) {
        // fetch lève la même famille d'erreurs pour réseau, timeout et annulation :
        // on les distingue ici afin que l'interface puisse réagir correctement.
        const aborted = controller.signal.aborted;
        const failure = describeRequestFailure(timedOut, aborted);
        const apiError = new ApiError(failure.message, { code: failure.code, cause: error });

        if (failure.reportRemotely) {
          report(logger, {
            level: 'error',
            message: apiError.message,
            context: { url, code: apiError.code },
          });
        }
        debugLogger?.[failure.debugLevel]('request:failed', {
          method: fetchOptions.method || 'GET',
          url,
          code: apiError.code,
          durationMs: Date.now() - startedAt,
        });
        throw apiError;
      }

      const text = await response.text();
      let payload = null;

      // Une réponse 204 vide est valide ; toute réponse non vide doit être du JSON.
      if (text.trim()) {
        try {
          payload = JSON.parse(text);
        } catch (error) {
          const apiError = new ApiError('Reponse non JSON du serveur API.', {
            status: response.status,
            code: 'INVALID_JSON',
            details: { preview: text.slice(0, 200) },
            cause: error,
          });
          report(logger, {
            level: 'error',
            message: apiError.message,
            context: { url, status: response.status },
          });
          debugLogger?.error('response:invalid-json', {
            url,
            status: response.status,
            durationMs: Date.now() - startedAt,
          });
          throw apiError;
        }
      }

      // Le statut HTTP et le contrat métier `{ ok: false }` sont tous deux vérifiés.
      if (!response.ok || payload?.ok === false) {
        const messageParts = [payload?.error, payload?.hint].filter(Boolean);
        const apiError = new ApiError(messageParts.join(' - ') || `HTTP ${response.status}`, {
          status: response.status,
          code: payload?.code || 'HTTP_ERROR',
          details: payload,
        });

        if (response.status >= 500) {
          report(logger, {
            level: 'error',
            message: apiError.message,
            context: { url, status: response.status, log_id: payload?.log_id },
          });
        }
        debugLogger?.warn('response:error', {
          url,
          status: response.status,
          code: apiError.code,
          durationMs: Date.now() - startedAt,
        });
        throw apiError;
      }

      debugLogger?.debug('request:success', {
        method: fetchOptions.method || 'GET',
        url,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      return payload;
    } finally {
      // Nettoyage systématique pour ne conserver ni timer ni listener après la requête.
      if (timeoutId) clearTimeout(timeoutId);
      parentSignal?.removeEventListener('abort', abortFromParent);
    }
  }

  return {
    request,
    get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  };
}

// Instance par défaut utilisée par les adaptateurs API des différentes features.
export const apiClient = createHttpClient();
