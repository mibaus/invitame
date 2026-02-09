'use server';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { PREVIEW_IMAGES } from '@/lib/constants';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('tu-proyecto'));
}

function generateTemporarySlug(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `test-${timestamp}-${random}`;
}

/**
 * Crea un registro de invitación de boda completo en la base de datos
 * para testing con datos realistas
 */
export async function seedTestWedding() {
  if (!isConfigured()) {
    return {
      success: false,
      error: 'Supabase no está configurado. Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY',
    };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    // 1. Crear cliente de prueba
    const clientData = {
      full_name: 'María González & Carlos Rodríguez',
      email: 'mariaycarlos.test@example.com',
      phone: '+54 11 1234 5678',
      onboarding_completed: true,
    };

    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert(clientData as any)
      .select()
      .single();

    if (clientError) {
      console.error('Error creating test client:', clientError);
      return { success: false, error: `Error al crear cliente: ${clientError.message}` };
    }

    // 2. Datos de la boda de prueba
    const weddingDate = '2026-06-15';
    const ceremonyTime = '18:00';

    const temporarySlug = generateTemporarySlug();

    // Contenido completo de la invitación
    const content = {
      headline: 'María & Carlos',
      subtitle: '¡Nos casamos!',
      main_message: 'Con mucha alegría queremos invitarte a compartir uno de los días más importantes de nuestras vidas. Tu presencia hará que este momento sea inolvidable. ¡Te esperamos!',
      cover_image: PREVIEW_IMAGES.cover,
      gallery_images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1520854221256-17451cc330e7?w=800&h=600&fit=crop',
      ],
      quote: {
        text: 'El amor no tiene cura, pero es la única cura para todos los males.',
        author: 'Leonard Cohen',
      },
      couple: {
        person1: { name: 'María', full_name: 'María Elena González' },
        person2: { name: 'Carlos', full_name: 'Carlos Alberto Rodríguez' },
        hashtag: '#MariaYCarlos2026',
        love_story: 'Nos conocimos hace 5 años en una fiesta de amigos. Desde el primer momento supimos que había algo especial entre nosotros. Después de viajes, risas, aventuras y mucho amor, decidimos dar este paso juntos.',
      },
      logistics: {
        event_date: `${weddingDate}T${ceremonyTime}:00`,
        timezone: 'America/Argentina/Buenos_Aires',
        agenda: [
          { id: 'agenda_1', time: '18:00', title: 'Ceremonia', description: 'Ceremonia religiosa en la Iglesia', icon: 'church' },
          { id: 'agenda_2', time: '19:00', title: 'Cóctel de Bienvenida', description: 'Drinks y aperitivos en el jardín', icon: 'wine' },
          { id: 'agenda_3', time: '20:30', title: 'Cena', description: 'Cena principal en el salón', icon: 'utensils' },
          { id: 'agenda_4', time: '22:30', title: 'Fiesta!', description: 'Baile y celebración hasta el amanecer', icon: 'music' },
        ],
        venues: [
          {
            id: 'ceremony',
            name: 'Iglesia Catedral San Isidro',
            type: 'ceremony',
            address: 'Av. del Libertador 16200, San Isidro, Buenos Aires',
            city: 'San Isidro',
            google_maps_url: 'https://maps.google.com/?q=Iglesia+Catedral+San+Isidro',
            time: ceremonyTime,
            coordinates: { lat: -34.4728, lng: -58.5068 },
          },
          {
            id: 'reception',
            name: 'Estancia La Paz',
            type: 'reception',
            address: 'Ruta 8, km 45, Pilar, Buenos Aires',
            city: 'Pilar',
            google_maps_url: 'https://maps.google.com/?q=Estancia+La+Paz+Pilar',
            time: '19:00',
            coordinates: { lat: -34.45, lng: -58.9167 },
          },
        ],
        dress_code: {
          code: 'formal',
          description: 'Elegante. Traje oscuro para caballeros, vestido largo o cocktail para damas.',
        },
      },
      features: {
        show_hero: true,
        show_countdown: true,
        show_agenda: true,
        show_venue_map: true,
        show_dress_code: true,
        show_gift_registry: true,
        show_rsvp: true,
        show_gallery: true,
        show_music: true,
        show_guest_messages: true,
        rsvp: {
          enabled: true,
          deadline: '2026-05-15',
          max_companions: 2,
          allow_children: true,
          dietary_options: ['Vegetariano', 'Vegano', 'Sin TACC', 'Kosher'],
          confirmation_message: '¡Gracias por confirmar! Nos vemos en la boda. No olvides anotar la fecha en tu calendario.',
        },
        gift_registry: {
          enabled: true,
          message: 'Tu presencia es el mejor regalo que podemos recibir. Si deseas hacernos un presente, hemos preparado una cuenta para nuestra luna de miel.',
          bank_details: {
            bank_name: 'Banco Santander Río',
            account_holder: 'María Elena González',
            account_number: 'CBU: 0720013220000001234567',
          },
        },
        music: {
          enabled: true,
          track_url: null,
          spotify_playlist_url: 'https://open.spotify.com/playlist/37i9dQZF1DX4wta20PHgda',
          autoplay: false,
        },
        guestbook: {
          enabled: true,
          moderated: true,
        },
      },
    };

    // 3. Crear invitación
    const invitationData = {
      onboarding_client_id: (client as any).id,
      slug: temporarySlug,
      skin_id: 'bolt-dark',
      event_type: 'wedding',
      content: content,
      is_active: true,
      language: 'es',
    };

    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .insert(invitationData as any)
      .select()
      .single();

    if (invitationError) {
      console.error('Error creating test invitation:', invitationError);
      return { success: false, error: `Error al crear invitación: ${invitationError.message}` };
    }

    // 4. Crear algunos RSVPs de ejemplo
    const sampleRSVPs = [
      { name: 'Ana García', attendance: true, guests_count: 2, status: 'confirmed' },
      { name: 'Juan Martínez', attendance: true, guests_count: 1, status: 'confirmed' },
      { name: 'Laura Fernández', attendance: false, guests_count: 0, status: 'declined' },
      { name: 'Pedro López', attendance: true, guests_count: 3, status: 'confirmed' },
    ];

    for (const rsvp of sampleRSVPs) {
      await supabase.from('rsvps').insert({
        invitation_id: (invitation as any).id,
        ...rsvp,
        email: `${rsvp.name.toLowerCase().replace(' ', '.')}@example.com`,
      } as any);
    }

    return {
      success: true,
      message: 'Invitación de prueba creada exitosamente',
      data: {
        clientId: (client as any).id,
        invitationId: (invitation as any).id,
        slug: temporarySlug,
        url: `/${temporarySlug}`,
        dashboardUrl: `/dashboard/${temporarySlug}`,
      },
    };
  } catch (error) {
    console.error('Seed error:', error);
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Unknown'}`,
    };
  }
}

/**
 * Elimina el registro de prueba creado
 */
export async function cleanupTestWedding(slug: string) {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase no está configurado' };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    // Buscar invitación por slug
    const { data: invitation } = await supabase
      .from('invitations')
      .select('id, onboarding_client_id')
      .eq('slug', slug)
      .single();

    if (!invitation) {
      return { success: false, error: 'Invitación no encontrada' };
    }

    const invitationId = (invitation as any).id;
    const clientId = (invitation as any).onboarding_client_id;

    // Eliminar RSVPs
    await supabase.from('rsvps').delete().eq('invitation_id', invitationId);

    // Eliminar invitación
    await supabase.from('invitations').delete().eq('id', invitationId);

    // Eliminar cliente
    if (clientId) {
      await supabase.from('clients').delete().eq('id', clientId);
    }

    return { success: true, message: 'Datos de prueba eliminados' };
  } catch (error) {
    console.error('Cleanup error:', error);
    return {
      success: false,
      error: `Error al limpiar: ${error instanceof Error ? error.message : 'Unknown'}`,
    };
  }
}
