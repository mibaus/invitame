'use client';

import { OnboardingData } from '../types';
import { generateFantasyData } from '../lib/mock-fantasy-data';
import { MasterLayout } from '@/components/layouts/MasterLayout';
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
  
  const skinId = (formData.skinId as SkinId) || 'bolt-dark';
  
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
      quote: {
        text: formData.quote || fantasyData.quote,
        author: formData.quoteAuthor || fantasyData.quoteAuthor,
      },
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
  const invitation = createInvitationFromFormData(formData);
  const p1Name = formData.person1Name || 'Novia';
  const p2Name = formData.person2Name || 'Novio';
  
  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame - Smaller and positioned higher */}
      <div className="relative mx-auto w-[290px] lg:w-[290px] bg-black rounded-[2.5rem] border-[6px] border-black shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-xl z-50"></div>
        
        {/* Screen Content */}
        <div className="relative w-full h-[520px] lg:h-[580px] overflow-hidden bg-white">
          <div className="w-[290px] h-full overflow-y-auto scrollbar-hide origin-top-left">
            <MasterLayout invitation={invitation} preview={true} />
          </div>
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
