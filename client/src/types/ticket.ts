// src/types.ts

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentType = 'WARNING' | 'CONSTRUCTION';

export interface AIAnalysis {
  urgency: UrgencyLevel;
  location: string;
  summary: string;
  incidentType?: IncidentType;
}

export interface TicketCoordinates {
  lat: number;
  lng: number;
}

export interface NearbyLGU {
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

export type NearbyLGUStatus = 'idle' | 'pending' | 'ready' | 'failed';

export interface Ticket {
  _id?: string;
  ticketId: string;
  rawText: string;
  photoUrl?: string;
  coordinates?: TicketCoordinates;
  // Where `coordinates` came from, set server-side in triageController.ts:
  // 'gps'      — citizen's own device GPS (ground truth)
  // 'geocoded' — derived from the AI-extracted location text via Nominatim
  // 'none'     — no coordinates could be determined; don't plot a pin
  coordinatesSource?: 'gps' | 'geocoded' | 'none';
  locationLabel?: string;
  aiAnalysis: AIAnalysis;
  dispatchOrder: string;
  createdAt: string;
  nearbyLGUs?: NearbyLGU[];
  nearbyLGUsStatus?: NearbyLGUStatus;
}

// Payload sent from the Citizen Mobile View to the Express API
export interface CreateTicketPayload {
  rawText: string;
  photoUrl?: string;
  incidentType?: IncidentType;
  coordinates?: TicketCoordinates;
  locationLabel?: string;
}

export interface NearbyLGU {
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
}