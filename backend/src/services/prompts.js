// Shared prompt + schema definitions for every AI task the app performs.
// geminiSchema = Gemini-native structured output schema (strict)
// schemaInstructions = plain-text equivalent for providers without native schema support

export function liveSearchPrompt(query) {
  const prompt = `Find or generate 4 to 6 highly realistic business profiles in South Africa (or globally if specified) that match the search query: "${query}". Provide diverse options if the query is broad.`;

  const geminiSchema = {
    type: 'ARRAY',
    items: {
      type: 'OBJECT',
      properties: {
        id: { type: 'STRING' },
        name: { type: 'STRING' },
        category: { type: 'STRING' },
        address: { type: 'STRING' },
        rating: { type: 'NUMBER' },
        reviewCount: { type: 'INTEGER' },
        shortDescription: { type: 'STRING' },
      },
      required: ['id', 'name', 'category', 'address', 'rating', 'reviewCount', 'shortDescription'],
    },
  };

  const schemaInstructions = `A JSON array of 4-6 objects, each with exactly these fields:
{ "id": string, "name": string, "category": string, "address": string, "rating": number (out of 5), "reviewCount": integer, "shortDescription": string }`;

  return { prompt, geminiSchema, schemaInstructions };
}

export function deepAnalysisPrompt(business) {
  const prompt = `Generate extremely detailed AI review analytics for the business "${business.name}" (${business.category}) located at "${business.address}". The business has a ${business.rating} rating and ${business.reviewCount} reviews. Simulate deep sentiment analysis, extract specific aspects (e.g., food, service, cleanliness, pricing), generate 6 months of trends, common keywords, AI insights, actionable recommendations, and include 4 highly realistic sample reviews. ENSURE sentiment percentages (positive, neutral, negative) sum EXACTLY to 100.`;

  const geminiSchema = {
    type: 'OBJECT',
    properties: {
      aiSummary: { type: 'STRING' },
      sentiment: {
        type: 'OBJECT',
        properties: {
          positive: { type: 'INTEGER' },
          neutral: { type: 'INTEGER' },
          negative: { type: 'INTEGER' },
          score: { type: 'NUMBER' },
        },
      },
      emotions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: { name: { type: 'STRING' }, value: { type: 'INTEGER' } },
        },
      },
      aspects: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING' },
            positive: { type: 'INTEGER' },
            negative: { type: 'INTEGER' },
            score: { type: 'NUMBER' },
          },
        },
      },
      keywords: {
        type: 'OBJECT',
        properties: {
          positive: { type: 'ARRAY', items: { type: 'STRING' } },
          negative: { type: 'ARRAY', items: { type: 'STRING' } },
          trending: { type: 'ARRAY', items: { type: 'STRING' } },
        },
      },
      trends: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            month: { type: 'STRING' },
            sentiment: { type: 'NUMBER' },
            rating: { type: 'NUMBER' },
          },
        },
      },
      insights: { type: 'ARRAY', items: { type: 'STRING' } },
      recommendations: { type: 'ARRAY', items: { type: 'STRING' } },
      reviews: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            id: { type: 'STRING' },
            text: { type: 'STRING' },
            rating: { type: 'INTEGER' },
            sentiment: { type: 'STRING' },
            date: { type: 'STRING' },
            aspects: { type: 'ARRAY', items: { type: 'STRING' } },
          },
        },
      },
    },
    required: [
      'aiSummary',
      'sentiment',
      'emotions',
      'aspects',
      'keywords',
      'trends',
      'insights',
      'recommendations',
      'reviews',
    ],
  };

  const schemaInstructions = `A single JSON object with exactly these fields:
{
  "aiSummary": string,
  "sentiment": { "positive": integer, "neutral": integer, "negative": integer, "score": number } (positive+neutral+negative must equal 100),
  "emotions": [{ "name": string, "value": integer }, ...],
  "aspects": [{ "name": string, "positive": integer, "negative": integer, "score": number }, ...] (5 aspects),
  "keywords": { "positive": [string,...], "negative": [string,...], "trending": [string,...] },
  "trends": [{ "month": string, "sentiment": number, "rating": number }, ...] (6 months),
  "insights": [string, ...] (4 items),
  "recommendations": [string, ...] (3 items),
  "reviews": [{ "id": string, "text": string, "rating": integer, "sentiment": "positive"|"neutral"|"negative", "date": "YYYY-MM-DD", "aspects": [string,...] }, ...] (4 reviews)
}`;

  return { prompt, geminiSchema, schemaInstructions };
}

export function competitorAnalysisPrompt(searchQuery) {
  const prompt = `Generate extremely detailed AI review analytics for a competitor business named or matching "${searchQuery}". Provide realistic mock data including name, category, address, rating (out of 5), and review count. Simulate deep sentiment analysis, extract specific aspects (e.g., food, service, cleanliness, pricing). ENSURE sentiment percentages (positive, neutral, negative) sum EXACTLY to 100.`;

  const geminiSchema = {
    type: 'OBJECT',
    properties: {
      id: { type: 'STRING' },
      name: { type: 'STRING' },
      category: { type: 'STRING' },
      address: { type: 'STRING' },
      rating: { type: 'NUMBER' },
      reviewCount: { type: 'INTEGER' },
      sentiment: {
        type: 'OBJECT',
        properties: {
          positive: { type: 'INTEGER' },
          neutral: { type: 'INTEGER' },
          negative: { type: 'INTEGER' },
          score: { type: 'NUMBER' },
        },
      },
      aspects: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING' },
            positive: { type: 'INTEGER' },
            negative: { type: 'INTEGER' },
            score: { type: 'NUMBER' },
          },
        },
      },
    },
    required: ['id', 'name', 'category', 'address', 'rating', 'reviewCount', 'sentiment', 'aspects'],
  };

  const schemaInstructions = `A single JSON object with exactly these fields:
{ "id": string, "name": string, "category": string, "address": string, "rating": number, "reviewCount": integer,
  "sentiment": { "positive": integer, "neutral": integer, "negative": integer, "score": number } (must sum to 100),
  "aspects": [{ "name": string, "positive": integer, "negative": integer, "score": number }, ...] (5 aspects) }`;

  return { prompt, geminiSchema, schemaInstructions };
}

/** Forces sentiment.positive + neutral + negative to sum to exactly 100, rescaling proportionally. */
export function normalizeSentiment(sentiment) {
  if (!sentiment) return sentiment;
  let { positive = 0, neutral = 0, negative = 0 } = sentiment;
  const total = positive + neutral + negative;
  if (total > 0 && total !== 100) {
    positive = Math.round((positive / total) * 100);
    neutral = Math.round((neutral / total) * 100);
    negative = 100 - positive - neutral;
  }
  return { ...sentiment, positive, neutral, negative };
}
