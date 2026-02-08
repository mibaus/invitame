'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Gift,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Mail,
  Loader2,
  Leaf,
  Flower2,
  Sprout,
  Feather,
  TreeDeciduous,
  Binoculars,
  Shovel,
  Send
} from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { createClient } from '@supabase/supabase-js';
import { submitRSVP } from '@/app/actions/rsvp';
import { parseDateLocal } from '@/lib/utils';

interface BotanicalLayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
  previewMobile?: boolean;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const COLORS = {
  paper: '#EDE8D0',           // Papel más amarillento/envejecido (tono herbario)
  paperDark: '#E5DEC0',       // Papel oscuro más cálido
  paperLight: '#F5F0DC',        // Papel claro crema
  moss: '#4A5D23',              // Verde musgo más intenso (Hunter Green)
  mossLight: '#6B7B3E',         // Verde musgo más claro
  mossDark: '#2F3D16',          // Verde musgo muy oscuro
  sepia: '#704214',             // Marrón sepia más profundo
  sepiaLight: '#8B5A2B',        // Sepia claro
  toasted: '#A67B5B',           // Tostado cálido
  slate: '#3D3D3D',             // Gris pizarra más oscuro
  rose: '#C9A9A6',              // Rosa palo desaturado
  sky: '#8FA5A3',               // Verde azulado desaturado
  ink: '#1A1A1A',               // Tinta negra más profunda
  border: '#8B7355',            // Borde más oscuro/visible
  copper: '#B87333',            // Cobre para acentos
};

function EmptyStatePreview({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="py-16 px-6 text-center" style={{ backgroundColor: COLORS.paper }}>
      <div className="text-4xl mb-4" style={{ color: COLORS.moss }}>{icon}</div>
      <h3 className="text-lg mb-2 tracking-wide" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', Georgia, serif" }}>{title}</h3>
      <p className="text-sm" style={{ color: COLORS.sepia }}>{description}</p>
    </div>
  );
}

function BotanicalDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px flex-1 max-w-[80px]" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: COLORS.moss }}>
        <path d="M12 2C12 2 8 6 8 10C8 14 12 18 12 18C12 18 16 14 16 10C16 6 12 2 12 2Z" stroke="currentColor" strokeWidth="1" fill="none"/>
        <path d="M12 18V22" stroke="currentColor" strokeWidth="1"/>
        <path d="M9 22H15" stroke="currentColor" strokeWidth="1"/>
      </svg>
      <div className="h-px flex-1 max-w-[80px]" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
    </div>
  );
}

// Herbarium Pressed Flower Element
function PressedFlower({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} width="60" height="60" viewBox="0 0 60 60" fill="none" style={style}>
      <circle cx="30" cy="30" r="8" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.6"/>
      <ellipse cx="30" cy="15" rx="4" ry="10" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.5"/>
      <ellipse cx="30" cy="45" rx="4" ry="10" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.5"/>
      <ellipse cx="15" cy="30" rx="10" ry="4" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.5"/>
      <ellipse cx="45" cy="30" rx="10" ry="4" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.5"/>
    </svg>
  );
}

// Detailed Fern Leaf
function FernLeaf({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} width="100" height="120" viewBox="0 0 100 120" fill="none" style={style}>
      <path d="M50 110 V 20" stroke={COLORS.moss} strokeWidth="1" opacity="0.4"/>
      <path d="M50 20 Q 30 15, 20 25" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M50 20 Q 70 15, 80 25" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M50 35 Q 25 30, 15 40" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M50 35 Q 75 30, 85 40" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M50 50 Q 20 45, 10 55" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M50 50 Q 80 45, 90 55" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M50 65 Q 22 60, 12 70" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M50 65 Q 78 60, 88 70" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M50 80 Q 28 75, 18 85" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M50 80 Q 72 75, 82 85" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
    </svg>
  );
}

// Oak Leaf Illustration
function OakLeaf({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} width="80" height="100" viewBox="0 0 80 100" fill="none" style={style}>
      <path 
        d="M40 90 Q 40 70, 40 60 Q 25 55, 20 45 Q 25 35, 40 30 Q 40 25, 40 20 Q 40 25, 40 30 Q 55 35, 60 45 Q 55 55, 40 60" 
        stroke={COLORS.moss} 
        strokeWidth="1" 
        fill="none" 
        opacity="0.4"
      />
      <path d="M40 30 Q 30 35, 25 40" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M40 30 Q 50 35, 55 40" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M40 45 Q 28 48, 22 52" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M40 45 Q 52 48, 58 52" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M40 60 Q 30 62, 25 65" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M40 60 Q 50 62, 55 65" stroke={COLORS.moss} strokeWidth="0.5" fill="none" opacity="0.3"/>
    </svg>
  );
}

// Field Notebook Lines Background
function FieldNotebookLines({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ opacity: 0.15 }}>
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="w-full" 
          style={{ 
            height: '28px', 
            borderBottom: `1px solid ${COLORS.moss}`,
            marginTop: i === 0 ? '20px' : '0'
          }} 
        />
      ))}
    </div>
  );
}

// Museum Collection Stamp
function MuseumStamp({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: '80px', height: '80px' }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="35" stroke={COLORS.sepia} strokeWidth="2" strokeDasharray="4 2" opacity="0.4"/>
        <circle cx="40" cy="40" r="28" stroke={COLORS.sepia} strokeWidth="1" opacity="0.3"/>
        <text 
          x="40" 
          y="35" 
          textAnchor="middle" 
          fill={COLORS.sepia} 
          fontSize="8" 
          fontFamily="'IM Fell English', serif" 
          opacity="0.6"
        >
          HERBARIUM
        </text>
        <text 
          x="40" 
          y="48" 
          textAnchor="middle" 
          fill={COLORS.sepia} 
          fontSize="6" 
          fontFamily="'Crimson Text', serif" 
          opacity="0.5"
        >
          COLLECTION
        </text>
      </svg>
    </div>
  );
}

// Ornate Corner Decoration
function OrnateCorner({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none" style={style}>
      <path d="M5 20 Q 5 5, 20 5" stroke={COLORS.moss} strokeWidth="1.5" fill="none" opacity="0.4"/>
      <path d="M10 20 Q 10 10, 20 10" stroke={COLORS.moss} strokeWidth="1" fill="none" opacity="0.3"/>
      <circle cx="20" cy="5" r="2" fill={COLORS.copper} opacity="0.4"/>
      <circle cx="5" cy="20" r="2" fill={COLORS.copper} opacity="0.4"/>
    </svg>
  );
}

