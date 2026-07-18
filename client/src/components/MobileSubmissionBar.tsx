import React from 'react';

interface MobileSubmissionBarProps {
  inputText: string;
  setInputText: (text: string) => void;
  photo: string | null;
  loading: boolean;
  isGpsActive: boolean;
  onToggleGps: () => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MobileSubmissionBar: React.FC<MobileSubmissionBarProps> = ({
  inputText,
  setInputText,
  photo,
  loading,
  isGpsActive,
  onToggleGps,
  onPhotoChange,
  onRemovePhoto,
  onSubmit,
}) => {
  return (
    <div className="lg:hidden mobile-chat-bar">
      {/* Attached Photo Preview */}
      {photo && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-full pl-1 pr-2 py-1">
            <img src={photo} alt="Attached" className="w-7 h-7 rounded-full object-cover" />
            <span className="text-[10px] text-slate-400 font-mono">Photo attached</span>
            <button
              type="button"
              onClick={onRemovePhoto}
              className="p-0.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Remove photo"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          id="mobile-triage-photo-upload"
          className="hidden"
          onChange={onPhotoChange}
        />
        <label
          htmlFor="mobile-triage-photo-upload"
          className="shrink-0 p-2 text-slate-400 hover:text-[var(--theme-accent)] transition-colors cursor-pointer"
          aria-label="Upload photo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </label>

        {/* GPS Toggle Button */}
        <button
          type="button"
          onClick={onToggleGps}
          className={`shrink-0 p-2 transition-colors cursor-pointer ${
            isGpsActive ? 'text-[var(--theme-accent)]' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Toggle Location"
          title={isGpsActive ? 'GPS Enabled' : 'Enable GPS'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe the incident..."
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-full px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--theme-accent)]/50"
        />

        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="shrink-0 p-2.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] disabled:bg-slate-800 text-[var(--theme-btn-text)] disabled:text-slate-600 rounded-full transition-colors cursor-pointer disabled:opacity-40"
          aria-label="Submit report"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};