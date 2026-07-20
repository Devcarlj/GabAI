import React from 'react';

/**
 * Floating "Hazard Levels" legend shown on the mobile map view only.
 * Replaces the old compact metrics row per the updated mobile design
 * (see Figma node 3314-632).
 *
 * Colors intentionally match the urgency palette used elsewhere in the
 * app (ActiveTriageFeed / IncidentDetailCard: red / orange / amber),
 * with an added "Safe / Facility" tier in emerald for non-hazard pins
 * (shelters, LGU offices, etc.) that don't carry an urgency level.
 */
const HAZARD_LEVELS = [
  { label: 'Critical Risk', dotClass: 'bg-red-500' },
  { label: 'High Risk', dotClass: 'bg-orange-500' },
  { label: 'Moderate', dotClass: 'bg-amber-400' },
  { label: 'Safe / Facility', dotClass: 'bg-emerald-500' },
] as const;

export const MobileHazardLegend: React.FC = () => {
  return (
    <div
      className="lg:hidden absolute top-78 left-3 z-20 bg-slate-950/90 backdrop-blur-sm border border-slate-800 rounded-xl px-3 py-2.5 shadow-xl"
      role="group"
      aria-label="Hazard level legend"
    >
      <span className="block text-[8px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
        Hazard Levels
      </span>
      <ul className="flex flex-col gap-1">
        {HAZARD_LEVELS.map(({ label, dotClass }) => (
          <li key={label} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} aria-hidden="true" />
            <span className="text-[10px] font-medium text-slate-300 whitespace-nowrap">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};