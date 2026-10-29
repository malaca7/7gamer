export type PlatformType = 'PC' | 'Console' | 'Mobile' | 'Multiplataforma';

export type CategoryType = 
  | 'Roleplay' 
  | 'Competitiva' 
  | 'Casual' 
  | 'Survival' 
  | 'MMORPG' 
  | 'Eventos' 
  | 'Outros';

export type CommunityStatus = 'draft' | 'published';

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  game_name: string;
  platform: PlatformType;
  category: CategoryType;
  image_url: string;
  discord_url?: string | null;
  whatsapp_url?: string | null;
  external_url?: string | null;
  is_featured: boolean;
  status: CommunityStatus;
  is_demo?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_tagline: string;
  site_description: string;
  discord_main_url: string;
  whatsapp_main_url: string;
  contact_email: string;
  footer_text: string;
  updated_at: string;
}

export interface CommunityFilter {
  search: string;
  game: string;
  platform: string;
  category: string;
  onlyFeatured: boolean;
  sortBy: 'recent' | 'featured' | 'name';
}
