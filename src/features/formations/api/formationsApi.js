/** Adaptateur HTTP du catalogue et des fiches de formation. */
import { apiClient } from '../../../shared/api/httpClient.js';

/** Charge le catalogue ou une formation ciblée par son slug. */
export function getPublicFormations({ slug, type, includeDrafts = false, signal } = {}) {
  return apiClient.get('/api/formations.php', {
    query: {
      slug,
      type,
      // L'absence de `all=1` garantit que l'API publique filtre les brouillons.
      all: includeDrafts ? '1' : undefined,
    },
    signal,
  });
}
