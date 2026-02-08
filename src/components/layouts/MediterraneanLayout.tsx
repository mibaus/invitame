'use client';

import { useState, useEffect, useRef } from 'react';
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
  Music,
  Loader2,
  Sun,
  Users,
  Heart,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { createClient } from '@supabase/supabase-js';
import { submitRSVP } from '@/app/actions/rsvp';
import { parseDateLocal } from '@/lib/utils';

interface MediterraneanLayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
  previewMobile?: boolean;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Mediterranean Color Palette
const COLORS = {
  cobaltBlue: '#0047AB',      // Azul Cobalto (Majorelle)
  limeWhite: '#F5F5DC',       // Blanco Cal
  lemonYellow: '#FFF44F',     // Amarillo Limón
  terracotta: '#E2725B',      // Terracota cocida
  deepBlue: '#002E6D',        // Azul profundo para quote
  warmWhite: '#FFFAF0',       // Blanco cálido
  sand: '#F4E4C1',            // Arena mediterránea
};

// Typography
const FONTS = {
  serif: "'Cinzel', 'Cormorant Garamond', 'Prata', 'Playfair Display', serif",
  sans: "'Futura', 'Montserrat', 'Lato', sans-serif",
};

// Tile Pattern SVG Component
function TilePattern({ className = '', color = COLORS.cobaltBlue }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <pattern id="tilePattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="50" height="50" fill={COLORS.limeWhite} />
        <circle cx="25" cy="25" r="15" fill="none" stroke={color} strokeWidth="2" />
        <path d="M10 10 L40 40 M40 10 L10 40" stroke={color} strokeWidth="1.5" />
        <rect x="5" y="5" width="40" height="40" fill="none" stroke={color} strokeWidth="1" />
      </pattern>
      <rect width="100" height="100" fill="url(#tilePattern)" />
    </svg>
  );
}

// Lemon/Citrus Illustration Component
function LemonIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="65" rx="35" ry="28" fill={COLORS.lemonYellow} stroke={COLORS.cobaltBlue} strokeWidth="2" />
      <ellipse cx="60" cy="62" rx="30" ry="23" fill={COLORS.lemonYellow} />
      <path d="M60 37 L60 42" stroke={COLORS.terracotta} strokeWidth="3" strokeLinecap="round" />
      <path d="M58 39 L62 39" stroke={COLORS.terracotta} strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="33" r="4" fill={COLORS.terracotta} />
      <path d="M60 29 L60 25" stroke="#228B22" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="52" cy="28" rx="8" ry="4" fill="#228B22" transform="rotate(-30 52 28)" />
      <ellipse cx="68" cy="28" rx="8" ry="4" fill="#228B22" transform="rotate(30 68 28)" />
    </svg>
  );
}

// Tile Reveal Animation Variants
const tileRevealVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

// Empty state component for preview mode
function EmptyStatePreview({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="py-16 px-6 text-center" style={{ backgroundColor: COLORS.limeWhite }}>
      <div className="text-4xl mb-4" style={{ color: COLORS.cobaltBlue }}>{icon}</div>
      <h3 className="text-lg font-normal mb-2 tracking-wide" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>{title}</h3>
      <p className="text-sm" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>{description}</p>
    </div>
  );
}

