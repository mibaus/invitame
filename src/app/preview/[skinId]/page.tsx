import { notFound } from 'next/navigation';
import { MasterLayout } from '@/components/layouts/MasterLayout';
import type { InvitationSchema, SkinId, EventType } from '@/types';
import type { Invitation } from '@/types/database';
import { createServerComponentClient } from '@/lib/supabase';
import { Suspense } from 'react';
import { PreviewClient } from './PreviewClient';

const VALID_SKINS: SkinId[] = ['avant-garde-editorial', 'japandi-zen', 'botanical-greenhouse'];

interface PageProps {
  params: Promise<{ skinId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

function transformToInvitationSchema(dbInvitation: Invitation): InvitationSchema {
  const content = dbInvitation.content as Record<string, any>;

  return {
    metadata: {
      id: dbInvitation.id,
      slug: dbInvitation.slug,
      skin_id: dbInvitation.skin_id as SkinId,
      event_type: dbInvitation.event_type as EventType,
      created_at: dbInvitation.created_at,
      updated_at: dbInvitation.updated_at,
      expires_at: dbInvitation.expires_at || undefined,
      is_active: dbInvitation.is_active,
      owner_id: dbInvitation.client_id || '',
      language: (dbInvitation.language as 'es' | 'en') || 'es',
    },
    content: {
      headline: content.headline || '',
      subtitle: content.subtitle,
      main_message: content.main_message || '',
      couple: content.couple,
      hosts: content.hosts,
      cover_image: content.cover_image || '',
      gallery_images: content.gallery_images,
      quote: content.quote,
    },
    logistics: content.logistics || {
      event_date: new Date().toISOString(),
      timezone: 'America/Argentina/Buenos_Aires',
      venues: [],
      agenda: [],
    },
    features: content.features || {
      show_rsvp: true,
      show_hero: true,
      show_countdown: true,
      show_agenda: true,
      show_venue_map: true,
      show_dress_code: true,
      show_gift_registry: true,
      show_gallery: true,
      show_music: true,
      show_guest_messages: false,
      rsvp: { enabled: true, max_companions: 2 },
      gift_registry: { enabled: false },
      music: { enabled: false },
      guestbook: { enabled: false },
    },
    skin_config: content.skin_config,
  };
}

async function getMockInvitationFromDB(skinId: SkinId): Promise<InvitationSchema | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
    return null;
  }

