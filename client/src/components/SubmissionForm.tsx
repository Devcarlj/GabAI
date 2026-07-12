import React from 'react';
import { AlertTriangle, Construction } from 'lucide-react';
import type { IncidentType } from '../types/ticket';

interface SubmissionFormProps {
  inputText: string;
  setInputText: (text: string) => void;
  photo: string | null;
  loading: boolean;
  isGpsActive: boolean;
  gpsLoading: boolean;
  userLocation: { lat: number; lng: number } | null;
  locationLabel: string | null;
  incidentType: IncidentType;
  setIncidentType: (type: IncidentType) => void;
  onToggleGps: () => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  inputText,
  setInputText,
  photo,
  loading,
  isGpsActive,
  gpsLoading,
  userLocation,
  locationLabel,
  incidentType,
  setIncidentType,
  onToggleGps,
  onPhotoChange,
  onRemovePhoto,
  onSubmit,
}) => {
  return (
    <div className="flex flex-col h-full justify-between gap-4">
      {/* Directive Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 border-b border-slate-900/50 pb-2">
          <AlertTriangle className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
            SuriAI Live Triage Submission
          </span>
        </div>

        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-[10px] text-slate-400 leading-relaxed font-mono">
          <span className="text-cyan-400 font-bold block mb-1">⚡ OPERATOR SYSTEM DIRECTIVE:</span>
          Insert citizen reports directly. Triage parses Taglish/English and triggers emergency response.
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={onSubmit} className="flex flex-col gap-3 flex-1 justify-end">
        <div className="relative flex-1 min-h-[140px] flex flex-col">
          
          {/* Location Toggle Bar */}
          <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-900 mb-2">
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 ${isGpsActive ? 'text-cyan-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-slate-300 font-mono">
                  {gpsLoading ? 'Acquiring GPS...' : isGpsActive ? 'GPS Position Locked' : 'Attach Live Location'}
                </span>
                {isGpsActive && userLocation && (
                  <span className="text-[9px] text-cyan-400/80 font-mono truncate max-w-[180px]">
                    {locationLabel || `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleGps}
              className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                isGpsActive ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="bg-slate-950 w-3 h-3 rounded-full shadow-md transition-transform" />
            </button>
          </div>

          {/* Category Toggle Selector (Warning vs Construction) */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              onClick={() => setIncidentType('WARNING')}
              className={`flex items-center justify-center gap-2 py-1.5 px-2 rounded-xl border text-[10px] font-mono transition-all cursor-pointer ${
                incidentType === 'WARNING'
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>INCIDENT / HAZARD</span>
            </button>

            <button
              type="button"
              onClick={() => setIncidentType('CONSTRUCTION')}
              className={`flex items-center justify-center gap-2 py-1.5 px-2 rounded-xl border text-[10px] font-mono transition-all cursor-pointer ${
                incidentType === 'CONSTRUCTION'
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                  : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
              }`}
            >
              <Construction className="w-3.5 h-3.5" />
              <span>GOVT PROJECT</span>
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe the emergency or incident details (Tagalog, English, Taglish)..."
            className="w-full flex-1 bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none leading-relaxed min-h-[120px]"
          />
        </div>

        {/* Photo Upload Area */}
        <div className="flex flex-col gap-2 shrink-0">
          <input
            type="file"
            accept="image/*"
            id="triage-photo-upload"
            className="hidden"
            onChange={onPhotoChange}
          />

          {!photo ? (
            <label
              htmlFor="triage-photo-upload"
              className="border border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl py-2.5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 bg-slate-950/20 hover:bg-slate-950/50 group"
            >
              <svg className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] text-slate-500 group-hover:text-slate-300 font-semibold transition-colors">
                Add Photo (Optional)
              </span>
            </label>
          ) : (
            <div className="relative border border-slate-850 rounded-xl overflow-hidden bg-slate-950/40 p-1.5 flex items-center justify-between group">
              <div className="flex items-center gap-2.5">
                <img
                  src={photo}
                  alt="Incident Preview"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-850"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-300 font-semibold font-mono">photo_asset.png</span>
                  <span className="text-[8px] text-slate-500 uppercase font-mono">Ready to upload</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onRemovePhoto}
                className="p-1.5 bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer mr-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-900/50 text-slate-950 disabled:text-slate-600 font-bold py-2.5 rounded-xl text-xs transition-colors shrink-0 disabled:opacity-40 font-mono shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:shadow-none cursor-pointer"
        >
          {loading ? 'ANALYZING INCIDENT...' : 'SUBMIT REPORT'}
        </button>
      </form>
    </div>
  );
};