import { Router } from 'express';
import { createAndTriageTicket } from '../controllers/triageController.js';
import TicketModel from '../models/TicketModel.js';
import { getNearbyLGUs } from '../controllers/nearbyLguController.js';

const router = Router();

// POST /api/tickets - Submit a raw report & run Gemini AI triage
router.post('/tickets', createAndTriageTicket);

// GET /api/tickets - Fetch all tickets for the React Dashboard
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await TicketModel.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets.' });
  }
});

router.get('/tickets/:id/nearby-lgus', getNearbyLGUs);

export default router;