  try {
    const supabase = createServerComponentClient();
    // Buscar invitación de demo/prueba para este skin
    const { data: rawData, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('skin_id', skinId)
      .eq('is_demo', true)
      .single();

    if (error || !rawData) {
      // Si no hay demo, crear datos mock del lado del servidor
      return createServerMockData(skinId);
    }

    return transformToInvitationSchema(rawData as unknown as Invitation);
  } catch {
    return createServerMockData(skinId);
  }
}

function createServerMockData(skinId: SkinId): InvitationSchema {
  const now = new Date();
  const eventDate = new Date(now.getFullYear() + 1, 7, 22); // 22 de agosto del próximo año

  return {
    metadata: {
      id: `demo-${skinId}`,
      slug: `demo-${skinId}`,
      skin_id: skinId,
      event_type: 'wedding',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      is_active: true,
      owner_id: 'demo-client',
      language: 'es',
    },
    content: {
      headline: 'Nuestra Boda',
      subtitle: 'Te invitamos a celebrar este día especial',
      main_message: 'Que todas nuestras noches sean aventuras y que cada mañana sea un nuevo comienzo de este amor que hoy decidimos unir para siempre.',
      couple: {
        person1: { name: 'María', full_name: 'María González' },
        person2: { name: 'Carlos', full_name: 'Carlos Rodríguez' },
        hashtag: '#MariaYCarlos',
      },
      hosts: [],
      cover_image: skinId === 'bolt-dark'
        ? 'https://images.pexels.com/photos/1573007/pexels-photo-1573007.jpeg?auto=compress&cs=tinysrgb&w=1920'
        : 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop',
      gallery_images: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519225495810-7517c33000e1?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522673607200-16488321499b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
      ],
      quote: {
        text: 'Que todas nuestras noches sean aventuras y que cada mañana sea un nuevo comienzo de este amor que hoy decidimos unir para siempre.',
        author: 'Nuestro Voto Eterno',
      },
    },
    logistics: {
      event_date: eventDate.toISOString(),
      timezone: 'America/Argentina/Buenos_Aires',
      venues: [
        {
          id: 'demo-venue-1',
          name: 'Catedral Basílica de la Inmaculada',
          type: 'ceremony',
          address: 'Calle Real 123, Centro Histórico',
          city: 'Buenos Aires',
          country: 'Argentina',
          coordinates: { lat: -34.6037, lng: -58.3816 },
          google_maps_url: 'https://maps.google.com/?q=Catedral+Buenos+Aires',
          instructions: '17:00 HRS',
        },
        {
          id: 'demo-venue-2',
          name: 'Quinta Los Seraphines',
          type: 'reception',
          address: 'Camino al Valle 45, Sector Jardín',
          city: 'Buenos Aires',
          country: 'Argentina',
          coordinates: { lat: -34.6158, lng: -58.4338 },
          google_maps_url: 'https://maps.google.com/?q=Quinta+Los+Seraphines',
          instructions: '19:30 HRS',
        },
      ],
      agenda: [
        { id: 'demo-agenda-1', time: '17:00 HRS', title: 'La Ceremonia', description: 'Nuestros votos y unión sagrada', icon: 'heart' },
        { id: 'demo-agenda-2', time: '18:30 HRS', title: 'Cóctel de Bienvenida', description: 'Brindis inicial con música suave', icon: 'glass' },
        { id: 'demo-agenda-3', time: '20:00 HRS', title: 'El Banquete', description: 'Cena bajo la luz de las velas', icon: 'sparkles' },
        { id: 'demo-agenda-4', time: '22:00 HRS', title: 'El Baile', description: 'Celebración y alegría infinita', icon: 'music' },
      ],
      dress_code: {
        code: 'formal',
        description: 'Deseamos veros en vuestra mejor gala para celebrar este gran momento.',
      },
    },
    features: {
      show_hero: true,
      show_countdown: true,
      show_agenda: true,
      show_venue_map: true,
      show_ceremony: true,
      show_reception: true,
      show_dress_code: true,
      show_gift_registry: true,
      show_rsvp: true,
      show_gallery: true,
      show_music: true,
      show_guest_messages: false,
      rsvp: {
        enabled: true,
        max_companions: 2,
        allow_children: false,
        deadline: new Date(eventDate.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
      gift_registry: {
        enabled: true,
        message: 'Tu presencia es nuestro mejor regalo, pero si deseáis tener un detalle con nosotros, os agradecemos vuestro cariño a través de nuestro fondo de amor.',
        bank_details: {
          bank_name: 'Banco Demo',
          account_holder: 'María y Carlos',
          account_number: '0000003100094918237465',
          alias: 'MARIAYCARLOS.BODA',
        },
      },
      music: {
        enabled: true,
        autoplay: false,
        track_name: 'Perfect',
        artist: 'Ed Sheeran',
        spotify_playlist_url: 'https://open.spotify.com/playlist/37i9dQZF1DX4wtae0nzYul',
      },
    },
  };
}

async function getInvitationById(id: string): Promise<InvitationSchema | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
    return null;
  }

  try {
    const supabase = createServerComponentClient();
    const { data: rawData, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !rawData) {
      return null;
    }

    return transformToInvitationSchema(rawData as unknown as Invitation);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { skinId } = await params;

  if (isUUID(skinId)) {
    const invitation = await getInvitationById(skinId);
    if (invitation) {
      return {
        title: `Preview: ${invitation.content.headline} | Invita.me`,
      };
    }
  }

  return {
    title: `Preview: ${skinId} | Invita.me`,
  };
}

export default async function SkinPreviewPage({ params, searchParams }: PageProps) {
  const { skinId } = await params;
  const search = await searchParams;

  // Si hay datos en query params, usar PreviewClient
  if (search.data) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Cargando...</div>}>
        <PreviewClient />
      </Suspense>
    );
  }

  // Si es un UUID, buscar la invitación real
  if (isUUID(skinId)) {
    const invitation = await getInvitationById(skinId);
    if (invitation) {
      return (
        <MasterLayout invitation={invitation} preview={true} />
      );
    }
    notFound();
  }

  // Si es un skin_id, buscar datos mock de la base de datos
  if (!VALID_SKINS.includes(skinId as SkinId)) {
    notFound();
  }

  const previewInvitation = await getMockInvitationFromDB(skinId as SkinId);

  if (!previewInvitation) {
    notFound();
  }

  return (
    <MasterLayout invitation={previewInvitation} preview={true} />
  );
}
