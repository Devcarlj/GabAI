import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type { Ticket } from '../types/ticket';
import { IncidentDetailCard } from '../components/IncidentDetailCard';
import { NavbarHeader } from '../components/NavbarHeader';
import { MapViewSection } from '../components/MapViewSection';
import { ActiveTriageFeed } from '../components/ActiveTriageFeed';
import { fetchReverseGeocode } from '../api/geocode';
import { SubmissionForm } from '../components/SubmissionForm';
import { MobileSubmissionBar } from '../components/MobileSubmissionBar';

const MetricCards: React.FC<{ tickets: Ticket[]; compact?: boolean }> = ({ tickets, compact }) => {
  const cardClass = compact
    ? 'mobile-metric-card bg-[#090f1a] border border-slate-900 flex flex-col justify-between'
    : 'bg-[#090f1a] border border-slate-900 rounded-xl p-2.5 flex flex-col justify-between';

  const labelClass = compact
    ? 'text-[7px] font-bold tracking-wider text-slate-500 uppercase'
    : 'text-[9px] font-bold tracking-wider text-slate-500 uppercase';

  const valueClass = compact
    ? 'text-base font-bold tracking-tight leading-none mt-0.5'
    : 'text-xl font-bold tracking-tight leading-none mt-1';

  return (
    <>
      <div className={cardClass}>
        <span className={labelClass}>Active Tickets</span>
        <span className={`${valueClass} text-cyan-400`}>{tickets.length || 14}</span>
      </div>

      <div className={cardClass}>
        <span className={labelClass}>High Priority</span>
        <div className="flex items-end justify-between mt-0.5">
          <span className={`${valueClass} text-red-500`}>
            {tickets.filter(t => t.aiAnalysis?.urgency === 'CRITICAL' || t.aiAnalysis?.urgency === 'HIGH').length || 3}
          </span>
          {!compact && (
            <div className="flex items-end gap-0.5 h-4">
              <div className="w-0.5 bg-red-950 h-1"></div>
              <div className="w-0.5 bg-red-900 h-2"></div>
              <div className="w-0.5 bg-red-700 h-3"></div>
              <div className="w-0.5 bg-red-500 h-4"></div>
            </div>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <span className={labelClass}>Avg Triage Time</span>
        <div className="flex items-end justify-between mt-0.5">
          <span className={`${valueClass} text-slate-200`}>1.8s</span>
          {!compact && (
            <div className="flex items-end gap-0.5 h-4">
              <div className="w-0.5 bg-cyan-950 h-2"></div>
              <div className="w-0.5 bg-cyan-900 h-3"></div>
              <div className="w-0.5 bg-cyan-500 h-4"></div>
            </div>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <span className={labelClass}>Past Trend Matrix</span>
        <div className={`relative ${compact ? 'h-3' : 'h-5'} w-full mt-0.5`}>
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path d="M0,25 Q15,5 30,20 T60,10 T90,22 T100,15" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <div className={cardClass}>
        <span className={labelClass}>Total Triage</span>
        <div className="flex items-end justify-between mt-0.5">
          <span className={`${valueClass} text-slate-200`}>3</span>
          {!compact && (
            <div className="flex items-end gap-0.5 h-4">
              <div className="w-0.5 bg-cyan-900 h-1"></div>
              <div className="w-0.5 bg-cyan-500 h-3"></div>
              <div className="w-0.5 bg-cyan-400 h-4"></div>
            </div>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <span className={labelClass}>SDG IMPACT (Weekly)</span>
        <div className="flex items-center justify-between mt-0.5">
          <span className={`${compact ? 'text-sm' : 'text-lg'} font-bold text-emerald-400 tracking-tight leading-none`}>75%</span>
          <span className="text-[7px] text-slate-500">Flood Redux</span>
        </div>
      </div>
    </>
  );
};

const SidebarNavLinks: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => (
  <nav className="flex flex-col gap-1 p-4">
    <Link
      to="/"
      onClick={onNavigate}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.707.707a1 1 0 001.414-1.414l-7-7z" /></svg>
      <span className="text-xs font-semibold tracking-wide">Home</span>
    </Link>
    <button
      onClick={onNavigate}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors cursor-pointer"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      <span className="text-xs font-semibold tracking-wide">Directory</span>
    </button>
    <button
      onClick={onNavigate}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors cursor-pointer"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      <span className="text-xs font-semibold tracking-wide">Reports</span>
    </button>
    <Link
      to="/login"
      onClick={onNavigate}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-[#D0FD1B] hover:bg-slate-900/50 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span className="text-xs font-semibold tracking-wide">Login</span>
    </Link>
  </nav>
);

export const Home: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [activeRightPanel, setActiveRightPanel] = useState<'submission' | 'detail'>('submission');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState<boolean>(false);
  const [mapFocusKey, setMapFocusKey] = useState<number>(0);
  const isClosingRef = React.useRef<boolean>(false);

  // Place with your other state hooks in Home.tsx
const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
const [gpsLoading, setGpsLoading] = useState<boolean>(false);
const [locationLabel, setLocationLabel] = useState<string | null>(null);

const watchIdRef = React.useRef<number | null>(null);
const lastGeocodeRef = React.useRef<{ lat: number; lng: number } | null>(null);

// Turns raw coordinates into a readable address, e.g. "Gen. T. de Leon, Valenzuela City"
// via our own /api/geocode proxy (see server/controllers/geocodeController.ts) — keeps the
// Nominatim User-Agent requirement and rate limiting server-side instead of in the browser.
const reverseGeocode = async (lat: number, lng: number) => {
  const label = await fetchReverseGeocode(lat, lng);
  // Non-fatal on failure — fetchReverseGeocode resolves to null and the UI falls
  // back to raw lat/lng; ticket submission is unaffected either way.
  setLocationLabel(label);
};

// Only re-geocode once the user has actually moved a meaningful distance (~40m),
// so a live watchPosition feed doesn't hammer the geocoding API on every tick.
const maybeReverseGeocode = (lat: number, lng: number) => {
  const last = lastGeocodeRef.current;
  if (last) {
    const dLat = lat - last.lat;
    const dLng = lng - last.lng;
    const approxMeters = Math.sqrt(dLat * dLat + dLng * dLng) * 111000;
    if (approxMeters < 40) return;
  }
  lastGeocodeRef.current = { lat, lng };
  void reverseGeocode(lat, lng);
};

const handleToggleGps = () => {
  if (isGpsActive) {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsGpsActive(false);
    setUserLocation(null);
    setLocationLabel(null);
    lastGeocodeRef.current = null;
    return;
  }

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  setGpsLoading(true);
  // watchPosition (not getCurrentPosition) so the pin on the map actually
  // tracks the user live while the toggle stays on, on both desktop and mobile.
  watchIdRef.current = navigator.geolocation.watchPosition(
    (position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(coords);
      setIsGpsActive(true);
      setGpsLoading(false);
      maybeReverseGeocode(coords.lat, coords.lng);
    },
    (error) => {
      console.error('Error obtaining location:', error);
      alert('Unable to retrieve your location. Please check browser permissions.');
      setIsGpsActive(false);
      setGpsLoading(false);
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
  );
};

// Stop watching GPS if the component unmounts while tracking is on
useEffect(() => {
  return () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
  };
}, []);

// 1. Selecting a ticket
const handleSelectTicket = (ticket: Ticket | null) => {
  if (!ticket) {
    // User unselected or closed ticket
    setSelectedTicket(null);
    setIsMobileDetailOpen(false);
    return;
  }

  isClosingRef.current = false; // Reset close flag
  setSelectedTicket(ticket);
  setMapFocusKey((k) => k + 1);
  setActiveRightPanel('detail');
  setIsRightPanelOpen(true);

  const isMobile = window.matchMedia('(max-width: 1023px)').matches;

  // Desktop opens instantly; Mobile waits for coordinates zoom or opens immediately if no coords
  if (!isMobile) {
    setIsMobileDetailOpen(false);
  } else if (!ticket.coordinates?.lat || !ticket.coordinates?.lng) {
    setIsMobileDetailOpen(true);
  }
};

// 2. Triggered when map fly-to finishes
const handleMapZoomComplete = () => {
  const isMobile = window.matchMedia('(max-width: 1023px)').matches;

  // ONLY open if the user didn't hit the close button while zooming
  if (isMobile && selectedTicket && !isClosingRef.current) {
    setIsMobileDetailOpen(true);
  }
};

// 3. Explicitly close the mobile detail card
const handleCloseMobileDetail = () => {
  isClosingRef.current = true; // Block queued moveend callbacks from re-opening it
  setIsMobileDetailOpen(false);
};

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchInitialTickets = async () => {
      try {
        const response = await axios.get<Ticket[]>('/api/tickets');
        if (!isMounted) return;
        setTickets(response.data);
        if (response.data.length > 0) {
          setSelectedTicket((current) => current ?? response.data[0]);
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    };
    void fetchInitialTickets();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        setIsMobileDetailOpen(false);
      }
    };
    closeOnDesktop(mediaQuery);
    mediaQuery.addEventListener('change', closeOnDesktop);
    return () => mediaQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('SUBMIT FIRED', { inputText, hasPhoto: !!photo, photoLength: photo?.length });
    e.preventDefault();
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post<Ticket>('/api/tickets', {
      rawText: inputText,
      photoUrl: photo || '',
      coordinates: userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined,
      locationLabel: userLocation ? locationLabel || undefined : undefined,
    });
      setTickets((prev) => [response.data, ...prev]);
      handleSelectTicket(response.data);
      setInputText('');
      setPhoto(null);
    } catch (err) {
      console.error('Error submitting ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen lg:h-screen bg-[#070b12] text-slate-100 font-sans antialiased overflow-x-hidden lg:overflow-hidden select-none">

      {/* 1. LEFT SIDEBAR — desktop only */}
      <aside className="hidden lg:flex w-16 border-r border-slate-900 bg-[#090f1a] flex-col items-center py-4 justify-between shrink-0">
        <div className="flex flex-col items-center gap-5 w-full">
          <div className="p-2 text-slate-500 hover:text-slate-300 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </div>

          <Link to="/" className="p-2.5 bg-cyan-950/40 text-cyan-400 border-l-2 border-cyan-400 w-full flex justify-center cursor-pointer">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.707.707a1 1 0 001.414-1.414l-7-7z" /></svg>
          </Link>

          <div className="p-2 text-slate-500 hover:text-slate-300 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>

          <div className="p-2 text-slate-500 hover:text-slate-300 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
        </div>

        <Link
          to="/login"
          title="Operator Login"
          className="p-2 text-slate-500 hover:text-[#D0FD1B] transition-colors duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Link>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col lg:p-4 lg:overflow-hidden lg:h-full lg:justify-between pb-18 lg:pb-0 overflow-y-auto lg:overflow-y-hidden min-h-0">

        {/* 2. TOP NAVBAR */}
        <NavbarHeader onToggleDrawer={() => setIsMobileDrawerOpen(true)} />

        {/* MOBILE ONLY: Compact metrics — 2 rows × 3 columns */}
        <div className="mobile-metrics-row border-b border-slate-900/50 shrink-0 lg:!hidden">
          <MetricCards tickets={tickets} compact />
        </div>

        {/* THREE-COLUMN FIXED-HEIGHT WORKSPACE */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 lg:overflow-hidden items-stretch lg:mb-1 relative min-h-0 lg:min-h-0">

          {/* COLUMN 1 & 2: GEO-MAP & KPI GRID */}
          <div className={`${isRightPanelOpen ? 'lg:col-span-2' : 'lg:col-span-3'} flex flex-col gap-0 lg:gap-4 lg:overflow-hidden lg:h-full min-h-0 transition-all duration-300`}>

            {/* GIS MAP CONTAINER */}
            <div className="h-[42vh] min-h-[240px] lg:flex-1 lg:h-full relative bg-[#09101d] rounded-none lg:rounded-2xl border-0 lg:border border-slate-900 overflow-hidden shrink-0 lg:shrink lg:min-h-0">
              <MapViewSection
                tickets={tickets}
                selectedTicket={selectedTicket}
                setSelectedTicket={handleSelectTicket}
                focusKey={mapFocusKey}
                userLocation={userLocation}
                isGpsActive={isGpsActive}
                gpsLoading={gpsLoading}
                locationLabel={locationLabel}
                onZoomComplete={handleMapZoomComplete}
              />
            </div>

            {/* MOBILE: Triage feed below map — scroll to view */}
            <div className="lg:hidden shrink-0 px-3 pt-3 pb-4">
              <ActiveTriageFeed
                tickets={tickets}
                selectedTicketId={selectedTicket?._id || null}
                onSelectTicket={handleSelectTicket}
                embedded
              />
            </div>

            {/* DESKTOP KPI GRID */}
            <div className="hidden lg:grid grid-cols-3 gap-3 shrink-0 h-31.25">
              <MetricCards tickets={tickets} />
            </div>
          </div>

          {/* COLUMN 3: RIGHT SIDEBAR — desktop only */}
          {isRightPanelOpen ? (
            <div className="hidden lg:flex lg:col-span-1 flex-col overflow-hidden h-full min-h-0 bg-[#090f1a] rounded-2xl border border-slate-900 shadow-xl transition-all duration-300">

              <div className="flex items-center justify-between border-b border-slate-900 p-3 bg-slate-950/20 shrink-0">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveRightPanel('submission')}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      activeRightPanel === 'submission'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    Submission
                  </button>
                  <button
                    onClick={() => selectedTicket && setActiveRightPanel('detail')}
                    disabled={!selectedTicket}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      activeRightPanel === 'detail'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-500 hover:text-slate-350 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                  >
                    Incident Detail
                  </button>
                </div>

                <button
                  onClick={() => setIsRightPanelOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-900/50 rounded-lg transition-all duration-200 cursor-pointer"
                  title="Close Sidebar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 min-h-0 flex flex-col justify-between">
                {activeRightPanel === 'submission' ? (
                <SubmissionForm
                  inputText={inputText}
                  setInputText={setInputText}
                  photo={photo}
                  loading={loading}
                  isGpsActive={isGpsActive}
                  gpsLoading={gpsLoading}
                  userLocation={userLocation}
                  locationLabel={locationLabel}
                  onToggleGps={handleToggleGps}
                  onPhotoChange={handlePhotoChange}
                  onRemovePhoto={handleRemovePhoto}
                  onSubmit={handleSubmit}
                />
              ) : (
                  <div className="h-full">
                    <IncidentDetailCard ticket={selectedTicket} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsRightPanelOpen(true)}
              className="hidden lg:flex absolute right-4 top-4 z-20 bg-[#090f1a]/95 hover:bg-slate-900 border border-slate-800 text-cyan-400 p-2.5 rounded-xl shadow-2xl hover:text-cyan-300 transition-all duration-200 cursor-pointer items-center gap-1.5 group font-mono text-[10px] font-bold tracking-wider"
              title="Open Triage Panel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span>OPEN PANEL</span>
            </button>
          )}

        </div>
      </div>

      {/* MOBILE: Chat-style submission bar */}
      <MobileSubmissionBar
        inputText={inputText}
        setInputText={setInputText}
        photo={photo}
        loading={loading}
        isGpsActive={isGpsActive}
        onToggleGps={handleToggleGps}
        onPhotoChange={handlePhotoChange}
        onRemovePhoto={handleRemovePhoto}
        onSubmit={handleSubmit}
      />

      {/* MOBILE: Slide-in navigation drawer */}
      {isMobileDrawerOpen && (
        <>
          <div
            className="lg:hidden mobile-drawer-backdrop"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="lg:hidden mobile-drawer-panel flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-900">
              <span className="text-xs font-bold tracking-wider text-slate-300">GABAI</span>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarNavLinks onNavigate={() => setIsMobileDrawerOpen(false)} />
          </div>
        </>
      )}

        {/* MOBILE ONLY: Incident detail bottom sheet */}
        {isMobileDetailOpen && selectedTicket && (
          <>
            <div
              className="lg:hidden mobile-bottom-sheet-backdrop"
              onClick={handleCloseMobileDetail} // Updated to block re-opening
              aria-hidden="true"
            />
            <div className="lg:hidden mobile-bottom-sheet">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-900 shrink-0">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                  Incident Detail
                </span>
                <button
                  onClick={handleCloseMobileDetail} // Updated to block re-opening
                  className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  aria-label="Close incident detail"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                <IncidentDetailCard ticket={selectedTicket} />
              </div>
            </div>
          </>
        )}
    </div>
  );
};