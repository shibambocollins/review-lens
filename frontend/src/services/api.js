const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function post(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `Request to ${path} failed (${res.status})`);
  }

  return res.json();
}

/** Live search dropdown - returns a short list of business candidates. */
export async function liveSearch(query) {
  const { results } = await post('/search', { query });
  return results;
}

/** Deep analysis for a selected business - returns the full analytics object. */
export async function analyzeBusiness(business) {
  const { business: fullBusiness } = await post('/analyze', { business });
  return fullBusiness;
}

/** Deep analysis for an arbitrary competitor name (used in the Compare view). */
export async function compareBusiness(query) {
  const { business } = await post('/compare', { query });
  return business;
}
