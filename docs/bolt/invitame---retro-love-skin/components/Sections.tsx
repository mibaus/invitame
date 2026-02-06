import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineEvent, Location as LocationType, Invitation } from '../types';

// Minimal Icons Map
const Icons = {
  church: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M12 2v6M9 8h6M6 21v-7a6 6 0 1112 0v7M12 11v3M10 14h4" /></svg>,
  glass: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L4 12c0 3 2 5 8 5s8-2 8-5L12 2zM12 17v5M8 22h8" /></svg>,
  fork: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2v20M2 2v12c0 3 2 4 4 4s4-1 4-4V2M15 2v5c0 2 1 2 2 2s2 0 2-2V2" /></svg>,
  music: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13M9 10l12-2M9 21a3 3 0 100-6 3 3 0 000 6zm12-3a3 3 0 100-6 3 3 0 000 6z" /></svg>,
  camera: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z" /></svg>
};

export const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(targetDate).getTime() - new Date().getTime();
      if (distance < 0) { clearInterval(timer); return; }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.entries(timeLeft).map(([key, val]) => (
        <div key={key} className="flex flex-col items-center">
          <div className="w-full bg-[#FAF9F6] text-[#A63F24] py-4 rounded-none border-b-[6px] border-[#2C1810]/30 shadow-md flex items-center justify-center">
            <span className="font-retro-serif text-3xl md:text-4xl tabular-nums tracking-tighter">{val}</span>
          </div>
          <span className="text-[9px] uppercase font-bold mt-2 tracking-widest opacity-80">{key === 'days' ? 'Días' : key === 'hours' ? 'Horas' : key === 'mins' ? 'Min' : 'Seg'}</span>
        </div>
      ))}
    </div>
  );
};

export const Timeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  return (
    <div className="relative pl-12">
      <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-[#2C1810]/10 border-l border-dashed border-[#A63F24]"></div>
      {events.map((ev, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="mb-14 relative group">
          <div className="absolute -left-[48px] top-0 w-12 h-12 bg-[#FAF9F6] border-2 border-[#A63F24] rounded-full flex items-center justify-center text-[#A63F24] shadow-sm z-10 group-hover:scale-110 transition-transform">
            {Icons[ev.icon]()}
          </div>
          <span className="font-retro-serif text-sm text-[#A63F24] block mb-1 uppercase tracking-widest">{ev.time}</span>
          <h4 className="font-classic-serif text-2xl text-[#2C1810] font-bold">{ev.event}</h4>
        </motion.div>
      ))}
    </div>
  );
};

export const LocationBlock: React.FC<{ location: LocationType, index: number }> = ({ location, index }) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="p-8 bg-white border-2 border-[#2C1810] shadow-[10px_10px_0px_0px_rgba(166,63,36,0.2)]">
      <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#A63F24] block mb-3 border-b border-[#A63F24]/20 pb-2">
        {location.type === 'ceremony' ? 'La Ceremonia' : 'La Fiesta'}
      </span>
      <h3 className="font-retro-serif text-3xl text-[#2C1810] mb-3 leading-tight uppercase italic">{location.name}</h3>
      <p className="font-classic-serif text-xl mb-8 leading-tight text-[#2C1810]/70">{location.address}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <a href={location.link} target="_blank" rel="noopener noreferrer" className="bg-[#A63F24] text-white py-4 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#2C1810] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Mapa
        </a>
        <a href={location.calendarLink} target="_blank" rel="noopener noreferrer" className="border-2 border-[#2C1810] text-[#2C1810] py-4 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#2C1810] hover:text-white transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Agendar
        </a>
      </div>
    </motion.div>
  );
};

export const Gallery: React.FC<{ images: string[] }> = ({ images }) => {
  return (
    <div className="columns-2 gap-4 px-6 space-y-4">
      {images.map((img, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: (i % 5) * 0.1 }} className="break-inside-avoid border-2 border-[#2C1810] p-1 bg-white shadow-md rotate-[1deg] hover:rotate-0 transition-transform">
          <img src={img} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" alt={`Gallery ${i}`} />
        </motion.div>
      ))}
    </div>
  );
};

