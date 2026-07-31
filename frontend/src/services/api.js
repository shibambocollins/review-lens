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

/**
 * Live search dropdown - returns a short list of business candidates.
 * `coords` ({ lat, lng }) is optional and biases results toward the user's location.
 * `relatedTo` ({ name, category }) is optional and softly biases results toward competitors of that business.
 */
export async function liveSearch(query, coords, relatedTo) {
  const body = { query };
  if (coords) {
    body.lat = coords.lat;
    body.lng = coords.lng;
  }
  if (relatedTo?.name) {
    body.relatedTo = { name: relatedTo.name, category: relatedTo.category };
  }
  const { results } = await post('/search', body);
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

/** Fetches 4 more AI-generated reviews for a business, distinct from the ones already shown. */
export async function loadMoreReviews(business, existingReviews) {
  const { reviews } = await post('/reviews/more', { business, existingReviews });
  return reviews;
}
