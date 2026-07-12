import { Router } from 'express';
import { reverseGeocode, forwardGeocodeHandler } from '../controllers/geocodeController.js';

const router = Router();

// GET /api/geocode?lat=...&lng=...  -> coordinates -> human-readable label
router.get('/geocode', reverseGeocode);

// GET /api/geocode/search?q=...     -> free-text -> coordinates
// Exposed for any future manual "pin a location" UI on the client. The AI
// triage flow (triageController.ts) calls forwardGeocode() directly rather
// than hitting this route, since it already has the extracted location text
// server-side.
router.get('/geocode/search', forwardGeocodeHandler);

export default router;