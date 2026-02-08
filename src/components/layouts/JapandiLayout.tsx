'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  MapPin,
  Calendar,
  X,
  Gift,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Mail,
  Waves,
  Music,
  Loader2,
  ArrowUpRight
} from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { DietaryRestrictionsDropdown } from '@/components/shared/DietaryRestrictionsDropdown';
import { createClient } from '@supabase/supabase-js';
import { submitRSVP } from '@/app/actions/rsvp';
import { parseDateLocal } from '@/lib/utils';

interface JapandiLayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
  previewMobile?: boolean;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Empty state component for preview mode
function EmptyStatePreview({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="py-16 px-6 text-center" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="text-4xl mb-4" style={{ color: '#B8956A' }}>{icon}</div>
      <h3 className="text-lg font-light mb-2 tracking-wide" style={{ color: '#5C5B57' }}>{title}</h3>
      <p className="text-sm" style={{ color: '#8A8986' }}>{description}</p>
    </div>
  );
}

// 1. Hero Section - The Still Point
function HeroSection({ content, logistics, previewMobile }: { content: InvitationSchema['content']; logistics: InvitationSchema['logistics']; previewMobile?: boolean }) {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const eventDate = parseDateLocal(logistics.event_date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('es-ES', { month: 'long' });
  const year = eventDate.getFullYear();
  const headline = content.headline || 'Nuestra Boda';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
      
      {/* Mobile: layout vertical fluido */}
      <div className={`${previewMobile ? 'flex' : 'md:hidden flex'} flex-col items-center justify-center px-4 py-8 min-h-screen`}>
        <div className="relative w-full max-w-2xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative mx-auto mb-6"
            style={{ maxWidth: '280px' }}
          >
            <div className="relative overflow-hidden" style={{ borderRadius: '2px', boxShadow: '0 20px 60px rgba(92, 91, 87, 0.15)' }}>
              <img
                src={content.cover_image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop'}
                alt="Couple"
                className="w-full h-auto object-cover"
                style={{ filter: 'sepia(10%) saturate(90%) brightness(1.05)', aspectRatio: '3/4' }}
              />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(250, 248, 245, 0.4) 100%)' }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="text-center">
            {/* Headline */}
            <p className="text-xs uppercase tracking-[0.4em] font-light mb-4" style={{ color: '#B8956A', fontFamily: "'Montserrat', sans-serif" }}>
              {headline}
            </p>
            <h1 className="font-serif font-normal tracking-wide mb-1" style={{ color: '#5C5B57', fontSize: 'clamp(2rem, 8vw, 3rem)', fontFamily: "'Playfair Display', serif" }}>
              {content.couple?.person1.name || 'Sakura'}
            </h1>
            <span className="font-serif italic text-xl" style={{ color: '#B8956A', fontFamily: "'Playfair Display', serif" }}>&</span>
            <h1 className="font-serif font-normal tracking-wide mt-1" style={{ color: '#5C5B57', fontSize: 'clamp(1.75rem, 7vw, 2.5rem)', fontFamily: "'Playfair Display', serif" }}>
              {content.couple?.person2.name || 'Kenji'}
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="text-center mt-6">
            <p className="text-xs uppercase tracking-[0.3em] font-light" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>
              {day} {month} {year}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] font-light mt-2" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>
              {logistics.venues[0]?.name || 'Ceremonia'}
            </p>
          </motion.div>

          {/* Explorar button - ahora en el flujo normal, no absolute */}
          <motion.button
            onClick={scrollToContent}
            className="mt-12 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-[0.3em] font-light" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>Explorar</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Desktop: layout horizontal de dos columnas */}
      <div className={`${previewMobile ? 'hidden' : 'hidden md:flex'} absolute inset-0 items-center justify-center px-8 lg:px-16`}>
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Columna izquierda: Imagen */}
            <div className="col-span-5 lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <div className="relative overflow-hidden" style={{ borderRadius: '2px', boxShadow: '0 30px 80px rgba(92, 91, 87, 0.12)' }}>
                  <img
                    src={content.cover_image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop'}
                    alt="Couple"
                    className="w-full h-auto object-cover"
                    style={{ filter: 'sepia(10%) saturate(90%) brightness(1.05)', aspectRatio: '3/4' }}
                  />
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(250, 248, 245, 0.3) 100%)' }} />
                </div>
              </motion.div>
            </div>

            {/* Columna derecha: Contenido textual */}
            <div className="col-span-7 lg:col-span-8 flex flex-col justify-center pl-8 lg:pl-16">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              >
                {/* Línea decorativa superior */}
                <div className="w-16 h-px mb-8" style={{ backgroundColor: '#B8956A' }} />
                
                {/* Headline */}
                <p className="text-xs uppercase tracking-[0.4em] font-light mb-6" style={{ color: '#B8956A', fontFamily: "'Montserrat', sans-serif" }}>
                  {headline}
                </p>
                
                {/* Nombres */}
                <h1 className="font-serif font-normal tracking-wide" style={{ color: '#5C5B57', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
                  {content.couple?.person1.name || 'Sakura'}
                </h1>
                <div className="flex items-center gap-4 my-4">
                  <div className="w-12 h-px" style={{ backgroundColor: '#D4CFC4' }} />
                  <span className="font-serif italic text-2xl lg:text-3xl" style={{ color: '#B8956A', fontFamily: "'Playfair Display', serif" }}>&</span>
                  <div className="w-12 h-px" style={{ backgroundColor: '#D4CFC4' }} />
                </div>
                <h1 className="font-serif font-normal tracking-wide" style={{ color: '#5C5B57', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
                  {content.couple?.person2.name || 'Kenji'}
                </h1>

                {/* Separador */}
                <div className="w-24 h-px my-8" style={{ backgroundColor: '#E8E4DB' }} />

                {/* Fecha y ubicación */}
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.25em] font-light" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>
                    {day} {month} {year}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px" style={{ backgroundColor: '#D4CFC4' }} />
                    <p className="text-xs uppercase tracking-[0.2em] font-light" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>
                      {logistics.venues[0]?.name || 'Ceremonia'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Botón Explorar */}
      <motion.button
        onClick={scrollToContent}
        className={`${previewMobile ? 'hidden' : 'hidden md:block'} absolute bottom-8 md:bottom-16 left-1/2 transform -translate-x-1/2 z-20`}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.3em] font-light mb-2 md:mb-4" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>Explorar</span>
          <div className="hidden md:block w-px h-8 bg-current" style={{ color: '#B8956A' }} />
        </div>
      </motion.button>
    </section>
  );
}

