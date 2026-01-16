'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { Activity, Brain, Zap, ShieldAlert, Cpu, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { BiometricData } from '../types';

interface DetailedVitalsProps {
  biometrics: BiometricData[];
}

const DetailedVitals: React.FC<DetailedVitalsProps> = ({ biometrics }) => {
  const latest = biometrics[biometrics.length - 1];

  const metrics = [
    {
      id: 'hr',
      name: 'Heart Rate',
      label: 'BPM',
      value: latest?.heartRate,
      unit: 'bpm',
      icon: <Activity size={20} className="text-orb-accent" />,
      color: '#22d3ee',
      trend: biometrics.slice(-5).reduce((acc, curr, i, arr) => {
        if (i === 0) return 0;
        return acc + (curr.heartRate - arr[i-1].heartRate);
      }, 0),
      dataKey: 'heartRate',
      desc: 'Electrical cardiac depolarization frequency.'
    },
    {
      id: 'hrv',
      name: 'HR Variability',
      label: 'HRV',
      value: latest?.hrv,
      unit: 'ms',
      icon: <PulseIcon size={20} className="text-emerald-400" />,
      color: '#10b981',
      trend: biometrics.slice(-5).reduce((acc, curr, i, arr) => {
        if (i === 0) return 0;
        return acc + (curr.hrv - arr[i-1].hrv);
      }, 0),
      dataKey: 'hrv',
      desc: 'R-R interval fluctuation coefficient.'
    },
    {
      id: 'stress',
      name: 'Stress Index',
      label: 'STR',
      value: latest?.stress,
      unit: 'idx',
      icon: <ShieldAlert size={20} className="text-rose-400" />,
      color: '#f43f5e',
      trend: biometrics.slice(-5).reduce((acc, curr, i, arr) => {
        if (i === 0) return 0;
        return acc + (curr.stress - arr[i-1].stress);
      }, 0),
      dataKey: 'stress',
      desc: 'Cortisol-linked autonomic arousal score.'
    },
    {
      id: 'oxy',
      name: 'Oxygen Sat.',
      label: 'SpO2',
      value: latest?.respiration ? (94 + (latest.respiration % 6)).toFixed(1) : '--',
      unit: '%',
      icon: <Zap size={20} className="text-blue-400" />,
      color: '#3b82f6',
      trend: 0,
      dataKey: 'respiration', // proxy
      desc: 'Arterial hemoglobin oxygen saturation.'
    },
    {
      id: 'neural',
      name: 'Neural Eff.',
      label: 'EFF',
      value: latest ? (100 - latest.fatigue).toFixed(0) : '--',
      unit: '%',
      icon: <Brain size={20} className="text-purple-400" />,
      color: '#a855f7',
      trend: -0.5,
      dataKey: 'fatigue',
      desc: 'Cognitive load vs stability ratio.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <span className="text-orb-accent font-black text-[10px] tracking-[0.8em] uppercase opacity-70">TELEMETRY_DEEP_SCAN</span>
        <h2 className="text-5xl font-bold tracking-tighter text-white uppercase">Vitals detailed view</h2>
        <div className="w-24 h-1 bg-orb-accent mx-auto opacity-30"></div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {metrics.map((m, idx) => (
          <motion.div 
            key={m.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass liquid-glass p-8 rounded-[2rem] border border-white/5 hover:border-orb-accent/20 transition-all group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="caustic-layer"></div>
            {/* Metric Identity */}
            <div className="lg:col-span-3 space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                  {m.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{m.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orb-muted/40">{m.label}_CHANNEL</p>
                </div>
              </div>
              <p className="text-[11px] text-orb-muted/60 leading-relaxed font-medium italic">
                {m.desc}
              </p>
            </div>

            {/* Live Stats */}
            <div className="lg:col-span-3 flex items-center justify-between border-x border-white/5 px-8 relative z-10">
              <div>
                <span className="text-5xl font-bold tracking-tighter text-white stat-value-glow">{m.value}</span>
                <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-orb-muted/40">{m.unit}</span>
              </div>
              <div className="flex flex-col items-end">
                <div className={`flex items-center gap-1 ${m.trend > 0 ? 'text-rose-400' : m.trend < 0 ? 'text-emerald-400' : 'text-orb-muted'}`}>
                  {m.trend > 0 ? <ArrowUpRight size={14}/> : m.trend < 0 ? <ArrowDownRight size={14}/> : <Minus size={14}/>}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{Math.abs(m.trend).toFixed(1)}</span>
                </div>
                <span className="text-[8px] font-black text-orb-muted/30 uppercase tracking-widest mt-1">L5_DELTA</span>
              </div>
            </div>

            {/* Sparkline Visual */}
            <div className="lg:col-span-6 h-32 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={biometrics}>
                  <defs>
                    <linearGradient id={`glow-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={m.color} stopOpacity={0.2}/>
                      <stop offset="100%" stopColor={m.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '10px', color: m.color }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={m.dataKey} 
                    stroke={m.color} 
                    strokeWidth={2} 
                    fill={`url(#glow-${m.id})`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="absolute top-0 right-0 p-2 bg-black/40 backdrop-blur rounded-md border border-white/5 pointer-events-none">
                 <span className="text-[8px] font-black text-orb-accent/60 uppercase tracking-widest">REALTIME_STREAM</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PulseIcon = Activity; // Alias for consistency

export default DetailedVitals;
