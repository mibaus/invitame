'use server';

import { createClient } from '@supabase/supabase-js';
import type { Database, InvitationContent } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('tu-proyecto'));
}

export interface UpdateInvitationData {
  // Basic
  headline?: string;
  subtitle?: string;
  mainMessage?: string;
  
  // Couple
  person1Name?: string;
  person1FullName?: string;
  person1PhotoUrl?: string;
  person2Name?: string;
  person2FullName?: string;
  person2PhotoUrl?: string;
  coupleHashtag?: string;
  loveStory?: string;
  
  // Multimedia
  coverImage?: string;
  galleryImages?: string[];
  
  // Event
  eventDate?: string;
  eventTime?: string;
  
  // Venues
  ceremonyName?: string;
  ceremonyAddress?: string;
  ceremonyCity?: string;
  ceremonyTime?: string;
  ceremonyMapsUrl?: string;
  ceremonyWazeUrl?: string;
  ceremonyInstructions?: string;
  ceremonyImageUrl?: string;
  receptionName?: string;
  receptionAddress?: string;
  receptionCity?: string;
  receptionTime?: string;
  receptionMapsUrl?: string;
  receptionWazeUrl?: string;
  receptionInstructions?: string;
  receptionImageUrl?: string;
  hasCeremony?: boolean;
  hasReception?: boolean;
  parkingInfo?: string;
  
  // Dress Code
  dressCode?: string;
  dressCodeDescription?: string;
  dressCodeSuggestions?: string[];
  dressCodeColorsToAvoid?: string[];
  
  // Quote
  quote?: string;
  quoteAuthor?: string;
  
  // Agenda/Timeline
  agenda?: Array<{
    id: string;
    time: string;
    title: string;
    description?: string;
    icon?: string;
    location?: string;
  }>;
  
  // Gift Registry
  giftRegistryMessage?: string;
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  externalRegistries?: Array<{
    id: string;
    platform: string;
    name: string;
    url: string;
  }>;
  
  // Music
  spotifyPlaylistUrl?: string;
  musicTrackUrl?: string;
  musicTrackName?: string;
  musicArtist?: string;
  musicAutoplay?: boolean;
  
  // RSVP
  rsvpDeadline?: string;
  maxCompanions?: number;
  allowChildren?: boolean;
  rsvpConfirmationMessage?: string;
  requiresApproval?: boolean;
  dietaryOptions?: string[];
  customQuestions?: Array<{ id: string; question: string; type: 'text' | 'boolean' | 'select'; options?: string[]; required?: boolean }>;
  
  // Features
  countdownEnabled?: boolean;
  countdownTargetDate?: string;
  countdownShowSeconds?: boolean;
  countdownStyle?: 'minimal' | 'elegant' | 'modern';
  guestbookEnabled?: boolean;
  guestbookModerated?: boolean;
  liveStreamingEnabled?: boolean;
  liveStreamingPlatform?: string;
  liveStreamingUrl?: string;
  photoGalleryEnabled?: boolean;
  photoGalleryAllowUploads?: boolean;
  socialSharingEnabled?: boolean;
  whatsappMessage?: string;
  
  // Section Visibility
  showHero?: boolean;
  showCountdown?: boolean;
  showAgenda?: boolean;
  showDressCode?: boolean;
  showGiftRegistry?: boolean;
  showRSVP?: boolean;
  showGallery?: boolean;
  showGuestMessages?: boolean;
  showMusic?: boolean;
  
  // Hosts
  hosts?: Array<{ name: string; relation?: string }>;
  
  // Accommodation
  accommodationSuggestions?: Array<{
    name: string;
    url?: string;
    distance?: string;
  }>;
}

