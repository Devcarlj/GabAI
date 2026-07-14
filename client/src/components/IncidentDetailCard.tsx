import React from 'react';
import type { Ticket, NearbyLGUStatus } from '../types/ticket.js';

interface IncidentDetailCardProps {
  ticket: Ticket | null;
  showNearLGUs?: boolean;
  nearbyLGUsStatus?: NearbyLGUStatus;
  onToggleNearLGUs?: () => void;
}


export const IncidentDetailCard: React.FC<IncidentDetailCardProps> = ({
  ticket,
  showNearLGUs = false,
  nearbyLGUsStatus = 'idle',
  onToggleNearLGUs,
}) => {
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


  // No point offering the button if there's nothing to center a search on
  const hasCoordinates = !!ticket.coordinates && ticket.coordinatesSource !== 'none';
  const isPending = nearbyLGUsStatus === 'pending';
  const isFailed = nearbyLGUsStatus === 'failed';

  const nearLGUsLabel = isPending
    ? 'Locating LGUs…'
    : showNearLGUs
    ? 'Hide Near LGUs'
    : isFailed
    ? 'Retry Near LGUs'
    : 'Show Near LGUs';

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

          <div className="flex flex-col gap-1.5">
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

            {hasCoordinates && (
              <button
                onClick={onToggleNearLGUs}
                disabled={isPending}
                className={`self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border normal-case transition-all cursor-pointer disabled:cursor-wait disabled:opacity-70 ${
                  showNearLGUs
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : isFailed
                    ? 'bg-red-950/30 border-red-500/40 text-red-300 hover:border-red-400'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-4" />
                </svg>
                {nearLGUsLabel}
              </button>
            )}
          </div>

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