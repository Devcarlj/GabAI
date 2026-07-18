// src/mockData.ts
// src/mockData.ts
import type { Ticket } from '../types/ticket';

export const mockTickets: Ticket[] = [
  {
    _id: "65f1a2b3c4d5e6f7a8b9c011",
    ticketId: "VA-1024-DF-01",
    rawText: "Sobrang baha na dito sa may McArthur Highway tapat ng PLV, lagpas tuhod na po hindi makadaan mga sasakyan.",
    photoUrl: "https://example.com/flood-photo.jpg",
    aiAnalysis: {
      urgency: "CRITICAL",
      location: "McArthur Hwy / PLV",
      summary: "Road impassable due to knee-deep floodwater caused by garbage-clogged drainage mainline.",
      recommendedActions: [
    "Avoid McArthur Highway near PLV until water recedes",
    "Do not attempt to drive or wade through the flooded stretch",
    "Move to higher ground if you're in a low-lying area nearby",
  ],

    },
    dispatchOrder: "Deploy City Engineering Clearance Team & Traffic Management Office immediately.",
    createdAt: new Date().toISOString()
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c012",
    ticketId: "VA-1024-DF-02",
    rawText: "May pumutok na transformer dito sa Brgy Karuhatan, nawalan bigla ng kuryente.",
    aiAnalysis: {
      urgency: "HIGH",
      location: "Brgy. Karuhatan",
      summary: "Localized power outage caused by a blown electrical transformer unit.",
      recommendedActions: [
    "Avoid McArthur Highway near PLV until water recedes",
    "Do not attempt to drive or wade through the flooded stretch",
    "Move to higher ground if you're in a low-lying area nearby",
  ],
    },
    dispatchOrder: "Coordinate with Meralco emergency response team for immediate repair.",
    createdAt: new Date().toISOString()
  }
];