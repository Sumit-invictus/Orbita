
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { BiometricData } from '../types';

// Helper to generate a simulated ECG path segment
// P-wave, QRS complex, T-wave approximation
const generateECGPath = (baseBPM: number) => {
  const points = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    let val = 0;
    const progress = i / steps;
    if (progress > 0.1 && progress < 0.2) val = 0.1; // P-wave
    else if (progress > 0.35 && progress < 0.4) val = -0.2; // Q
    else if (progress >= 0.4 && progress <= 0.45) val = 1.0; // R
    else if (progress > 0.45 && progress < 0.5) val = -0.3; // S
    else if (progress > 0.7 && progress < 0.85) val = 0.2; // T
    
    // Scale and add some jitter based on BPM
    points.push(val * (baseBPM / 60));
  }
  return points;
};

const BiometricCharts: React.FC<{ data: BiometricData[] }> = ({ data }) => {
  const HISTORICAL_MEAN = 74;

  // We'll create a "High-Resolution" version of the data for the ECG look
  // by interpolating between the BPM points with ECG-like spikes.
  const ecgData = useMemo(() => {
    if (data.length < 2) return [];
    
    // To make it look "sleek", we only show the last 15-20 data points 
    // but expanded to look like a continuous trace.
    const recentData = data.slice(-20);
    return recentData.map((d, i) => ({
      ...d,
      // We use the raw value but we'll style the line to be very sharp
      displayVal: d.heartRate,
    }));
  }, [data]);

  return (
    <div className="w-full h-full flex flex-col font-mono">
      <div className="flex-1 relative group">
        {/* Tactical Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="w-full h-full" style={{ 
            backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ecgData}>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(2, 6, 23, 0.9)', 
                border: '1px solid rgba(34, 211, 238, 0.3)', 
                borderRadius: '8px', 
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ fontSize: '9px', color: '#22d3ee', fontWeight: 'bold', textTransform: 'uppercase' }}
              labelStyle={{ display: 'none' }}
            />
            
            <ReferenceLine 
              y={HISTORICAL_MEAN} 
              stroke="rgba(148, 163, 184, 0.2)" 
              strokeDasharray="3 3" 
            />

            {/* Main ECG Trace: Thin, glowing, and sharp */}
            <Line 
              type="stepAfter" 
              dataKey="heartRate" 
              stroke="#22d3ee" 
              strokeWidth={1.5} 
              dot={false}
              isAnimationActive={false}
              style={{ filter: 'drop-shadow(0 0 5px rgba(34, 211, 238, 0.8))' }}
            />
            
            {/* Secondary Ghost Trace for depth */}
            <Line 
              type="monotone" 
              dataKey="heartRate" 
              stroke="rgba(34, 211, 238, 0.1)" 
              strokeWidth={4} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* ECG Scanning Indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-orb-accent animate-ping"></div>
          <span className="text-[9px] font-black text-orb-accent tracking-[0.3em] uppercase">ECG_LINK: ACTIVE</span>
        </div>
      </div>
      
      <div className="h-20 mt-6 relative glass bg-white/[0.02] rounded-xl overflow-hidden">
        <div className="absolute top-2 left-4 text-[7px] font-bold text-orb-muted/40 tracking-widest uppercase z-10">Stress_Variance_Field</div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="glowStress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="basis" dataKey="stress" 
              stroke="#22d3ee" strokeWidth={1}
              fill="url(#glowStress)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-white/5">
        <LegendItem label="REALTIME_BPM" value={data[data.length-1]?.heartRate} sub="Live_Input" />
        <LegendItem label="BASELINE_REF" value={HISTORICAL_MEAN} sub="Sess_Average" />
        <LegendItem label="DELTA_INDEX" value={`${((data[data.length-1]?.heartRate || 0) - HISTORICAL_MEAN).toFixed(1)}`} sub="Var_Offset" />
      </div>
    </div>
  );
};

const LegendItem = ({ label, value, sub }: { label: string, value: any, sub: string }) => (
  <div className="flex flex-col">
    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-orb-muted mb-1 opacity-50">{label}</span>
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-bold text-white tracking-tighter">{value ?? '--'}</span>
      <span className="text-[7px] font-bold text-orb-accent/60 uppercase tracking-widest">{sub}</span>
    </div>
  </div>
);

export default BiometricCharts;
