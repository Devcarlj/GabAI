// src/pages/FeedPage.tsx
import React from 'react';
import { MobileNavBar } from '../components/MobileNavBar';

export const ProfilePage: React.FC = () => {


  return (
    <div className="flex flex-col h-dvh bg-[var(--theme-bg)] text-slate-100 pb-[88px] justify-between">
      {/* Top Header */}
      <header className="p-4 border-b border-slate-800 text-center font-mono text-xs font-bold text-[var(--theme-accent)]">
        GABAI // INCIDENT FEED
      </header>

      {/* Main Content - Text Indicator */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl max-w-xs w-full">
          <span className="text-3xl mb-2 block">📰</span>
          <h1 className="text-lg font-bold text-slate-100">Profile Page</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            STATUS: ROUTE ACTIVE
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <MobileNavBar/>
    </div>
  );
};