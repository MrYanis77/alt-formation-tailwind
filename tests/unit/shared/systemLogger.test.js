/** Tests du canal de journalisation distante et des erreurs globales du navigateur. */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildSystemLogPayload,
  installGlobalErrorLogging,
  logFrontendEvent,
} from '../../../src/shared/observability/systemLogger.js';

afterEach(() => {
  // Évite qu'un faux window ou navigator contamine le scénario suivant.
  vi.unstubAllGlobals();
});

describe('buildSystemLogPayload', () => {
  // Le contrat envoyé au PHP doit rester petit, plat et sans caractères de contrôle.
  it('normalise le niveau, nettoie les chaînes et ignore les objets imbriqués', () => {
    const payload = buildSystemLogPayload({
      level: 'debug',
      message: ' Erreur\u0000 ',
      context: {
        token: 'x'.repeat(1200),
        ok: true,
        nested: { ignored: true },
        empty: null,
      },
    });

    expect(payload.level).toBe('error');
    expect(payload.message).toBe('Erreur');
    expect(payload.context.token).toHaveLength(1000);
    expect(payload.context.ok).toBe(true);
    expect(payload.context.nested).toBeUndefined();
    expect(payload.context.empty).toBeNull();
  });

  it('ajoute le chemin et le user-agent dans un navigateur', () => {
    vi.stubGlobal('window', { location: { pathname: '/formations' } });
    vi.stubGlobal('navigator', { userAgent: 'Vitest Browser' });
    expect(buildSystemLogPayload({ message: 'Test' }).context).toMatchObject({
      path: '/formations',
      user_agent: 'Vitest Browser',
    });
  });
});

describe('logFrontendEvent', () => {
  // Les deux stratégies navigateur sont testées : Beacon prioritaire puis fetch keepalive.
  it('ne fait rien hors navigateur', () => {
    expect(() => logFrontendEvent({ message: 'Serveur' })).not.toThrow();
  });

  it('privilégie sendBeacon pour un log fiable pendant la navigation', () => {
    const sendBeacon = vi.fn(() => true);
    vi.stubGlobal('window', { location: { pathname: '/blog' } });
    vi.stubGlobal('navigator', { userAgent: 'Vitest', sendBeacon });

    logFrontendEvent({ level: 'warning', message: 'API lente' });
    expect(sendBeacon).toHaveBeenCalledWith('/api/log.php', expect.any(Blob));
  });

  it('utilise fetch en repli si sendBeacon est indisponible', () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true }));
    vi.stubGlobal('window', { location: { pathname: '/contact' } });
    vi.stubGlobal('navigator', { userAgent: 'Vitest' });
    vi.stubGlobal('fetch', fetchMock);

    logFrontendEvent({ message: 'Repli' });
    expect(fetchMock).toHaveBeenCalledWith('/api/log.php', expect.objectContaining({
      method: 'POST',
      keepalive: true,
    }));
  });
});

describe('installGlobalErrorLogging', () => {
  // L'installation idempotente évite des logs dupliqués après un hot reload React.
  it('installe une seule fois les gestionnaires et journalise les erreurs globales', () => {
    const listeners = {};
    const sendBeacon = vi.fn(() => true);
    const windowMock = {
      location: { pathname: '/accueil' },
      addEventListener: vi.fn((name, listener) => { listeners[name] = listener; }),
    };
    vi.stubGlobal('window', windowMock);
    vi.stubGlobal('navigator', { userAgent: 'Vitest', sendBeacon });

    installGlobalErrorLogging();
    installGlobalErrorLogging();
    expect(windowMock.addEventListener).toHaveBeenCalledTimes(2);

    listeners.error({ message: 'Crash', filename: 'app.js', lineno: 10, colno: 2 });
    listeners.unhandledrejection({ reason: Object.assign(new Error('Promise rejetée'), { stack: 'stack' }) });
    expect(sendBeacon).toHaveBeenCalledTimes(2);
  });
});