// 1. Hero Section (The Coast) - With tile frame border
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: COLORS.limeWhite }}>
      {/* Mediterranean Frame - Simple Tile Border */}
      <div className="absolute inset-6 md:inset-12 pointer-events-none z-0">
        {/* Main border frame */}
        <div className="absolute inset-0 border-2 rounded-sm" style={{ borderColor: COLORS.cobaltBlue }}>
          {/* Corner accents - Mediterranean tile pattern */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 rounded-tl-sm" style={{ borderColor: COLORS.terracotta }} />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 rounded-tr-sm" style={{ borderColor: COLORS.terracotta }} />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 rounded-bl-sm" style={{ borderColor: COLORS.terracotta }} />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 rounded-br-sm" style={{ borderColor: COLORS.terracotta }} />
        </div>
      </div>

      {/* Sun Lens Flare Effect */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 rounded-full opacity-20 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ background: `radial-gradient(circle, ${COLORS.lemonYellow} 0%, transparent 70%)` }}
      />

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
            <div className="relative overflow-hidden border-4" style={{ borderColor: COLORS.cobaltBlue, borderRadius: '4px', boxShadow: '0 20px 60px rgba(0, 71, 171, 0.2)' }}>
              <img
                src={content.cover_image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop'}
                alt="Couple"
                className="w-full h-auto object-cover"
                style={{ filter: 'saturate(1.2) contrast(1.05) brightness(1.1)', aspectRatio: '3/4' }}
              />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 71, 171, 0.1) 100%)' }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="text-center max-w-[280px] mx-auto">
            {/* Headline */}
            <p className="text-xs uppercase tracking-[0.4em] font-light mb-4 px-2" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>
              {headline}
            </p>
            <h1 className="font-normal tracking-wide mb-1 px-2" style={{ color: COLORS.cobaltBlue, fontSize: 'clamp(1.75rem, 7vw, 2.5rem)', fontFamily: FONTS.serif, wordBreak: 'break-word' }}>
              {content.couple?.person1.name || 'Isabella'}
            </h1>
            <span className="italic text-2xl" style={{ color: COLORS.terracotta, fontFamily: FONTS.serif }}>&</span>
            <h1 className="font-normal tracking-wide mt-1 px-2" style={{ color: COLORS.cobaltBlue, fontSize: 'clamp(1.5rem, 6vw, 2.25rem)', fontFamily: FONTS.serif, wordBreak: 'break-word' }}>
              {content.couple?.person2.name || 'Marco'}
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="text-center mt-6 max-w-[280px] mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] font-light px-2" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.sans }}>
              {day} {month} {year}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] font-light mt-2 px-2" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans, wordBreak: 'break-word' }}>
              {logistics.venues[0]?.name || 'Ubicación del evento'}
            </p>
          </motion.div>

          {/* Explorar button */}
          <motion.button
            onClick={scrollToContent}
            className="mt-12 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-[0.3em] font-light" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.sans }}>Ver más</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown className="w-5 h-5 mt-2" style={{ color: COLORS.terracotta }} />
              </motion.div>
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
                <div className="relative overflow-hidden border-4" style={{ borderColor: COLORS.cobaltBlue, borderRadius: '4px', boxShadow: '0 30px 80px rgba(0, 71, 171, 0.25)' }}>
                  <img
                    src={content.cover_image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop'}
                    alt="Couple"
                    className="w-full h-auto object-cover"
                    style={{ filter: 'saturate(1.2) contrast(1.05) brightness(1.1)', aspectRatio: '3/4' }}
                  />
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0, 71, 171, 0.1) 100%)' }} />
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
                <div className="w-16 h-1 mb-8" style={{ backgroundColor: COLORS.terracotta }} />

                {/* Headline */}
                <p className="text-xs uppercase tracking-[0.4em] font-light mb-6" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>
                  {headline}
                </p>

                {/* Nombres */}
                <h1 className="font-normal tracking-wide" style={{ color: COLORS.cobaltBlue, fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontFamily: FONTS.serif, lineHeight: 1.2 }}>
                  {content.couple?.person1.name || 'Isabella'}
                </h1>
                <div className="flex items-center gap-4 my-4">
                  <div className="w-12 h-px" style={{ backgroundColor: COLORS.terracotta }} />
                  <span className="italic text-2xl lg:text-3xl" style={{ color: COLORS.terracotta, fontFamily: FONTS.serif }}>&</span>
                  <div className="w-12 h-px" style={{ backgroundColor: COLORS.terracotta }} />
                </div>
                <h1 className="font-normal tracking-wide" style={{ color: COLORS.cobaltBlue, fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontFamily: FONTS.serif, lineHeight: 1.2 }}>
                  {content.couple?.person2.name || 'Marco'}
                </h1>

                {/* Separador */}
                <div className="w-24 h-px my-8" style={{ backgroundColor: COLORS.cobaltBlue }} />

                {/* Fecha y ubicación */}
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.25em] font-light" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.sans }}>
                    {day} {month} {year}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px" style={{ backgroundColor: COLORS.terracotta }} />
                    <p className="text-xs uppercase tracking-[0.2em] font-light" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>
                      {logistics.venues[0]?.name || 'Ubicación del evento'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Botón Descubrir */}
      <motion.button
        onClick={scrollToContent}
        className={`${previewMobile ? 'hidden' : 'hidden md:block'} absolute bottom-8 md:bottom-16 left-1/2 transform -translate-x-1/2 z-20`}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.3em] font-light mb-2 md:mb-4" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.sans }}>Ver más</span>
          <div className="hidden md:block w-px h-8 bg-current" style={{ backgroundColor: COLORS.terracotta }} />
        </div>
      </motion.button>
    </section>
  );
}

