import { Request, Response } from 'express';

// ---------------------------------------------------------------------------
// Geocoding proxy — both directions.
//
// Nominatim's usage policy (https://operations.osmfoundation.org/policies/nominatim/)
// requires: a descriptive User-Agent, no more than ~1 request/sec, and caching
// results where reasonable instead of re-querying for the same spot. Browsers
// can't set a custom User-Agent on fetch, so this has to live server-side.
// ---------------------------------------------------------------------------

const NOMINATIM_USER_AGENT = 'GabAI-Triage-Dashboard/1.0 (+https://gabai.app; ops@gabai.app)';

interface ReverseCacheEntry {
  label: string | null;
  address: Record<string, string>;
  expiresAt: number;
}

interface ForwardCacheEntry {
  lat: number;
  lng: number;
  displayName: string;
  expiresAt: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const reverseCache = new Map<string, ReverseCacheEntry>();
const forwardCache = new Map<string, ForwardCacheEntry>();

// Round to ~4 decimal places (~11m precision) so nearby pings share a cache hit
const reverseCacheKeyFor = (lat: number, lng: number) => `${lat.toFixed(4)},${lng.toFixed(4)}`;
const forwardCacheKeyFor = (query: string) => query.trim().toLowerCase();

const isValidCoord = (value: unknown, min: number, max: number): value is number => {
  const n = Number(value);
  return typeof value !== 'undefined' && !Number.isNaN(n) && n >= min && n <= max;
};

// ---------------------------------------------------------------------------
// Reverse geocoding: coordinates -> human-readable label.
// Used for the live GPS badge / "You Are Here" flow.
// ---------------------------------------------------------------------------
export const reverseGeocode = async (req: Request, res: Response) => {
  const { lat, lng } = req.query;

  if (!isValidCoord(lat, -90, 90) || !isValidCoord(lng, -180, 180)) {
    return res.status(400).json({ error: 'Valid lat and lng query params are required.' });
  }

  const latNum = Number(lat);
  const lngNum = Number(lng);
  const cacheKey = reverseCacheKeyFor(latNum, lngNum);

  const cached = reverseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return res.status(200).json({ label: cached.label, address: cached.address, cached: true });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latNum}&lon=${lngNum}&zoom=16&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': NOMINATIM_USER_AGENT,
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim responded with status ${response.status}`);
    }

    const data = await response.json();
    const addr = data.address || {};
    const streetLevel = addr.road || addr.neighbourhood || addr.suburb || addr.village || addr.hamlet;
    const city = addr.city || addr.town || addr.municipality || addr.county;
    const label: string | null = [streetLevel, city].filter(Boolean).join(', ') || data.display_name || null;

    reverseCache.set(cacheKey, { label, address: addr, expiresAt: Date.now() + CACHE_TTL_MS });

    return res.status(200).json({ label, address: addr, cached: false });
  } catch (error) {
    console.error('Reverse geocode failed:', error);
    return res.status(502).json({ error: 'Unable to resolve location right now.' });
  }
};

// ---------------------------------------------------------------------------
// Forward geocoding: free-text place description -> coordinates.
//
// `forwardGeocode` is a plain helper (not an Express handler) so it can be
// called directly from triageController.ts when a citizen report has no GPS
// coordinates attached and we only have the AI-extracted location string
// (e.g. "Marulas, Valenzuela"). It's what was missing before: previously
// nothing ever turned that text into a lat/lng, so tickets without GPS fell
// back to a fabricated pin position on the map.
//
// `bias` lets callers scope results to a known operating area (e.g. append
// ", Valenzuela City, Philippines") so a short barangay/street name doesn't
// match an unrelated place with the same name elsewhere in the world.
// ---------------------------------------------------------------------------
export const forwardGeocode = async (
  query: string
): Promise<{ lat: number; lng: number; displayName: string } | null> => {
  const trimmed = query.trim();
  if (!trimmed) return null;

  // Nationwide search — scoped to the Philippines via countrycodes only.
  // Do NOT append a specific city/region into the query text itself: doing
  // that forces Nominatim to match that literal string, so any report from
  // outside that city fails to geocode (and previously fell back to a fake
  // pin centered on that same city — see MapViewSection.tsx).
  const fullQuery = trimmed;
  const cacheKey = forwardCacheKeyFor(fullQuery);

  const cached = forwardCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return { lat: cached.lat, lng: cached.lng, displayName: cached.displayName };
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
      fullQuery
    )}&limit=1&countrycodes=ph`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': NOMINATIM_USER_AGENT,
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim responded with status ${response.status}`);
    }

    const results = await response.json();
    if (!Array.isArray(results) || results.length === 0) {
      return null;
    }

    const top = results[0];
    const lat = Number(top.lat);
    const lng = Number(top.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    const displayName: string = top.display_name || fullQuery;

    forwardCache.set(cacheKey, { lat, lng, displayName, expiresAt: Date.now() + CACHE_TTL_MS });

    return { lat, lng, displayName };
  } catch (error) {
    console.error('Forward geocode failed:', error);
    return null;
  }
};

// Express handler wrapper for forwardGeocode, exposed as GET /api/geocode/search?q=...
// in case the client ever needs address-autocomplete-style forward geocoding directly
// (e.g. a future manual "pin a location" UI), not just the server-side AI triage flow.
export const forwardGeocodeHandler = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({ error: 'A non-empty q query param is required.' });
  }

  const result = await forwardGeocode(q);

  if (!result) {
    return res.status(404).json({ error: 'No matching location found.' });
  }

  return res.status(200).json(result);
};