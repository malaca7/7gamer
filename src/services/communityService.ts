import type { Community, SiteSettings, CommunityStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_COMMUNITIES, INITIAL_SITE_SETTINGS } from '../data/mockCommunities';

const STORAGE_KEY_COMMUNITIES = '7gamer_communities_v1';
const STORAGE_KEY_SETTINGS = '7gamer_site_settings_v1';

// Slugify helper
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    .substring(0, 80);
}

// URL Validation helper
export function isValidHttpUrl(stringUrl?: string | null): boolean {
  if (!stringUrl || stringUrl.trim() === '') return false;
  try {
    const url = new URL(stringUrl.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Helper to initialize local storage
function getLocalCommunities(): Community[] {
  const data = localStorage.getItem(STORAGE_KEY_COMMUNITIES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_COMMUNITIES, JSON.stringify(INITIAL_COMMUNITIES));
    return INITIAL_COMMUNITIES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_COMMUNITIES;
  }
}

function saveLocalCommunities(items: Community[]) {
  localStorage.setItem(STORAGE_KEY_COMMUNITIES, JSON.stringify(items));
}

function getLocalSettings(): SiteSettings {
  const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
    return INITIAL_SITE_SETTINGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SITE_SETTINGS;
  }
}

function saveLocalSettings(settings: SiteSettings) {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

export const communityService = {
  // Check if real database is linked
  isSupabaseActive(): boolean {
    return isSupabaseConfigured();
  },

  // Reset to default demo data
  resetDemoData(): void {
    localStorage.setItem(STORAGE_KEY_COMMUNITIES, JSON.stringify(INITIAL_COMMUNITIES));
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
  },

  // Get all communities (filtered by status for public users)
  async getCommunities(includeDrafts = false): Promise<Community[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase
        .from('communities')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (!includeDrafts) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase getCommunities error:', error);
        throw new Error('Falha ao carregar comunidades do servidor: ' + error.message);
      }
      return data || [];
    }

    // LocalStorage fallback
    const items = getLocalCommunities();
    if (includeDrafts) {
      return [...items].sort((a, b) => {
        if (a.is_featured === b.is_featured) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.is_featured ? -1 : 1;
      });
    }

    return items
      .filter((c) => c.status === 'published')
      .sort((a, b) => {
        if (a.is_featured === b.is_featured) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.is_featured ? -1 : 1;
      });
  },

  // Get single community by slug
  async getCommunityBySlug(slug: string): Promise<Community | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) return null;
      return data;
    }

    const items = getLocalCommunities();
    return items.find((c) => c.slug === slug) || null;
  },

  // Create or Update community
  async saveCommunity(community: Partial<Community> & { name: string; game_name: string; platform: any; category: any; description: string; image_url: string }): Promise<Community> {
    // Basic validation
    if (!community.name?.trim()) throw new Error('O nome da comunidade é obrigatório.');
    if (!community.game_name?.trim()) throw new Error('O nome do jogo é obrigatório.');
    if (!community.description?.trim()) throw new Error('A descrição é obrigatória.');
    if (!community.image_url?.trim() || !isValidHttpUrl(community.image_url)) {
      throw new Error('A URL da imagem é obrigatória e deve iniciar com http:// ou https://');
    }

    // URL validations
    if (community.discord_url && !isValidHttpUrl(community.discord_url)) {
      throw new Error('O link do Discord deve ser uma URL válida (http:// ou https://).');
    }
    if (community.whatsapp_url && !isValidHttpUrl(community.whatsapp_url)) {
      throw new Error('O link do WhatsApp deve ser uma URL válida (http:// ou https://).');
    }
    if (community.external_url && !isValidHttpUrl(community.external_url)) {
      throw new Error('O link externo deve ser uma URL válida (http:// ou https://).');
    }

    const slug = community.slug?.trim() || generateSlug(community.name);
    const now = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      if (community.id) {
        // Update
        const payload = {
          name: community.name.trim(),
          slug,
          description: community.description.trim(),
          game_name: community.game_name.trim(),
          platform: community.platform,
          category: community.category,
          image_url: community.image_url.trim(),
          discord_url: community.discord_url?.trim() || null,
          whatsapp_url: community.whatsapp_url?.trim() || null,
          external_url: community.external_url?.trim() || null,
          is_featured: !!community.is_featured,
          status: community.status || 'published',
          updated_at: now,
        };

        const { data, error } = await supabase
          .from('communities')
          .update(payload)
          .eq('id', community.id)
          .select()
          .single();

        if (error) throw new Error('Erro ao atualizar no Supabase: ' + error.message);
        return data;
      } else {
        // Insert
        const payload = {
          name: community.name.trim(),
          slug,
          description: community.description.trim(),
          game_name: community.game_name.trim(),
          platform: community.platform,
          category: community.category,
          image_url: community.image_url.trim(),
          discord_url: community.discord_url?.trim() || null,
          whatsapp_url: community.whatsapp_url?.trim() || null,
          external_url: community.external_url?.trim() || null,
          is_featured: !!community.is_featured,
          status: community.status || 'published',
          is_demo: false,
          created_at: now,
          updated_at: now,
        };

        const { data, error } = await supabase
          .from('communities')
          .insert(payload)
          .select()
          .single();

        if (error) throw new Error('Erro ao criar no Supabase: ' + error.message);
        return data;
      }
    }

    // Local fallback
    const items = getLocalCommunities();
    if (community.id) {
      const index = items.findIndex((c) => c.id === community.id);
      if (index === -1) throw new Error('Comunidade não encontrada para edição.');

      const updated: Community = {
        ...items[index],
        name: community.name.trim(),
        slug,
        description: community.description.trim(),
        game_name: community.game_name.trim(),
        platform: community.platform,
        category: community.category,
        image_url: community.image_url.trim(),
        discord_url: community.discord_url?.trim() || null,
        whatsapp_url: community.whatsapp_url?.trim() || null,
        external_url: community.external_url?.trim() || null,
        is_featured: !!community.is_featured,
        status: community.status || 'published',
        updated_at: now,
      };

      items[index] = updated;
      saveLocalCommunities(items);
      return updated;
    } else {
      const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'c-' + Date.now();
      const newCommunity: Community = {
        id: newId,
        name: community.name.trim(),
        slug,
        description: community.description.trim(),
        game_name: community.game_name.trim(),
        platform: community.platform,
        category: community.category,
        image_url: community.image_url.trim(),
        discord_url: community.discord_url?.trim() || null,
        whatsapp_url: community.whatsapp_url?.trim() || null,
        external_url: community.external_url?.trim() || null,
        is_featured: !!community.is_featured,
        status: community.status || 'published',
        is_demo: false,
        created_at: now,
        updated_at: now,
      };

      items.unshift(newCommunity);
      saveLocalCommunities(items);
      return newCommunity;
    }
  },

  // Toggle status (published / draft)
  async toggleStatus(id: string, currentStatus: CommunityStatus): Promise<CommunityStatus> {
    const nextStatus: CommunityStatus = currentStatus === 'published' ? 'draft' : 'published';

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('communities')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw new Error('Erro ao alterar status: ' + error.message);
      return nextStatus;
    }

    const items = getLocalCommunities();
    const index = items.findIndex((c) => c.id === id);
    if (index !== -1) {
      items[index].status = nextStatus;
      items[index].updated_at = new Date().toISOString();
      saveLocalCommunities(items);
    }
    return nextStatus;
  },

  // Toggle featured flag
  async toggleFeatured(id: string, currentFeatured: boolean): Promise<boolean> {
    const nextFeatured = !currentFeatured;

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('communities')
        .update({ is_featured: nextFeatured, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw new Error('Erro ao alterar destaque: ' + error.message);
      return nextFeatured;
    }

    const items = getLocalCommunities();
    const index = items.findIndex((c) => c.id === id);
    if (index !== -1) {
      items[index].is_featured = nextFeatured;
      items[index].updated_at = new Date().toISOString();
      saveLocalCommunities(items);
    }
    return nextFeatured;
  },

  // Delete community
  async deleteCommunity(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', id);

      if (error) throw new Error('Erro ao excluir no Supabase: ' + error.message);
      return;
    }

    const items = getLocalCommunities();
    const filtered = items.filter((c) => c.id !== id);
    saveLocalCommunities(filtered);
  },

  // Get site settings
  async getSiteSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) return data;
    }

    return getLocalSettings();
  },

  // Update site settings
  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('site_settings')
        .update(updated)
        .eq('id', current.id);

      if (error) throw new Error('Erro ao salvar configurações no Supabase: ' + error.message);
      return updated;
    }

    saveLocalSettings(updated);
    return updated;
  },
};
