import express from 'express';
import { query } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { parseId, looksLikeInjection } from '../utils.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// Helper: vérifier qu'un utilisateur a accès à une conversation
// ---------------------------------------------------------------------------
async function userOwnsConversation(user, { contactId, faqRequestId }) {
  if (user.role === 'admin') return true;
  if (contactId) {
    const rows = await query('SELECT user_id FROM contacts WHERE id = ?', [contactId]);
    return rows.length > 0 && rows[0].user_id === user.id;
  }
  if (faqRequestId) {
    const rows = await query('SELECT user_id FROM faq_requests WHERE id = ?', [faqRequestId]);
    return rows.length > 0 && rows[0].user_id === user.id;
  }
  return false;
}

// ---------------------------------------------------------------------------
// USER : liste de mes conversations (contacts + faq_requests)
// ---------------------------------------------------------------------------
router.get('/conversations/mine', requireAuth, async (req, res) => {
  try {
    const contacts = await query(
      `SELECT c.id, c.sujet, c.status, c.created_at,
              (SELECT COUNT(*) FROM chat_messages m WHERE m.contact_id = c.id) AS message_count,
              (SELECT message FROM chat_messages m WHERE m.contact_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message
       FROM contacts c
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    const faqReqs = await query(
      `SELECT fr.id, fr.question, fr.status, fr.created_at,
              (SELECT COUNT(*) FROM chat_messages m WHERE m.faq_request_id = fr.id) AS message_count,
              (SELECT message FROM chat_messages m WHERE m.faq_request_id = fr.id ORDER BY m.created_at DESC LIMIT 1) AS last_message
       FROM faq_requests fr
       WHERE fr.user_id = ?
       ORDER BY fr.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      conversations: {
        contacts,
        faqRequests: faqReqs,
      },
    });
  } catch (err) {
    console.error('list mine conv error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN : liste de toutes les conversations
// ---------------------------------------------------------------------------
router.get('/conversations', requireAdmin, async (_req, res) => {
  try {
    const contacts = await query(
      `SELECT c.id, c.sujet, c.message, c.telephone, c.status, c.created_at,
              c.user_id, u.prenom, u.nom, u.email,
              (SELECT COUNT(*) FROM chat_messages m WHERE m.contact_id = c.id) AS message_count,
              (SELECT message FROM chat_messages m WHERE m.contact_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
              (SELECT created_at FROM chat_messages m WHERE m.contact_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message_at
       FROM contacts c
       LEFT JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC
       LIMIT 200`
    );
    res.json({ success: true, contacts });
  } catch (err) {
    console.error('admin list conv error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// GET contexte d'une conversation (sujet/message initial pour un contact,
// question + réponse admin pour une faq_request)
// ---------------------------------------------------------------------------
router.get('/context', requireAuth, async (req, res) => {
  try {
    const contactId = req.query.contactId ? parseId(req.query.contactId) : null;
    const faqRequestId = req.query.faqRequestId ? parseId(req.query.faqRequestId) : null;

    if (!contactId && !faqRequestId) {
      return res.status(400).json({ success: false, error: 'contactId ou faqRequestId requis' });
    }

    const ok = await userOwnsConversation(req.user, { contactId, faqRequestId });
    if (!ok) return res.status(403).json({ success: false, error: 'Accès refusé' });

    if (contactId) {
      const rows = await query(
        `SELECT c.id, c.sujet, c.message, c.telephone, c.status, c.created_at,
                c.user_id, c.prenom, c.nom, c.email
         FROM contacts c
         WHERE c.id = ?
         LIMIT 1`,
        [contactId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Conversation introuvable' });
      }
      return res.json({ success: true, type: 'contact', context: rows[0] });
    }

    const rows = await query(
      `SELECT fr.id, fr.question, fr.admin_response, fr.status, fr.created_at, fr.replied_at,
              fr.user_id, u.prenom, u.nom, u.email
       FROM faq_requests fr
       JOIN users u ON u.id = fr.user_id
       WHERE fr.id = ?
       LIMIT 1`,
      [faqRequestId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Conversation introuvable' });
    }
    return res.json({ success: true, type: 'faq', context: rows[0] });
  } catch (err) {
    console.error('get context error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// GET messages d'une conversation
// ---------------------------------------------------------------------------
router.get('/messages', requireAuth, async (req, res) => {
  try {
    const contactId = req.query.contactId ? parseId(req.query.contactId) : null;
    const faqRequestId = req.query.faqRequestId ? parseId(req.query.faqRequestId) : null;
    const afterRaw = req.query.after ? Number(req.query.after) : 0;
    const after = Number.isFinite(afterRaw) && afterRaw >= 0 ? Math.floor(afterRaw) : 0;

    if (!contactId && !faqRequestId) {
      return res.status(400).json({ success: false, error: 'contactId ou faqRequestId requis' });
    }

    const ok = await userOwnsConversation(req.user, { contactId, faqRequestId });
    if (!ok) return res.status(403).json({ success: false, error: 'Accès refusé' });

    let sql, params;
    if (contactId) {
      sql = `SELECT m.id, m.message, m.sender_role, m.sender_id, m.created_at,
                    u.prenom, u.nom
             FROM chat_messages m
             JOIN users u ON u.id = m.sender_id
             WHERE m.contact_id = ? AND m.id > ?
             ORDER BY m.id ASC`;
      params = [contactId, after];
    } else {
      sql = `SELECT m.id, m.message, m.sender_role, m.sender_id, m.created_at,
                    u.prenom, u.nom
             FROM chat_messages m
             JOIN users u ON u.id = m.sender_id
             WHERE m.faq_request_id = ? AND m.id > ?
             ORDER BY m.id ASC`;
      params = [faqRequestId, after];
    }

    const rows = await query(sql, params);
    res.json({ success: true, messages: rows });
  } catch (err) {
    console.error('get messages error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// ---------------------------------------------------------------------------
// POST nouveau message
// ---------------------------------------------------------------------------
router.post('/messages', requireAuth, async (req, res) => {
  try {
    const { message } = req.body || {};
    const contactId = req.body?.contactId ? parseId(req.body.contactId) : null;
    const faqRequestId = req.body?.faqRequestId ? parseId(req.body.faqRequestId) : null;

    if (!message || String(message).trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message vide' });
    }
    if (looksLikeInjection(message)) {
      return res.status(400).json({ success: false, error: 'Contenu invalide détecté' });
    }
    if (String(message).length > 2000) {
      return res.status(400).json({ success: false, error: 'Message trop long' });
    }
    if (!contactId && !faqRequestId) {
      return res.status(400).json({ success: false, error: 'contactId ou faqRequestId requis (entier positif)' });
    }

    const ok = await userOwnsConversation(req.user, { contactId, faqRequestId });
    if (!ok) return res.status(403).json({ success: false, error: 'Accès refusé' });

    const result = await query(
      `INSERT INTO chat_messages (contact_id, faq_request_id, sender_id, sender_role, message)
       VALUES (?, ?, ?, ?, ?)`,
      [
        contactId,
        faqRequestId,
        req.user.id,
        req.user.role,
        String(message).trim().slice(0, 2000),
      ]
    );

    if (req.user.role === 'admin' && contactId) {
      await query(
        `UPDATE contacts SET status = 'replied' WHERE id = ?`,
        [contactId]
      );
    }

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('post message error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

export default router;
