// server/models/TicketModel.ts

import mongoose, { Schema, Document } from 'mongoose';
import { Ticket } from '../types/ticket.js';

// Extend Document interface for Mongoose
export interface ITicketDoc extends Omit<Ticket, '_id'>, Document {}

const TicketSchema: Schema = new Schema({
  ticketId: { type: String, required: true, unique: true },
  rawText: { type: String, required: true },
  photoUrl: { type: String, default: '' },
  coordinates: {
    type: new Schema(
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      { _id: false }
    ),
    required: false,
    default: undefined, // keep the field entirely absent when no GPS was attached
  },
  locationLabel: { type: String, default: '' },
  aiAnalysis: {
    urgency: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], required: true },
    location: { type: String, required: true },
    summary: { type: String, required: true },
    incidentType: { type: String, enum: ['WARNING', 'CONSTRUCTION'], default: 'WARNING' },
    recommendedActions: { type: [String], default: [] }, 
  },
  
  dispatchOrder: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },

  // inside TicketSchema, alongside the other fields
nearbyLGUs: {
  type: [
    new Schema(
      {
        name: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        distanceKm: { type: Number, required: true },
        address: { type: String, required: false },
        phone: { type: String, required: false },
        website: { type: String, required: false },
        openingHours: { type: String, required: false },
      },
      { _id: false }
    ),
  ],
  default: undefined,
},

nearbyLGUsStatus: {
  type: String,
  enum: ['idle', 'pending', 'ready', 'failed'],
  default: 'idle',
},
});

// 1. Create the model
const TicketModel = mongoose.model<ITicketDoc>('Ticket', TicketSchema);

// 2. EXPORT AS DEFAULT
export default TicketModel;