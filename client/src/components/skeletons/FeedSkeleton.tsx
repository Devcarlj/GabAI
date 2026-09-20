import React from "react";

/** Urgency accent colors (muted) cycling across skeleton cards */
const ACCENT_COLORS = [
  "border-l-red-500/30",
  "border-l-orange-500/30",
  "border-l-amber-400/30",
  "border-l-sky-500/30",
  "border-l-red-500/30",
];

interface FeedSkeletonProps {
  /** Number of placeholder cards to render */
  count?: number;
  className?: string;
}

const ActiveTriageFeedTitleSkeleton: React.FC = () => (
  <div
    className="skeleton-bone h-3 w-44 mb-1"
    aria-label="Loading active triage feed title"
  />
);

export const FeedSkeleton: React.FC<FeedSkeletonProps> = ({
  count = 5,
  className = "",
}) => (
  <div className={`flex flex-col gap-3 ${className}`}>
    {/* Active triage feed title */}
    <ActiveTriageFeedTitleSkeleton />

    {/* Filter pills row */}
    <div className="flex gap-1.5 mb-1">
      {["w-10", "w-14", "w-11", "w-14", "w-10"].map((w, i) => (
        <div key={i} className={`skeleton-bone h-5 rounded-md ${w}`} />
      ))}
    </div>

    {/* Incident card skeletons */}
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`rounded-lg border border-slate-800/60 border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} bg-slate-950/40 p-3 flex flex-col gap-2`}
        style={{ animationDelay: `${i * 120}ms` }}
      >
        {/* Top row: urgency badge + timestamp */}
        <div className="flex items-center justify-between">
          <div className="skeleton-bone h-3 w-16" />
          <div className="skeleton-bone h-2.5 w-12" />
        </div>

        {/* Location line */}
        <div className="skeleton-bone h-3 w-3/4" />

        {/* Raw text line */}
        <div className="skeleton-bone h-2.5 w-5/6" />
      </div>
    ))}
  </div>
);
