/**
 * Facade de compatibilite. Les nouveaux ecrans importent directement leur module
 * `features/<metier>/api` afin de garder des dependances explicites.
 */
import { apiClient } from '../shared/api/httpClient.js';
import { getPublicBlog } from '../features/blog/api/blogApi.js';
import {
  getPublicCareerOffer,
  getPublicCareers,
} from '../features/careers/api/careersApi.js';
import { getPublicFormations } from '../features/formations/api/formationsApi.js';
import { getPublicPricing } from '../features/pricing/api/pricingApi.js';

export function fetchApiJson(url, options = {}) {
  return apiClient.request(url, options);
}

export function fetchPublicFormations({ slug, type, all = false, signal } = {}) {
  return getPublicFormations({ slug, type, includeDrafts: all, signal });
}

export function fetchPublicBlog({ slug, all = false, signal } = {}) {
  return getPublicBlog({ slug, includeDrafts: all, signal });
}

export function fetchPublicPricing(options = {}) {
  return getPublicPricing(options);
}

export function fetchPublicCareers({ department, all = false, siteId, signal } = {}) {
  return getPublicCareers({ department, includeDrafts: all, siteId, signal });
}

export function fetchPublicCareerOffer(slug, options = {}) {
  return getPublicCareerOffer(slug, options);
}

export { submitCareerApplication } from '../features/careers/api/careersApi.js';