// 2. Countdown Section (The Sun Dial) - Ceramic plates rotating on hover
function CountdownSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const eventDate = logistics.event_date || new Date().toISOString();
  const targetDate = parseDateLocal(eventDate).getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);

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

  const TimeUnit = ({ value, label, unitId }: { value: number; label: string; unitId: string }) => (
    <motion.div
      className="flex flex-col items-center mx-2 md:mx-4 lg:mx-6 cursor-pointer"
      onMouseEnter={() => setHoveredUnit(unitId)}
      onMouseLeave={() => setHoveredUnit(null)}
      whileHover={{ scale: 1.05 }}
    >
      {/* Ceramic plate circle */}
      <motion.div
        className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full flex items-center justify-center border-4 relative"
        style={{
          backgroundColor: COLORS.warmWhite,
          borderColor: COLORS.cobaltBlue,
          boxShadow: '0 4px 20px rgba(0, 71, 171, 0.15)',
        }}
        animate={hoveredUnit === unitId ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        {/* Decorative pattern on plate */}
        <div className="absolute inset-2 rounded-full border-2 border-dashed" style={{ borderColor: COLORS.terracotta }} />
        <div
          className="font-light text-2xl md:text-4xl lg:text-5xl tracking-wider relative z-10"
          style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}
        >
          {String(value).padStart(2, '0')}
        </div>
      </motion.div>
      <div className="text-xs uppercase tracking-[0.2em] font-light mt-3" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>{label}</div>
    </motion.div>
  );

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden" style={{ backgroundColor: COLORS.sand }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        {/* Sun icon */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-12 h-12 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: COLORS.lemonYellow, boxShadow: '0 4px 20px rgba(255, 244, 79, 0.4)' }}
        >
          <Sun className="w-6 h-6" style={{ color: COLORS.cobaltBlue }} />
        </motion.div>

        <p className="text-xs uppercase tracking-[0.3em] mb-8 font-light" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Faltan</p>

        <div className="flex flex-wrap justify-center items-start gap-y-4">
          <TimeUnit value={timeLeft.days} label="Días" unitId="days" />
          <span className="text-2xl md:text-3xl font-light mx-1 md:mx-2 pt-6 md:pt-8" style={{ color: COLORS.terracotta }}>:</span>
          <TimeUnit value={timeLeft.hours} label="Horas" unitId="hours" />
          <span className="text-2xl md:text-3xl font-light mx-1 md:mx-2 pt-6 md:pt-8" style={{ color: COLORS.terracotta }}>:</span>
          <TimeUnit value={timeLeft.minutes} label="Minutos" unitId="minutes" />
          <span className="text-2xl md:text-3xl font-light mx-1 md:mx-2 pt-6 md:pt-8 hidden md:block" style={{ color: COLORS.terracotta }}>:</span>
          <div className="w-full md:hidden" />
          <TimeUnit value={timeLeft.seconds} label="Segundos" unitId="seconds" />
        </div>
      </motion.div>
    </section>
  );
}

