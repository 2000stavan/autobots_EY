import React from 'react';

interface WaveformProps {
  active?: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ active = false }) => {
  return (
    <div className="h-6 flex items-center gap-[3px]">
      {[2, 4, 6, 3, 5, 2, 4, 1, 1].map((height, i) => (
        <div
          key={i}
          className={`w-[3px] bg-primary rounded-full transition-all duration-300 ${active ? 'animate-pulse' : ''}`}
          style={{
            height: active ? `${height * 4}px` : '4px',
            opacity: active ? (i > 6 ? 0.4 : 1) : 0.3,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
};