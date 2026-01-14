
import React from 'react';

const Logo: React.FC<{ className?: string; color?: string; animated?: boolean }> = ({ 
  className = "h-12", 
  color = "black",
  animated = false
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-full aspect-square">
        <svg viewBox="0 0 100 100" className={`h-full w-full ${animated ? 'animate-pulse' : ''}`}>
          {/* Base do Martelo */}
          <rect x="20" y="30" width="60" height="30" rx="8" fill={color === "black" ? "#000" : color} />
          {/* Detalhe Superior */}
          <rect x="25" y="25" width="50" height="10" rx="4" fill="#FACC15" />
          {/* Cabo */}
          <rect x="42" y="55" width="16" height="40" rx="4" fill={color === "black" ? "#000" : color} />
          {/* Brilho de Impacto */}
          <circle cx="80" cy="20" r="5" fill="#FACC15" className={animated ? 'animate-ping' : ''} />
        </svg>
      </div>
      <span className="font-black italic text-2xl sm:text-3xl tracking-tighter uppercase leading-none" style={{ color }}>
        MARTELINHO
      </span>
    </div>
  );
};

export default Logo;
