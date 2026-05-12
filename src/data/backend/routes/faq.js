import express from 'express';
import { query } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { parseId, looksLikeInjection } from '../utils.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// PUBLIC : liste de la FAQ publiée
// ---------------------------------------------------------------------------
router.get('/published', async (_req, res) => {
  try {
    const rows = await query(
      'SELECT id, question, reponse, categorie, ordre FROM faq ORDER BY categorie, ordre, id'
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
// ADMIN : liste de toutes les demandes FAQ avec infos utilisateur
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

// ---------------------------------------------------------------------------
// ADMIN : répondre à une demande FAQ
// ---------------------------------------------------------------------------
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

    res.json({ success: true });
  } catch (err) {
    console.error('reply faq req error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN : publier une demande FAQ dans la FAQ publique
// ---------------------------------------------------------------------------
router.post('/requests/:id/publish', requireAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const { question, reponse, categorie } = req.body || {};

    if (!question || !reponse) {
      return res.status(400).json({ success: false, error: 'Question et réponse requises' });
    }
    if (looksLikeInjection(question) || looksLikeInjection(reponse) || looksLikeInjection(categorie)) {
      return res.status(400).json({ success: false, error: 'Contenu invalide détecté' });
    }

    const reqRows = await query('SELECT id FROM faq_requests WHERE id = ?', [id]);
    if (reqRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Demande introuvable' });
    }

    const result = await query(
      `INSERT INTO faq (question, reponse, categorie, ordre)
       VALUES (?, ?, ?, 0)`,
      [
        String(question).trim().slice(0, 1000),
        String(reponse).trim().slice(0, 5000),
        String(categorie || 'Général').trim().slice(0, 100),
      ]
    );

    await query(
      `UPDATE faq_requests
       SET status = 'published',
           published_question = ?,
           published_response = ?
       WHERE id = ?`,
      [
        String(question).trim().slice(0, 1000),
        String(reponse).trim().slice(0, 5000),
        id,
      ]
    );

    res.json({ success: true, faqId: result.insertId });
  } catch (err) {
    console.error('publish faq req error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN : CRUD FAQ publique
// ---------------------------------------------------------------------------
router.get('/admin/list', requireAdmin, async (_req, res) => {
  try {
    const rows = await query('SELECT * FROM faq ORDER BY categorie, ordre, id');
    res.json({ success: true, items: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.put('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const { question, reponse, categorie, ordre } = req.body || {};
    if (looksLikeInjection(question) || looksLikeInjection(reponse) || looksLikeInjection(categorie)) {
      return res.status(400).json({ success: false, error: 'Contenu invalide détecté' });
    }
    await query(
      `UPDATE faq SET question = ?, reponse = ?, categorie = ?, ordre = ? WHERE id = ?`,
      [
        String(question || '').slice(0, 1000),
        String(reponse || '').slice(0, 5000),
        String(categorie || 'Général').slice(0, 100),
        Number(ordre) || 0,
        id,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.delete('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });
    await query('DELETE FROM faq WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