export const GiftsSection: React.FC<{ gifts: Invitation['gifts'] }> = ({ gifts }) => {
  const [copied, setCopied] = useState<'cbu' | 'alias' | null>(null);

  const copyToClipboard = (text: string, type: 'cbu' | 'alias') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="text-center">
      <h2 className="font-retro-serif text-3xl mb-4 uppercase italic">Regalos</h2>
      <p className="font-classic-serif text-xl italic mb-10 text-[#2C1810]/70 leading-relaxed">
        Su presencia es nuestro mayor regalo, pero si desean hacernos un presente...
      </p>

      <div className="bg-[#A63F24] p-8 text-[#F2E8DF] rounded-none mb-10 shadow-xl border-4 border-[#2C1810]">
        <h4 className="font-retro-serif text-lg mb-4 uppercase tracking-[0.2em]">Cuentas Bancarias</h4>
        <div className="space-y-6">
          <div>
            <p className="text-[10px] uppercase font-bold opacity-60 mb-1">CBU / CVU</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-retro-serif text-sm tracking-widest">{gifts.cbu}</span>
              <button onClick={() => copyToClipboard(gifts.cbu, 'cbu')} className="p-2 bg-[#F2E8DF]/10 hover:bg-[#F2E8DF]/20 rounded transition-colors">
                {copied === 'cbu' ? 'Copiado!' : <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/></svg>}
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Alias</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-retro-serif text-sm tracking-widest uppercase italic">{gifts.alias}</span>
              <button onClick={() => copyToClipboard(gifts.alias, 'alias')} className="p-2 bg-[#F2E8DF]/10 hover:bg-[#F2E8DF]/20 rounded transition-colors">
                {copied === 'alias' ? 'Copiado!' : <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/></svg>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {gifts.mercadoLibreLink && (
        <a href={gifts.mercadoLibreLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-[#FFE600] text-[#2D3277] font-bold px-8 py-4 rounded-none border-2 border-[#2C1810] shadow-[4px_4px_0px_0px_rgba(44,24,16,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          <svg width="24" height="24" viewBox="0 0 48 48"><path fill="#2d3277" d="M12 24c0-6.6 5.4-12 12-12s12 5.4 12 12s-5.4 12-12 12s-12-5.4-12-12m12 16c8.8 0 16-7.2 16-16s-7.2-16-16-16S8 15.2 8 24s7.2 16 16 16"/></svg>
          Lista Mercado Libre
        </a>
      )}
    </div>
  );
};

export const SpotifyEmbed: React.FC<{ playlistId: string }> = ({ playlistId }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl bg-[#000]">
      <iframe
        style={{ borderRadius: '12px' }}
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export const RSVPForm: React.FC<{ whatsapp: string }> = ({ whatsapp }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#A63F24] text-[#F2E8DF] p-10 text-center rounded-none border-4 border-[#2C1810]">
        <h3 className="font-retro-serif text-3xl mb-4 uppercase italic tracking-widest">¡Gracias!</h3>
        <p className="font-classic-serif text-xl">Tu confirmación ha sido enviada. ¡Nos vemos pronto!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border-2 border-[#2C1810] shadow-[12px_12px_0px_0px_rgba(166,63,36,0.1)]">
        <div>
          <label className="block text-[10px] uppercase font-bold mb-3 tracking-[0.3em]">Nombre de Invitados</label>
          <input required type="text" className="w-full border-b-2 border-[#2C1810] py-3 focus:outline-none focus:border-[#A63F24] font-classic-serif text-xl" placeholder="Ej: Juan Pérez y Familia" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3 tracking-[0.3em]">¿Asistirán?</label>
            <select className="w-full border-b-2 border-[#2C1810] py-3 focus:outline-none bg-transparent font-classic-serif text-lg">
              <option>Sí, ¡con gusto!</option>
              <option>No podemos asistir</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold mb-3 tracking-[0.3em]">Cantidad</label>
            <input type="number" min="1" defaultValue="1" className="w-full border-b-2 border-[#2C1810] py-3 focus:outline-none bg-transparent font-classic-serif text-lg text-center" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold mb-3 tracking-[0.3em]">Restricciones alimentarias</label>
          <textarea rows={2} className="w-full border-b-2 border-[#2C1810] py-3 focus:outline-none focus:border-[#A63F24] font-classic-serif text-xl resize-none" placeholder="Celíacos, veganos, etc..." />
        </div>

        <button type="submit" className="w-full bg-[#A63F24] text-white py-5 font-retro-serif text-xl tracking-[0.2em] uppercase hover:bg-[#2C1810] transition-colors shadow-lg">
          Enviar Confirmación
        </button>
      </form>
    </div>
  );
};