import React from 'react';
import { Search, Mic, Layers, SlidersHorizontal, LocateFixed } from 'lucide-react';

interface MobileMapOverlayProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onMicClick?: () => void;
  onLayersClick?: () => void;
  onFilterClick?: () => void;
  onLocateClick?: () => void;
}

/**
 * Floating search bar + map control buttons shown over the mobile map view
 * (see Figma node 3314-632). Rendered as siblings of <MapViewSection /> inside
 * its relative-positioned container in Home.tsx, so it doesn't require any
 * changes inside MapViewSection itself.
 *
 * NOTE: search/layers/filter are wired with callbacks but don't yet touch
 * MapViewSection's internals — hook these up once that component exposes
 * the relevant props (e.g. a `searchQuery` filter or a `visibleLayers` set).
 */
export const MobileMapOverlay: React.FC<MobileMapOverlayProps> = ({
  searchValue,
  onSearchChange,
  onMicClick,
  onLayersClick,
  onFilterClick,
  onLocateClick,
}) => {
  return (
    <>
      {/* Search bar */}
      <div className="lg:hidden absolute top-3 left-3 right-3 z-20 flex items-center gap-2 bg-slate-950/90 backdrop-blur-sm border border-slate-800 rounded-full pl-4 pr-1.5 py-1.5 shadow-xl">
        <Search className="w-4 h-4 text-slate-500 shrink-0" strokeWidth={2} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search safety zones or incidents..."
          className="flex-1 min-w-0 bg-transparent text-xs text-slate-200 placeholder:text-slate-500 outline-none"
        />
        <button
          type="button"
          onClick={onMicClick}
          aria-label="Voice search"
          className="shrink-0 w-8 h-8 rounded-full bg-[var(--theme-accent)] text-slate-950 flex items-center justify-center cursor-pointer hover:bg-[var(--theme-accent-hover)] transition-colors"
        >
          <Mic className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Floating map controls */}
      <div className="lg:hidden absolute top-[68px] right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={onLayersClick}
          aria-label="Map layers"
          className="w-9 h-9 rounded-full bg-slate-950/90 backdrop-blur-sm border border-slate-800 text-slate-300 flex items-center justify-center shadow-lg cursor-pointer hover:text-slate-100 transition-colors"
        >
          <Layers className="w-4 h-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={onFilterClick}
          aria-label="Filter incidents"
          className="w-9 h-9 rounded-full bg-slate-950/90 backdrop-blur-sm border border-slate-800 text-slate-300 flex items-center justify-center shadow-lg cursor-pointer hover:text-slate-100 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={onLocateClick}
          aria-label="Center on my location"
          className="w-9 h-9 rounded-full bg-[var(--theme-accent)] text-slate-950 flex items-center justify-center shadow-lg cursor-pointer hover:bg-[var(--theme-accent-hover)] transition-colors"
        >
          <LocateFixed className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
};