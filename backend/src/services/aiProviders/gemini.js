import { config } from '../../config/index.js';
import { extractJson } from '../extractJson.js';

/**
 * Calls Gemini with a JSON response schema (native structured output support).
 * @param {string} prompt
 * @param {object} schema - Gemini responseSchema object
 * @returns {Promise<object>}
 */
export async function generateWithGemini(prompt, schema) {
  if (!config.gemini.apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini request failed (${res.status}): ${errText}`);
  }

  const result = await res.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini returned no content (possibly blocked by safety filters)');
  }

  return extractJson(text);
}
