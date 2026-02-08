'use server';

import { createClient } from '@supabase/supabase-js';
import type { Database, ClientInsert } from '@/types/database';
import { generateFantasyData } from '@/app/onboarding/lib/mock-fantasy-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('tu-proyecto'));
}

export async function checkSlugExists(slug: string): Promise<boolean> {
  if (!isConfigured()) {
    // En modo desarrollo, simular que 'boda-real' y 'test' existen
    return slug === 'boda-real' || slug === 'test';
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', slug)
      .limit(1);

    if (error) {
      console.error('Error checking slug:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking slug:', error);
    return false;
  }
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
  slug: string;
  isSlugValid?: boolean;
  eventType: 'wedding' | 'quinceañera' | 'birthday' | 'baby_shower' | 'corporate' | 'other';
  skinId: string;
  headline: string;
  subtitle?: string;
  mainMessage: string;
  eventDate: string;
  eventTime: string;
  dressCode?: string;
  dressCodeDescription?: string;
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
  ceremonyTime?: string;
  receptionName?: string;
  receptionAddress?: string;
  receptionMapsUrl?: string;
  receptionTime?: string;
  
  // Gift registry
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  bankAccountType?: string;
  giftRegistryMessage?: string;
  
  // Step 4: Multimedia
  coverImage?: string;
  galleryImages?: string[];
  musicTrackUrl?: string;
  spotifyPlaylistUrl?: string;
  
  // Features toggles (Step 5)
  showHero?: boolean;
  showCountdown?: boolean;
  showAgenda?: boolean;
  showVenueMap?: boolean;
  showCeremony?: boolean;
  showReception?: boolean;
  showDressCode?: boolean;
  showGiftRegistry?: boolean;
  showRSVP?: boolean;
  showGallery?: boolean;
  showMusic?: boolean;
  showGuestMessages?: boolean;
  
  // Agenda items (timeline)
  agendaItems?: Array<{
    time: string;
    title: string;
    description?: string;
    icon?: string;
  }>;
  
  // RSVP config
  rsvpEnabled?: boolean;
  rsvpDeadline?: string;
  maxCompanions?: number;
  allowChildren?: boolean;
  dietaryOptions?: string[];
  rsvpConfirmationMessage?: string;
  
  // Preguntas personalizadas para RSVP (hasta 3)
  rsvpCustomQuestions?: Array<{
    id: string;
    question: string;
    isActive: boolean;
  }>;
}

export interface OnboardingResult {
  success: boolean;
  clientId?: string;
  invitationId?: string;
  temporarySlug?: string;
  error?: string;
}

export async function submitOnboarding(
  data: OnboardingData
): Promise<OnboardingResult> {
  // Aplicar datos de muestra para campos faltantes
  const mockData = generateFantasyData(data as any);
  
  // Completar datos faltantes con valores de muestra
  const completeData: OnboardingData = {
    ...data,
    // Datos del paso 2 - usar muestra si no se proporcionan
    slug: data.slug && data.isSlugValid ? data.slug : generateTemporarySlug(),
    headline: data.headline || mockData.headline,
    mainMessage: data.mainMessage || mockData.mainMessage,
    eventDate: data.eventDate || mockData.eventDate,
    eventTime: data.eventTime || mockData.eventTime,
    person1Name: data.person1Name || mockData.person1Name,
    person2Name: data.person2Name || mockData.person2Name,
    dressCode: data.dressCode || mockData.dressCode,
    dressCodeDescription: data.dressCodeDescription || mockData.dressCodeDescription,
    quote: data.quote || mockData.quote,
    quoteAuthor: data.quoteAuthor || mockData.quoteAuthor,
    // Datos del paso 3 - usar muestra si no se proporcionan
    ceremonyName: data.ceremonyName || mockData.ceremonyName,
    ceremonyAddress: data.ceremonyAddress || mockData.ceremonyAddress,
    ceremonyTime: data.ceremonyTime || mockData.eventTime,
    receptionName: data.receptionName || mockData.receptionName,
    receptionAddress: data.receptionAddress || mockData.receptionAddress,
    receptionTime: data.receptionTime || mockData.eventTime,
    bankName: data.bankName || mockData.bankName,
    bankAccountNumber: data.bankAccountNumber || mockData.bankAccountNumber,
    giftRegistryMessage: data.giftRegistryMessage || mockData.giftRegistryMessage,
    // Datos del paso 5 - usar muestra si no se proporcionan
    agendaItems: data.agendaItems?.map((item, idx) => ({
      time: item.time,
      title: item.title,
      description: item.description,
      icon: item.icon,
    })) || mockData.agendaItems.map((item) => ({
      time: item.time,
      title: item.title,
    })),
    rsvpDeadline: data.rsvpDeadline || mockData.rsvpDeadline,
    rsvpConfirmationMessage: data.rsvpConfirmationMessage || mockData.rsvpConfirmationMessage,
    maxCompanions: data.maxCompanions ?? mockData.maxCompanions,
    allowChildren: data.allowChildren ?? mockData.allowChildren,
  };

  // Development mode fallback
  if (!isConfigured()) {
    console.log('[Dev Mode] Onboarding submission:', { data: completeData });
    return {
      success: true,
      clientId: 'dev-client-' + Date.now(),
      invitationId: 'dev-invitation-' + Date.now(),
      temporarySlug: completeData.slug,
    };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    // 1. Create client record
    const clientData: ClientInsert = {
      full_name: data.clientName,
      email: data.clientEmail,
      phone: data.clientPhone || null,
      onboarding_completed: true,
    };

    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert(clientData as any)
      .select()
      .single();

    if (clientError) {
      console.error('Error creating client:', JSON.stringify(clientError, null, 2));
      return { 
        success: false, 
        error: `Error al crear el registro del cliente: ${clientError.message || clientError.code || 'Unknown'}` 
      };
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
        agenda: data.agendaItems?.map((item, idx) => ({
          id: `agenda_${idx}`,
          time: item.time,
          title: item.title,
          description: item.description || '',
          icon: item.icon || 'circle',
        })) || [],
        venues: [
          ...(data.showCeremony !== false ? [{
            id: 'ceremony',
            name: data.ceremonyName || 'Ceremonia',
            type: 'ceremony',
            address: data.ceremonyAddress || '',
            city: '',
            google_maps_url: data.ceremonyMapsUrl,
            time: data.ceremonyTime || data.eventTime || '18:00',
            coordinates: { lat: -34.6037, lng: -58.3816 }, // Default coordinates (Buenos Aires)
          }] : []),
          ...(data.showReception !== false && data.receptionName ? [{
            id: 'reception',
            name: data.receptionName,
            type: 'reception',
            address: data.receptionAddress || '',
            city: '',
            google_maps_url: data.receptionMapsUrl,
            time: data.receptionTime || data.eventTime || '18:00',
            coordinates: { lat: -34.6037, lng: -58.3816 }, // Default coordinates (Buenos Aires)
          }] : []),
        ],
        dress_code: data.dressCode ? {
          code: data.dressCode,
          description: data.dressCodeDescription,
        } : undefined,
      },
      features: {
        show_hero: data.showHero ?? true,
        show_countdown: data.showCountdown ?? true,
        show_agenda: data.showAgenda ?? true,
        show_venue_map: data.showVenueMap ?? true,
        show_dress_code: data.showDressCode ?? true,
        show_gift_registry: data.showGiftRegistry ?? true,
        show_rsvp: data.showRSVP ?? true,
        show_gallery: data.showGallery ?? true,
        show_music: data.showMusic ?? true,
        show_guest_messages: data.showGuestMessages ?? false,
        rsvp: {
          enabled: data.rsvpEnabled ?? true,
          deadline: data.rsvpDeadline,
          max_companions: data.maxCompanions || 2,
          allow_children: data.allowChildren ?? false,
          dietary_options: data.dietaryOptions || [],
          confirmation_message: data.rsvpConfirmationMessage,
          custom_questions: data.rsvpCustomQuestions
            ?.filter(q => q.isActive && q.question.trim() !== '')
            ?.map((q, idx) => ({
              id: q.id,
              question: q.question,
              type: 'text',
              required: false,
            })) || [],
        },
        gift_registry: {
          enabled: data.showGiftRegistry ?? Boolean(data.bankName),
          message: data.giftRegistryMessage,
          bank_details: data.bankName ? {
            bank_name: data.bankName,
            account_holder: data.bankAccountHolder || '',
            account_number: data.bankAccountNumber || '',
          } : undefined,
        },
        music: {
          enabled: data.showMusic ?? Boolean(data.musicTrackUrl || data.spotifyPlaylistUrl),
          track_url: data.musicTrackUrl,
          spotify_playlist_url: data.spotifyPlaylistUrl,
          autoplay: false,
        },
        guestbook: {
          enabled: data.showGuestMessages ?? false,
          moderated: true,
        },
      },
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
      slug: data.slug,
      skin_id: data.skinId,
      event_type: data.eventType,
      content: content,
      is_active: true,
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
      temporarySlug: data.slug,
    };
  } catch (error) {
    console.error('Onboarding error:', error);
    return { success: false, error: 'Error inesperado durante el proceso.' };
  }
}
