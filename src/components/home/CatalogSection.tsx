import React, { useState, useMemo } from 'react';
import type { Community } from '../../types';
import { CommunityCard } from './CommunityCard';
import { 
  Search, 
  Compass, 
  RefreshCw, 
  AlertCircle,
  Info,
  SlidersHorizontal
} from 'lucide-react';

interface CatalogSectionProps {
  communities: Community[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectCommunity: (community: Community) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  communities,
  loading,
  error,
  onRetry,
  onSelectCommunity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [sortBy, setSortBy] = useState<'recent' | 'featured' | 'name'>('recent');

  const platforms = ['Todas', 'PC', 'Console', 'Mobile', 'Multiplataforma'];
  const categories = ['Todas', 'Roleplay', 'Competitiva', 'Casual', 'Survival', 'MMORPG', 'Eventos'];

  // Filter and sort logic
  const filteredCommunities = useMemo(() => {
    return communities.filter((item) => {
      // Must be published
      if (item.status !== 'published') return false;

      // Search match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesGame = item.game_name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesGame && !matchesDesc && !matchesCat) return false;
      }

      // Platform filter
      if (selectedPlatform !== 'Todas' && item.platform !== selectedPlatform) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'Todas' && item.category !== selectedCategory) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.is_featured === b.is_featured) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.is_featured ? -1 : 1;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Recent
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [communities, searchTerm, selectedPlatform, selectedCategory, sortBy]);

  const hasActiveFilters = searchTerm !== '' || selectedPlatform !== 'Todas' || selectedCategory !== 'Todas';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPlatform('Todas');
    setSelectedCategory('Todas');
    setSortBy('recent');
  };

  const hasDemoData = communities.some((c) => c.is_demo);

  return (
    <section id="catalogo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gamer-red-500 text-xs font-bold font-orbitron tracking-widest uppercase mb-1">
          <Compass className="w-4 h-4" />
          <span>Exploração Ativa</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white font-orbitron tracking-tight">
          CATÁLOGO DE COMUNIDADES & SERVIDORES
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Filtre por jogo, plataforma ou estilo de jogo e conecte-se a servidores ativos de todo o Brasil.
        </p>

        {/* Demo data notice as required by specification */}
        {hasDemoData && (
          <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs leading-relaxed max-w-3xl">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Aviso de Transparência:</strong> Os servidores marcados com a etiqueta <span className="bg-amber-400/20 px-1 py-0.5 rounded font-mono text-amber-200">Exemplo demonstrativo</span> são amostras estruturadas para ilustrar as capacidades do portal. Novas comunidades oficiais podem ser cadastradas e gerenciadas pelo painel administrativo.
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-gamer-dark-900 border border-gamer-dark-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl space-y-4">
        {/* Search input + Sort row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por comunidade, jogo (FiveM, CS2, Minecraft...), estilo..."
              className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gamer-red-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Ordenar por:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gamer-dark-950 border border-gamer-dark-750 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-gamer-red-500 focus:outline-none"
            >
              <option value="recent">Mais Recentes</option>
              <option value="featured">Destaques Primeiro</option>
              <option value="name">Nome (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Platform Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gamer-dark-800">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1 font-rajdhani">
            Plataforma:
          </span>
          {platforms.map((plat) => {
            const isSelected = selectedPlatform === plat;
            return (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-gamer-red-600 text-white shadow-glow-red-sm'
                    : 'bg-gamer-dark-850 hover:bg-gamer-dark-800 text-slate-300 border border-gamer-dark-750'
                }`}
              >
                {plat}
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gamer-dark-800">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1 font-rajdhani">
            Categoria:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-200 text-black font-semibold'
                    : 'bg-gamer-dark-850 hover:bg-gamer-dark-800 text-slate-400 hover:text-slate-200 border border-gamer-dark-750'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-gamer-red-400 hover:text-gamer-red-300 font-medium underline py-1"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
        <span>
          Exibindo <strong>{filteredCommunities.length}</strong> de <strong>{communities.filter(c => c.status === 'published').length}</strong> comunidades disponíveis
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-gamer-dark-900 border border-gamer-dark-800 rounded-2xl h-80 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="h-40 bg-gamer-dark-800 rounded-xl" />
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-gamer-dark-800 rounded w-3/4" />
                <div className="h-3 bg-gamer-dark-800 rounded w-1/2" />
              </div>
              <div className="h-9 bg-gamer-dark-800 rounded-lg mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-gamer-dark-900 border border-gamer-red-500/30 rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 text-gamer-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-orbitron">
            Não foi possível carregar as comunidades
          </h3>
          <p className="text-sm text-slate-400">{error}</p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gamer-red-600 hover:bg-gamer-red-500 text-white font-semibold text-xs transition-all shadow-glow-red-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCommunities.length === 0 && (
        <div className="bg-gamer-dark-900/60 border border-gamer-dark-800 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="p-4 rounded-full bg-gamer-dark-800 w-16 h-16 mx-auto flex items-center justify-center text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white font-orbitron">
            Nenhuma comunidade encontrada
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Não encontramos nenhum servidor correspondente aos filtros selecionados. Tente buscar por outros termos ou redefinir a busca.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-gamer-dark-800 hover:bg-gamer-dark-700 text-slate-200 text-xs font-semibold border border-gamer-dark-700 transition-all"
          >
            Redefinir Filtros
          </button>
        </div>
      )}

      {/* Grid of Results */}
      {!loading && !error && filteredCommunities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onSelect={onSelectCommunity}
            />
          ))}
        </div>
      )}
    </section>
  );
};
