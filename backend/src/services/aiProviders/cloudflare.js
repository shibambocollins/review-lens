import { config } from '../../config/index.js';
import { extractJson } from '../extractJson.js';

/**
 * Cloudflare Workers AI - last resort fallback. Same "describe the schema in text" approach as Groq.
 * @param {string} prompt
 * @param {string} schemaInstructions
 * @returns {Promise<object>}
 */
export async function generateWithCloudflare(prompt, schemaInstructions) {
  if (!config.cloudflare.accountId || !config.cloudflare.apiToken) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN are not configured');
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/ai/run/${config.cloudflare.model}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.cloudflare.apiToken}`,
    },
    body: JSON.stringify({
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
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Cloudflare Workers AI request failed (${res.status}): ${errText}`);
  }

  const result = await res.json();
  const text = result?.result?.response;

  if (!text) {
    throw new Error('Cloudflare Workers AI returned no content');
  }

  return extractJson(text);
}
