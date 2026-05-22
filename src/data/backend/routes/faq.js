import express from 'express';
import { query } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { parseId, looksLikeInjection } from '../utils.js';
import { auditLog } from '../audit.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// PUBLIC : liste de la FAQ publiée (faq_categories + faq_items)
// ---------------------------------------------------------------------------
router.get('/published', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT fi.id,
              fi.question,
              fi.answer AS reponse,
              fc.slug AS category_slug,
              fc.label AS categorie,
              fi.sort_order AS ordre,
              fi.category_id
       FROM faq_items fi
       INNER JOIN faq_categories fc ON fc.id = fi.category_id
       WHERE fi.is_active = 1 AND fc.is_active = 1
       ORDER BY fc.sort_order, fi.sort_order, fi.id`
    );
    res.json({ success: true, items: rows });
  } catch (err) {
    console.error('list published faq error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// USER : soumettre une question
// ---------------------------------------------------------------------------
router.post('/requests', requireAuth, async (req, res) => {
  try {
    const { question } = req.body || {};
    if (!question || String(question).trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Question trop courte (5 caractères mini)' });
    }
    if (looksLikeInjection(question)) {
      return res.status(400).json({ success: false, error: 'Contenu invalide détecté' });
    }
    if (String(question).length > 1000) {
      return res.status(400).json({ success: false, error: 'Question trop longue (1000 max)' });
    }

    const result = await query(
      `INSERT INTO faq_requests (user_id, question, status)
       VALUES (?, ?, 'pending')`,
      [req.user.id, String(question).trim()]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('create faq request error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// USER : liste de mes questions
// ---------------------------------------------------------------------------
router.get('/requests/mine', requireAuth, async (req, res) => {
  try {
    const rows = await query(
      `SELECT id, question, admin_response, status, created_at, replied_at
       FROM faq_requests
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, requests: rows });
  } catch (err) {
    console.error('list mine faq req error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN : demandes FAQ utilisateurs (faq_requests)
// ---------------------------------------------------------------------------
router.get('/requests', requireAdmin, async (_req, res) => {
  try {
    const rows = await query(
      `SELECT fr.id, fr.question, fr.admin_response, fr.status,
              fr.published_question, fr.published_response,
              fr.created_at, fr.replied_at,
              u.id AS user_id, u.prenom, u.nom, u.email
       FROM faq_requests fr
       JOIN users u ON u.id = fr.user_id
       ORDER BY fr.created_at DESC`
    );
    res.json({ success: true, requests: rows });
  } catch (err) {
    console.error('admin list faq req error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

router.post('/requests/:id/reply', requireAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const { response } = req.body || {};
    if (!response || String(response).trim().length < 1) {
      return res.status(400).json({ success: false, error: 'Réponse vide' });
    }
    if (looksLikeInjection(response)) {
      return res.status(400).json({ success: false, error: 'Contenu invalide détecté' });
    }

    const exists = await query('SELECT id FROM faq_requests WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ success: false, error: 'Demande introuvable' });
    }

    await query(
      `UPDATE faq_requests
       SET admin_response = ?, status = 'replied', replied_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [String(response).trim().slice(0, 5000), id]
    );

    auditLog({
      adminId: req.adminUser.id,
      action: 'faq_request_reply',
      tableName: 'faq_requests',
      recordId: id,
      ipAddress: req.ip,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('reply faq req error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

router.post('/requests/:id/publish', requireAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const { question, reponse, answer, category_id, category_slug } = req.body || {};
    const bodyAnswer = answer ?? reponse;

    if (!question || !bodyAnswer) {
      return res.status(400).json({ success: false, error: 'Question et réponse requises' });
    }
    if (
      looksLikeInjection(question) ||
      looksLikeInjection(bodyAnswer) ||
      looksLikeInjection(category_slug)
    ) {
      return res.status(400).json({ success: false, error: 'Contenu invalide détecté' });
    }

    const reqRows = await query('SELECT id FROM faq_requests WHERE id = ?', [id]);
    if (reqRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Demande introuvable' });
    }

    let catId = parseId(category_id);
    if (!catId && category_slug) {
      const cats = await query('SELECT id FROM faq_categories WHERE slug = ? LIMIT 1', [
        String(category_slug).trim(),
      ]);
      catId = cats[0]?.id || null;
    }
    if (!catId) {
      const fallback = await query(
        `SELECT id FROM faq_categories WHERE slug = 'formations' LIMIT 1`
      );
      catId = fallback[0]?.id;
    }
    if (!catId) {
      return res.status(400).json({
        success: false,
        error: 'Catégorie FAQ invalide : fournissez category_id ou category_slug',
      });
    }

    const adminId = req.adminUser.id;
    const ins = await query(
      `INSERT INTO faq_items (category_id, question, answer, sort_order, is_active, created_by, updated_by)
       VALUES (?, ?, ?, 0, 1, ?, ?)`,
      [
        catId,
        String(question).trim().slice(0, 65000),
        String(bodyAnswer).trim().slice(0, 65000),
        adminId,
        adminId,
      ]
    );

    await query(
      `UPDATE faq_requests
       SET status = 'published',
           published_question = ?,
           published_response = ?
       WHERE id = ?`,
      [
        String(question).trim().slice(0, 65000),
        String(bodyAnswer).trim().slice(0, 65000),
        id,
      ]
    );

    auditLog({
      adminId,
      action: 'faq_request_publish',
      tableName: 'faq_items',
      recordId: ins.insertId,
      newValue: { faq_request_id: id, category_id: catId },
      ipAddress: req.ip,
    });

    res.json({ success: true, faqItemId: ins.insertId });
  } catch (err) {
    console.error('publish faq req error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN : catégories FAQ
// ---------------------------------------------------------------------------
router.get('/admin/categories', requireAdmin, async (_req, res) => {
  try {
    const rows = await query(
      `SELECT id, slug, label, sort_order, is_active, created_at, updated_at
       FROM faq_categories
       ORDER BY sort_order, id`
    );
    res.json({ success: true, categories: rows });
  } catch (err) {
    console.error('faq admin categories error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.post('/admin/categories', requireAdmin, async (req, res) => {
  try {
    const { slug, label, sort_order, is_active } = req.body || {};
    if (!slug || !label) {
      return res.status(400).json({ success: false, error: 'Slug et libellé requis' });
    }
    if (looksLikeInjection(slug) || looksLikeInjection(label)) {
      return res.status(400).json({ success: false, error: 'Contenu invalide détecté' });
    }
    const result = await query(
      `INSERT INTO faq_categories (slug, label, sort_order, is_active)
       VALUES (?, ?, ?, ?)`,
      [
        String(slug).trim().slice(0, 80),
        String(label).trim().slice(0, 120),
        Number(sort_order) || 0,
        is_active === false ? 0 : 1,
      ]
    );
    auditLog({
      adminId: req.adminUser.id,
      action: 'faq_category_create',
      tableName: 'faq_categories',
      recordId: result.insertId,
      newValue: { slug, label },
      ipAddress: req.ip,
    });
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('faq create category error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.put('/admin/categories/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });
    const { slug, label, sort_order, is_active } = req.body || {};
    if (looksLikeInjection(slug) || looksLikeInjection(label)) {
      return res.status(400).json({ success: false, error: 'Contenu invalide détecté' });
    }
    const prev = await query('SELECT * FROM faq_categories WHERE id = ?', [id]);
    if (prev.length === 0) return res.status(404).json({ success: false, error: 'Introuvable' });

    await query(
      `UPDATE faq_categories SET slug = ?, label = ?, sort_order = ?, is_active = ?
       WHERE id = ?`,
      [
        String(slug ?? prev[0].slug).trim().slice(0, 80),
        String(label ?? prev[0].label).trim().slice(0, 120),
        Number(sort_order ?? prev[0].sort_order),
        is_active === false ? 0 : is_active === true ? 1 : prev[0].is_active,
        id,
      ]
    );
    auditLog({
      adminId: req.adminUser.id,
      action: 'faq_category_update',
      tableName: 'faq_categories',
      recordId: id,
      oldValue: prev[0],
      ipAddress: req.ip,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('faq update category error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.delete('/admin/categories/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });
    const prev = await query('SELECT * FROM faq_categories WHERE id = ?', [id]);
    await query('DELETE FROM faq_categories WHERE id = ?', [id]);
    auditLog({
      adminId: req.adminUser.id,
      action: 'faq_category_delete',
      tableName: 'faq_categories',
      recordId: id,
      oldValue: prev[0] || null,
      ipAddress: req.ip,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('faq delete category error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN : items FAQ
// ---------------------------------------------------------------------------
router.get('/admin/items', requireAdmin, async (_req, res) => {
  try {
    const rows = await query(
      `SELECT fi.id, fi.category_id, fi.question, fi.answer AS reponse, fi.sort_order AS ordre,
              fi.is_active, fi.created_at, fi.updated_at,
              fc.slug AS category_slug, fc.label AS categorie
       FROM faq_items fi
       INNER JOIN faq_categories fc ON fc.id = fi.category_id
       ORDER BY fc.sort_order, fi.sort_order, fi.id`
    );
    res.json({ success: true, items: rows });
  } catch (err) {
    console.error('faq admin items error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.post('/admin/items', requireAdmin, async (req, res) => {
  try {
    const { category_id, question, answer, reponse, sort_order, is_active } = req.body || {};
    const textAnswer = answer ?? reponse;
    const cid = parseId(category_id);
    if (!cid || !question || !textAnswer) {
      return res.status(400).json({ success: false, error: 'Catégorie, question et réponse requises' });
    }
    if (looksLikeInjection(question) || looksLikeInjection(textAnswer)) {
      return res.status(400).json({ success: false, error: 'Contenu invalide détecté' });
    }
    const adminId = req.adminUser.id;
    const result = await query(
      `INSERT INTO faq_items (category_id, question, answer, sort_order, is_active, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cid,
        String(question).trim(),
        String(textAnswer).trim(),
        Number(sort_order) || 0,
        is_active === false ? 0 : 1,
        adminId,
        adminId,
      ]
    );
    auditLog({
      adminId,
      action: 'faq_item_create',
      tableName: 'faq_items',
      recordId: result.insertId,
      newValue: { category_id: cid, question },
      ipAddress: req.ip,
    });
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('faq item create error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.put('/admin/items/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });
    const { category_id, question, answer, reponse, ordre, sort_order, is_active } = req.body || {};
    const textAnswer = answer ?? reponse;
    const prev = await query('SELECT * FROM faq_items WHERE id = ?', [id]);
    if (prev.length === 0) return res.status(404).json({ success: false, error: 'Introuvable' });

    const cid = category_id != null ? parseId(category_id) : prev[0].category_id;
    if (!cid) return res.status(400).json({ success: false, error: 'Catégorie invalide' });

    const ord = Number(sort_order ?? ordre ?? prev[0].sort_order);

    await query(
      `UPDATE faq_items
       SET category_id = ?, question = ?, answer = ?, sort_order = ?, is_active = ?, updated_by = ?
       WHERE id = ?`,
      [
        cid,
        String(question ?? prev[0].question),
        String(textAnswer ?? prev[0].answer),
        ord,
        is_active === false ? 0 : is_active === true ? 1 : prev[0].is_active,
        req.adminUser.id,
        id,
      ]
    );
    auditLog({
      adminId: req.adminUser.id,
      action: 'faq_item_update',
      tableName: 'faq_items',
      recordId: id,
      oldValue: prev[0],
      ipAddress: req.ip,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('faq item update error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.delete('/admin/items/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });
    const prev = await query('SELECT * FROM faq_items WHERE id = ?', [id]);
    await query('DELETE FROM faq_items WHERE id = ?', [id]);
    auditLog({
      adminId: req.adminUser.id,
      action: 'faq_item_delete',
      tableName: 'faq_items',
      recordId: id,
      oldValue: prev[0] || null,
      ipAddress: req.ip,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('faq item delete error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

/** Compat : ancienne route liste admin → renvoie les items normalisés */
router.get('/admin/list', requireAdmin, async (_req, res) => {
  try {
    const rows = await query(
      `SELECT fi.id,
              fi.question,
              fi.answer AS reponse,
              fc.label AS categorie,
              fi.sort_order AS ordre,
              fi.category_id,
              fi.is_active
       FROM faq_items fi
       INNER JOIN faq_categories fc ON fc.id = fi.category_id
       ORDER BY fc.sort_order, fi.sort_order, fi.id`
    );
    res.json({ success: true, items: rows });
  } catch (err) {
    console.error('faq admin list alias error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
