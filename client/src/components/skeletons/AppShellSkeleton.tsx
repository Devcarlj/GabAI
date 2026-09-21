import React from "react";
import { MapSkeleton } from "./MapSkeleton";
import { MobileLoaderOverlay } from "./MobileLoaderOverlay";

export const AppShellSkeleton: React.FC = () => (
  <div className="app-shell">
    <aside className="app-sidebar" aria-hidden="true" />
    <div className="app-main-wrap">
      <header className="app-nav">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            className="app-mobile-hamburger"
            style={{
              padding: "0.375rem",
              marginLeft: "-0.25rem",
              color: "#94a3b8",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <img
            src="/src/assets/favicon.png"
            alt="GabAI"
            style={{
              width: "1.25rem",
              height: "1.25rem",
              borderRadius: "9999px",
              objectFit: "cover",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <h1
            style={{
              fontSize: "0.75rem",
              fontWeight: "bold",
              letterSpacing: "0.05em",
              color: "#e2e8f0",
              margin: 0,
            }}
          >
            GABAI <span className="app-lgu-subtitle">(DICT eGov Plugin)</span>
          </h1>
        </div>
        <div className="app-lgu-badge">
          LGU Valenzuela <span>| Admin</span>
        </div>
      </header>
      <div className="app-workspace">
        <div className="app-left-panel">
          <div className="app-map-box">
            <MapSkeleton />
            <MobileLoaderOverlay />
          </div>
          <div className="app-kpi-grid" aria-hidden="true" />
        </div>
        <div className="app-right-panel" aria-hidden="true" />
      </div>
    </div>
    <div className="app-mobile-nav" aria-hidden="true">
      <div className="app-mobile-sos-wrap">
        <div className="app-mobile-sos-btn">SOS</div>
      </div>
      <div className="app-mobile-nav-half">
        <div className="app-mobile-nav-item">Feed</div>
        <div className="app-mobile-nav-item active">Map</div>
      </div>
      <div className="app-mobile-nav-spacer" />
      <div className="app-mobile-nav-half">
        <div className="app-mobile-nav-item">Report</div>
        <div className="app-mobile-nav-item">User</div>
      </div>
    </div>
  </div>
);
