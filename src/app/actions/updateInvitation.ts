'use server';

import { createClient } from '@supabase/supabase-js';
import type { Database, InvitationContent } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('tu-proyecto'));
}

export interface UpdateInvitationData {
  headline?: string;
  subtitle?: string;
  mainMessage?: string;
  eventDate?: string;
  eventTime?: string;
  person1Name?: string;
  person2Name?: string;
  coupleHashtag?: string;
  ceremonyName?: string;
  ceremonyAddress?: string;
  ceremonyTime?: string;
  ceremonyMapsUrl?: string;
  receptionName?: string;
  receptionAddress?: string;
  receptionTime?: string;
  receptionMapsUrl?: string;
  dressCode?: string;
  dressCodeDescription?: string;
  quote?: string;
  quoteAuthor?: string;
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  giftRegistryMessage?: string;
  mercadoLibreUrl?: string;
  spotifyPlaylistUrl?: string;
  rsvpDeadline?: string;
  maxCompanions?: number;
  allowChildren?: boolean;
  rsvpConfirmationMessage?: string;
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
      headline: data.headline || currentContent.headline,
      subtitle: data.subtitle || currentContent.subtitle,
      main_message: data.mainMessage || currentContent.main_message,
      quote: data.quote ? {
        text: data.quote,
        author: data.quoteAuthor || currentContent.quote?.author,
      } : currentContent.quote,
      couple: currentContent.couple ? {
        ...currentContent.couple,
        person1: {
          ...currentContent.couple.person1,
          name: data.person1Name || currentContent.couple.person1.name,
        },
        person2: {
          ...currentContent.couple.person2,
          name: data.person2Name || currentContent.couple.person2.name,
        },
        hashtag: data.coupleHashtag || currentContent.couple.hashtag,
      } : currentContent.couple,
      logistics: {
        ...currentContent.logistics,
        event_date: data.eventDate && data.eventTime
          ? `${data.eventDate}T${data.eventTime}:00`
          : currentContent.logistics?.event_date,
        venues: [
          ...(currentContent.logistics?.venues?.filter((v: any) => v.type !== 'ceremony') || []),
          ...(data.ceremonyName ? [{
            id: 'ceremony',
            name: data.ceremonyName,
            type: 'ceremony' as const,
            address: data.ceremonyAddress || '',
            city: '',
            google_maps_url: data.ceremonyMapsUrl,
          } as any] : []),
          ...(currentContent.logistics?.venues?.filter((v: any) => v.type !== 'reception') || []),
          ...(data.receptionName ? [{
            id: 'reception',
            name: data.receptionName,
            type: 'reception' as const,
            address: data.receptionAddress || '',
            city: '',
            google_maps_url: data.receptionMapsUrl,
          } as any] : []),
        ],
        dress_code: data.dressCode ? {
          code: data.dressCode,
          description: data.dressCodeDescription,
        } : currentContent.logistics?.dress_code,
      },
      features: {
        ...currentContent.features,
        rsvp: {
          ...currentContent.features?.rsvp,
          deadline: data.rsvpDeadline || currentContent.features?.rsvp?.deadline,
          max_companions: data.maxCompanions ?? currentContent.features?.rsvp?.max_companions,
          allow_children: data.allowChildren ?? currentContent.features?.rsvp?.allow_children,
          confirmation_message: data.rsvpConfirmationMessage || currentContent.features?.rsvp?.confirmation_message,
        },
        gift_registry: {
          enabled: true,
          ...currentContent.features?.gift_registry,
          message: data.giftRegistryMessage || currentContent.features?.gift_registry?.message,
          bank_details: data.bankName ? {
            bank_name: data.bankName,
            account_holder: data.bankAccountHolder || '',
            account_number: data.bankAccountNumber || '',
          } : currentContent.features?.gift_registry?.bank_details,
          registries: data.mercadoLibreUrl ? [
            ...(currentContent.features?.gift_registry?.registries?.filter((r: any) => r.id !== 'mercadolibre') || []),
            {
              id: 'mercadolibre',
              platform: 'Mercado Libre',
              name: 'Lista de Regalos',
              url: data.mercadoLibreUrl,
            }
          ] : currentContent.features?.gift_registry?.registries,
        },
        music: {
          enabled: true,
          ...currentContent.features?.music,
          spotify_playlist_url: data.spotifyPlaylistUrl || currentContent.features?.music?.spotify_playlist_url,
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
