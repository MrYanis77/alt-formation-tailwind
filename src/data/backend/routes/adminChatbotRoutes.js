import express from 'express';
import { query } from '../db.js';
import { parseId, looksLikeInjection } from '../utils.js';
import { auditLog } from '../audit.js';

const router = express.Router();

router.get('/conversations', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT c.id, c.session_id, c.user_name, c.user_email, c.status, c.handled_by,
              c.created_at, c.updated_at,
              au.username AS handled_by_username,
              (SELECT COUNT(*) FROM chatbot_messages m WHERE m.conversation_id = c.id) AS message_count,
              (SELECT message FROM chatbot_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message
       FROM chatbot_conversations c
       LEFT JOIN admin_users au ON au.id = c.handled_by
       ORDER BY c.updated_at DESC
       LIMIT 150`
    );
    res.json({ success: true, conversations: rows });
  } catch (err) {
    console.error('chatbot list error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.get('/conversations/:id/messages', async (req, res) => {
  try {
    const convId = parseId(req.params.id);
    if (!convId) return res.status(400).json({ success: false, error: 'ID invalide' });

    const conv = await query('SELECT id FROM chatbot_conversations WHERE id = ?', [convId]);
    if (conv.length === 0) return res.status(404).json({ success: false, error: 'Introuvable' });

    const rows = await query(
      `SELECT id, sender, message, faq_item_id, created_at
       FROM chatbot_messages
       WHERE conversation_id = ?
       ORDER BY id ASC`,
      [convId]
    );
    res.json({ success: true, messages: rows });
  } catch (err) {
    console.error('chatbot messages error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.post('/conversations/:id/messages', async (req, res) => {
  try {
    const convId = parseId(req.params.id);
    if (!convId) return res.status(400).json({ success: false, error: 'ID invalide' });

    const { message } = req.body || {};
    if (!message || String(message).trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message vide' });
    }
    if (looksLikeInjection(message)) {
      return res.status(400).json({ success: false, error: 'Contenu invalide' });
    }

    const conv = await query('SELECT id FROM chatbot_conversations WHERE id = ?', [convId]);
    if (conv.length === 0) return res.status(404).json({ success: false, error: 'Introuvable' });

    await query(
      `UPDATE chatbot_conversations SET handled_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND handled_by IS NULL`,
      [req.adminUser.id, convId]
    );

    const ins = await query(
      `INSERT INTO chatbot_messages (conversation_id, sender, message)
       VALUES (?, 'admin', ?)`,
      [convId, String(message).trim().slice(0, 65535)]
    );

    auditLog({
      adminId: req.adminUser.id,
      action: 'chatbot_admin_reply',
      tableName: 'chatbot_messages',
      recordId: ins.insertId,
      newValue: { conversation_id: convId },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, id: ins.insertId });
  } catch (err) {
    console.error('chatbot post message error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
