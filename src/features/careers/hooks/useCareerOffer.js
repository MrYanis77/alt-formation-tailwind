/** Orchestration React d'une offre détaillée avec repli local transparent. */
import { useCallback, useMemo } from 'react';
import { useAsyncResource } from '../../../shared/hooks/useAsyncResource.js';
import { getPublicCareerOffer } from '../api/careersApi.js';
import {
  findStaticOfferBySlug,
  mapCareerOfferForDetail,
  mergeCareerOfferWithStatic,
} from '../domain/careerOffers.js';

export function useCareerOffer(slug) {
  // Le calcul n'est refait que lorsque le slug change, pas à chaque rendu React.
  const fallbackOffer = useMemo(() => {
    const fallback = findStaticOfferBySlug(slug);
    return fallback ? mapCareerOfferForDetail(fallback) : null;
  }, [slug]);
  // Référence stable requise par le hook asynchrone partagé.
  const initialData = useMemo(() => ({ offer: fallbackOffer }), [fallbackOffer]);
  const load = useCallback(async ({ signal }) => {
    const json = await getPublicCareerOffer(slug, { signal });
    const row = json.data?.offer;
    // Une ligne BDD partielle est enrichie avant d'être exposée à la page.
    return { offer: row ? mergeCareerOfferWithStatic(row, slug) : fallbackOffer };
  }, [fallbackOffer, slug]);
  const resource = useAsyncResource({
    key: slug || 'offre-absente',
    load,
    initialData,
    enabled: Boolean(slug),
  });

  // Un paramètre de route absent est une erreur fonctionnelle immédiate, pas un chargement.
  if (!slug) return { offer: null, loading: false, error: 'Offre introuvable' };

  return {
    offer: resource.data.offer,
    loading: resource.loading,
    error: resource.loading || resource.data.offer ? '' : 'Offre introuvable',
  };
}
