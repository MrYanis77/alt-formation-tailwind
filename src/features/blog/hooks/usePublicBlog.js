/** Hook d'orchestration du blog : transport, mapping et état asynchrone. */
import { useCallback } from 'react';
import { useAsyncResource } from '../../../shared/hooks/useAsyncResource.js';
import { getPublicBlog } from '../api/blogApi.js';
import { mapBlogCategories, mapBlogPost } from '../domain/blogMappers.js';

const EMPTY_BLOG = Object.freeze({ posts: [], categories: ['Tous'] });

/** Articles publies depuis la BDD publique. */
export function usePublicBlog({ slug, includeDrafts = false } = {}) {
  // La clé force un nouvel état de chargement dès qu'un filtre change.
  const key = `${slug ?? ''}:${includeDrafts}`;
  const load = useCallback(async ({ signal }) => {
    const json = await getPublicBlog({ slug, includeDrafts, signal });
    // Le mapping est appliqué à la frontière : les pages ne voient jamais le format SQL/PHP.
    const posts = (json.data?.posts ?? []).map(mapBlogPost);
    return {
      posts,
      categories: mapBlogCategories(posts, json.data?.categories ?? []),
    };
  }, [includeDrafts, slug]);
  const resource = useAsyncResource({ key, load, initialData: EMPTY_BLOG });

  return {
    ...resource.data,
    loading: resource.loading,
    error: resource.error?.message || '',
  };
}
