import React, { useState } from 'react';
import { X, Copy, Check, Database, ExternalLink, ShieldCheck } from 'lucide-react';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlContent = `-- Script SQL Supabase para 7 GAMER
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    game_name TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('PC', 'Console', 'Mobile', 'Multiplataforma')),
    category TEXT NOT NULL CHECK (category IN ('Roleplay', 'Competitiva', 'Casual', 'Survival', 'MMORPG', 'Eventos', 'Outros')),
    image_url TEXT NOT NULL,
    discord_url TEXT,
    whatsapp_url TEXT,
    external_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_discord_url CHECK (discord_url IS NULL OR discord_url ~* '^https?://'),
    CONSTRAINT chk_whatsapp_url CHECK (whatsapp_url IS NULL OR whatsapp_url ~* '^https?://'),
    CONSTRAINT chk_external_url CHECK (external_url IS NULL OR external_url ~* '^https?://'),
    CONSTRAINT chk_image_url CHECK (image_url ~* '^https?://')
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT '7 GAMER',
    site_tagline TEXT NOT NULL DEFAULT 'SUA PRÓXIMA PARTIDA COMEÇA AQUI',
    site_description TEXT NOT NULL,
    discord_main_url TEXT NOT NULL,
    whatsapp_main_url TEXT,
    contact_email TEXT,
    footer_text TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitantes podem ler comunidades publicadas"
ON public.communities FOR SELECT USING (status = 'published');

CREATE POLICY "Admins podem tudo em communities"
ON public.communities FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Publico pode ler config"
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admins alteram config"
ON public.site_settings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gamer-dark-900 border border-gamer-dark-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gamer-dark-700 bg-gamer-dark-850">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gamer-red-500/10 text-gamer-red-500 border border-gamer-red-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-orbitron">
                Estrutura do Banco de Dados (Supabase SQL)
              </h3>
              <p className="text-xs text-slate-400">
                Tabelas <code className="text-gamer-red-400">communities</code>, <code className="text-gamer-red-400">site_settings</code> e políticas RLS de segurança
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-gamer-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-5 border-b border-gamer-dark-800 bg-gamer-dark-950/60 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Como conectar ao seu projeto Supabase:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
            <li>Acesse seu projeto no <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-gamer-red-400 underline hover:text-gamer-red-300">Supabase Dashboard <ExternalLink className="w-3 h-3 inline" /></a>.</li>
            <li>Abra o menu <strong>SQL Editor</strong> e cole o código abaixo.</li>
            <li>Execute o script clicando em <strong>Run</strong>.</li>
            <li>Copie sua <strong>URL</strong> e <strong>Anon Key</strong> em <em>Project Settings → API</em> e insira no arquivo <code className="bg-black/50 px-1 py-0.5 rounded text-white">.env</code>.</li>
          </ol>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-[#07080c] font-mono text-xs text-slate-300 border-b border-gamer-dark-800">
          <pre className="whitespace-pre-wrap leading-relaxed select-all">
            {sqlContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gamer-dark-850 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Arquivo completo disponível em: <code className="text-gamer-red-400">supabase/schema.sql</code>
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gamer-red-600 hover:bg-gamer-red-500 text-white rounded-lg font-semibold text-sm transition-all shadow-glow-red-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado com Sucesso!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Script SQL
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
