import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Invitation } from '../types';
import { HeartFrame } from './HeartFrame';
import { Timeline, LocationBlock, RSVPForm, Countdown, Gallery, GiftsSection, SpotifyEmbed } from './Sections';
import { generateRomanticMessage } from '../services/geminiService';

interface RetroLoveSkinProps {
  invitation: Invitation;
}

export const RetroLoveSkin: React.FC<RetroLoveSkinProps> = ({ invitation }) => {
  const [vibeMessage, setVibeMessage] = useState(invitation.message);
  const [isGenerating, setIsGenerating] = useState(false);
  const mainRef = useRef(null);

  const handleRefreshVibe = async () => {
    setIsGenerating(true);
    const newMessage = await generateRomanticMessage(
      invitation.names.bride,
      invitation.names.groom,
      "Vintage Scrapbook"
    );
    setVibeMessage(newMessage);
    setIsGenerating(false);
  };

  return (
    <div ref={mainRef} className="max-w-[480px] mx-auto bg-[#F2E8DF] shadow-2xl relative overflow-x-hidden min-h-screen border-x border-[#2C1810]/10">
      
      {/* 1. HERO - FULL SCREEN */}
      <section className="h-screen relative flex flex-col justify-end items-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={invitation.heroImage} 
            className="w-full h-full object-cover grayscale contrast-125"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-transparent to-[#2C1810]/40" />
        </motion.div>

        <div className="relative z-10 px-6 pb-20 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-handwritten text-[#F2E8DF] text-3xl mb-4 block">
              ¡Nos Casamos!
            </span>
            <h1 className="font-retro-serif text-6xl tracking-tighter text-[#F2E8DF] leading-[0.85] mb-6">
              {invitation.names.bride} <br />
              <span className="text-[#A63F24]">&</span> <br />
              {invitation.names.groom}
            </h1>
            <div className="bg-[#A63F24] inline-block px-4 py-1 mb-8">
               <p className="font-retro-serif text-[#F2E8DF] tracking-[0.2em] text-sm uppercase">
                {new Date(invitation.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
               </p>
            </div>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, repeat: Infinity, duration: 2 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="flex flex-col items-center mx-auto text-[#F2E8DF]/60"
          >
            <span className="text-[10px] uppercase tracking-widest mb-2 font-bold">Desliza</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </motion.button>
        </div>
      </section>

      {/* 2. COUNTDOWN */}
      <section className="bg-[#A63F24] text-[#F2E8DF] py-16 px-6 relative z-20">
        <h2 className="font-retro-serif text-2xl mb-8 text-center uppercase tracking-widest">
          Cada segundo cuenta...
        </h2>
        <Countdown targetDate={invitation.date} />
      </section>

      {/* 3. QUOTE (EDITORIAL) */}
      <section className="px-10 py-24 text-center bg-[#FAF9F6]">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative"
        >
          <span className="text-8xl font-retro-serif text-[#A63F24]/10 absolute -top-10 left-0">“</span>
          <p className="font-classic-serif text-2xl italic text-[#2C1810] leading-relaxed relative z-10 pt-4">
            {vibeMessage}
          </p>
          <span className="text-8xl font-retro-serif text-[#A63F24]/10 absolute -bottom-20 right-0">”</span>
          
          <button 
            onClick={handleRefreshVibe}
            disabled={isGenerating}
            className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] text-[#A63F24] hover:opacity-70 transition-opacity border-b border-[#A63F24]/30 pb-1"
          >
            {isGenerating ? 'Escribiendo...' : 'Actualizar Sentimiento ✨'}
          </button>
        </motion.div>
      </section>

      {/* 4. TIMELINE */}
      <section className="px-6 py-20 bg-[#F2E8DF]">
        <div className="text-center mb-16">
          <h2 className="font-retro-serif text-4xl mb-2 uppercase italic tracking-tighter">Hoja de Ruta</h2>
          <div className="h-1 w-20 bg-[#A63F24] mx-auto"></div>
        </div>
        <Timeline events={invitation.logistics.timeline} />
      </section>

      {/* 5. LOCATIONS */}
      <section className="px-6 py-20 bg-[#2C1810]">
        <h2 className="font-retro-serif text-3xl mb-12 text-[#F2E8DF] uppercase tracking-tighter">Ubicaciones</h2>
        <div className="grid gap-12">
          {invitation.logistics.locations.map((loc, i) => (
            <LocationBlock key={i} location={loc} index={i} />
          ))}
        </div>
      </section>

      {/* 6. DRESS CODE */}
      <section className="px-6 py-20 bg-[#FAF9F6]">
        <div className="border-4 border-[#2C1810] p-8 relative">
          <p className="font-classic-serif text-2xl text-center mb-8 pt-4 text-[#2C1810]">
            {invitation.logistics.dressCode.type}
          </p>
          
          {/* Imágenes de referencia de vestimenta */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="space-y-2">
              <img 
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400" 
                alt="Vestimenta femenina elegante"
                className="w-full h-40 object-cover rounded-lg border-2 border-[#2C1810]/20"
              />
              <p className="font-handwritten text-lg text-[#A63F24] text-center">Ella</p>
            </div>
            <div className="space-y-2">
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400" 
                alt="Vestimenta masculina elegante"
                className="w-full h-40 object-cover rounded-lg border-2 border-[#2C1810]/20"
              />
              <p className="font-handwritten text-lg text-[#A63F24] text-center">Él</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mb-8">
            {invitation.logistics.dressCode.colors.map((color, i) => (
              <div key={i} className="text-center">
                <div 
                  className="w-12 h-12 rounded-full border-2 border-[#2C1810] mb-2 shadow-sm" 
                  style={{ backgroundColor: color }}
                />
              </div>
            ))}
          </div>
          
          <p className="font-handwritten text-xl text-[#A63F24] text-center italic">
            {invitation.logistics.dressCode.description}
          </p>
        </div>
      </section>

      {/* 7. GALLERY */}
      <section className="py-20 bg-[#F2E8DF]">
        <div className="px-6 mb-12">
          <h2 className="font-retro-serif text-4xl uppercase tracking-tighter text-[#2C1810]">Momentos</h2>
          <p className="font-handwritten text-xl text-[#A63F24]">Un pedacito de nosotros</p>
        </div>
        <Gallery images={invitation.gallery} />
      </section>

      {/* 8. GIFTS */}
      <section className="px-6 py-20 bg-[#FAF9F6] border-y border-[#2C1810]/5">
        <GiftsSection gifts={invitation.gifts} />
      </section>

      {/* 9. RSVP */}
      <section id="rsvp" className="px-6 py-20 bg-[#A63F24]/5">
        <div className="text-center mb-12">
          <h2 className="font-retro-serif text-5xl mb-4 tracking-tighter">RSVP</h2>
          <p className="font-classic-serif italic text-[#2C1810]/70">
            Confirma antes del {new Date(invitation.features.rsvpDeadline).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
          </p>
        </div>
        <RSVPForm whatsapp={invitation.features.whatsappNumber} />
      </section>

      {/* 10. SPOTIFY */}
      <section className="px-6 py-10 bg-[#2C1810] text-[#F2E8DF]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.8-1.7-6.2-2.1-10.3-1.1-.3.1-.7-.1-.8-.4s.1-.7.4-.8c4.5-1 8.3-.6 11.4 1.3.3.2.4.6.2.8zm1.5-3.3c-.3.4-.8.5-1.2.3-3.2-1.9-8.1-2.5-11.8-1.4-.4.1-.9-.1-1-.5s.1-.9.5-1c4.3-1.3 9.7-.6 13.3 1.6.4.2.5.7.2 1zm.1-3.4C15.2 8.3 8.1 8 4.1 9.2c-.6.2-1.2-.2-1.4-.7s.2-1.2.7-1.4c4.6-1.4 12.5-1.1 17.1 1.6.5.3.7 1 .4 1.5-.3.5-.9.7-1.4.4z"/></svg>
          </div>
          <span className="font-retro-serif uppercase tracking-widest text-sm">Nuestra Playlist</span>
        </div>
        <SpotifyEmbed playlistId={invitation.features.spotifyPlaylistId} />
      </section>

      {/* 11. FOOTER */}
      <footer className="pt-20 pb-32 bg-[#2C1810] text-center px-8 relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 3, repeat: Infinity }}
          className="w-40 h-40 bg-[#A63F24]/10 heart-mask absolute -bottom-10 -right-10 z-0" 
        />
        
        <div className="relative z-10">
          <h3 className="font-handwritten text-4xl text-[#F2E8DF] mb-4 rotate-[-3deg]">
            ¡Te esperamos con amor!
          </h3>
          <p className="font-retro-serif text-[#F2E8DF]/40 text-[10px] uppercase tracking-[0.5em] mb-8">
            MARINA & DANIEL 2025
          </p>
          <div className="h-[1px] bg-white/10 w-full mb-6"></div>
          <p className="text-[9px] text-white/20 leading-relaxed max-w-[250px] mx-auto font-sans">
            ESTA ES UNA INVITACIÓN PRIVADA. TUS DATOS DE RSVP SERÁN TRATADOS CON EL MÁXIMO CARIÑO Y SOLO PARA FINES LOGÍSTICOS DE LA BODA.
          </p>
        </div>
      </footer>

      {/* STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-4 pointer-events-none z-50">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full bg-[#A63F24] text-white py-4 font-retro-serif text-lg tracking-[0.2em] shadow-[0_10px_30px_rgba(166,63,36,0.4)] pointer-events-auto uppercase"
        >
          Confirmar Mi Asistencia
        </motion.button>
      </div>
    </div>
  );
};