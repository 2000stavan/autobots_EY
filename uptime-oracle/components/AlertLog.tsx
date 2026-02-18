import React from 'react';
import { AlertCircle, Download } from 'lucide-react';
import { Alert } from '../types';

interface AlertLogProps {
  alerts: Alert[];
}

export const AlertLog: React.FC<AlertLogProps> = ({ alerts }) => {
  return (
    <aside className="w-80 glass-panel border-l border-white/5 p-6 flex flex-col gap-6 z-40 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Alert Log</h3>
        <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded font-bold border border-red-500/20">
          {alerts.filter(a => a.active).length} ACTIVE
        </span>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`
              glass-panel p-4 rounded-xl transition-all duration-300
              ${alert.severity === 'critical' ? 'border-l-4 border-l-red-500 bg-red-500/5' : 'opacity-60 border-l-4 border-l-transparent'}
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-mono font-bold ${alert.severity === 'critical' ? 'text-red-400' : 'text-white/60'}`}>
                {alert.code}
              </span>
              <span className="text-[10px] text-white/40">{alert.time}</span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-white/90">
              {alert.message}
            </p>
            
            {alert.active && (
              <div className="mt-4 flex gap-2">
                <button className="flex-1 text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 py-2 rounded transition-colors text-white/70">
                  Ignore
                </button>
                <button className="flex-1 text-[10px] font-bold uppercase tracking-wider bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded transition-colors border border-red-500/20">
                  Repair
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="mt-auto w-full py-4 glass-panel border border-white/10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white/80">
        <Download className="w-4 h-4" />
        Full Health Export
      </button>
    </aside>
  );
};