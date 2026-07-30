import { Router } from 'express';
import { generateAnalysis } from '../services/aiFallback.js';
import { deepAnalysisPrompt, normalizeSentiment } from '../services/prompts.js';

const router = Router();

// POST /api/analyze  { business: { id, name, category, address, rating, reviewCount } }
router.post('/', async (req, res, next) => {
  try {
    const { business } = req.body;
    if (!business || !business.name) {
      return res.status(400).json({ error: 'business (with at least a name) is required' });
    }

    const { prompt, geminiSchema, schemaInstructions } = deepAnalysisPrompt(business);
    const { data, provider } = await generateAnalysis({ prompt, geminiSchema, schemaInstructions });

    if (data.sentiment) {
      data.sentiment = normalizeSentiment(data.sentiment);
    }

    const fullBusiness = {
      ...business,
      ...data,
      image: business.image || `https://picsum.photos/seed/${encodeURIComponent(business.id || business.name)}/800/400`,
    };

    res.json({ business: fullBusiness, provider });
  } catch (err) {
    next(err);
  }
});

export default router;
