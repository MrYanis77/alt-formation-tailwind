import {
  findBlogAuthors,
  findBlogCategories,
  findBlogPosts,
} from '../repositories/blogRepository.js';

export async function getBlogOverview({ siteId, publishedOnly }) {
  const [categories, authors, posts] = await Promise.all([
    findBlogCategories(siteId),
    findBlogAuthors(siteId),
    findBlogPosts({ siteId, publishedOnly }),
  ]);

  return {
    categories,
    authors,
    posts,
  };
}

export async function getBlogPostBySlug({ siteId, slug, publishedOnly }) {
  const posts = await findBlogPosts({ siteId, slug, publishedOnly });
  return posts[0] || null;
}
