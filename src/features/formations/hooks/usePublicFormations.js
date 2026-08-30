/** Orchestration React du catalogue public de formations. */
import { useCallback } from 'react';
import { useAsyncResource } from '../../../shared/hooks/useAsyncResource.js';
import { getPublicFormations } from '../api/formationsApi.js';
import { mapFormationCard } from '../domain/formationMappers.js';

// Objet immuable : sa référence stable évite de relancer inutilement useEffect.
const EMPTY_CATALOG = Object.freeze({ courses: [], categories: [], site: null });

/** Formations publiees depuis la BDD publique. */
export function usePublicFormations({ slug, type, includeDrafts = false } = {}) {
  // Tous les paramètres influençant la requête font partie de la clé de cache locale.
  const key = `${slug ?? ''}:${type ?? ''}:${includeDrafts}`;
  const load = useCallback(async ({ signal }) => {
    const json = await getPublicFormations({ slug, type, includeDrafts, signal });
    // `formations` maintient la compatibilité avec une ancienne version du contrat PHP.
    const courses = (json.data?.courses ?? json.data?.formations ?? []).map(mapFormationCard);
    return {
      courses,
      categories: json.data?.categories ?? [],
      site: json.site ?? null,
    };
  }, [includeDrafts, slug, type]);
  const resource = useAsyncResource({ key, load, initialData: EMPTY_CATALOG });

  return {
    ...resource.data,
    loading: resource.loading,
    error: resource.error?.message || '',
  };
}
