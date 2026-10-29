import React from 'react';
import type { Community } from '../../types';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface RecentCommunitiesSectionProps {
  communities: Community[];
  onSelectCommunity: (community: Community) => void;
}

export const RecentCommunitiesSection: React.FC<RecentCommunitiesSectionProps> = ({
  communities,
  onSelectCommunity,
}) => {
  // Sort by created_at desc and take 4
  const recent = [...communities]
    .filter((c) => c.status === 'published')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  if (recent.length === 0) return null;

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-gamer-red-500 text-xs font-bold font-orbitron tracking-widest uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Novidades na Plataforma</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron tracking-tight">
            RECÉM-ADICIONADAS
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recent.map((community) => (
          <div
            key={community.id}
            onClick={() => onSelectCommunity(community)}
            className="group p-4 rounded-xl bg-gamer-dark-900/80 border border-gamer-dark-800 hover:border-gamer-red-500/50 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-orbitron bg-gamer-dark-800 text-slate-300 uppercase">
                  {community.game_name}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(community.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-gamer-red-400 transition-colors line-clamp-1 font-orbitron">
                {community.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {community.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-gamer-dark-800 flex items-center justify-between text-xs text-slate-400 group-hover:text-gamer-red-400 transition-colors">
              <span className="text-[11px] font-medium">{community.platform} • {community.category}</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
