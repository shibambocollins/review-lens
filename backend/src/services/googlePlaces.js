import { config } from "../config/index.js";

const FIND_PLACE_URL =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo";

/**
 * Looks up a real photo of this exact business via the Google Places API.
 * Returns the final image URL (no API key embedded in it, safe to send to the
 * browser) or null if Places isn't configured, the business isn't found, or
 * the lookup fails for any reason. Callers should fall back to a
 * category-matched stock photo when this returns null.
 */
export async function findExactBusinessPhoto(business) {
  const apiKey = config.googlePlaces.apiKey;
  if (!apiKey || !business?.name) return null;

  try {
    const input = [business.name, business.address].filter(Boolean).join(", ");
    const findParams = new URLSearchParams({
      input,
      inputtype: "textquery",
      fields: "photos",
      key: apiKey,
    });
    const findRes = await fetch(`${FIND_PLACE_URL}?${findParams}`);
    if (!findRes.ok) return null;

    const findData = await findRes.json();
    if (findData.status !== "OK") {
      // ZERO_RESULTS is the expected case for AI-invented businesses that don't really
      // exist -- anything else (REQUEST_DENIED, OVER_QUERY_LIMIT, ...) means the key/billing
      // setup needs attention, so surface it instead of silently degrading forever.
      if (findData.status !== "ZERO_RESULTS") {
        console.warn(
          `[ReviewLens] Google Places lookup returned ${findData.status}${findData.error_message ? `: ${findData.error_message}` : ""}`,
        );
      }
      return null;
    }

    const photoRef = findData?.candidates?.[0]?.photos?.[0]?.photo_reference;
    if (!photoRef) return null;

    const photoParams = new URLSearchParams({
      maxwidth: "800",
      photo_reference: photoRef,
      key: apiKey,
    });
    // The legacy Places Photo endpoint 302s to the real (unsigned, key-free)
    // image URL -- we resolve that redirect server-side so the API key never
    // reaches the browser, then hand the client the final CDN URL directly.
    const photoRes = await fetch(`${PHOTO_URL}?${photoParams}`, {
      redirect: "manual",
    });
    if (photoRes.status >= 300 && photoRes.status < 400) {
      return photoRes.headers.get("location");
    }
    return null;
  } catch (err) {
    console.warn(`[ReviewLens] Google Places photo lookup failed: ${err.message}`);
    return null;
  }
}
