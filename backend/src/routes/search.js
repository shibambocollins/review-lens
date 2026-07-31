import { Router } from "express";
import { generateAnalysis } from "../services/aiFallback.js";
import { liveSearchPrompt } from "../services/prompts.js";

const router = Router();

// POST /api/search  { query: string }
router.post("/", async (req, res, next) => {
  try {
    const { query, lat, lng, relatedTo } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "query is required" });
    }

    const coords =
      Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;

    const related =
      relatedTo && typeof relatedTo.name === "string" && relatedTo.name.trim()
        ? {
            name: relatedTo.name.trim(),
            category:
              typeof relatedTo.category === "string"
                ? relatedTo.category.trim()
                : "",
          }
        : null;

    const { prompt, geminiSchema, schemaInstructions } = liveSearchPrompt(
      query,
      coords,
      related,
    );
    const { data, provider } = await generateAnalysis({
      prompt,
      geminiSchema,
      schemaInstructions,
      order: ["groq", "gemini", "cloudflare"], // Groq first: fastest for per-keystroke search
    });

    const results = Array.isArray(data)
      ? data
      : Array.isArray(data?.results)
        ? data.results
        : [];

    res.json({ results, provider });
  } catch (err) {
    next(err);
  }
});

export default router;
