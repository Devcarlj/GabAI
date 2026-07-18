// src/types/ticket.ts

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentType = 'WARNING' | 'CONSTRUCTION';

export interface AIAnalysis {
  urgency: UrgencyLevel;
  location: string;
  summary: string;
  incidentType?: IncidentType;
  recommendedActions?: string[]; // NEW: safety steps for citizens while help is en route
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
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
}

export type NearbyLGUStatus = 'idle' | 'pending' | 'ready' | 'failed';

export interface Ticket {
  _id?: string;
  ticketId: string;
  rawText: string;
  photoUrl?: string;
  coordinates?: TicketCoordinates;
  coordinatesSource?: 'gps' | 'geocoded' | 'none';
  locationLabel?: string;
  aiAnalysis: AIAnalysis;
  dispatchOrder: string;
  createdAt: string;
  nearbyLGUs?: NearbyLGU[];
  nearbyLGUsStatus?: NearbyLGUStatus;
}

export interface CreateTicketPayload {
  rawText: string;
  photoUrl?: string;
  incidentType?: IncidentType;
  coordinates?: TicketCoordinates;
  locationLabel?: string;
}