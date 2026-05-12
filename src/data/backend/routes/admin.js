import express from 'express';
import { query } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';
import { parseId } from '../utils.js';

const router = express.Router();

router.use(requireAdmin);

// ---------------------------------------------------------------------------
// Stats du tableau de bord
// ---------------------------------------------------------------------------
router.get('/stats', async (_req, res) => {
  try {
    const [
      visits7d,
      visits30d,
      newUsers7d,
      totalUsers,
      pendingContacts,
      totalContacts,
      pendingFaq,
      totalFaq,
      visitsDaily,
    ] = await Promise.all([
      query("SELECT COUNT(*) AS c FROM page_visits WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"),
      query("SELECT COUNT(*) AS c FROM page_visits WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"),
      query("SELECT COUNT(*) AS c FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"),
      query("SELECT COUNT(*) AS c FROM users"),
      query("SELECT COUNT(*) AS c FROM contacts WHERE status = 'pending'"),
      query("SELECT COUNT(*) AS c FROM contacts"),
      query("SELECT COUNT(*) AS c FROM faq_requests WHERE status = 'pending'"),
      query("SELECT COUNT(*) AS c FROM faq_requests"),
      query(`SELECT DATE(created_at) AS day, COUNT(*) AS c
             FROM page_visits
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
             GROUP BY day
             ORDER BY day ASC`),
    ]);

    res.json({
      success: true,
      stats: {
        visits7d: visits7d[0].c,
        visits30d: visits30d[0].c,
        newUsers7d: newUsers7d[0].c,
        totalUsers: totalUsers[0].c,
        pendingContacts: pendingContacts[0].c,
        totalContacts: totalContacts[0].c,
        pendingFaq: pendingFaq[0].c,
        totalFaq: totalFaq[0].c,
        visitsDaily: visitsDaily.map((r) => ({ day: r.day, count: r.c })),
      },
    });
  } catch (err) {
    console.error('admin stats error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// Liste des contacts
// ---------------------------------------------------------------------------
router.get('/contacts', async (req, res) => {
  try {
    const status = req.query.status; // pending | read | replied | undefined
    let sql = `SELECT c.id, c.nom, c.prenom, c.email, c.telephone, c.sujet, c.message,
                      c.status, c.created_at, c.user_id,
                      u.prenom AS user_prenom, u.nom AS user_nom
               FROM contacts c
               LEFT JOIN users u ON u.id = c.user_id`;
    const params = [];
    if (status && ['pending', 'read', 'replied'].includes(status)) {
      sql += ' WHERE c.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY c.created_at DESC LIMIT 200';

    const rows = await query(sql, params);
    res.json({ success: true, contacts: rows });
  } catch (err) {
    console.error('admin list contacts error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// Marquer un contact comme lu
// ---------------------------------------------------------------------------
router.patch('/contacts/:id/status', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const { status } = req.body || {};
    if (!['pending', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status invalide' });
    }
    await query('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error('admin update contact status error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// Liste des utilisateurs
// ---------------------------------------------------------------------------
router.get('/users', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT u.id, u.prenom, u.nom, u.email, u.telephone, u.role, u.created_at,
              (SELECT COUNT(*) FROM contacts WHERE user_id = u.id) AS contacts_count,
              (SELECT COUNT(*) FROM faq_requests WHERE user_id = u.id) AS faq_count
       FROM users u
       ORDER BY u.created_at DESC
       LIMIT 500`
    );
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error('admin list users error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// Promouvoir / rétrograder un utilisateur
// ---------------------------------------------------------------------------
router.patch('/users/:id/role', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const { role } = req.body || {};
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Rôle invalide' });
    }

    if (id === req.user.id) {
      return res.status(400).json({ success: false, error: 'Vous ne pouvez pas modifier votre propre rôle' });
    }

    if (role === 'user') {
      const targetRows = await query('SELECT role FROM users WHERE id = ?', [id]);
      if (targetRows.length === 0) {
        return res.status(404).json({ success: false, error: 'Utilisateur introuvable' });
      }
      if (targetRows[0].role === 'admin') {
        const adminCount = await query("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'");
        if (adminCount[0].c <= 1) {
          return res.status(400).json({ success: false, error: 'Impossible : il doit rester au moins un administrateur' });
        }
      }
    }

    await query('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    // Si on rétrograde un admin, on invalide ses sessions actives
    if (role === 'user') {
      await query('DELETE FROM sessions WHERE user_id = ?', [id]);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('admin update role error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

export default router;
