import React from 'react';
import { MessageSquare, Users, ShieldCheck, Trophy, ExternalLink } from 'lucide-react';

interface DiscordCtaSectionProps {
  discordUrl?: string;
}

export const DiscordCtaSection: React.FC<DiscordCtaSectionProps> = ({ discordUrl = 'https://discord.gg/7gamer' }) => {
  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101426] via-gamer-dark-900 to-[#180d12] border border-gamer-dark-700/80 p-8 sm:p-12 shadow-2xl">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5865F2]/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gamer-red-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#7983f5] text-xs font-bold uppercase tracking-wider font-rajdhani">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>CENTRAL DO JOGADOR NO DISCORD</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-orbitron text-white tracking-tight">
              FAÇA PARTE DA COMUNIDADE GERAL DO <span className="text-gamer-red-500">7 GAMER</span>
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Encontre companheiros de equipe em tempo real, receba avisos de campeonatos amadores, divulgue seu clã e participe de sorteios e salas de bate-papo com jogadores de todo o país.
            </p>

            {/* Benefit pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/40 p-2.5 rounded-xl border border-gamer-dark-800">
                <Users className="w-4 h-4 text-[#5865F2] shrink-0" />
                <span>Salas LFG (Procura-se Duo)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/40 p-2.5 rounded-xl border border-gamer-dark-800">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Torneios e Scrims</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/40 p-2.5 rounded-xl border border-gamer-dark-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Moderação Ativa 24h</span>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-black/50 border border-gamer-dark-800 backdrop-blur-md text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5865F2] to-gamer-red-500 flex items-center justify-center shadow-lg text-white">
              <MessageSquare className="w-8 h-8" />
            </div>

            <div>
              <div className="text-lg font-bold text-white font-orbitron">
                Servidor Oficial 7 GAMER
              </div>
              <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Membros online agora</span>
              </div>
            </div>

            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold font-orbitron text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-[#5865F2]/40"
            >
              <span>Entrar no Discord Oficial</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <p className="text-[11px] text-slate-500">
              Acesso gratuito e imediato. Respeite as diretrizes da comunidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
