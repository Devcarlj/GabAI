import React from 'react';

interface NavbarHeaderProps {
  onToggleDrawer?: () => void;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({ onToggleDrawer }) => {
  return (
    <header className="flex justify-between items-center mb-0 lg:mb-3 shrink-0 px-3 lg:px-1 py-2 lg:py-0">
      <div className="flex items-center gap-2">
        {onToggleDrawer && (
          <button
            onClick={onToggleDrawer}
            className="lg:hidden p-1.5 -ml-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="w-5 h-5 rounded-full bg-linear-to-tr from-blue-600 to-red-500 flex items-center justify-center text-[9px] font-bold text-white shadow-md">🇵🇭</div>
        <h1 className="text-xs font-bold tracking-wider text-slate-200">
          GABAI <span className="text-slate-500 font-normal text-[11px] hidden sm:inline">(DICT eGov Plugin)</span>
        </h1>
      </div>
      <div className="hidden sm:flex items-center gap-2 bg-[#0d1527] px-2.5 py-1 rounded-lg border border-slate-900 text-[11px]">
        <span className="text-slate-300 font-semibold">LGU Valenzuela</span>
        <span className="text-slate-500 text-[10px]">| Admin</span>
      </div>
    </header>
  );
};
