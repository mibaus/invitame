'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  Loader2
} from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { DietaryRestrictionsDropdown } from '@/components/shared/DietaryRestrictionsDropdown';
import { submitRSVP } from '@/app/actions/rsvp';
import { parseDateLocal } from '@/lib/utils';

interface MonogramLayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
  previewMobile?: boolean;
}

// ============================================
// PALETA EDITORIAL VOGUE
// ============================================
const COLORS = {
  white: '#FFFFFF',
  offWhite: '#FAFAFA',
  graphite: '#1A1A1A',
  graphiteMedium: '#333333',
  graphiteLight: '#666666',
  graphiteMuted: '#999999',
  border: '#E0E0E0',
  borderDark: '#CCCCCC',
};

const FONTS = {
  display: "'Cormorant Garamond', 'Times New Roman', serif",
  body: "'Inter', 'Helvetica Neue', Arial, sans-serif",
};

// ============================================
// COMPONENTE: Empty State
// ============================================
function EmptyStatePreview({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="py-32 px-6 text-center" style={{ backgroundColor: COLORS.white }}>
      <div className="text-2xl mb-6 opacity-30">{icon}</div>
      <h3 className="text-[11px] tracking-[0.4em] uppercase mb-3" style={{ color: COLORS.graphite, fontFamily: FONTS.body, fontWeight: 300 }}>
        {title}
      </h3>
      <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
        {description}
      </p>
    </div>
  );
}

// ============================================
// SECCIÓN 1: HERO - Portada de Revista
// ============================================
function HeroSection({ content, logistics, previewMobile }: { content: InvitationSchema['content']; logistics: InvitationSchema['logistics']; previewMobile?: boolean }) {
  const scrollToContent = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  const eventDate = parseDateLocal(logistics.event_date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
  const year = eventDate.getFullYear();
  const person1Name = content.couple?.person1.name || 'ELEANOR';
  const person2Name = content.couple?.person2.name || 'JAMES';
  const coverImage = content.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&h=1600&auto=format&fit=crop';

  return (
    <section className="relative min-h-screen flex flex-col" style={{ backgroundColor: COLORS.white }}>
      {/* Desktop: Diseño asimétrico editorial */}
      <div className={`${previewMobile ? 'hidden' : 'hidden lg:flex'} flex-1 flex-col justify-center px-16 py-20`}>
        <div className="max-w-7xl mx-auto w-full">
          {/* Grid editorial */}
          <div className="grid grid-cols-12 gap-4">
            {/* Columna izquierda: Info vertical */}
            <div className="col-span-2 flex flex-col justify-between py-8">
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body, writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
                  {day} · {month} · {year}
                </p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  {logistics.venues[0]?.city || 'BUENOS AIRES'}
                </p>
              </div>
            </div>

            {/* Columna central: La imagen como protagonista absoluta */}
            <div className="col-span-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="relative"
              >
                {/* Marco paspartú de 40px */}
                <div className="p-10" style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={coverImage}
                      alt={`${person1Name} & ${person2Name}`}
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.8) contrast(1.1)' }}
                    />
                  </div>
                </div>

                {/* Corner marks estilo técnico */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l" style={{ borderColor: COLORS.graphite }} />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r" style={{ borderColor: COLORS.graphite }} />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l" style={{ borderColor: COLORS.graphite }} />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r" style={{ borderColor: COLORS.graphite }} />
              </motion.div>
            </div>

            {/* Columna derecha: Nombres grandes */}
            <div className="col-span-4 flex flex-col justify-center pl-8">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <p className="text-[10px] tracking-[0.4em] uppercase mb-8" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
                  {content.headline || 'NUESTRA BODA'}
                </p>

                <h1 className="text-6xl xl:text-7xl leading-none mb-2" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, letterSpacing: '-0.03em' }}>
                  {person1Name}
                </h1>

                <div className="flex items-center gap-4 my-6">
                  <div className="w-12 h-px" style={{ backgroundColor: COLORS.graphite }} />
                  <span className="text-xl italic" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.display }}>&</span>
                  <div className="w-12 h-px" style={{ backgroundColor: COLORS.graphite }} />
                </div>

                <h1 className="text-6xl xl:text-7xl leading-none" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, letterSpacing: '-0.03em' }}>
                  {person2Name}
                </h1>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Layout vertical dramático */}
      <div className={`${previewMobile ? 'flex' : 'lg:hidden flex'} flex-1 flex-col justify-center px-6 py-12`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Pasepartú móvil */}
          <div className="p-6 mb-10" style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}>
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={coverImage}
                alt={`${person1Name} & ${person2Name}`}
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.8) contrast(1.1)' }}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
              {day} · {month} · {year}
            </p>
            <h1 className="text-4xl leading-none mb-1" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, letterSpacing: '-0.02em' }}>
              {person1Name}
            </h1>
            <span className="text-lg italic my-2 block" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.display }}>&</span>
            <h1 className="text-4xl leading-none mb-4" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, letterSpacing: '-0.02em' }}>
              {person2Name}
            </h1>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator minimalista */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-4 h-4" style={{ color: COLORS.graphiteMuted }} />
      </motion.button>
    </section>
  );
}

