import React from 'react';
import type { Community } from '../../types';
import { CommunityCard } from './CommunityCard';
import { Flame, Sparkles } from 'lucide-react';

interface FeaturedSectionProps {
  communities: Community[];
  onSelectCommunity: (community: Community) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ communities, onSelectCommunity }) => {
  const featured = communities.filter((c) => c.is_featured && c.status === 'published');

  if (featured.length === 0) return null;

  return (
    <section id="destaques" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-gamer-red-500 text-xs font-bold font-orbitron tracking-widest uppercase mb-1">
            <Flame className="w-4 h-4 fill-gamer-red-500" />
            <span>Seleção Oficial 7 GAMER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron tracking-tight">
            COMUNIDADES EM DESTAQUE
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Servidores e clãs com alto engajamento, moderação exemplar e excelente infraestrutura.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{featured.length} comunidades selecionadas</span>
        </div>
      </div>

      {/* Featured Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((community) => (
          <CommunityCard
            key={community.id}
            community={community}
            onSelect={onSelectCommunity}
          />
        ))}
      </div>
    </section>
  );
};