// Watercolor Paper Texture Overlay
function WatercolorTexture({ className }: { className?: string }) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='watercolor'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.9 0 0 0 0 0.88 0 0 0 0 0.75 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23watercolor)'/%3E%3C/svg%3E")`,
        opacity: 0.08,
        mixBlendMode: 'multiply'
      }}
    />
  );
}

// Specimen Label Tag
function SpecimenLabel({ number, date, className }: { number: string; date: string; className?: string }) {
  return (
    <div 
      className={`inline-flex flex-col items-start px-3 py-2 ${className}`}
      style={{ 
        backgroundColor: COLORS.paperLight,
        border: `1px solid ${COLORS.sepia}`,
        borderRadius: '2px',
        boxShadow: '1px 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <span 
        className="text-[9px] uppercase tracking-[0.2em]"
        style={{ color: COLORS.sepia, fontFamily: "'IM Fell English', serif" }}
      >
        Spec. {number}
      </span>
      <span 
        className="text-[8px] mt-1"
        style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}
      >
        Collected {date}
      </span>
    </div>
  );
}

// Vintage Label/Stamp Element
function VintageLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-block px-4 py-2 border-2 ${className}`} style={{ borderColor: COLORS.moss, borderStyle: 'double', backgroundColor: COLORS.paperLight }}>
      <div style={{ fontFamily: "'IM Fell English', 'Crimson Text', serif", letterSpacing: '0.15em', color: COLORS.moss, fontSize: '0.75rem', textTransform: 'uppercase' }}>
        {children}
      </div>
    </div>
  );
}

// Botanical Frame for images
function HerbariumFrame({ children, label, className }: { children: React.ReactNode; label?: string; className?: string }) {
  return (
    <div className={`relative p-4 ${className}`} style={{ backgroundColor: COLORS.paperLight, border: `2px solid ${COLORS.border}`, boxShadow: 'inset 0 0 0 1px rgba(74, 93, 35, 0.1), 0 4px 20px rgba(0,0,0,0.08)' }}>
      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: COLORS.moss, opacity: 0.4 }} />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: COLORS.moss, opacity: 0.4 }} />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: COLORS.moss, opacity: 0.4 }} />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: COLORS.moss, opacity: 0.4 }} />
      
      <div className="relative overflow-hidden" style={{ border: `1px solid ${COLORS.sepia}`, borderRadius: '1px' }}>
        {children}
      </div>
      
      {label && (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: COLORS.moss, fontFamily: "'IM Fell English', serif" }}>
            {label}
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.copper, opacity: 0.4 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.sepia, opacity: 0.3 }} />
          </div>
        </div>
      )}
    </div>
  );
}

function Branch({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 120 40" fill="none">
      <path d="M10 20 Q 40 5, 60 20 T 110 20" stroke={COLORS.moss} strokeWidth="1.5" fill="none" opacity="0.4"/>
      <path d="M30 20 Q 35 10, 40 15" stroke={COLORS.moss} strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M60 20 Q 65 8, 70 12" stroke={COLORS.moss} strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M85 20 Q 90 10, 95 14" stroke={COLORS.moss} strokeWidth="1" fill="none" opacity="0.3"/>
      <circle cx="40" cy="15" r="2" fill={COLORS.moss} opacity="0.2"/>
      <circle cx="70" cy="12" r="2" fill={COLORS.moss} opacity="0.2"/>
      <circle cx="95" cy="14" r="2" fill={COLORS.moss} opacity="0.2"/>
    </svg>
  );
}

function HeroSection({ content, logistics, previewMobile }: { content: InvitationSchema['content']; logistics: InvitationSchema['logistics']; previewMobile?: boolean }) {
  const scrollToContent = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  const eventDate = parseDateLocal(logistics.event_date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('es-ES', { month: 'long' });
  const year = eventDate.getFullYear();
  const headline = content.headline || 'Nuestra Boda';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: COLORS.paper }}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      <div className={`${previewMobile ? 'flex' : 'md:hidden flex'} flex-col items-center justify-center px-6 py-8 min-h-screen`}>
        <div className="relative w-full max-w-md flex flex-col items-center">
          {/* Decorative pressed flowers */}
          <div className="absolute top-0 left-0 opacity-30">
            <PressedFlower className="w-16 h-16" />
          </div>
          <div className="absolute top-10 right-0 opacity-20">
            <PressedFlower className="w-12 h-12" style={{ transform: 'rotate(45deg)' }} />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.2, ease: "easeOut" }} 
            className="relative mx-auto mb-8"
          >
            <HerbariumFrame label="Nuestra historia">
              <img 
                src={content.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'} 
                alt="Couple" 
                className="w-full h-auto object-cover" 
                style={{ filter: 'sepia(25%) saturate(70%) brightness(0.98) contrast(1.05)', aspectRatio: '3/4' }} 
              />
            </HerbariumFrame>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.4 }} 
            className="text-center"
          >
            <VintageLabel className="mb-6">
              {headline}
            </VintageLabel>
            
            <h1 
              className="font-serif tracking-wide mb-2" 
              style={{ 
                color: COLORS.ink, 
                fontSize: 'clamp(2rem, 8vw, 3rem)', 
                fontFamily: "'IM Fell English', 'Crimson Text', serif", 
                fontWeight: 400,
                letterSpacing: '-0.02em'
              }}
            >
              {content.couple?.person1.name || 'Flora'}
            </h1>
            <div className="flex items-center justify-center gap-4 my-4">
              <Branch className="w-20 h-6" />
              <span 
                className="font-serif italic text-2xl" 
                style={{ color: COLORS.moss, fontFamily: "'IM Fell English', serif" }}
              >
                &
              </span>
              <Branch className="w-20 h-6" style={{ transform: 'scaleX(-1)' }} />
            </div>
            <h1 
              className="font-serif tracking-wide mt-1" 
              style={{ 
                color: COLORS.ink, 
                fontSize: 'clamp(1.75rem, 7vw, 2.5rem)', 
                fontFamily: "'IM Fell English', 'Crimson Text', serif", 
                fontWeight: 400,
                letterSpacing: '-0.02em'
              }}
            >
              {content.couple?.person2.name || 'Fauna'}
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.7 }} 
            className="text-center mt-8 px-6 py-4 border-y-2"
            style={{ borderColor: COLORS.moss, borderStyle: 'double' }}
          >
            <p 
              className="text-xs uppercase tracking-[0.25em] mb-2" 
              style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}
            >
              {day} de {month} de {year}
            </p>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-3 h-3" style={{ color: COLORS.moss }} />
              <p 
                className="text-xs uppercase tracking-[0.2em]" 
                style={{ color: COLORS.sepia, fontFamily: "'Crimson Text', serif" }}
              >
                {logistics.venues[0]?.name || 'Jardín Botánico'}
              </p>
            </div>
          </motion.div>

          <motion.button 
            onClick={scrollToContent} 
            className="mt-12" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Leaf className="w-5 h-5 mb-2" style={{ color: COLORS.moss }} />
              </motion.div>
              <span 
                className="text-[10px] uppercase tracking-[0.3em]" 
                style={{ color: COLORS.sepia, fontFamily: "'Crimson Text', serif" }}
              >
                Explorar
              </span>
            </div>
          </motion.button>
        </div>
      </div>

      <div className={`${previewMobile ? 'hidden' : 'hidden md:flex'} absolute inset-0 items-center justify-center px-12 lg:px-20`}>
        {/* Background decorative elements */}
        <div className="absolute top-20 left-20 opacity-20">
          <PressedFlower className="w-24 h-24" />
        </div>
        <div className="absolute bottom-32 right-20 opacity-15">
          <PressedFlower className="w-20 h-20" style={{ transform: 'rotate(120deg)' }} />
        </div>
        
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="col-span-5 lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <HerbariumFrame label="Nuestra Historia — Colección de Amor">
                  <img
                    src={content.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'}
                    alt="Couple"
                    className="w-full h-auto object-cover"
                    style={{ filter: 'sepia(25%) saturate(70%) brightness(0.98) contrast(1.05)', aspectRatio: '3/4' }}
                  />
                </HerbariumFrame>
              </motion.div>
            </div>

            <div className="col-span-7 lg:col-span-7 flex flex-col justify-center pl-4 lg:pl-8">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="relative"
              >
                {/* Corner accent */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: COLORS.copper, opacity: 0.5 }} />
                
                <div className="mb-8">
                  <VintageLabel>
                    {headline}
                  </VintageLabel>
                </div>
                
                <h1
                  className="font-serif tracking-wide"
                  style={{
                    color: COLORS.ink,
                    fontSize: 'clamp(2.5rem, 4vw, 4rem)',
                    fontFamily: "'IM Fell English', 'Crimson Text', serif",
                    lineHeight: 1.1,
                    fontWeight: 400,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {content.couple?.person1.name || 'Flora'}
                </h1>
                <div className="flex items-center gap-4 my-6">
                  <Branch className="w-24 h-6" />
                  <span
                    className="font-serif italic text-3xl lg:text-4xl"
                    style={{ color: COLORS.moss, fontFamily: "'IM Fell English', serif" }}
                  >
                    &
                  </span>
                  <Branch className="w-24 h-6" style={{ transform: 'scaleX(-1)' }} />
                </div>
                <h1
                  className="font-serif tracking-wide"
                  style={{
                    color: COLORS.ink,
                    fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                    fontFamily: "'IM Fell English', 'Crimson Text', serif",
                    lineHeight: 1.1,
                    fontWeight: 400,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {content.couple?.person2.name || 'Fauna'}
                </h1>

                <div 
                  className="px-6 py-4 mt-8 border-2"
                  style={{ borderColor: COLORS.moss, borderStyle: 'double', backgroundColor: COLORS.paperLight }}
                >
                  <p
                    className="text-sm uppercase tracking-[0.2em] mb-2"
                    style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}
                  >
                    {day} de {month} de {year}
                  </p>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" style={{ color: COLORS.moss }} />
                    <p
                      className="text-xs uppercase tracking-[0.15em]"
                      style={{ color: COLORS.sepia, fontFamily: "'Crimson Text', serif" }}
                    >
                      {logistics.venues[0]?.name || 'Jardín Botánico'}
                    </p>
                  </div>
                </div>
                
                {/* Corner accent bottom */}
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: COLORS.copper, opacity: 0.5 }} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <motion.button onClick={scrollToContent} className={`${previewMobile ? 'hidden' : 'hidden md:block'} absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20`} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <div className="flex flex-col items-center">
          <motion.div animate={{ y: [0, 6, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
            <Feather className="w-5 h-5 mb-2" style={{ color: COLORS.moss }} />
          </motion.div>
          <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: COLORS.sepia, fontFamily: "'Lato', sans-serif" }}>Explorar</span>
        </div>
      </motion.button>
    </section>
  );
}

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
    <motion.div className="flex flex-col items-center mx-2 md:mx-6" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
      <div className="relative p-4 md:p-6 mb-2" style={{ border: `2px solid ${COLORS.moss}`, borderRadius: '4px', backgroundColor: COLORS.paperLight, boxShadow: '0 4px 12px rgba(93, 107, 79, 0.1)' }}>
        <span className="font-serif text-3xl md:text-5xl lg:text-6xl" style={{ color: COLORS.moss, fontFamily: "'Playfair Display', serif" }}>{String(value).padStart(2, '0')}</span>
        <Flower2 className="absolute -top-2 -right-2 w-4 h-4" style={{ color: COLORS.moss }} />
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>{label}</span>
    </motion.div>
  );

  return (
    <section className="py-20 md:py-28 px-4 relative overflow-hidden" style={{ backgroundColor: COLORS.paperDark }}>
      {/* Field notebook lines background */}
      <FieldNotebookLines />
      
      {/* Decorative fern leaves */}
      <div className="absolute top-10 left-10 opacity-20 hidden lg:block">
        <FernLeaf className="w-24 h-32" style={{ transform: 'rotate(-15deg)' }} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-15 hidden lg:block">
        <FernLeaf className="w-20 h-28" style={{ transform: 'rotate(160deg) scaleX(-1)' }} />
      </div>
      
      {/* Watercolor texture */}
      <WatercolorTexture />
      
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="max-w-5xl mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-16" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
          <OakLeaf className="w-12 h-16" style={{ opacity: 0.4 }} />
          <div className="h-px w-16" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
        </div>
        
        <VintageLabel className="mb-8">Faltan</VintageLabel>
        
        <div className="flex flex-wrap justify-center items-center gap-y-6">
          <TimeUnit value={timeLeft.days} label="Días" />
          <span className="text-2xl md:text-4xl font-light self-start mt-4 hidden sm:block" style={{ color: COLORS.moss, opacity: 0.5 }}>:</span>
          <TimeUnit value={timeLeft.hours} label="Horas" />
          <span className="text-2xl md:text-4xl font-light self-start mt-4 hidden sm:block" style={{ color: COLORS.moss, opacity: 0.5 }}>:</span>
          <TimeUnit value={timeLeft.minutes} label="Minutos" />
          <div className="w-full sm:hidden" />
          <span className="text-2xl md:text-4xl font-light self-start mt-4 hidden sm:block" style={{ color: COLORS.moss, opacity: 0.5 }}>:</span>
          <TimeUnit value={timeLeft.seconds} label="Segundos" />
        </div>
      </motion.div>
    </section>
  );
}

function QuoteSection({ content }: { content: InvitationSchema['content'] }) {
  const quoteText = content.quote?.text || content.main_message || content.couple?.love_story || '"Como dos raíces que se encuentran en la oscuridad de la tierra, nuestros caminos se unen para crecer hacia la luz."';
  const words = quoteText.split(' ');

  return (
    <section className="py-24 md:py-32 px-4 relative" style={{ backgroundColor: COLORS.paper }}>
      {/* Watercolor texture */}
      <WatercolorTexture />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-20 hidden md:block">
        <PressedFlower className="w-20 h-20" style={{ transform: 'rotate(25deg)' }} />
      </div>
      <div className="absolute bottom-20 right-10 opacity-15 hidden md:block">
        <OakLeaf className="w-16 h-20" style={{ transform: 'rotate(-30deg)' }} />
      </div>
      
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="max-w-3xl mx-auto text-center px-4 relative z-10">
        {/* Ornate corners */}
        <div className="absolute -top-8 -left-4 hidden md:block">
          <OrnateCorner />
        </div>
        <div className="absolute -bottom-8 -right-4 hidden md:block" style={{ transform: 'rotate(180deg)' }}>
          <OrnateCorner />
        </div>
        
        <div className="flex items-center justify-center gap-6 mb-10">
          <Branch className="w-20 h-6" style={{ transform: 'rotate(-10deg)' }} />
          <OakLeaf className="w-10 h-12" style={{ opacity: 0.5 }} />
          <Branch className="w-20 h-6" style={{ transform: 'rotate(10deg) scaleX(-1)' }} />
        </div>
        
        <p className="font-serif italic leading-relaxed text-xl md:text-2xl lg:text-3xl" style={{ color: COLORS.ink, fontFamily: "'IM Fell English', 'Crimson Text', serif", letterSpacing: '-0.01em' }}>
          {words.map((word, index) => (
            <motion.span key={index} initial={{ opacity: 0, filter: 'blur(4px)' }} whileInView={{ opacity: 1, filter: 'blur(0px)' }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.04 }} style={{ display: 'inline-block', marginRight: '0.3em' }}>{word}</motion.span>
          ))}
        </p>
        
        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: COLORS.sepia, fontFamily: "'Crimson Text', serif" }}>— {content.quote?.author || 'Nuestra historia'}</p>
        </div>
        
        <motion.div initial={{ width: 0 }} whileInView={{ width: '100px' }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }} className="h-px mx-auto mt-10" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
      </motion.div>
    </section>
  );
}

function TimelineSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const events = logistics.agenda?.length > 0 ? logistics.agenda.map((item) => ({ time: item.time, title: item.title, description: item.description || '' })) : [{ time: '16:00', title: 'Ceremonia de Bienvenida', description: 'Recepción en el jardín' }, { time: '17:30', title: 'Ceremonia Principal', description: 'Intercambio de votos' }, { time: '19:00', title: 'Cena', description: 'Celebración en el invernadero' }, { time: '21:30', title: 'Baile', description: 'Fiesta bajo las estrellas' }];

  return (
    <section className="py-24 md:py-32 px-4 relative" style={{ backgroundColor: COLORS.paperLight }}>
      {/* Field notebook lines */}
      <FieldNotebookLines className="opacity-10" />
      
      {/* Decorative stamp */}
      <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
        <MuseumStamp />
      </div>
      
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <FernLeaf className="w-16 h-20" style={{ opacity: 0.3, transform: 'rotate(-20deg)' }} />
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide" style={{ color: COLORS.ink, fontFamily: "'IM Fell English', serif" }}>Agenda del Día</h2>
            <FernLeaf className="w-16 h-20" style={{ opacity: 0.3, transform: 'rotate(20deg) scaleX(-1)' }} />
          </div>
          <VintageLabel className="mt-4">Horarios</VintageLabel>
        </div>
        
        <div className="relative mt-12">
          <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(180deg, ${COLORS.moss}30 0%, ${COLORS.moss}70 20%, ${COLORS.moss}70 80%, ${COLORS.moss}30 100%)` }} />
          <div className="space-y-12 md:space-y-0">
            {events.map((event, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 }} className={`relative flex items-center gap-6 md:gap-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full z-10 transform -translate-x-1/2" style={{ backgroundColor: COLORS.paper, border: `2px solid ${COLORS.moss}`, boxShadow: '0 0 0 4px rgba(74, 93, 35, 0.15)' }} />
                <div className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className="p-5 inline-block border-2" style={{ borderColor: COLORS.border, borderStyle: 'double', borderRadius: '2px', backgroundColor: COLORS.paper }}>
                    <span className="text-xs uppercase tracking-[0.25em] block mb-2" style={{ color: COLORS.moss, fontFamily: "'IM Fell English', serif" }}>{event.time}</span>
                    <h3 className="font-serif text-lg md:text-xl mb-2" style={{ color: COLORS.ink, fontFamily: "'IM Fell English', serif" }}>{event.title}</h3>
                    <p className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>{event.description}</p>
                  </div>
                </div>
                <div className="hidden md:block md:w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>Te esperamos en cada momento especial</p>
        </div>
      </motion.div>
    </section>
  );
}

function VenuesSection({ logistics, content, features }: { logistics: InvitationSchema['logistics']; content: InvitationSchema['content']; features: InvitationSchema['features'] }) {
  const generateCalendarLink = (venue: any, eventDate: string) => {
    const eventTitle = encodeURIComponent(`${content.headline || content.couple?.person1.name + ' & ' + content.couple?.person2.name} - ${venue.title}`);
    const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
    let baseDate = new Date(eventDate);
    if (isNaN(baseDate.getTime())) baseDate = new Date();
    const [hours, minutes] = venue.time ? venue.time.split(':') : ['18', '00'];
    baseDate.setHours(parseInt(hours), parseInt(minutes));
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0];
    const endDate = new Date(baseDate);
    endDate.setHours(endDate.getHours() + 1);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDate(baseDate)}/${formatDate(endDate)}&details=Te esperamos&location=${location}`;
  };

  const showCeremony = features.show_ceremony ?? true;
  const showReception = features.show_reception ?? true;
  
  const allVenues = logistics.venues?.length > 0 ? logistics.venues.map((venue, idx) => {
    const hasCoordinates = venue.coordinates?.lat != null && venue.coordinates?.lng != null;
    const lat = venue.coordinates?.lat;
    const lng = venue.coordinates?.lng;
    return {
      title: venue.type === 'ceremony' ? 'Ceremonia' : venue.type === 'reception' ? 'Celebración' : venue.name,
      name: venue.name, address: venue.address, type: venue.type, time: logistics.agenda?.[idx]?.time || '18:00',
      mapUrl: venue.google_maps_url || (hasCoordinates ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed` : `https://maps.google.com/maps?q=${encodeURIComponent(venue.address)}&z=15&output=embed`),
      mapsLink: venue.google_maps_url || (hasCoordinates ? `https://maps.google.com/?q=${lat},${lng}` : `https://maps.google.com/?q=${encodeURIComponent(venue.address)}`),
      calendarLink: generateCalendarLink({ title: venue.type === 'ceremony' ? 'Ceremonia' : 'Celebración', name: venue.name, address: venue.address, time: logistics.agenda?.[idx]?.time || '18:00' }, logistics.event_date)
    };
  }) : [{ title: 'Ceremonia', name: 'Jardín Botánico Central', address: 'Av. Las Magnolias 456, Ciudad Jardín', type: 'ceremony', time: '17:00', mapUrl: 'https://maps.google.com/maps?q=-34.5889,-58.3939&z=15&output=embed', mapsLink: 'https://maps.google.com/?q=Jardin+Botanico+Buenos+Aires', calendarLink: generateCalendarLink({ title: 'Ceremonia', name: 'Jardín Botánico Central', address: 'Av. Las Magnolias 456, Ciudad Jardín', time: '17:00' }, logistics.event_date) }];

  const filteredVenues = allVenues.filter(venue => !(venue.type === 'ceremony' && !showCeremony) && !(venue.type === 'reception' && !showReception));

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.paperDark }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto">
        {/* Header con elementos botánicos */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px" style={{ backgroundColor: COLORS.moss, opacity: 0.4 }} />
            <TreeDeciduous className="w-6 h-6" style={{ color: COLORS.moss }} />
            <div className="w-12 h-px" style={{ backgroundColor: COLORS.moss, opacity: 0.4 }} />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-3" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}>
            {filteredVenues.length === 1 ? 'Ubicación' : 'Ubicaciones'}
          </h2>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>Direcciones del evento</p>
        </div>

        <div className={`grid ${filteredVenues.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : 'md:grid-cols-2'} gap-10`}>
          {filteredVenues.map((venue, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6, delay: index * 0.2 }} 
              className="relative"
            >
              {/* Card botánica sin imagen */}
              <div 
                className="p-8 md:p-10 relative"
                style={{ 
                  backgroundColor: COLORS.paper, 
                  border: `1px solid ${COLORS.border}`, 
                  borderRadius: '4px',
                  boxShadow: '0 4px 20px rgba(93, 107, 79, 0.06)'
                }}
              >
                {/* Decoración orgánica superior */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
                  <Sprout className="w-5 h-5" style={{ color: COLORS.moss }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
                </div>

                {/* Indicador de tipo */}
                <div className="flex items-center gap-2 mb-6">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS.moss}15` }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: COLORS.moss }} />
                  </div>
                  <span 
                    className="text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}
                  >
                    {venue.title}
                  </span>
                </div>

                {/* Nombre del lugar */}
                <h3 
                  className="font-serif text-2xl md:text-3xl mb-4"
                  style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}
                >
                  {venue.name}
                </h3>

                {/* Divider orgánico */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-px" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
                  <Leaf className="w-3 h-3" style={{ color: COLORS.moss, opacity: 0.5 }} />
                  <div className="w-8 h-px" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
                </div>

                {/* Dirección */}
                <p 
                  className="text-sm mb-2 leading-relaxed"
                  style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}
                >
                  {venue.address}
                </p>

                {/* Horario si está disponible */}
                {venue.time && (
                  <p 
                    className="text-xs uppercase tracking-[0.15em] mb-8"
                    style={{ color: COLORS.sepia, fontFamily: "'Crimson Text', serif" }}
                  >
                    {venue.time} hs
                  </p>
                )}

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                  <a 
                    href={venue.mapsLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-center text-[11px] uppercase tracking-[0.15em] transition-all duration-300 hover:opacity-80"
                    style={{ 
                      color: COLORS.moss, 
                      border: `1px solid ${COLORS.moss}`, 
                      borderRadius: '2px', 
                      fontFamily: "'Crimson Text', serif",
                      backgroundColor: 'transparent' 
                    }}
                  >
                    <MapPin className="w-4 h-4" />
                    Cómo llegar
                  </a>
                  <a 
                    href={venue.calendarLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 px-4 py-3 text-[11px] uppercase tracking-[0.15em] transition-all duration-300 hover:opacity-80"
                    style={{ 
                      color: COLORS.moss, 
                      border: `1px solid ${COLORS.moss}`, 
                      borderRadius: '2px', 
                      fontFamily: "'Crimson Text', serif" 
                    }}
                  >
                    <Calendar className="w-4 h-4" /> 
                    Agendar
                  </a>
                </div>
              </div>

              {/* Decoración de hojas esquina */}
              <div className="absolute -bottom-2 -right-2 opacity-20">
                <Leaf className="w-8 h-8" style={{ color: COLORS.moss }} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function DressCodeSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
  const getDressCodeLabel = (code?: string) => {
    const labels: Record<string, string> = {
      'formal': 'Formal Elegante',
      'black-tie': 'Black Tie',
      'cocktail': 'Cocktail',
      'semi-formal': 'Semi Formal',
      'casual-elegant': 'Casual Elegante',
      'themed': 'Temática Especial',
      'white-tie': 'White Tie',
      'custom': 'Elegancia Natural'
    };
    return code && labels[code] ? labels[code] : logistics.dress_code?.description || 'Elegancia Natural';
  };
  const dressCodeText = getDressCodeLabel(logistics.dress_code?.code);

  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4" style={{ backgroundColor: COLORS.paper }}>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="max-w-2xl mx-auto text-center">
        <Flower2 className="w-8 h-8 mx-auto mb-4" style={{ color: COLORS.moss }} />
        <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-8" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}>Código de Vestimenta</h2>
        <BotanicalDivider className="mb-8" />
        <h3 className="font-serif text-2xl md:text-3xl tracking-wide mb-6" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}>{dressCodeText}</h3>
        {logistics.dress_code?.description && <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>{logistics.dress_code.description}</motion.p>}
        <div className="mt-8 flex justify-center gap-4">
          <Leaf className="w-5 h-5" style={{ color: COLORS.moss, opacity: 0.4 }} />
          <Sprout className="w-5 h-5" style={{ color: COLORS.moss }} />
          <Leaf className="w-5 h-5" style={{ color: COLORS.moss, opacity: 0.4 }} />
        </div>
      </motion.div>
    </section>
  );
}

function GallerySection({ content }: { content: InvitationSchema['content'] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const photos = content.gallery_images?.length ? content.gallery_images : ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1522673607200-16488321499b?q=80&w=800&auto=format&fit=crop'];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

  useEffect(() => { if (isHovered) return; const interval = setInterval(() => nextSlide(), 5000); return () => clearInterval(interval); }, [isHovered, photos.length]);

  return (
    <section className="py-24 md:py-32 overflow-hidden" style={{ backgroundColor: COLORS.paperDark }}>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <div className="text-center mb-12 md:mb-16 px-4">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="w-16 md:w-24 h-px" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}>Galería</h2>
            <div className="w-16 md:w-24 h-px" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
          </div>
          <p className="text-xs md:text-sm uppercase tracking-[0.2em]" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>Momentos especiales juntos</p>
        </div>

        <div className="md:hidden relative px-8" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="overflow-hidden" style={{ borderRadius: '2px', border: `1px solid ${COLORS.border}` }}>
            <motion.div className="flex" animate={{ x: `-${currentIndex * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} style={{ width: `${photos.length * 100}%` }}>
              {photos.map((photo, index) => (
                <div key={index} className="flex-shrink-0 w-full px-1">
                  <div className="aspect-[3/4] max-h-[50vh]"><img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" style={{ filter: 'sepia(15%) saturate(85%) contrast(0.98)' }} /></div>
                </div>
              ))}
            </motion.div>
          </div>
          <AnimatePresence>
            {isHovered && (
              <>
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center" style={{ backgroundColor: COLORS.paper, borderRadius: '50%', boxShadow: '0 2px 10px rgba(93, 107, 79, 0.2)' }}><ArrowLeft className="w-5 h-5" style={{ color: COLORS.moss }} /></motion.button>
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center" style={{ backgroundColor: COLORS.paper, borderRadius: '50%', boxShadow: '0 2px 10px rgba(93, 107, 79, 0.2)' }}><ArrowRight className="w-5 h-5" style={{ color: COLORS.moss }} /></motion.button>
              </>
            )}
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-6">
            {photos.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className="w-2 h-2 rounded-full transition-all duration-300" style={{ backgroundColor: index === currentIndex ? COLORS.moss : `${COLORS.moss}40` }} />)}
          </div>
        </div>

        <div className="hidden md:block max-w-5xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-2 gap-6 lg:gap-8">
            <div className="flex flex-col gap-6 lg:gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="overflow-hidden p-3" style={{ backgroundColor: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: '2px', boxShadow: '0 4px 20px rgba(93, 107, 79, 0.08)' }}>
                <img src={photos[0]} alt="Gallery 1" className="w-full object-cover transition-transform duration-700 hover:scale-105" style={{ filter: 'sepia(15%) saturate(85%) contrast(0.98)', aspectRatio: '4/5' }} />
                <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-center" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>1 / {photos.length}</p>
              </motion.div>
              {photos[1] && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="overflow-hidden p-3" style={{ backgroundColor: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: '2px', boxShadow: '0 4px 20px rgba(93, 107, 79, 0.08)' }}>
                <img src={photos[1]} alt="Gallery 2" className="w-full object-cover transition-transform duration-700 hover:scale-105" style={{ filter: 'sepia(15%) saturate(85%) contrast(0.98)', aspectRatio: '3/2' }} />
                <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-center" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>2 / {photos.length}</p>
              </motion.div>}
            </div>
            <div className="flex flex-col gap-6 lg:gap-8 pt-12">
              {photos[2] && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="overflow-hidden p-3" style={{ backgroundColor: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: '2px', boxShadow: '0 4px 20px rgba(93, 107, 79, 0.08)' }}>
                <img src={photos[2]} alt="Gallery 3" className="w-full object-cover transition-transform duration-700 hover:scale-105" style={{ filter: 'sepia(15%) saturate(85%) contrast(0.98)', aspectRatio: '3/2' }} />
                <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-center" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>3 / {photos.length}</p>
              </motion.div>}
              {photos[3] && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} className="overflow-hidden p-3" style={{ backgroundColor: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: '2px', boxShadow: '0 4px 20px rgba(93, 107, 79, 0.08)' }}>
                <img src={photos[3]} alt="Gallery 4" className="w-full object-cover transition-transform duration-700 hover:scale-105" style={{ filter: 'sepia(15%) saturate(85%) contrast(0.98)', aspectRatio: '4/5' }} />
                <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-center" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>4 / {photos.length}</p>
              </motion.div>}
            </div>
          </div>
          {photos.length >= 5 && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-8 max-w-3xl mx-auto overflow-hidden p-3" style={{ backgroundColor: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: '2px', boxShadow: '0 4px 20px rgba(93, 107, 79, 0.08)' }}>
            <img src={photos[4]} alt="Gallery 5" className="w-full object-cover transition-transform duration-700 hover:scale-105" style={{ filter: 'sepia(15%) saturate(85%) contrast(0.98)', aspectRatio: '21/9' }} />
            <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-center" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>5 / {photos.length} — Vista panorámica</p>
          </motion.div>}
        </div>
      </motion.div>
    </section>
  );
}

