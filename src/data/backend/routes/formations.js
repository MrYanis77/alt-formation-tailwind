import express from 'express';
import { getFormationBySlug, getFormationCatalog } from '../services/formationService.js';

const router = express.Router();
const SITE_ID = process.env.SITE_ID || 1;

// GET /api/formations
router.get('/', async (req, res) => {
  try {
    const publishedOnly = req.query.all !== '1';
    const catalog = await getFormationCatalog({ siteId: SITE_ID, publishedOnly });

    res.json({
      ok: true,
      site_id: SITE_ID,
      data: catalog,
      count: catalog.courses.length,
    });
  } catch (err) {
    console.error('[formations API] Erreur:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/formations/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const publishedOnly = req.query.all !== '1';
    const course = await getFormationBySlug({ siteId: SITE_ID, slug, publishedOnly });

    if (!course) {
      return res.status(404).json({ ok: false, error: 'Formation introuvable' });
    }

    return res.json({
      ok: true,
      data: course,
    });
  } catch (err) {
    console.error('[formations API] Erreur:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