// 3. Quote Section (The Poem) - Deep blue background with lemon illustration
function QuoteSection({ content }: { content: InvitationSchema['content'] }) {
  const quoteText = content.quote?.text || content.main_message || content.couple?.love_story ||
    '"Cada momento a tu lado es un regalo. Hoy queremos compartir este día especial con las personas que más queremos."';
  const words = quoteText.split(' ');

  return (
    <section className="py-24 md:py-32 px-4 relative overflow-hidden" style={{ backgroundColor: COLORS.deepBlue }}>
      {/* Subtle tile pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <TilePattern className="w-full h-full" color={COLORS.limeWhite} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto text-center px-4 relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-16 h-1 mx-auto mb-12"
          style={{ backgroundColor: COLORS.lemonYellow }}
        />
        <p className="font-normal leading-relaxed text-xl md:text-2xl lg:text-3xl" style={{ color: COLORS.limeWhite, fontFamily: FONTS.serif }}>
          {words.map((word, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={tileRevealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ display: 'inline-block', marginRight: '0.3em' }}
            >
              {word}
            </motion.span>
          ))}
        </p>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '60px' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-1 mx-auto mt-12"
          style={{ backgroundColor: COLORS.terracotta }}
        />
        {content.quote?.author && (
          <p className="text-xs uppercase tracking-[0.3em] mt-8 font-light" style={{ color: COLORS.lemonYellow, fontFamily: FONTS.sans }}>{content.quote.author}</p>
        )}
      </motion.div>
    </section>
  );
}

// 4. Timeline Section (The Walk) - Tile icons with dotted path
function TimelineSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const events = logistics.agenda?.length > 0
    ? logistics.agenda.map((item) => ({ time: item.time, title: item.title, description: item.description || '' }))
    : [
        { time: '16:00', title: 'Bienvenida', description: 'Recepción de invitados y cóctel de bienvenida' },
        { time: '17:30', title: 'Ceremonia', description: 'Celebración de la ceremonia' },
        { time: '19:00', title: 'Cena', description: 'Banquete y brindis' },
        { time: '21:30', title: 'Fiesta', description: 'Baile y celebración' }
      ];

  // Professional icons for each event
  const TimelineIcon = ({ index }: { index: number }) => {
    const icons = [
      <Users key="users" className="w-5 h-5 md:w-6 md:h-6" style={{ color: COLORS.cobaltBlue }} />,
      <Heart key="heart" className="w-5 h-5 md:w-6 md:h-6" style={{ color: COLORS.cobaltBlue }} />,
      <UtensilsCrossed key="utensils" className="w-5 h-5 md:w-6 md:h-6" style={{ color: COLORS.cobaltBlue }} />,
      <Sparkles key="sparkles" className="w-5 h-5 md:w-6 md:h-6" style={{ color: COLORS.cobaltBlue }} />,
    ];
    return icons[index % icons.length];
  };

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.limeWhite }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-center text-2xl md:text-3xl tracking-wide mb-16" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>Agenda</h2>

        <div className="relative">
          {/* Dotted blue path - horizontal on desktop, vertical on mobile - positioned behind icons */}
          <div className="hidden md:block absolute top-8 left-[60px] right-[60px] h-0.5 border-t-2 border-dashed z-0" style={{ borderColor: COLORS.cobaltBlue }} />
          <div className="md:hidden absolute top-0 bottom-0 left-8 w-0.5 border-l-2 border-dashed z-0" style={{ borderColor: COLORS.cobaltBlue }} />

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-4">
            {events.map((event, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={tileRevealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex md:flex-col items-center md:text-center gap-6 md:gap-0 w-full md:w-auto pl-4 md:pl-0"
              >
                {/* Tile Icon */}
                <motion.div
                  className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center relative z-10 border-2"
                  style={{
                    backgroundColor: COLORS.warmWhite,
                    borderColor: COLORS.cobaltBlue,
                    borderRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0, 71, 171, 0.15)',
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <TimelineIcon index={index} />
                </motion.div>

                <div className="flex-1 md:mt-6">
                  <span className="text-xs uppercase tracking-[0.25em] font-light block mb-2" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>{event.time}</span>
                  <h3 className="text-lg md:text-xl mb-2" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>{event.title}</h3>
                  <p className="text-xs font-light max-w-[220px]" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// 5. Venues Section (The Piazza) - Large serif typography with terracotta shadow blocks
function VenuesSection({ logistics, content, features }: { logistics: InvitationSchema['logistics']; content: InvitationSchema['content']; features: InvitationSchema['features'] }) {
  const generateCalendarLink = (venue: any, eventDate: string) => {
    const eventTitle = encodeURIComponent(`${content.headline || content.couple?.person1.name + ' & ' + content.couple?.person2.name} - ${venue.title}`);
    const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
    const details = encodeURIComponent(`Te esperamos para celebrar con nosotros. ${content.couple?.hashtag || ''}`);
    let baseDate = new Date(eventDate);
    if (isNaN(baseDate.getTime())) {
      baseDate = new Date();
    }
    const [hours, minutes] = venue.time ? venue.time.split(':') : ['18', '00'];
    baseDate.setHours(parseInt(hours), parseInt(minutes));
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0];
    const endDate = new Date(baseDate);
    endDate.setHours(endDate.getHours() + 1);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDate(baseDate)}/${formatDate(endDate)}&details=${details}&location=${location}`;
  };

  const showCeremony = features.show_ceremony ?? true;
  const showReception = features.show_reception ?? true;

  const allVenues = logistics.venues?.length > 0
    ? logistics.venues.map((venue, idx) => {
        const hasCoordinates = venue.coordinates?.lat != null && venue.coordinates?.lng != null;
        const lat = venue.coordinates?.lat;
        const lng = venue.coordinates?.lng;

        let mapUrl: string;
        if (venue.google_maps_url) {
          const userUrl = venue.google_maps_url;
          if (userUrl.includes('/maps/place/')) {
            mapUrl = userUrl.replace('/maps/place/', '/maps/embed?pb=!1m18!1m12!1m3!1d0!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s') + '&output=embed';
          } else if (userUrl.includes('?q=')) {
            mapUrl = userUrl + (userUrl.includes('?') ? '&' : '?') + 'output=embed';
          } else {
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
        { title: 'Ceremonia', name: 'Villa Cimbrone', address: 'Via Santa Chiara 26, Ravello, Italia', type: 'ceremony', time: '17:00', mapUrl: 'https://maps.google.com/maps?q=40.6493,14.6113&z=15&output=embed', mapsLink: 'https://maps.google.com/?q=Villa+Cimbrone,Ravello', calendarLink: generateCalendarLink({ title: 'Ceremonia', name: 'Villa Cimbrone', address: 'Via Santa Chiara 26, Ravello', time: '17:00' }, logistics.event_date) },
        { title: 'Celebración', name: 'Terrazza sul Mare', address: 'Via dei Bagni 42, Positano, Italia', type: 'reception', time: '19:30', mapUrl: 'https://maps.google.com/maps?q=40.6281,14.4850&z=15&output=embed', mapsLink: 'https://maps.google.com/?q=Positano,Italia', calendarLink: generateCalendarLink({ title: 'Celebración', name: 'Terrazza sul Mare', address: 'Via dei Bagni 42, Positano', time: '19:30' }, logistics.event_date) }
      ];

  const filteredVenues = allVenues.filter(venue => {
    if (venue.type === 'ceremony' && !showCeremony) return false;
    if (venue.type === 'reception' && !showReception) return false;
    return true;
  });

  const gridClass = filteredVenues.length === 1
    ? 'grid md:grid-cols-1 gap-8 max-w-xl mx-auto'
    : 'grid md:grid-cols-2 gap-8';

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.sand }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-center text-2xl md:text-3xl tracking-wide mb-16" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>
          {filteredVenues.length === 1 ? 'Ubicación' : 'Ubicaciones'}
        </h2>

        <div className={gridClass}>
          {filteredVenues.map((venue, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={tileRevealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              {/* Terracotta shadow block */}
              <div
                className="absolute -bottom-3 -right-3 w-full h-full rounded-lg"
                style={{ backgroundColor: COLORS.terracotta, opacity: 0.3 }}
              />

              <div
                className="relative p-6 md:p-8 rounded-lg overflow-hidden border-2"
                style={{
                  backgroundColor: COLORS.warmWhite,
                  borderColor: COLORS.cobaltBlue,
                  boxShadow: '0 4px 20px rgba(0, 71, 171, 0.1)',
                }}
              >
                {/* Large serif venue name */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl mb-2" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif, fontWeight: 500 }}>{venue.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] font-light mb-6" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>{venue.title}</p>

                {/* Map placeholder with Mediterranean style */}
                <a
                  href={venue.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-48 md:h-56 overflow-hidden mb-6 block group cursor-pointer border-2 rounded"
                  style={{ borderColor: COLORS.cobaltBlue, backgroundColor: COLORS.sand }}
                >
                  {/* Tile pattern background */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect fill='${encodeURIComponent(COLORS.sand)}' width='40' height='40'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='${encodeURIComponent(COLORS.cobaltBlue)}' stroke-width='1'/%3E%3C/svg%3E")`,
                  }} />

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 border-2" style={{ backgroundColor: COLORS.warmWhite, borderColor: COLORS.cobaltBlue }}>
                      <MapPin className="w-7 h-7" style={{ color: COLORS.cobaltBlue }} />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] font-light" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.sans }}>Ver en Mapa</span>
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'rgba(0, 71, 171, 0.1)' }} />
                </a>

                <p className="text-sm font-light mb-6 flex items-start" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.sans }}>
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: COLORS.terracotta }} />{venue.address}
                </p>

                <div className="flex gap-3">
                  <a
                    href={venue.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 text-center text-xs uppercase tracking-[0.15em] font-light transition-all duration-300 hover:opacity-80 border-2 rounded"
                    style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans, backgroundColor: 'transparent' }}
                  >Cómo llegar</a>
                  <a
                    href={venue.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-[0.15em] font-light transition-all duration-300 hover:opacity-80 border-2 rounded"
                    style={{ color: COLORS.warmWhite, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans, backgroundColor: COLORS.cobaltBlue }}
                  >
                    <Calendar className="w-4 h-4" />Agendar
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// 6. Dress Code Section (The Summer Attire) - High contrast photos, summer collection style
function DressCodeSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const dressCodeText = logistics.dress_code?.code === 'formal' ? 'Formal' :
    logistics.dress_code?.code === 'black-tie' ? 'Black Tie' :
    logistics.dress_code?.code === 'cocktail' ? 'Cocktail' :
    logistics.dress_code?.code === 'semi-formal' ? 'Semi Formal' :
    logistics.dress_code?.code === 'casual-elegante' ? 'Casual Elegante' :
    logistics.dress_code?.code === 'casual' ? 'Casual' :
    logistics.dress_code?.code === 'smart-casual' ? 'Smart Casual' :
    logistics.dress_code?.code === 'themed' ? 'Temática Especial' :
    logistics.dress_code?.description || 'Formal';

  const dressCodeDetail = logistics.dress_code?.description;

  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4" style={{ backgroundColor: COLORS.sand }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto"
      >
        {/* Summer Collection Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] font-light mb-4" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Dress Code</p>
          <h2 className="text-3xl md:text-4xl tracking-wide mb-8" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>Código de Vestimenta</h2>
          <div className="w-px h-12 mx-auto mb-8" style={{ backgroundColor: COLORS.cobaltBlue }} />
        </div>

        <div className="max-w-md mx-auto">
          {/* Single unified dress code card */}
          <motion.div
            custom={0}
            variants={tileRevealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-8 rounded-lg border-2 text-center"
            style={{ backgroundColor: COLORS.warmWhite, borderColor: COLORS.cobaltBlue }}
          >
            <p className="text-xs uppercase tracking-[0.2em] font-light mb-4" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Dress Code</p>
            <h3 className="text-xl md:text-2xl" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>{dressCodeText}</h3>
          </motion.div>
        </div>

        {dressCodeDetail && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center max-w-lg mx-auto p-6 rounded-lg border-2"
            style={{ backgroundColor: COLORS.warmWhite, borderColor: COLORS.terracotta }}
          >
            <p className="text-sm font-light leading-relaxed" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.sans }}>
              {dressCodeDetail}
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

// 7. Gallery Section (The Mosaic) - Slider on mobile, grid on desktop
function GallerySection({ content }: { content: InvitationSchema['content'] }) {
  const photos = content.gallery_images?.length ? content.gallery_images : [
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-16488321499b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Create a mosaic grid pattern: photo, tile, photo, tile...
  const mosaicItems = photos.slice(0, 8).map((photo, index) => ({
    type: index % 2 === 0 ? 'photo' : 'tile',
    photo: photo,
    tilePattern: index % 4,
  }));

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.limeWhite }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl tracking-wide mb-4" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>Galería</h2>
          <p className="text-xs uppercase tracking-[0.2em] font-light" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Nuestros momentos</p>
        </div>

        {/* Mobile: Horizontal Slider */}
        <div className="md:hidden">
          <div className="relative overflow-hidden" ref={sliderRef}>
            <motion.div
              className="flex"
              animate={{ x: -currentIndex * (sliderRef.current?.clientWidth || 280) }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: -(photos.length - 1) * (sliderRef.current?.clientWidth || 280), right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
            >
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full px-2"
                  style={{ width: sliderRef.current?.clientWidth || '100%' }}
                >
                  <div
                    className="relative overflow-hidden border-2 rounded aspect-[3/4]"
                    style={{ borderColor: COLORS.cobaltBlue }}
                  >
                    <img
                      src={photo}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(1.1) contrast(1.05)' }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Mobile Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="w-2 h-2 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: index === currentIndex ? COLORS.cobaltBlue : 'rgba(0, 71, 171, 0.3)',
                }}
              />
            ))}
          </div>

          <p className="text-center text-xs font-light mt-4" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>
            Desliza para ver más
          </p>
        </div>

        {/* Desktop: Mosaic Grid */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {mosaicItems.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={tileRevealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`relative overflow-hidden border-2 rounded ${index === 0 || index === 5 ? 'col-span-2 row-span-2' : ''}`}
              style={{ borderColor: COLORS.cobaltBlue, aspectRatio: index === 0 || index === 5 ? '1' : '1' }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.type === 'photo' ? (
                <img
                  src={item.photo}
                  alt={`Mosaic ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  style={{ filter: 'saturate(1.1) contrast(1.05)' }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: item.tilePattern === 0 ? COLORS.cobaltBlue : item.tilePattern === 1 ? COLORS.terracotta : item.tilePattern === 2 ? COLORS.lemonYellow : COLORS.sand,
                  }}
                >
                  {/* Geometric pattern */}
                  <svg className="w-12 h-12 opacity-50" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="15" fill="none" stroke={COLORS.limeWhite} strokeWidth="2" />
                    <path d="M10 10 L40 40 M40 10 L10 40" stroke={COLORS.limeWhite} strokeWidth="1.5" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// 8. Gift Registry Section (The Contribution) - Ceramic shop thank you card style
function GiftRegistrySection({ features }: { features: InvitationSchema['features'] }) {
  const [copied, setCopied] = useState(false);
  const alias = features.gift_registry?.bank_details?.alias || 'BODA.MEDITERRANEO';

  const handleCopy = () => {
    navigator.clipboard.writeText(alias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.sand }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto"
      >
        {/* Ceramic shop card style */}
        <div
          className="relative p-8 md:p-12 border-2 rounded-lg"
          style={{
            backgroundColor: COLORS.warmWhite,
            borderColor: COLORS.cobaltBlue,
            boxShadow: '0 8px 30px rgba(0, 71, 171, 0.15)',
          }}
        >
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: COLORS.terracotta }} />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: COLORS.terracotta }} />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: COLORS.terracotta }} />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: COLORS.terracotta }} />

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] font-light mb-6" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Mesa de Regalos</p>
            <h2 className="text-2xl md:text-3xl tracking-wide mb-6" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>Regalos</h2>

            <div className="w-16 h-px mx-auto mb-6" style={{ backgroundColor: COLORS.cobaltBlue }} />

            <p className="text-sm font-light leading-relaxed mb-8" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.sans }}>
              {features.gift_registry?.message || 'Tu presencia es el mejor regalo. Si deseas hacernos un obsequio, aquí tienes los datos.'}
            </p>

            {/* Alias */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Alias para transferencia</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-lg tracking-wide" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.sans }}>{alias}</span>
                <button
                  onClick={handleCopy}
                  className="text-xs uppercase tracking-[0.15em] font-light px-4 py-2 transition-all duration-300 hover:opacity-80 border-2 rounded"
                  style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans }}
                >
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Small ceramic illustration */}
            <div className="w-12 h-12 mx-auto mt-6 opacity-50">
              <svg viewBox="0 0 50 50" className="w-full h-full">
                <circle cx="25" cy="25" r="20" fill="none" stroke={COLORS.cobaltBlue} strokeWidth="2" />
                <circle cx="25" cy="25" r="12" fill="none" stroke={COLORS.terracotta} strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// 9. RSVP Section (The Confirmation) - Mosaic border form with lemon yellow button
function RSVPSection({ features, content, metadata }: { features: InvitationSchema['features']; content: InvitationSchema['content']; metadata: InvitationSchema['metadata'] }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', attendance: true, guests: 1, dietary: '', musicSuggestion: '', message: '' });
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
        dietaryRestrictions: formData.dietary,
        musicSuggestion: formData.musicSuggestion,
        message: formData.message,
        customAnswers: customAnswers
      });
      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', attendance: true, guests: 1, dietary: '', musicSuggestion: '', message: '' });
        setCustomAnswers({});
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
      <section className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.limeWhite }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
          <div
            className="p-8 border-2 rounded-lg text-center"
            style={{ backgroundColor: COLORS.warmWhite, borderColor: COLORS.cobaltBlue }}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
              <Check className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.cobaltBlue }} />
            </motion.div>
            <h3 className="text-2xl mb-3" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>Confirmación Recibida</h3>
            <p className="text-sm font-light" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.sans }}>Gracias {formData.name}, hemos registrado tu respuesta. Te esperamos con alegría.</p>
            <button onClick={() => setSuccess(false)} className="mt-6 text-xs uppercase tracking-[0.2em] font-light hover:opacity-80" style={{ color: COLORS.terracotta }}>Enviar otra confirmación</button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp-section" className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.limeWhite }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto"
      >
        {/* Mosaic border container */}
        <div
          className="relative p-1 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${COLORS.cobaltBlue} 0%, ${COLORS.terracotta} 50%, ${COLORS.lemonYellow} 100%)`,
            padding: '4px',
          }}
        >
          <div
            className="p-6 md:p-8 rounded-lg"
            style={{ backgroundColor: COLORS.warmWhite }}
          >
            <h2 className="text-center text-2xl md:text-3xl tracking-wide mb-4" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>Confirmar Asistencia</h2>
            <p className="text-center text-xs uppercase tracking-[0.2em] font-light mb-8" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Fecha límite: {features.rsvp?.deadline ? new Date(features.rsvp.deadline).toLocaleDateString('es-ES') : '30 días antes del evento'}</p>

            {error && <div className="p-4 mb-6 text-center text-sm rounded" style={{ backgroundColor: '#F8E4E4', color: '#8B5A5A' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-light mb-2" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light border-b-2"
                  style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans }}
                  placeholder="Tu nombre"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-light mb-2" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light border-b-2"
                  style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans }}
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-light mb-3" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>¿Asistirás?</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: true })}
                    className="flex-1 py-3 text-xs uppercase tracking-[0.15em] font-light transition-all duration-300 rounded border-2"
                    style={{
                      backgroundColor: formData.attendance ? COLORS.lemonYellow : 'transparent',
                      color: COLORS.cobaltBlue,
                      borderColor: COLORS.cobaltBlue,
                      fontFamily: FONTS.sans,
                    }}
                    disabled={loading}
                  >Sí, asistiré</button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: false })}
                    className="flex-1 py-3 text-xs uppercase tracking-[0.15em] font-light transition-all duration-300 rounded border-2"
                    style={{
                      backgroundColor: !formData.attendance ? COLORS.terracotta : 'transparent',
                      color: !formData.attendance ? COLORS.warmWhite : COLORS.cobaltBlue,
                      borderColor: COLORS.cobaltBlue,
                      fontFamily: FONTS.sans,
                    }}
                    disabled={loading}
                  >No podré ir</button>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-light mb-2" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Número de Invitados</label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light cursor-pointer border-b-2"
                  style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans }}
                  disabled={loading}
                >
                  {[1, 2, 3, 4].map((num) => <option key={num} value={num} style={{ backgroundColor: COLORS.warmWhite }}>{num} {num === 1 ? 'persona' : 'personas'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-light mb-2" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Restricciones Alimentarias</label>
                <textarea
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light resize-none border-b-2"
                  style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans, minHeight: '80px' }}
                  placeholder="¿Tienes alguna restricción alimentaria?"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-light mb-2" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Sugerencia Musical</label>
                <input
                  type="text"
                  value={formData.musicSuggestion}
                  onChange={(e) => setFormData({ ...formData, musicSuggestion: e.target.value })}
                  className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light border-b-2"
                  style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans }}
                  placeholder="¿Qué canción no puede faltar?"
                  disabled={loading}
                />
              </div>

              {/* Preguntas Personalizadas */}
              {customQuestions.length > 0 && (
                <div className="space-y-6 pt-4 border-t-2" style={{ borderColor: COLORS.cobaltBlue }}>
                  <p className="text-xs uppercase tracking-[0.2em] font-light" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>Preguntas Adicionales</p>
                  {customQuestions.map((question) => (
                    <div key={question.id}>
                      <label className="block text-xs uppercase tracking-[0.15em] font-light mb-2" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>
                        {question.question}
                        {question.required && <span style={{ color: COLORS.cobaltBlue }}> *</span>}
                      </label>
                      {question.type === 'text' ? (
                        <input
                          type="text"
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light border-b-2"
                          style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans }}
                          placeholder="Tu respuesta..."
                          disabled={loading}
                        />
                      ) : question.type === 'select' ? (
                        <select
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light cursor-pointer border-b-2"
                          style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans }}
                          disabled={loading}
                        >
                          <option value="" style={{ backgroundColor: COLORS.warmWhite }}>Selecciona una opción</option>
                          {question.options?.map((opt) => (
                            <option key={opt} value={opt} style={{ backgroundColor: COLORS.warmWhite }}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <textarea
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm font-light resize-none border-b-2"
                          style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans, minHeight: '80px' }}
                          placeholder="Tu respuesta..."
                          disabled={loading}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, backgroundColor: COLORS.cobaltBlue, color: COLORS.warmWhite }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 text-xs uppercase tracking-[0.2em] font-light transition-all duration-300 disabled:opacity-50 rounded border-2"
                style={{
                  backgroundColor: COLORS.lemonYellow,
                  color: COLORS.cobaltBlue,
                  borderColor: COLORS.cobaltBlue,
                  fontFamily: FONTS.sans,
                }}
              >
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Enviando...</span> : 'Confirmar Asistencia'}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// 10. Music Section - Suggestions form
function MusicSection({ content }: { content: InvitationSchema['content'] }) {
  const [formData, setFormData] = useState({ guestName: '', songTitle: '', artist: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('song_suggestions')
      .insert([{
        guest_name: formData.guestName,
        song_title: formData.songTitle,
        artist: formData.artist,
        invitation_id: content.couple?.hashtag || 'mediterranean-demo'
      }]);
    if (!error) {
      setSubmitted(true);
      setFormData({ guestName: '', songTitle: '', artist: '' });
      setTimeout(() => setSubmitted(false), 2000);
    }
    setLoading(false);
  };

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.sand }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto"
      >
        <div className="text-center mb-8">
          <Music className="w-10 h-10 mx-auto mb-4" style={{ color: COLORS.cobaltBlue }} />
          <h2 className="text-2xl md:text-3xl tracking-wide mb-2" style={{ color: COLORS.cobaltBlue, fontFamily: FONTS.serif }}>Música</h2>
          <p className="text-xs uppercase tracking-[0.2em] font-light" style={{ color: COLORS.terracotta, fontFamily: FONTS.sans }}>¿Qué canción no puede faltar?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            value={formData.guestName}
            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            className="w-full py-3 px-4 bg-transparent border-2 rounded focus:outline-none text-sm font-light"
            style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans, backgroundColor: COLORS.warmWhite }}
            placeholder="Tu nombre"
            disabled={loading}
          />
          <input
            type="text"
            required
            value={formData.songTitle}
            onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
            className="w-full py-3 px-4 bg-transparent border-2 rounded focus:outline-none text-sm font-light"
            style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans, backgroundColor: COLORS.warmWhite }}
            placeholder="Título de la canción"
            disabled={loading}
          />
          <input
            type="text"
            required
            value={formData.artist}
            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            className="w-full py-3 px-4 bg-transparent border-2 rounded focus:outline-none text-sm font-light"
            style={{ color: COLORS.cobaltBlue, borderColor: COLORS.cobaltBlue, fontFamily: FONTS.sans, backgroundColor: COLORS.warmWhite }}
            placeholder="Artista"
            disabled={loading}
          />
          <motion.button
            type="submit"
            disabled={loading || submitted}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 text-xs uppercase tracking-[0.2em] font-light transition-all duration-300 disabled:opacity-50 rounded border-2"
            style={{
              backgroundColor: submitted ? COLORS.cobaltBlue : COLORS.lemonYellow,
              color: submitted ? COLORS.warmWhite : COLORS.cobaltBlue,
              borderColor: COLORS.cobaltBlue,
              fontFamily: FONTS.sans,
            }}
          >
            {submitted ? '¡Gracias!' : loading ? 'Enviando...' : 'Sugerir Canción'}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

