import { query } from '../db.js';

export async function findBlogCategories(siteId) {
  return query(
    'SELECT * FROM blog_categories WHERE site_id = ? AND is_active = 1 ORDER BY sort_order ASC, id ASC',
    [siteId],
  );
}

export async function findBlogAuthors(siteId) {
  try {
    return await query(
      'SELECT * FROM blog_authors WHERE site_id = ? AND is_active = 1 ORDER BY id ASC',
      [siteId],
    );
  } catch {
    return [];
  }
}

export async function findBlogPosts({ siteId, publishedOnly, slug = null }) {
  let sql = `
    SELECT p.*,
           c.slug AS category_slug,
           c.name AS category_name,
           CONCAT(COALESCE(a.first_name, ''), ' ', COALESCE(a.last_name, '')) AS author_name,
           a.slug AS author_slug,
           a.avatar_url AS author_avatar_url
    FROM blog_posts p
    LEFT JOIN blog_categories c ON c.id = p.category_id
    LEFT JOIN blog_authors a ON a.id = p.author_id
    WHERE p.site_id = ? AND p.deleted_at IS NULL
  `;
  const params = [siteId];

  if (slug) {
    sql += ' AND p.slug = ?';
    params.push(slug);
  }

  if (publishedOnly) {
    sql += " AND p.status = 'published'";
  }

  sql += ' ORDER BY COALESCE(p.published_at, p.created_at) DESC, p.id DESC';

  return query(sql, params);
}
