import { Router } from 'express';
import { generateAnalysis } from '../services/aiFallback.js';
import { liveSearchPrompt } from '../services/prompts.js';

const router = Router();

// POST /api/search  { query: string }
router.post('/', async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'query is required' });
    }

    const { prompt, geminiSchema, schemaInstructions } = liveSearchPrompt(query);
    const { data, provider } = await generateAnalysis({ prompt, geminiSchema, schemaInstructions });

    res.json({ results: Array.isArray(data) ? data : [], provider });
  } catch (err) {
    next(err);
  }
});

export default router;
