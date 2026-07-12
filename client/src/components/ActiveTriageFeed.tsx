import React, { useMemo, useState } from 'react';
import type { Ticket, UrgencyLevel } from '../types/ticket';

type UrgencyFilter = 'ALL' | UrgencyLevel;

const FILTER_OPTIONS: { value: UrgencyFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

const matchesUrgencyFilter = (urgency: string, filter: UrgencyFilter): boolean => {
  if (filter === 'ALL') return true;
  if (filter === 'CRITICAL') return urgency === 'CRITICAL';
  if (filter === 'HIGH') return urgency === 'HIGH' || urgency === 'MAJOR';
  if (filter === 'MEDIUM') return urgency === 'MEDIUM' || urgency === 'MINOR';
  if (filter === 'LOW') return urgency === 'LOW';
  return true;
};

interface ActiveTriageFeedProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticket: Ticket) => void;
  className?: string;
  embedded?: boolean;
}

export const ActiveTriageFeed: React.FC<ActiveTriageFeedProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  className = '',
  embedded = false,
}) => {
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('ALL');

  const filteredTickets = useMemo(
    () => tickets.filter((t) => matchesUrgencyFilter(t.aiAnalysis.urgency, urgencyFilter)),
    [tickets, urgencyFilter],
  );

  return (
    <div className={`bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 h-full ${className}`}>
      <div className="border-b border-slate-800 pb-2">
        <h2 className="text-xs font-mono font-bold text-slate-400 tracking-wider">
          ACTIVE TRIAGE FEED ({filteredTickets.length})
        </h2>
        <div className="flex flex-wrap gap-1 mt-2">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setUrgencyFilter(value)}
              className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                urgencyFilter === value
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      
      <div className={`flex flex-col gap-2 pr-1 ${embedded ? '' : 'overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-800 hover:scrollbar-thumb-cyan-500/50'}`}>
        {filteredTickets.length === 0 && (
          <p className="text-[11px] text-slate-500 font-mono text-center py-4">No incidents match this filter.</p>
        )}
        {filteredTickets.map((t) => {
          const isSelected = t._id === selectedTicketId;
          const u = t.aiAnalysis.urgency;
          const urgencyColor =
            u === 'CRITICAL'
              ? 'border-l-red-500'
              : u === 'HIGH' 
              ? 'border-l-orange-500'
              : u === 'MEDIUM' 
              ? 'border-l-amber-400'
              : 'border-l-sky-500';

          const urgencyTextColor =
            u === 'CRITICAL'
              ? 'text-red-400'
              : u === 'HIGH'
              ? 'text-orange-400'
              : u === 'MEDIUM' 
              ? 'text-amber-400'
              : 'text-sky-400';

          return (
            <div
              key={t._id}
              onClick={() => onSelectTicket(t)}
              className={`p-3 rounded-lg border border-slate-800 border-l-4 cursor-pointer transition-all duration-200 ${urgencyColor} ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                  : 'bg-slate-950/40 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold ${urgencyTextColor}`}>{t.aiAnalysis.urgency}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium truncate">
                {t.coordinates && <span title="Pinpointed via device GPS">📍 </span>}
                {t.aiAnalysis.location}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-1">{t.rawText}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};