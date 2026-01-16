
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FatigueHeatmap: React.FC = () => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
  const areas = ['Cognitive', 'Reaction', 'Stability', 'Focus'];

  const data = useMemo(() => {
    return areas.map((_, areaIdx) => {
      return hours.map((hour, hourIdx) => {
        const base = (hourIdx / hours.length) * 0.4;
        const peak = (hour >= 11 && hour <= 14) ? 0.2 : 0;
        const noise = Math.random() * 0.15;
        return Math.min(1, base + peak + noise);
      });
    });
  }, []);

  const getHeatColor = (val: number) => {
    if (val < 0.2) return 'bg-emerald-500/5 border-emerald-500/10';
    if (val < 0.4) return 'bg-emerald-500/20 border-emerald-500/20';
    if (val < 0.6) return 'bg-amber-500/30 border-amber-500/20';
    if (val < 0.8) return 'bg-rose-500/40 border-rose-500/20';
    return 'bg-rose-500/70 border-rose-500/30';
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex text-[8px] text-zinc-600 mb-2 ml-16 font-black uppercase tracking-widest">
        {hours.map(h => (
          <span key={h} className="flex-1 text-center">{h}H</span>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        {areas.map((area, i) => (
          <div key={area} className="flex items-center gap-3">
            <span className="w-12 text-[9px] text-zinc-500 font-black uppercase tracking-tighter truncate leading-none">
              {area}
            </span>
            <div className="flex-1 flex gap-0.5 h-6">
              {data[i].map((val, hIdx) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: hIdx * 0.03 + i * 0.05 }}
                  key={hIdx} 
                  title={`${area} Fatigue: ${Math.round(val * 100)}%`}
                  className={`flex-1 rounded-[2px] border transition-all duration-700 ${getHeatColor(val)}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-zinc-900 pt-4">
        <div className="flex flex-col">
          <span className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-0.5">Fatigue Forecast</span>
          <span className="text-[11px] text-emerald-400 font-bold uppercase">Optimal Operation</span>
        </div>
        <div className="flex items-center gap-2 text-[8px] text-zinc-600 font-black uppercase tracking-widest">
          <span>Fresh</span>
          <div className="flex gap-0.5">
             {[0.1, 0.3, 0.5, 0.7, 0.9].map((v, i) => (
               <div key={i} className={`w-2 h-2 rounded-full ${getHeatColor(v)}`}></div>
             ))}
          </div>
          <span>Strain</span>
        </div>
      </div>
    </div>
  );
};

export default FatigueHeatmap;
