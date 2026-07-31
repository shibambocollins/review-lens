import { Router } from "express";
import { generateAnalysis } from "../services/aiFallback.js";
import { moreReviewsPrompt } from "../services/prompts.js";

const router = Router();

// POST /api/reviews/more  { business, existingReviews }
router.post("/more", async (req, res, next) => {
  try {
    const { business, existingReviews } = req.body;
    if (!business || !business.name) {
      return res
        .status(400)
        .json({ error: "business (with at least a name) is required" });
    }

    const { prompt, geminiSchema, schemaInstructions } = moreReviewsPrompt(
      business,
      Array.isArray(existingReviews) ? existingReviews : [],
    );
    const { data, provider } = await generateAnalysis({
      prompt,
      geminiSchema,
      schemaInstructions,
    });

    const reviews = Array.isArray(data?.reviews) ? data.reviews : [];
    res.json({ reviews, provider });
  } catch (err) {
    next(err);
  }
});

export default router;
