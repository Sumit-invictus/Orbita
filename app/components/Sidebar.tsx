
import React from 'react';
import { LayoutDashboard, Activity, Brain, Database, Settings, Orbit } from 'lucide-react';

interface SidebarProps {
  activeTab: 'analysis' | 'sensors' | 'vitals';
  setActiveTab: (tab: 'analysis' | 'sensors' | 'vitals') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-24 border-r border-white/5 bg-transparent flex flex-col items-center py-12 z-30 relative glass">
      <div className="mb-16">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer hover:rotate-12 transition-transform duration-700">
          <Orbit className="text-orb-deep" size={24} />
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-10 w-full px-3">
        <SidebarIcon 
          icon={<LayoutDashboard size={20}/>} 
          label="CORE" 
          active={activeTab === 'analysis'} 
          onClick={() => setActiveTab('analysis')}
        />
        <SidebarIcon 
          icon={<Activity size={20}/>} 
          label="VITAL" 
          active={activeTab === 'vitals'}
          onClick={() => setActiveTab('vitals')}
        />
        <SidebarIcon 
          icon={<Settings size={20}/>} 
          label="SENS" 
          active={activeTab === 'sensors'}
          onClick={() => setActiveTab('sensors')}
        />
        <SidebarIcon icon={<Brain size={20}/>} label="NEURO" />
      </nav>

      <div className="flex flex-col gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700 w-full px-3 mt-auto">
        <SidebarIcon icon={<Database size={18}/>} label="LOGS" />
      </div>
    </aside>
  );
};

const SidebarIcon: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex flex-col items-center py-2 rounded-xl transition-all duration-500 relative group
      ${active ? 'text-orb-bright' : 'text-orb-muted hover:text-orb-bright'}
    `}
  >
    <div className="transition-transform group-hover:scale-110 duration-500">{icon}</div>
    <span className="text-[7px] font-bold uppercase tracking-[0.4em] mt-3 opacity-40 group-hover:opacity-100 transition-opacity font-mono">{label}</span>
    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-orb-accent rounded-l-full shadow-[0_0_15px_#22d3ee]"></div>}
  </button>
);

export default Sidebar;
