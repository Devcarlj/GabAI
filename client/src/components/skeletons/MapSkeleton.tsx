import React from "react";
import { FeedSkeleton } from "./FeedSkeleton";

/**
 * Full-bleed skeleton & pin loader overlay for the MapLibre map.
 * Rendered absolutely over the map canvas and faded out
 * when the map fires its `load` event.
 */
export const MapSkeleton: React.FC = () => (
  <div className="absolute inset-0 z-20 flex flex-col bg-[#09101d] overflow-hidden select-none">
    {/* ── Shimmer sweep layer ── */}
    <div className="skeleton-bone absolute inset-0 rounded-none bg-[#09101d]" />

    {/* ── Fake radar / grid lines to hint at GIS map tiles ── */}
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* Vertical grid lines */}
      {[15, 30, 45, 60, 75, 90].map((pct) => (
        <line
          key={`v-${pct}`}
          x1={`${pct}%`}
          y1="0"
          x2={`${pct}%`}
          y2="100%"
          stroke="var(--theme-border)"
          strokeWidth="1"
        />
      ))}
      {/* Horizontal grid lines */}
      {[20, 40, 60, 80].map((pct) => (
        <line
          key={`h-${pct}`}
          x1="0"
          y1={`${pct}%`}
          x2="100%"
          y2={`${pct}%`}
          stroke="var(--theme-border)"
          strokeWidth="1"
        />
      ))}
    </svg>

    {/* ── Desktop Top-left: Map Layers badge skeleton ── */}
    <div className="map-loader-desktop-only hidden lg:block absolute top-3 left-3 z-10">
      <div className="skeleton-bone h-6 w-24 rounded-md" />
    </div>

    {/* ── Desktop Top-right: PH VIEW button skeleton ── */}
    <div className="map-loader-desktop-only hidden lg:block absolute top-5 right-3 z-10">
      <div className="skeleton-bone h-7 w-20 rounded-md" />
    </div>

    {/* ── Centered Real Pin Loader with Radar Pulse Rings (Mobile & Desktop) ── */}
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none gap-3">
      <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
        {/* Outer Radar Expanding Wave 1 */}
        <span
          className="absolute inline-flex h-16 w-16 sm:h-20 sm:w-20 rounded-full pin-pulse opacity-70"
          style={{ border: "2px solid var(--theme-accent)" }}
        />
        {/* Outer Radar Expanding Wave 2 (staggered delay) */}
        <span
          className="absolute inline-flex h-24 w-24 sm:h-28 sm:w-28 rounded-full pin-pulse opacity-40"
          style={{
            border: "1.5px solid var(--theme-accent)",
            animationDelay: "600ms",
          }}
        />
        {/* Glowing Center Halo */}
        <span className="absolute inline-flex h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[var(--theme-accent)] opacity-20 blur-md animate-pulse" />

        {/* Real GabAI Map Hazard Pin Element */}
        <div
          className="relative flex items-center justify-center p-2.5 sm:p-3 rounded-full border-2 border-[#070b12] bg-[#070b12]/95 shadow-[0_0_20px_var(--theme-accent-glow)] scale-110 sm:scale-125"
          style={{
            boxShadow: "0 0 16px var(--theme-accent)",
          }}
        >
          {/* Real Alert Warning Triangle Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--theme-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
      </div>

      {/* Status Label */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070b12]/90 border border-slate-800 text-[10px] sm:text-xs font-mono text-slate-300 backdrop-blur-md shadow-lg">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)] animate-ping" />
        <span className="tracking-wider uppercase text-slate-400">
          Loading GIS Map...
        </span>
      </div>
    </div>

    {/* ── Desktop: Floating feed panel skeleton ── */}
    <div className="map-loader-desktop-only hidden lg:block absolute top-12 left-3 bottom-3 w-65 z-10 overflow-hidden rounded-xl bg-[#070b12]/90 border border-slate-800/80 p-4">
      <FeedSkeleton count={5} />
    </div>

    {/* ── Bottom-right: Watermark skeleton ── */}
    <div className="absolute bottom-2 right-3 z-10">
      <div className="skeleton-bone h-2.5 w-28 rounded-sm" />
    </div>
  </div>
);
