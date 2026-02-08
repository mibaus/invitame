'use server';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('tu-proyecto'));
}

export interface RSVPRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: 'pending' | 'confirmed' | 'declined' | 'maybe';
  attendance: boolean | null;
  guests_count: number;
  children_count: number;
  dietary_restrictions: string | null;
  menu_notes: string | null;
  music_suggestion: string | null;
  custom_answers: Record<string, unknown> | null;
  message: string | null;
  created_at: string;
}

export interface DashboardData {
  invitation: {
    id: string;
    slug: string;
    tier: string;
    skin_id: string;
    event_type: string;
    is_active: boolean;
    headline: string;
    event_date: string | null;
    content: Record<string, any>;
  };
  rsvps: RSVPRecord[];
  stats: {
    totalGuests: number;
    totalFamilies: number;
    confirmed: number;
    declined: number;
    specialMenus: number;
    musicSuggestions: number;
  };
}

export async function getDashboardData(slug: string): Promise<{
  success: boolean;
  data?: DashboardData;
  error?: string;
}> {
  if (!isConfigured()) {
    // Dev mode - return mock data
    return {
      success: true,
      data: {
        invitation: {
          id: 'demo-inv-1',
          slug: slug,
          tier: 'premium',
          skin_id: 'celestial-noir',
          event_type: 'wedding',
          is_active: true,
          headline: 'María & Carlos',
          event_date: '2025-06-15T18:00:00',
          content: {
            headline: 'María & Carlos',
            subtitle: 'Nos casamos',
            main_message: 'Te invitamos a celebrar nuestra boda',
            couple: {
              person1: { name: 'María' },
              person2: { name: 'Carlos' },
            },
            logistics: {
              event_date: '2025-06-15T18:00:00',
              venues: [
                { type: 'ceremony', name: 'Iglesia San Juan', address: 'Calle Principal 123', google_maps_url: '' },
                { type: 'reception', name: 'Salón Grand Ballroom', address: 'Av. Las Flores 456', google_maps_url: '' },
              ],
              dress_code: { code: 'Formal', description: 'Traje de gala' },
            },
            features: {
              rsvp: { enabled: true, max_companions: 2, allow_children: true },
              gift_registry: { enabled: true, message: 'Tu presencia es nuestro mejor regalo' },
              music: { enabled: true },
            },
          },
        },
        rsvps: [
          {
            id: '1',
            name: 'Juan Pérez',
            email: 'juan@email.com',
            phone: '+54 11 1234 5678',
            status: 'confirmed',
            attendance: true,
            guests_count: 3,
            children_count: 1,
            dietary_restrictions: 'Vegetariano',
            menu_notes: null,
            music_suggestion: 'Despacito',
            custom_answers: { 'suggested_song': 'Vivo por Ella', 'transport': 'Bus' },
            message: '¡Felicidades!',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Ana García',
            email: 'ana@email.com',
            phone: null,
            status: 'confirmed',
            attendance: true,
            guests_count: 2,
            children_count: 0,
            dietary_restrictions: null,
            menu_notes: 'Sin gluten',
            music_suggestion: null,
            custom_answers: { 'table_preference': 'Mesa cercana a la pista' },
            message: 'Los quiero mucho',
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Pedro López',
            email: 'pedro@email.com',
            phone: '+54 11 9876 5432',
            status: 'declined',
            attendance: false,
            guests_count: 1,
            children_count: 0,
            dietary_restrictions: null,
            menu_notes: null,
            music_suggestion: null,
            custom_answers: null,
            message: 'Lo siento, no puedo asistir',
            created_at: new Date().toISOString(),
          },
          {
            id: '4',
            name: 'Laura Martínez',
            email: 'laura@email.com',
            phone: null,
            status: 'confirmed',
            attendance: true,
            guests_count: 4,
            children_count: 2,
            dietary_restrictions: 'Celíaco',
            menu_notes: null,
            music_suggestion: 'La Bamba',
            custom_answers: { 'allergies': 'Frutos secos', 'drink_preference': 'Vino tinto' },
            message: null,
            created_at: new Date().toISOString(),
          },
        ],
        stats: {
          totalGuests: 10,
          totalFamilies: 4,
          confirmed: 9,
          declined: 1,
          specialMenus: 3,
          musicSuggestions: 2,
        },
      },
    };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    // Get invitation by slug
    const { data: invitation, error: invError } = await (supabase
      .from('invitations') as any)
      .select('id, slug, tier, skin_id, event_type, is_active, content')
      .eq('slug', slug)
      .single();

    if (invError || !invitation) {
      return { success: false, error: 'Invitación no encontrada' };
    }

    // Get all RSVPs for this invitation
    const { data: rsvps, error: rsvpError } = await (supabase
      .from('rsvps') as any)
      .select('*')
      .eq('invitation_id', invitation.id)
      .order('created_at', { ascending: false });

    if (rsvpError) {
      console.error('Error fetching RSVPs:', rsvpError);
      return { success: false, error: 'Error al obtener confirmaciones' };
    }

    const rsvpList: RSVPRecord[] = (rsvps || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      status: r.status === 'pending' ? 'confirmed' : r.status,
      attendance: r.attendance === null ? true : r.attendance,
      guests_count: r.guests_count || 1,
      children_count: r.children_count || 0,
      dietary_restrictions: r.dietary_restrictions,
      menu_notes: r.menu_notes,
      music_suggestion: r.music_suggestion,
      custom_answers: r.custom_answers,
      message: r.message,
      created_at: r.created_at,
    }));

    // Calculate stats
    const confirmedRsvps = rsvpList.filter(r => r.attendance === true);
    const declinedRsvps = rsvpList.filter(r => r.attendance === false);
    
    const totalGuests = confirmedRsvps.reduce((sum, r) => sum + r.guests_count, 0);
    const specialMenus = rsvpList.filter(r => 
      r.dietary_restrictions || r.menu_notes
    ).length;
    const musicSuggestions = rsvpList.filter(r => r.music_suggestion).length;

    const content = invitation.content as Record<string, any>;

    return {
      success: true,
      data: {
        invitation: {
          id: invitation.id,
          slug: invitation.slug,
          tier: invitation.tier,
          skin_id: invitation.skin_id,
          event_type: invitation.event_type,
          is_active: invitation.is_active,
          headline: content?.headline || 'Mi Evento',
          event_date: content?.logistics?.event_date || null,
          content: content,
        },
        rsvps: rsvpList,
        stats: {
          totalGuests,
          totalFamilies: rsvpList.length,
          confirmed: confirmedRsvps.reduce((sum, r) => sum + r.guests_count, 0),
          declined: declinedRsvps.length,
          specialMenus,
          musicSuggestions,
        },
      },
    };
  } catch (error) {
    console.error('Dashboard error:', error);
    return { success: false, error: 'Error inesperado' };
  }
}

