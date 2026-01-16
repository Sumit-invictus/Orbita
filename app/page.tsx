'use client';



import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Activity, ShieldAlert, Brain, Zap, Cpu } from 'lucide-react';
import BiometricCharts from './components/BiometricCharts';
import RiskGauge from './components/RiskGauge';
import BodyMap from './components/BodyMap';
import AssistantPanel from './components/AssistantPanel';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SensorView from './components/SensorView';
import DetailedVitals from './components/DetailedVitals';
import ProfileSelection from './components/ProfileSelection';
import { BiometricData, Profile } from './types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const App: React.FC = () => {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [biometrics, setBiometrics] = useState<BiometricData[]>([]);
  const [riskScore, setRiskScore] = useState(12);
  const [activeAlerts, setActiveAlerts] = useState<{ id: string; type: string; msg: string; severity: 'low' | 'med' | 'high' }[]>([]);
  const [cognitiveLoad, setCognitiveLoad] = useState(4.2);
  const [activeTab, setActiveTab] = useState<'analysis' | 'sensors' | 'vitals'>('analysis');
  const mainRef = useRef<HTMLDivElement>(null);

  // Global mouse tracking for Fluid Glass effect
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!mainRef.current) return;
      const x = e.clientX;
      const y = e.clientY;
      document.documentElement.style.setProperty('--mouse-x', `${x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    if (!currentProfile) return;

    const interval = setInterval(() => {
      const now = new Date();
      const hr = 72 + Math.floor(Math.random() * 8);
      const stress = 15 + Math.floor(Math.random() * 35);
      const fatigue = Math.min(100, 5 + (biometrics.length * 0.35));

      const newData: BiometricData = {
        time: now.toLocaleTimeString([], { hour12: false }),
        heartRate: hr, hrv: 60 + Math.floor(Math.random() * 10),
        respiration: 16 + Math.floor(Math.random() * 2), stress, fatigue
      };

      setBiometrics(prev => [...prev, newData].slice(-50));
      setRiskScore(prev => Number((prev * 0.92 + (newData.stress * 0.15 + newData.fatigue * 0.25 + (newData.heartRate - 60) * 0.1) * 0.1).toFixed(1)));
      setCognitiveLoad(prev => Number((prev * 0.97 + (Math.random() * 1.5 + 3.5) * 0.03).toFixed(1)));

      if (newData.heartRate > 85 && !activeAlerts.some(a => a.type === 'HR_SPIKE')) {
        addAlert('HR_SPIKE', 'Telemetry Warning', 'BPM divergence detected.', 'med');
      }
      if (newData.stress > 45 && !activeAlerts.some(a => a.type === 'STRESS_LVL')) {
        addAlert('STRESS_LVL', 'Vitals Anomaly', 'Cortisol baseline elevated.', 'low');
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [biometrics.length, activeAlerts, currentProfile]);

  const addAlert = (type: string, title: string, msg: string, severity: 'low' | 'med' | 'high') => {
    const id = Math.random().toString(36).substr(2, 9);
    setActiveAlerts(prev => [{ id, type, msg, severity }, ...prev].slice(0, 5));
    if (severity !== 'high') setTimeout(() => dismissAlert(id), 10000);
  };

  const dismissAlert = (id: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  const latest = biometrics[biometrics.length - 1];

  const renderContent = () => {
    switch(activeTab) {
      case 'sensors':
        return <SensorView />;
      case 'vitals':
        return <DetailedVitals biometrics={biometrics} />;
      case 'analysis':
      default:
        return (
          <>
            <motion.div variants={itemVariants} className="max-w-6xl text-center mx-auto mb-20">
              <span className="text-orb-accent font-bold text-[10px] tracking-[0.8em] uppercase mb-6 block opacity-80">
                  SECTOR STATUS: NOMINAL
              </span>
              <h1 className="text-7xl md:text-8xl font-bold tracking-widest-extra uppercase leading-tight text-white drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] mb-6">
                {currentProfile?.name.split(' ')[0]}
              </h1>
              <div className="w-24 h-[1px] bg-orb-accent mx-auto mb-8 shadow-[0_0_10px_#22d3ee]"></div>
              <p className="text-orb-muted text-[13px] font-medium uppercase tracking-[0.5em] max-w-3xl mx-auto opacity-60 leading-relaxed">
                Biometric link established with {currentProfile?.role}. <br/> Monitoring live tactical environment.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <StatCard label="BPM" value={latest?.heartRate} unit="pulse" icon={<Activity size={18}/>} animatePulse />
              <StatCard label="NEURAL" value={latest ? Math.max(0, 100 - latest.fatigue).toFixed(0) : '--'} unit="eff." icon={<Brain size={18}/>} />
              <StatCard label="OXYGEN" value={latest?.respiration ? 94 + (latest.respiration % 6) : '--'} unit="sat." icon={<Zap size={18}/>} />
              <StatCard label="STRESS" value={latest?.stress} unit="idx" icon={<ShieldAlert size={18}/>} />
              <StatCard label="COGNITIVE" value={cognitiveLoad} unit="load" icon={<Cpu size={18}/>} isAccent />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <motion.div variants={itemVariants} className="lg:col-span-8 space-y-10">
                <div className="glass liquid-glass rounded-[1.5rem] p-10 transition-all border border-white/10 hover:border-orb-accent/40 group relative overflow-hidden bg-black/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
                  <div className="caustic-layer"></div>
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-0 opacity-20"></div>
                  <div className="flex justify-between items-start mb-12 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="w-1.5 h-12 bg-orb-accent shadow-[0_0_15px_#22d3ee]"></div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-orb-accent opacity-70">Telemetry_Stream</span>
                        <h2 className="text-3xl font-bold tracking-tighter text-white">CORE_ANALYTICS</h2>
                      </div>
                    </div>
                  </div>
                  <div className="h-[420px] relative z-10 px-2">
                    <BiometricCharts data={biometrics} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="glass liquid-glass rounded-[2rem] p-12 flex flex-col items-center group relative overflow-hidden shadow-inner">
                    <div className="caustic-layer"></div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-orb-muted mb-10 self-start opacity-50 z-10">INTEGRITY Matrix</span>
                    <div className="relative z-10 w-full flex justify-center scale-100">
                      <RiskGauge value={riskScore} />
                    </div>
                  </div>
                  <div className="glass liquid-glass rounded-[2rem] p-12 relative overflow-hidden flex flex-col items-center group shadow-inner">
                    <div className="caustic-layer"></div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-orb-muted mb-8 self-start opacity-50 z-10">Scan RECON</span>
                    <div className="h-64 w-full relative z-10">
                      <BodyMap fatigue={latest?.fatigue ?? 0} stress={latest?.stress ?? 0} />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-4 h-full">
                <div className="glass liquid-glass rounded-[2rem] overflow-hidden h-full min-h-[750px] relative shadow-2xl">
                  <div className="caustic-layer"></div>
                  <AssistantPanel currentBiometrics={latest} />
                </div>
              </motion.div>
            </div>
          </>
        );
    }
  };

  if (!currentProfile) {
    return <ProfileSelection onSelect={setCurrentProfile} />;
  }

  return (
    <div ref={mainRef} className="relative flex h-screen bg-transparent text-orb-bright overflow-hidden font-sans selection:bg-orb-accent/20">
      <Sidebar activeTab={activeTab === 'analysis' ? 'analysis' : activeTab === 'vitals' ? 'vitals' : 'sensors'} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 z-10 bg-transparent relative">
        <Header 
          riskScore={riskScore} 
          activeAlerts={activeAlerts} 
          dismissAlert={dismissAlert} 
          activeTab={activeTab as any}
          setActiveTab={setActiveTab as any}
          currentProfile={currentProfile}
          onLogout={() => setCurrentProfile(null)}
        />
        
        <div className="divider-line w-full">
            <div className={`divider-active transition-all duration-500 ${activeTab === 'sensors' ? 'left-[30%]' : activeTab === 'vitals' ? 'left-[50%]' : 'left-[70%]'}`}></div>
        </div>

        <motion.div 
          key={activeTab}
          variants={containerVariants}
          initial="hidden" animate="visible"
          className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-12 scroll-smooth relative z-10"
        >
          {renderContent()}
        </motion.div>
      </main>

      <AnimatePresence>
        {riskScore > 94 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-orb-deep/98 backdrop-blur-[100px] flex items-center justify-center p-20"
          >
            <div className="text-center max-w-4xl relative">
              <h2 className="text-[8rem] font-bold uppercase tracking-tighter mb-8 text-white relative z-10">CRITICAL</h2>
              <button 
                onClick={() => setRiskScore(28)} 
                className="relative z-10 px-24 py-7 bg-red-600 text-white font-bold uppercase tracking-[0.4em] rounded-full hover:bg-red-500 transition-all shadow-[0_0_80px_rgba(220,38,38,0.5)] active:scale-95 text-lg"
              >
                INITIATE_RECOVERY
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{ 
  label: string; 
  value: number | string | undefined; 
  unit: string; 
  icon: React.ReactNode;
  isAccent?: boolean;
  animatePulse?: boolean;
}> = ({ label, value, unit, icon, isAccent, animatePulse }) => {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.015 }}
      className={`glass liquid-glass p-5 rounded-[1.5rem] transition-all group cursor-default relative overflow-hidden ${isAccent ? 'border-orb-accent/40 bg-orb-accent/[0.03]' : 'hover:border-white/10'}`}
    >
      <div className="caustic-layer"></div>
      <div className="flex items-center gap-3.5 mb-6 relative z-20">
        <div className={`p-3.5 rounded-[1rem] transition-all duration-700 ${animatePulse ? 'animate-pulse' : ''} ${isAccent ? 'bg-orb-accent/15 text-orb-accent' : 'bg-white/5 text-orb-muted group-hover:text-orb-accent'}`}>
          {icon}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-orb-muted group-hover:text-white transition-colors opacity-60 truncate">{label}</span>
      </div>
      <div className="flex items-baseline gap-2.5 relative z-20 overflow-hidden">
        <span className={`text-3xl md:text-[2.6rem] font-bold tracking-tight leading-none transition-colors ${isAccent ? 'text-orb-accent stat-value-glow-accent' : 'text-white stat-value-glow'}`}>{value ?? '--'}</span>
        <span className="text-[9px] font-medium text-orb-muted/30 uppercase tracking-[0.2em] font-mono truncate self-end mb-1">{unit}</span>
      </div>
    </motion.div>
  );
};

export default App;











