import React from 'react';
import type { NearbyLGU } from '../types/ticket.js';

interface LGUDetailCardProps {
  lgu: NearbyLGU | null;
  onBack?: () => void;
}

export const LGUDetailCard: React.FC<LGUDetailCardProps> = ({ lgu, onBack }) => {
  if (!lgu) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-slate-400 flex items-center justify-center h-full">
        Select an LGU pin on the map to view details.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4 text-slate-100">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Incident
        </button>
        <span className="px-2.5 py-0.5 text-xs font-bold border border-emerald-500 text-emerald-400 bg-emerald-950/40 rounded-md">
          {lgu.distanceKm} km away
        </span>
      </div>

      {/* LGU Identity Box */}
      <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
        <span className="text-xs text-slate-400 font-semibold block mb-1">LOCAL GOVERNMENT UNIT</span>
        <p className="text-sm text-slate-100 font-bold">{lgu.name}</p>
      </div>

      {/* Contact Details Box */}
      <div className="bg-slate-950/80 p-4 rounded-lg border border-cyan-500/30 flex flex-col gap-3">
        <span className="text-xs font-bold text-cyan-400 tracking-wider flex items-center gap-1">
          ✦ CONTACT DETAILS
        </span>

        <div className="text-xs space-y-3 font-mono">
          <div className="flex items-start gap-2">
            <span className="text-slate-500 shrink-0 w-16">ADDRESS:</span>
            <span className="text-slate-200 normal-case font-sans">
              {lgu.address || <span className="text-slate-500 italic">Not available</span>}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-slate-500 shrink-0 w-16">PHONE:</span>
            {lgu.phone ? (
              <a href={`tel:${lgu.phone}`} className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
                {lgu.phone}
              </a>
            ) : (
              <span className="text-slate-500 italic normal-case font-sans">Not available</span>
            )}
          </div>

          <div className="flex items-start gap-2">
            <span className="text-slate-500 shrink-0 w-16">WEBSITE:</span>
            {lgu.website ? (
              <a
                href={lgu.website.startsWith('http') ? lgu.website : `https://${lgu.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2 break-all"
              >
                {lgu.website}
              </a>
            ) : (
              <span className="text-slate-500 italic normal-case font-sans">Not available</span>
            )}
          </div>

          <div className="flex items-start gap-2">
            <span className="text-slate-500 shrink-0 w-16">HOURS:</span>
            <span className="text-slate-200 normal-case font-sans">
              {lgu.openingHours || <span className="text-slate-500 italic">Not available</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Coordinates footer */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-500">
        {lgu.lat.toFixed(5)}, {lgu.lng.toFixed(5)}
      </div>
    </div>
  );
};