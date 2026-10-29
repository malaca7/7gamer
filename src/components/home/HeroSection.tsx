import React from 'react';
import { 
  Compass, 
  MessageSquare, 
  ShieldCheck, 
  Users, 
  Gamepad2, 
  Flame, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { SiteSettings } from '../../types';

interface HeroSectionProps {
  settings: SiteSettings;
  onExploreClick: () => void;
  communityCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onExploreClick, communityCount }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gamer-red-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="cyber-grid absolute inset-0 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gamer-dark-900/90 border border-gamer-red-500/30 text-xs font-semibold text-gamer-red-400 shadow-glow-red-sm animate-in fade-in slide-in-from-top-2">
            <span className="w-2 h-2 rounded-full bg-gamer-red-500 animate-pulse" />
            <span className="font-rajdhani tracking-widest uppercase font-bold">PORTAL OFICIAL DE COMUNIDADES E SERVIDORES</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-orbitron tracking-tight text-white uppercase leading-[1.1]">
            SUA PRÓXIMA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gamer-red-400 to-gamer-red-600 drop-shadow-[0_0_25px_rgba(255,30,66,0.4)]">
              PARTIDA COMEÇA AQUI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {settings.site_description ||
              'Conecte-se a servidores autorizados, encontre grupos no Discord e WhatsApp e descubra comunidades legítimas para os melhores jogos de PC, Console e Mobile.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-gamer-red-600 to-gamer-red-500 hover:from-gamer-red-500 hover:to-gamer-red-600 text-white font-orbitron font-bold text-sm tracking-wider uppercase transition-all shadow-glow-red hover:shadow-glow-red-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar Comunidades</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {settings.discord_main_url && (
              <a
                href={settings.discord_main_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gamer-dark-850 hover:bg-[#5865F2] text-slate-200 hover:text-white border border-gamer-dark-700 hover:border-[#5865F2] font-semibold text-sm transition-all shadow-lg hover:shadow-[#5865F2]/25"
              >
                <MessageSquare className="w-4 h-4 text-[#5865F2] group-hover:text-white" />
                <span>Entrar no Discord 7 GAMER</span>
              </a>
            )}
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-gamer-dark-800/80 max-w-xl mx-auto">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Servidores Oficiais & Autorizados</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-gamer-red-500" />
              <span>Sem Pirataria ou Cheats</span>
            </div>
          </div>
        </div>

        {/* Highlight Stats Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-gamer-dark-900/60 border border-gamer-dark-800/80 backdrop-blur-md">
          <div className="flex items-center gap-3 p-3">
            <div className="p-2.5 rounded-xl bg-gamer-red-500/10 border border-gamer-red-500/20 text-gamer-red-400">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold font-orbitron text-white">
                {Math.max(communityCount, 8)}+
              </div>
              <div className="text-xs text-slate-400 font-medium">Comunidades Ativas</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold font-orbitron text-white">100%</div>
              <div className="text-xs text-slate-400 font-medium">Jogadores Reais</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold font-orbitron text-white">Multi</div>
              <div className="text-xs text-slate-400 font-medium">PC, Console e Mobile</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold font-orbitron text-white">Seguro</div>
              <div className="text-xs text-slate-400 font-medium">Comunidades Verificadas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
