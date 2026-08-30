/** Adaptateur HTTP du module blog : aucune règle de présentation ne vit ici. */
import { apiClient } from '../../../shared/api/httpClient.js';

/** Charge la liste publique ou un article précis, avec annulation optionnelle. */
export function getPublicBlog({ slug, includeDrafts = false, signal } = {}) {
  return apiClient.get('/api/blog.php', {
    query: {
      slug,
      // Les brouillons restent exclus sauf demande explicite d'un écran autorisé.
      all: includeDrafts ? '1' : undefined,
    },
    signal,
  });
}
