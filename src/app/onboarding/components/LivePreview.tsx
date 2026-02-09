'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { OnboardingData } from '../types';
import { generateFantasyData } from '../lib/mock-fantasy-data';
import { InvitationSchema, SkinId, VenueLocation, AgendaItem as SchemaAgendaItem } from '@/types';

interface LivePreviewProps {
  formData: Partial<OnboardingData>;
  className?: string;
}

function createInvitationFromFormData(formData: Partial<OnboardingData>): InvitationSchema {
  const fantasyData = generateFantasyData(formData);

  const p1Name = formData.person1Name || fantasyData.person1Name;
  const p2Name = formData.person2Name || fantasyData.person2Name;
  const headline = formData.headline || fantasyData.headline;
  const mainMsg = formData.mainMessage || fantasyData.mainMessage;
  const eventDate = formData.eventDate || fantasyData.eventDate;

  const showAgenda = formData.showAgenda !== false;
  const showVenue = formData.showVenueMap !== false;
  const showGifts = formData.showGiftRegistry !== false;
  const showRSVP = formData.showRSVP !== false;
  const showGallery = formData.showGallery !== false;
  const showMusic = formData.showMusic !== false;
  const showDressCode = formData.showDressCode !== false;
  const showCountdown = formData.showCountdown !== false;

  const skinId = (formData.skinId as SkinId) || 'avant-garde-editorial';

  const agendaItems: SchemaAgendaItem[] = (formData.agendaItems || []).map((item, idx) => ({
    id: item.id || `item-${idx}`,
    time: item.time,
    title: item.title,
    description: '',
    icon: (item.icon as any) || 'sparkles',
  }));

  const venues: VenueLocation[] = [];
  if (showVenue && (formData.ceremonyName || fantasyData.ceremonyName)) {
    venues.push({
      id: 'ceremony-1',
      name: formData.ceremonyName || fantasyData.ceremonyName,
      type: 'ceremony',
      address: formData.ceremonyAddress || fantasyData.ceremonyAddress,
      city: 'Buenos Aires',
      country: 'Argentina',
      coordinates: { lat: -34.6037, lng: -58.3816 },
      google_maps_url: formData.ceremonyMapsUrl || 'https://maps.google.com',
    });
  }
  if (showVenue && (formData.receptionName || fantasyData.receptionName)) {
    venues.push({
      id: 'reception-1',
      name: formData.receptionName || fantasyData.receptionName,
      type: 'reception',
      address: formData.receptionAddress || fantasyData.receptionAddress,
      city: 'Buenos Aires',
      country: 'Argentina',
      coordinates: { lat: -34.6037, lng: -58.3816 },
      google_maps_url: formData.receptionMapsUrl || 'https://maps.google.com',
    });
  }

  const invitation: InvitationSchema = {
    metadata: {
      id: 'preview-001',
      slug: formData.slug || 'preview-boda',
      skin_id: skinId,
      event_type: (formData.eventType as any) || 'wedding',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      owner_id: 'preview-user',
      language: 'es',
    },
    content: {
      headline: headline,
      subtitle: 'Nos casamos',
      main_message: mainMsg,
      couple: {
        person1: { name: p1Name, full_name: p1Name },
        person2: { name: p2Name, full_name: p2Name },
        hashtag: `#${p1Name.replace(/\s/g, '')}Y${p2Name.replace(/\s/g, '')}2025`,
        love_story: mainMsg,
      },
      hosts: [
        { name: 'Padres de la novia', relation: 'Anfitriones' },
        { name: 'Padres del novio', relation: 'Anfitriones' },
      ],
      cover_image: formData.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      gallery_images: formData.galleryImages?.length ? formData.galleryImages : [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      ],
      quote: formData.quote ? {
        text: formData.quote,
        author: formData.quoteAuthor || fantasyData.quoteAuthor,
      } : undefined,
    },
    logistics: {
      event_date: eventDate,
      timezone: 'America/Argentina/Buenos_Aires',
      agenda: agendaItems,
      venues: venues,
      dress_code: showDressCode ? {
        code: (formData.dressCode as any) || 'formal',
        description: formData.dressCodeDescription || fantasyData.dressCodeDescription,
      } : undefined,
    },
    features: {
      show_hero: formData.showHero ?? true,
      show_countdown: showCountdown,
      show_agenda: showAgenda,
      show_venue_map: showVenue,
      show_ceremony: formData.showCeremony ?? true,
      show_reception: formData.showReception ?? true,
      show_dress_code: showDressCode,
      show_gift_registry: showGifts,
      show_rsvp: showRSVP,
      show_guest_messages: formData.showGuestMessages ?? false,
      show_gallery: showGallery,
      show_music: showMusic,
      rsvp: {
        enabled: showRSVP,
        deadline: formData.rsvpDeadline || fantasyData.rsvpDeadline,
        max_companions: formData.maxCompanions || 2,
        allow_children: formData.allowChildren ?? true,
        custom_questions: [],
        confirmation_message: formData.rsvpConfirmationMessage || fantasyData.rsvpConfirmationMessage,
      },
      gift_registry: showGifts ? {
        enabled: true,
        message: formData.giftRegistryMessage || fantasyData.giftRegistryMessage,
        bank_details: {
          bank_name: formData.bankName || fantasyData.bankName,
          account_holder: formData.bankAccountHolder || p1Name,
          account_number: formData.bankAccountNumber || fantasyData.bankAccountNumber,
          alias: 'boda.fantasia',
        },
      } : undefined,
      music: showMusic ? {
        enabled: true,
        autoplay: false,
        track_url: formData.musicTrackUrl,
        spotify_playlist_url: formData.spotifyPlaylistUrl,
      } : undefined,
    },
  };

  return invitation;
}

