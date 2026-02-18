import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  return (
    <div className="relative w-full max-w-4xl aspect-[2/1] flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(13,127,242,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* Main Car Body Wireframe */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        <img 
          alt="Vehicle Digital Twin" 
          className="w-4/5 h-auto object-contain opacity-90 drop-shadow-[0_0_30px_rgba(13,127,242,0.1)]" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt22S56OHQGnCKZ_iqxD-JEa9_MKALXSEm2ee3JpLNyENGNlCGKAvVdXP4wKp7wNjAdLQbOiBXIUWcSWGy4ZxAzjXwrY9fJxCSXa7UFQZ7gb8tP25yWt9V5nhHTMfCacm8ySTF3anbIdbqN8BZe-GVdBKEwQie_hOvjVjNyARyvB0vlzfCZFd25j0y6Psp4J3NS9N-u_I9Nzbi8_mGEUmUgi0xiJqKZum-dt9l-1-f7EZKZi88OHF0JiQQaqL_pr9z4J_kSHDmPnwp"
        />

        {/* Engine Alert Pulse Area */}
        {/* Positioning is manual to match the image approximately */}
        <div className="absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-1/2">
           <div className="relative flex items-center justify-center">
             <div className="absolute size-32 bg-red-500/10 rounded-full animate-pulse-slow border border-red-500/30 blur-sm" />
             <div className="absolute size-24 bg-red-500/10 rounded-full animate-pulse border border-red-500/40" />
             <div className="size-16 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-500/50">
               <AlertTriangle className="text-red-500 w-8 h-8 opacity-90" />
             </div>
           </div>
        </div>

        {/* Component Pointer: Chassis */}
        <div className="absolute top-[28%] left-[45%] flex flex-col items-center group cursor-pointer">
          <div className="glass-panel px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase border-primary/40 text-white/80 group-hover:text-white group-hover:border-primary transition-colors">
            Chassis OK
          </div>
          <div className="w-[1px] h-12 bg-gradient-to-t from-primary/80 to-transparent mt-1"></div>
          <div className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(13,127,242,0.8)]"></div>
        </div>

        {/* Component Pointer: Tire */}
        {/* Adjusted to appear connected to the rear tire */}
        <div className="absolute top-[35%] right-[25%] flex flex-col items-start group">
            <div className="glass-panel px-4 py-3 rounded-lg border-l-2 border-primary backdrop-blur-md shadow-2xl transition-transform hover:scale-105">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Tire Status</p>
                <p className="text-sm font-bold text-white">Good - 85% Tread</p>
            </div>
            <div className="w-[1px] h-16 bg-gradient-to-b from-primary/60 to-transparent ml-6 relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1 bg-primary rounded-full"></div>
            </div>
        </div>
      </div>
    </div>
  );
};