// 11. Footer - Clean minimal design
function Footer({ content }: { content: InvitationSchema['content'] }) {
  const initials = content.couple ? `${content.couple.person1.name.charAt(0)}${content.couple.person2.name.charAt(0)}` : 'I&M';

  return (
    <footer
      className="py-16 px-4"
      style={{ backgroundColor: COLORS.cobaltBlue }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="text-4xl md:text-5xl tracking-widest" style={{ color: COLORS.warmWhite, fontFamily: FONTS.serif }}>{initials}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-12 h-px mx-auto mb-6"
          style={{ backgroundColor: COLORS.lemonYellow }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs uppercase tracking-[0.3em] font-light"
          style={{ color: COLORS.limeWhite, fontFamily: FONTS.sans }}
        >
          {content.couple?.person1.name || 'Isabella'} & {content.couple?.person2.name || 'Marco'}
        </motion.p>
      </div>
    </footer>
  );
}

// Floating RSVP Button - Mediterranean Style
function FloatingRSVPButton({ features }: { features: InvitationSchema['features'] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasPassedRSVP, setHasPassedRSVP] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;
      setIsVisible(scrollY > heroHeight);

      const rsvpSection = document.getElementById('rsvp-section');
      if (rsvpSection) {
        const rsvpTop = rsvpSection.getBoundingClientRect().top;
        setHasPassedRSVP(rsvpTop < window.innerHeight * 0.5);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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
            className="group flex items-center gap-3 px-5 py-3 transition-all duration-500 rounded-lg border-2"
            style={{
              backgroundColor: COLORS.lemonYellow,
              borderColor: COLORS.cobaltBlue,
              boxShadow: '0 4px 24px rgba(0, 71, 171, 0.25)',
            }}
          >
            <span
              className="text-xs uppercase tracking-[0.2em] font-light"
              style={{
                color: COLORS.cobaltBlue,
                fontFamily: FONTS.sans,
              }}
            >
              Confirmar
            </span>
            <Mail className="w-4 h-4" style={{ color: COLORS.cobaltBlue }} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main Layout Component
export function MediterraneanLayout({ invitation, preview, previewMobile }: MediterraneanLayoutProps) {
  const { metadata, content, logistics, features } = invitation;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: COLORS.limeWhite }}>
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
      <FeatureGate isVisible={features.show_gallery} data={content.gallery_images} fallback={preview ? <EmptyStatePreview icon="🖼️" title="Galería" description="Agrega fotos de la pareja" /> : null}>
        <GallerySection content={content} />
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
