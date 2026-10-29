import React, { useState, useEffect } from 'react';
import type { Community, PlatformType, CategoryType, CommunityStatus } from '../../types';
import { generateSlug, isValidHttpUrl } from '../../services/communityService';
import { 
  X, 
  Save, 
  ExternalLink, 
  MessageSquare, 
  Phone, 
  Gamepad2, 
  AlertCircle 
} from 'lucide-react';

interface CommunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (communityData: Partial<Community> & { name: string; game_name: string; platform: any; category: any; description: string; image_url: string }) => Promise<void>;
  initialData?: Community | null;
}

export const CommunityFormModal: React.FC<CommunityFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [description, setDescription] = useState('');
  const [gameName, setGameName] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('PC');
  const [category, setCategory] = useState<CategoryType>('Roleplay');
  const [imageUrl, setImageUrl] = useState('');
  const [discordUrl, setDiscordUrl] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<CommunityStatus>('published');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
      setAutoSlug(false);
      setDescription(initialData.description);
      setGameName(initialData.game_name);
      setPlatform(initialData.platform);
      setCategory(initialData.category);
      setImageUrl(initialData.image_url);
      setDiscordUrl(initialData.discord_url || '');
      setWhatsappUrl(initialData.whatsapp_url || '');
      setExternalUrl(initialData.external_url || '');
      setIsFeatured(initialData.is_featured);
      setStatus(initialData.status);
    } else {
      setName('');
      setSlug('');
      setAutoSlug(true);
      setDescription('');
      setGameName('');
      setPlatform('PC');
      setCategory('Roleplay');
      setImageUrl('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80');
      setDiscordUrl('');
      setWhatsappUrl('');
      setExternalUrl('');
      setIsFeatured(false);
      setStatus('published');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('O nome da comunidade é obrigatório.');
      return;
    }
    if (!gameName.trim()) {
      setError('O nome do jogo é obrigatório.');
      return;
    }
    if (!description.trim()) {
      setError('A descrição é obrigatória.');
      return;
    }
    if (!imageUrl.trim() || !isValidHttpUrl(imageUrl)) {
      setError('A URL da imagem deve ser válida e começar com http:// ou https://');
      return;
    }
    if (discordUrl.trim() && !isValidHttpUrl(discordUrl)) {
      setError('O link do Discord deve ser uma URL válida (http:// ou https://)');
      return;
    }
    if (whatsappUrl.trim() && !isValidHttpUrl(whatsappUrl)) {
      setError('O link do WhatsApp deve ser uma URL válida (http:// ou https://)');
      return;
    }
    if (externalUrl.trim() && !isValidHttpUrl(externalUrl)) {
      setError('O link externo deve ser uma URL válida (http:// ou https://)');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        id: initialData?.id,
        name: name.trim(),
        slug: slug.trim() || generateSlug(name),
        description: description.trim(),
        game_name: gameName.trim(),
        platform,
        category,
        image_url: imageUrl.trim(),
        discord_url: discordUrl.trim() || null,
        whatsapp_url: whatsappUrl.trim() || null,
        external_url: externalUrl.trim() || null,
        is_featured: isFeatured,
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar comunidade.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="bg-gamer-dark-900 border border-gamer-dark-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-gamer-dark-850 border-b border-gamer-dark-750 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gamer-red-500/10 text-gamer-red-500 border border-gamer-red-500/20">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-orbitron">
                {initialData ? 'Editar Comunidade' : 'Cadastrar Nova Comunidade'}
              </h3>
              <p className="text-xs text-slate-400">
                Preencha os dados oficiais do servidor ou grupo de jogadores
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-gamer-red-500/15 border border-gamer-red-500/30 text-gamer-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Nome da Comunidade *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Metrópole Roleplay"
                className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Slug (URL Amigável) *
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[10px] text-gamer-red-400 hover:underline"
                >
                  {autoSlug ? 'Auto' : 'Manual'}
                </button>
              </div>
              <input
                type="text"
                required
                disabled={autoSlug}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="metropole-roleplay"
                className="w-full bg-gamer-dark-950 border border-gamer-dark-750 disabled:opacity-60 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-slate-300 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Game & Category & Platform */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Jogo Relacionado *
              </label>
              <input
                type="text"
                required
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Ex: GTA V, CS2, Minecraft"
                className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Plataforma *
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PlatformType)}
                className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              >
                <option value="PC">PC</option>
                <option value="Console">Console</option>
                <option value="Mobile">Mobile</option>
                <option value="Multiplataforma">Multiplataforma</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Categoria / Estilo *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              >
                <option value="Roleplay">Roleplay</option>
                <option value="Competitiva">Competitiva</option>
                <option value="Casual">Casual</option>
                <option value="Survival">Survival</option>
                <option value="MMORPG">MMORPG</option>
                <option value="Eventos">Eventos</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Descrição da Comunidade *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as características do servidor, regras gerais, diferenciais e modo de jogo..."
              className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none resize-none"
            />
          </div>

          {/* Image URL & Preview */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              URL da Imagem de Capa (HTTP/HTTPS) *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none font-mono text-xs"
              />
            </div>
            {isValidHttpUrl(imageUrl) && (
              <div className="relative h-28 rounded-xl overflow-hidden border border-gamer-dark-800 bg-black">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">
                  Prévia da imagem
                </span>
              </div>
            )}
          </div>

          {/* External Links Section */}
          <div className="p-4 rounded-xl bg-gamer-dark-950/70 border border-gamer-dark-800 space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-400 font-rajdhani tracking-wider">
              Links Externos Autorizados (Apenas HTTP / HTTPS)
            </h4>

            {/* Discord URL */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#5865F2]" />
                <span>Link do Discord (Opcional)</span>
              </label>
              <input
                type="url"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                placeholder="https://discord.gg/seuservidor"
                className="w-full bg-gamer-dark-900 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            {/* WhatsApp URL */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Link do WhatsApp (Opcional)</span>
              </label>
              <input
                type="url"
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                placeholder="https://chat.whatsapp.com/seugrupo"
                className="w-full bg-gamer-dark-900 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            {/* External / Official Page URL */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-gamer-red-400" />
                <span>Site Oficial / Página do Servidor (Opcional)</span>
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://seusiteoficial.com.br"
                className="w-full bg-gamer-dark-900 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Status & Featured Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gamer-dark-950/70 border border-gamer-dark-800">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-gamer-red-600 bg-gamer-dark-900 border-gamer-dark-700 rounded focus:ring-gamer-red-500"
              />
              <div>
                <div className="text-xs font-semibold text-white">Destacar na Página Inicial</div>
                <div className="text-[10px] text-slate-400">Exibição prioritária na seção de destaques</div>
              </div>
            </label>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-white">Status de Publicação</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CommunityStatus)}
                className="w-full bg-gamer-dark-900 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="published">Publicado (Visível no site)</option>
                <option value="draft">Rascunho (Oculto no site)</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gamer-dark-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gamer-dark-800 hover:bg-gamer-dark-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gamer-red-600 hover:bg-gamer-red-500 disabled:opacity-50 text-white font-orbitron font-bold text-xs tracking-wider uppercase transition-all shadow-glow-red-sm"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Salvando...' : 'Salvar Comunidade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
