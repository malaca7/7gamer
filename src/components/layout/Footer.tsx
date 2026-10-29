import React from 'react';
import { Logo } from '../common/Logo';
import { ShieldCheck, MessageSquare, Phone, Mail, ArrowUpRight } from 'lucide-react';
import type { SiteSettings } from '../../types';

interface FooterProps {
  settings: SiteSettings;
  onOpenSqlModal: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC<FooterProps> = ({ settings, onOpenSqlModal }) => {

  return (
    <footer className="w-full bg-[#050608] border-t border-gamer-dark-800/80 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Red ambient glow in footer bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gamer-red-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gamer-dark-800/80">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" showSubtitle={true} />
            <p className="text-slate-400 text-sm leading-relaxed max-w-md pt-2">
              {settings.footer_text || settings.site_description}
            </p>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-gamer-dark-900 border border-gamer-dark-800 text-xs text-slate-300 max-w-md">
              <ShieldCheck className="w-5 h-5 text-gamer-red-500 shrink-0" />
              <span>
                <strong>Compromisso 7 GAMER:</strong> Divulgação exclusiva de jogos legítimos e servidores autorizados. Proibida a distribuição de pirataria, cracks ou hacks.
              </span>
            </div>
          </div>

          {/* Column 2: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-slate-300 font-rajdhani">
              Navegação do Portal
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-gamer-red-400 transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <a href="#destaques" className="hover:text-gamer-red-400 transition-colors">
                  Comunidades em Destaque
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-gamer-red-400 transition-colors">
                  Catálogo Completo
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenSqlModal}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 mt-2"
                >
                  <span>Esquema Supabase (SQL)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Redes & Canais Oficiais */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-slate-300 font-rajdhani">
              Canais Oficiais
            </h4>
            <div className="space-y-2.5">
              {settings.discord_main_url && (
                <a
                  href={settings.discord_main_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-[#5865F2] transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                  <span>Discord 7 GAMER Hub</span>
                </a>
              )}

              {settings.whatsapp_main_url && (
                <a
                  href={settings.whatsapp_main_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-[#25D366] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Oficial</span>
                </a>
              )}

              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{settings.contact_email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {CURRENT_YEAR} <strong>{settings.site_name}</strong>. Todos os direitos reservados. Marcas e jogos citados pertencem aos seus respectivos proprietários.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Desenvolvido para comunidades gamers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
