import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { 
  Menu, 
  X, 
  Compass, 
  Flame, 
  UserCog, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import type { AdminUser } from '../../services/authService';

interface NavbarProps {
  onOpenAdmin: () => void;
  currentAdmin: AdminUser | null;
  discordUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, currentAdmin, discordUrl = 'https://discord.gg/7gamer' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-gamer-dark-950/85 backdrop-blur-xl border-b border-gamer-dark-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo size="md" showSubtitle={true} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-slate-300 hover:text-gamer-red-400 transition-colors py-1"
          >
            Início
          </button>
          <button
            onClick={() => scrollToSection('destaques')}
            className="flex items-center gap-1.5 text-slate-300 hover:text-gamer-red-400 transition-colors py-1"
          >
            <Flame className="w-4 h-4 text-gamer-red-500" />
            <span>Destaques</span>
          </button>
          <button
            onClick={() => scrollToSection('catalogo')}
            className="flex items-center gap-1.5 text-slate-300 hover:text-gamer-red-400 transition-colors py-1"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>Catálogo</span>
          </button>
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#5865F2] hover:text-[#7983f5] transition-colors py-1 font-semibold"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discord Oficial</span>
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scrollToSection('catalogo')}
            className="px-4 py-2 rounded-xl bg-gamer-dark-800 hover:bg-gamer-dark-700 text-slate-200 border border-gamer-dark-700 hover:border-gamer-red-500/50 text-xs font-semibold tracking-wider font-rajdhani uppercase transition-all shadow-sm"
          >
            Explorar Comunidades
          </button>

          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              currentAdmin
                ? 'bg-gamer-red-600/20 text-gamer-red-400 border border-gamer-red-500/40 hover:bg-gamer-red-600/30 shadow-glow-red-sm'
                : 'bg-gamer-dark-900 hover:bg-gamer-dark-800 text-slate-300 border border-gamer-dark-700 hover:border-slate-500'
            }`}
          >
            <UserCog className="w-3.5 h-3.5 text-gamer-red-500" />
            <span>{currentAdmin ? 'Painel Ativo' : 'Painel Admin'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-lg bg-gamer-dark-850 border border-gamer-dark-700 text-gamer-red-400"
            title="Painel Admin"
          >
            <UserCog className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg bg-gamer-dark-850 border border-gamer-dark-700 text-slate-300 hover:text-white"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gamer-red-500" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gamer-dark-950 border-b border-gamer-dark-800 px-5 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-4">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-slate-200 hover:bg-gamer-dark-850 font-medium"
            >
              <span>Início</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => scrollToSection('destaques')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-slate-200 hover:bg-gamer-dark-850 font-medium"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-gamer-red-500" />
                <span>Comunidades em Destaque</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => scrollToSection('catalogo')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-slate-200 hover:bg-gamer-dark-850 font-medium"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Catálogo Completo</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-[#5865F2] hover:bg-gamer-dark-850 font-medium"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Discord Oficial do 7 GAMER</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5865F2]/50" />
            </a>
          </div>

          <div className="pt-2 border-t border-gamer-dark-800 flex flex-col gap-2">
            <button
              onClick={() => scrollToSection('catalogo')}
              className="w-full py-3 rounded-xl bg-gamer-red-600 text-white font-bold text-center font-orbitron tracking-wide shadow-glow-red-sm"
            >
              EXPLORAR COMUNIDADES
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-xl bg-gamer-dark-850 border border-gamer-dark-700 text-slate-300 font-medium text-xs text-center flex items-center justify-center gap-2"
            >
              <UserCog className="w-4 h-4 text-gamer-red-500" />
              <span>{currentAdmin ? 'Acessar Painel Administrativo' : 'Login Administrativo'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
