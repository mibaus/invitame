'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Loader2 } from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { DietaryRestrictionsDropdown } from '@/components/shared/DietaryRestrictionsDropdown';
import { submitRSVP } from '@/app/actions/rsvp';
import { parseDateLocal } from '@/lib/utils';

interface LegacyEditLayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
  previewMobile?: boolean;
}

// ============================================
// PALETA ROMANCE CLÁSICO EDITORIAL
// ============================================
const COLORS = {
  white: '#F8F9FA',
  dustyRose: '#E7D2CC',
  charcoal: '#2C3333',
  bronze: '#A27B5C',
  bronzeDark: '#8B6B4F',
};

const FONTS = {
  headline: "'Butler', 'Playfair Display', serif",
  subtitle: "'Playfair Display', 'Georgia', serif",
  body: "'Montserrat', 'Helvetica Neue', sans-serif",
};

// ============================================
// ANIMACIONES
// ============================================
const slideUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

// ============================================
// COMPONENTE: Empty State
// ============================================
function EmptyStatePreview({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="py-32 px-6 text-center" style={{ backgroundColor: COLORS.white }}>
      <div className="text-3xl mb-6" style={{ color: COLORS.bronze, opacity: 0.5 }}>{icon}</div>
      <h3 className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.charcoal, fontFamily: FONTS.body, fontWeight: 300 }}>
        {title}
      </h3>
      <p className="text-[10px] tracking-[0.15em]" style={{ color: COLORS.charcoal, fontFamily: FONTS.body, opacity: 0.6 }}>
        {description}
      </p>
    </div>
  );
}