export async function getRSVPs(invitationId: string): Promise<{
  success: boolean;
  rsvps?: RSVPRecord[];
  stats?: DashboardData['stats'];
  error?: string;
}> {
  if (!isConfigured()) {
    // Dev mode - return mock data
    return {
      success: true,
      rsvps: [
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan@email.com',
          phone: '+54 11 1234 5678',
          status: 'confirmed',
          attendance: true,
          guests_count: 3,
          children_count: 1,
          dietary_restrictions: 'Vegetariano',
          menu_notes: null,
          music_suggestion: 'Despacito',
          custom_answers: { 'suggested_song': 'Vivo por Ella', 'transport': 'Bus' },
          message: '¡Felicidades!',
          created_at: new Date().toISOString(),
        },
      ],
      stats: {
        totalGuests: 10,
        totalFamilies: 4,
        confirmed: 9,
        declined: 1,
        specialMenus: 3,
        musicSuggestions: 2,
      },
    };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    const { data: rsvps, error: rsvpError } = await (supabase
      .from('rsvps') as any)
      .select('*')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: false });

    if (rsvpError) {
      console.error('Error fetching RSVPs:', rsvpError);
      return { success: false, error: 'Error al obtener confirmaciones' };
    }

    const rsvpList: RSVPRecord[] = (rsvps || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      status: r.status === 'pending' ? 'confirmed' : r.status,
      attendance: r.attendance === null ? true : r.attendance,
      guests_count: r.guests_count || 1,
      children_count: r.children_count || 0,
      dietary_restrictions: r.dietary_restrictions,
      menu_notes: r.menu_notes,
      music_suggestion: r.music_suggestion,
      custom_answers: r.custom_answers,
      message: r.message,
      created_at: r.created_at,
    }));

    // Calculate stats
    const confirmedRsvps = rsvpList.filter(r => r.attendance === true);
    const declinedRsvps = rsvpList.filter(r => r.attendance === false);
    const specialMenus = rsvpList.filter(r => r.dietary_restrictions || r.menu_notes).length;
    const musicSuggestions = rsvpList.filter(r => r.music_suggestion).length;

    return {
      success: true,
      rsvps: rsvpList,
      stats: {
        totalGuests: confirmedRsvps.reduce((sum, r) => sum + r.guests_count, 0),
        totalFamilies: rsvpList.length,
        confirmed: confirmedRsvps.reduce((sum, r) => sum + r.guests_count, 0),
        declined: declinedRsvps.length,
        specialMenus,
        musicSuggestions,
      },
    };
  } catch (error) {
    console.error('getRSVPs error:', error);
    return { success: false, error: 'Error inesperado' };
  }
}
