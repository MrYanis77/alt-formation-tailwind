import { query } from '../db.js';

export async function findFormationCategories({ siteId, publishedOnly }) {
  const sql = `
    SELECT *
    FROM formation_categories
    WHERE site_id = ?
    ${publishedOnly ? 'AND is_active = 1' : ''}
    ORDER BY sort_order ASC, id ASC
  `;

  return query(sql, [siteId]);
}

export async function findFormationCourses({ siteId, publishedOnly, slug = null }) {
  let sql = `
    SELECT fc.*,
           cat.slug AS category_slug,
           cat.name AS category_name
    FROM formation_courses fc
    LEFT JOIN formation_categories cat ON cat.id = fc.category_id
    WHERE fc.site_id = ?
  `;
  const params = [siteId];

  if (slug) {
    sql += ' AND fc.slug = ?';
    params.push(slug);
  }

  if (publishedOnly) {
    sql += " AND fc.status = 'published'";
  }

  sql += ' ORDER BY fc.id ASC';

  return query(sql, params);
}

export async function findCourseModules(courseId) {
  return query(
    'SELECT * FROM formation_modules WHERE course_id = ? ORDER BY sort_order ASC, id ASC',
    [courseId],
  );
}

export async function findCourseSkills(courseId) {
  return query(
    'SELECT * FROM formation_skills WHERE course_id = ? ORDER BY sort_order ASC, id ASC',
    [courseId],
  );
}

export async function findCourseJobs(courseId) {
  return query(
    'SELECT * FROM formation_jobs WHERE course_id = ? ORDER BY sort_order ASC, id ASC',
    [courseId],
  );
}