function GiftRegistrySection({ features }: { features: InvitationSchema['features'] }) {
  const [copied, setCopied] = useState(false);
  const alias = features.gift_registry?.bank_details?.alias || 'FLORAYFAUNA.BODA';

  const handleCopy = () => { navigator.clipboard.writeText(alias); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.paper }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-xl mx-auto text-center">
        <Gift className="w-8 h-8 mx-auto mb-4" style={{ color: COLORS.moss }} />
        <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-4" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}>Mesa de Regalos</h2>
        <BotanicalDivider className="mb-8" />
        <p className="text-sm leading-relaxed mb-10 max-w-md mx-auto" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>{features.gift_registry?.message || 'Tu presencia es el regalo más valioso. Si deseás contribuir a cultivar nuestro nuevo hogar, te lo agradecemos con el corazón.'}</p>
        <div className="mb-10 p-6" style={{ border: `1px solid ${COLORS.border}`, borderRadius: '2px', backgroundColor: COLORS.paperLight }}>
          <p className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}>Alias Bancario</p>
          <div className="flex items-center justify-center gap-4">
            <span className="font-serif text-lg tracking-wide" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}>{alias}</span>
            <button onClick={handleCopy} className="text-xs uppercase tracking-[0.15em] px-4 py-2 transition-all duration-300 hover:bg-opacity-10" style={{ color: COLORS.moss, border: `1px solid ${COLORS.moss}`, borderRadius: '2px', fontFamily: "'Crimson Text', serif" }}>{copied ? 'Copiado' : 'Copiar'}</button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function RSVPSection({ features, content, metadata }: { features: InvitationSchema['features']; content: InvitationSchema['content']; metadata: InvitationSchema['metadata'] }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', attendance: true, guests: 1, dietary: '', musicSuggestion: '', message: '' });
  // Estado para respuestas de preguntas personalizadas
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await submitRSVP({ invitationId: metadata.id, name: formData.name, email: formData.email, phone: formData.phone, attendance: formData.attendance, guestsCount: formData.guests, dietaryRestrictions: formData.dietary, musicSuggestion: formData.musicSuggestion, message: formData.message, customAnswers: customAnswers });
      if (result.success) { setSuccess(true); setFormData({ name: '', email: '', phone: '', attendance: true, guests: 1, dietary: '', musicSuggestion: '', message: '' }); setCustomAnswers({}); }
      else { setError(result.error || 'Error al enviar la confirmación'); }
    } catch { setError('Error inesperado. Por favor intenta de nuevo.'); }
    finally { setLoading(false); }
  };

  const handleCustomAnswerChange = (questionId: string, value: string) => {
    setCustomAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Obtener preguntas personalizadas desde features.rsvp
  const customQuestions = features.rsvp?.custom_questions || [];

  if (success) {
    return (
      <section className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.paperDark }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center">
          <div className="p-8" style={{ backgroundColor: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: '4px' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}><Sprout className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.moss }} /></motion.div>
            <h3 className="font-serif text-xl mb-3" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}>¡Gracias!</h3>
            <p className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>Gracias {formData.name}, hemos registrado tu respuesta. Te esperamos con alegría.</p>
            <button onClick={() => setSuccess(false)} className="mt-6 text-xs uppercase tracking-[0.2em] underline-offset-4 hover:underline" style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}>Enviar otra confirmación</button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp-section" className="py-24 md:py-32 px-4" style={{ backgroundColor: COLORS.paperDark }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <Shovel className="w-8 h-8 mx-auto mb-4" style={{ color: COLORS.moss }} />
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-2" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}>Confirmar Asistencia</h2>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>Fecha límite: {features.rsvp?.deadline ? new Date(features.rsvp.deadline).toLocaleDateString('es-ES') : '30 días antes'}</p>
        </div>
        {error && <div className="p-4 mb-6 text-center text-sm" style={{ backgroundColor: `${COLORS.rose}30`, color: COLORS.ink, borderRadius: '2px' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] mb-2" style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}>Nombre Completo</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm" style={{ color: COLORS.ink, borderBottom: `1px dashed ${COLORS.border}`, fontFamily: "'Crimson Text', serif" }} placeholder="Tu nombre" disabled={loading} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] mb-2" style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}>Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm" style={{ color: COLORS.ink, borderBottom: `1px dashed ${COLORS.border}`, fontFamily: "'Crimson Text', serif" }} placeholder="tu@email.com" disabled={loading} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] mb-3" style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}>¿Asistirás?</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setFormData({ ...formData, attendance: true })} className="flex-1 py-3 text-xs uppercase tracking-[0.15em] transition-all duration-300" style={{ backgroundColor: formData.attendance ? COLORS.moss : 'transparent', color: formData.attendance ? COLORS.paper : COLORS.ink, border: `1px solid ${COLORS.moss}`, borderRadius: '2px', fontFamily: "'Crimson Text', serif" }} disabled={loading}>Sí, asistiré</button>
              <button type="button" onClick={() => setFormData({ ...formData, attendance: false })} className="flex-1 py-3 text-xs uppercase tracking-[0.15em] transition-all duration-300" style={{ backgroundColor: !formData.attendance ? COLORS.slate : 'transparent', color: !formData.attendance ? COLORS.paper : COLORS.ink, border: `1px solid ${COLORS.slate}`, borderRadius: '2px', fontFamily: "'Crimson Text', serif" }} disabled={loading}>No podré ir</button>
            </div>
          </div>
          {/* Preguntas que se ocultan si no asiste */}
          {formData.attendance && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2" style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}>Número de Invitados</label>
                <select value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm cursor-pointer" style={{ color: COLORS.ink, borderBottom: `1px dashed ${COLORS.border}`, fontFamily: "'Crimson Text', serif" }} disabled={loading}>
                  {[1, 2, 3, 4].map((num) => <option key={num} value={num} style={{ backgroundColor: COLORS.paper }}>{num} {num === 1 ? 'persona' : 'personas'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2" style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}>Restricciones Alimentarias</label>
                <textarea value={formData.dietary} onChange={(e) => setFormData({ ...formData, dietary: e.target.value })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm resize-none" style={{ color: COLORS.ink, borderBottom: `1px dashed ${COLORS.border}`, fontFamily: "'Crimson Text', serif", minHeight: '80px' }} placeholder="¿Tienes alguna restricción alimentaria o alergia?" disabled={loading} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] mb-2" style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}>Sugerencia Musical</label>
                <input type="text" value={formData.musicSuggestion} onChange={(e) => setFormData({ ...formData, musicSuggestion: e.target.value })} className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm" style={{ color: COLORS.ink, borderBottom: `1px dashed ${COLORS.border}`, fontFamily: "'Crimson Text', serif" }} placeholder="¿Qué canción no puede faltar?" disabled={loading} />
              </div>
              {/* Preguntas Personalizadas */}
              {customQuestions.length > 0 && (
                <div className="space-y-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}>Preguntas Adicionales</p>
                  {customQuestions.map((question) => (
                    <div key={question.id}>
                      <label className="block text-xs uppercase tracking-[0.15em] mb-2" style={{ color: COLORS.moss, fontFamily: "'Crimson Text', serif" }}>
                        {question.question}
                        {question.required && <span className="text-red-600 ml-1">*</span>}
                      </label>
                      {question.type === 'text' ? (
                        <input
                          type="text"
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm"
                          style={{ color: COLORS.ink, borderBottom: `1px dashed ${COLORS.border}`, fontFamily: "'Crimson Text', serif" }}
                          placeholder="Tu respuesta..."
                          disabled={loading}
                        />
                      ) : question.type === 'select' ? (
                        <select
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm cursor-pointer"
                          style={{ color: COLORS.ink, borderBottom: `1px dashed ${COLORS.border}`, fontFamily: "'Crimson Text', serif" }}
                          disabled={loading}
                        >
                          <option value="" style={{ backgroundColor: COLORS.paper }}>Selecciona una opción</option>
                          {question.options?.map((opt) => (
                            <option key={opt} value={opt} style={{ backgroundColor: COLORS.paper }}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <textarea
                          required={question.required}
                          value={customAnswers[question.id] || ''}
                          onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                          className="w-full py-3 bg-transparent focus:outline-none transition-colors text-sm resize-none"
                          style={{ color: COLORS.ink, borderBottom: `1px dashed ${COLORS.border}`, fontFamily: "'Crimson Text', serif", minHeight: '80px' }}
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
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} className="w-full py-4 text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2" style={{ backgroundColor: COLORS.moss, color: COLORS.paper, borderRadius: '2px', fontFamily: "'Crimson Text', serif", boxShadow: '0 4px 15px rgba(93, 107, 79, 0.3)' }}>
            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</span> : <span className="flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Enviar Confirmación</span>}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

function Footer({ content }: { content: InvitationSchema['content'] }) {
  const initials = content.couple ? `${content.couple.person1.name.charAt(0)}${content.couple.person2.name.charAt(0)}` : 'F&F';

  return (
    <footer className="py-16 px-4" style={{ backgroundColor: COLORS.paper }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-8">
          <span className="font-serif text-4xl md:text-5xl tracking-widest" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}>{initials}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="w-px h-12 mx-auto mb-8" style={{ backgroundColor: COLORS.moss, opacity: 0.3 }} />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} className="text-xs uppercase tracking-[0.3em]" style={{ color: COLORS.slate, fontFamily: "'Crimson Text', serif" }}>Con amor, {content.couple?.person1.name || 'Flora'} & {content.couple?.person2.name || 'Fauna'}</motion.p>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} className="text-xs mt-8" style={{ color: COLORS.sepia, fontFamily: "'Crimson Text', serif" }}>VOWS <span style={{ color: '#a27b5c' }}>.</span> © 2026</motion.p>
      </div>
    </footer>
  );
}

function FloatingRSVPButton({ features }: { features: InvitationSchema['features'] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasPassedRSVP, setHasPassedRSVP] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > window.innerHeight * 0.8);
      const rsvpSection = document.getElementById('rsvp-section');
      if (rsvpSection) setHasPassedRSVP(rsvpSection.getBoundingClientRect().top < window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRSVP = () => document.getElementById('rsvp-section')?.scrollIntoView({ behavior: 'smooth' });
  if (!features.show_rsvp || hasPassedRSVP) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} className="fixed bottom-6 right-6 z-50">
          <motion.button onClick={scrollToRSVP} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group flex items-center gap-3 px-5 py-3 transition-all duration-500" style={{ backgroundColor: COLORS.moss, borderRadius: '2px', boxShadow: '0 4px 24px rgba(93, 107, 79, 0.25)' }}>
            <span className="text-xs uppercase tracking-[0.2em] font-light" style={{ color: COLORS.paper, fontFamily: "'Crimson Text', serif" }}>Confirmar Asistencia</span>
            <div className="w-px h-4 transition-all duration-300 group-hover:h-5" style={{ backgroundColor: 'rgba(245, 240, 232, 0.3)' }} />
            <Mail className="w-4 h-4" style={{ color: COLORS.paper }} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BotanicalLayout({ invitation, preview, previewMobile }: BotanicalLayoutProps) {
  const { metadata, content, logistics, features } = invitation;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: COLORS.paper }}>
      <FeatureGate isVisible={features.show_hero} fallback={preview ? <EmptyStatePreview icon="🌿" title="Hero Section" description="Sección principal con los nombres y fecha" /> : null}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <HeroSection content={content} logistics={logistics} previewMobile={previewMobile} />
        </motion.div>
      </FeatureGate>
      <FeatureGate isVisible={features.show_countdown} data={features.countdown} fallback={preview ? <EmptyStatePreview icon="🌱" title="Cuenta Regresiva" description="Configura la fecha de tu evento para activar la cuenta regresiva" /> : null}>
        <CountdownSection logistics={logistics} />
      </FeatureGate>
      <FeatureGate isVisible={!!content.quote || !!content.couple?.love_story} data={content.quote} fallback={preview ? <EmptyStatePreview icon="🍃" title="Frase Especial" description="Agrega una frase o historia de amor" /> : null}>
        <QuoteSection content={content} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_agenda} data={logistics.agenda} fallback={preview ? <EmptyStatePreview icon="🌳" title="Agenda del Día" description="Agrega los momentos clave de tu evento" /> : null}>
        <TimelineSection logistics={logistics} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_venue_map} data={logistics.venues} fallback={preview ? <EmptyStatePreview icon="🗺️" title="Ubicaciones" description="Indica dónde será la ceremonia y la celebración" /> : null}>
        <VenuesSection logistics={logistics} content={content} features={features} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_dress_code} data={logistics.dress_code} fallback={preview ? <EmptyStatePreview icon="👔" title="Código de Vestimenta" description="Especifica el dress code para tu evento" /> : null}>
        <DressCodeSection logistics={logistics} />
      </FeatureGate>
      <FeatureGate isVisible={features.show_gallery} data={content.gallery_images} fallback={preview ? <EmptyStatePreview icon="📷" title="Galería de Fotos" description="Comparte tus mejores momentos" /> : null}>
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
