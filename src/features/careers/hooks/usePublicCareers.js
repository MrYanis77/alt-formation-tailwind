/** Orchestration React de la liste publique des offres. */
import { useCallback } from 'react';
import { useAsyncResource } from '../../../shared/hooks/useAsyncResource.js';
import { getPublicCareers } from '../api/careersApi.js';
import {
  getStaticCareerOffers,
  mapCareerSummary,
  mergeCareerOffers,
} from '../domain/careerMappers.js';

// Le repli est disponible dès le premier rendu, même avant la réponse de l'API.
const STATIC_OFFERS = Object.freeze({
  offersByDepartment: {
    collaborateur: getStaticCareerOffers('collaborateur'),
    formateur: getStaticCareerOffers('formateur'),
  },
  fromDatabase: false,
});

export function usePublicCareers() {
  const load = useCallback(async ({ signal }) => {
    const json = await getPublicCareers({ signal });
    // L'API groupe déjà les offres ; les valeurs absentes deviennent des listes vides.
    const byDepartment = json.data?.by_department ?? {};
    const collaborateurs = (byDepartment.collaborateur ?? []).map(mapCareerSummary);
    const formateurs = (byDepartment.formateur ?? []).map(mapCareerSummary);
    return {
      offersByDepartment: {
        collaborateur: mergeCareerOffers(collaborateurs, 'collaborateur'),
        formateur: mergeCareerOffers(formateurs, 'formateur'),
      },
      // Ce drapeau permet à l'interface d'indiquer la provenance réelle des données.
      fromDatabase: collaborateurs.length + formateurs.length > 0,
    };
  }, []);
  const resource = useAsyncResource({ key: 'public-careers', load, initialData: STATIC_OFFERS });

  return {
    ...resource.data,
    loading: resource.loading,
    error: resource.error?.message || '',
  };
}
