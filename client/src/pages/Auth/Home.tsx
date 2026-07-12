import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Ticket } from '../../types/ticket';
import { IncidentDetailCard } from '../../components/IncidentDetailCard';
import { NavbarHeader } from '../../components/NavbarHeader';
import { MapViewSection } from '../../components/MapViewSection';

export const Home: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchInitialTickets = async () => {
      try {
        const response = await axios.get<Ticket[]>('/api/tickets');
        if (!isMounted) return;
        setTickets(response.data);
        if (response.data.length > 0) {
          setSelectedTicket((current: Ticket | null) => current ?? response.data[0]);
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    };
    void fetchInitialTickets();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post<Ticket>('/api/tickets', { rawText: inputText });
      setTickets((prev) => [response.data, ...prev]);
      setSelectedTicket(response.data);
      setInputText('');
    } catch (err) {
      console.error('Error submitting ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#070b12] text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-16 border-r border-slate-900 bg-[#090f1a] flex flex-col items-center py-4 justify-between shrink-0">
        <div className="flex flex-col items-center gap-5 w-full">
          <div className="p-2 text-cyan-400 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </div>
          <div className="p-2.5 bg-cyan-950/40 text-cyan-400 border-l-2 border-cyan-400 w-full flex justify-center cursor-pointer">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.707.707a1 1 0 001.414-1.414l-7-7z" /></svg>
          </div>
          <div className="p-2 text-slate-500 hover:text-slate-300 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <div className="p-2 text-slate-500 hover:text-slate-300 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
        </div>
        <div className="p-2 text-slate-600 hover:text-red-400 cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden h-full justify-between">
        
        {/* 2. TOP NAVBAR */}
        <NavbarHeader/>

        {/* 3. QUICK LIVE CONTROLLER SUBMISSION */}
        <form onSubmit={handleSubmit} className="mb-3 flex gap-2 shrink-0 px-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Mabilisang Triage Simulation (e.g. Malakas ang baha rito sa may Karuhatan...)"
            className="flex-1 bg-[#090f1a] border border-slate-900 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs transition-colors shrink-0 disabled:opacity-40"
          >
            {loading ? 'Analyzing...' : 'Submit'}
          </button>
        </form>

        {/* 4. THREE-COLUMN FIXED-HEIGHT WORKSPACE */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden items-stretch mb-1">
          
          {/* COLUMN 1 & 2: GEO-MAP & SHORT KPI GRID COMPONENT CONTAINER */}
          <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden h-full">
            
            {/* GIS MAP CONTAINER WITH FLOATING OVERLAY */}
            <div className="flex-1 relative bg-[#09101d] rounded-2xl border border-slate-900 overflow-hidden min-h-0">
              
              {/* Map GIS background grid */}
                <MapViewSection 
                tickets={tickets}
                selectedTicket={selectedTicket}
                setSelectedTicket={setSelectedTicket}
                />

            </div>

            {/* LOWER PORTION: SIX KPI BLOCKS DIVIDED COMPACTLY INTO 3x2 ARRAY */}
            <div className="grid grid-cols-3 gap-3 shrink-0 h-31.25">
              
              {/* Card 1: ACTIVE TICKETS */}
              <div className="bg-[#090f1a] border border-slate-900 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">Active Tickets</span>
                <span className="text-xl font-bold text-cyan-400 tracking-tight leading-none mt-1">{tickets.length || 14}</span>
              </div>

              {/* Card 2: HIGH PRIORITY */}
              <div className="bg-[#090f1a] border border-slate-900 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">High Priority</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-xl font-bold text-red-500 tracking-tight leading-none">
                    {tickets.filter(t => t.aiAnalysis?.urgency === 'CRITICAL' || t.aiAnalysis?.urgency === 'HIGH').length || 3}
                  </span>
                  <div className="flex items-end gap-0.5 h-4">
                    <div className="w-0.5 bg-red-950 h-1"></div>
                    <div className="w-0.5 bg-red-900 h-2"></div>
                    <div className="w-0.5 bg-red-700 h-3"></div>
                    <div className="w-0.5 bg-red-500 h-4"></div>
                  </div>
                </div>
              </div>

              {/* Card 3: AVG TRIAGE TIME */}
              <div className="bg-[#090f1a] border border-slate-900 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">Avg Triage Time</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-xl font-bold text-slate-200 tracking-tight leading-none">1.8s</span>
                  <div className="flex items-end gap-0.5 h-4">
                    <div className="w-0.5 bg-cyan-950 h-2"></div>
                    <div className="w-0.5 bg-cyan-900 h-3"></div>
                    <div className="w-0.5 bg-cyan-500 h-4"></div>
                  </div>
                </div>
              </div>

              {/* Card 4: TREND GRAPH */}
              <div className="bg-[#090f1a] border border-slate-900 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">Past Trend Matrix</span>
                <div className="relative h-5 w-full mt-1">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,25 Q15,5 30,20 T60,10 T90,22 T100,15" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Card 5: TOTAL TRIAGE QUANTITY */}
              <div className="bg-[#090f1a] border border-slate-900 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">Total Triage</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-xl font-bold text-slate-200 tracking-tight leading-none">3</span>
                  <div className="flex items-end gap-0.5 h-4">
                    <div className="w-0.5 bg-cyan-900 h-1"></div>
                    <div className="w-0.5 bg-cyan-500 h-3"></div>
                    <div className="w-0.5 bg-cyan-400 h-4"></div>
                  </div>
                </div>
              </div>

              {/* Card 6: SDG IMPACT SUMMARY */}
              <div className="bg-[#090f1a] border border-slate-900 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">SDG IMPACT (Weekly)</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-bold text-emerald-400 tracking-tight leading-none">75%</span>
                  <span className="text-[8px] text-slate-500">Flood Redux</span>
                </div>
              </div>

            </div>
          </div>

          {/* COLUMN 3: SINGLE STANDALONE INCIDENT DETAILS FEED */}
          {/* This container stretches perfectly across the full vertical space of columns 1 & 2 */}
          <div className="lg:col-span-1 bg-[#090f1a] rounded-2xl border border-slate-900 shadow-xl overflow-y-auto h-full min-h-0">
            <IncidentDetailCard ticket={selectedTicket} />
          </div>

        </div>

      </div>
    </div>
  );
};