// ============================================
// SECCIÓN 2: COUNTDOWN - Números puros en serif
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
    <div className="flex flex-col items-center px-0 md:px-6 lg:px-12">
      <span className="text-3xl md:text-7xl lg:text-8xl tracking-tight" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, lineHeight: 1 }}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] tracking-[0.3em] uppercase mt-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
        {label}
      </span>
    </div>
  );

  return (
    <section className="py-12 md:py-40 px-6" style={{ backgroundColor: COLORS.white }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header numerado */}
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
            Faltan
          </span>
        </div>

        {/* Countdown - 2x2 grid en mobile, row en desktop */}
        <div className="grid grid-cols-2 md:flex md:justify-center md:items-start gap-8 md:gap-0">
          <TimeUnit value={timeLeft.days} label="Días" />
          <div className="hidden md:block w-px h-20 self-center" style={{ backgroundColor: COLORS.borderDark }} />

          <TimeUnit value={timeLeft.hours} label="Horas" />
          <div className="hidden md:block w-px h-20 self-center" style={{ backgroundColor: COLORS.borderDark }} />

          <TimeUnit value={timeLeft.minutes} label="Minutos" />
          <div className="hidden md:block w-px h-20 self-center" style={{ backgroundColor: COLORS.borderDark }} />

          <TimeUnit value={timeLeft.seconds} label="Segundos" />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 3: THE STORY - Cita con Drop Cap editorial
// ============================================
function QuoteSection({ content }: { content: InvitationSchema['content'] }) {
  const quoteText = content.quote?.text || content.couple?.love_story || 'En el silencio de este momento, encontramos la eternidad de nuestro amor. Como dos almas que se reconocen más allá del tiempo.';

  return (
    <section className="py-12 md:py-40 px-6" style={{ backgroundColor: COLORS.offWhite }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center">
          {/* Quote con drop cap que ocupa 3 líneas exactas */}
          <p
            className="text-xl md:text-2xl lg:text-3xl"
            style={{
              color: COLORS.graphite,
              fontFamily: FONTS.display,
              fontWeight: 300,
              lineHeight: 1.6,
              display: 'inline-block',
              textAlign: 'left'
            }}
          >
            <span
              style={{
                float: 'left',
                fontSize: '4.5em',
                lineHeight: '0.8',
                paddingTop: '0.05em',
                paddingRight: '0',
                marginRight: '-0.02em',
                paddingLeft: '0',
                fontWeight: 400,
              }}
            >
              {quoteText.charAt(0)}
            </span>
            {quoteText.slice(1)}
          </p>

          {content.quote?.author && (
            <p className="mt-12 text-[10px] tracking-[0.3em] uppercase" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
              — {content.quote.author}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 4: LOGISTICS (01. CUÁNDO Y DÓNDE)
// ============================================
function VenuesSection({ logistics, content }: { logistics: InvitationSchema['logistics']; content: InvitationSchema['content'] }) {
  const generateCalendarLink = (venue: any, eventDate: string) => {
    const eventTitle = encodeURIComponent(`${content.couple?.person1.name || ''} & ${content.couple?.person2.name || ''} - ${venue.title}`);
    const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
    let baseDate = new Date(eventDate);
    if (isNaN(baseDate.getTime())) baseDate = new Date();
    const [hours, minutes] = venue.time ? venue.time.split(':') : ['18', '00'];
    baseDate.setHours(parseInt(hours), parseInt(minutes));
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0];
    const endDate = new Date(baseDate);
    endDate.setHours(endDate.getHours() + 1);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDate(baseDate)}/${formatDate(endDate)}&location=${location}`;
  };

  // Parsear la fecha del evento para mostrarla
  const eventDate = parseDateLocal(logistics.event_date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
  const year = eventDate.getFullYear();
  const formattedDate = `${day} DE ${month} DE ${year}`;

  const venues = logistics.venues.length > 0
    ? logistics.venues.slice(0, 2).map((venue, idx) => ({
      title: venue.type === 'ceremony' ? 'LA CEREMONIA' : 'LA CELEBRACIÓN',
      name: venue.name.toUpperCase(),
      address: `${venue.address}, ${venue.city}`.toUpperCase(),
      time: logistics.agenda?.[idx]?.time || '18:00',
      mapsLink: venue.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(venue.address + ', ' + venue.city)}`,
      calendarLink: generateCalendarLink({ title: venue.type === 'ceremony' ? 'La Ceremonia' : 'La Celebración', name: venue.name, address: `${venue.address}, ${venue.city}`, time: logistics.agenda?.[idx]?.time || '18:00' }, logistics.event_date)
    }))
    : [
      { title: 'LA CEREMONIA', name: 'CATEDRAL DE SANTA MARÍA', address: 'CALLE PRINCIPAL 123, CIUDAD', time: '17:00', mapsLink: '#', calendarLink: '#' },
      { title: 'LA CELEBRACIÓN', name: 'PALACIO DE CRISTAL', address: 'AVENIDA CENTRAL 456, CIUDAD', time: '19:30', mapsLink: '#', calendarLink: '#' }
    ];

  return (
    <section className="py-12 md:py-40 px-6" style={{ backgroundColor: COLORS.white }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header numerado: 01. CUÁNDO Y DÓNDE */}
        <div className="mb-20">
          <span className="text-[10px] tracking-[0.4em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
            01
          </span>
          <h2 className="text-3xl md:text-4xl tracking-tight" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, letterSpacing: '-0.02em' }}>
            CUÁNDO Y DÓNDE
          </h2>
          <div className="w-24 h-px mt-8" style={{ backgroundColor: COLORS.graphite }} />
        </div>

        {/* Fecha del evento destacada */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <p className="text-2xl md:text-3xl tracking-[0.2em] uppercase" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300 }}>
            {formattedDate}
          </p>
        </motion.div>

        {/* Venues en dos columnas - misma altura siempre */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-stretch">
          {venues.map((venue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
              className="flex flex-col h-full"
            >
              {/* Label */}
              <span className="text-[10px] tracking-[0.3em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
                {venue.title}
              </span>

              {/* Nombre del lugar */}
              <h3 className="text-lg md:text-xl tracking-tight mb-3" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 400, letterSpacing: '0.02em' }}>
                {venue.name}
              </h3>

              {/* Dirección */}
              <p className="text-xs leading-relaxed mb-2 flex-grow" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.body, fontWeight: 300 }}>
                {venue.address}
              </p>

              {/* Horario */}
              <p className="text-[10px] tracking-[0.2em] uppercase mb-8" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
                {venue.time} HS
              </p>

              {/* Botones con solo borde inferior de 1px */}
              <div className="flex gap-8 pt-6 mt-auto" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <a
                  href={venue.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.25em] uppercase pb-1 transition-opacity hover:opacity-50"
                  style={{ color: COLORS.graphite, fontFamily: FONTS.body, borderBottom: `1px solid ${COLORS.graphite}` }}
                >
                  COMO LLEGAR
                </a>
                <a
                  href={venue.calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.25em] uppercase pb-1 transition-opacity hover:opacity-50"
                  style={{ color: COLORS.graphite, fontFamily: FONTS.body, borderBottom: `1px solid ${COLORS.graphite}` }}
                >
                  AGENDAR
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 5: TIMELINE (02. EL ITINERARIO)
// ============================================
function TimelineSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const events = logistics.agenda?.length > 0
    ? logistics.agenda.map((item) => ({ time: item.time, title: item.title.toUpperCase(), description: (item.description || '').toUpperCase() }))
    : [
      { time: '16:30', title: 'RECEPCIÓN DE INVITADOS', description: 'CÓCTEL DE BIENVENIDA' },
      { time: '17:30', title: 'LA CEREMONIA', description: 'INTERCAMBIO DE VOTOS' },
      { time: '19:00', title: 'EL BANQUETE', description: 'CENA BAJO LAS ESTRELLAS' },
      { time: '22:00', title: 'EL BAILE', description: 'CELEBRACIÓN HASTA LA MADRUGADA' }
    ];

  return (
    <section className="py-12 md:py-40 px-6" style={{ backgroundColor: COLORS.white }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header numerado: 02. EL ITINERARIO */}
        <div className="mb-20">
          <span className="text-[10px] tracking-[0.4em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
            02
          </span>
          <h2 className="text-3xl md:text-4xl tracking-tight" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, letterSpacing: '-0.02em' }}>
            EL ITINERARIO
          </h2>
          <div className="w-24 h-px mt-8" style={{ backgroundColor: COLORS.graphite }} />
        </div>

        {/* Timeline con eje vertical de 0.5px */}
        <div className="relative">
          {/* Línea vertical central de 0.5px - left-4 en mobile, centrada en desktop */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2" style={{ backgroundColor: COLORS.borderDark }} />

          <div className="space-y-0">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} py-10`}
              >
                {/* Contenido - pl-12 en mobile para no superponerse con la línea */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  {/* Hora */}
                  <span className="text-[10px] tracking-[0.3em] uppercase block mb-2" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
                    {event.time}
                  </span>

                  {/* Título en mayúsculas */}
                  <h3 className="text-sm md:text-base tracking-[0.15em] uppercase mb-2" style={{ color: COLORS.graphite, fontFamily: FONTS.body, fontWeight: 400 }}>
                    {event.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-[10px] tracking-[0.1em] uppercase" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.body }}>
                    {event.description}
                  </p>
                </div>

                {/* Punto en la línea - left-4 en mobile, centrado en desktop */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.graphite }} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 6: DRESS CODE (03. CÓDIGO DE VESTIMENTA)
// ============================================
function DressCodeSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const dressCodeText = logistics.dress_code?.code === 'formal' ? 'FORMAL ELEGANTE' :
    logistics.dress_code?.code === 'black-tie' ? 'BLACK TIE' :
      logistics.dress_code?.code === 'cocktail' ? 'COCKTAIL' :
        logistics.dress_code?.code === 'semi-formal' ? 'SEMI FORMAL' :
          logistics.dress_code?.code === 'casual-elegante' ? 'CASUAL ELEGANTE' :
            logistics.dress_code?.code === 'themed' ? 'TEMÁTICA ESPECIAL' :
              logistics.dress_code?.description?.toUpperCase() || 'FORMAL ELEGANTE';

  return (
    <section className="py-12 md:py-40 px-6" style={{ backgroundColor: COLORS.offWhite }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Header numerado: 03 */}
        <span className="text-[10px] tracking-[0.4em] uppercase block mb-8" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
          03
        </span>

        <h2 className="text-3xl md:text-4xl tracking-tight mb-12" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, letterSpacing: '-0.02em' }}>
          CÓDIGO DE VESTIMENTA
        </h2>

        {/* Dress Code en mayúsculas, centrado, destacado */}
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xl md:text-2xl tracking-[0.2em] uppercase"
          style={{ color: COLORS.graphite, fontFamily: FONTS.body, fontWeight: 300 }}
        >
          {dressCodeText}
        </motion.p>

        {logistics.dress_code?.description && logistics.dress_code.code !== 'themed' && (
          <p className="mt-8 text-xs leading-relaxed max-w-md mx-auto" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.body, fontWeight: 300 }}>
            {logistics.dress_code.description}
          </p>
        )}
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 7: GALLERY (04. NUESTRO ÁLBUM) - Lookbook style desktop, slider mobile
// ============================================
function GallerySection({ content }: { content: InvitationSchema['content'] }) {
  const photos = content.gallery_images?.length
    ? content.gallery_images
    : [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&h=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&h=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&h=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=800&h=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1600&h=700&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&h=1200&auto=format&fit=crop',
    ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Autoplay en mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 4000); // Cambia cada 4 segundos
    return () => clearInterval(interval);
  }, [photos.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-12 md:py-40 px-6" style={{ backgroundColor: COLORS.white }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header numerado: 04. NUESTRO ÁLBUM */}
        <div className="mb-20">
          <span className="text-[10px] tracking-[0.4em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
            04
          </span>
          <h2 className="text-3xl md:text-4xl tracking-tight" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, letterSpacing: '-0.02em' }}>
            NUESTRO ÁLBUM
          </h2>
          <div className="w-24 h-px mt-8" style={{ backgroundColor: COLORS.graphite }} />
        </div>

        {/* Mobile: Slider con autoplay */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {photos.map((photo, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={photo}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.8) contrast(1.05)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de slide */}
          <div className="flex justify-center gap-2 mt-6">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="w-2 h-2 transition-all"
                style={{
                  backgroundColor: currentSlide === index ? COLORS.graphite : COLORS.borderDark,
                  borderRadius: '50%'
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Maquetación lookbook */}
        <div className="hidden md:block space-y-12">
          {/* Fila 1: Full width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-[21/9] overflow-hidden">
              <img
                src={photos[0]}
                alt="Gallery 1"
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.8) contrast(1.05)' }}
              />
            </div>
          </motion.div>

          {/* Fila 2: Dos fotos con espacio negativo */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="md:pr-16"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={photos[1] || photos[0]}
                  alt="Gallery 2"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.8) contrast(1.05)' }}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:pl-16 md:pt-24"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={photos[2] || photos[0]}
                  alt="Gallery 3"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.8) contrast(1.05)' }}
                />
              </div>
            </motion.div>
          </div>

          {/* Fila 3: Foto centrada pequeña (recorte de prensa) */}
          <div className="flex justify-center py-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-md p-8 border"
              style={{ borderColor: COLORS.border }}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={photos[3] || photos[0]}
                  alt="Gallery 4"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.8) contrast(1.05)' }}
                />
              </div>
            </motion.div>
          </div>

          {/* Fila 4: Full width panorámica */}
          {photos.length >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="aspect-[21/9] overflow-hidden">
                <img
                  src={photos[4]}
                  alt="Gallery 5"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.8) contrast(1.05)' }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 8: GIFT HUB (05. PRESENTES) - Ficha técnica
// ============================================
function GiftSection({ features }: { features: InvitationSchema['features'] }) {
  const [copied, setCopied] = useState(false);
  const alias = features.gift_registry?.bank_details?.alias || 'NOMBRES.BODA';
  const accountNumber = features.gift_registry?.bank_details?.account_number || '0000000000000000000000';
  const externalRegistry = features.gift_registry?.registries?.[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(alias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 md:py-40 px-6" style={{ backgroundColor: COLORS.offWhite }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header numerado: 05. PRESENTES */}
        <div className="mb-16">
          <span className="text-[10px] tracking-[0.4em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
            05
          </span>
          <h2 className="text-3xl md:text-4xl tracking-tight" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, letterSpacing: '-0.02em' }}>
            PRESENTES
          </h2>
          <div className="w-24 h-px mt-8" style={{ backgroundColor: COLORS.graphite }} />
        </div>

        {/* Mensaje */}
        <p className="text-sm leading-relaxed mb-12" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.body, fontWeight: 300 }}>
          {features.gift_registry?.message || 'Tu presencia es el regalo más importante. Si deseas contribuir a nuestro nuevo capítulo juntos, te lo agradecemos de corazón.'}
        </p>

        {/* Ficha técnica estilo editorial */}
        <div className="p-10 border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
          <span className="text-[9px] tracking-[0.3em] uppercase block mb-8" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
            Datos Bancarios
          </span>

          <div className="space-y-6">
            <div className="flex justify-between items-baseline pb-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>Alias</span>
              <span className="text-sm tracking-wide" style={{ color: COLORS.graphite, fontFamily: FONTS.body, fontWeight: 400 }}>{alias}</span>
            </div>
            <div className="flex justify-between items-baseline pb-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>Cuenta</span>
              <span className="text-[10px] tracking-wider" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.body }}>
                ****{accountNumber.slice(-8)}
              </span>
            </div>
            {features.gift_registry?.bank_details?.bank_name && (
              <div className="flex justify-between items-baseline pb-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>Banco</span>
                <span className="text-[10px] tracking-wider" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.body }}>
                  {features.gift_registry.bank_details.bank_name.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="mt-8 text-[10px] tracking-[0.25em] uppercase transition-opacity hover:opacity-50"
            style={{ color: COLORS.graphite, fontFamily: FONTS.body, borderBottom: `1px solid ${COLORS.graphite}` }}
          >
            {copied ? 'COPIADO' : 'COPIAR ALIAS'}
          </button>
        </div>

        {/* Link a lista de regalos */}
        {externalRegistry && (
          <div className="mt-10 text-center">
            <a
              href={externalRegistry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.25em] uppercase transition-opacity hover:opacity-50 inline-block"
              style={{ color: COLORS.graphite, fontFamily: FONTS.body, borderBottom: `1px solid ${COLORS.graphite}` }}
            >
              GIFT LIST
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 9: RSVP (06. CONFIRMACIÓN) - Formulario VIP
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
      <section className="py-12 md:py-40 px-6" style={{ backgroundColor: COLORS.white }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="p-12 border" style={{ borderColor: COLORS.border }}>
            <p className="text-2xl tracking-tight mb-4" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300 }}>
              Gracias
            </p>
            <p className="text-sm" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.body, fontWeight: 300 }}>
              Hemos registrado tu respuesta. Te esperamos con alegría.
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp-section" className="py-12 md:py-40 px-6" style={{ backgroundColor: COLORS.white }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto"
      >
        {/* Header numerado: 06. CONFIRMACIÓN */}
        <div className="mb-16">
          <span className="text-[10px] tracking-[0.4em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
            06
          </span>
          <h2 className="text-3xl md:text-4xl tracking-tight" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300, letterSpacing: '-0.02em' }}>
            CONFIRMACIÓN
          </h2>
          <div className="w-24 h-px mt-8" style={{ backgroundColor: COLORS.graphite }} />
        </div>

        {error && (
          <div className="p-4 mb-8 text-center text-sm" style={{ backgroundColor: COLORS.offWhite, color: COLORS.graphite }}>
            {error}
          </div>
        )}

        {/* Formulario VIP - inputs como líneas horizontales */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Nombre */}
          <div>
            <label className="text-[9px] tracking-[0.25em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full py-3 bg-transparent focus:outline-none text-base"
              style={{
                color: COLORS.graphite,
                fontFamily: FONTS.display,
                borderBottom: `1px solid ${COLORS.graphite}`,
                borderRadius: 0
              }}
              placeholder="Tu nombre"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[9px] tracking-[0.25em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full py-3 bg-transparent focus:outline-none text-base"
              style={{
                color: COLORS.graphite,
                fontFamily: FONTS.display,
                borderBottom: `1px solid ${COLORS.graphite}`,
                borderRadius: 0
              }}
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          {/* Asistencia */}
          <div>
            <label className="text-[9px] tracking-[0.25em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
              ¿Asistirás?
            </label>
            <div className="flex gap-8">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attendance: true })}
                className="text-[11px] tracking-[0.2em] uppercase pb-1 transition-all"
                style={{
                  color: formData.attendance ? COLORS.graphite : COLORS.graphiteMuted,
                  fontFamily: FONTS.body,
                  borderBottom: `1px solid ${formData.attendance ? COLORS.graphite : 'transparent'}`
                }}
                disabled={loading}
              >
                SÍ, ASISTIRÉ
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attendance: false })}
                className="text-[11px] tracking-[0.2em] uppercase pb-1 transition-all"
                style={{
                  color: !formData.attendance ? COLORS.graphite : COLORS.graphiteMuted,
                  fontFamily: FONTS.body,
                  borderBottom: `1px solid ${!formData.attendance ? COLORS.graphite : 'transparent'}`
                }}
                disabled={loading}
              >
                NO PODRÉ IR
              </button>
            </div>
          </div>

          {/* Campos condicionales si asiste */}
          {formData.attendance && (
            <>
              {/* Número de invitados */}
              <div>
                <label className="text-[9px] tracking-[0.25em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
                  Número de Invitados
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  className="w-full py-3 bg-transparent focus:outline-none text-base cursor-pointer"
                  style={{
                    color: COLORS.graphite,
                    fontFamily: FONTS.display,
                    borderBottom: `1px solid ${COLORS.graphite}`,
                    borderRadius: 0
                  }}
                  disabled={loading}
                >
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num} style={{ backgroundColor: COLORS.white }}>
                      {num} {num === 1 ? 'persona' : 'personas'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Restricciones alimentarias */}
              <div>
                <label className="text-[9px] tracking-[0.25em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
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
                    triggerClassName: "w-full py-3 bg-transparent focus:outline-none transition-colors text-base",
                    dropdownClassName: "border rounded-none shadow-lg",
                    optionClassName: "px-4 py-3 cursor-pointer transition-colors text-sm",
                    tagClassName: "px-3 py-1 text-[10px] tracking-wider uppercase",
                    inputClassName: "px-3 py-2 border rounded-none text-sm focus:outline-none"
                  }}
                  colors={{
                    border: COLORS.borderDark,
                    text: COLORS.graphite,
                    placeholder: COLORS.graphiteMuted,
                    background: COLORS.white,
                    hover: COLORS.offWhite,
                    selected: COLORS.graphite,
                    tagBg: COLORS.graphite,
                    tagText: COLORS.white,
                    buttonBg: COLORS.graphite,
                    buttonHover: COLORS.graphiteMedium,
                    buttonText: COLORS.white,
                    checkColor: COLORS.white,
                    checkBg: COLORS.graphite
                  }}
                />
              </div>

              {/* Sugerencia musical */}
              <div>
                <label className="text-[9px] tracking-[0.25em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
                  Sugerencia Musical
                </label>
                <input
                  type="text"
                  value={formData.musicSuggestion}
                  onChange={(e) => setFormData({ ...formData, musicSuggestion: e.target.value })}
                  className="w-full py-3 bg-transparent focus:outline-none text-base"
                  style={{
                    color: COLORS.graphite,
                    fontFamily: FONTS.display,
                    borderBottom: `1px solid ${COLORS.graphite}`,
                    borderRadius: 0
                  }}
                  placeholder="¿Qué canción no puede faltar?"
                  disabled={loading}
                />
              </div>

              {/* Preguntas personalizadas */}
              {customQuestions.length > 0 && (
                <div className="space-y-8 pt-8" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
                    Preguntas Adicionales
                  </p>
                  {customQuestions.map((question) => (
                    <div key={question.id}>
                      <label className="text-[9px] tracking-[0.25em] uppercase block mb-4" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
                        {question.question}
                        {question.required && <span style={{ color: '#EF4444' }}> *</span>}
                      </label>
                      {question.type === 'text' ? (
                        <input
                          type="text"
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none text-base"
                          style={{
                            color: COLORS.graphite,
                            fontFamily: FONTS.display,
                            borderBottom: `1px solid ${COLORS.graphite}`,
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
                          className="w-full py-3 bg-transparent focus:outline-none text-base cursor-pointer"
                          style={{
                            color: COLORS.graphite,
                            fontFamily: FONTS.display,
                            borderBottom: `1px solid ${COLORS.graphite}`,
                            borderRadius: 0
                          }}
                          disabled={loading}
                        >
                          <option value="" style={{ backgroundColor: COLORS.white }}>Selecciona...</option>
                          {question.options?.map((opt) => (
                            <option key={opt} value={opt} style={{ backgroundColor: COLORS.white }}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <textarea
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none text-base resize-none"
                          style={{
                            color: COLORS.graphite,
                            fontFamily: FONTS.display,
                            borderBottom: `1px solid ${COLORS.graphite}`,
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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 text-[11px] tracking-[0.3em] uppercase transition-colors disabled:opacity-50"
            style={{
              backgroundColor: COLORS.graphite,
              color: COLORS.white,
              fontFamily: FONTS.body,
              borderRadius: 0
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
              </span>
            ) : (
              'ENVIAR CONFIRMACIÓN'
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

// ============================================
// SECCIÓN 10: FOOTER - Monograma minimalista
// ============================================
function Footer({ content }: { content: InvitationSchema['content'] }) {
  const initials = content.couple ?
    `${content.couple.person1.name.charAt(0)}${content.couple.person2.name.charAt(0)}` :
    'M&E';

  return (
    <footer className="py-12 md:py-28 px-6" style={{ backgroundColor: COLORS.white, borderTop: `1px solid ${COLORS.border}` }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Monograma */}
          <div className="mb-10">
            <span className="text-4xl tracking-tight" style={{ color: COLORS.graphite, fontFamily: FONTS.display, fontWeight: 300 }}>
              {initials}
            </span>
          </div>

          {/* Frase de cierre */}
          <p className="text-[10px] tracking-[0.25em] uppercase mb-8" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
            Con amor, gracias por ser parte de nuestra historia
          </p>

          {/* Nota de privacidad */}
          <p className="text-[9px] tracking-[0.15em] uppercase" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body, opacity: 0.6 }}>
            Esta invitación es privada y personalizada
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// SECCIÓN 11: VOWS FOOTER - Footer corporativo
// ============================================
function VowsFooter() {
  return (
    <footer className="py-12 md:py-20 px-6" style={{ backgroundColor: COLORS.graphite }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16" style={{ borderBottom: `1px solid ${COLORS.graphiteMedium}` }}>
          <div className="space-y-6">
            <span className="text-2xl tracking-tight" style={{ color: COLORS.white, fontFamily: FONTS.display, fontWeight: 400 }}>
              VOWS<span style={{ color: COLORS.graphiteMuted }}>.</span>
            </span>
            <p className="text-xs uppercase tracking-[0.3em] font-light max-w-xs leading-relaxed" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
              Redefiniendo la estética nupcial digital. <br /> Hecho con calma en Argentina.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 md:gap-16">
            <div className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.4em] font-bold" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.body }}>Contacto</p>
              <a href="mailto:hola@vows.ar" className="block text-sm transition-opacity hover:opacity-50" style={{ color: COLORS.white, fontFamily: FONTS.body }}>hola@vows.ar</a>
              <a href="https://wa.me/5491100000000" className="block text-sm transition-opacity hover:opacity-50" style={{ color: COLORS.white, fontFamily: FONTS.body }}>WhatsApp Concierge</a>
            </div>
            <div className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.4em] font-bold" style={{ color: COLORS.graphiteLight, fontFamily: FONTS.body }}>Legales</p>
              <a href="#" className="block text-sm transition-opacity hover:opacity-50" style={{ color: COLORS.white, fontFamily: FONTS.body }}>Términos de uso</a>
              <a href="#" className="block text-sm transition-opacity hover:opacity-50" style={{ color: COLORS.white, fontFamily: FONTS.body }}>Privacidad</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: COLORS.graphiteMuted, fontFamily: FONTS.body }}>
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
export function MonogramLayout({ invitation, preview, previewMobile }: MonogramLayoutProps) {
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
        isVisible={features.show_countdown}
        data={features.countdown}
        fallback={preview ? <EmptyStatePreview icon="◷" title="Cuenta Regresiva" description="Configura la fecha de tu evento" /> : null}
      >
        <CountdownSection logistics={logistics} />
      </FeatureGate>

      <FeatureGate
        isVisible={!!content.quote || !!content.couple?.love_story}
        data={content.quote}
        fallback={preview ? <EmptyStatePreview icon="❝" title="Frase Especial" description="Agrega una frase o historia de amor" /> : null}
      >
        <QuoteSection content={content} />
      </FeatureGate>

      <FeatureGate
        isVisible={features.show_venue_map}
        data={logistics.venues}
        fallback={preview ? <EmptyStatePreview icon="⌖" title="Ubicaciones" description="Indica dónde será el evento" /> : null}
      >
        <VenuesSection logistics={logistics} content={content} />
      </FeatureGate>

      <FeatureGate
        isVisible={features.show_agenda}
        data={logistics.agenda}
        fallback={preview ? <EmptyStatePreview icon="▣" title="Agenda" description="Agrega los momentos clave de tu evento" /> : null}
      >
        <TimelineSection logistics={logistics} />
      </FeatureGate>

      <FeatureGate
        isVisible={features.show_dress_code}
        data={logistics.dress_code}
        fallback={preview ? <EmptyStatePreview icon="◈" title="Dress Code" description="Especifica el código de vestimenta" /> : null}
      >
        <DressCodeSection logistics={logistics} />
      </FeatureGate>

      <FeatureGate
        isVisible={features.show_gallery}
        data={content.gallery_images}
        fallback={preview ? <EmptyStatePreview icon="▣" title="Galería" description="Comparte tus mejores momentos" /> : null}
      >
        <GallerySection content={content} />
      </FeatureGate>

      <FeatureGate
        isVisible={features.show_gift_registry}
        data={features.gift_registry}
        fallback={preview ? <EmptyStatePreview icon="◉" title="Mesa de Regalos" description="Comparte los datos bancarios" /> : null}
      >
        <GiftSection features={features} />
      </FeatureGate>

      <FeatureGate
        isVisible={features.show_rsvp}
        data={features.rsvp}
        fallback={preview ? <EmptyStatePreview icon="✉" title="Confirmar Asistencia" description="Activa el formulario RSVP" /> : null}
      >
        <RSVPSection features={features} content={content} metadata={metadata} />
      </FeatureGate>

      <Footer content={content} />
      <VowsFooter />

      {/* Botón flotante para Confirmar */}
      <FeatureGate
        isVisible={features.show_rsvp}
        data={features.rsvp}
      >
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={() => {
            const rsvpSection = document.getElementById('rsvp-section');
            if (rsvpSection) {
              rsvpSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="fixed bottom-6 right-6 z-50 px-6 py-3 text-[11px] tracking-[0.15em] uppercase transition-all hover:opacity-90 shadow-lg"
          style={{
            backgroundColor: COLORS.graphite,
            color: COLORS.white,
            fontFamily: FONTS.body,
            fontWeight: 300,
            borderRadius: 0
          }}
        >
          Confirmar
        </motion.button>
      </FeatureGate>
    </main>
  );
}
