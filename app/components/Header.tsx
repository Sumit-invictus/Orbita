
import React, { useState } from 'react';
import { Bell, Search, Shield, X, Info, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '../types';

interface HeaderProps {
  riskScore: number;
  activeAlerts: { id: string; type: string; msg: string; severity: 'low' | 'med' | 'high' }[];
  dismissAlert: (id: string) => void;
  activeTab: 'analysis' | 'sensors' | 'vitals';
  setActiveTab: (tab: 'analysis' | 'sensors' | 'vitals') => void;
  currentProfile: Profile | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ riskScore, activeAlerts, dismissAlert, activeTab, setActiveTab, currentProfile, onLogout }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="h-20 px-12 flex items-center justify-between bg-transparent relative z-20">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-white font-mono">ORBITA</span>
          <span className="w-1 h-1 rounded-full bg-orb-accent animate-pulse"></span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-12">
        <NavLink 
          label="SENSORS" 
          active={activeTab === 'sensors'} 
          onClick={() => setActiveTab('sensors')}
        />
        <NavLink 
          label="VITALS" 
          active={activeTab === 'vitals'} 
          onClick={() => setActiveTab('vitals')}
        />
        <NavLink 
          label="ANALYSIS" 
          active={activeTab === 'analysis'} 
          onClick={() => setActiveTab('analysis')}
        />
      </nav>

      <div className="flex items-center gap-8">
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="text-orb-muted hover:text-orb-bright transition-all relative p-2"
          >
            <Bell size={18} />
            {activeAlerts.length > 0 && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orb-accent rounded-full shadow-[0_0_8px_#22d3ee]"></span>}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 glass rounded-[1.5rem] border border-white/10 shadow-2xl p-6 z-50"
              >
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] text-orb-muted">Telemetry Alerts</h4>
                </div>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {activeAlerts.length === 0 ? (
                    <p className="text-[10px] text-center text-orb-muted py-8 font-bold uppercase tracking-widest">Nominal Status</p>
                  ) : (
                    activeAlerts.map(alert => (
                      <div key={alert.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] relative group">
                        <span className="text-[8px] font-bold uppercase text-orb-accent mb-1 block">{alert.type}</span>
                        <p className="text-[10px] font-bold text-white">{alert.msg}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl hover:bg-white/10 transition-all"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/20">
              <img src={currentProfile?.avatar} alt={currentProfile?.name} className="w-full h-full object-cover grayscale" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-[9px] font-bold text-white uppercase tracking-tighter leading-none">{currentProfile?.name}</p>
              <p className="text-[7px] font-black text-orb-muted uppercase tracking-widest mt-1 opacity-60">{currentProfile?.role}</p>
            </div>
            <ChevronDown size={14} className="text-orb-muted" />
          </button>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-48 glass rounded-[1.5rem] border border-white/10 shadow-2xl p-2 z-50 overflow-hidden"
              >
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 p-4 hover:bg-rose-500/10 text-orb-muted hover:text-rose-500 transition-all rounded-xl"
                >
                  <LogOut size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const NavLink: React.FC<{ label: string; active?: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-all relative pb-1 ${active ? 'text-white' : 'text-orb-muted hover:text-white'}`}
  >
    {label}
    {active && <motion.div layoutId="nav-active" className="absolute -bottom-1 left-0 w-full h-[2px] bg-orb-accent" />}
  </button>
);

export default Header;
