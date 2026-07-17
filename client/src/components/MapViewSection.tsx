import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Ticket,  NearbyLGU } from '../types/ticket';
import { ActiveTriageFeed } from './ActiveTriageFeed';


interface UserLocation {
  lat: number;
  lng: number;
}

interface MapViewSectionProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  setSelectedTicket: (ticket: Ticket | null) => void;
  focusKey?: number;
  userLocation?: UserLocation | null;
  isGpsActive?: boolean;
  gpsLoading?: boolean;
  locationLabel?: string | null;
  onZoomComplete?: () => void;
  nearbyLGUs?: NearbyLGU[];
  showNearLGUs?: boolean;
  onPhViewClick?: () => void;
   onSelectLGU?: (lgu: NearbyLGU) => void;
}

// Helper to get camera settings based on screen width
const getResponsiveMapSettings = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    return {
      center: [122.0, 13.0] as [number, number], // Shifted slightly left/up for narrow screens
      zoom: 3.8,                                // More zoomed out so islands fit vertically
      pitch: 45,
    };
  }

  return {
    center: [120.5, 12.5] as [number, number], // Desktop center
    zoom: 4.7,                                // Desktop zoom
    pitch: 0,
  };
};

const getTicketCoordinates = (ticket: Ticket): [number, number] | null => {
  if (
    typeof ticket.coordinates?.lng === 'number' &&
    typeof ticket.coordinates?.lat === 'number'
  ) {
    return [ticket.coordinates.lng, ticket.coordinates.lat];
  }
  return null;
};

