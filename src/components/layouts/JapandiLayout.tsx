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
  Loader2
} from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { createClient } from '@supabase/supabase-js';
import { submitRSVP } from '@/app/actions/rsvp';

interface JapandiLayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
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
function HeroSection({ content, logistics }: { content: InvitationSchema['content']; logistics: InvitationSchema['logistics'] }) {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const eventDate = new Date(logistics.event_date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('es-ES', { month: 'long' });
  const year = eventDate.getFullYear();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
      
      {/* Mobile: layout centrado original */}
      <div className="md:hidden absolute inset-0 flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative mx-auto mb-8"
            style={{ maxWidth: '320px' }}
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
            <h1 className="font-serif font-normal tracking-wide mb-2" style={{ color: '#5C5B57', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: "'Playfair Display', serif" }}>
              {content.couple?.person1.name || 'Sakura'}
            </h1>
            <span className="font-serif italic text-2xl" style={{ color: '#B8956A', fontFamily: "'Playfair Display', serif" }}>&</span>
            <h1 className="font-serif font-normal tracking-wide mt-2" style={{ color: '#5C5B57', fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: "'Playfair Display', serif" }}>
              {content.couple?.person2.name || 'Kenji'}
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="text-center mt-8">
            <p className="text-xs uppercase tracking-[0.3em] font-light" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>
              {day} {month} {year}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] font-light mt-2" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>
              {logistics.venues[0]?.city || 'Kioto'}, {logistics.venues[0]?.country || 'Japón'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Desktop: layout horizontal de dos columnas */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center px-8 lg:px-16">
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
                      {logistics.venues[0]?.city || 'Kioto'}, {logistics.venues[0]?.country || 'Japón'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-4 md:bottom-16 left-1/2 transform -translate-x-1/2 z-20"
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
  const targetDate = new Date(logistics.event_date).getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
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
    }, 1000);
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
  const quoteText = content.quote?.text || content.couple?.love_story ||
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
  const events = logistics.agenda.length > 0
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
function VenuesSection({ logistics, content }: { logistics: InvitationSchema['logistics']; content: InvitationSchema['content'] }) {
  const generateCalendarLink = (venue: any, eventDate: string) => {
    const eventTitle = encodeURIComponent(`${content.headline || content.couple?.person1.name + ' & ' + content.couple?.person2.name} - ${venue.title}`);
    const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
    const details = encodeURIComponent(`Te esperamos para celebrar con nosotros. ${content.couple?.hashtag || ''}`);
    const baseDate = new Date(eventDate);
    const [hours, minutes] = venue.time ? venue.time.split(':') : ['18', '00'];
    baseDate.setHours(parseInt(hours), parseInt(minutes));
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0];
    const endDate = new Date(baseDate);
    endDate.setHours(endDate.getHours() + 1);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDate(baseDate)}/${formatDate(endDate)}&details=${details}&location=${location}`;
  };

  const venues = logistics.venues.length > 0
    ? logistics.venues.map((venue, idx) => ({
        title: venue.type === 'ceremony' ? 'Ceremonia' : venue.type === 'reception' ? 'Celebración' : venue.name,
        name: venue.name,
        address: venue.address,
        time: logistics.agenda[idx]?.time || '18:00',
        mapUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d${venue.coordinates.lng}!3d${venue.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!5e0!3m2!1sen!2sar!4v1234567890`,
        mapsLink: venue.google_maps_url || `https://maps.google.com/?q=${venue.coordinates.lat},${venue.coordinates.lng}`,
        calendarLink: generateCalendarLink({ title: venue.type === 'ceremony' ? 'Ceremonia' : 'Celebración', name: venue.name, address: venue.address, time: logistics.agenda[idx]?.time || '18:00' }, logistics.event_date)
      }))
    : [
        { title: 'Ceremonia', name: 'Templo Zen Ryōan-ji', address: 'Jardín de Piedras 13, Kioto', time: '17:00', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d135.7186!3d35.0345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!5e0!3m2!1sen!2sar!4v1234567890', mapsLink: 'https://maps.google.com/?q=Ryōan-ji,Kioto', calendarLink: generateCalendarLink({ title: 'Ceremonia', name: 'Templo Zen Ryōan-ji', address: 'Jardín de Piedras 13, Kioto', time: '17:00' }, logistics.event_date) },
        { title: 'Celebración', name: 'Pabellón de Bambú', address: 'Camino del Arroyo 88, Arashiyama', time: '19:30', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d135.6738!3d35.0095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!5e0!3m2!1sen!2sar!4v1234567890', mapsLink: 'https://maps.google.com/?q=Arashiyama,Kioto', calendarLink: generateCalendarLink({ title: 'Celebración', name: 'Pabellón de Bambú', address: 'Camino del Arroyo 88, Arashiyama', time: '19:30' }, logistics.event_date) }
      ];

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: '#F0EDE6' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto">
        <h2 className="text-center font-serif text-2xl md:text-3xl tracking-wide mb-16" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>Las Ubicaciones</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {venues.map((venue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="overflow-hidden"
              style={{ backgroundColor: '#FAF8F5', borderRadius: '4px', boxShadow: '0 4px 20px rgba(92, 91, 87, 0.08)' }}
            >
              {/* Map placeholder with link */}
              <a 
                href={venue.mapsLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative h-48 md:h-56 overflow-hidden m-4 mb-0 flex items-center justify-center group transition-all"
                style={{ border: '1px solid #D4CFC4', borderRadius: '2px', backgroundColor: '#F5F2EB' }}
              >
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-3 transition-transform group-hover:scale-110" style={{ color: '#B8956A' }} />
                  <span className="text-xs uppercase tracking-[0.2em] font-light" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>Ver en Google Maps</span>
                </div>
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(184, 149, 106, 0.05)' }} />
              </a>
              <div className="p-6">
                <h3 className="text-xs uppercase tracking-[0.2em] font-light mb-2" style={{ color: '#B8956A', fontFamily: "'Montserrat', sans-serif" }}>{venue.title}</h3>
                <h4 className="font-serif text-xl mb-3" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>{venue.name}</h4>
                <p className="text-sm font-light mb-6 flex items-start" style={{ color: '#8A8986', fontFamily: "'Montserrat', sans-serif" }}>
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: '#B8956A' }} />{venue.address}
                </p>
                <div className="flex gap-3">
                  <a href={venue.mapsLink} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-3 text-center text-xs uppercase tracking-[0.15em] font-light transition-all duration-300 hover:bg-[#F5F2EB]" style={{ color: '#5C5B57', border: '1px solid #D4CFC4', borderRadius: '2px', fontFamily: "'Montserrat', sans-serif" }}>Cómo llegar</a>
                  <a href={venue.calendarLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-[0.15em] font-light transition-all duration-300 hover:bg-[#F5F2EB]" style={{ color: '#5C5B57', border: '1px solid #D4CFC4', borderRadius: '2px', fontFamily: "'Montserrat', sans-serif" }}><Calendar className="w-4 h-4" />Agendar</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// 6. Dress Code - The Attire Flow
function DressCodeSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const dressCodeText = logistics.dress_code?.code === 'formal' ? 'Formal Elegante' : logistics.dress_code?.code === 'black-tie' ? 'Black Tie' : logistics.dress_code?.code === 'cocktail' ? 'Cocktail' : logistics.dress_code?.description || 'Elegancia Natural';

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: '#F5F2EB' }}>
      <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }} 
        transition={{ duration: 1 }} 
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-8" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>Vestimenta</h2>
        
        <div className="w-px h-12 mx-auto mb-8" style={{ backgroundColor: '#B8956A' }} />
        
        <h3 className="font-serif text-2xl md:text-3xl tracking-wide" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>{dressCodeText}</h3>
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

        {/* Mobile: Carrusel horizontal original */}
        <div className="md:hidden relative px-4" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="overflow-hidden" style={{ borderRadius: '2px' }}>
            <motion.div 
              className="flex" 
              animate={{ x: -currentIndex * 100 + '%' }} 
              transition={{ duration: 0.8, ease: "easeInOut" }} 
              style={{ width: `${photos.length * 100}%` }}
            >
              {photos.map((photo, index) => (
                <div key={index} className="flex-shrink-0" style={{ width: `${100 / photos.length}%`, padding: '0 8px' }}>
                  <div style={{ aspectRatio: '4/3', maxHeight: '50vh', width: '100%' }}>
                    <img 
                      src={photo} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover" 
                      style={{ filter: 'sepia(10%) saturate(90%) contrast(0.95)', borderRadius: '2px' }} 
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
  const mercadoLibreUrl = features.gift_registry?.registries?.[0]?.url || 'https://listas.mercadolibre.com.ar';

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
          {features.gift_registry?.message || 'Vuestra presencia es el regalo más valioso. Si deseáis contribuir a nuestro nuevo hogar, os lo agradecemos con el corazón.'}
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

        {/* Link a Mercado Libre - estilo ghost */}
        <div className="pt-8" style={{ borderTop: '1px solid #E8E4DB' }}>
          <a
            href={mercadoLibreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs uppercase tracking-[0.2em] font-light px-8 py-3 transition-all duration-300 hover:bg-[#F5F2EB]"
            style={{ color: '#5C5B57', border: '1px solid #D4CFC4', borderRadius: '2px', fontFamily: "'Montserrat', sans-serif" }}
          >
            Ver lista de regalos
          </a>
        </div>
      </motion.div>
    </section>
  );
}

// 9. RSVP - The Gentle Affirmation
function RSVPSection({ features, content, metadata }: { features: InvitationSchema['features']; content: InvitationSchema['content']; metadata: InvitationSchema['metadata'] }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', attendance: true, guests: 1, dietary: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await submitRSVP({ invitationId: metadata.id, name: formData.name, email: formData.email, phone: formData.phone, attendance: formData.attendance, guestsCount: formData.guests, dietaryRestrictions: formData.dietary, message: formData.message });
      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', attendance: true, guests: 1, dietary: '', message: '' });
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
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light" style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }} placeholder="tu@email.com" disabled={loading} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>¿Asistirás?</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setFormData({ ...formData, attendance: true })} className="flex-1 py-3 text-xs uppercase tracking-[0.15em] font-light transition-all duration-300" style={{ backgroundColor: formData.attendance ? '#B8956A' : 'transparent', color: formData.attendance ? '#FAF8F5' : '#5C5B57', border: '1px solid #D4CFC4', borderRadius: '2px', fontFamily: "'Montserrat', sans-serif" }} disabled={loading}>Sí, asistiré</button>
              <button type="button" onClick={() => setFormData({ ...formData, attendance: false })} className="flex-1 py-3 text-xs uppercase tracking-[0.15em] font-light transition-all duration-300" style={{ backgroundColor: !formData.attendance ? '#A8A6A2' : 'transparent', color: !formData.attendance ? '#FAF8F5' : '#5C5B57', border: '1px solid #D4CFC4', borderRadius: '2px', fontFamily: "'Montserrat', sans-serif" }} disabled={loading}>No podré ir</button>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Número de Invitados</label>
            <select value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light cursor-pointer" style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif" }} disabled={loading}>
              {[1, 2, 3, 4].map((num) => <option key={num} value={num} style={{ backgroundColor: '#FAF8F5' }}>{num} {num === 1 ? 'persona' : 'personas'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>Mensaje (opcional)</label>
            <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light resize-none" style={{ color: '#5C5B57', borderBottom: '1px solid #D4CFC4', fontFamily: "'Montserrat', sans-serif", minHeight: '80px' }} placeholder="Unas palabras para los novios..." disabled={loading} />
          </div>
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
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-4" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>La Bandeja Sonora</h2>
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
    <footer className="py-16 px-4" style={{ backgroundColor: '#F5F2EB' }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-8">
          <span className="font-serif text-4xl md:text-5xl tracking-widest" style={{ color: '#5C5B57', fontFamily: "'Playfair Display', serif" }}>{initials}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="w-px h-12 mx-auto mb-8" style={{ backgroundColor: '#D4CFC4' }} />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} className="text-xs uppercase tracking-[0.3em] font-light" style={{ color: '#A8A6A2', fontFamily: "'Montserrat', sans-serif" }}>
          Con amor, {content.couple?.person1.name || 'Sakura'} & {content.couple?.person2.name || 'Kenji'}
        </motion.p>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} className="text-xs font-light mt-8" style={{ color: '#B8B5B0', fontFamily: "'Montserrat', sans-serif" }}>Invitame © 2026</motion.p>
      </div>
    </footer>
  );
}

// Main Layout Component
export function JapandiLayout({ invitation, preview }: JapandiLayoutProps) {
  const { metadata, content, logistics, features } = invitation;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FAF8F5' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <HeroSection content={content} logistics={logistics} />
      </motion.div>
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
        <VenuesSection logistics={logistics} content={content} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_dress_code} data={logistics.dress_code} fallback={preview ? <EmptyStatePreview icon="👔" title="Código de Vestimenta" description="Especifica el dress code para tu evento" /> : null}>
        <DressCodeSection logistics={logistics} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_gallery} data={content.gallery_images} fallback={preview ? <EmptyStatePreview icon="🖼️" title="Galería de Fotos" description="Sube hasta 15 fotos para compartir momentos especiales" /> : null}>
        <GallerySection content={content} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_music} data={features.music} fallback={preview ? <EmptyStatePreview icon="🎵" title="Sugerir Canciones" description="Permite a tus invitados sugerir canciones para la playlist" /> : null}>
        <MusicSection features={features} content={content} />
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
