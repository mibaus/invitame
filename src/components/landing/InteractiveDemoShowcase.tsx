'use client';

import React, { useState, useMemo } from 'react';
import { getAllSkins, SkinConfig } from '@/lib/skins';
import { InvitationSchema, SkinId } from '@/types';
import { generateFantasyData } from '@/app/onboarding/lib/mock-fantasy-data';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveDemoShowcaseProps {
  className?: string;
}

function createDemoInvitation(skinId: SkinId): InvitationSchema {
  const fantasyData = generateFantasyData({ skinId });
  const eventDate = new Date();
  eventDate.setMonth(eventDate.getMonth() + 3);

  return {
    metadata: {
      id: `demo-${skinId}`,
      slug: `demo-${skinId}`,
      skin_id: skinId,
      event_type: 'wedding',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      owner_id: 'demo-client',
      language: 'es',
    },
    content: {
      headline: fantasyData.headline,
      subtitle: 'Nos casamos',
      main_message: fantasyData.mainMessage,
      couple: {
        person1: { name: fantasyData.person1Name, full_name: fantasyData.person1Name },
        person2: { name: fantasyData.person2Name, full_name: fantasyData.person2Name },
        hashtag: `#${fantasyData.person1Name.replace(/\s/g, '')}Y${fantasyData.person2Name.replace(/\s/g, '')}2025`,
        love_story: fantasyData.mainMessage,
      },
      hosts: [
        { name: 'Padres de la novia', relation: 'Anfitriones' },
        { name: 'Padres del novio', relation: 'Anfitriones' },
      ],
      cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      gallery_images: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
        'https://images.unsplash.com/photo-1519225495810-7517c33000e1?q=80&w=800&q=80',
        'https://images.unsplash.com/photo-1522673607200-16488321499b?q=80&w=800&q=80',
      ],
      quote: {
        text: fantasyData.quote,
        author: fantasyData.quoteAuthor,
      },
    },
    logistics: {
      event_date: eventDate.toISOString(),
      timezone: 'America/Argentina/Buenos_Aires',
      venues: [
        {
          id: 'demo-venue-1',
          name: fantasyData.ceremonyName,
          type: 'ceremony',
          address: fantasyData.ceremonyAddress,
          city: 'Buenos Aires',
          country: 'Argentina',
          coordinates: { lat: -34.6037, lng: -58.3816 },
          google_maps_url: 'https://maps.google.com',
          instructions: '17:00 HRS',
        },
        {
          id: 'demo-venue-2',
          name: fantasyData.receptionName,
          type: 'reception',
          address: fantasyData.receptionAddress,
          city: 'Buenos Aires',
          country: 'Argentina',
          coordinates: { lat: -34.6158, lng: -58.4338 },
          google_maps_url: 'https://maps.google.com',
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
        description: fantasyData.dressCodeDescription,
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
        allow_children: true,
        deadline: new Date(eventDate.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        confirmation_message: fantasyData.rsvpConfirmationMessage,
      },
      gift_registry: {
        enabled: true,
        message: fantasyData.giftRegistryMessage,
        bank_details: {
          bank_name: fantasyData.bankName,
          account_holder: fantasyData.person1Name,
          account_number: fantasyData.bankAccountNumber,
          alias: 'boda.demo',
        },
      },
      music: {
        enabled: true,
        autoplay: false,
        spotify_playlist_url: 'https://open.spotify.com/playlist/37i9dQZF1DX4wtae0nzYul',
      },
    },
  };
}

function PhoneMockup({ skinId, invitation }: { skinId: SkinId; invitation: InvitationSchema }) {
  const iframeUrl = useMemo(() => {
    const baseUrl = `/preview/${skinId}`;
    const dataParam = encodeURIComponent(JSON.stringify(invitation));
    return `${baseUrl}?data=${dataParam}`;
  }, [skinId, invitation]);

  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative mx-auto w-[280px] bg-[#1a1a1a] rounded-[2rem] border-[4px] border-[#1a1a1a] shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1a1a1a] rounded-b-lg z-50"></div>
        
        {/* Screen */}
        <div className="w-full h-[520px] bg-white rounded-[1.5rem] overflow-hidden">
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            style={{ width: '100%', height: '100%' }}
            scrolling="yes"
            title={`Mobile preview - ${skinId}`}
          />
        </div>
      </div>
      
      {/* Reflection/Shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[200px] h-[20px] bg-black/20 blur-xl rounded-full"></div>
    </div>
  );
}

function DesktopMockup({ skinId, invitation }: { skinId: SkinId; invitation: InvitationSchema }) {
  const iframeUrl = useMemo(() => {
    const baseUrl = `/preview/${skinId}`;
    const dataParam = encodeURIComponent(JSON.stringify(invitation));
    return `${baseUrl}?data=${dataParam}`;
  }, [skinId, invitation]);

  // Desktop viewport width for proper responsive rendering
  const DESKTOP_WIDTH = 1280;
  const CONTAINER_WIDTH = 600;
  const scale = CONTAINER_WIDTH / DESKTOP_WIDTH;

  return (
    <div className="relative">
      {/* Desktop Frame */}
      <div 
        className="relative bg-[#1a1a1a] rounded-t-xl border-[6px] border-[#1a1a1a] shadow-2xl overflow-hidden mx-auto"
        style={{ width: CONTAINER_WIDTH }}
      >
        {/* Browser Chrome */}
        <div className="bg-[#2a2a2a] px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-[#1a1a1a] rounded-md px-3 py-1 text-xs text-gray-400 flex items-center gap-2 min-w-[200px] justify-center">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 8m0 0a8 8 0 00-16 0c0 4.991.339 8.678.99 11.132" />
              </svg>
              <span>vows.digital/tu-boda</span>
            </div>
          </div>
          <div className="w-16"></div>
        </div>
        
        {/* Screen with scaled iframe */}
        <div 
          className="bg-white overflow-hidden"
          style={{ 
            width: CONTAINER_WIDTH, 
            height: 450,
            position: 'relative'
          }}
        >
          <iframe
            src={iframeUrl}
            className="border-0"
            style={{ 
              width: DESKTOP_WIDTH, 
              height: 450 / scale,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0
            }}
            scrolling="yes"
            title={`Desktop preview - ${skinId}`}
          />
        </div>
      </div>
      
      {/* Monitor Stand */}
      <div className="relative" style={{ width: CONTAINER_WIDTH }}>
        <div className="mx-auto w-32 h-4 bg-[#2a2a2a] rounded-b-lg"></div>
        <div className="mx-auto w-48 h-2 bg-[#1a1a1a] rounded-b-xl mt-0.5"></div>
        <div className="mx-auto w-64 h-1 bg-black/20 blur-md mt-1 rounded-full"></div>
      </div>
    </div>
  );
}

function SkinSelector({ 
  skins, 
  activeSkin, 
  onSelect 
}: { 
  skins: SkinConfig[]; 
  activeSkin: SkinId; 
  onSelect: (skinId: SkinId) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {skins.map((skin) => (
        <button
          key={skin.id}
          onClick={() => onSelect(skin.id as SkinId)}
          className={`group relative px-4 py-3 rounded-xl transition-all duration-300 text-left min-w-[140px] ${
            activeSkin === skin.id
              ? 'bg-charcoal text-cloud shadow-lg scale-105'
              : 'bg-white text-charcoal hover:bg-stone-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-3">
            <div 
              className={`w-3 h-3 rounded-full transition-transform duration-300 ${
                activeSkin === skin.id ? 'scale-125' : 'group-hover:scale-110'
              }`}
              style={{ backgroundColor: skin.style.accent }}
            ></div>
            <div>
              <p className={`text-sm font-medium leading-tight ${activeSkin === skin.id ? 'text-cloud' : 'text-charcoal'}`}>
                {skin.name}
              </p>
              <p className={`text-[10px] mt-0.5 ${activeSkin === skin.id ? 'text-cloud/70' : 'text-charcoal/50'}`}>
                {skin.tagline}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function InteractiveDemoShowcase({ className = '' }: InteractiveDemoShowcaseProps) {
  const skins = getAllSkins();
  const [activeSkinId, setActiveSkinId] = useState<SkinId>(skins[0]?.id as SkinId || 'avant-garde-editorial');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');

  const activeInvitation = useMemo(() => {
    return createDemoInvitation(activeSkinId);
  }, [activeSkinId]);

  const activeSkin = skins.find(s => s.id === activeSkinId);

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-3">
          Explora nuestros diseños
        </h2>
        <p className="text-charcoal/60 font-light max-w-xl mx-auto">
          Navega entre nuestras skins y visualiza cómo se verá tu invitación en cualquier dispositivo
        </p>
      </div>

      {/* Main Layout: Selectors Left, Device Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column - Controls */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
          {/* Skin Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal/60 mb-4">
              Selecciona un diseño
            </h3>
            <div className="space-y-3">
              {skins.map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => setActiveSkinId(skin.id as SkinId)}
                  className={`w-full group relative px-4 py-4 rounded-xl transition-all duration-300 text-left ${
                    activeSkinId === skin.id
                      ? 'bg-charcoal text-cloud shadow-md'
                      : 'bg-stone-50 text-charcoal hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-3 h-3 rounded-full transition-transform duration-300 ${
                        activeSkinId === skin.id ? 'scale-125' : 'group-hover:scale-110'
                      }`}
                      style={{ backgroundColor: skin.style.accent }}
                    ></div>
                    <div className="flex-1">
                      <p className={`font-medium leading-tight ${activeSkinId === skin.id ? 'text-cloud' : 'text-charcoal'}`}>
                        {skin.name}
                      </p>
                      <p className={`text-xs mt-0.5 ${activeSkinId === skin.id ? 'text-cloud/70' : 'text-charcoal/50'}`}>
                        {skin.tagline}
                      </p>
                    </div>
                    {activeSkinId === skin.id && (
                      <svg className="w-5 h-5 text-cloud" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Device Switcher */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal/60 mb-4">
              Vista previa en
            </h3>
            <div className="flex bg-stone-100 rounded-xl p-1">
              <button
                onClick={() => setDeviceView('mobile')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  deviceView === 'mobile'
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Celular</span>
              </button>
              <button
                onClick={() => setDeviceView('desktop')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  deviceView === 'desktop'
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Escritorio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Device Preview */}
        <div className="lg:col-span-8">
          <div className="relative min-h-[550px] bg-stone-50 rounded-3xl p-8 flex items-center justify-center border border-stone-200">
            <AnimatePresence mode="wait">
              {deviceView === 'mobile' ? (
                <motion.div
                  key={`mobile-${activeSkinId}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <PhoneMockup skinId={activeSkinId} invitation={activeInvitation} />
                </motion.div>
              ) : (
                <motion.div
                  key={`desktop-${activeSkinId}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <DesktopMockup skinId={activeSkinId} invitation={activeInvitation} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scroll hint */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-charcoal/40 uppercase tracking-widest">
              Desliza para explorar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
