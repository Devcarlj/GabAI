import { GoogleGenAI, Type, Schema } from '@google/genai';
import { Request, Response } from 'express';
import { Ticket, AIAnalysis } from '../types/ticket.js';
import TicketModel from '../models/TicketModel.js'; // Your Mongoose Schema
import { forwardGeocode } from './geocodeController.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'; 


// Initialize the Google Gen AI SDK
// It automatically picks up PROCESS.ENV.GEMINI_API_KEY
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Define the expected JSON Schema for Gemini's output
const aiResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    urgency: {
      type: Type.STRING,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      description: 'Urgency level based on severity and danger to citizens.',
    },
    incidentType: {
      type: Type.STRING,
      enum: ['WARNING', 'CONSTRUCTION'],
      description: 'Use "CONSTRUCTION" if the report involves government infrastructure projects, roadworks, open excavations, or construction hazards that could cause future issues/accidents. Otherwise, use "WARNING".',
    },
    location: {
      type: Type.STRING,
      description:
        'Extracted barangay, street, or landmark from the text, including the city/municipality ' +
        'and province if mentioned or reasonably inferable (e.g. "Marulas, Valenzuela City" rather ' +
        'than just "Marulas"). Reports can come from anywhere in the Philippines, so include enough ' +
        'context to disambiguate the location nationwide, not just within one city.',
    },
    summary: {
      type: Type.STRING,
      description: 'A concise 1-sentence English summary of the report.',
    },
    dispatchOrder: {
      type: Type.STRING,
      description: 'Actionable LGU team dispatch instruction (e.g. Deploy City Engineering).',
    },
  },
  required: ['urgency', 'incidentType', 'location', 'summary', 'dispatchOrder'],
};

export const createAndTriageTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rawText, photoUrl, coordinates, locationLabel, incidentType: manualIncidentType } = req.body;

    if (!rawText) {
      res.status(400).json({ error: 'Raw text report is required.' });
      return;
    }

    // Coordinates are optional (GPS toggle may be off), but if present they must
    // be a well-formed { lat, lng } pair — reject silently-malformed data rather
    // than letting a bad shape reach Mongo.
    let validatedCoordinates: { lat: number; lng: number } | undefined;
    if (coordinates !== undefined && coordinates !== null) {
      const lat = Number(coordinates.lat);
      const lng = Number(coordinates.lng);
      const isValid =
        !Number.isNaN(lat) && !Number.isNaN(lng) &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180;

      if (!isValid) {
        res.status(400).json({ error: 'Invalid coordinates payload.' });
        return;
      }
      validatedCoordinates = { lat, lng };
    }

    // Track whether the coordinates we end up with came from the citizen's
    // own GPS (ground truth) or were derived after the fact from the AI's
    // text-extracted location (best-effort). Useful for the client to decide
    // whether to show a "location approximate" hint.
    let coordinatesSource: 'gps' | 'geocoded' | 'none' = validatedCoordinates ? 'gps' : 'none';

    // Clean, human-readable address string from the client's reverse-geocode
    // (see server/controllers/geocodeController.ts). Empty string if GPS was off
    // or geocoding failed.
    const locationLabelClean = typeof locationLabel === 'string' ? locationLabel.trim() : '';

    // System instruction to guide Gemini's behavior
    const systemInstruction = `
      You are SuriAI, an official AI dispatcher for Philippine local government units (LGUs) nationwide.
      Your job is to read citizen reports (written in Tagalog, English, or Taglish) and inspect any accompanying images/photos regarding emergencies, floodings, infrastructure damage, or public safety issues.
      Extract the location — including city/municipality and province whenever possible, since reports can come from anywhere in the Philippines — determine the urgency (CRITICAL, HIGH, MEDIUM, or LOW), write a clear summary, and generate a specific LGU dispatch order.
      If a "Reported GPS Location" is provided below, treat it as ground truth for where the incident is — use it for the location field and dispatch order instead of guessing from the text, unless the report explicitly describes a different, more specific spot (e.g. "sa likod ng barangay hall").
    `;

    let promptText = `Analyze this citizen report: "${rawText}"`;
    if (locationLabelClean) {
      promptText += `\n\nReported GPS Location: ${locationLabelClean}`;
    } else if (validatedCoordinates) {
      promptText += `\n\nReported GPS Coordinates: ${validatedCoordinates.lat}, ${validatedCoordinates.lng}`;
    }

