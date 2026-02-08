'use client';

import React, { useState, useRef, useMemo } from 'react';
import { getAllSkins } from '@/lib/skins';
import { InvitationSchema, SkinId } from '@/types';
import { generateFantasyData } from '@/app/onboarding/lib/mock-fantasy-data';
import { AnimatePresence, motion } from 'framer-motion';

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
    <div className="relative mx-auto" style={{ width: 280 }}>
      {/* Phone Frame */}
      <div className="relative bg-[#1a1a1a] rounded-[2rem] border-[4px] border-[#1a1a1a] shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1a1a1a] rounded-b-lg z-50"></div>
        
        {/* Screen */}
        <div className="w-full bg-white rounded-[1.5rem] overflow-hidden" style={{ height: 500 }}>
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            style={{ width: '100%', height: '100%' }}
            scrolling="yes"
            title={`Mobile preview - ${skinId}`}
          />
        </div>
      </div>
    </div>
  );
}

export function MobileStoriesGallery() {
  const skins = getAllSkins();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const invitations = useMemo(() => {
    return skins.map(skin => createDemoInvitation(skin.id as SkinId));
  }, [skins]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPos = containerRef.current.scrollLeft;
    const slideWidth = containerRef.current.offsetWidth * 0.85;
    const newIndex = Math.round(scrollPos / slideWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < skins.length) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (!containerRef.current) return;
    const slideWidth = containerRef.current.offsetWidth * 0.85;
    containerRef.current.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  // Touch/drag handling
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const walk = (startX - clientX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft + walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Snap to nearest slide
    if (!containerRef.current) return;
    const slideWidth = containerRef.current.offsetWidth * 0.85;
    const currentIndex = Math.round(containerRef.current.scrollLeft / slideWidth);
    scrollToSlide(Math.max(0, Math.min(currentIndex, skins.length - 1)));
  };

  const activeSkin = skins[activeIndex];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 mb-6">
        <h2 className="text-3xl font-serif text-charcoal mb-2">
          Explora los diseños
        </h2>
        <p className="text-charcoal/60 font-light text-sm">
          Desliza para ver cada invitación en vivo
        </p>
      </div>

      {/* Progress Indicators - Stories Style */}
      <div className="px-6 mb-4">
        <div className="flex gap-1.5">
          {skins.map((skin, idx) => (
            <button
              key={skin.id}
              onClick={() => scrollToSlide(idx)}
              className="flex-1 h-1 rounded-full overflow-hidden bg-stone-200"
            >
              <motion.div
                className="h-full bg-charcoal"
                initial={{ width: 0 }}
                animate={{ 
                  width: idx < activeIndex ? '100%' : idx === activeIndex ? '50%' : '0%'
                }}
                transition={{ duration: idx === activeIndex ? 3 : 0.3 }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Stories Carousel */}
      <div 
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => isDragging && handleTouchEnd()}
      >
        <div className="flex gap-4 px-6 py-4">
          {skins.map((skin, idx) => (
            <div
              key={skin.id}
              className="snap-center shrink-0"
              style={{ width: '85vw', maxWidth: 340 }}
            >
              <div className={`transition-all duration-300 ${
                idx === activeIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
              }`}>
                <PhoneMockup 
                  skinId={skin.id as SkinId} 
                  invitation={invitations[idx]} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Skin Info Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSkin?.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="px-6 mt-6"
        >
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: activeSkin?.style.accent }}
              />
              <h3 className="text-xl font-serif text-charcoal">
                {activeSkin?.name}
              </h3>
            </div>
            <p className="text-sm text-charcoal/70 font-light leading-relaxed">
              {activeSkin?.description}
            </p>
            
            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {skins.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeIndex ? 'bg-charcoal w-6' : 'bg-stone-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe Hint */}
      <p className="text-center text-[10px] text-charcoal/30 mt-3 uppercase tracking-widest">
        Desliza horizontalmente
      </p>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
