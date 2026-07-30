/**
 * Models sometimes wrap JSON in ```json fences or add stray text around it.
 * This strips fences and grabs the outermost {...} or [...] block, then parses it.
 */
export function extractJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('No text returned from model to parse as JSON');
  }

  let text = rawText.trim();
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

  // If the model added preamble/postamble, isolate the first {...} or [...] block
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  let start = -1;
  if (firstBrace === -1) start = firstBracket;
  else if (firstBracket === -1) start = firstBrace;
  else start = Math.min(firstBrace, firstBracket);

  if (start > 0) {
    const lastBrace = text.lastIndexOf('}');
    const lastBracket = text.lastIndexOf(']');
    const end = Math.max(lastBrace, lastBracket);
    if (end > start) {
      text = text.slice(start, end + 1);
    }
  }

  return JSON.parse(text);
}
