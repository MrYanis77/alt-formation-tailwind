import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../src/shared/api/httpClient.js';
import { getPublicBlog } from '../../../src/features/blog/api/blogApi.js';
import {
  getPublicCareerOffer,
  getPublicCareers,
  submitCareerApplication,
} from '../../../src/features/careers/api/careersApi.js';
import { getPublicFormations } from '../../../src/features/formations/api/formationsApi.js';
import { getPublicPricing } from '../../../src/features/pricing/api/pricingApi.js';

afterEach(() => vi.restoreAllMocks());

describe('adaptateurs API publics', () => {
  it('construit les parametres du blog sans exposer les brouillons par defaut', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ ok: true });
    const signal = new AbortController().signal;

    await getPublicBlog({ slug: 'article', signal });

    expect(get).toHaveBeenCalledWith('/api/blog.php', {
      query: { slug: 'article', all: undefined },
      signal,
    });
  });

  it('active explicitement les brouillons du blog', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue([]);
    await getPublicBlog({ includeDrafts: true });
    expect(get).toHaveBeenCalledWith('/api/blog.php', expect.objectContaining({
      query: { slug: undefined, all: '1' },
    }));
  });

  it('transmet les filtres de recrutement et le detail d une offre', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue([]);
    const signal = new AbortController().signal;

    await getPublicCareers({ department: 'formateur', includeDrafts: true, siteId: 4, signal });
    await getPublicCareerOffer('formateur-ia', { signal });

    expect(get).toHaveBeenNthCalledWith(1, '/api/careers.php', {
      query: { department: 'formateur', all: '1', site_id: 4 },
      signal,
    });
    expect(get).toHaveBeenNthCalledWith(2, '/api/careers.php', {
      query: { slug: 'formateur-ia' },
      signal,
    });
  });

  it('conserve le FormData lors d une candidature', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({ ok: true });
    const body = new FormData();
    const signal = new AbortController().signal;
    body.set('email', 'candidate@example.test');

    await submitCareerApplication(body, { signal });

    expect(post).toHaveBeenCalledWith('/api/apply-career.php', body, { signal });
  });

  it('construit les requetes de formations et de tarification', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue([]);
    const signal = new AbortController().signal;

    await getPublicFormations({ slug: 'dev-web', type: 'diplomante', includeDrafts: true, signal });
    await getPublicPricing({ entityType: 'bilan', entitySlug: 'essentiel', siteId: 2, signal });

    expect(get).toHaveBeenNthCalledWith(1, '/api/formations.php', {
      query: { slug: 'dev-web', type: 'diplomante', all: '1' },
      signal,
    });
    expect(get).toHaveBeenNthCalledWith(2, '/api/pricing.php', {
      query: { entity_type: 'bilan', entity_slug: 'essentiel', site_id: 2 },
      signal,
    });
  });
});
