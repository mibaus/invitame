'use client';

import { useEffect, useState } from 'react';
import { MasterLayout } from '@/components/layouts/MasterLayout';
import { InvitationSchema, SkinId } from '@/types';

export function PreviewClient() {
  const [invitation, setInvitation] = useState<InvitationSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waitingForPostMessage, setWaitingForPostMessage] = useState(false);

  // Initialize data from URL synchronously if possible to avoid flash of loading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Extraer skinId de la URL
    const pathParts = window.location.pathname.split('/');
    const skinIdFromUrl = pathParts[pathParts.length - 1] as SkinId;

    // Intentar leer datos de query params
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');

    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam)) as InvitationSchema;

        // Check if data contains placeholder images or logistics that need full data via postMessage
        const hasPlaceholderData =
          parsed.content?.cover_image === '__POSTMESSAGE_DATA__' ||
          (Array.isArray(parsed.content?.gallery_images) && parsed.content.gallery_images.some((img: string) => img === '__POSTMESSAGE_DATA__')) ||
          (Array.isArray(parsed.logistics?.agenda) && parsed.logistics.agenda.some((item: any) => item === '__POSTMESSAGE_DATA__')) ||
          (Array.isArray(parsed.logistics?.venues) && parsed.logistics.venues.some((item: any) => item === '__POSTMESSAGE_DATA__'));

        if (hasPlaceholderData) {
          console.log('[PreviewClient] Datos tienen placeholders, esperando postMessage...');
          setWaitingForPostMessage(true);
          setInvitation(parsed);
          // Keep isLoading=true until postMessage arrives
        } else {
          setInvitation(parsed);
          setIsLoading(false);
        }
      } catch (e) {
        console.log('[PreviewClient] Error parseando datos de URL:', e);
        const defaultData = createDefaultData(skinIdFromUrl || 'avant-garde-editorial');
        setInvitation(defaultData);
        setIsLoading(false);
      }
    } else {
      // Si no hay dataParam, usar default inmediatamente
      const defaultData = createDefaultData(skinIdFromUrl || 'avant-garde-editorial');
      setInvitation(defaultData);
      setIsLoading(false);
    }

    // Listen for postMessage with full data
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'INVITATION_DATA' && event.data?.data) {
        console.log('[PreviewClient] Recibido datos completos via postMessage');
        setInvitation(event.data.data);
        setIsLoading(false);
        setWaitingForPostMessage(false);
      }
    };

    window.addEventListener('message', handleMessage);

    // Notify parent that we're ready
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (isLoading || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
          <span className="text-sm text-gray-500">
            {waitingForPostMessage ? 'Cargando imágenes...' : 'Cargando...'}
          </span>
        </div>
      </div>
    );
  }

  return <MasterLayout invitation={invitation} preview={true} />;
}

function createDefaultData(skinId: SkinId): InvitationSchema {
  const now = new Date();
  const eventDate = new Date(now.getFullYear() + 1, 7, 22);

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
      subtitle: 'Te invitamos a celebrar',
      main_message: 'Que todas nuestras noches sean aventuras...',
      couple: {
        person1: { name: 'María', full_name: 'María González' },
        person2: { name: 'Carlos', full_name: 'Carlos Rodríguez' },
        hashtag: '#MariaYCarlos',
      },
      hosts: [],
      cover_image: 'https://images.pexels.com/photos/1573007/pexels-photo-1573007.jpeg?auto=compress&cs=tinysrgb&w=1920',
      gallery_images: [],
      quote: { text: 'Nuestro amor es eterno', author: 'Anónimo' },
    },
    logistics: {
      event_date: eventDate.toISOString(),
      timezone: 'America/Argentina/Buenos_Aires',
      venues: [],
      agenda: [],
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
      rsvp: { enabled: true, max_companions: 2, allow_children: false },
    },
  };
}
