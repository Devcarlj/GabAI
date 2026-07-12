import React from 'react';
import type { Ticket } from '../types/ticket.js';

interface IncidentDetailCardProps {
  ticket: Ticket | null;
}

export const IncidentDetailCard: React.FC<IncidentDetailCardProps> = ({ ticket }) => {
  if (!ticket) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-slate-400 flex items-center justify-center h-full">
        Select a report from the feed to view triage details.
      </div>
    );
  }

  const { urgency, location, summary } = ticket.aiAnalysis;

  const urgencyColor =
    urgency === 'CRITICAL'
      ? 'border-red-500 text-red-400 bg-red-950/40'
      : urgency === 'HIGH' 
      ? 'border-orange-500 text-orange-400 bg-orange-950/40'
      : urgency === 'MEDIUM'
      ? 'border-amber-400 text-amber-400 bg-amber-950/40'
      : 'border-sky-500 text-sky-400 bg-sky-950/40';

  const urgencyTextColor =
    urgency === 'CRITICAL'
      ? 'text-red-400'
      : urgency === 'HIGH'
      ? 'text-orange-400'
      : urgency === 'MEDIUM'
      ? 'text-amber-400'
      : 'text-sky-400';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4 text-slate-100">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <span className="font-mono text-cyan-400 font-bold text-sm tracking-wide">
          INCIDENT ID: {ticket.ticketId}
        </span>
        <span className={`px-2.5 py-0.5 text-xs font-bold border rounded-md ${urgencyColor}`}>
          {urgency}
        </span>
      </div>

      {/* Raw Citizen Report Box */}
      <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
        <span className="text-xs text-slate-400 font-semibold block mb-1">CITIZEN REPORT (Raw Text)</span>
        <p className="text-sm text-slate-200 italic">"{ticket.rawText}"</p>
      </div>

      {/* Citizen Photo */}
      {ticket.photoUrl && (
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40 relative group">
          <img 
            src={ticket.photoUrl} 
            alt="Citizen Incident Photo" 
            className="w-full max-h-56 object-cover hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
          />
          <div className="absolute bottom-2 right-2 bg-slate-950/80 border border-slate-850 px-2 py-0.5 rounded text-[8px] font-mono text-slate-400 tracking-wider">
            ATTACHED IMAGE
          </div>
        </div>
      )}

      {/* AI Structured Analysis Box */}
      <div className="bg-slate-950/80 p-4 rounded-lg border border-cyan-500/30 flex flex-col gap-2">
        <span className="text-xs font-bold text-cyan-400 tracking-wider flex items-center gap-1">
          ✦ AI STRUCTURED ANALYSIS
        </span>
        <div className="text-xs space-y-1 mt-1 font-mono">
          <p><span className="text-slate-400">URGENCY:</span> <span className={`${urgencyTextColor} font-bold`}>{urgency}</span></p>
          <p>
            <span className="text-slate-400">LOCATION:</span>{' '}
            <span className="text-cyan-300">{location}</span>
            {ticket.coordinates && (
              <span
                className="ml-1.5 inline-flex items-center gap-0.5 text-[9px] text-blue-400 align-middle"
                title="Pinpointed via device GPS"
              >
                📍 GPS Verified
              </span>
            )}
          </p>
          <p className="normal-case font-sans text-slate-300 mt-2">
            <span className="font-bold text-slate-400 font-mono">SUMMARY: </span>{summary}
          </p>
        </div>
      </div>

      {/* AI Dispatch Order Box */}
      <div className="bg-slate-950 p-4 rounded-lg border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
        <span className="text-xs font-bold text-cyan-300 tracking-wider block mb-1">
          ⚡ AI DISPATCH ORDER
        </span>
        <p className="text-xs text-slate-100 font-medium leading-relaxed">
          {ticket.dispatchOrder}
        </p>
      </div>
    </div>
  );
};