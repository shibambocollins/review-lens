// Ordered most-specific-first: the first keyword match wins. Used for businesses that haven't
// been through /api/analyze yet (live-search result cards on the home grid), which never carry
// a real photo -- mirrors backend/src/services/categoryImage.js.
const CATEGORY_IMAGES = [
  { keywords: ['coffee', 'roaster', 'espresso'], url: '1497935586351-b67a49e012bf' },
  { keywords: ['bakery', 'patisserie', 'pastry'], url: '1509440159596-0249088772ff' },
  { keywords: ['burger'], url: '1568901346375-23c9450c58cd' },
  { keywords: ['pizza', 'pizzeria'], url: '1513104890138-7c749659a591' },
  { keywords: ['sushi', 'japanese'], url: '1579871494447-9811cf80d66c' },
  { keywords: ['italian', 'pasta', 'trattoria'], url: '1551183053-bf91a1d81141' },
  { keywords: ['ice cream', 'gelato', 'dessert'], url: '1497034825429-c343d7c6a68f' },
  { keywords: ['fast food', 'takeaway', 'drive-thru', 'drive thru'], url: '1571091718767-18b5b1457add' },
  { keywords: ['bar', 'pub', 'cocktail', 'brewery', 'tavern'], url: '1514933651103-005eec06c04b' },
  { keywords: ['hotel', 'lodge', 'resort', 'guesthouse', 'inn'], url: '1582719508461-905c673771fd' },
  { keywords: ['gym', 'fitness', 'yoga', 'crossfit'], url: '1534438327276-14e5300c3a48' },
  { keywords: ['grocery', 'supermarket', 'market'], url: '1542838132-92c53300491e' },
  { keywords: ['salon', 'spa', 'beauty', 'barber', 'nail'], url: '1560066984-138dadb4c035' },
  { keywords: ['book', 'library'], url: '1495446815901-a7297e633e8d' },
  { keywords: ['auto', 'car', 'mechanic', 'garage', 'tyre', 'tire'], url: '1487754180451-c456f719a1fc' },
  { keywords: ['clinic', 'health', 'medical', 'dental', 'pharmacy'], url: '1519494026892-80bbd2d6fd0d' },
  { keywords: ['restaurant', 'dining', 'eatery', 'food', 'kitchen', 'grill', 'diner'], url: '1517248135467-4c7edcad34c4' },
  { keywords: ['retail', 'store', 'shop', 'boutique', 'mall'], url: '1441986300917-64674bd600d8' },
];

const DEFAULT_IMAGE_ID = '1560250097-0b93528c311a';

function toUrl(id) {
  return `https://images.unsplash.com/photo-${id}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`;
}

/** Best-effort category match for a business's photo when no real photo is available yet. */
export function getCategoryImage(category, name = '') {
  const text = `${category || ''} ${name}`.toLowerCase();

  for (const { keywords, url } of CATEGORY_IMAGES) {
    if (keywords.some((k) => text.includes(k))) {
      return toUrl(url);
    }
  }

  return toUrl(DEFAULT_IMAGE_ID);
}
