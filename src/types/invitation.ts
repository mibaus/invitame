// ============================================
// INVITA.ME - Contrato de Datos Principal
// Single Source of Truth para todas las invitaciones
// ============================================

// ----- ENUMS & TIPOS BASE -----

export type ServiceTier = 'essential' | 'pro' | 'premium';

export type SkinId = 
  // Essential (3 modelos básicos)
  | 'classic-elegance'
  | 'minimal-chic'
  | 'garden-romance'
  // Pro (3 modelos intermedios)
  | 'royal-gold'
  | 'modern-luxe'
  | 'botanical-dream'
  // Premium (3 modelos de lujo)
  | 'celestial-noir'
  | 'renaissance-opulence'
  | 'bespoke-couture';

export type EventType = 
  | 'wedding'
  | 'quinceañera'
  | 'birthday'
  | 'baby-shower'
  | 'corporate'
  | 'anniversary'
  | 'graduation'
  | 'custom';

export type DressCode = 
  | 'formal'
  | 'semi-formal'
  | 'cocktail'
  | 'casual-elegante'
  | 'black-tie'
  | 'white-tie'
  | 'themed'
  | 'custom';

export type RSVPStatus = 'pending' | 'confirmed' | 'declined' | 'maybe';

// ----- INTERFACES DE METADATA -----

export interface InvitationMetadata {
  id: string;
  slug: string;
  tier: ServiceTier;
  skin_id: SkinId;
  event_type: EventType;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  is_active: boolean;
  owner_id: string;
  language: 'es' | 'en' | 'pt';
}

// ----- INTERFACES DE CONTENIDO -----

export interface CoupleInfo {
  person1: {
    name: string;
    full_name?: string;
    photo_url?: string;
  };
  person2: {
    name: string;
    full_name?: string;
    photo_url?: string;
  };
  hashtag?: string;
  love_story?: string;
}

export interface HostInfo {
  name: string;
  relation?: string;
  message?: string;
}

export interface InvitationContent {
  headline: string;
  subtitle?: string;
  main_message: string;
  couple?: CoupleInfo;
  hosts?: HostInfo[];
  cover_image: string;
  gallery_images?: string[];
  quote?: {
    text: string;
    author?: string;
  };
  custom_sections?: Array<{
    id: string;
    title: string;
    content: string;
    icon?: string;
  }>;
}

// ----- INTERFACES DE LOGÍSTICA -----

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: string;
  location?: string;
}

export interface VenueLocation {
  id: string;
  name: string;
  type: 'ceremony' | 'reception' | 'party' | 'custom';
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  google_maps_url?: string;
  waze_url?: string;
  instructions?: string;
  image_url?: string;
}

export interface DressCodeInfo {
  code: DressCode;
  description?: string;
  suggestions?: string[];
  colors_to_avoid?: string[];
  image_url?: string;
}

export interface EventLogistics {
  event_date: string;
  event_end_date?: string;
  timezone: string;
  agenda: AgendaItem[];
  venues: VenueLocation[];
  dress_code?: DressCodeInfo;
  parking_info?: string;
  accommodation_suggestions?: Array<{
    name: string;
    url?: string;
    distance?: string;
  }>;
}

// ----- INTERFACES DE FEATURES -----

export interface RSVPQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'boolean';
  options?: string[];
  required: boolean;
}

export interface RSVPConfig {
  enabled: boolean;
  deadline?: string;
  max_companions: number;
  allow_children: boolean;
  dietary_options?: string[];
  custom_questions?: RSVPQuestion[];
  confirmation_message?: string;
  requires_approval?: boolean;
}

export interface GiftRegistryItem {
  id: string;
  platform: string;
  name: string;
  url: string;
  logo_url?: string;
}

export interface GiftRegistry {
  enabled: boolean;
  message?: string;
  bank_details?: {
    bank_name: string;
    account_holder: string;
    account_number: string;
    routing_number?: string;
    swift?: string;
  };
  registries?: GiftRegistryItem[];
}

export interface MusicConfig {
  enabled: boolean;
  autoplay: boolean;
  track_url?: string;
  track_name?: string;
  artist?: string;
  spotify_playlist_url?: string;
}

export interface CountdownConfig {
  enabled: boolean;
  target_date: string;
  show_seconds: boolean;
  style: 'classic' | 'flip' | 'minimal' | 'elegant';
}

export interface SocialSharingConfig {
  enabled: boolean;
  whatsapp_message?: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
}

export interface InvitationFeatures {
  rsvp: RSVPConfig;
  gift_registry?: GiftRegistry;
  music?: MusicConfig;
  countdown?: CountdownConfig;
  social_sharing?: SocialSharingConfig;
  photo_gallery?: {
    enabled: boolean;
    allow_uploads: boolean;
  };
  guestbook?: {
    enabled: boolean;
    moderated: boolean;
  };
  live_streaming?: {
    enabled: boolean;
    platform: 'youtube' | 'zoom' | 'custom';
    url?: string;
    password?: string;
  };
}

// ----- INTERFACES DE ESTILO (SKIN CONFIG) -----

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text_primary: string;
  text_secondary: string;
  text_muted: string;
}

export interface Typography {
  heading_font: string;
  body_font: string;
  accent_font?: string;
}

export interface SkinConfig {
  colors: ColorPalette;
  typography: Typography;
  border_radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animations: 'none' | 'subtle' | 'elegant' | 'dramatic';
  custom_css?: string;
}

// ----- INTERFACE PRINCIPAL -----

export interface InvitationSchema {
  metadata: InvitationMetadata;
  content: InvitationContent;
  logistics: EventLogistics;
  features: InvitationFeatures;
  skin_config?: Partial<SkinConfig>;
}

// ----- TIPOS DE RESPUESTA RSVP -----

export interface RSVPResponse {
  id: string;
  invitation_id: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  status: RSVPStatus;
  companions: number;
  companion_names?: string[];
  dietary_restrictions?: string[];
  custom_answers?: Record<string, string | string[] | boolean>;
  message?: string;
  submitted_at: string;
  approved?: boolean;
}

// ----- TIPO PARA FEATURES POR TIER -----

export const TIER_FEATURES: Record<ServiceTier, string[]> = {
  essential: [
    'countdown',
    'whatsapp_share',
    'basic_rsvp',
    'single_venue',
    'basic_gallery',
  ],
  pro: [
    'countdown',
    'whatsapp_share',
    'advanced_rsvp',
    'multiple_venues',
    'full_gallery',
    'dashboard',
    'dress_code',
    'agenda',
    'music_player',
    'gift_registry',
  ],
  premium: [
    'countdown',
    'whatsapp_share',
    'advanced_rsvp',
    'multiple_venues',
    'full_gallery',
    'dashboard',
    'dress_code',
    'agenda',
    'music_player',
    'gift_registry',
    'live_streaming',
    'photo_upload',
    'guestbook',
    'spotify_playlist',
    'logistics_guide',
    'analytics',
    'priority_support',
  ],
};
