import { Request, Response } from 'express';
import TicketModel from '../models/TicketModel.js';

// overpass-api.de has been intermittently 406-ing requests that don't look
// like a browser (missing/odd Accept, Accept-Language, User-Agent — see
// https://github.com/drolbr/Overpass-API/issues/791). We set proper headers
// AND fall back to mirrors if the primary still rejects us.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];
const OVERPASS_USER_AGENT = 'GabAI-Triage-Dashboard/1.0 (+https://gabai.app; ops@gabai.app)';
const SEARCH_RADIUS_METERS = 15000;

const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

interface OverpassElement {
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

// Tries each endpoint in order (primary, then mirrors), stopping at the
// first one that returns a usable JSON response.
const fetchFromOverpass = async (query: string): Promise<{ elements: OverpassElement[] }> => {
  let lastError: unknown = null;

  for (const url of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'application/json',
          'Accept-Language': 'en',
          'User-Agent': OVERPASS_USER_AGENT,
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`${url} responded with ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`Overpass endpoint failed, trying next mirror if any: ${url}`, err);
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('All Overpass endpoints failed.');
};

// Runs in the background right after ticket creation — never awaited by the
// request/response cycle. Failures just leave nearbyLGUsStatus as 'failed'
// so the client can show a retry/empty state instead of hanging forever.
export const findAndStoreNearbyLGUs = async (
  ticketMongoId: string,
  lat: number,
  lng: number
): Promise<void> => {
  try {
    await TicketModel.findByIdAndUpdate(ticketMongoId, { nearbyLGUsStatus: 'pending' });

    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="townhall"](around:${SEARCH_RADIUS_METERS},${lat},${lng});
        node["office"="government"](around:${SEARCH_RADIUS_METERS},${lat},${lng});
        way["amenity"="townhall"](around:${SEARCH_RADIUS_METERS},${lat},${lng});
      );
      out center;
    `;

    const data = await fetchFromOverpass(query);
    const elements: OverpassElement[] = data.elements || [];

    const lgus = elements
      .map((el) => {
        const elLat = el.lat ?? el.center?.lat;
        const elLng = el.lon ?? el.center?.lon;
        if (typeof elLat !== 'number' || typeof elLng !== 'number') return null;
        const tags = el.tags || {};
        const name = tags.name || tags['name:en'] || 'Local Government Unit';

        // OSM tagging for LGUs is inconsistent — most of these will be missing
        // on any given node. Every field here stays optional; the client shows
        // "Not available" rather than assuming it exists.
        const address =
          [
            tags['addr:housenumber'],
            tags['addr:street'],
            tags['addr:barangay'],
            tags['addr:city'] || tags['addr:municipality'],
            tags['addr:province'],
          ]
            .filter(Boolean)
            .join(', ') || undefined;

        const phone = tags['contact:phone'] || tags.phone || undefined;
        const website = tags['contact:website'] || tags.website || undefined;
        const openingHours = tags.opening_hours || undefined;

        return {
          name,
          lat: elLat,
          lng: elLng,
          distanceKm: Math.round(haversineKm(lat, lng, elLat, elLng) * 10) / 10,
          address,
          phone,
          website,
          openingHours,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 8); // cap — the map/UI doesn't need more than this

    await TicketModel.findByIdAndUpdate(ticketMongoId, {
      nearbyLGUs: lgus,
      nearbyLGUsStatus: 'ready',
    });
  } catch (error) {
    console.error('Nearby LGU lookup failed:', error);
    await TicketModel.findByIdAndUpdate(ticketMongoId, { nearbyLGUsStatus: 'failed' }).catch(() => {});
  }
};

// GET /api/tickets/:id/nearby-lgus — client polls this after clicking the button
export const getNearbyLGUs = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketModel.findById(req.params.id).select('nearbyLGUs nearbyLGUsStatus');
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found.' });
      return;
    }
    res.status(200).json({
      status: ticket.nearbyLGUsStatus || 'idle',
      lgus: ticket.nearbyLGUs || [],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby LGUs.' });
  }
};