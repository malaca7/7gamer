import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = false }) => {
  const sizeClasses = {
    sm: {
      box: 'w-7 h-7 text-sm',
      text: 'text-lg',
      sub: 'text-[9px]',
    },
    md: {
      box: 'w-9 h-9 text-base',
      text: 'text-2xl',
      sub: 'text-[10px]',
    },
    lg: {
      box: 'w-12 h-12 text-xl',
      text: 'text-3xl',
      sub: 'text-xs',
    },
    xl: {
      box: 'w-16 h-16 text-2xl',
      text: 'text-4xl',
      sub: 'text-sm',
    },
  }[size];

  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {/* Geometric 7 Badge */}
      <div className="relative flex items-center justify-center">
        <div className={`relative ${sizeClasses.box} bg-gradient-to-br from-gamer-red-500 via-gamer-red-600 to-black rounded-lg p-[1.5px] shadow-glow-red-sm group-hover:shadow-glow-red transition-all duration-300 transform group-hover:scale-105`}>
          <div className="w-full h-full bg-[#0a0c12] rounded-[7px] flex items-center justify-center overflow-hidden relative">
            {/* Background cyber lines */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gamer-red-500/20 to-transparent"></div>
            <span className="font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gamer-red-400 italic tracking-tighter">
              7
            </span>
          </div>
        </div>
        {/* Glow point */}
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-gamer-red-500 rounded-full animate-pulse shadow-glow-red-sm"></span>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`font-orbitron font-extrabold tracking-wider text-white ${sizeClasses.text} group-hover:text-gamer-red-400 transition-colors`}>
            7 GAMER
          </span>
          <span className="w-1.5 h-1.5 rounded-sm bg-gamer-red-500 inline-block mb-1"></span>
        </div>
        {showSubtitle && (
          <span className={`font-rajdhani font-semibold tracking-widest text-slate-400 uppercase ${sizeClasses.sub}`}>
            PORTAL & SERVIDORES
          </span>
        )}
      </div>
    </div>
  );
};
