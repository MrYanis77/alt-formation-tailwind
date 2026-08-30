/** Transformations pures entre le contrat PHP du blog et les modèles d'affichage. */
const DEFAULT_CONTENT_IMAGE = '/assets/images/fallback.webp';

// Centralise le format français afin que cartes et pages détail restent cohérentes.
function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return String(iso);
  }
}

/** Convertit un article brut en modèle stable pour les composants React. */
export function mapBlogPost(post) {
  return {
    id: post.id,
    slug: post.slug,
    image: post.cover_image_url || DEFAULT_CONTENT_IMAGE,
    category: post.category_name || 'Actualités',
    categoryShort: (post.category_name || 'Blog').slice(0, 14),
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content || '',
    author: (post.author_name || '').trim() || 'Alt Formation',
    date: formatDate(post.published_at || post.created_at),
    link: `/blog/${post.slug}`,
    readTime: post.read_time_mins ? `${post.read_time_mins} min` : null,
  };
}

/** Fusionne les catégories de référence et celles réellement présentes sans doublon. */
export function mapBlogCategories(posts, apiCategories = []) {
  const names = new Set(['Tous']);
  apiCategories.forEach((category) => names.add(category.name));
  posts.forEach((post) => {
    if (post.category) names.add(post.category);
  });
  return [...names];
}
