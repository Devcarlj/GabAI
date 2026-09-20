import React from "react";

const ControlIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const MobileLoaderOverlay: React.FC = () => (
  <>
    <div className="mobile-loader-search">
      <ControlIcon>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </ControlIcon>
      <span className="mobile-loader-search-placeholder skeleton-bone" aria-hidden="true" />
      <span className="mobile-loader-mic">
        <ControlIcon>
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
        </ControlIcon>
      </span>
    </div>
    <div className="mobile-loader-controls">
      <button type="button" aria-label="Map layers">
        <ControlIcon>
          <path d="m12 2 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
        </ControlIcon>
      </button>
      <button type="button" aria-label="Filter incidents">
        <ControlIcon>
          <path d="M4 5h16M7 12h10M10 19h4" />
        </ControlIcon>
      </button>
      <button
        type="button"
        aria-label="Center on my location"
        className="accent"
      >
        <ControlIcon>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </ControlIcon>
      </button>
    </div>
    <div
      className="mobile-loader-legend"
      role="group"
      aria-label="Hazard level legend"
    >
      <span className="mobile-loader-legend-title skeleton-bone" aria-hidden="true" />
      <span><i className="critical" /><span className="mobile-loader-legend-label skeleton-bone" /></span>
      <span><i className="high" /><span className="mobile-loader-legend-label skeleton-bone" /></span>
      <span><i className="moderate" /><span className="mobile-loader-legend-label skeleton-bone" /></span>
      <span><i className="safe" /><span className="mobile-loader-legend-label skeleton-bone" /></span>
    </div>
  </>
);
