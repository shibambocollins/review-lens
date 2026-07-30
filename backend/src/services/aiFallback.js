import { generateWithGemini } from './aiProviders/gemini.js';
import { generateWithGroq } from './aiProviders/groq.js';
import { generateWithCloudflare } from './aiProviders/cloudflare.js';

const PROVIDERS = {
  gemini: (prompt, geminiSchema) => generateWithGemini(prompt, geminiSchema),
  groq: (prompt, geminiSchema, schemaInstructions) => generateWithGroq(prompt, schemaInstructions),
  cloudflare: (prompt, geminiSchema, schemaInstructions) => generateWithCloudflare(prompt, schemaInstructions),
};

/**
 * Runs prompt through providers in the given order, returning the first success.
 * @param {object} params
 * @param {string} params.prompt
 * @param {object} params.geminiSchema
 * @param {string} params.schemaInstructions
 * @param {string[]} [params.order] - provider order; defaults to gemini -> groq -> cloudflare
 */
export async function generateAnalysis({ prompt, geminiSchema, schemaInstructions, order = ['gemini', 'groq', 'cloudflare'] }) {
  const attempts = [];

  for (const name of order) {
    const run = PROVIDERS[name];
    if (!run) continue;
    try {
      const data = await run(prompt, geminiSchema, schemaInstructions);
      return { data, provider: name };
    } catch (err) {
      console.warn(`[ReviewLens] ${name} failed: ${err.message}`);
      attempts.push(`${name}: ${err.message}`);
    }
  }

  const error = new Error(`All AI providers failed:\n${attempts.join('\n')}`);
  error.attempts = attempts;
  throw error;
}