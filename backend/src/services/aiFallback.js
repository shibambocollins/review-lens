import { generateWithGemini } from './aiProviders/gemini.js';
import { generateWithGroq } from './aiProviders/groq.js';
import { generateWithCloudflare } from './aiProviders/cloudflare.js';

/**
 * Runs prompt through Gemini -> Groq -> Cloudflare Workers AI, in order,
 * returning the first successful parsed JSON result.
 *
 * @param {object} params
 * @param {string} params.prompt - the task prompt
 * @param {object} params.geminiSchema - Gemini-native responseSchema object
 * @param {string} params.schemaInstructions - plain-text schema description for Groq/Cloudflare
 * @returns {Promise<{data: object, provider: string}>}
 */
export async function generateAnalysis({ prompt, geminiSchema, schemaInstructions }) {
  const attempts = [];

  try {
    const data = await generateWithGemini(prompt, geminiSchema);
    return { data, provider: 'gemini' };
  } catch (err) {
    attempts.push(`gemini: ${err.message}`);
  }

  try {
    const data = await generateWithGroq(prompt, schemaInstructions);
    return { data, provider: 'groq' };
  } catch (err) {
    attempts.push(`groq: ${err.message}`);
  }

  try {
    const data = await generateWithCloudflare(prompt, schemaInstructions);
    return { data, provider: 'cloudflare' };
  } catch (err) {
    attempts.push(`cloudflare: ${err.message}`);
  }

  const error = new Error(`All AI providers failed:\n${attempts.join('\n')}`);
  error.attempts = attempts;
  throw error;
}
