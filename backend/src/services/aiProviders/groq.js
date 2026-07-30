import { config } from '../../config/index.js';
import { extractJson } from '../extractJson.js';

/**
 * Groq doesn't support Gemini-style responseSchema, so we rely on:
 * - response_format: json_object (forces valid JSON output)
 * - a written-out schema description embedded in the prompt
 * @param {string} prompt
 * @param {string} schemaInstructions - plain-text description of the required JSON shape
 * @returns {Promise<object>}
 */
export async function generateWithGroq(prompt, schemaInstructions) {
  if (!config.groq.apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.groq.apiKey}`,
    },
    body: JSON.stringify({
      model: config.groq.model,
      messages: [
        {
          role: 'system',
          content:
            'You output ONLY valid JSON matching the schema described by the user. No prose, no markdown fences, no commentary.',
        },
        {
          role: 'user',
          content: `${prompt}\n\nRequired JSON shape:\n${schemaInstructions}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq request failed (${res.status}): ${errText}`);
  }

  const result = await res.json();
  const text = result?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('Groq returned no content');
  }

  return extractJson(text);
}
