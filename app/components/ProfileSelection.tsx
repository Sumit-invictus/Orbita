
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, Fingerprint, Lock, ChevronRight, Orbit, Cpu, Zap, Activity } from 'lucide-react';
import { Profile } from '../types';

const PROFILES: Profile[] = [
  {
    id: 'p-01',
    name: 'COMMANDER VANCE',
    role: 'SQUADRON LEAD',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    clearance: 'Alpha',
    status: 'Online'
  },
  {
    id: 'p-02',
    name: 'PILOT JAX',
    role: 'RECONNAISSANCE',
    avatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=1978&auto=format&fit=crop',
    clearance: 'Beta',
    status: 'Online'
  },
  {
    id: 'p-03',
    name: 'ENG. NOA',
    role: 'SYSTEMS ARCHITECT',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
    clearance: 'Gamma',
    status: 'Deploying'
  }
];

interface ProfileSelectionProps {
  onSelect: (profile: Profile) => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({ onSelect }) => {
  const [hoveredProfile, setHoveredProfile] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  const handleSelect = (profile: Profile) => {
    setIsVerifying(profile.id);
    // Artificial verification delay for "tactical" feel
    setTimeout(() => {
      onSelect(profile);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-transparent">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orb-accent/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 mb-20"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <Orbit className="text-white animate-spin-slow" size={48} />
          <h1 className="text-6xl font-bold tracking-widest-extra text-white uppercase">ORBITA</h1>
        </div>
        <div className="w-24 h-[1px] bg-orb-accent mx-auto mb-6"></div>
        <p className="text-orb-muted text-[12px] font-black uppercase tracking-[0.6em] opacity-60">
          IDENTITY_VERIFICATION_REQUIRED
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full z-10">
        <AnimatePresence mode="wait">
          {isVerifying ? (
            <motion.div 
              key="verifying"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="col-span-1 md:col-span-3 flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-48 h-48 mb-10">
                <div className="absolute inset-0 rounded-full border-2 border-orb-accent/20 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-2 border-orb-accent flex items-center justify-center">
                  <Fingerprint size={64} className="text-orb-accent animate-pulse" />
                </div>
                {/* Scanning line animation */}
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-orb-accent shadow-[0_0_15px_#22d3ee] z-20"
                />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-2">VERIFYING BIOMETRICS</h2>
              <p className="text-orb-muted text-[10px] font-mono tracking-widest opacity-50 uppercase">Accessing secure channel: {PROFILES.find(p => p.id === isVerifying)?.name}</p>
            </motion.div>
          ) : (
            PROFILES.map((profile, idx) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                onMouseEnter={() => setHoveredProfile(profile.id)}
                onMouseLeave={() => setHoveredProfile(null)}
                onClick={() => handleSelect(profile)}
                className="glass liquid-glass rounded-[2.5rem] p-8 border border-white/5 hover:border-orb-accent/30 transition-all cursor-pointer group relative overflow-hidden bg-black/40"
              >
                <div className="caustic-layer"></div>
                
                {/* Profile Header */}
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden border border-white/10 group-hover:border-orb-accent/40 transition-colors">
                      <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-orb-deep border border-white/10 p-1.5 rounded-xl">
                      <ShieldCheck size={14} className="text-emerald-500" />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-black uppercase tracking-widest text-orb-muted opacity-40">Clearance</span>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${profile.clearance === 'Alpha' ? 'text-rose-500' : 'text-orb-accent'}`}>{profile.clearance}_LEVEL</p>
                  </div>
                </div>

                {/* Profile Body */}
                <div className="relative z-10 mb-8">
                  <h3 className="text-xl font-bold text-white mb-1 tracking-tight group-hover:text-orb-accent transition-colors">{profile.name}</h3>
                  <p className="text-[9px] font-black text-orb-muted/60 uppercase tracking-[0.3em]">{profile.role}</p>
                </div>

                {/* Quick Stats/HUD Detail */}
                <div className="grid grid-cols-3 gap-2 mb-10 relative z-10 border-t border-white/5 pt-6">
                   <div className="text-center">
                      <Activity size={12} className="mx-auto text-orb-muted/40 mb-1" />
                      <span className="text-[7px] font-mono text-orb-muted uppercase">Health</span>
                   </div>
                   <div className="text-center border-x border-white/5">
                      <Zap size={12} className="mx-auto text-orb-muted/40 mb-1" />
                      <span className="text-[7px] font-mono text-orb-muted uppercase">Energy</span>
                   </div>
                   <div className="text-center">
                      <Cpu size={12} className="mx-auto text-orb-muted/40 mb-1" />
                      <span className="text-[7px] font-mono text-orb-muted uppercase">Neural</span>
                   </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">{profile.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white group-hover:translate-x-2 transition-transform">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Login</span>
                    <ChevronRight size={18} className="text-orb-accent" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-20 z-10 flex gap-8 opacity-30 hover:opacity-100 transition-opacity">
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-orb-accent transition-colors">
          <Lock size={12} /> Encrypted Session
        </button>
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-orb-accent transition-colors">
          <User size={12} /> New Identity
        </button>
      </div>
    </div>
  );
};

export default ProfileSelection;