// 2. Countdown Section - The Unfolding Moment
function CountdownSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const eventDate = logistics.event_date || new Date().toISOString();
  console.log('[Countdown] Event date received:', eventDate);
  const targetDate = parseDateLocal(eventDate).getTime();
  console.log('[Countdown] Target timestamp:', targetDate, 'Current:', Date.now(), 'Diff:', targetDate - Date.now());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Calculate immediately
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
    
    calculateTimeLeft(); // Run immediately
    
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-4 md:mx-8">
      <div
        className="font-light text-4xl md:text-6xl lg:text-7xl tracking-wider"
        style={{ color: '#5C5B57', fontFamily: "'Montserrat', sans-serif", fontWeight: 200 }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs uppercase tracking-[0.2em] mt-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>{label}</div>
    </div>
  );

  return (
    <section className="py-24 md:py-32 px-4 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #F5F2EB 0%, #FAF8F5 70%)' }}>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="max-w-5xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-12 font-light" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>El momento se acerca</p>
        <div className="flex flex-wrap justify-center items-center">
          <TimeUnit value={timeLeft.days} label="Días" />
          <span className="text-2xl md:text-4xl font-light self-start mt-2" style={{ color: '#B8956A' }}>:</span>
          <TimeUnit value={timeLeft.hours} label="Horas" />
          <span className="text-2xl md:text-4xl font-light self-start mt-2" style={{ color: '#B8956A' }}>:</span>
          <TimeUnit value={timeLeft.minutes} label="Minutos" />
          <span className="text-2xl md:text-4xl font-light self-start mt-2 hidden md:block" style={{ color: '#B8956A' }}>:</span>
          <div className="w-full md:hidden" />
          <TimeUnit value={timeLeft.seconds} label="Segundos" />
        </div>
      </motion.div>
    </section>
  );
}

// 3. Quote Section - The Reflection
function QuoteSection({ content }: { content: InvitationSchema['content'] }) {
  const quoteText = content.quote?.text || content.main_message || content.couple?.love_story ||
    '"En el silencio del ahora, encontramos la eternidad de nuestro amor. Como dos gotas de rocío que se funden en la bruma de la mañana."';
  const words = quoteText.split(' ');

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: '#F5F2EB' }}>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="max-w-3xl mx-auto text-center px-4">
        <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-16 h-px mx-auto mb-12" style={{ backgroundColor: '#B8956A' }} />
        <p className="font-serif italic leading-relaxed text-xl md:text-2xl lg:text-3xl" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              style={{ display: 'inline-block', marginRight: '0.3em', textShadow: '0 0 30px rgba(184, 149, 106, 0.1)' }}
            >
              {word}
            </motion.span>
          ))}
        </p>
        <motion.div initial={{ width: 0 }} whileInView={{ width: '60px' }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }} className="h-px mx-auto mt-12" style={{ backgroundColor: '#B8956A' }} />
        {content.quote?.author && (
          <p className="text-xs uppercase tracking-[0.3em] mt-8 font-light" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>{content.quote.author}</p>
        )}
      </motion.div>
    </section>
  );
}

