import { Router } from 'express';
import { generateAnalysis } from '../services/aiFallback.js';
import { deepAnalysisPrompt, normalizeSentiment } from '../services/prompts.js';
import { findExactBusinessPhoto } from '../services/googlePlaces.js';
import { getCategoryImage } from '../services/categoryImage.js';

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

    const image =
      business.image ||
      (await findExactBusinessPhoto(business)) ||
      getCategoryImage(business.category, business.name);

    const fullBusiness = { ...business, ...data, image };

    res.json({ business: fullBusiness, provider });
  } catch (err) {
    next(err);
  }
});

export default router;
