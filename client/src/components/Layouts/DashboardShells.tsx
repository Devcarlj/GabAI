import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Terminal, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User,
  ShieldCheck
} from 'lucide-react';

interface SidebarLinkProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 group ${
      active 
        ? 'bg-white text-black font-bold' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
    }`}
  >
    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-black' : 'text-zinc-400 group-hover:text-[#D0FD1B]'}`} />
    <span>{label}</span>
  </button>
);

export const DashboardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('incidents'); // Demo tracking state

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col md:flex-row selection:bg-[#D0FD1B] selection:text-black">
      
      {/* 1. Mobile Header Frame */}
      <header className="md:hidden w-full bg-[#18181B] border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#D0FD1B]" />
          <span className="font-bold tracking-wider uppercase text-sm">Command Center</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1 text-zinc-400 hover:text-white focus:outline-none"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* 2. Desktop Sidebar / Mobile Drawer Layout */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#18181B] border-r border-zinc-800 p-6 flex flex-col z-40 
        transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header Brand Identity */}
        <div className="hidden md:flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 bg-black border border-zinc-800 rounded-lg flex items-center justify-center">
            <Terminal className="w-4 h-4 text-[#D0FD1B]" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest uppercase text-white">Command Hub</h1>
            <p className="text-[9px] text-zinc-500 font-mono tracking-wider mt-0.5"> triage_net_v2.0 </p>
          </div>
        </div>

        {/* Dynamic Nav Node Matrix Links based on Roles */}
        <nav className="space-y-1.5 flex-1">
          <div className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase px-4 mb-2">Operations</div>
          
          <SidebarLink 
            label="Incident Triage" 
            icon={ShieldAlert} 
            active={activeTab === 'incidents'} 
            onClick={() => setActiveTab('incidents')} 
          />
          
          {/* Admin and Superadmin Core Panels Access Area */}
          {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
            <>
              <div className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase px-4 pt-6 mb-2">Management</div>
              <SidebarLink 
                label="Control Matrix" 
                icon={ShieldCheck} 
                active={activeTab === 'matrix'} 
                onClick={() => setActiveTab('matrix')} 
              />
            </>
          )}

          {/* Exclusive Super Admin Command Configurations */}
          {user?.role === 'SUPERADMIN' && (
            <SidebarLink 
              label="System Settings" 
              icon={Settings} 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          )}
        </nav>

        {/* Persistent User Account Operations Profile Segment */}
        <div className="border-t border-zinc-800/80 pt-4 mt-auto flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-9 h-9 rounded-xl object-cover border border-zinc-700" />
            ) : (
              <div className="w-9 h-9 bg-black border border-zinc-800 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-[#D0FD1B] font-mono tracking-wide mt-0.5 uppercase">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Node</span>
          </button>
        </div>
      </aside>

      {/* 3. Central Application Space View Window */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile background backdrop screen shield overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" 
        />
      )}
    </div>
  );
};