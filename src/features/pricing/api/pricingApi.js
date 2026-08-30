/** Adaptateur HTTP dédié à la tarification multi-entité et multi-site. */
import { apiClient } from '../../../shared/api/httpClient.js';

/** Charge les plans tarifaires d'une ressource identifiée par type et slug. */
export function getPublicPricing({ entityType, entitySlug, siteId, signal } = {}) {
  return apiClient.get('/api/pricing.php', {
    query: {
      entity_type: entityType,
      entity_slug: entitySlug,
      site_id: siteId,
    },
    signal,
  });
}
