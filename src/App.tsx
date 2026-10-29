import React, { useState, useEffect, useCallback } from 'react';
import type { Community, SiteSettings } from './types';
import { communityService } from './services/communityService';
import { authService } from './services/authService';
import type { AdminUser } from './services/authService';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { FeaturedSection } from './components/home/FeaturedSection';
import { CatalogSection } from './components/home/CatalogSection';
import { RecentCommunitiesSection } from './components/home/RecentCommunitiesSection';
import { DiscordCtaSection } from './components/home/DiscordCtaSection';
import { CommunityDetailModal } from './components/common/CommunityDetailModal';
import { SqlSchemaModal } from './components/common/SqlSchemaModal';
import { ToastContainer } from './components/common/Toast';
import type { ToastMessage } from './components/common/Toast';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CommunityFormModal } from './components/admin/CommunityFormModal';

export const App: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    id: 'default',
    site_name: '7 GAMER',
    site_tagline: 'SUA PRÓXIMA PARTIDA COMEÇA AQUI',
    site_description: 'O portal definitivo para encontrar comunidades ativas, servidores dedicados e clãs competitivos em jogos licenciados e gratuitos.',
    discord_main_url: 'https://discord.gg/7gamer',
    whatsapp_main_url: 'https://chat.whatsapp.com/7gamer-oficial',
    contact_email: 'contato@7gamer.com.br',
    footer_text: 'O 7 GAMER é uma plataforma independente dedicada a conectar jogadores e comunidades legítimas. Respeitamos os direitos dos desenvolvedores e não apoiamos pirataria, cheats ou modificações não autorizadas.',
    updated_at: new Date().toISOString(),
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication State
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);

  // Community Details Modal
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  // Admin CRUD Modal
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    community: Community | null;
  }>({
    isOpen: false,
    community: null,
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Data fetching
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Check admin status
      const admin = await authService.getCurrentAdmin();
      setCurrentAdmin(admin);

      // Fetch communities (include drafts if admin)
      const commList = await communityService.getCommunities(!!admin);
      setCommunities(commList);

      // Fetch settings
      const siteSettings = await communityService.getSiteSettings();
      setSettings(siteSettings);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Falha ao carregar dados do portal.');
      showToast('error', 'Erro ao carregar dados', err.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    loadData();

    // Check hash for direct routing
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        authService.getCurrentAdmin().then((admin) => {
          if (admin) {
            setIsAdminView(true);
          } else {
            setIsLoginModalOpen(true);
          }
        });
      } else if (hash.startsWith('#comunidade/')) {
        const slug = hash.replace('#comunidade/', '');
        communityService.getCommunityBySlug(slug).then((comm) => {
          if (comm) setSelectedCommunity(comm);
        });
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [loadData]);

  // Admin login handler
  const handleOpenAdmin = () => {
    if (currentAdmin) {
      setIsAdminView(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    setIsAdminView(true);
    loadData();
    showToast('success', 'Autenticado com Sucesso', `Bem-vindo ao painel administrativo (${admin.email})`);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentAdmin(null);
    setIsAdminView(false);
    loadData();
    showToast('info', 'Sessão Encerrada', 'Você saiu do painel administrativo.');
  };

  // Community save handler
  const handleSaveCommunity = async (communityData: any) => {
    const saved = await communityService.saveCommunity(communityData);
    await loadData();
    showToast(
      'success',
      communityData.id ? 'Comunidade Atualizada' : 'Comunidade Criada',
      `"${saved.name}" foi salva com sucesso no catálogo.`
    );
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Conditionally Render Admin View or Public Portal */}
      {isAdminView && currentAdmin ? (
        <AdminDashboard
          admin={currentAdmin}
          communities={communities}
          settings={settings}
          onLogout={handleLogout}
          onRefreshData={loadData}
          onCloseAdmin={() => setIsAdminView(false)}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
          onOpenCreateModal={() => setFormModal({ isOpen: true, community: null })}
          onOpenEditModal={(c) => setFormModal({ isOpen: true, community: c })}
          onViewCommunity={(c) => setSelectedCommunity(c)}
          onShowToast={showToast}
        />
      ) : (
        <>
          {/* Public Navbar */}
          <Navbar
            onOpenAdmin={handleOpenAdmin}
            currentAdmin={currentAdmin}
            discordUrl={settings.discord_main_url}
          />

          {/* Hero Section */}
          <HeroSection
            settings={settings}
            onExploreClick={() => {
              const el = document.getElementById('catalogo');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            communityCount={communities.filter((c) => c.status === 'published').length}
          />

          {/* Featured Communities Section */}
          <FeaturedSection
            communities={communities}
            onSelectCommunity={(c) => setSelectedCommunity(c)}
          />

          {/* Complete Catalog Section */}
          <CatalogSection
            communities={communities}
            loading={loading}
            error={error}
            onRetry={loadData}
            onSelectCommunity={(c) => setSelectedCommunity(c)}
          />

          {/* Recent Communities Section */}
          <RecentCommunitiesSection
            communities={communities}
            onSelectCommunity={(c) => setSelectedCommunity(c)}
          />

          {/* Discord CTA Section */}
          <DiscordCtaSection discordUrl={settings.discord_main_url} />

          {/* Public Footer */}
          <Footer
            settings={settings}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
          />
        </>
      )}

      {/* Community Detail Modal */}
      <CommunityDetailModal
        community={selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenSqlModal={() => {
          setIsLoginModalOpen(false);
          setIsSqlModalOpen(true);
        }}
      />

      {/* Community Create & Edit Modal */}
      <CommunityFormModal
        isOpen={formModal.isOpen}
        initialData={formModal.community}
        onClose={() => setFormModal({ isOpen: false, community: null })}
        onSave={handleSaveCommunity}
      />

      {/* SQL Schema Modal */}
      <SqlSchemaModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
};

export default App;