// ============================================
// SECCIÓN 1: HERO - La Portada del Libro
// ============================================
function HeroSection({ content, logistics, previewMobile }: { content: InvitationSchema['content']; logistics: InvitationSchema['logistics']; previewMobile?: boolean }) {
  const eventDate = parseDateLocal(logistics.event_date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
  const year = eventDate.getFullYear();
  const dateFormatted = `${day}.${month}.${year}`;
  
  const person1Name = content.couple?.person1.name || 'Elena';
  const person2Name = content.couple?.person2.name || 'Mateo';
  const coverImage = content.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&h=1600&auto=format&fit=crop';

  return (
    <section className="relative min-h-screen flex flex-col justify-center py-28 px-6" style={{ backgroundColor: COLORS.white }}>
      <div className={`max-w-7xl mx-auto w-full ${previewMobile ? 'block' : 'hidden lg:block'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative"
        >
          {/* Contenedor principal con margen editorial */}
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Columna izquierda - Nombres */}
            <div className="col-span-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-8"
              >
                <span 
                  className="text-[10px] tracking-[0.4em] uppercase block"
                  style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
                >
                  La Boda de
                </span>
                
                <h1 
                  className="text-4xl md:text-5xl lg:text-6xl italic leading-tight"
                  style={{ color: COLORS.charcoal, fontFamily: FONTS.subtitle, fontWeight: 500 }}
                >
                  {person1Name}
                </h1>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-px" style={{ backgroundColor: COLORS.bronze }} />
                  <span 
                    className="text-xl"
                    style={{ color: COLORS.bronze, fontFamily: FONTS.subtitle, fontStyle: 'italic' }}
                  >
                    y
                  </span>
                  <div className="w-16 h-px" style={{ backgroundColor: COLORS.bronze }} />
                </div>
                
                <h1 
                  className="text-4xl md:text-5xl lg:text-6xl italic leading-tight"
                  style={{ color: COLORS.charcoal, fontFamily: FONTS.subtitle, fontWeight: 500 }}
                >
                  {person2Name}
                </h1>
                
                <p 
                  className="text-xs tracking-[0.3em] mt-12 pt-8"
                  style={{ color: COLORS.charcoal, fontFamily: FONTS.body, fontWeight: 300, borderTop: `1px solid ${COLORS.dustyRose}` }}
                >
                  {dateFormatted}
                </p>
              </motion.div>
            </div>

            {/* Columna central - Imagen hero */}
            <div className="col-span-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="relative"
              >
                <div 
                  className="relative aspect-[4/5] overflow-hidden shadow-2xl"
                  style={{ filter: 'sepia(0.05) contrast(1.05)' }}
                >
                  <img
                    src={coverImage}
                    alt={`${person1Name} & ${person2Name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Marco decorativo */}
                <div className="absolute -inset-4 border" style={{ borderColor: COLORS.dustyRose, zIndex: -1 }} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Hero */}
      <div className={`${previewMobile ? 'block' : 'lg:hidden block'} max-w-md mx-auto`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-center space-y-8"
        >
          <span 
            className="text-[10px] tracking-[0.4em] uppercase block"
            style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
          >
            La Boda de
          </span>
          
          <h1 
            className="text-3xl italic leading-tight"
            style={{ color: COLORS.charcoal, fontFamily: FONTS.subtitle, fontWeight: 500 }}
          >
            {person1Name} & {person2Name}
          </h1>
          
          <div 
            className="relative aspect-[3/4] overflow-hidden shadow-xl"
            style={{ filter: 'sepia(0.05) contrast(1.05)' }}
          >
            <img
              src={coverImage}
              alt={`${person1Name} & ${person2Name}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <p 
            className="text-xs tracking-[0.3em]"
            style={{ color: COLORS.charcoal, fontFamily: FONTS.body, fontWeight: 300 }}
          >
            {dateFormatted}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ArrowDown className="w-5 h-5 animate-bounce" style={{ color: COLORS.bronze }} />
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 2: THE STORY - Prólogo
// ============================================
function StorySection({ content, logistics }: { content: InvitationSchema['content']; logistics: InvitationSchema['logistics'] }) {
  const eventDate = parseDateLocal(logistics.event_date);
  const romanNumeral = getRomanNumeral(eventDate.getDate());
  const storyText = content.quote?.text || content.couple?.love_story || 
    'Nuestra historia comenzó como un susurro entre páginas de un libro sin escribir. Cada capítulo reveló nuevas formas de amarnos, nuevas razones para elegirnos cada día. En este prólogo de nuestra eternidad, invitamos a quienes han sido testigos de nuestro amor a ser parte del siguiente capítulo.';

  return (
    <section className="py-36 px-4 md:px-6" style={{ backgroundColor: COLORS.dustyRose }}>
      <motion.div
        {...slideUp}
        className="max-w-3xl mx-auto"
      >
        <div className="flex flex-col items-center text-center">
          {/* Número romano decorativo - solo visible en desktop */}
          <span 
            className="hidden lg:block text-6xl opacity-20 mb-6"
            style={{ color: COLORS.bronze, fontFamily: FONTS.headline, fontWeight: 700 }}
          >
            {romanNumeral}
          </span>

          {/* Título con línea decorativa */}
          <div className="space-y-4 mb-8">
            <span 
              className="text-[10px] tracking-[0.4em] uppercase block"
              style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
            >
              Prólogo
            </span>
            <div className="w-16 h-px mx-auto" style={{ backgroundColor: COLORS.bronze }} />
          </div>

          {/* Texto de la historia */}
          <p 
            className="text-base md:text-lg leading-relaxed break-words max-w-2xl"
            style={{ color: COLORS.charcoal, fontFamily: FONTS.subtitle, fontWeight: 400, lineHeight: 1.8 }}
          >
            {storyText}
          </p>

          {/* Línea decorativa final */}
          <div className="w-24 h-px mt-10" style={{ backgroundColor: COLORS.bronze }} />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 3: COUNTDOWN - El Reloj de la Historia
// ============================================
function CountdownSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const eventDate = logistics.event_date || new Date().toISOString();
  const targetDate = parseDateLocal(eventDate).getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center text-center">
      <span 
        className="text-5xl md:text-6xl lg:text-7xl"
        style={{ color: COLORS.charcoal, fontFamily: FONTS.headline, fontWeight: 700, lineHeight: 1 }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span 
        className="text-[10px] tracking-[0.2em] uppercase mt-4"
        style={{ color: COLORS.bronze, fontFamily: FONTS.body, fontWeight: 300 }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <section className="py-24 md:py-36 px-6" style={{ backgroundColor: COLORS.white }}>
      <motion.div
        {...slideUp}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          <TimeUnit value={timeLeft.days} label="Días" />
          <span className="text-2xl" style={{ color: COLORS.bronze }}>•</span>
          <TimeUnit value={timeLeft.hours} label="Horas" />
          <span className="text-2xl" style={{ color: COLORS.bronze }}>•</span>
          <TimeUnit value={timeLeft.minutes} label="Minutos" />
          <span className="text-2xl hidden md:block" style={{ color: COLORS.bronze }}>•</span>
          <TimeUnit value={timeLeft.seconds} label="Segundos" />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 4: LOGISTICS - Capítulos del Evento
// ============================================
function VenuesSection({ logistics, content }: { logistics: InvitationSchema['logistics']; content: InvitationSchema['content'] }) {
  const venues = logistics.venues.length > 0
    ? logistics.venues.slice(0, 2).map((venue, idx) => ({
        title: venue.type === 'ceremony' ? 'La Ceremonia' : 'La Celebración',
        name: venue.name,
        address: `${venue.address}, ${venue.city}`,
        time: logistics.agenda?.[idx]?.time || '18:00',
        date: logistics.event_date,
        mapsLink: venue.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(venue.address + ', ' + venue.city)}`,
        isReversed: idx % 2 !== 0
      }))
    : [
        { title: 'La Ceremonia', name: 'Catedral de Santa María', address: 'Calle Principal 123, Ciudad', time: '17:00', date: logistics.event_date, mapsLink: '#', isReversed: false },
        { title: 'La Celebración', name: 'Palacio de Cristal', address: 'Avenida Central 456, Ciudad', time: '19:30', date: logistics.event_date, mapsLink: '#', isReversed: true }
      ];

  const generateCalendarLink = (venue: typeof venues[0]) => {
    const eventDate = parseDateLocal(venue.date || logistics.event_date);
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');
    const [hours, minutes] = venue.time.split(':').map(Number);
    
    const startTime = `${year}${month}${day}T${String(hours).padStart(2, '0')}${String(minutes || 0).padStart(2, '0')}00`;
    const endHours = hours + 2;
    const endTime = `${year}${month}${day}T${String(endHours).padStart(2, '0')}${String(minutes || 0).padStart(2, '0')}00`;
    
    const title = encodeURIComponent(`${venue.title}: ${content.couple?.person1.name} & ${content.couple?.person2.name}`);
    const location = encodeURIComponent(venue.address);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&location=${location}&sf=true&output=xml`;
  };

  return (
    <section className="py-36 px-6" style={{ backgroundColor: COLORS.white }}>
      <div className="max-w-7xl mx-auto">
        {/* Título de sección */}
        <div className="text-center mb-16">
          <span 
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
          >
            Capítulos del Evento
          </span>
          <div className="w-16 h-px mx-auto mt-4" style={{ backgroundColor: COLORS.bronze }} />
        </div>

        <div className="space-y-16">
          {venues.map((venue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`grid md:grid-cols-2 gap-8 items-center ${venue.isReversed ? 'md:direction-rtl' : ''}`}
            >
              {/* Información del venue */}
              <div className={`space-y-6 p-8 md:p-12 ${venue.isReversed ? 'md:text-right' : ''}`} style={{ backgroundColor: index % 2 === 0 ? COLORS.dustyRose : COLORS.white, border: `1px solid ${COLORS.bronze}20` }}>
                <span 
                  className="text-[10px] tracking-[0.4em] uppercase"
                  style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
                >
                  {venue.title}
                </span>
                
                <h3 
                  className="text-2xl md:text-3xl"
                  style={{ color: COLORS.charcoal, fontFamily: FONTS.headline, fontWeight: 700 }}
                >
                  {venue.name}
                </h3>
                
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: COLORS.charcoal, fontFamily: FONTS.body, fontWeight: 300, opacity: 0.8 }}
                >
                  {venue.address}
                </p>
                
                <p 
                  className="text-xs tracking-[0.2em]"
                  style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
                >
                  {venue.time} HS
                </p>

                {/* Botones */}
                <div className={`flex flex-wrap gap-4 pt-4 ${venue.isReversed ? 'md:justify-end' : ''}`}>
                  <a
                    href={venue.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 text-[11px] tracking-[0.15em] uppercase transition-all hover:opacity-80"
                    style={{ 
                      backgroundColor: COLORS.bronze, 
                      color: COLORS.white, 
                      fontFamily: FONTS.headline,
                      fontWeight: 300
                    }}
                  >
                    Cómo llegar
                  </a>
                  <a
                    href={generateCalendarLink(venue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 text-[11px] tracking-[0.15em] uppercase transition-all hover:opacity-80"
                    style={{ 
                      backgroundColor: COLORS.white, 
                      color: COLORS.bronze, 
                      fontFamily: FONTS.headline,
                      fontWeight: 300,
                      border: `1px solid ${COLORS.bronze}`
                    }}
                  >
                    Agendar
                  </a>
                </div>
              </div>

              {/* Número romano decorativo */}
              <div className={`hidden md:flex items-center justify-center ${venue.isReversed ? 'md:order-first' : ''}`}>
                <span 
                  className="text-[10rem] md:text-[15rem] opacity-10"
                  style={{ color: COLORS.bronze, fontFamily: FONTS.headline, fontWeight: 700, lineHeight: 1 }}
                >
                  {index === 0 ? 'I' : 'II'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECCIÓN 5: TIMELINE - El Guion
// ============================================
function TimelineSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const events = logistics.agenda?.length > 0
    ? logistics.agenda.slice(0, 4).map((item) => ({ 
        time: item.time, 
        title: item.title, 
        description: item.description || '' 
      }))
    : [
        { time: '16:30', title: 'Recepción', description: 'Cóctel de bienvenida' },
        { time: '17:30', title: 'Ceremonia', description: 'Intercambio de votos' },
        { time: '20:00', title: 'Banquete', description: 'Cena bajo las estrellas' },
        { time: '22:30', title: 'Celebración', description: 'Baile hasta la madrugada' }
      ];

  return (
    <section className="py-36 px-6" style={{ backgroundColor: COLORS.dustyRose }}>
      <motion.div
        {...slideUp}
        className="max-w-7xl mx-auto"
      >
        {/* Título */}
        <div className="text-center mb-16">
          <h2 
            className="text-2xl md:text-3xl"
            style={{ color: COLORS.charcoal, fontFamily: FONTS.headline, fontWeight: 700 }}
          >
            El Guion de Nuestra Historia
          </h2>
          <div className="w-16 h-px mx-auto mt-4" style={{ backgroundColor: COLORS.bronze }} />
        </div>

        {/* Timeline - 1 columna en mobile, 4 en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="p-4 md:p-6 shadow-lg text-center flex flex-col justify-center"
              style={{ backgroundColor: COLORS.white, minHeight: '140px' }}
            >
              <span 
                className="text-[10px] tracking-[0.2em] block mb-1"
                style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
              >
                {event.time} HRS
              </span>
              <h3 
                className="text-base md:text-lg leading-tight"
                style={{ color: COLORS.charcoal, fontFamily: FONTS.headline, fontWeight: 700 }}
              >
                {event.title}
              </h3>
              {event.description && (
                <p 
                  className="text-xs mt-1"
                  style={{ color: COLORS.charcoal, fontFamily: FONTS.body, fontWeight: 300, opacity: 0.7 }}
                >
                  {event.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 6: DRESS CODE - El Estilo
// ============================================
function DressCodeSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const dressCodeText = logistics.dress_code?.code === 'formal' ? 'Formal Elegante' :
    logistics.dress_code?.code === 'black-tie' ? 'Black Tie' :
    logistics.dress_code?.code === 'cocktail' ? 'Cocktail' :
    logistics.dress_code?.description || 'Formal Elegante';

  return (
    <section className="py-36 px-4 md:px-6 relative overflow-hidden" style={{ backgroundColor: COLORS.white }}>
      <motion.div
        {...slideUp}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="flex flex-col items-center justify-center">
          <h2 
            className="text-2xl md:text-4xl mb-4 md:mb-6 break-words"
            style={{ color: COLORS.charcoal, fontFamily: FONTS.headline, fontWeight: 700 }}
          >
            {dressCodeText}
          </h2>
          
          <p 
            className="text-xs md:text-sm tracking-[0.1em] mb-6 md:mb-8"
            style={{ color: COLORS.charcoal, fontFamily: FONTS.body, fontWeight: 300, opacity: 0.7 }}
          >
            Dress Code
          </p>

          {logistics.dress_code?.description && (
            <p 
              className="text-sm md:text-base leading-relaxed max-w-md mx-auto"
              style={{ color: COLORS.charcoal, fontFamily: FONTS.body, fontWeight: 300 }}
            >
              {logistics.dress_code.description}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 7: GALLERY - El Álbum Fotográfico
// ============================================
function GallerySection({ content }: { content: InvitationSchema['content'] }) {
  const photos = content.gallery_images?.length
    ? content.gallery_images
    : [
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&h=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519225495810-7512312635db?q=80&w=600&h=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&h=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=600&h=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000&h=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1465495910483-db4452178c1f?q=80&w=600&h=800&auto=format&fit=crop',
      ];

  return (
    <section className="py-36 px-6" style={{ backgroundColor: COLORS.dustyRose }}>
      <motion.div
        {...slideUp}
        className="max-w-7xl mx-auto"
      >
        {/* Título */}
        <div className="text-center mb-16">
          <span 
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
          >
            El Álbum
          </span>
          <h2 
            className="text-2xl md:text-3xl mt-4"
            style={{ color: COLORS.charcoal, fontFamily: FONTS.headline, fontWeight: 700 }}
          >
            Fotográfico
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`overflow-hidden shadow-lg transition-transform hover:scale-105 ${
                index === 0 || index === 4 ? 'col-span-2' : ''
              }`}
              style={{ filter: 'sepia(0.05) contrast(1.05)' }}
            >
              <img
                src={photo}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ aspectRatio: index % 2 === 0 ? '16/10' : '3/4' }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 8: GIFT HUB - Capítulo Final
// ============================================
function GiftSection({ features }: { features: InvitationSchema['features'] }) {
  const [copied, setCopied] = useState(false);
  const alias = features.gift_registry?.bank_details?.alias || 'NOMBRES.BODA';
  const externalRegistry = features.gift_registry?.registries?.[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(alias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-36 px-6" style={{ backgroundColor: COLORS.white }}>
      <motion.div
        {...slideUp}
        className="max-w-4xl mx-auto"
      >
        {/* Título */}
        <div className="text-center mb-12">
          <span 
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
          >
            Capítulo Final
          </span>
          <h2 
            className="text-2xl md:text-3xl mt-4"
            style={{ color: COLORS.charcoal, fontFamily: FONTS.headline, fontWeight: 700 }}
          >
            Obsequios
          </h2>
        </div>

        <p 
          className="text-center text-base leading-relaxed max-w-xl mx-auto mb-12"
          style={{ color: COLORS.charcoal, fontFamily: FONTS.body, fontWeight: 300 }}
        >
          {features.gift_registry?.message || 'Tu presencia es el regalo más importante. Si deseas contribuir a nuestro nuevo capítulo juntos, te lo agradecemos de corazón.'}
        </p>

        {/* Dos columnas separadas por línea vertical */}
        <div className="grid md:grid-cols-2 gap-8 relative">
          {/* Línea vertical divisoria */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: COLORS.bronze }} />

          {/* CBU/Alias */}
          <div className="text-center md:text-left space-y-4">
            <h3 
              className="text-sm tracking-[0.2em] uppercase"
              style={{ color: COLORS.bronze, fontFamily: FONTS.body, fontWeight: 400 }}
            >
              Transferencia
            </h3>
            <p 
              className="text-lg"
              style={{ color: COLORS.charcoal, fontFamily: FONTS.headline, fontWeight: 700 }}
            >
              {alias}
            </p>
            <button
              onClick={handleCopy}
              className="px-6 py-2 text-[11px] tracking-[0.15em] uppercase transition-all hover:opacity-80"
              style={{ 
                backgroundColor: COLORS.bronze, 
                color: COLORS.white, 
                fontFamily: FONTS.headline,
                fontWeight: 300
              }}
            >
              {copied ? 'Copiado' : 'Copiar Alias'}
            </button>
          </div>

          {/* Mercado Libre */}
          <div className="text-center md:text-right space-y-4">
            <h3 
              className="text-sm tracking-[0.2em] uppercase"
              style={{ color: COLORS.bronze, fontFamily: FONTS.body, fontWeight: 400 }}
            >
              Lista de Regalos
            </h3>
            {externalRegistry ? (
              <a
                href={externalRegistry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 text-[11px] tracking-[0.15em] uppercase transition-all hover:opacity-80"
                style={{ 
                  backgroundColor: COLORS.bronze, 
                  color: COLORS.white, 
                  fontFamily: FONTS.headline,
                  fontWeight: 300
                }}
              >
                {externalRegistry.platform}
              </a>
            ) : (
              <p 
                className="text-sm"
                style={{ color: COLORS.charcoal, fontFamily: FONTS.body, fontWeight: 300, opacity: 0.6 }}
              >
                No hay lista de regalos activa
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 9: RSVP - Confirmación Final
// ============================================
function RSVPSection({ features, content, metadata }: { features: InvitationSchema['features']; content: InvitationSchema['content']; metadata: InvitationSchema['metadata'] }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendance: true,
    guests: 1,
    dietary: [] as string[],
    musicSuggestion: '',
    message: ''
  });
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await submitRSVP({
        invitationId: metadata.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        attendance: formData.attendance,
        guestsCount: formData.guests,
        dietaryRestrictions: formData.dietary.join(', '),
        musicSuggestion: formData.musicSuggestion,
        message: formData.message,
        customAnswers: customAnswers
      });
      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', attendance: true, guests: 1, dietary: [], musicSuggestion: '', message: '' });
        setCustomAnswers({});
      } else {
        setError(result.error || 'Error al enviar');
      }
    } catch {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAnswerChange = (questionId: string, value: string) => {
    setCustomAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const customQuestions = features.rsvp?.custom_questions || [];

  if (success) {
    return (
      <section className="py-36 px-6" style={{ backgroundColor: COLORS.dustyRose }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="max-w-md mx-auto text-center"
        >
          <div className="p-12 shadow-lg" style={{ backgroundColor: COLORS.white }}>
            <h3 
              className="text-2xl mb-4"
              style={{ color: COLORS.charcoal, fontFamily: FONTS.headline, fontWeight: 700 }}
            >
              ¡Gracias!
            </h3>
            <p 
              className="text-sm"
              style={{ color: COLORS.charcoal, fontFamily: FONTS.body, fontWeight: 300 }}
            >
              Hemos registrado tu respuesta. Te esperamos con alegría.
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp-section-legacy" className="py-36 px-6" style={{ backgroundColor: COLORS.dustyRose }}>
      <motion.div
        {...slideUp}
        className="max-w-xl mx-auto"
      >
        {/* Título */}
        <div className="text-center mb-12">
          <h2 
            className="text-2xl md:text-3xl"
            style={{ color: COLORS.charcoal, fontFamily: FONTS.headline, fontWeight: 700 }}
          >
            Confirmación Final
          </h2>
          <div className="w-16 h-px mx-auto mt-4" style={{ backgroundColor: COLORS.bronze }} />
        </div>

        {error && (
          <div 
            className="p-4 mb-8 text-center text-sm"
            style={{ backgroundColor: COLORS.white, color: COLORS.charcoal }}
          >
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nombre */}
          <div>
            <label 
              className="text-[10px] tracking-[0.2em] uppercase block mb-2"
              style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
            >
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 focus:outline-none text-base"
              style={{ 
                backgroundColor: COLORS.white,
                color: COLORS.charcoal, 
                fontFamily: FONTS.body,
                border: `1px solid ${COLORS.bronze}`,
                borderRadius: 0
              }}
              placeholder="Tu nombre"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label 
              className="text-[10px] tracking-[0.2em] uppercase block mb-2"
              style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 focus:outline-none text-base"
              style={{ 
                backgroundColor: COLORS.white,
                color: COLORS.charcoal, 
                fontFamily: FONTS.body,
                border: `1px solid ${COLORS.bronze}`,
                borderRadius: 0
              }}
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          {/* Asistencia */}
          <div>
            <label 
              className="text-[10px] tracking-[0.2em] uppercase block mb-4"
              style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
            >
              ¿Asistirás?
            </label>
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attendance: true })}
                className="flex-1 py-3 text-[11px] tracking-[0.15em] uppercase transition-all"
                style={{
                  backgroundColor: formData.attendance ? COLORS.bronze : COLORS.white,
                  color: formData.attendance ? COLORS.white : COLORS.charcoal,
                  fontFamily: FONTS.body,
                  border: `1px solid ${COLORS.bronze}`,
                  borderRadius: 0
                }}
                disabled={loading}
              >
                Sí, asistiré
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attendance: false })}
                className="flex-1 py-3 text-[11px] tracking-[0.15em] uppercase transition-all"
                style={{
                  backgroundColor: !formData.attendance ? COLORS.bronze : COLORS.white,
                  color: !formData.attendance ? COLORS.white : COLORS.charcoal,
                  fontFamily: FONTS.body,
                  border: `1px solid ${COLORS.bronze}`,
                  borderRadius: 0
                }}
                disabled={loading}
              >
                No podré ir
              </button>
            </div>
          </div>

          {/* Campos condicionales si asiste */}
          {formData.attendance && (
            <>
              {/* Número de invitados */}
              <div>
                <label 
                  className="text-[10px] tracking-[0.2em] uppercase block mb-2"
                  style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
                >
                  Número de Invitados
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 focus:outline-none text-base cursor-pointer"
                  style={{ 
                    backgroundColor: COLORS.white,
                    color: COLORS.charcoal, 
                    fontFamily: FONTS.body,
                    border: `1px solid ${COLORS.bronze}`,
                    borderRadius: 0
                  }}
                  disabled={loading}
                >
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'persona' : 'personas'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Restricciones alimentarias */}
              <div>
                <label 
                  className="text-[10px] tracking-[0.2em] uppercase block mb-2"
                  style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
                >
                  Restricciones Alimentarias
                </label>
                <DietaryRestrictionsDropdown
                  value={formData.dietary}
                  onChange={(value) => setFormData({ ...formData, dietary: value })}
                  options={["Vegetariano", "Vegano", "Sin gluten", "Diabético", "Sin lactosa", "Kosher", "Halal", "Alergias"]}
                  placeholder="Selecciona..."
                  allergyGroups={{
                    "Alergias": [
                      "Alergia a frutos secos",
                      "Alergia a mariscos",
                      "Alergia a lácteos",
                      "Alergia al huevo",
                      "Alergia al soja",
                      "Alergia al pescado",
                      "Alergia al maní",
                      "Alergia al sésamo"
                    ]
                  }}
                  styles={{
                    triggerClassName: "w-full px-4 py-3 focus:outline-none transition-colors text-base",
                    dropdownClassName: "border shadow-lg",
                    optionClassName: "px-4 py-3 cursor-pointer transition-colors text-sm",
                    tagClassName: "px-3 py-1 text-[10px] tracking-wider",
                    inputClassName: "px-3 py-2 border text-sm focus:outline-none"
                  }}
                  colors={{
                    border: COLORS.bronze,
                    text: COLORS.charcoal,
                    placeholder: COLORS.bronze,
                    background: COLORS.white,
                    hover: COLORS.dustyRose,
                    selected: COLORS.bronze,
                    tagBg: COLORS.bronze,
                    tagText: COLORS.white,
                    buttonBg: COLORS.bronze,
                    buttonHover: COLORS.bronzeDark,
                    buttonText: COLORS.white,
                    checkColor: COLORS.white,
                    checkBg: COLORS.bronze
                  }}
                />
              </div>

              {/* Sugerencia musical */}
              <div>
                <label 
                  className="text-[10px] tracking-[0.2em] uppercase block mb-2"
                  style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
                >
                  Sugerencia Musical
                </label>
                <input
                  type="text"
                  value={formData.musicSuggestion}
                  onChange={(e) => setFormData({ ...formData, musicSuggestion: e.target.value })}
                  className="w-full px-4 py-3 focus:outline-none text-base"
                  style={{ 
                    backgroundColor: COLORS.white,
                    color: COLORS.charcoal, 
                    fontFamily: FONTS.body,
                    border: `1px solid ${COLORS.bronze}`,
                    borderRadius: 0
                  }}
                  placeholder="¿Qué canción no puede faltar?"
                  disabled={loading}
                />
              </div>

              {/* Preguntas personalizadas */}
              {customQuestions.length > 0 && (
                <div className="space-y-6 pt-6" style={{ borderTop: `1px solid ${COLORS.bronze}` }}>
                  <p 
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
                  >
                    Preguntas Adicionales
                  </p>
                  {customQuestions.map((question) => (
                    <div key={question.id}>
                      <label 
                        className="text-[10px] tracking-[0.2em] uppercase block mb-2"
                        style={{ color: COLORS.bronze, fontFamily: FONTS.body }}
                      >
                        {question.question}
                        {question.required && <span style={{ color: '#EF4444' }}> *</span>}
                      </label>
                      {question.type === 'text' ? (
                        <input
                          type="text"
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full px-4 py-3 focus:outline-none text-base"
                          style={{ 
                            backgroundColor: COLORS.white,
                            color: COLORS.charcoal, 
                            fontFamily: FONTS.body,
                            border: `1px solid ${COLORS.bronze}`,
                            borderRadius: 0
                          }}
                          placeholder="Tu respuesta..."
                          disabled={loading}
                        />
                      ) : question.type === 'select' ? (
                        <select
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full px-4 py-3 focus:outline-none text-base cursor-pointer"
                          style={{ 
                            backgroundColor: COLORS.white,
                            color: COLORS.charcoal, 
                            fontFamily: FONTS.body,
                            border: `1px solid ${COLORS.bronze}`,
                            borderRadius: 0
                          }}
                          disabled={loading}
                        >
                          <option value="">Selecciona...</option>
                          {question.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <textarea
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full px-4 py-3 focus:outline-none text-base resize-none"
                          style={{ 
                            backgroundColor: COLORS.white,
                            color: COLORS.charcoal, 
                            fontFamily: FONTS.body,
                            border: `1px solid ${COLORS.bronze}`,
                            borderRadius: 0,
                            minHeight: '100px'
                          }}
                          placeholder="Tu respuesta..."
                          disabled={loading}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Botón de envío */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 text-[12px] tracking-[0.2em] uppercase transition-all disabled:opacity-50"
            style={{ 
              backgroundColor: COLORS.bronze, 
              color: COLORS.white, 
              fontFamily: FONTS.headline,
              fontWeight: 300,
              borderRadius: 0
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
              </span>
            ) : (
              'Confirmar Asistencia'
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 10: FOOTER EDITORIAL
// ============================================
function Footer({ content }: { content: InvitationSchema['content'] }) {
  const initials = content.couple ? 
    `${content.couple.person1.name.charAt(0)}${content.couple.person2.name.charAt(0)}` : 
    'E&M';

  return (
    <footer className="py-20 px-6" style={{ backgroundColor: COLORS.charcoal }}>
      <div className="max-w-4xl mx-auto text-center">
        <span 
          className="text-3xl italic"
          style={{ color: COLORS.bronze, fontFamily: FONTS.subtitle, fontWeight: 500 }}
        >
          {initials}
        </span>
        <p 
          className="mt-6 text-[10px] tracking-[0.3em] uppercase"
          style={{ color: COLORS.dustyRose, fontFamily: FONTS.body, fontWeight: 300, opacity: 0.8 }}
        >
          Un capítulo de amor infinito
        </p>
      </div>
    </footer>
  );
}

// ============================================
// UTILIDAD: Números Romanos
// ============================================
function getRomanNumeral(num: number): string {
  const roman = {
    M: 1000, CM: 900, D: 500, CD: 400,
    C: 100, XC: 90, L: 50, XL: 40,
    X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let result = '';
  for (const [letter, value] of Object.entries(roman)) {
    while (num >= value) {
      result += letter;
      num -= value;
    }
  }
  return result;
}

// ============================================
// SECCIÓN 11: VOWS FOOTER
// ============================================
function VowsFooter() {
  return (
    <footer className="py-16 md:py-20 px-6" style={{ backgroundColor: COLORS.charcoal }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16" style={{ borderBottom: `1px solid ${COLORS.bronze}33` }}>
          <div className="space-y-6">
            <span className="text-2xl tracking-tight" style={{ color: COLORS.bronze, fontFamily: FONTS.headline, fontWeight: 700 }}>
              VOWS<span style={{ color: COLORS.dustyRose }}>.</span>
            </span>
            <p className="text-xs uppercase tracking-[0.3em] font-light max-w-xs leading-relaxed" style={{ color: COLORS.dustyRose, fontFamily: FONTS.body }}>
              Redefiniendo la estética nupcial digital. <br/> Hecho con calma en Argentina.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 md:gap-16">
            <div className="space-y-4">
               <p className="text-[9px] uppercase tracking-[0.4em] font-bold" style={{ color: COLORS.bronze, fontFamily: FONTS.body }}>Contacto</p>
               <a href="mailto:hola@vows.ar" className="block text-sm transition-opacity hover:opacity-50" style={{ color: COLORS.white, fontFamily: FONTS.body }}>hola@vows.ar</a>
               <a href="https://wa.me/5491100000000" className="block text-sm transition-opacity hover:opacity-50" style={{ color: COLORS.white, fontFamily: FONTS.body }}>WhatsApp Concierge</a>
            </div>
            <div className="space-y-4">
               <p className="text-[9px] uppercase tracking-[0.4em] font-bold" style={{ color: COLORS.bronze, fontFamily: FONTS.body }}>Legales</p>
               <a href="#" className="block text-sm transition-opacity hover:opacity-50" style={{ color: COLORS.white, fontFamily: FONTS.body }}>Términos de uso</a>
               <a href="#" className="block text-sm transition-opacity hover:opacity-50" style={{ color: COLORS.white, fontFamily: FONTS.body }}>Privacidad</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: COLORS.dustyRose, fontFamily: FONTS.body, opacity: 0.6 }}>
             © {new Date().getFullYear()} VOWS. Todos los derechos reservados.
           </p>
           <div className="flex gap-8">
              <a href="#" className="text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-50" style={{ color: COLORS.white, fontFamily: FONTS.body }}>Instagram</a>
              <a href="#" className="text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-50" style={{ color: COLORS.white, fontFamily: FONTS.body }}>Pinterest</a>
           </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// LAYOUT PRINCIPAL
// ============================================
export function LegacyEditLayout({ invitation, preview, previewMobile }: LegacyEditLayoutProps) {
  const { metadata, content, logistics, features } = invitation;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: COLORS.white }}>
      <FeatureGate 
        isVisible={features.show_hero} 
        fallback={preview ? <EmptyStatePreview icon="◈" title="Hero Section" description="Sección principal con los nombres y fecha" /> : null}
      >
        <HeroSection content={content} logistics={logistics} previewMobile={previewMobile} />
      </FeatureGate>

      <FeatureGate 
        isVisible={!!content.quote || !!content.couple?.love_story} 
        data={content.quote} 
        fallback={preview ? <EmptyStatePreview icon="❝" title="Prólogo" description="Agrega una frase o historia de amor" /> : null}
      >
        <StorySection content={content} logistics={logistics} />
      </FeatureGate>

      <FeatureGate 
        isVisible={features.show_countdown} 
        data={features.countdown} 
        fallback={preview ? <EmptyStatePreview icon="◷" title="Cuenta Regresiva" description="Configura la fecha de tu evento" /> : null}
      >
        <CountdownSection logistics={logistics} />
      </FeatureGate>

      <FeatureGate 
        isVisible={features.show_venue_map} 
        data={logistics.venues} 
        fallback={preview ? <EmptyStatePreview icon="⌖" title="Capítulos del Evento" description="Indica dónde será el evento" /> : null}
      >
        <VenuesSection logistics={logistics} content={content} />
      </FeatureGate>

      <FeatureGate 
        isVisible={features.show_agenda} 
        data={logistics.agenda} 
        fallback={preview ? <EmptyStatePreview icon="▣" title="El Guion" description="Agrega los momentos clave de tu evento" /> : null}
      >
        <TimelineSection logistics={logistics} />
      </FeatureGate>

      <FeatureGate 
        isVisible={features.show_dress_code} 
        data={logistics.dress_code} 
        fallback={preview ? <EmptyStatePreview icon="◈" title="El Estilo" description="Especifica el código de vestimenta" /> : null}
      >
        <DressCodeSection logistics={logistics} />
      </FeatureGate>

      <FeatureGate 
        isVisible={features.show_gallery} 
        data={content.gallery_images} 
        fallback={preview ? <EmptyStatePreview icon="▣" title="El Álbum" description="Comparte tus mejores momentos" /> : null}
      >
        <GallerySection content={content} />
      </FeatureGate>

      <FeatureGate 
        isVisible={features.show_gift_registry} 
        data={features.gift_registry} 
        fallback={preview ? <EmptyStatePreview icon="◉" title="Capítulo Final" description="Comparte los datos bancarios" /> : null}
      >
        <GiftSection features={features} />
      </FeatureGate>

      <FeatureGate 
        isVisible={features.show_rsvp} 
        data={features.rsvp} 
        fallback={preview ? <EmptyStatePreview icon="✉" title="Confirmación Final" description="Activa el formulario RSVP" /> : null}
      >
        <RSVPSection features={features} content={content} metadata={metadata} />
      </FeatureGate>

      <Footer content={content} />
      <VowsFooter />

      {/* Botón flotante para Confirmar - solo visible cuando NO está en preview */}
      {!preview && (
        <FeatureGate 
          isVisible={features.show_rsvp} 
          data={features.rsvp}
        >
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={() => {
              const rsvpSection = document.getElementById('rsvp-section-legacy');
              if (rsvpSection) {
                rsvpSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="fixed bottom-6 right-6 z-50 px-6 py-3 text-[11px] tracking-[0.15em] uppercase transition-all hover:opacity-90 shadow-lg"
            style={{ 
              backgroundColor: COLORS.bronze, 
              color: COLORS.white, 
              fontFamily: FONTS.headline,
              fontWeight: 300,
              borderRadius: 0
            }}
          >
            Confirmar
          </motion.button>
        </FeatureGate>
      )}
    </main>
  );
}
