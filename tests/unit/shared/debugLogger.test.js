/** Vérifie que le diagnostic reste exploitable sans exposer de données sensibles. */
import { describe, expect, it, vi } from 'vitest';
import {
  createDebugLogger,
  sanitizeDebugContext,
} from '../../../src/shared/observability/debugLogger.js';

describe('sanitizeDebugContext', () => {
  // Les objets circulaires et Error se rencontrent fréquemment dans les erreurs réseau.
  it('masque les secrets, gère les erreurs et les références circulaires', () => {
    const context = {
      email: 'dev@example.test',
      password: 'secret',
      nested: { accessToken: 'abc', error: Object.assign(new Error('Panne'), { code: 'E_DOWN' }) },
    };
    context.self = context;

    expect(sanitizeDebugContext(context)).toEqual({
      email: 'dev@example.test',
      password: '[REDACTED]',
      nested: {
        accessToken: '[REDACTED]',
        error: { name: 'Error', message: 'Panne', code: 'E_DOWN' },
      },
      self: '[CIRCULAR]',
    });
  });

  it('tronque les structures trop profondes et les longues listes', () => {
    const result = sanitizeDebugContext({ deep: { one: { two: { three: true } } }, list: Array.from({ length: 30 }, (_, i) => i) });
    expect(result.deep.one.two).toBe('[TRUNCATED]');
    expect(result.list).toHaveLength(20);
  });
});

describe('createDebugLogger', () => {
  // Les dépendances temps/sortie sont injectées afin d'obtenir un résultat déterministe.
  it('émet un événement structuré et nettoyé', () => {
    const sink = { debug: vi.fn() };
    const logger = createDebugLogger('catalogue', {
      enabled: true,
      sink,
      now: () => '2026-08-20T10:00:00.000Z',
    });

    logger.debug('filter:changed', { type: 'certifiante', apiKey: 'hidden' });
    expect(sink.debug).toHaveBeenCalledWith('[catalogue] filter:changed', {
      timestamp: '2026-08-20T10:00:00.000Z',
      namespace: 'catalogue',
      event: 'filter:changed',
      context: { type: 'certifiante', apiKey: '[REDACTED]' },
    });
  });

  it('reste silencieux quand le debug est désactivé', () => {
    const sink = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const logger = createDebugLogger('api', { enabled: false, sink });
    logger.debug('start');
    logger.info('ready');
    logger.warn('slow');
    logger.error('failed');
    Object.values(sink).forEach((writer) => expect(writer).not.toHaveBeenCalled());
  });

  it('utilise sink.log si le niveau demandé n’existe pas', () => {
    const sink = { log: vi.fn() };
    createDebugLogger('fallback', { enabled: true, sink }).warn('event');
    expect(sink.log).toHaveBeenCalledOnce();
  });
});
