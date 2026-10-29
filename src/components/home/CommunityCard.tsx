import React from 'react';
import type { Community } from '../../types';
import { 
  Flame, 
  ExternalLink, 
  MessageSquare, 
  Phone, 
  AlertTriangle, 
  ChevronRight,
  Monitor,
  Tv,
  Smartphone,
  Layers
} from 'lucide-react';

interface CommunityCardProps {
  community: Community;
  onSelect: (community: Community) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community, onSelect }) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'PC':
        return <Monitor className="w-3.5 h-3.5" />;
      case 'Console':
        return <Tv className="w-3.5 h-3.5" />;
      case 'Mobile':
        return <Smartphone className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div 
      className={`group relative bg-gamer-dark-900 border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-gamer-card ${
        community.is_featured 
          ? 'border-gamer-red-500/40 hover:border-gamer-red-500 hover:shadow-glow-red-sm' 
          : 'border-gamer-dark-800 hover:border-gamer-dark-600'
      }`}
    >
      {/* Featured Ribbon */}
      {community.is_featured && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gamer-red-600/95 text-white text-[11px] font-bold font-orbitron tracking-wider uppercase shadow-glow-red-sm">
          <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
          <span>Destaque</span>
        </div>
      )}

      {/* Demo indicator tag */}
      {community.is_demo && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 border border-amber-500/30 text-amber-300 text-[10px] font-medium backdrop-blur-sm">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>Exemplo demonstrativo</span>
        </div>
      )}

      {/* Image Banner */}
      <div 
        className="relative h-44 w-full overflow-hidden bg-gamer-dark-950 cursor-pointer"
        onClick={() => onSelect(community)}
      >
        <img
          src={community.image_url}
          alt={community.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gamer-dark-900 via-transparent to-black/30" />

        {/* Game Tag */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md bg-black/80 border border-gamer-dark-700 text-white text-xs font-bold font-orbitron tracking-wide backdrop-blur-sm">
            {community.game_name}
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-gamer-dark-850/90 text-slate-300 text-[11px] font-medium border border-gamer-dark-700">
            {getPlatformIcon(community.platform)}
            <span>{community.platform}</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category Pill */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-gamer-red-500/10 text-gamer-red-400 border border-gamer-red-500/20">
              {community.category}
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-[11px] text-slate-400">
              {new Date(community.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(community)}
            className="text-lg font-bold text-white group-hover:text-gamer-red-400 transition-colors cursor-pointer line-clamp-1 font-orbitron tracking-wide"
          >
            {community.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {community.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gamer-dark-800/80 space-y-2.5">
          {/* External contextual Discord & WhatsApp buttons */}
          <div className="grid grid-cols-2 gap-2">
            {community.discord_url ? (
              <a
                href={community.discord_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#5865F2]/15 hover:bg-[#5865F2] text-[#7983f5] hover:text-white border border-[#5865F2]/30 hover:border-[#5865F2] text-xs font-semibold transition-all"
                title="Entrar no Discord desta comunidade"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discord</span>
              </a>
            ) : (
              <span className="flex items-center justify-center py-2 px-3 rounded-lg bg-gamer-dark-850/60 text-slate-600 text-xs italic select-none">
                Sem Discord
              </span>
            )}

            {community.whatsapp_url ? (
              <a
                href={community.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#2fe073] hover:text-white border border-[#25D366]/30 hover:border-[#25D366] text-xs font-semibold transition-all"
                title="Entrar no Grupo WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            ) : (
              <span className="flex items-center justify-center py-2 px-3 rounded-lg bg-gamer-dark-850/60 text-slate-600 text-xs italic select-none">
                Sem WhatsApp
              </span>
            )}
          </div>

          {/* View Details / External Link */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(community)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gamer-dark-800 hover:bg-gamer-dark-700 text-slate-200 text-xs font-medium border border-gamer-dark-700 hover:border-slate-500 transition-all"
            >
              <span>Ver Detalhes</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {community.external_url && (
              <a
                href={community.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gamer-dark-800 hover:bg-gamer-dark-700 text-slate-400 hover:text-white border border-gamer-dark-700 transition-all"
                title="Acessar página oficial do servidor"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