// 4. Timeline - The Path
function TimelineSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const events = logistics.agenda?.length > 0
    ? logistics.agenda.map((item) => ({ time: item.time, title: item.title, description: item.description || '' }))
    : [
        { time: '16:00', title: 'Ceremonia del Té', description: 'Ritual de unión en el jardín zen' },
        { time: '17:30', title: 'Ceremonia Principal', description: 'Intercambio de votos bajo el cerezo' },
        { time: '19:00', title: 'Cena Kaiseki', description: 'Experiencia gastronómica de 7 tiempos' },
        { time: '21:30', title: 'Baile bajo las estrellas', description: 'Celebración en el pabellón de madera' }
      ];

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: '#FAF8F5' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">
        <h2 className="text-center font-serif text-2xl md:text-3xl tracking-wide mb-16" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>El Camino</h2>
        
        <div className="relative">
          {/* Línea vertical conectando los eventos en mobile, horizontal en desktop */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 5%, #D4CFC4 15%, #D4CFC4 85%, transparent 95%)' }} />
          <div className="md:hidden absolute top-0 bottom-0 left-8 w-px" style={{ background: 'linear-gradient(180deg, transparent 2%, #D4CFC4 10%, #D4CFC4 90%, transparent 98%)' }} />
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-4">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex md:flex-col items-center md:text-center gap-6 md:gap-0 w-full md:w-auto pl-4 md:pl-0"
              >
                {/* Punto del camino - círculo con relieve sutil */}
                <div className="flex-shrink-0 w-3 h-3 md:w-4 md:h-4 rounded-full relative z-10" style={{ 
                  backgroundColor: '#F5F2EB', 
                  border: '1.5px solid #B8956A',
                  boxShadow: '0 0 0 4px #FAF8F5, 0 2px 8px rgba(184, 149, 106, 0.2)'
                }} />
                
                <div className="flex-1 md:mt-6">
                  <span className="text-xs uppercase tracking-[0.25em] font-light block mb-2" style={{ color: '#B8956A', fontFamily: "'Montserrat', sans-serif" }}>{event.time}</span>
                  <h3 className="font-serif text-lg md:text-xl mb-2" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>{event.title}</h3>
                  <p className="text-xs font-light max-w-[220px]" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// 5. Venues - The Havens
function VenuesSection({ logistics, content, features }: { logistics: InvitationSchema['logistics']; content: InvitationSchema['content']; features: InvitationSchema['features'] }) {
  const generateCalendarLink = (venue: any, eventDate: string) => {
    const eventTitle = encodeURIComponent(`${content.headline || content.couple?.person1.name + ' & ' + content.couple?.person2.name} - ${venue.title}`);
    const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
    const details = encodeURIComponent(`Te esperamos para celebrar con nosotros. ${content.couple?.hashtag || ''}`);
    // Handle invalid or missing event date
    let baseDate = new Date(eventDate);
    if (isNaN(baseDate.getTime())) {
      baseDate = new Date(); // Default to today if invalid
    }
    const [hours, minutes] = venue.time ? venue.time.split(':') : ['18', '00'];
    baseDate.setHours(parseInt(hours), parseInt(minutes));
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0];
    const endDate = new Date(baseDate);
    endDate.setHours(endDate.getHours() + 1);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDate(baseDate)}/${formatDate(endDate)}&details=${details}&location=${location}`;
  };

  // Filter venues based on show_ceremony and show_reception toggles
  const showCeremony = features.show_ceremony ?? true;
  const showReception = features.show_reception ?? true;
  
  const allVenues = logistics.venues?.length > 0
    ? logistics.venues.map((venue, idx) => {
        const hasCoordinates = venue.coordinates?.lat != null && venue.coordinates?.lng != null;
        const lat = venue.coordinates?.lat;
        const lng = venue.coordinates?.lng;
        
        // Prioridad 1: Usar google_maps_url del usuario si existe (convertir a embed)
        // Prioridad 2: Usar coordenadas si existen
        // Prioridad 3: Usar dirección codificada como fallback
        let mapUrl: string;
        if (venue.google_maps_url) {
          // Convertir URL de Google Maps a formato embed
          const userUrl = venue.google_maps_url;
          if (userUrl.includes('/maps/place/')) {
            // URL tipo: https://www.google.com/maps/place/...
            mapUrl = userUrl.replace('/maps/place/', '/maps/embed?pb=!1m18!1m12!1m3!1d0!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s') + '&output=embed';
          } else if (userUrl.includes('?q=')) {
            // Ya tiene query params, agregar output=embed
            mapUrl = userUrl + (userUrl.includes('?') ? '&' : '?') + 'output=embed';
          } else {
            // URL corta u otra forma, usar directamente con output=embed
            mapUrl = userUrl + (userUrl.includes('?') ? '&' : '?') + 'output=embed';
          }
        } else if (hasCoordinates) {
          mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        } else {
          mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(venue.address)}&z=15&output=embed`;
        }
        
        return {
          title: venue.type === 'ceremony' ? 'Ceremonia' : venue.type === 'reception' ? 'Celebración' : venue.name,
          name: venue.name,
          address: venue.address,
          type: venue.type,
          time: logistics.agenda?.[idx]?.time || '18:00',
          mapUrl,
          mapsLink: venue.google_maps_url || (hasCoordinates ? `https://maps.google.com/?q=${lat},${lng}` : `https://maps.google.com/?q=${encodeURIComponent(venue.address)}`),
          calendarLink: generateCalendarLink({ title: venue.type === 'ceremony' ? 'Ceremonia' : 'Celebración', name: venue.name, address: venue.address, time: logistics.agenda?.[idx]?.time || '18:00' }, logistics.event_date)
        };
      })
    : [
        { title: 'Ceremonia', name: 'Templo Zen Ryōan-ji', address: 'Jardín de Piedras 13, Kioto', type: 'ceremony', time: '17:00', mapUrl: 'https://maps.google.com/maps?q=35.0345,135.7186&z=15&output=embed', mapsLink: 'https://maps.google.com/?q=Ryōan-ji,Kioto', calendarLink: generateCalendarLink({ title: 'Ceremonia', name: 'Templo Zen Ryōan-ji', address: 'Jardín de Piedras 13, Kioto', time: '17:00' }, logistics.event_date) },
        { title: 'Celebración', name: 'Pabellón de Bambú', address: 'Camino del Arroyo 88, Arashiyama', type: 'reception', time: '19:30', mapUrl: 'https://maps.google.com/maps?q=35.0095,135.6738&z=15&output=embed', mapsLink: 'https://maps.google.com/?q=Arashiyama,Kioto', calendarLink: generateCalendarLink({ title: 'Celebración', name: 'Pabellón de Bambú', address: 'Camino del Arroyo 88, Arashiyama', time: '19:30' }, logistics.event_date) }
      ];

  // Filter venues based on toggles
  const filteredVenues = allVenues.filter(venue => {
    if (venue.type === 'ceremony' && !showCeremony) return false;
    if (venue.type === 'reception' && !showReception) return false;
    return true;
  });

  // Adjust grid based on number of venues
  const gridClass = filteredVenues.length === 1 
    ? 'grid md:grid-cols-1 gap-12 max-w-2xl mx-auto' 
    : 'grid md:grid-cols-2 gap-12';

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: '#F0EDE6' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto">
        {/* Header minimalista con línea decorativa */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="w-16 md:w-24 h-px" style={{ backgroundColor: '#D4CFC4' }} />
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>
              {filteredVenues.length === 1 ? 'La Ubicación' : 'Las Ubicaciones'}
            </h2>
            <div className="w-16 md:w-24 h-px" style={{ backgroundColor: '#D4CFC4' }} />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] font-light" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>
            Direcciones del evento
          </p>
        </div>

        <div className={gridClass}>
          {filteredVenues.map((venue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Card minimalista sin imagen */}
              <div 
                className="p-8 md:p-10"
                style={{ 
                  backgroundColor: '#FAF8F5', 
                  border: '1px solid #D4CFC4',
                  borderRadius: '2px'
                }}
              >
                {/* Indicador de tipo de evento */}
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(184, 149, 106, 0.1)' }}
                  >
                    <MapPin className="w-4 h-4" style={{ color: '#B8956A' }} />
                  </div>
                  <span 
                    className="text-[10px] uppercase tracking-[0.25em] font-light"
                    style={{ color: '#B8956A', fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {venue.title}
                  </span>
                </div>

                {/* Nombre del lugar */}
                <h3 
                  className="font-serif text-2xl md:text-3xl mb-4 tracking-wide"
                  style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}
                >
                  {venue.name}
                </h3>

                {/* Divider elegante */}
                <div className="w-12 h-px mb-6" style={{ backgroundColor: '#D4CFC4' }} />

                {/* Dirección */}
                <p 
                  className="text-sm font-light mb-2 leading-relaxed"
                  style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}
                >
                  {venue.address}
                </p>

                {/* Horario si está disponible */}
                {venue.time && (
                  <p 
                    className="text-xs uppercase tracking-[0.15em] font-light mb-8"
                    style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {venue.time} hs
                  </p>
                )}

                {/* Botones de acción minimalistas */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t" style={{ borderColor: '#E8E4DB' }}>
                  <a 
                    href={venue.mapsLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-[11px] uppercase tracking-[0.15em] font-light transition-all duration-300 hover:bg-[#F5F2EB]"
                    style={{ 
                      color: '#5C5B57', 
                      border: '1px solid #D4CFC4', 
                      borderRadius: '2px', 
                      fontFamily: "'Montserrat', sans-serif" 
                    }}
                  >
                    <MapPin className="w-4 h-4" style={{ color: '#B8956A' }} />
                    Cómo llegar
                  </a>
                  <a 
                    href={venue.calendarLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 px-5 py-3 text-[11px] uppercase tracking-[0.15em] font-light transition-all duration-300 hover:bg-[#F5F2EB]"
                    style={{ 
                      color: '#5C5B57', 
                      border: '1px solid #D4CFC4', 
                      borderRadius: '2px', 
                      fontFamily: "'Montserrat', sans-serif" 
                    }}
                  >
                    <Calendar className="w-4 h-4" style={{ color: '#B8956A' }} />
                    Agendar
                  </a>
                </div>
              </div>

              {/* Decoración sutil: esquina con acento */}
              <div 
                className="absolute -top-2 -right-2 w-8 h-8 opacity-30"
                style={{ 
                  background: 'linear-gradient(135deg, transparent 50%, #B8956A 50%)',
                  borderRadius: '2px'
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// 6. Dress Code - The Attire Flow
function DressCodeSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const dressCodeText = logistics.dress_code?.code === 'formal' ? 'Formal Elegante' : 
    logistics.dress_code?.code === 'black-tie' ? 'Black Tie' : 
    logistics.dress_code?.code === 'cocktail' ? 'Cocktail' : 
    logistics.dress_code?.code === 'semi-formal' ? 'Semi Formal' : 
    logistics.dress_code?.code === 'casual-elegante' ? 'Casual Elegante' :
    logistics.dress_code?.code === 'casual' ? 'Casual' :
    logistics.dress_code?.code === 'smart-casual' ? 'Smart Casual' :
    logistics.dress_code?.code === 'themed' ? 'Temática Especial' :
    logistics.dress_code?.description || 'Elegancia Natural';
  const dressCodeDetail = logistics.dress_code?.description;

  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4" style={{ backgroundColor: '#F5F2EB' }}>
      <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }} 
        transition={{ duration: 1 }} 
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-8" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>Vestimenta</h2>
        
        <div className="w-px h-12 mx-auto mb-8" style={{ backgroundColor: '#B8956A' }} />
        
        <h3 className="font-serif text-2xl md:text-3xl tracking-wide mb-6" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>{dressCodeText}</h3>
        
        {dressCodeDetail && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm font-light leading-relaxed max-w-md mx-auto"
            style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}
          >
            {dressCodeDetail}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

// 7. Gallery - The Visual Journal
function GallerySection({ content }: { content: InvitationSchema['content'] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const photos = content.gallery_images?.length ? content.gallery_images : [
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519225495810-7517c33000e1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-16488321499b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop'
  ];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

  // Auto-play cada 5 segundos (solo mobile)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, photos.length]);

  return (
    <section className="py-24 md:py-32 overflow-hidden" style={{ backgroundColor: '#F5F2EB' }}>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        {/* Header con línea decorativa */}
        <div className="text-center mb-12 md:mb-16 px-4">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="w-16 md:w-24 h-px" style={{ backgroundColor: '#D4CFC4' }} />
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>Diario Visual</h2>
            <div className="w-16 md:w-24 h-px" style={{ backgroundColor: '#D4CFC4' }} />
          </div>
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-light" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>
            Momentos capturados en el tiempo
          </p>
        </div>

        {/* Mobile: Carrusel horizontal - una imagen por slide */}
        <div className="md:hidden relative px-4" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="overflow-hidden rounded-sm">
            <motion.div 
              className="flex" 
              animate={{ x: `-${currentIndex * (100 / photos.length)}%` }} 
              transition={{ duration: 0.5, ease: "easeInOut" }} 
              style={{ width: `${photos.length * 100}%` }}
            >
              {photos.map((photo, index) => (
                <div key={index} className="flex-shrink-0 px-2" style={{ width: `${100 / photos.length}%` }}>
                  <div className="aspect-[4/3] max-h-[50vh] w-full">
                    <img 
                      src={photo} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover rounded-sm" 
                      style={{ filter: 'sepia(10%) saturate(90%) contrast(0.95)' }} 
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          <AnimatePresence>
            {isHovered && (
              <>
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center" style={{ backgroundColor: 'rgba(250, 248, 245, 0.9)', borderRadius: '50%', boxShadow: '0 0 20px rgba(184, 149, 106, 0.3)' }}>
                  <ArrowLeft className="w-5 h-5" style={{ color: '#5C5B57' }} />
                </motion.button>
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center" style={{ backgroundColor: 'rgba(250, 248, 245, 0.9)', borderRadius: '50%', boxShadow: '0 0 20px rgba(184, 149, 106, 0.3)' }}>
                  <ArrowRight className="w-5 h-5" style={{ color: '#5C5B57' }} />
                </motion.button>
              </>
            )}
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-6">
            {photos.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)} className="w-2 h-2 rounded-full transition-all duration-300" style={{ backgroundColor: index === currentIndex ? '#B8956A' : '#D4CFC4' }} />
            ))}
          </div>
        </div>

        {/* Desktop: Grid asimétrico de 2 columnas con espaciado elegante */}
        <div className="hidden md:block max-w-5xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-2 gap-6 lg:gap-8">
            {/* Columna izquierda: 2 imágenes apiladas */}
            <div className="flex flex-col gap-6 lg:gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.8 }}
                className="overflow-hidden"
                style={{ borderRadius: '2px', boxShadow: '0 8px 30px rgba(92, 91, 87, 0.08)' }}
              >
                <img 
                  src={photos[0]} 
                  alt="Gallery 1" 
                  className="w-full object-cover transition-transform duration-700 hover:scale-105"
                  style={{ filter: 'sepia(10%) saturate(90%) contrast(0.95)', aspectRatio: '4/5' }} 
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.8, delay: 0.1 }}
                className="overflow-hidden"
                style={{ borderRadius: '2px', boxShadow: '0 8px 30px rgba(92, 91, 87, 0.08)' }}
              >
                <img 
                  src={photos[1]} 
                  alt="Gallery 2" 
                  className="w-full object-cover transition-transform duration-700 hover:scale-105"
                  style={{ filter: 'sepia(10%) saturate(90%) contrast(0.95)', aspectRatio: '3/2' }} 
                />
              </motion.div>
            </div>

            {/* Columna derecha: desplazada hacia abajo para asimetría */}
            <div className="flex flex-col gap-6 lg:gap-8 pt-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="overflow-hidden"
                style={{ borderRadius: '2px', boxShadow: '0 8px 30px rgba(92, 91, 87, 0.08)' }}
              >
                <img 
                  src={photos[2]} 
                  alt="Gallery 3" 
                  className="w-full object-cover transition-transform duration-700 hover:scale-105"
                  style={{ filter: 'sepia(10%) saturate(90%) contrast(0.95)', aspectRatio: '3/2' }} 
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.8, delay: 0.3 }}
                className="overflow-hidden"
                style={{ borderRadius: '2px', boxShadow: '0 8px 30px rgba(92, 91, 87, 0.08)' }}
              >
                <img 
                  src={photos[3]} 
                  alt="Gallery 4" 
                  className="w-full object-cover transition-transform duration-700 hover:scale-105"
                  style={{ filter: 'sepia(10%) saturate(90%) contrast(0.95)', aspectRatio: '4/5' }} 
                />
              </motion.div>
            </div>
          </div>

          {/* Tercera fila: imagen destacada centrada si hay 5+ fotos */}
          {photos.length >= 5 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 max-w-3xl mx-auto overflow-hidden"
              style={{ borderRadius: '2px', boxShadow: '0 8px 30px rgba(92, 91, 87, 0.08)' }}
            >
              <img 
                src={photos[4]} 
                alt="Gallery 5" 
                className="w-full object-cover transition-transform duration-700 hover:scale-105"
                style={{ filter: 'sepia(10%) saturate(90%) contrast(0.95)', aspectRatio: '21/9' }} 
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

// 8. Gift Registry - The Quiet Offering
function GiftRegistrySection({ features }: { features: InvitationSchema['features'] }) {
  const [copied, setCopied] = useState(false);
  const alias = features.gift_registry?.bank_details?.alias || 'SAKURAYKENJI.BODA';

  const handleCopy = () => {
    navigator.clipboard.writeText(alias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: '#FAF8F5' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-xl mx-auto text-center">
        <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-4" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>Una Sugerencia Gentil</h2>
        
        <div className="w-px h-8 mx-auto mb-8" style={{ backgroundColor: '#D4CFC4' }} />
        
        <p className="text-sm font-light leading-relaxed mb-10 max-w-md mx-auto" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>
          {features.gift_registry?.message || 'Tu presencia es el regalo más valioso. Si deseás contribuir a nuestro nuevo hogar, te lo agradecemos con el corazón.'}
        </p>
        
        {/* Alias minimalista */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Alias</p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-sm tracking-wide" style={{ color: '#5C5B57', fontFamily: "'Montserrat', sans-serif" }}>{alias}</span>
            <button 
              onClick={handleCopy} 
              className="text-xs uppercase tracking-[0.15em] font-light px-3 py-2 transition-all duration-300 hover:bg-[#F5F2EB]"
              style={{ color: '#B8956A', border: '1px solid #D4CFC4', borderRadius: '2px', fontFamily: "'Montserrat', sans-serif" }}
            >
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// 9. RSVP - The Gentle Affirmation
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
  // Estado para respuestas de preguntas personalizadas
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener preguntas personalizadas desde features.rsvp
  const customQuestions = features.rsvp?.custom_questions || [];

  const handleCustomAnswerChange = (questionId: string, value: string) => {
    setCustomAnswers(prev => ({ ...prev, [questionId]: value }));
  };

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
        customAnswers: customAnswers // Enviar respuestas personalizadas
      });
      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', attendance: true, guests: 1, dietary: [], musicSuggestion: '', message: '' });
        setCustomAnswers({}); // Limpiar respuestas personalizadas
      } else {
        setError(result.error || 'Error al enviar la confirmación');
      }
    } catch {
      setError('Error inesperado. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-24 md:py-32 px-4" style={{ backgroundColor: '#F5F2EB' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center">
          <div className="p-8" style={{ backgroundColor: '#FAF8F5', borderRadius: '2px', border: '1px solid #E8E4DB' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
              <Check className="w-10 h-10 mx-auto mb-4" style={{ color: '#B8956A' }} />
            </motion.div>
            <h3 className="font-serif text-xl mb-3" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>Confirmación Recibida</h3>
            <p className="text-sm font-light" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>Gracias {formData.name}, hemos registrado tu respuesta. Te esperamos con alegría.</p>
            <button onClick={() => setSuccess(false)} className="mt-6 text-xs uppercase tracking-[0.2em] font-light underline-offset-4 hover:underline" style={{ color: '#B8956A' }}>Enviar otra confirmación</button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp-section" className="py-24 md:py-32 px-4" style={{ backgroundColor: '#F5F2EB' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-xl mx-auto">
        <h2 className="text-center font-serif text-2xl md:text-3xl tracking-wide mb-4" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>Confirma tu Presencia</h2>
        <p className="text-center text-xs uppercase tracking-[0.2em] font-light mb-12" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Fecha límite: {features.rsvp?.deadline ? new Date(features.rsvp.deadline).toLocaleDateString('es-ES') : '30 días antes'}</p>
        {error && <div className="p-4 mb-6 text-center text-sm" style={{ backgroundColor: '#F8E4E4', color: '#8B5A5A', borderRadius: '2px' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Nombre Completo</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light" style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }} placeholder="Tu nombre" disabled={loading} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:shadow-[inset_0_0_0_50px_#FAF8F5] [&:-webkit-autofill]:text-[#5C5B57]" style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }} placeholder="tu@email.com" disabled={loading} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>¿Asistirás?</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setFormData({ ...formData, attendance: true })} className="flex-1 py-3 text-xs uppercase tracking-[0.15em] font-light transition-all duration-300" style={{ backgroundColor: formData.attendance ? '#B8956A' : 'transparent', color: formData.attendance ? '#FAF8F5' : '#5C5B57', border: '1px solid #D4CFC4', borderRadius: '2px', fontFamily: "'Montserrat', sans-serif" }} disabled={loading}>Sí, asistiré</button>
              <button type="button" onClick={() => setFormData({ ...formData, attendance: false })} className="flex-1 py-3 text-xs uppercase tracking-[0.15em] font-light transition-all duration-300" style={{ backgroundColor: !formData.attendance ? '#A8A6A2' : 'transparent', color: !formData.attendance ? '#FAF8F5' : '#5C5B57', border: '1px solid #D4CFC4', borderRadius: '2px', fontFamily: "'Montserrat', sans-serif" }} disabled={loading}>No podré ir</button>
            </div>
          </div>
          {/* Preguntas que se ocultan si no asiste */}
          {formData.attendance && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Número de Invitados</label>
                <select value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light cursor-pointer" style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }} disabled={loading}>
                  {[1, 2, 3, 4].map((num) => <option key={num} value={num} style={{ backgroundColor: '#FAF8F5' }}>{num} {num === 1 ? 'persona' : 'personas'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Restricciones Alimentarias</label>
                <DietaryRestrictionsDropdown
                  value={formData.dietary}
                  onChange={(value) => setFormData({ ...formData, dietary: value })}
                  options={[
                    "Vegetariano",
                    "Vegano", 
                    "Sin gluten",
                    "Diabético",
                    "Sin lactosa",
                    "Kosher",
                    "Halal",
                    "Alergias"
                  ]}
                  placeholder="Selecciona restricciones alimentarias..."
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
                    triggerClassName: "bg-transparent focus:outline-none transition-colors text-sm font-light",
                    dropdownClassName: "border-2 rounded-xl shadow-lg",
                    optionClassName: "px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                    tagClassName: "px-2 py-1 rounded-md text-xs font-medium",
                    inputClassName: "px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  }}
                  colors={{
                    border: '#D4CFC4',
                    text: '#5C5B57',
                    placeholder: '#A8A6A2',
                    background: '#FAF8F5',
                    hover: '#F5F2EB',
                    selected: '#F5F2EB',
                    tagBg: '#E8E4DB',
                    tagText: '#5C5B57',
                    buttonBg: '#B8956A',
                    buttonHover: '#9B7F5A',
                    buttonText: '#FFFFFF',
                    checkColor: '#FFFFFF',
                    checkBg: '#B8956A'
                  }}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Sugerencia Musical</label>
                <input type="text" value={formData.musicSuggestion} onChange={(e) => setFormData({ ...formData, musicSuggestion: e.target.value })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light" style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }} placeholder="¿Qué canción no puede faltar? (Ej: Perfect - Ed Sheeran)" disabled={loading} />
              </div>
              {/* Preguntas Personalizadas */}
              {customQuestions.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-[#E8E4DB]">
                  <p className="text-xs uppercase tracking-[0.2em] font-light" style={{ color: '#B8956A', fontFamily: "'Montserrat', sans-serif" }}>Preguntas Adicionales</p>
                  {customQuestions.map((question, index) => (
                    <div key={question.id}>
                      <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>
                        {question.question}
                        {question.required && <span className="text-[#B8956A] ml-1">*</span>}
                      </label>
                      {question.type === 'text' ? (
                        <input
                          type="text"
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light"
                          style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }}
                          placeholder="Tu respuesta..."
                          disabled={loading}
                        />
                      ) : question.type === 'select' ? (
                        <select
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light cursor-pointer"
                          style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }}
                          disabled={loading}
                        >
                          <option value="" style={{ backgroundColor: '#FAF8F5' }}>Selecciona una opción</option>
                          {question.options?.map((opt) => (
                            <option key={opt} value={opt} style={{ backgroundColor: '#FAF8F5' }}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <textarea
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light resize-none"
                          style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif", minHeight: '80px' }}
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
          
          <motion.button type="submit" disabled={loading} whileHover={{ boxShadow: '0 0 30px rgba(184, 149, 106, 0.3)' }} className="w-full py-4 text-xs uppercase tracking-[0.2em] font-light transition-all duration-300 disabled:opacity-50" style={{ backgroundColor: '#5C5B57', color: '#FAF8F5', borderRadius: '2px', fontFamily: "'Montserrat', sans-serif" }}>
            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Enviando...</span> : 'Confirmar Asistencia'}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

// 10. Music Section - The Melodic Offering
function MusicSection({ features, content }: { features: InvitationSchema['features']; content: InvitationSchema['content'] }) {
  const [formData, setFormData] = useState({ guestName: '', songTitle: '', artist: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    const { data } = await supabase
      .from('song_suggestions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setSuggestions(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('song_suggestions')
      .insert([{
        guest_name: formData.guestName,
        song_title: formData.songTitle,
        artist: formData.artist,
        invitation_id: content.couple?.hashtag || 'japandi-demo'
      }]);
    if (!error) {
      setSubmitted(true);
      setFormData({ guestName: '', songTitle: '', artist: '' });
      fetchSuggestions();
      setTimeout(() => setSubmitted(false), 2000);
    }
    setLoading(false);
  };

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: '#F5F2EB' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.8 }} 
        className="max-w-xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-4" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>La Banda Sonora</h2>
          <div className="w-px h-8 mx-auto" style={{ backgroundColor: '#D4CFC4' }} />
        </div>

        {/* Mensaje */}
        <p className="text-center text-sm font-light leading-relaxed mb-12" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>
          ¿Qué canción no puede faltar en nuestra boda? Ayúdanos a crear la playlist perfecta.
        </p>

        {/* Formulario */}
        <div className="p-8 mb-10" style={{ backgroundColor: '#FAF8F5', borderRadius: '2px', border: '1px solid #E8E4DB' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-light mb-2" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Tu Nombre</label>
              <input 
                type="text" 
                required 
                value={formData.guestName} 
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })} 
                className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light" 
                style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }} 
                placeholder="Tu nombre" 
                disabled={loading} 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-light mb-2" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Título de la Canción</label>
              <input 
                type="text" 
                required 
                value={formData.songTitle} 
                onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })} 
                className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light" 
                style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }} 
                placeholder="Ej: Perfect - Ed Sheeran" 
                disabled={loading} 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-light mb-2" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Artista</label>
              <input 
                type="text" 
                required 
                value={formData.artist} 
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })} 
                className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light" 
                style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }} 
                placeholder="Nombre del artista" 
                disabled={loading} 
              />
            </div>
            <motion.button 
              type="submit" 
              disabled={loading || submitted} 
              whileHover={{ boxShadow: '0 4px 20px rgba(184, 149, 106, 0.15)' }} 
              className="w-full py-4 text-xs uppercase tracking-[0.2em] font-light transition-all duration-300 disabled:opacity-50 mt-4" 
              style={{ backgroundColor: submitted ? '#B8956A' : '#5C5B57', color: '#FAF8F5', borderRadius: '2px', fontFamily: "'Montserrat', sans-serif" }}
            >
              {submitted ? '¡Gracias por tu sugerencia!' : loading ? 'Enviando...' : 'Sugerir Canción'}
            </motion.button>
          </form>
        </div>

        {/* Sugerencias recientes */}
        {suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-center text-xs uppercase tracking-[0.2em] font-light mb-6" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Sugerencias de otros invitados</p>
            <div className="space-y-3">
              {suggestions.map((s) => (
                <div 
                  key={s.id} 
                  className="flex items-center justify-between p-4" 
                  style={{ backgroundColor: '#FAF8F5', borderRadius: '2px', border: '1px solid #E8E4DB' }}
                >
                  <div>
                    <p className="text-sm font-light" style={{ color: '#5C5B57', fontFamily: "'Montserrat', sans-serif" }}>{s.song_title}</p>
                    <p className="text-xs" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>{s.artist}</p>
                  </div>
                  <div className="w-px h-8 mx-4" style={{ backgroundColor: '#E8E4DB' }} />
                  <p className="text-xs uppercase tracking-[0.1em]" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>{s.guest_name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

// Floating RSVP Button - Japandi Style
function FloatingRSVPButton({ features }: { features: InvitationSchema['features'] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasPassedRSVP, setHasPassedRSVP] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8; // 80% del hero
      
      // Mostrar después de scrollear el hero
      setIsVisible(scrollY > heroHeight);
      
      // Ocultar cuando llegamos cerca de la sección RSVP (opcional)
      const rsvpSection = document.getElementById('rsvp-section');
      if (rsvpSection) {
        const rsvpTop = rsvpSection.getBoundingClientRect().top;
        setHasPassedRSVP(rsvpTop < window.innerHeight * 0.5);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRSVP = () => {
    const rsvpSection = document.getElementById('rsvp-section');
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!features.show_rsvp || hasPassedRSVP) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            onClick={scrollToRSVP}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-3 px-5 py-3 transition-all duration-500"
            style={{
              backgroundColor: '#5C5B57',
              borderRadius: '2px',
              boxShadow: '0 4px 24px rgba(92, 91, 87, 0.25)',
            }}
          >
            <span 
              className="text-xs uppercase tracking-[0.2em] font-light"
              style={{ 
                color: '#FAF8F5', 
                fontFamily: "'Montserrat', sans-serif" 
              }}
            >
              Confirmar Asistencia
            </span>
            <div 
              className="w-px h-4 transition-all duration-300 group-hover:h-5"
              style={{ backgroundColor: 'rgba(250, 248, 245, 0.3)' }}
            />
            <Mail className="w-4 h-4" style={{ color: '#FAF8F5' }} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 11. Footer - The Calm End
function Footer({ content }: { content: InvitationSchema['content'] }) {
  const initials = content.couple ? `${content.couple.person1.name.charAt(0)}${content.couple.person2.name.charAt(0)}` : 'S&K';

  return (
    <footer className="pt-20 pb-10 px-6 md:px-12" style={{ backgroundColor: '#5C5B57' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-white/5">
          <div className="space-y-6">
            <span className="text-2xl font-serif font-bold tracking-tighter" style={{ color: '#F5F2EB', fontFamily: "'Playfair Display', serif" }}>VOWS<span style={{ color: '#B8956A' }}>.</span></span>
            <p className="text-xs uppercase tracking-[0.3em] font-light max-w-xs leading-relaxed" style={{ color: '#F5F2EB', fontFamily: "'Montserrat', sans-serif" }}>
              Redefiniendo la estética nupcial digital. <br/> Hecho con calma en Argentina.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-10 md:gap-16">
            <div className="space-y-4">
               <p className="text-[9px] uppercase tracking-[0.4em] font-bold" style={{ color: '#B8956A', fontFamily: "'Montserrat', sans-serif" }}>Contacto</p>
               <a href="mailto:hola@vows.ar" className="block text-sm hover:text-white transition-colors" style={{ color: '#F5F2EB' }}>hola@vows.ar</a>
               <a href="https://wa.me/5491100000000" className="block text-sm hover:text-white transition-colors" style={{ color: '#F5F2EB' }}>WhatsApp Concierge</a>
            </div>
            <div className="space-y-4">
               <p className="text-[9px] uppercase tracking-[0.4em] font-bold" style={{ color: '#B8956A', fontFamily: "'Montserrat', sans-serif" }}>Social</p>
               <a href="#" className="flex items-center gap-2 text-sm hover:text-white transition-colors group" style={{ color: '#F5F2EB' }}>
                 Instagram <ArrowUpRight className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
               </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(245, 242, 235, 0.2)' }}>
             © {new Date().getFullYear()} VOWS. Todos los derechos reservados.
           </p>
           <div className="flex gap-8">
              <a href="#" className="text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors" style={{ color: '#F5F2EB' }}>Privacidad</a>
              <a href="#" className="text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors" style={{ color: '#F5F2EB' }}>Términos</a>
           </div>
        </div>
      </div>
    </footer>
  );
}

// Main Layout Component
export function JapandiLayout({ invitation, preview, previewMobile }: JapandiLayoutProps) {
  const { metadata, content, logistics, features } = invitation;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FAF8F5' }}>
      <FeatureGate isVisible={features.show_hero} fallback={preview ? <EmptyStatePreview icon="👋" title="Hero Section" description="Sección principal con los nombres y fecha" /> : null}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <HeroSection content={content} logistics={logistics} previewMobile={previewMobile} />
        </motion.div>
      </FeatureGate>
      <FeatureGate isVisible={features.show_countdown} data={features.countdown} fallback={preview ? <EmptyStatePreview icon="⏰" title="Cuenta Regresiva" description="Configura la fecha de tu evento para activar la cuenta regresiva" /> : null}>
        <CountdownSection logistics={logistics} />
      </FeatureGate>
      <FeatureGate isVisible={!!content.quote || !!content.couple?.love_story} data={content.quote} fallback={preview ? <EmptyStatePreview icon="💭" title="Frase Especial" description="Agrega una frase o historia de amor" /> : null}>
        <QuoteSection content={content} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_agenda} data={logistics.agenda} fallback={preview ? <EmptyStatePreview icon="📋" title="Agenda del Día" description="Agrega los momentos clave de tu evento" /> : null}>
        <TimelineSection logistics={logistics} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_venue_map} data={logistics.venues} fallback={preview ? <EmptyStatePreview icon="📍" title="Ubicaciones" description="Indica dónde será la ceremonia y la celebración" /> : null}>
        <VenuesSection logistics={logistics} content={content} features={features} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_dress_code} data={logistics.dress_code} fallback={preview ? <EmptyStatePreview icon="👔" title="Código de Vestimenta" description="Especifica el dress code para tu evento" /> : null}>
        <DressCodeSection logistics={logistics} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_gift_registry} data={features.gift_registry} fallback={preview ? <EmptyStatePreview icon="🎁" title="Mesa de Regalos" description="Comparte los datos bancarios o listas de regalos" /> : null}>
        <GiftRegistrySection features={features} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_rsvp} data={features.rsvp} fallback={preview ? <EmptyStatePreview icon="✉️" title="Confirmar Asistencia" description="Activa el formulario para que tus invitados confirmen" /> : null}>
        <RSVPSection features={features} content={content} metadata={metadata} />
      </FeatureGate>
      <Footer content={content} />
      <FloatingRSVPButton features={features} />
    </main>
  );
}
