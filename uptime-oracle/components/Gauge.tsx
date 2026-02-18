import React from 'react';
import { GaugeProps } from '../types';

export const Gauge: React.FC<GaugeProps> = ({ 
  value, 
  max, 
  label, 
  unit, 
  color = "#0d7ff2",
  formatValue
}) => {
  // SVG Configuration
  const radius = 60;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Progress calculation
  // We want the gauge to start at bottom center or similar, usually 270deg or full circle.
  // The provided design shows full circles starting from top (rotated -90deg)
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full glass-panel border-2 border-primary/20 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(13,127,242,0.15)]">
        <svg 
          height={radius * 2} 
          width={radius * 2} 
          className="absolute inset-0 w-full h-full -rotate-90 transform"
        >
          {/* Background Circle */}
          <circle
            stroke="currentColor"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-primary/20"
          />
          {/* Progress Circle */}
          <circle
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        
        {/* Center Text */}
        <div className="flex flex-col items-center z-10 mt-1">
          <span className="text-3xl font-bold leading-none tracking-tighter" style={{ color: value > max * 0.9 ? color : 'white' }}>
            {formatValue ? formatValue(value) : value}
          </span>
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest mt-1">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};