export function LivePreview({ formData, className = '' }: LivePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeDataRef = useRef<InvitationSchema | null>(null);

  // Extraer skinId directamente de formData
  const skinId = formData.skinId || 'avant-garde-editorial';

  // Crear invitation directamente
  const invitation = useMemo(() => createInvitationFromFormData(formData), [
    formData.skinId,
    formData.headline,
    formData.person1Name,
    formData.person2Name,
    formData.eventDate,
    formData.mainMessage,
    formData.ceremonyName,
    formData.ceremonyAddress,
    formData.receptionName,
    formData.receptionAddress,
    formData.quote,
    formData.coverImage,
    formData.galleryImages?.length,
    formData.agendaItems?.length,
    formData.dressCode,
    formData.dressCodeDescription,
    formData.showDressCode,
    formData.showHero,
    formData.showCountdown,
    formData.showAgenda,
    formData.showVenueMap,
    formData.showGallery,
    formData.showGiftRegistry,
    formData.showRSVP,
    formData.showGuestMessages,
  ]);

  // Inicialización inmediata al montar (sin debounce)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const invitationJson = JSON.stringify(invitation);
    lastDataRef.current = invitationJson;

    const baseUrl = `/preview/${skinId}`;
    const dataParam = encodeURIComponent(invitationJson);
    const newUrl = `${baseUrl}?data=${dataParam}`;

    console.log('[LivePreview] Inicialización inmediata con skin:', skinId);
    setIframeUrl(newUrl);
  }, []); // Solo al montar

  // Generar URL con debounce para actualizaciones posteriores
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const invitationJson = JSON.stringify(invitation);

    // Solo actualizar si los datos realmente cambiaron
    if (lastDataRef.current === invitationJson) return;

    // Cancelar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce para evitar recargas constantes - 500ms para imágenes
    timeoutRef.current = setTimeout(() => {
      lastDataRef.current = invitationJson;
      const baseUrl = `/preview/${skinId}`;

      // Check if data is too large for URL (limit ~8KB)
      let dataParam: string;
      const MAX_URL_SIZE = 8000;

      // Only use postMessage if the URL size is getting too large (limit ~8KB)
      const usePostMessage = invitationJson.length > MAX_URL_SIZE;

      if (usePostMessage) {
        // For large data or Supabase images, use postMessage
        // Pass minimal data in URL and send full data via postMessage
        const minimalData = {
          ...invitation,
          content: {
            ...invitation.content,
            // Mark images as needing full data via postMessage
            cover_image: invitation.content?.cover_image ? '__POSTMESSAGE_DATA__' : '',
            gallery_images: invitation.content?.gallery_images?.length
              ? Array(invitation.content.gallery_images.length).fill('__POSTMESSAGE_DATA__')
              : [],
          },
          logistics: {
            ...invitation.logistics,
            // Mark large logistics arrays as needing full data
            agenda: invitation.logistics?.agenda?.length ? ['__POSTMESSAGE_DATA__'] : [],
            venues: invitation.logistics?.venues?.length ? ['__POSTMESSAGE_DATA__'] : [],
          }
        };
        dataParam = encodeURIComponent(JSON.stringify(minimalData));

        // Store full data in a ref for postMessage
        iframeDataRef.current = invitation;
      } else {
        dataParam = encodeURIComponent(invitationJson);
        iframeDataRef.current = null;
      }

      const newUrl = `${baseUrl}?data=${dataParam}`;

      console.log('[LivePreview] Actualizando iframe URL:', newUrl.substring(0, 100) + '...');
      setIframeUrl(newUrl);
      setIsLoading(true);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [invitation, skinId]);

  // Listen for messages from iframe (e.g., PREVIEW_READY)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_READY') {
        console.log('[LivePreview] Iframe ready, sending data if available');
        const fullData = iframeDataRef.current;
        if (fullData && iframeRef.current?.contentWindow) {
          console.log('[LivePreview] Sending full data via postMessage (preview ready)');
          iframeRef.current.contentWindow.postMessage({
            type: 'INVITATION_DATA',
            data: fullData
          }, '*');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  const p1Name = formData.person1Name || 'Novia';
  const p2Name = formData.person2Name || 'Novio';

  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame - Mobile View via iframe */}
      <div className="relative mx-auto w-[320px] bg-black rounded-[2.5rem] border-[6px] border-black shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-xl z-50"></div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-40 bg-white flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-3"></div>
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Cargando...</span>
          </div>
        )}

        {/* Screen - iframe */}
        <div className="w-full h-[600px] bg-white">
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              ref={iframeRef}
              className="w-full h-full border-0"
              style={{ width: '100%', height: '100%' }}
              scrolling="yes"
              onLoad={() => {
                setIsLoading(false);
                // Send full data via postMessage if we have it stored
                const fullData = iframeDataRef.current;
                if (fullData && iframeRef.current?.contentWindow) {
                  console.log('[LivePreview] Sending full data via postMessage');
                  iframeRef.current.contentWindow.postMessage({
                    type: 'INVITATION_DATA',
                    data: fullData
                  }, '*');
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
          Vista Previa • {p1Name} & {p2Name}
        </span>
      </div>
    </div>
  );
}
