import React, { useState, useMemo } from 'react';
import type { Community, SiteSettings } from '../../types';
import type { AdminUser } from '../../services/authService';
import { communityService } from '../../services/communityService';
import { Logo } from '../common/Logo';
import { 
  Gamepad2, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Flame, 
  Eye, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  ExternalLink, 
  Database, 
  ArrowLeft,
  RotateCcw,
  Save
} from 'lucide-react';

interface AdminDashboardProps {
  admin: AdminUser;
  communities: Community[];
  settings: SiteSettings;
  onLogout: () => void;
  onRefreshData: () => Promise<void>;
  onCloseAdmin: () => void;
  onOpenSqlModal: () => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (community: Community) => void;
  onViewCommunity: (community: Community) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  communities,
  settings,
  onLogout,
  onRefreshData,
  onCloseAdmin,
  onOpenSqlModal,
  onOpenCreateModal,
  onOpenEditModal,
  onViewCommunity,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'communities' | 'settings'>('communities');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  
  // Settings Form State
  const [siteName, setSiteName] = useState(settings.site_name);
  const [siteTagline, setSiteTagline] = useState(settings.site_tagline);
  const [siteDesc, setSiteDesc] = useState(settings.site_description);
  const [discordMain, setDiscordMain] = useState(settings.discord_main_url);
  const [whatsappMain, setWhatsappMain] = useState(settings.whatsapp_main_url);
  const [contactEmail, setContactEmail] = useState(settings.contact_email);
  const [footerText, setFooterText] = useState(settings.footer_text);
  const [savingSettings, setSavingSettings] = useState(false);

  // Deletion confirmation state
  const [communityToDelete, setCommunityToDelete] = useState<Community | null>(null);

  const isSupabase = communityService.isSupabaseActive();

  // Metrics
  const stats = useMemo(() => {
    const total = communities.length;
    const published = communities.filter((c) => c.status === 'published').length;
    const drafts = communities.filter((c) => c.status === 'draft').length;
    const featured = communities.filter((c) => c.is_featured).length;
    return { total, published, drafts, featured };
  }, [communities]);

