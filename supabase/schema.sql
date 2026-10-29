-- ==============================================================================
-- 7 GAMER — Esquema do Banco de Dados PostgreSQL / Supabase
-- ==============================================================================
-- Este script cria as tabelas 'communities', 'site_settings', 'admin_users',
-- com índices, validações (URL, status, plataformas), funções de segurança e RLS.
-- ==============================================================================

-- 1. Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Comunidades Gamer
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

    -- Validação rigorosa de URLs HTTP/HTTPS para evitar URLs perigosas ou esquemas não autorizados
    CONSTRAINT chk_discord_url CHECK (discord_url IS NULL OR discord_url ~* '^https?://'),
    CONSTRAINT chk_whatsapp_url CHECK (whatsapp_url IS NULL OR whatsapp_url ~* '^https?://'),
    CONSTRAINT chk_external_url CHECK (external_url IS NULL OR external_url ~* '^https?://'),
    CONSTRAINT chk_image_url CHECK (image_url ~* '^https?://')
);

-- Índices para alta performance de consulta no catálogo
CREATE INDEX IF NOT EXISTS idx_communities_status ON public.communities(status);
CREATE INDEX IF NOT EXISTS idx_communities_featured ON public.communities(is_featured) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_communities_platform ON public.communities(platform);
CREATE INDEX IF NOT EXISTS idx_communities_category ON public.communities(category);
CREATE INDEX IF NOT EXISTS idx_communities_game ON public.communities(game_name);
CREATE INDEX IF NOT EXISTS idx_communities_created_at ON public.communities(created_at DESC);

-- 3. Tabela de Configurações Gerais do Portal
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT '7 GAMER',
    site_tagline TEXT NOT NULL DEFAULT 'SUA PRÓXIMA PARTIDA COMEÇA AQUI',
    site_description TEXT NOT NULL DEFAULT 'Portal de divulgação de servidores e comunidades gamer legítimas.',
    discord_main_url TEXT NOT NULL DEFAULT 'https://discord.gg/7gamer',
    whatsapp_main_url TEXT DEFAULT 'https://chat.whatsapp.com/7gamer-oficial',
    contact_email TEXT DEFAULT 'contato@7gamer.com.br',
    footer_text TEXT DEFAULT 'O 7 GAMER é uma plataforma independente dedicada a conectar jogadores e comunidades legítimas. Respeitamos os direitos dos desenvolvedores e não apoiamos pirataria, cheats ou cópias não autorizadas.',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tabela de Administradores Autorizados
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_communities_updated_at
BEFORE UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 5. Função de Verificação Segura de Administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.admin_users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Políticas de Segurança em Nível de Linha (RLS)
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para 'communities':
-- Qualquer visitante pode ler comunidades publicadas
CREATE POLICY "Visitantes podem ler comunidades publicadas"
ON public.communities
FOR SELECT
USING (status = 'published');

-- Administradores autenticados e autorizados podem ler todas (inclusive rascunhos)
CREATE POLICY "Admins podem visualizar todas as comunidades"
ON public.communities
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Somente administradores autorizados podem inserir novas comunidades
CREATE POLICY "Admins podem inserir comunidades"
ON public.communities
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Somente administradores autorizados podem atualizar comunidades
CREATE POLICY "Admins podem atualizar comunidades"
ON public.communities
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Somente administradores autorizados podem deletar comunidades
CREATE POLICY "Admins podem excluir comunidades"
ON public.communities
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Políticas para 'site_settings':
-- Todos podem ler configurações públicas do portal
CREATE POLICY "Todos podem ler configurações do site"
ON public.site_settings
FOR SELECT
USING (true);

-- Apenas admins podem alterar as configurações
CREATE POLICY "Apenas admins podem alterar configuracoes"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Políticas para 'admin_users':
-- Apenas admins podem ler lista de administradores
CREATE POLICY "Admins podem ler administradores"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin());

