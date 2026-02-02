'use server';

import { createClient } from '@supabase/supabase-js';
import type { Database, ServiceTier, ClientInsert, InvitationInsert, InvitationContent } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('tu-proyecto'));
}

function generateTemporarySlug(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `draft-${timestamp}-${randomPart}`;
}

export interface OnboardingData {
  // Step 1: Datos personales
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  
  // Step 2: Datos del evento
  eventType: 'wedding' | 'quinceañera' | 'birthday' | 'baby_shower' | 'corporate' | 'other';
  skinId: string;
  headline: string;
  subtitle?: string;
  mainMessage: string;
  eventDate: string;
  eventTime: string;
  dressCode?: string;
  quote?: string;
  quoteAuthor?: string;
  
  // Couple (for weddings)
  person1Name?: string;
  person1FullName?: string;
  person2Name?: string;
  person2FullName?: string;
  coupleHashtag?: string;
  loveStory?: string;
  
  // Hosts
  hosts?: Array<{ name: string; relation?: string }>;
  
  // Step 3: Logística y regalos
  ceremonyName?: string;
  ceremonyAddress?: string;
  ceremonyMapsUrl?: string;
  receptionName?: string;
  receptionAddress?: string;
  receptionMapsUrl?: string;
  
  // Gift registry
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  bankAccountType?: string;
  giftRegistryLinks?: Array<{ name: string; url: string }>;
  
  // Step 4: Multimedia
  coverImage?: string;
  galleryImages?: string[];
  musicTrackUrl?: string;
  spotifyPlaylistUrl?: string;
  
  // RSVP config
  whatsappNumber?: string;
  maxCompanions?: number;
  dietaryOptions?: string[];
}

export interface OnboardingResult {
  success: boolean;
  clientId?: string;
  invitationId?: string;
  temporarySlug?: string;
  error?: string;
}

export async function submitOnboarding(
  tier: ServiceTier,
  data: OnboardingData
): Promise<OnboardingResult> {
  // Development mode fallback
  if (!isConfigured()) {
    console.log('[Dev Mode] Onboarding submission:', { tier, data });
    const tempSlug = generateTemporarySlug();
    return {
      success: true,
      clientId: 'dev-client-' + Date.now(),
      invitationId: 'dev-invitation-' + Date.now(),
      temporarySlug: tempSlug,
    };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    // 1. Create client record
    const clientData: ClientInsert = {
      full_name: data.clientName,
      email: data.clientEmail,
      phone: data.clientPhone || null,
      tier_purchased: tier,
      onboarding_completed: true,
    };

    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert(clientData as any)
      .select()
      .single();

    if (clientError) {
      console.error('Error creating client:', clientError);
      return { success: false, error: 'Error al crear el registro del cliente.' };
    }

    // 2. Build invitation content
    const temporarySlug = generateTemporarySlug();
    
    // Build content as flexible object (will be stored as JSONB)
    const content: Record<string, any> = {
      headline: data.headline,
      subtitle: data.subtitle,
      main_message: data.mainMessage,
      cover_image: data.coverImage,
      gallery_images: data.galleryImages || [],
      quote: data.quote ? { text: data.quote, author: data.quoteAuthor } : undefined,
      logistics: {
        event_date: `${data.eventDate}T${data.eventTime}:00`,
        timezone: 'America/Argentina/Buenos_Aires',
        agenda: [],
        venues: [
          ...(data.ceremonyName ? [{
            id: 'ceremony',
            name: data.ceremonyName,
            type: 'ceremony',
            address: data.ceremonyAddress || '',
            city: '',
            google_maps_url: data.ceremonyMapsUrl,
          }] : []),
          ...(data.receptionName ? [{
            id: 'reception',
            name: data.receptionName,
            type: 'reception',
            address: data.receptionAddress || '',
            city: '',
            google_maps_url: data.receptionMapsUrl,
          }] : []),
        ],
        dress_code: data.dressCode ? {
          code: data.dressCode,
        } : undefined,
      },
      features: {
        rsvp: {
          enabled: true,
          max_companions: data.maxCompanions || 2,
          dietary_options: data.dietaryOptions || [],
        },
        gift_registry: {
          enabled: Boolean(data.bankName || (data.giftRegistryLinks && data.giftRegistryLinks.length > 0)),
          bank_details: data.bankName ? {
            bank_name: data.bankName,
            account_holder: data.bankAccountHolder || '',
            account_number: data.bankAccountNumber || '',
          } : undefined,
          registry_links: data.giftRegistryLinks || [],
        },
        music: {
          enabled: Boolean(data.musicTrackUrl || data.spotifyPlaylistUrl),
          track_url: data.musicTrackUrl,
          spotify_playlist_url: data.spotifyPlaylistUrl,
          autoplay: false,
        },
        guestbook: {
          enabled: tier === 'premium',
          moderated: true,
        },
      },
      // Store whatsapp separately for RSVP
      whatsapp_number: data.whatsappNumber,
    };

    // Add couple data for weddings
    if (data.eventType === 'wedding' && data.person1Name && data.person2Name) {
      content.couple = {
        person1: { name: data.person1Name, full_name: data.person1FullName },
        person2: { name: data.person2Name, full_name: data.person2FullName },
        hashtag: data.coupleHashtag,
        love_story: data.loveStory,
      };
    }

    // Add hosts
    if (data.hosts && data.hosts.length > 0) {
      content.hosts = data.hosts;
    }

    // 3. Create invitation record
    const invitationData = {
      onboarding_client_id: (client as any).id,
      slug: temporarySlug,
      tier: tier,
      skin_id: data.skinId,
      event_type: data.eventType,
      content: content,
      is_active: false, // Draft until admin approves and sets final slug
    };

    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .insert(invitationData as any)
      .select()
      .single();

    if (invitationError) {
      console.error('Error creating invitation:', invitationError);
      return { success: false, error: 'Error al crear la invitación.' };
    }

    return {
      success: true,
      clientId: (client as any).id,
      invitationId: (invitation as any).id,
      temporarySlug: temporarySlug,
    };
  } catch (error) {
    console.error('Onboarding error:', error);
    return { success: false, error: 'Error inesperado durante el proceso.' };
  }
}

// Validate tier from URL
export async function validateTier(tier: string | null): Promise<ServiceTier | null> {
  if (!tier) return null;
  const validTiers: ServiceTier[] = ['essential', 'pro', 'premium'];
  return validTiers.includes(tier as ServiceTier) ? (tier as ServiceTier) : null;
}
