import express from "express";
import cors from "cors";
import { config } from "./src/config/index.js";
import searchRoute from "./src/routes/search.js";
import analyzeRoute from "./src/routes/analyze.js";
import compareRoute from "./src/routes/compare.js";
import reviewsRoute from "./src/routes/reviews.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.frontendUrls.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
  }),
);

app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    providers: {
      gemini: Boolean(config.gemini.apiKey),
      groq: Boolean(config.groq.apiKey),
      cloudflare: Boolean(
        config.cloudflare.accountId && config.cloudflare.apiToken,
      ),
      googlePlaces: Boolean(config.googlePlaces.apiKey),
    },
  });
});

app.use("/api/search", searchRoute);
app.use("/api/analyze", analyzeRoute);
app.use("/api/compare", compareRoute);
app.use("/api/reviews", reviewsRoute);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`ReviewLens backend running on http://localhost:${config.port}`);
});
