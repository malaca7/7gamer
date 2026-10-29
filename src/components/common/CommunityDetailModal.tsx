import React, { useState } from 'react';
import type { Community } from '../../types';
import { 
  X, 
  ExternalLink, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  Share2, 
  Check, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

interface CommunityDetailModalProps {
  community: Community | null;
  onClose: () => void;
}

export const CommunityDetailModal: React.FC<CommunityDetailModalProps> = ({ community, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!community) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/#comunidade/${community.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="bg-gamer-dark-900 border border-gamer-dark-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Game Tag & Close */}
        <div className="relative h-60 w-full overflow-hidden bg-gamer-dark-950">
          <img
            src={community.image_url}
            alt={community.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gamer-dark-900 via-gamer-dark-900/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-gamer-red-600 text-white transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Game Tag & Category Badge */}
          <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-gamer-red-600 text-white text-xs font-bold font-orbitron uppercase tracking-wider shadow-glow-red-sm">
              {community.game_name}
            </span>
            <span className="px-3 py-1 rounded-md bg-gamer-dark-800/90 border border-gamer-dark-600 text-slate-200 text-xs font-semibold">
              {community.category}
            </span>
            <span className="px-3 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-semibold">
              {community.platform}
            </span>
            {community.is_demo && (
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Exemplo demonstrativo
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title & Verified Badge */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-white font-orbitron tracking-wide">
                  {community.name}
                </h2>
                <span title="Comunidade verificada">
                  <CheckCircle2 className="w-5 h-5 text-gamer-red-400 shrink-0" />
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Cadastrado em {new Date(community.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gamer-dark-700 bg-gamer-dark-800 hover:bg-gamer-dark-700 text-slate-300 text-xs font-medium transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Link Copiado!' : 'Compartilhar'}
            </button>
          </div>

          {/* Description */}
          <div className="bg-gamer-dark-850 p-4 rounded-xl border border-gamer-dark-800">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 font-rajdhani">
              Sobre a Comunidade / Servidor
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {community.description}
            </p>
          </div>

          {/* Legitimacy Notice */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gamer-red-500/10 border border-gamer-red-500/20 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-gamer-red-400 shrink-0" />
            <div>
              <span className="font-semibold text-white">Comunidade Autorizada & Legítima:</span>
              <p className="text-slate-400 mt-0.5">
                O 7 GAMER apoia os desenvolvedores e servidores legítimos. Este espaço é 100% livre de pirataria e cheats.
              </p>
            </div>
          </div>

          {/* External Access Buttons */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 font-rajdhani">
              Acesso e Conexão
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Discord Button */}
              {community.discord_url ? (
                <a
                  href={community.discord_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold text-sm transition-all shadow-lg hover:shadow-[#5865F2]/30"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Entrar no Discord</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gamer-dark-850 border border-gamer-dark-800 text-slate-500 text-xs italic">
                  Discord não cadastrado
                </div>
              )}

              {/* WhatsApp Button */}
              {community.whatsapp_url ? (
                <a
                  href={community.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm transition-all shadow-lg hover:shadow-[#25D366]/30"
                >
                  <Phone className="w-4 h-4" />
                  <span>Grupo no WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gamer-dark-850 border border-gamer-dark-800 text-slate-500 text-xs italic">
                  WhatsApp não cadastrado
                </div>
              )}
            </div>

            {/* Official Website or Game Page */}
            {community.external_url && (
              <a
                href={community.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gamer-dark-800 hover:bg-gamer-dark-700 text-slate-200 border border-gamer-dark-700 hover:border-slate-500 text-xs font-medium transition-all"
              >
                <ExternalLink className="w-4 h-4 text-gamer-red-400" />
                <span>Acessar Site Oficial do Servidor / Jogo</span>
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gamer-dark-850 border-t border-gamer-dark-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gamer-dark-750 hover:bg-gamer-dark-700 text-slate-300 hover:text-white text-sm font-semibold transition-all border border-gamer-dark-600"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
