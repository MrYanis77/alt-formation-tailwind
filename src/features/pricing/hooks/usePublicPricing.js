import { useCallback } from 'react';
import { useAsyncResource } from '../../../shared/hooks/useAsyncResource.js';
import { getPublicPricing } from '../api/pricingApi.js';

export { mapPricingPlansToBilanFormules } from '../domain/pricingMappers.js';

const EMPTY_PRICING = Object.freeze({ plans: [], grouped: [], site: null });

/** Charge la tarification publique d'une entite sans exposer le contrat HTTP aux pages. */
export function usePublicPricing({ entityType = 'service', entitySlug, siteId } = {}) {
  const key = `${entityType}:${entitySlug ?? ''}:${siteId ?? ''}`;
  const load = useCallback(async ({ signal }) => {
    const json = await getPublicPricing({ entityType, entitySlug, siteId, signal });
    return {
      plans: json.data?.plans ?? [],
      grouped: json.data?.grouped ?? [],
      site: json.site ?? null,
    };
  }, [entitySlug, entityType, siteId]);
  const resource = useAsyncResource({ key, load, initialData: EMPTY_PRICING });

  return {
    ...resource.data,
    loading: resource.loading,
    error: resource.error?.message || '',
  };
}