export const MapViewSection: React.FC<MapViewSectionProps> = ({
  tickets,
  selectedTicket,
  setSelectedTicket,
  focusKey = 0,
  userLocation = null,
  isGpsActive = false,
  gpsLoading = false,
  locationLabel = null,
  onZoomComplete,
  nearbyLGUs = [],
  showNearLGUs = false,
  onPhViewClick,
  onSelectLGU,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const isFirstRenderRef = useRef<boolean>(true);
  const prevGpsActiveRef = useRef<boolean>(false);
  const [unconfirmedCount, setUnconfirmedCount] = useState<number>(0);
  const prevFocusKeyRef = useRef<number>(0);

  const handleZoomToPhilippines = () => {
    if (!map) return;
    onPhViewClick?.();
    const { center, zoom } = getResponsiveMapSettings();

    map.flyTo({
      center,
      zoom,
      pitch: 45,
      essential: true,
      speed: 1.2,
      curve: 1.4,
    });
  };

  // 1. Initialize the Map once on mount with responsive default view
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const { center, zoom, pitch } = getResponsiveMapSettings();

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center,
      zoom,
      pitch,
      attributionControl: false,
    });

    mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');
    setMap(mapInstance);

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      mapInstance.remove();
    };
  }, []);

  // 2. Render markers and handle camera updates when tickets or selection changes
  useEffect(() => {
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    let skipped = 0;

tickets.forEach((ticket) => {
  const coords = getTicketCoordinates(ticket);
  if (!coords) {
    skipped += 1;
    return;
  }
  const [lng, lat] = coords;

  const el = document.createElement('div');
  el.className = 'relative flex items-center justify-center cursor-pointer group';
  el.style.width = '24px';
  el.style.height = '24px';

  const rawUrgency = (ticket.aiAnalysis?.urgency || '').toUpperCase();
  const isConstruction = ticket.aiAnalysis?.incidentType === 'CONSTRUCTION';
  

  // Use Amber for construction hazards, otherwise standard urgency colors
 const pinColor =
    rawUrgency === 'CRITICAL'
      ? '#ef4444' // Red
      : rawUrgency === 'HIGH' || rawUrgency === 'MAJOR'
      ? '#f97316' // Orange
      : rawUrgency === 'MEDIUM' || rawUrgency === 'MINOR'
      ? '#f59e0b' // Amber
      : '#0ea5e9'; // Sky Blue (LOW or default)
  const isSelected = selectedTicket?._id === ticket._id;

  // Render Lucide Construction SVG if CONSTRUCTION, else AlertTriangle SVG
// 3. Render Warning Triangle with Solid Filled Lucide Hammer inside
  const iconSvg = isConstruction
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${pinColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm">
        <!-- Outer Warning Triangle -->
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        
        <!-- Scaled, Centered & Solid-Filled Lucide Hammer -->
        <g transform="translate(6.2, 7.8) scale(0.48)">
          <!-- Handle & Accents -->
          <path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9"/>
          <path d="m18 15 4-4"/>
          <!-- Hammer Head with Fill -->
          <path fill="${pinColor}" d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"/>
        </g>
       </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${pinColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
       </svg>`;

    el.innerHTML = `
      <!-- Animated Pulse Background -->
      <span class="absolute inline-flex h-7 w-7 rounded-full opacity-40 animate-ping" style="background-color: ${pinColor}"></span>

      <!-- Alert Icon Container -->
      <div class="relative flex items-center justify-center p-1 rounded-full border-2 border-[#070b12] bg-[#070b12]/90 shadow-md transition-transform duration-150 group-hover:scale-125"
          style="${isSelected ? `transform: scale(1.35); box-shadow: 0 0 12px ${pinColor};` : ''}">
        ${iconSvg}
      </div>
    `;
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (selectedTicket?._id === ticket._id) {
          const isMobile = window.innerWidth < 768;
          map.flyTo({
            center: [lng, lat],
            zoom: isMobile ? 14.5 : 15.5,
            essential: true,
            speed: 1.2,
            curve: 1.4,
          });
        } else {
          setSelectedTicket(ticket);
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    setUnconfirmedCount(skipped);

    if (selectedTicket && isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
    }
  }, [map, tickets, selectedTicket, setSelectedTicket]);

  // 3. Zoom to selected ticket when user picks an incident
// Track previous selected ticket ID to avoid zooming during parent re-renders (like typing)
const prevSelectedIdRef = useRef<string | null>(null);
const lguMarkersRef = useRef<maplibregl.Marker[]>([]);



// 3. Zoom to selected ticket ONLY when focusKey changes or a NEW ticket is picked
useEffect(() => {
  if (!map || !selectedTicket || focusKey === 0) return;

  // If the selected ticket hasn't actually changed and focusKey didn't increment, skip zooming
  const currentId = selectedTicket._id ?? null;
  const isNewTicket = prevSelectedIdRef.current !== currentId;
  
  if (!isNewTicket && focusKey === prevFocusKeyRef.current) {
    return;
  }
  
  prevSelectedIdRef.current = currentId;
  prevFocusKeyRef.current = focusKey;

    const coords = getTicketCoordinates(selectedTicket);
    if (!coords) {
      onZoomComplete?.();
      return;
    }
    const [lng, lat] = coords;

    const handleMoveEnd = () => {
      onZoomComplete?.();
      map.off('moveend', handleMoveEnd);
    };

    map.once('moveend', handleMoveEnd);

    const isMobile = window.innerWidth < 768;

    map.flyTo({
      center: [lng, lat],
      zoom: isMobile ? 14.5 : 15.5,
      essential: true,
      speed: 1.2,
      curve: 1.4,
    });

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, selectedTicket, focusKey, onZoomComplete]);

 // 4. Render / update the live "You Are Here" GPS marker
useEffect(() => {
  if (!map) return;

  if (!userLocation) {
    userMarkerRef.current?.remove();
    userMarkerRef.current = null;
    return;
  }

  const { lat, lng } = userLocation;

  if (userMarkerRef.current) {
    userMarkerRef.current.setLngLat([lng, lat]);
  } else {
    const el = document.createElement('div');
    el.className = 'relative flex items-center justify-center';
    el.style.width = '26px';
    el.style.height = '26px';
    el.innerHTML = `
      <span class="absolute inline-flex h-6 w-6 rounded-full opacity-60 animate-ping" style="background-color:#3b82f6"></span>
      <span class="absolute inline-flex h-4 w-4 rounded-full opacity-90" style="background-color:#3b82f6"></span>
      <div class="relative h-3 w-3 rounded-full bg-white border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)]"></div>
    `;

    userMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([lng, lat]) 
      .addTo(map);
  }
}, [map, userLocation]);

  // 5. Fly to GPS position on activation
  useEffect(() => {
    if (!map) return;
    const justActivated = isGpsActive && !prevGpsActiveRef.current;
    if (justActivated && userLocation) {
      map.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 16,
        essential: true,
        speed: 1.2,
        curve: 1.4,
      });
    }
    prevGpsActiveRef.current = isGpsActive;
  }, [map, isGpsActive, userLocation]);

  // 6. Render nearby-LGU pins and frame the map so the incident stays dead-center.
useEffect(() => {
  if (!map) return;

  lguMarkersRef.current.forEach((m) => m.remove());
  lguMarkersRef.current = [];

  if (!showNearLGUs || !selectedTicket || nearbyLGUs.length === 0) return;

  const coords = getTicketCoordinates(selectedTicket);
  if (!coords) return;
  const [incidentLng, incidentLat] = coords;

  nearbyLGUs.forEach((lgu) => {
    const el = document.createElement('div');
    el.className = 'cursor-pointer group';
    el.style.width = '20px';
    el.style.height = '20px';
    el.title = `${lgu.name} (${lgu.distanceKm} km)`;
    el.innerHTML = `
      <div class="flex items-center justify-center p-1 rounded-full border-2 border-[#070b12] bg-emerald-500 shadow-md transition-transform duration-150 group-hover:scale-125">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
        </svg>
      </div>`;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      onSelectLGU?.(lgu);
    });

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([lgu.lng, lgu.lat])
      .addTo(map);
    lguMarkersRef.current.push(marker);
  });

  // Symmetric bounding box around the incident, sized to the farthest LGU.
  // This is what keeps the incident visually centered — fitBounds on the raw
  // point cluster would drag the center toward wherever the LGUs happen to sit.
  const maxDistKm = Math.max(...nearbyLGUs.map((l) => l.distanceKm), 1);
  const latOffset = maxDistKm / 111;
  const lngOffset = maxDistKm / (111 * Math.cos((incidentLat * Math.PI) / 180));

  map.fitBounds(
    [
      [incidentLng - lngOffset, incidentLat - latOffset],
      [incidentLng + lngOffset, incidentLat + latOffset],
    ],
    { padding: 60, pitch: 0, essential: true, duration: 1200 }
  );

  return () => {
    lguMarkersRef.current.forEach((m) => m.remove());
    lguMarkersRef.current = [];
  };
}, [map, showNearLGUs, nearbyLGUs, selectedTicket]);

  return (
    <div className="flex-1 relative bg-[#09101d] rounded-2xl border border-slate-900 overflow-hidden min-h-0 w-full h-full">
      {/* CSS override to hide MapLibre attribution controls */}
      <style>{`
        .maplibregl-ctrl-attrib {
          display: none !important;
        }
      `}</style>

      {/* Map Canvas Layer */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Floating Map Layers Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center bg-[#070b12]/90 border border-slate-800 px-2.5 py-1 rounded-md text-[10px] text-slate-300 backdrop-blur-md">
        <span className="text-cyan-400 mr-1">🗺️</span> Map Layers
      </div>

      {/* Top Right: Zoom Out Philippines Button */}
      <button
        onClick={handleZoomToPhilippines}
        className="absolute top-5 right-3 z-10 flex items-center gap-1.5 bg-[#070b12]/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 px-2.5 py-1.5 rounded-md text-[10px] text-slate-300 hover:text-cyan-400 font-mono backdrop-blur-md transition-all cursor-pointer shadow-lg group"
        title="Reset View to Philippines"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-cyan-400 group-hover:scale-110 transition-transform"
        >
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
        <span>PH VIEW</span>
      </button>

      {/* Unconfirmed-location notice */}
      {unconfirmedCount > 0 && (
        <div className="absolute top-3 right-3 sm:right-12 z-10 flex items-center gap-1.5 bg-[#070b12]/90 border border-amber-500/30 px-2.5 py-1.5 rounded-md text-[10px] text-amber-300 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
          {unconfirmedCount} ticket{unconfirmedCount === 1 ? '' : 's'} without a confirmed location
        </div>
      )}

      {/* Floating GPS Live Location Badge */}
      {(isGpsActive || gpsLoading) && (
        <div className="absolute top-24 right-3 z-10 flex items-center gap-1.5 max-w-[75%] sm:max-w-55 bg-[#070b12]/90 border border-blue-500/30 px-2.5 py-1.5 rounded-md text-[10px] text-blue-300 backdrop-blur-md shadow-[0_0_12px_rgba(59,130,246,0.15)]">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0 ${
              gpsLoading ? 'animate-pulse' : 'animate-ping'
            }`}
          />
          <span className="truncate">
            {gpsLoading
              ? 'Acquiring GPS signal…'
              : locationLabel
              ? locationLabel
              : userLocation
              ? `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
              : 'Location locked'}
          </span>
        </div>
      )}

      {/* FLOATING ACTIVE INCIDENT FEED OVERLAY — desktop only */}
      <div className="hidden lg:block absolute top-12 left-3 bottom-3 w-65 z-10 overflow-y-auto rounded-xl bg-[#070b12]/90 border border-slate-800/80 shadow-2xl backdrop-blur-md">
        <ActiveTriageFeed
          tickets={tickets}
          selectedTicketId={selectedTicket?._id || null}
          onSelectTicket={setSelectedTicket}
        />
      </div>

      {/* Map Watermark Footer */}
      <div className="absolute bottom-2 right-3 z-10 font-mono text-[9px] text-slate-600 pointer-events-none">
        GABAI_GIS // NATIONWIDE
      </div>
    </div>
  );
};