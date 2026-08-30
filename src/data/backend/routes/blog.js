import express from 'express';
import { getBlogOverview, getBlogPostBySlug } from '../services/blogService.js';

const router = express.Router();
const SITE_ID = process.env.SITE_ID || 1;

// GET /api/blog
router.get('/', async (req, res) => {
  try {
    const publishedOnly = req.query.all !== '1';
    const data = await getBlogOverview({ siteId: SITE_ID, publishedOnly });

    res.json({
      ok: true,
      data,
    });
  } catch (err) {
    console.error('[blog API] Erreur:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/blog/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const publishedOnly = req.query.all !== '1';
    const post = await getBlogPostBySlug({ siteId: SITE_ID, slug, publishedOnly });

    if (!post) {
      return res.status(404).json({ ok: false, error: 'Article introuvable' });
    }

    return res.json({
      ok: true,
      data: post,
    });
  } catch (err) {
    console.error('[blog API] Erreur:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
