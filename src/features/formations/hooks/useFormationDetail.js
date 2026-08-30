/** Orchestration React d'une fiche de formation identifiée par son slug. */
import { useCallback } from 'react';
import { useAsyncResource } from '../../../shared/hooks/useAsyncResource.js';
import { getPublicFormations } from '../api/formationsApi.js';
import { mapFormationCourseToDetail } from '../domain/formationMappers.js';

const EMPTY_DETAIL = Object.freeze({ formation: null });

/** Retourne un modèle de détail prêt à afficher, jamais une ligne SQL brute. */
export function useFormationDetail(slug) {
  const load = useCallback(async ({ signal }) => {
    const json = await getPublicFormations({ slug, signal });
    // L'API renvoie un tableau même lorsqu'un slug unique est demandé.
    const course = json.data?.courses?.[0] ?? json.data?.formations?.[0] ?? null;
    return { formation: course ? mapFormationCourseToDetail(course) : null };
  }, [slug]);
  const resource = useAsyncResource({
    key: slug || 'formation-absente',
    load,
    initialData: EMPTY_DETAIL,
    // Sans slug, aucune requête inutile n'est envoyée.
    enabled: Boolean(slug),
  });

  return {
    formation: resource.data.formation,
    loading: resource.loading,
    error: resource.error?.message || '',
  };
}
