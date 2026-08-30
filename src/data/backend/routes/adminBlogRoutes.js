import express from 'express';
import { query } from '../db.js';
import { parseId, looksLikeInjection } from '../utils.js';
import { auditLog } from '../audit.js';

const router = express.Router();

router.get('/categories', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT id, slug, label, sort_order, is_active
       FROM blog_categories
       ORDER BY sort_order, id`
    );
    res.json({ success: true, categories: rows });
  } catch (err) {
    console.error('blog categories error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.get('/posts', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT p.id, p.slug, p.title, p.excerpt, p.status, p.published_at, p.views, p.author,
              p.category_id, p.updated_at, c.label AS category_label
       FROM blog_posts p
       JOIN blog_categories c ON c.id = p.category_id
       ORDER BY p.updated_at DESC
       LIMIT 300`
    );
    res.json({ success: true, posts: rows });
  } catch (err) {
    console.error('blog posts list error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.post('/posts', async (req, res) => {
  try {
    const {
      category_id,
      slug,
      title,
      excerpt,
      content,
      author,
      status,
      published_at,
      image_url,
    } = req.body || {};
    const cid = parseId(category_id);
    if (!cid || !slug || !title) {
      return res.status(400).json({ success: false, error: 'Catégorie, slug et titre requis' });
    }
    if (looksLikeInjection(slug) || looksLikeInjection(title)) {
      return res.status(400).json({ success: false, error: 'Contenu invalide' });
    }
    const st = ['draft', 'published', 'archived'].includes(status) ? status : 'draft';
    const pubAt =
      st === 'published' && published_at ? new Date(published_at) : st === 'published' ? new Date() : null;

    const ins = await query(
      `INSERT INTO blog_posts
        (category_id, slug, title, excerpt, content, image_url, author, status, published_at, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cid,
        String(slug).trim().slice(0, 220),
        String(title).trim().slice(0, 255),
        excerpt ? String(excerpt).slice(0, 65535) : null,
        content ? String(content).slice(0, 65535) : null,
        image_url ? String(image_url).slice(0, 512) : null,
        author ? String(author).slice(0, 120) : 'Équipe Alt RH Formations',
        st,
        pubAt && !Number.isNaN(pubAt.getTime()) ? pubAt.toISOString().slice(0, 19).replace('T', ' ') : null,
        req.adminUser.id,
        req.adminUser.id,
      ]
    );

    auditLog({
      adminId: req.adminUser.id,
      action: 'blog_post_create',
      tableName: 'blog_posts',
      recordId: ins.insertId,
      newValue: { slug, title, status: st },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, id: ins.insertId });
  } catch (err) {
    console.error('blog post create error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.patch('/posts/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const prev = await query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    if (prev.length === 0) return res.status(404).json({ success: false, error: 'Introuvable' });

    const {
      category_id,
      slug,
      title,
      excerpt,
      content,
      author,
      status,
      published_at,
      image_url,
    } = req.body || {};

    const cid = category_id != null ? parseId(category_id) : prev[0].category_id;
    if (!cid) return res.status(400).json({ success: false, error: 'Catégorie invalide' });

    const st = status != null && ['draft', 'published', 'archived'].includes(status) ? status : prev[0].status;
    let pubAt = prev[0].published_at;
    if (published_at !== undefined) {
      pubAt = published_at || null;
    }
    if (st === 'published' && !pubAt) {
      pubAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    await query(
      `UPDATE blog_posts SET
        category_id = ?, slug = ?, title = ?, excerpt = ?, content = ?, image_url = ?,
        author = ?, status = ?, published_at = ?, updated_by = ?
       WHERE id = ?`,
      [
        cid,
        String(slug ?? prev[0].slug).trim().slice(0, 220),
        String(title ?? prev[0].title).trim().slice(0, 255),
        excerpt !== undefined ? (excerpt ? String(excerpt).slice(0, 65535) : null) : prev[0].excerpt,
        content !== undefined ? (content ? String(content).slice(0, 65535) : null) : prev[0].content,
        image_url !== undefined ? (image_url ? String(image_url).slice(0, 512) : null) : prev[0].image_url,
        author ? String(author).slice(0, 120) : prev[0].author,
        st,
        pubAt,
        req.adminUser.id,
        id,
      ]
    );

    auditLog({
      adminId: req.adminUser.id,
      action: 'blog_post_update',
      tableName: 'blog_posts',
      recordId: id,
      oldValue: prev[0],
      ipAddress: req.ip,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('blog post patch error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.delete('/posts/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });
    const prev = await query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    await query('DELETE FROM blog_posts WHERE id = ?', [id]);
    auditLog({
      adminId: req.adminUser.id,
      action: 'blog_post_delete',
      tableName: 'blog_posts',
      recordId: id,
      oldValue: prev[0] || null,
      ipAddress: req.ip,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('blog post delete error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
