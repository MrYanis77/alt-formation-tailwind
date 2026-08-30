/** Adaptateur HTTP des offres et candidatures de recrutement. */
import { apiClient } from '../../../shared/api/httpClient.js';

/** Charge les offres publiques, éventuellement filtrées par département. */
export function getPublicCareers({ department, includeDrafts = false, siteId, signal } = {}) {
  return apiClient.get('/api/careers.php', {
    query: {
      department,
      all: includeDrafts ? '1' : undefined,
      site_id: siteId,
    },
    signal,
  });
}

/** Charge une offre unique sans construire manuellement sa chaîne de requête. */
export function getPublicCareerOffer(slug, { signal } = {}) {
  return apiClient.get('/api/careers.php', { query: { slug }, signal });
}

/** Envoie un FormData tel quel afin de préserver les pièces jointes du candidat. */
export function submitCareerApplication(formData, { signal } = {}) {
  return apiClient.post('/api/apply-career.php', formData, { signal });
}
