/**
 * Tipos generados para las tablas de Supabase
 * Estos tipos reflejan la estructura de la base de datos
 */

// =============================================
// ENUMS
// =============================================

export type ServiceTier = 'essential' | 'pro' | 'premium';
export type EventType = 'wedding' | 'quinceañera' | 'birthday' | 'baby_shower' | 'corporate' | 'other';
export type RSVPStatus = 'pending' | 'confirmed' | 'declined' | 'maybe';

// =============================================
// DATABASE TABLES
// =============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      clients: {
        Row: Client;
        Insert: ClientInsert;
        Update: ClientUpdate;
      };
      invitations: {
        Row: Invitation;
        Insert: InvitationInsert;
        Update: InvitationUpdate;
      };
      rsvps: {
        Row: RSVP;
        Insert: RSVPInsert;
        Update: RSVPUpdate;
      };
      guestbook_entries: {
        Row: GuestbookEntry;
        Insert: GuestbookEntryInsert;
        Update: GuestbookEntryUpdate;
      };
    };
    Enums: {
      service_tier: ServiceTier;
      event_type: EventType;
      rsvp_status: RSVPStatus;
    };
  };
}

// =============================================
// PROFILES
// =============================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id?: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface ProfileUpdate {
  email?: string;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

// =============================================
// CLIENTS (Onboarding)
// =============================================

export interface Client {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  tier_purchased: ServiceTier;
  profile_id: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientInsert {
  id?: string;
  full_name: string;
  email: string;
  phone?: string | null;
  tier_purchased: ServiceTier;
  profile_id?: string | null;
  onboarding_completed?: boolean;
}

export interface ClientUpdate {
  full_name?: string;
  email?: string;
  phone?: string | null;
  tier_purchased?: ServiceTier;
  profile_id?: string | null;
  onboarding_completed?: boolean;
}

// =============================================
// INVITATIONS
// =============================================

export interface Invitation {
  id: string;
  client_id: string | null;
  onboarding_client_id: string | null;
  slug: string;
  tier: ServiceTier;
  skin_id: string;
  event_type: EventType;
  content: InvitationContent;
  is_active: boolean;
  expires_at: string | null;
  language: string;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface InvitationInsert {
  id?: string;
  client_id?: string | null;
  onboarding_client_id?: string | null;
  slug: string;
  tier?: ServiceTier;
  skin_id?: string;
  event_type?: EventType;
  content: InvitationContent;
  is_active?: boolean;
  expires_at?: string | null;
  language?: string;
}

export interface InvitationUpdate {
  slug?: string;
  tier?: ServiceTier;
  skin_id?: string;
  event_type?: EventType;
  content?: InvitationContent;
  is_active?: boolean;
  expires_at?: string | null;
  language?: string;
}

// Contenido JSONB de la invitación
export interface InvitationContent {
  headline: string;
  subtitle?: string;
  main_message: string;
  couple?: {
    person1: { name: string; full_name?: string; photo_url?: string };
    person2: { name: string; full_name?: string; photo_url?: string };
    hashtag?: string;
    love_story?: string;
  };
  hosts?: Array<{ name: string; relation?: string }>;
  cover_image?: string;
  gallery_images?: string[];
  quote?: { text: string; author?: string };
  logistics: {
    event_date: string;
    timezone?: string;
    agenda: Array<{
      id: string;
      time: string;
      title: string;
      description?: string;
      icon?: string;
      location?: string;
    }>;
    venues: Array<{
      id: string;
      name: string;
      type: 'ceremony' | 'reception' | 'party' | 'other';
      address: string;
      city: string;
      country?: string;
      coordinates?: { lat: number; lng: number };
      google_maps_url?: string;
      waze_url?: string;
      instructions?: string;
      image_url?: string;
    }>;
    dress_code?: {
      code: string;
      description?: string;
      suggestions?: string[];
      colors_to_avoid?: string[];
    };
    parking_info?: string;
    accommodation_suggestions?: Array<{
      name: string;
      url?: string;
      distance?: string;
    }>;
  };
  features: {
    rsvp: {
      enabled: boolean;
      deadline?: string;
      max_companions?: number;
      allow_children?: boolean;
      dietary_options?: string[];
      custom_questions?: Array<{
        id: string;
        question: string;
        type: 'text' | 'boolean' | 'select';
        options?: string[];
        required?: boolean;
      }>;
      confirmation_message?: string;
      requires_approval?: boolean;
    };
    gift_registry?: {
      enabled: boolean;
      message?: string;
      bank_details?: {
        bank_name: string;
        account_holder: string;
        account_number: string;
        routing_number?: string;
      };
      registries?: Array<{
        id: string;
        platform: string;
        name: string;
        url: string;
        logo_url?: string;
      }>;
    };
    music?: {
      enabled: boolean;
      autoplay?: boolean;
      track_url?: string;
      track_name?: string;
      artist?: string;
      spotify_playlist_url?: string;
    };
    countdown?: {
      enabled: boolean;
      target_date: string;
      show_seconds?: boolean;
      style?: 'minimal' | 'elegant' | 'modern';
    };
    social_sharing?: {
      enabled: boolean;
      whatsapp_message?: string;
      og_image?: string;
      og_title?: string;
      og_description?: string;
    };
    photo_gallery?: {
      enabled: boolean;
      allow_uploads?: boolean;
    };
    guestbook?: {
      enabled: boolean;
      moderated?: boolean;
    };
    live_streaming?: {
      enabled: boolean;
      platform?: string;
      url?: string;
    };
  };
  skin_config?: {
    colors?: Record<string, string>;
    typography?: {
      heading_font?: string;
      body_font?: string;
      accent_font?: string;
    };
    border_radius?: string;
    animations?: string;
  };
}

// =============================================
// RSVPS
// =============================================

export interface RSVP {
  id: string;
  invitation_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: RSVPStatus;
  attendance: boolean | null;
  guests_count: number;
  dietary_restrictions: string | null;
  menu_notes: string | null;
  music_suggestion: string | null;
  custom_answers: Record<string, unknown>;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface RSVPInsert {
  id?: string;
  invitation_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status?: RSVPStatus;
  attendance?: boolean | null;
  guests_count?: number;
  dietary_restrictions?: string | null;
  menu_notes?: string | null;
  music_suggestion?: string | null;
  custom_answers?: Record<string, unknown>;
  message?: string | null;
}

export interface RSVPUpdate {
  name?: string;
  email?: string | null;
  phone?: string | null;
  status?: RSVPStatus;
  attendance?: boolean | null;
  guests_count?: number;
  dietary_restrictions?: string | null;
  menu_notes?: string | null;
  music_suggestion?: string | null;
  custom_answers?: Record<string, unknown>;
  message?: string | null;
}

// =============================================
// GUESTBOOK ENTRIES
// =============================================

export interface GuestbookEntry {
  id: string;
  invitation_id: string;
  author_name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export interface GuestbookEntryInsert {
  id?: string;
  invitation_id: string;
  author_name: string;
  message: string;
  is_approved?: boolean;
}

export interface GuestbookEntryUpdate {
  author_name?: string;
  message?: string;
  is_approved?: boolean;
}
