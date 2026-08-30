/**
 * Tests unitaires du composant réseau le plus critique.
 * Chaque famille d'erreur doit produire un code stable exploitable par l'interface.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  ApiError,
  buildRequestUrl,
  createHttpClient,
} from '../../../src/shared/api/httpClient.js';

// Fabrique le sous-ensemble minimal de Response utilisé par le client.
function response(payload, { ok = true, status = 200, raw = false } = {}) {
  return {
    ok,
    status,
    text: vi.fn(async () => (raw ? payload : JSON.stringify(payload))),
  };
}

// Tous les niveaux sont espionnés pour vérifier les événements sans écrire dans la console.
function debugLogger() {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

describe('buildRequestUrl', () => {
  // Les filtres réels utilisent tableaux, valeurs numériques et fragments d'ancre.
  it('encode les tableaux, conserve le hash et ignore les valeurs vides', () => {
    expect(buildRequestUrl('/api/items?lang=fr#resultats', {
      type: 'formation certifiante',
      tag: ['rh', 'ia'],
      page: 0,
      empty: '',
      missing: undefined,
    })).toBe('/api/items?lang=fr&type=formation+certifiante&tag=rh&tag=ia&page=0#resultats');
  });

  it('ne modifie pas une URL sans paramètres utiles', () => {
    expect(buildRequestUrl('/api/health', { value: null })).toBe('/api/health');
  });
});

describe('createHttpClient', () => {
  // Cas nominal : vérifie simultanément le transport, le retour et l'observabilité.
  it('retourne le JSON et produit des traces de début et de succès', async () => {
    const fetchImpl = vi.fn(async () => response({ ok: true, data: { id: 42 } }));
    const debug = debugLogger();
    const client = createHttpClient({ baseUrl: 'https://example.test/', fetchImpl, debugLogger: debug });

    await expect(client.get('/resources', { query: { page: 2 } }))
      .resolves.toEqual({ ok: true, data: { id: 42 } });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://example.test/resources?page=2',
      expect.objectContaining({ method: 'GET', cache: 'no-store', signal: expect.any(AbortSignal) }),
    );
    expect(debug.debug).toHaveBeenCalledWith('request:start', expect.any(Object));
    expect(debug.debug).toHaveBeenCalledWith('request:success', expect.objectContaining({ status: 200 }));
  });

  it('accepte une réponse vide réussie telle qu’un HTTP 204', async () => {
    const client = createHttpClient({
      fetchImpl: async () => response('', { status: 204, raw: true }),
      debugLogger: debugLogger(),
    });
    await expect(client.get('/empty')).resolves.toBeNull();
  });

  it('normalise une erreur métier et conserve ses détails', async () => {
    const debug = debugLogger();
    const client = createHttpClient({
      fetchImpl: async () => response(
        { ok: false, error: 'Formation introuvable', hint: 'Vérifier le slug', code: 'NOT_FOUND' },
        { ok: false, status: 404 },
      ),
      debugLogger: debug,
    });

    await expect(client.get('/formations', { query: { slug: 'inconnue' } })).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      code: 'NOT_FOUND',
      message: 'Formation introuvable - Vérifier le slug',
    });
    expect(debug.warn).toHaveBeenCalledWith('response:error', expect.objectContaining({ status: 404 }));
  });

  it('journalise à distance les erreurs serveur', async () => {
    const logger = vi.fn();
    const client = createHttpClient({
      fetchImpl: async () => response({ ok: false, error: 'Panne', log_id: 'log-7' }, { ok: false, status: 503 }),
      logger,
      debugLogger: debugLogger(),
    });

    await expect(client.get('/down')).rejects.toBeInstanceOf(ApiError);
    expect(logger).toHaveBeenCalledWith(expect.objectContaining({
      level: 'error',
      context: expect.objectContaining({ status: 503, log_id: 'log-7' }),
    }));
  });

  it('détecte une réponse non JSON sans exposer tout son contenu', async () => {
    const debug = debugLogger();
    const client = createHttpClient({
      fetchImpl: async () => response('<html>Erreur</html>', { raw: true }),
      debugLogger: debug,
    });

    await expect(client.get('/broken')).rejects.toMatchObject({ code: 'INVALID_JSON', status: 200 });
    expect(debug.error).toHaveBeenCalledWith('response:invalid-json', expect.any(Object));
  });

  it('distingue une panne réseau', async () => {
    const debug = debugLogger();
    const client = createHttpClient({
      fetchImpl: async () => { throw new TypeError('fetch failed'); },
      logger: vi.fn(),
      debugLogger: debug,
    });

    await expect(client.get('/offline')).rejects.toMatchObject({ code: 'NETWORK_ERROR', status: 0 });
    expect(debug.error).toHaveBeenCalledWith('request:failed', expect.objectContaining({ code: 'NETWORK_ERROR' }));
  });

  it('interrompt une requête après le délai configuré', async () => {
    // Les faux timers rendent ce test rapide et indépendant de la charge de la machine.
    vi.useFakeTimers();
    const client = createHttpClient({
      defaultTimeoutMs: 50,
      logger: vi.fn(),
      debugLogger: debugLogger(),
      fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
      }),
    });

    const request = client.get('/slow');
    const assertion = expect(request).rejects.toMatchObject({ code: 'REQUEST_TIMEOUT' });
    await vi.advanceTimersByTimeAsync(51);
    await assertion;
    vi.useRealTimers();
  });

  it('propage l’annulation demandée par l’appelant sans log distant', async () => {
    // Une navigation normale ne doit jamais polluer les journaux d'erreurs.
    const parent = new AbortController();
    const logger = vi.fn();
    const client = createHttpClient({
      logger,
      debugLogger: debugLogger(),
      fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
      }),
    });

    const request = client.get('/cancelled', { signal: parent.signal });
    parent.abort();
    await expect(request).rejects.toMatchObject({ code: 'REQUEST_ABORTED' });
    expect(logger).not.toHaveBeenCalled();
  });

  it('transmet un corps POST sans lui imposer un format', async () => {
    // Ne pas fixer Content-Type laisse le navigateur ajouter la boundary du multipart.
    const body = new FormData();
    body.set('email', 'dev@example.test');
    const fetchImpl = vi.fn(async () => response({ ok: true }));
    const client = createHttpClient({ fetchImpl, debugLogger: debugLogger() });

    await client.post('/applications', body, { headers: { 'X-Request-ID': 'req-1' } });
    expect(fetchImpl).toHaveBeenCalledWith('/applications', expect.objectContaining({
      method: 'POST',
      body,
      headers: { 'X-Request-ID': 'req-1' },
    }));
  });

  it('refuse une configuration dépourvue de fetch', () => {
    expect(() => createHttpClient({ fetchImpl: null })).toThrow(TypeError);
  });
});
