
import React from 'react';
import { motion } from 'framer-motion';

const RiskGauge: React.FC<{ value: number }> = ({ value }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div className="flex items-center justify-center py-4 w-full h-full relative">
      {/* Background HUD Decor */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-full h-full border-[0.5px] border-dashed border-orb-muted rounded-full scale-110"></div>
        <div className="absolute w-[120%] h-[1px] bg-orb-muted/50 -rotate-45"></div>
        <div className="absolute w-[120%] h-[1px] bg-orb-muted/50 rotate-45"></div>
      </div>

      <div className="relative w-48 h-48 z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
          <motion.circle 
            cx="50" cy="50" r={radius} fill="none" stroke={value > 70 ? "#F87171" : "#10b981"} strokeWidth="5" 
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ type: "spring", stiffness: 20 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black tracking-tighter text-orb-bright drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            {Math.round(value)}%
          </motion.span>
          <span className="text-[8px] font-black uppercase tracking-widest text-orb-muted mt-1">Integrity</span>
        </div>

        {/* Dense HUD Details around the gauge */}
        <div className="absolute -top-4 -left-4 text-left">
           <p className="text-[7px] font-black text-orb-accent/60 uppercase">System_Buffer</p>
           <p className="text-[8px] font-mono text-orb-muted">STABLE</p>
        </div>
        <div className="absolute -top-4 -right-4 text-right">
           <p className="text-[7px] font-black text-orb-muted uppercase">Latency</p>
           <p className="text-[8px] font-mono text-orb-accent">12.4ms</p>
        </div>
        <div className="absolute -bottom-4 -left-4 text-left">
           <p className="text-[7px] font-black text-orb-muted uppercase">Divergence</p>
           <p className="text-[8px] font-mono text-orb-bright">0.02%</p>
        </div>
        <div className="absolute -bottom-4 -right-4 text-right">
           <p className="text-[7px] font-black text-orb-accent/60 uppercase">Threshold</p>
           <p className="text-[8px] font-mono text-orb-muted">95%</p>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