const contents: any[] = [promptText];
let cloudinaryPhotoUrl = '';
console.log('[DEBUG] photoUrl received, length:', photoUrl?.length, 'starts with data:', photoUrl?.startsWith?.('data:'));

if (photoUrl && photoUrl.startsWith('data:')) {
  const match = photoUrl.match(/^data:([^;]+);base64,(.*)$/);
  console.log('[DEBUG] regex match found:', !!match);

  if (match) {
    contents.push({
      inlineData: { mimeType: match[1], data: match[2] }
    });

    try {
      const buffer = Buffer.from(match[2], 'base64');
      const uploadResult = await uploadImageCloudinary({ buffer });
      cloudinaryPhotoUrl = uploadResult.secure_url;
      console.log('[DEBUG] Cloudinary upload succeeded:', cloudinaryPhotoUrl);
    } catch (uploadErr) {
      console.error(
        'Cloudinary upload failed, falling back to no photo URL:',
        uploadErr instanceof Error ? uploadErr.message : uploadErr
      );
    }
  }
}

    // Call the Gemini API using @google/genai SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: aiResponseSchema,
        temperature: 0.1, // Low temperature for deterministic, reliable JSON parsing
      },
    });

    const aiText = response.text;

    if (!aiText) {
      throw new Error('No response generated from Gemini API.');
    }

    // Parse the JSON output from Gemini
    const parsedAIOutput = JSON.parse(aiText);

    // If the citizen never shared GPS, we still have the AI's text-extracted
    // location (e.g. "Marulas, Valenzuela") — forward-geocode it so the ticket
    // gets real coordinates instead of falling through to the map's fabricated
    // ID-hash pin. This is best-effort: geocoding can legitimately fail to find
    // a match (vague/garbled location text, Nominatim rate limiting, etc.), in
    // which case we leave coordinates unset and let the client show the ticket
    // as location-unconfirmed rather than plotting a fake spot.
    if (!validatedCoordinates && parsedAIOutput.location) {
      const geocoded = await forwardGeocode(parsedAIOutput.location);
      if (geocoded) {
        validatedCoordinates = { lat: geocoded.lat, lng: geocoded.lng };
        coordinatesSource = 'geocoded';
      }
    }

    // Decide the final "location" that gets stored and displayed everywhere
    // (Incident Detail card, Triage Feed, map). GPS ground-truth wins over the
    // AI's text-based guess whenever it's available — a resolved street/barangay
    // name if reverse-geocoding succeeded, otherwise raw coordinates as a readable
    // string. Only falls back to the AI's guess (or a clear placeholder) when the
    // citizen never shared GPS at all.
    const gpsResolvedLocation = locationLabelClean
      ? locationLabelClean
      : coordinatesSource === 'gps' && validatedCoordinates
      ? `${validatedCoordinates.lat.toFixed(5)}, ${validatedCoordinates.lng.toFixed(5)}`
      : null;

    const finalLocation =
      gpsResolvedLocation ?? (parsedAIOutput.location || 'Location not specified');

    // Generate a custom ticket ID (e.g., VA-1024-DF-01)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedTicketId = `VA-${randomSuffix}-DF`;
    const finalIncidentType = manualIncidentType || parsedAIOutput.incidentType || 'WARNING';

    // Construct the full Ticket object
    const newTicketData = {
          ticketId: generatedTicketId,
          rawText,
          photoUrl: cloudinaryPhotoUrl,
          coordinates: validatedCoordinates,
          coordinatesSource,
          locationLabel: locationLabelClean,
          aiAnalysis: {
            urgency: parsedAIOutput.urgency,
            location: finalLocation,
            summary: parsedAIOutput.summary,
            incidentType: finalIncidentType,
          },
          dispatchOrder: parsedAIOutput.dispatchOrder,
          createdAt: new Date().toISOString(),
        };

        const savedTicket = await TicketModel.create(newTicketData);
        res.status(201).json(savedTicket);

      } catch (error) {
        console.error('Error in Gemini Triage Controller:', error);
        res.status(500).json({ error: 'Failed to triage citizen report.' });
      }


  
};