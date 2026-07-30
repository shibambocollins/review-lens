import { Router } from 'express';
import { generateAnalysis } from '../services/aiFallback.js';
import { competitorAnalysisPrompt, normalizeSentiment } from '../services/prompts.js';

const router = Router();

// POST /api/compare  { query: string }
router.post('/', async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'query is required' });
    }

    const { prompt, geminiSchema, schemaInstructions } = competitorAnalysisPrompt(query);
    const { data, provider } = await generateAnalysis({ prompt, geminiSchema, schemaInstructions });

    if (data.sentiment) {
      data.sentiment = normalizeSentiment(data.sentiment);
    }

    const fullBusiness = {
      ...data,
      image: `https://picsum.photos/seed/${encodeURIComponent(data.id || query)}/800/400`,
    };

    res.json({ business: fullBusiness, provider });
  } catch (err) {
    next(err);
  }
});

export default router;
