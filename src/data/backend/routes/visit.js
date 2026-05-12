import express from 'express';
import { recordVisit } from '../middleware/visit.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { page } = req.body || {};
    if (!page) return res.status(400).json({ success: false });

    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket?.remoteAddress;
    const ua = req.headers['user-agent'] || null;

    await recordVisit({ page, ip, userAgent: ua });
    res.json({ success: true });
  } catch (err) {
    console.error('visit error:', err);
    res.status(500).json({ success: false });
  }
});

export default router;
