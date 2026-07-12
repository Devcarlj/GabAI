// src/types.ts
// src/types/ticket.ts

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentType = 'WARNING' | 'CONSTRUCTION';

export interface AIAnalysis {
  urgency: UrgencyLevel;
  location: string;
  summary: string;
  incidentType?: IncidentType;
}

export interface Ticket {
  _id?: string;
  ticketId: string;
  rawText: string;
  photoUrl?: string;
  coordinates?: { lat: number; lng: number };
  coordinatesSource?: 'gps' | 'geocoded' | 'none';
  locationLabel?: string;
  aiAnalysis: AIAnalysis;
  dispatchOrder: string;
  createdAt: string;
}

export interface CreateTicketPayload {
  rawText: string;
  photoUrl?: string;
  incidentType?: IncidentType;
  coordinates?: { lat: number; lng: number };
  locationLabel?: string;
}