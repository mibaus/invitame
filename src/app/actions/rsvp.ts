'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Crear cliente Supabase para Server Actions
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export interface RSVPFormData {
  invitationId: string;
  name: string;
  email?: string;
  phone?: string;
  attendance: boolean;
  guestsCount: number;
  dietaryRestrictions?: string;
  menuNotes?: string;
  musicSuggestion?: string;
  message?: string;
  customAnswers?: Record<string, unknown>;
}

export interface RSVPResult {
  success: boolean;
  error?: string;
  data?: {
    id: string;
    name: string;
  };
}

/**
 * Server Action para crear un RSVP
 * Se usa en Pro y Premium tiers
 */
export async function submitRSVP(formData: RSVPFormData): Promise<RSVPResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // En modo desarrollo sin Supabase, simular éxito
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
    console.log('[Dev Mode] RSVP simulado:', formData);
    return {
      success: true,
      data: {
        id: 'mock-rsvp-' + Date.now(),
        name: formData.name,
      },
    };
  }

  try {
    const supabase = getSupabase();

    const rsvpData = {
      invitation_id: formData.invitationId,
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      status: formData.attendance ? 'confirmed' : 'declined',
      attendance: formData.attendance,
      guests_count: formData.guestsCount,
      dietary_restrictions: formData.dietaryRestrictions || null,
      menu_notes: formData.menuNotes || null,
      music_suggestion: formData.musicSuggestion || null,
      message: formData.message || null,
      custom_answers: formData.customAnswers || {},
    };

    const { data, error } = await supabase
      .from('rsvps')
      .insert(rsvpData)
      .select('id, name')
      .single();

    if (error) {
      console.error('[Supabase] Error al crear RSVP:', error);
      return {
        success: false,
        error: 'No pudimos registrar tu confirmación. Por favor intenta de nuevo.',
      };
    }

    // Revalidate dashboard to show new RSVP
    revalidatePath('/dashboard/[slug]', 'page');

    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
      },
    };
  } catch (error) {
    console.error('[RSVP Action] Error:', error);
    return {
      success: false,
      error: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
    };
  }
}

/**
 * Server Action para obtener RSVPs de una invitación
 */
export async function getInvitationRSVPs(invitationId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
    return { success: true, data: [] };
  }

  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('[RSVP Action] Error fetching RSVPs:', error);
    return { success: false, error: 'Error al obtener confirmaciones' };
  }
}

interface RSVPRecord {
  status: string;
  guests_count: number | null;
}

/**
 * Server Action para obtener estadísticas de RSVP
 */
export async function getRSVPStats(invitationId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
    return {
      success: true,
      data: { total: 0, confirmed: 0, declined: 0, totalGuests: 0 },
    };
  }

  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('rsvps')
      .select('status, guests_count')
      .eq('invitation_id', invitationId);

    if (error) {
      return { success: false, error: error.message };
    }

    const records = (data || []) as RSVPRecord[];
    const stats = {
      total: records.length,
      confirmed: records.filter((r) => r.status === 'confirmed').length,
      declined: records.filter((r) => r.status === 'declined').length,
      totalGuests: records
        .filter((r) => r.status === 'confirmed')
        .reduce((sum: number, r) => sum + (r.guests_count || 1), 0),
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('[RSVP Action] Error fetching stats:', error);
    return { success: false, error: 'Error al obtener estadísticas' };
  }
}
