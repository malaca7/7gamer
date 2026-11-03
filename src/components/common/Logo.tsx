import React from 'react';
import logoImg from '../../assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = false }) => {
  const sizeClasses = {
    sm: {
      img: 'h-9 sm:h-10',
      sub: 'text-[9px]',
    },
    md: {
      img: 'h-12 sm:h-14',
      sub: 'text-[10px]',
    },
    lg: {
      img: 'h-16 sm:h-20',
      sub: 'text-xs',
    },
    xl: {
      img: 'h-24 sm:h-32',
      sub: 'text-sm',
    },
  }[size];

  return (
    <div className="inline-flex items-center gap-3 select-none group cursor-pointer">
      {/* Official 7 GAMER Logo Image */}
      <div className="relative flex items-center justify-center">
        <img
          src={logoImg}
          alt="7 GAMER"
          className={`${sizeClasses.img} w-auto object-contain drop-shadow-[0_0_12px_rgba(255,30,66,0.35)] group-hover:drop-shadow-[0_0_22px_rgba(255,30,66,0.65)] transition-all duration-300 transform group-hover:scale-105`}
        />
      </div>

      {/* Optional Subtitle Badge */}
      {showSubtitle && (
        <div className="hidden sm:flex flex-col leading-tight border-l border-gamer-dark-700/80 pl-3">
          <div className="flex items-center gap-1.5">
            <span className="font-orbitron font-bold tracking-wider text-white text-xs group-hover:text-gamer-red-400 transition-colors">
              7 GAMER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gamer-red-500 animate-pulse shadow-glow-red-sm" />
          </div>
          <span className={`font-rajdhani font-semibold tracking-widest text-slate-400 uppercase ${sizeClasses.sub}`}>
            PORTAL & SERVIDORES
          </span>
        </div>
      )}
    </div>
  );
};