  // Filtered communities list
  const filteredList = useMemo(() => {
    return communities.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (platformFilter !== 'all' && c.platform !== platformFilter) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          c.name.toLowerCase().includes(query) ||
          c.game_name.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [communities, searchTerm, statusFilter, platformFilter]);

  // Toggle Featured handler
  const handleToggleFeatured = async (c: Community) => {
    try {
      const nextFeatured = await communityService.toggleFeatured(c.id, c.is_featured);
      await onRefreshData();
      onShowToast(
        'success',
        nextFeatured ? 'Comunidade Destacada' : 'Destaque Removido',
        `"${c.name}" foi ${nextFeatured ? 'adicionada aos' : 'removida dos'} destaques.`
      );
    } catch (err: any) {
      onShowToast('error', 'Falha ao alterar destaque', err.message);
    }
  };

  // Toggle Status handler
  const handleToggleStatus = async (c: Community) => {
    try {
      const nextStatus = await communityService.toggleStatus(c.id, c.status);
      await onRefreshData();
      onShowToast(
        'success',
        nextStatus === 'published' ? 'Comunidade Publicada' : 'Comunidade Ocultada (Rascunho)',
        `Status de "${c.name}" alterado para ${nextStatus}.`
      );
    } catch (err: any) {
      onShowToast('error', 'Falha ao alterar status', err.message);
    }
  };

  // Delete handler
  const confirmDelete = async () => {
    if (!communityToDelete) return;
    try {
      await communityService.deleteCommunity(communityToDelete.id);
      await onRefreshData();
      onShowToast('success', 'Comunidade Excluída', `"${communityToDelete.name}" foi removida com sucesso.`);
      setCommunityToDelete(null);
    } catch (err: any) {
      onShowToast('error', 'Falha ao excluir comunidade', err.message);
    }
  };

  // Save Settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await communityService.updateSiteSettings({
        site_name: siteName,
        site_tagline: siteTagline,
        site_description: siteDesc,
        discord_main_url: discordMain,
        whatsapp_main_url: whatsappMain,
        contact_email: contactEmail,
        footer_text: footerText,
      });
      await onRefreshData();
      onShowToast('success', 'Configurações Atualizadas', 'As definições do portal foram salvas.');
    } catch (err: any) {
      onShowToast('error', 'Erro ao salvar configurações', err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // Reset Demo Data
  const handleResetDemo = async () => {
    if (window.confirm('Deseja restaurar as comunidades e configurações demonstrativas padrão?')) {
      communityService.resetDemoData();
      await onRefreshData();
      onShowToast('info', 'Dados Restaurados', 'As comunidades demonstrativas originais foram restauradas.');
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-gamer-dark-900 border-b border-gamer-dark-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div onClick={onCloseAdmin} className="cursor-pointer">
            <Logo size="sm" />
          </div>
          <span className="hidden sm:inline-block h-5 w-[1px] bg-gamer-dark-750" />
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold font-orbitron bg-gamer-red-600/20 text-gamer-red-400 border border-gamer-red-500/30">
              PAINEL ADMINISTRATIVO
            </span>
            <span className="text-xs text-slate-400 hidden md:inline font-mono">
              ({admin.email})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCloseAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gamer-dark-800 hover:bg-gamer-dark-750 text-slate-300 text-xs font-medium border border-gamer-dark-700 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gamer-red-500" />
            <span className="hidden sm:inline">Ver Site Público</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gamer-red-600/10 hover:bg-gamer-red-600/20 text-gamer-red-400 text-xs font-semibold border border-gamer-red-500/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Supabase Status Alert */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isSupabase
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isSupabase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold font-orbitron">
                {isSupabase ? 'Supabase Conectado em Tempo Real' : 'Modo Demonstrativo com Armazenamento Local Ativo'}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSupabase
                  ? 'Todas as alterações são sincronizadas nas tabelas communities e site_settings com RLS.'
                  : 'Para ativar o banco remoto Supabase, adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSqlModal}
              className="px-3.5 py-1.5 rounded-xl bg-gamer-dark-850 hover:bg-gamer-dark-800 text-slate-200 border border-gamer-dark-700 text-xs font-semibold font-mono transition-all flex items-center gap-1.5"
            >
              <span>Ver Script SQL</span>
              <ExternalLink className="w-3.5 h-3.5 text-gamer-red-400" />
            </button>
            {!isSupabase && (
              <button
                onClick={handleResetDemo}
                className="px-3.5 py-1.5 rounded-xl bg-gamer-dark-850 hover:bg-gamer-dark-800 text-slate-300 text-xs font-semibold border border-gamer-dark-700 transition-all flex items-center gap-1.5"
                title="Restaurar dados iniciais de demonstração"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resetar Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gamer-dark-900 border border-gamer-dark-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-rajdhani">
              Total de Comunidades
            </div>
            <div className="text-3xl font-black font-orbitron text-white mt-1">
              {stats.total}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Cadastradas no sistema</div>
          </div>

          <div className="p-5 rounded-2xl bg-gamer-dark-900 border border-gamer-dark-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-rajdhani">
              Publicadas no Site
            </div>
            <div className="text-3xl font-black font-orbitron text-emerald-400 mt-1">
              {stats.published}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Visíveis para todos</div>
          </div>

          <div className="p-5 rounded-2xl bg-gamer-dark-900 border border-gamer-dark-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-rajdhani">
              Rascunhos Ocultos
            </div>
            <div className="text-3xl font-black font-orbitron text-amber-400 mt-1">
              {stats.drafts}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Em revisão interna</div>
          </div>

          <div className="p-5 rounded-2xl bg-gamer-dark-900 border border-gamer-dark-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-gamer-red-400 font-rajdhani">
              Em Destaque
            </div>
            <div className="text-3xl font-black font-orbitron text-gamer-red-500 mt-1">
              {stats.featured}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Seção especial na home</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gamer-dark-800 gap-4">
          <button
            onClick={() => setActiveTab('communities')}
            className={`flex items-center gap-2 pb-3 px-2 font-bold font-orbitron text-xs tracking-wider uppercase transition-all ${
              activeTab === 'communities'
                ? 'text-gamer-red-500 border-b-2 border-gamer-red-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Gerenciar Comunidades ({communities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 pb-3 px-2 font-bold font-orbitron text-xs tracking-wider uppercase transition-all ${
              activeTab === 'settings'
                ? 'text-gamer-red-500 border-b-2 border-gamer-red-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações Gerais</span>
          </button>
        </div>

        {/* Tab 1: Communities CRUD */}
        {activeTab === 'communities' && (
          <div className="space-y-6">
            {/* Action Bar (Search, Filters, New Community Button) */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome, jogo ou categoria..."
                    className="w-full bg-gamer-dark-900 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-gamer-dark-900 border border-gamer-dark-750 text-slate-300 text-xs rounded-xl px-3 py-2 focus:border-gamer-red-500 focus:outline-none"
                >
                  <option value="all">Todos os Status</option>
                  <option value="published">Apenas Publicados</option>
                  <option value="draft">Apenas Rascunhos</option>
                </select>

                {/* Platform Filter */}
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="bg-gamer-dark-900 border border-gamer-dark-750 text-slate-300 text-xs rounded-xl px-3 py-2 focus:border-gamer-red-500 focus:outline-none"
                >
                  <option value="all">Todas as Plataformas</option>
                  <option value="PC">PC</option>
                  <option value="Console">Console</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Multiplataforma">Multiplataforma</option>
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={onOpenCreateModal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gamer-red-600 hover:bg-gamer-red-500 text-white font-bold font-orbitron text-xs tracking-wider uppercase transition-all shadow-glow-red-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Comunidade</span>
              </button>
            </div>

            {/* Communities Table */}
            <div className="bg-gamer-dark-900 border border-gamer-dark-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gamer-dark-950 text-slate-400 uppercase font-rajdhani font-bold border-b border-gamer-dark-800 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Comunidade</th>
                      <th className="py-3.5 px-4">Jogo</th>
                      <th className="py-3.5 px-4">Plataforma / Estilo</th>
                      <th className="py-3.5 px-4 text-center">Destaque</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gamer-dark-800/80">
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          Nenhuma comunidade encontrada com os critérios selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((comm) => (
                        <tr key={comm.id} className="hover:bg-gamer-dark-850/60 transition-colors">
                          {/* Name + Thumb */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={comm.image_url}
                                alt={comm.name}
                                className="w-10 h-10 rounded-lg object-cover bg-black shrink-0 border border-gamer-dark-700"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
                                }}
                              />
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5 font-orbitron">
                                  <span>{comm.name}</span>
                                  {comm.is_demo && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono">
                                      demo
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">
                                  /{comm.slug}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Game */}
                          <td className="py-3.5 px-4 font-semibold text-slate-200">
                            {comm.game_name}
                          </td>

                          {/* Platform & Category */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="text-slate-300 font-medium">{comm.platform}</span>
                              <span className="text-slate-500 text-[11px]">{comm.category}</span>
                            </div>
                          </td>

                          {/* Featured toggle */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleToggleFeatured(comm)}
                              className={`p-1.5 rounded-lg transition-all ${
                                comm.is_featured
                                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                  : 'text-slate-600 hover:text-slate-400'
                              }`}
                              title={comm.is_featured ? 'Remover destaque' : 'Destacar comunidade'}
                            >
                              <Flame className="w-4 h-4 fill-current" />
                            </button>
                          </td>

                          {/* Status toggle */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleToggleStatus(comm)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                                comm.status === 'published'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                              }`}
                              title="Clique para alternar entre publicado e rascunho"
                            >
                              {comm.status === 'published' ? 'Publicado' : 'Rascunho'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onViewCommunity(comm)}
                                className="p-1.5 rounded-lg bg-gamer-dark-800 hover:bg-gamer-dark-750 text-slate-300 hover:text-white transition-all"
                                title="Visualizar Detalhes"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onOpenEditModal(comm)}
                                className="p-1.5 rounded-lg bg-gamer-dark-800 hover:bg-gamer-dark-750 text-slate-300 hover:text-gamer-red-400 transition-all"
                                title="Editar Comunidade"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setCommunityToDelete(comm)}
                                className="p-1.5 rounded-lg bg-gamer-dark-800 hover:bg-gamer-red-600/20 text-slate-400 hover:text-gamer-red-400 transition-all"
                                title="Excluir Comunidade"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Site Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-gamer-dark-900 border border-gamer-dark-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-3xl">
            <div className="border-b border-gamer-dark-800 pb-4">
              <h3 className="text-lg font-bold font-orbitron text-white">
                Configurações Gerais do Portal 7 GAMER
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ajuste os links principais, dados de contato e informações institucionais do site.
              </p>
            </div>

            {/* Site Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nome do Portal</label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Tagline de Impacto</label>
                <input
                  type="text"
                  required
                  value={siteTagline}
                  onChange={(e) => setSiteTagline(e.target.value)}
                  className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Descrição do Portal (Hero e SEO)</label>
              <textarea
                rows={3}
                required
                value={siteDesc}
                onChange={(e) => setSiteDesc(e.target.value)}
                className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none resize-none"
              />
            </div>

            {/* Links principais Discord & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gamer-dark-950 border border-gamer-dark-800">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Link Principal do Discord (Hub 7 GAMER)</label>
                <input
                  type="url"
                  required
                  value={discordMain}
                  onChange={(e) => setDiscordMain(e.target.value)}
                  placeholder="https://discord.gg/7gamer"
                  className="w-full bg-gamer-dark-900 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Link Principal do WhatsApp (Comunidade)</label>
                <input
                  type="url"
                  value={whatsappMain}
                  onChange={(e) => setWhatsappMain(e.target.value)}
                  placeholder="https://chat.whatsapp.com/7gamer-oficial"
                  className="w-full bg-gamer-dark-900 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Contact Email & Footer Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">E-mail de Contato Oficial</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Texto Institucional / Legal do Rodapé</label>
              <textarea
                rows={2}
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gamer-red-600 hover:bg-gamer-red-500 disabled:opacity-50 text-white font-bold font-orbitron text-xs tracking-wider uppercase transition-all shadow-glow-red-sm"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {communityToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gamer-dark-900 border border-gamer-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-gamer-red-500">
              <div className="p-2.5 rounded-xl bg-gamer-red-500/10 border border-gamer-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-orbitron">
                Confirmar Exclusão
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tem certeza que deseja excluir a comunidade <strong className="text-white">"{communityToDelete.name}"</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setCommunityToDelete(null)}
                className="px-4 py-2 rounded-xl bg-gamer-dark-800 hover:bg-gamer-dark-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-gamer-red-600 hover:bg-gamer-red-500 text-white font-bold font-orbitron text-xs tracking-wider uppercase shadow-glow-red-sm"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
