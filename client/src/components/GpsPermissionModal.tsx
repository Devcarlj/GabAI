import React from 'react';
import { MapPin } from 'lucide-react';

interface GpsPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const GpsPermissionModal: React.FC<GpsPermissionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#090f1a] border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        
        {/* Header with MapPin Icon */}
        <div className="flex items-center gap-2.5 text-cyan-400">
          <MapPin className="w-5 h-5 shrink-0" strokeWidth={2.5} />
          <h3 className="text-sm font-bold tracking-wide text-slate-200">
            Enable Device Location
          </h3>
        </div>
        
        {/* User-Friendly Copy */}
        <p className="text-xs text-slate-400 leading-relaxed">
          GABAI uses your live location to show you on the map and attach your precise coordinates whenever you submit an incident report.
        </p>

        {/* Simplified Action Buttons */}
        <div className="flex gap-2.5 justify-end mt-2 text-xs font-semibold tracking-wide">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-all cursor-pointer"
          >
            Not Now
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.15)]"
          >
            Allow Access
          </button>
        </div>
        
      </div>
    </div>
  );
};