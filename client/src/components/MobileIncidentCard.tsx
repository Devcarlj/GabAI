import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Flame, Waves, HeartPulse, ShieldAlert, TriangleAlert, X, ChevronDown, Share2, Navigation } from 'lucide-react';
import type { Ticket, NearbyLGUStatus } from '../types/ticket.js';
import { IncidentDetailCard } from './IncidentDetailCard';

interface MobileIncidentCardProps {
  ticket: Ticket;
  userLocation?: { lat: number; lng: number } | null;
  showNearLGUs?: boolean;
  nearbyLGUsStatus?: NearbyLGUStatus;
  onToggleNearLGUs?: () => void;
  onClose?: () => void;
  onGetSafeRoute?: () => void;
  onShare?: () => void;
}

/**
 * Hero icon by incident category, as a plain lookup (not a function that
 * returns a component). Selecting an icon via `INCIDENT_ICONS[key]` inside
 * render is a stable property access; calling a switch/function that
 * *returns* a component from inside render trips React 19 / the React
 * Compiler's "Cannot create components during render" check, since it can't
 * statically prove the returned component identity is stable across renders.
 */
const INCIDENT_ICONS: Record<string, LucideIcon> = {
  FIRE: Flame,
  FLOOD: Waves,
  MEDICAL: HeartPulse,
  CRIME: ShieldAlert,
};
const DEFAULT_INCIDENT_ICON: LucideIcon = TriangleAlert;

const urgencyStyles = (urgency: string) => {
  switch (urgency) {
    case 'CRITICAL':
      return { badge: 'bg-red-950/60 border-red-500 text-red-400', icon: 'bg-red-500/15 text-red-500 border-red-500/40' };
    case 'HIGH':
      return { badge: 'bg-orange-950/60 border-orange-500 text-orange-400', icon: 'bg-orange-500/15 text-orange-500 border-orange-500/40' };
    case 'MEDIUM':
      return { badge: 'bg-amber-950/60 border-amber-400 text-amber-300', icon: 'bg-amber-400/15 text-amber-400 border-amber-400/40' };
    default:
      return { badge: 'bg-emerald-950/60 border-emerald-500 text-emerald-400', icon: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40' };
  }
};

/** Great-circle distance in km between two lat/lng points. */
const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const StatBlock: React.FC<{ label: string; value: string; valueClass?: string }> = ({
  label,
  value,
  valueClass = 'text-slate-200',
}) => (
  <div className="bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-2 flex flex-col items-center text-center">
    <span className="text-[8px] font-bold tracking-wider text-slate-500 uppercase">{label}</span>
    <span className={`text-xs font-bold mt-0.5 ${valueClass}`}>{value}</span>
  </div>
);

export const MobileIncidentCard: React.FC<MobileIncidentCardProps> = ({
  ticket,
  userLocation,
  showNearLGUs = false,
  nearbyLGUsStatus = 'idle',
  onToggleNearLGUs,
  onClose,
  onGetSafeRoute,
  onShare,
}) => {
  const [showMore, setShowMore] = useState(false);

  const { urgency, location, summary } = ticket.aiAnalysis;
  const styles = urgencyStyles(urgency);
  // Ticket doesn't carry an explicit `incidentType` on the analysis object in the
  // current type — cast defensively so this keeps working once it does.
  const incidentTypeKey = (
    (ticket as unknown as { incidentType?: string }).incidentType || ''
  ).toUpperCase();
  const Icon = INCIDENT_ICONS[incidentTypeKey] ?? DEFAULT_INCIDENT_ICON;

  const title = summary?.split(/[.!?]/)[0]?.trim() || `${urgency} Incident Report`;
  const subtitle = location || 'Location pending';

  const distanceLabel =
    userLocation && ticket.coordinates
      ? `${haversineKm(userLocation, ticket.coordinates).toFixed(1)} km`
      : '—';

  // TODO: wire to real fields once the backend exposes report aggregation / live
  // status on a ticket — placeholders keep the layout matching Figma in the
  // meantime (same pattern the desktop MetricCards already uses for stand-ins).
  const reportsLabel = String((ticket as unknown as { reportsCount?: number }).reportsCount ?? 1);
  const statusLabel = (ticket as unknown as { status?: string }).status ?? 'Active';

  return (
    <div className="relative flex flex-col gap-3.5">
      {/* Drag handle */}
      <div className="flex justify-center -mt-1">
        <div className="w-10 h-1 rounded-full bg-slate-700" />
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close incident detail"
          className="absolute top-3 right-3 p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      )}

      {/* Hero row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center ${styles.icon}`}>
            <Icon className="w-5 h-5" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="text-[15px] font-bold text-slate-100 leading-snug truncate">{title}</h3>
            <p className="text-xs text-slate-400 truncate mt-0.5">{subtitle}</p>
          </div>
        </div>
        <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold border rounded-md tracking-wide ${styles.badge}`}>
          {urgency}
        </span>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-2">
        <StatBlock label="Distance" value={distanceLabel} />
        <StatBlock label="Reports" value={reportsLabel} valueClass="text-[var(--theme-accent)]" />
        <StatBlock label="Status" value={statusLabel} valueClass="text-amber-400" />
      </div>

      {/* CTA row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onGetSafeRoute}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-red-950/40 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Navigation className="w-4 h-4" strokeWidth={2.5} />
          Get Safe Route
        </button>
        <button
          type="button"
          onClick={onShare}
          aria-label="Share incident"
          className="shrink-0 w-11 h-11 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 flex items-center justify-center hover:text-slate-100 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" strokeWidth={2.25} />
        </button>
      </div>

      {/* See more toggle */}
      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        className="flex items-center justify-center gap-1.5 text-[11px] font-bold tracking-wide text-slate-400 hover:text-slate-200 py-1.5 transition-colors cursor-pointer"
        aria-expanded={showMore}
      >
        {showMore ? 'See less' : 'See more details'}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`} strokeWidth={2.5} />
      </button>

      {/* Expanded — full triage detail, reusing the existing desktop card */}
      {showMore && (
        <div className="pt-1 border-t border-slate-800 -mx-1 px-1">
          <IncidentDetailCard
            ticket={ticket}
            showNearLGUs={showNearLGUs}
            nearbyLGUsStatus={nearbyLGUsStatus}
            onToggleNearLGUs={onToggleNearLGUs}
          />
        </div>
      )}
    </div>
  );
};