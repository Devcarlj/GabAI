import React from 'react';
import type { Ticket } from '../types/ticket';

interface KPIMetricsGridProps {
  tickets: Ticket[];
}

export const KPIMetricsGrid: React.FC<KPIMetricsGridProps> = ({ tickets }) => {
  const criticalCount = tickets.filter(t => t.aiAnalysis?.urgency === 'CRITICAL').length;
  const highCount = tickets.filter(t => t.aiAnalysis?.urgency === 'HIGH').length;
  const totalCount = tickets.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
        <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Active Incidents</span>
        <span className="text-3xl font-bold text-white mt-2">{totalCount}</span>
      </div>
      
      <div className="bg-slate-900 border border-red-950 p-4 rounded-xl flex flex-col justify-between">
        <span className="text-xs text-red-400 font-medium tracking-wider uppercase">Critical Urgency</span>
        <span className="text-3xl font-bold text-red-500 mt-2">{criticalCount}</span>
      </div>

      <div className="bg-slate-900 border border-amber-950 p-4 rounded-xl flex flex-col justify-between">
        <span className="text-xs text-amber-400 font-medium tracking-wider uppercase">High Urgency</span>
        <span className="text-3xl font-bold text-amber-500 mt-2">{highCount}</span>
      </div>
    </div>
  );
};