export async function updateInvitation(
  slug: string,
  data: UpdateInvitationData
): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase no está configurado' };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    // Get current invitation
    const { data: invitation, error: fetchError } = await (supabase
      .from('invitations') as any)
      .select('id, content')
      .eq('slug', slug)
      .single();

    if (fetchError || !invitation) {
      return { success: false, error: 'Invitación no encontrada' };
    }

    const currentContent = (invitation.content || {}) as InvitationContent;

    // Build updated content
    const updatedContent: InvitationContent = {
      ...currentContent,
      headline: data.headline !== undefined ? data.headline : currentContent.headline,
      subtitle: data.subtitle !== undefined ? data.subtitle : currentContent.subtitle,
      main_message: data.mainMessage !== undefined ? data.mainMessage : currentContent.main_message,
      cover_image: data.coverImage !== undefined ? data.coverImage : currentContent.cover_image,
      gallery_images: data.galleryImages !== undefined ? data.galleryImages : currentContent.gallery_images,
      quote: data.quote ? {
        text: data.quote,
        author: data.quoteAuthor || currentContent.quote?.author,
      } : currentContent.quote,
      couple: {
        person1: {
          name: data.person1Name ?? currentContent.couple?.person1?.name ?? '',
          full_name: data.person1FullName ?? currentContent.couple?.person1?.full_name,
          photo_url: data.person1PhotoUrl ?? currentContent.couple?.person1?.photo_url,
        },
        person2: {
          name: data.person2Name ?? currentContent.couple?.person2?.name ?? '',
          full_name: data.person2FullName ?? currentContent.couple?.person2?.full_name,
          photo_url: data.person2PhotoUrl ?? currentContent.couple?.person2?.photo_url,
        },
        hashtag: data.coupleHashtag ?? currentContent.couple?.hashtag,
        love_story: data.loveStory ?? currentContent.couple?.love_story,
      },
      hosts: data.hosts !== undefined ? data.hosts : currentContent.hosts,
      logistics: {
        ...currentContent.logistics,
        event_date: data.eventDate && data.eventTime
          ? `${data.eventDate}T${data.eventTime}:00`
          : currentContent.logistics?.event_date,
        agenda: data.agenda !== undefined ? data.agenda : currentContent.logistics?.agenda,
        venues: [
          ...(currentContent.logistics?.venues?.filter((v: any) => v.type !== 'ceremony') || []),
          ...(data.hasCeremony || data.ceremonyName ? [{
            id: 'ceremony',
            name: data.ceremonyName || currentContent.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.name || '',
            type: 'ceremony' as const,
            address: data.ceremonyAddress ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.address ?? '',
            city: data.ceremonyCity ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.city ?? '',
            google_maps_url: data.ceremonyMapsUrl ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.google_maps_url,
            waze_url: data.ceremonyWazeUrl ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.waze_url,
            instructions: data.ceremonyInstructions ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.instructions,
            image_url: data.ceremonyImageUrl ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.image_url,
            time: data.ceremonyTime,
          } as any] : []),
          ...(currentContent.logistics?.venues?.filter((v: any) => v.type !== 'reception') || []),
          ...(data.hasReception || data.receptionName ? [{
            id: 'reception',
            name: data.receptionName || currentContent.logistics?.venues?.find((v: any) => v.type === 'reception')?.name || '',
            type: 'reception' as const,
            address: data.receptionAddress ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'reception')?.address ?? '',
            city: data.receptionCity ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'reception')?.city ?? '',
            google_maps_url: data.receptionMapsUrl ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'reception')?.google_maps_url,
            waze_url: data.receptionWazeUrl ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'reception')?.waze_url,
            instructions: data.receptionInstructions ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'reception')?.instructions,
            image_url: data.receptionImageUrl ?? currentContent.logistics?.venues?.find((v: any) => v.type === 'reception')?.image_url,
            time: data.receptionTime,
          } as any] : []),
        ],
        dress_code: data.dressCode !== undefined ? {
          code: data.dressCode,
          description: data.dressCodeDescription,
          suggestions: data.dressCodeSuggestions,
          colors_to_avoid: data.dressCodeColorsToAvoid,
        } : currentContent.logistics?.dress_code,
        parking_info: data.parkingInfo !== undefined ? data.parkingInfo : currentContent.logistics?.parking_info,
        accommodation_suggestions: data.accommodationSuggestions !== undefined ? data.accommodationSuggestions : currentContent.logistics?.accommodation_suggestions,
      },
      features: {
        ...currentContent.features,
        rsvp: {
          ...currentContent.features?.rsvp,
          deadline: data.rsvpDeadline !== undefined ? data.rsvpDeadline : currentContent.features?.rsvp?.deadline,
          max_companions: data.maxCompanions !== undefined ? data.maxCompanions : currentContent.features?.rsvp?.max_companions,
          allow_children: data.allowChildren !== undefined ? data.allowChildren : currentContent.features?.rsvp?.allow_children,
          confirmation_message: data.rsvpConfirmationMessage !== undefined ? data.rsvpConfirmationMessage : currentContent.features?.rsvp?.confirmation_message,
          requires_approval: data.requiresApproval !== undefined ? data.requiresApproval : currentContent.features?.rsvp?.requires_approval,
          dietary_options: data.dietaryOptions !== undefined ? data.dietaryOptions : currentContent.features?.rsvp?.dietary_options,
          custom_questions: data.customQuestions !== undefined ? data.customQuestions : currentContent.features?.rsvp?.custom_questions,
        },
        gift_registry: {
          enabled: currentContent.features?.gift_registry?.enabled ?? true,
          ...currentContent.features?.gift_registry,
          message: data.giftRegistryMessage !== undefined ? data.giftRegistryMessage : currentContent.features?.gift_registry?.message,
          bank_details: data.bankName !== undefined || data.bankAccountHolder !== undefined || data.bankAccountNumber !== undefined ? {
            bank_name: data.bankName ?? currentContent.features?.gift_registry?.bank_details?.bank_name ?? '',
            account_holder: data.bankAccountHolder ?? currentContent.features?.gift_registry?.bank_details?.account_holder ?? '',
            account_number: data.bankAccountNumber ?? currentContent.features?.gift_registry?.bank_details?.account_number ?? '',
            routing_number: data.bankRoutingNumber ?? currentContent.features?.gift_registry?.bank_details?.routing_number,
          } : currentContent.features?.gift_registry?.bank_details,
          registries: data.externalRegistries !== undefined ? data.externalRegistries.map(r => ({
            ...r,
            logo_url: currentContent.features?.gift_registry?.registries?.find((er: any) => er.id === r.id)?.logo_url,
          })) : currentContent.features?.gift_registry?.registries,
        },
        music: {
          enabled: currentContent.features?.music?.enabled ?? true,
          ...currentContent.features?.music,
          spotify_playlist_url: data.spotifyPlaylistUrl !== undefined ? data.spotifyPlaylistUrl : currentContent.features?.music?.spotify_playlist_url,
          track_url: data.musicTrackUrl !== undefined ? data.musicTrackUrl : currentContent.features?.music?.track_url,
          track_name: data.musicTrackName !== undefined ? data.musicTrackName : currentContent.features?.music?.track_name,
          artist: data.musicArtist !== undefined ? data.musicArtist : currentContent.features?.music?.artist,
          autoplay: data.musicAutoplay !== undefined ? data.musicAutoplay : currentContent.features?.music?.autoplay,
        },
        countdown: {
          enabled: data.countdownEnabled ?? currentContent.features?.countdown?.enabled ?? false,
          target_date: data.countdownTargetDate ?? currentContent.features?.countdown?.target_date ?? currentContent.logistics?.event_date ?? '',
          show_seconds: data.countdownShowSeconds ?? currentContent.features?.countdown?.show_seconds ?? false,
          style: data.countdownStyle ?? currentContent.features?.countdown?.style ?? 'elegant',
        },
        guestbook: {
          enabled: data.guestbookEnabled ?? currentContent.features?.guestbook?.enabled ?? false,
          moderated: data.guestbookModerated ?? currentContent.features?.guestbook?.moderated ?? false,
        },
        live_streaming: {
          enabled: data.liveStreamingEnabled ?? currentContent.features?.live_streaming?.enabled ?? false,
          platform: data.liveStreamingPlatform ?? currentContent.features?.live_streaming?.platform,
          url: data.liveStreamingUrl ?? currentContent.features?.live_streaming?.url,
        },
        photo_gallery: {
          enabled: data.photoGalleryEnabled ?? currentContent.features?.photo_gallery?.enabled ?? true,
          allow_uploads: data.photoGalleryAllowUploads ?? currentContent.features?.photo_gallery?.allow_uploads ?? false,
        },
        social_sharing: {
          enabled: data.socialSharingEnabled ?? currentContent.features?.social_sharing?.enabled ?? true,
          whatsapp_message: data.whatsappMessage ?? currentContent.features?.social_sharing?.whatsapp_message,
        },
        section_visibility: {
          show_hero: data.showHero ?? currentContent.features?.section_visibility?.show_hero ?? true,
          show_countdown: data.showCountdown ?? currentContent.features?.section_visibility?.show_countdown ?? true,
          show_agenda: data.showAgenda ?? currentContent.features?.section_visibility?.show_agenda ?? true,
          show_dress_code: data.showDressCode ?? currentContent.features?.section_visibility?.show_dress_code ?? true,
          show_gift_registry: data.showGiftRegistry ?? currentContent.features?.section_visibility?.show_gift_registry ?? true,
          show_rsvp: data.showRSVP ?? currentContent.features?.section_visibility?.show_rsvp ?? true,
          show_gallery: data.showGallery ?? currentContent.features?.section_visibility?.show_gallery ?? true,
          show_guest_messages: data.showGuestMessages ?? currentContent.features?.section_visibility?.show_guest_messages ?? false,
          show_music: data.showMusic ?? currentContent.features?.section_visibility?.show_music ?? true,
        },
      },
    };

    // Update invitation
    const { error: updateError } = await (supabase
      .from('invitations') as any)
      .update({ content: updatedContent })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Error updating invitation:', updateError);
      return { success: false, error: 'Error al actualizar la invitación' };
    }

    return { success: true };
  } catch (error) {
    console.error('Update invitation error:', error);
    return { success: false, error: 'Error inesperado' };
  }
}