-- ==============================================================================
-- DADOS INICIAIS DEMONSTRATIVOS (EXEMPLOS LEGÍTIMOS IDENTIFICADOS)
-- ==============================================================================

INSERT INTO public.site_settings (site_name, site_tagline, site_description, discord_main_url, whatsapp_main_url, contact_email, footer_text)
VALUES (
    '7 GAMER',
    'SUA PRÓXIMA PARTIDA COMEÇA AQUI',
    'O portal definitivo para encontrar comunidades ativas, servidores dedicados e clãs competitivos em jogos licenciados e gratuitos.',
    'https://discord.gg/7gamer',
    'https://chat.whatsapp.com/7gamer-oficial',
    'contato@7gamer.com.br',
    'O 7 GAMER é uma plataforma independente dedicada a conectar jogadores e comunidades legítimas. Respeitamos os direitos dos desenvolvedores e não apoiamos pirataria, cheats ou modificações não autorizadas.'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.communities (name, slug, description, game_name, platform, category, image_url, discord_url, whatsapp_url, external_url, is_featured, status, is_demo)
VALUES 
(
    'Metrópole Roleplay (FiveM)',
    'metropole-roleplay-fivem',
    'Servidor brasileiro focado em RP realista, economia balanceada, corporações policiais ativas e comunidade acolhedora. Sistema anti-cheat avançado e whitelist aberta.',
    'GTA V (FiveM)',
    'PC',
    'Roleplay',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    'https://discord.gg/metropole-rp',
    'https://chat.whatsapp.com/metropole-avisos',
    'https://fivem.net',
    true,
    'published',
    true
),
(
    'CS2 Brasil Competitivo Hub',
    'cs2-brasil-competitivo-hub',
    'Comunidade voltada para treinos de Counter-Strike 2, mix diários, campeonatos amadores e formação de equipes para Gamers Club e Faceit.',
    'Counter-Strike 2',
    'PC',
    'Competitiva',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    'https://discord.gg/cs2-brasil-hub',
    'https://chat.whatsapp.com/cs2-mixes',
    'https://store.steampowered.com/app/730/CounterStrike_2/',
    true,
    'published',
    true
),
(
    'Aetheria Survival Vanilla',
    'aetheria-survival-vanilla',
    'Servidor Minecraft Survival sem pay-to-win, proteção de terrenos amigável, economia voltada aos jogadores e eventos comunitários semanais.',
    'Minecraft Java & Bedrock',
    'Multiplataforma',
    'Survival',
    'https://images.unsplash.com/photo-1627856014754-2907e2355324?auto=format&fit=crop&w=1200&q=80',
    'https://discord.gg/aetheria-mc',
    NULL,
    'https://www.minecraft.net',
    true,
    'published',
    true
),
(
    'Valorant Scrims & Ranked BR',
    'valorant-scrims-ranked-br',
    'Encontre duo, trio ou time completo para subir de elo. Organização de scrims diárias por elo (Ouro a Imortal) e torneios amadores.',
    'Valorant',
    'PC',
    'Competitiva',
    'https://images.unsplash.com/photo-1548484352-ea579e5233a8?auto=format&fit=crop&w=1200&q=80',
    'https://discord.gg/valorant-br-scrims',
    'https://chat.whatsapp.com/valorant-scrims-br',
    'https://playvalorant.com',
    false,
    'published',
    true
),
(
    'Zona Tóxica Zero - Rust Brasil',
    'zona-toxica-zero-rust-brasil',
    'Servidor Rust 2x com moderação ativa 24/7 contra cheaters. Limite de clã 4 players, wipe quinzenal, proteção para iniciantes e kits equilibrados.',
    'Rust',
    'PC',
    'Survival',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    'https://discord.gg/rust-brasil-ztz',
    NULL,
    'https://rust.facepunch.com',
    false,
    'published',
    true
)
ON CONFLICT (slug) DO NOTHING;
