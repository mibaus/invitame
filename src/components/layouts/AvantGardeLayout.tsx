'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { X, Copy, Check, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { DietaryRestrictionsDropdown } from '@/components/shared/DietaryRestrictionsDropdown';
import { submitRSVP } from '@/app/actions/rsvp';
import { parseDateLocal } from '@/lib/utils';

interface AvantGardeLayoutProps {
    invitation: InvitationSchema;
    preview?: boolean;
    previewMobile?: boolean;
}

// Empty state component for preview mode
function EmptyStatePreview({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="py-16 px-6 text-center bg-white border-y border-black/10">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-bold mb-2 text-black font-mono-tech uppercase">{title}</h3>
            <p className="text-sm text-black/60 font-mono-tech uppercase">{description}</p>
        </div>
    );
}

// Hero Section - Estilo editorial avant-garde
function HeroSection({ content, logistics, previewMobile }: { content: InvitationSchema['content']; logistics: InvitationSchema['logistics']; previewMobile?: boolean }) {
    const eventDate = parseDateLocal(logistics.event_date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
    const year = eventDate.getFullYear();
    const person1Name = content.couple?.person1.name || 'VALENTINA';
    const person2Name = content.couple?.person2.name || 'MATEO';
    const headline = content.headline || 'NUESTRA BODA';
    const city = logistics.venues[0]?.city || 'BUENOS AIRES';
    const country = logistics.venues[0]?.country || 'ARGENTINA';
    const coverImage = content.cover_image || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&h=1800&auto=format&fit=crop';

    return (
        <section className="relative min-h-screen bg-white overflow-hidden">
            {/* Desktop Layout - Editorial Grid - hidden when previewMobile */}
            <div className={`${previewMobile ? 'hidden' : 'hidden lg:grid'} lg:grid-cols-12 lg:min-h-screen`}>
                {/* Left Column - Image */}
                <motion.div 
                    className="lg:col-span-7 relative bg-neutral-100"
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    animate={{ clipPath: 'inset(0 0% 0 0)' }}
                    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                >
                    <img 
                        src={coverImage}
                        alt="Alta Costura Nupcial" 
                        className="w-full h-full object-cover grayscale brightness-95"
                    />
                    {/* Overlay Tag */}
                    <div className="absolute top-8 left-8">
                        <div className="font-mono text-[10px] tracking-widest bg-red-600 text-white px-4 py-2 uppercase font-bold">
                            INVITACIÓN ESPECIAL
                        </div>
                    </div>
                    {/* Editorial Mark */}
                    <div className="absolute bottom-8 left-8">
                        <div className="font-mono text-[10px] tracking-[0.3em] text-white/80 uppercase">
                            {person1Name} & {person2Name}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Content */}
                <div className="lg:col-span-5 relative bg-white flex flex-col justify-between p-12">
                    {/* Top Section - Names Watermark */}
                    <div className="overflow-hidden">
                        <motion.div 
                            className="font-black text-[8vw] leading-none text-black/[0.03] uppercase whitespace-nowrap"
                            initial={{ x: '20%' }}
                            animate={{ x: '-20%' }}
                            transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
                        >
                            {person1Name} & {person2Name} — {person1Name} & {person2Name} —
                        </motion.div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col justify-center relative">
                        {/* Decorative Line */}
                        <motion.div 
                            className="absolute left-0 top-1/2 w-[2px] h-40 bg-red-600 -translate-y-1/2"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        />

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="pl-8"
                        >
                            <h1 className="text-5xl xl:text-6xl font-black leading-[0.85] tracking-tighter uppercase">
                                {headline.split(' ').map((word, i) => (
                                    <span key={i} className={i === headline.split(' ').length - 1 ? 'block text-red-600' : 'block'}>
                                        {word}
                                    </span>
                                ))}
                            </h1>
                        </motion.div>

                        {/* Location */}
                        <motion.div 
                            className="pl-8 mt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-[1px] bg-black/30"></div>
                                <span className="font-mono text-xs tracking-[0.3em] text-black/50 uppercase">
                                    {city}, {country}
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Section - Date & Names */}
                    <div className="flex items-end justify-between">
                        {/* Date Block */}
                        <motion.div 
                            className="flex items-start gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                        >
                            <div className="text-right">
                                <div className="font-mono text-[10px] tracking-widest text-red-600 uppercase font-bold">{month}</div>
                                <div className="text-5xl font-black leading-none tracking-tighter">{day}</div>
                                <div className="font-mono text-xs tracking-widest text-black/40">{year}</div>
                            </div>
                            <div className="w-[2px] h-16 bg-red-600"></div>
                        </motion.div>

                        {/* Names */}
                        <motion.div 
                            className="text-right"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                        >
                            <div className="font-mono text-xs tracking-[0.2em] text-black/60 uppercase leading-relaxed">
                                <span className="block">{person1Name}</span>
                                <span className="block text-red-600">&</span>
                                <span className="block">{person2Name}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Layout - shown when previewMobile OR on mobile */}
            <div className={`${previewMobile ? 'flex' : 'lg:hidden flex'} relative min-h-screen flex-col justify-end pt-0 p-6 md:p-12`}>
                {/* Texto en capas de fondo */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
                    <motion.h1 
                        className="text-[20vw] lg:text-[15vw] font-black leading-none select-none text-black/[0.03] whitespace-nowrap"
                        initial={{ x: '10%' }}
                        animate={{ x: '-10%' }}
                        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                    >
                        {person1Name} & {person2Name}
                    </motion.h1>
                </div>

                {/* Revelado de imagen principal */}
                <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[50%] h-[65vh] z-10"
                    initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                    transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
                >
                    <img 
                        src={coverImage}
                        alt="Alta Costura Nupcial" 
                        className="w-full h-full object-cover grayscale brightness-90 transition-all duration-700 hover:grayscale-0"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 text-white z-20">
                        <div className="flex justify-between items-start">
                            <div className="font-mono text-[10px] tracking-widest bg-red-600 px-3 py-1 uppercase font-bold">INVITACIÓN ESPECIAL</div>
                        </div>
                    </div>
                </motion.div>

                {/* Contenido en primer plano */}
                <div className="relative z-30 flex flex-col md:flex-row items-end justify-between w-full">
                    <div className="w-full md:w-2/3">
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-black leading-[0.8] tracking-tighter uppercase">
                                {headline.split(' ').map((word, i) => (
                                    <span key={i} className={i === headline.split(' ').length - 1 ? 'text-red-600' : ''}>
                                        {word}{' '}
                                    </span>
                                ))}
                            </h1>
                        </motion.div>
                    </div>

                    <div className="flex flex-col items-end mt-8 md:mt-0">
                        <div className="font-mono text-sm mb-6 border-r-4 border-red-600 pr-4 text-right text-black uppercase leading-tight font-bold">
                            {day} {month} {year}<br/>
                            {person1Name}<br/>
                            & {person2Name}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Countdown Marquee Section
function CountdownMarquee({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const targetDate = parseDateLocal(logistics.event_date).getTime();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = targetDate - now;
            
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const timeString = `${timeLeft.days}D ${timeLeft.hours}H ${timeLeft.minutes}M ${timeLeft.seconds}S`.toUpperCase();

    return (
        <div className="bg-black py-10 overflow-hidden whitespace-nowrap border-y border-white/10">
            <motion.div 
                className="flex gap-20 items-center"
                animate={{ x: [0, -1000] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex gap-20 items-center">
                        <span className="text-red-600 font-mono text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter">
                            {timeString}
                        </span>
                        <span className="text-white/40 font-black italic text-2xl md:text-3xl lg:text-4xl uppercase">
                            PARA EL SÍ, QUIERO
                        </span>
                        <div className="w-3 h-3 bg-red-600 rotate-45" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

// Quote Manifesto Section
function QuoteManifesto({ content }: { content: InvitationSchema['content'] }) {
    const quoteText = content.quote?.text || content.couple?.love_story || 'El amor es el único lujo que nunca pasa de moda.';
    
    // Función para encontrar palabra clave a resaltar
    const findHighlightWord = (text: string): { index: number; word: string } | null => {
        const keywords = ['amor', 'vida', 'sueño', 'pasión', 'destino', 'eternidad', 'felicidad', 'corazón', 'alma', 'siempre'];
        const words = text.toLowerCase().split(' ');
        
        // Buscar primera palabra clave
        for (const keyword of keywords) {
            const index = words.findIndex(w => w.includes(keyword));
            if (index !== -1) {
                return { index, word: text.split(' ')[index] };
            }
        }
        
        // Si no hay palabra clave, usar la del medio
        if (words.length > 2) {
            const middleIndex = Math.floor(words.length / 2);
            return { index: middleIndex, word: text.split(' ')[middleIndex] };
        }
        
        return null;
    };
    
    const highlight = findHighlightWord(quoteText);
    const words = quoteText.split(' ');
    
    // Construir el texto formateado
    let formattedText;
    if (highlight && words.length > 3) {
        const beforeHighlight = words.slice(0, highlight.index).join(' ');
        const highlightWord = words[highlight.index];
        const afterHighlight = words.slice(highlight.index + 1).join(' ');
        
        formattedText = (
            <>
                {beforeHighlight} <span className="italic text-red-600">{highlightWord}</span> {afterHighlight}
            </>
        );
    } else {
        // Para textos cortos, mostrar todo en negro
        formattedText = quoteText;
    }
    
    return (
        <section className="relative bg-white py-16 md:py-20 lg:py-24 px-6 flex items-center justify-center overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/[0.03] text-[40vw] lg:text-[30vw] font-black pointer-events-none leading-none select-none">
                "
            </div>
            
            <div className="max-w-4xl lg:max-w-5xl mx-auto text-center z-10 px-4">
                <motion.h2 
                    className="text-2xl md:text-3xl lg:text-4xl font-black leading-[1.2] tracking-[-0.01em] text-black uppercase"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {formattedText}
                </motion.h2>
                
                {content.quote?.author && (
                    <motion.div 
                        className="mt-8 lg:mt-10 font-mono text-xs tracking-[0.3em] text-black/50 uppercase"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        — {content.quote.author}
                    </motion.div>
                )}
            </div>

            <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-full text-black/[0.03] text-[40vw] lg:text-[30vw] font-black pointer-events-none leading-none select-none">
                "
            </div>
        </section>
    );
}

// Technical Timeline Section
function TechnicalTimeline({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const schedule = logistics.agenda.length > 0
        ? logistics.agenda.map(item => ({
            time: item.time,
            event: item.title.toUpperCase(),
            detail: (item.description || '').toUpperCase()
        }))
        : [
            { time: '18:30', event: 'EL RECIBIMIENTO', detail: 'CÓCTEL DE BIENVENIDA Y RECEPCIÓN' },
            { time: '19:30', event: 'LOS VOTOS', detail: 'CEREMONIA BAJO EL ARCO GEOMÉTRICO' },
            { time: '21:00', event: 'EL BANQUETE', detail: 'EXPERIENCIA GASTRONÓMICA DE VANGUARDIA' },
            { time: '23:30', event: 'LA FIESTA', detail: 'RITMOS DE MEDIANOCHE Y CELEBRACIÓN' },
            { time: '04:00', event: 'EL CIERRE', detail: 'CRÉDITOS FINALES' },
        ];

    return (
        <section className="bg-white px-6 md:px-12 lg:px-16 py-16 md:py-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 lg:mb-10 border-b-4 border-black pb-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter text-black uppercase">CRONOGRAMA</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 border-t-2 border-black">
                {schedule.map((item, idx) => (
                    <motion.div 
                        key={idx}
                        className="flex flex-col md:flex-row group border-b-2 border-black items-center overflow-hidden"
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="w-full md:w-36 lg:w-40 bg-black text-white py-8 lg:py-10 px-6 flex items-center justify-center font-mono text-3xl lg:text-4xl font-bold transition-colors group-hover:bg-red-600">
                            {item.time}
                        </div>
                        <div className="flex-1 px-6 lg:px-8 py-8 lg:py-10 flex flex-col justify-center items-start md:items-start text-center md:text-left w-full">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 tracking-tight group-hover:translate-x-4 transition-transform duration-500 text-black uppercase">
                                {item.event}
                            </h3>
                            <p className="font-mono text-[10px] lg:text-xs tracking-[0.2em] text-black/60 uppercase">
                                {item.detail}
                            </p>
                        </div>
                        <div className="hidden md:flex w-20 h-full items-center justify-center border-l-2 border-black bg-white group-hover:bg-black transition-colors">
                            <div className="w-4 h-4 rounded-full border-2 border-black group-hover:bg-red-600 group-hover:border-red-600 transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// Venues Section
function VenuesSection({ logistics, content }: { logistics: InvitationSchema['logistics']; content: InvitationSchema['content'] }) {
    const generateCalendarLink = (venue: any, eventDate: string) => {
        const eventTitle = encodeURIComponent(`${content.headline || content.couple?.person1.name + ' & ' + content.couple?.person2.name} - ${venue.title}`);
        const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
        const details = encodeURIComponent(`Te esperamos para celebrar con nosotros.`);
        let baseDate = new Date(eventDate);
        if (isNaN(baseDate.getTime())) baseDate = new Date();
        const [hours, minutes] = venue.time ? venue.time.split(':') : ['18', '00'];
        baseDate.setHours(parseInt(hours), parseInt(minutes));
        const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0];
        const endDate = new Date(baseDate);
        endDate.setHours(endDate.getHours() + 1);
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDate(baseDate)}/${formatDate(endDate)}&details=${details}&location=${location}`;
    };

    const venues = logistics.venues.length > 0
        ? logistics.venues.slice(0, 2).map((venue, idx) => {
            const hasCoordinates = venue.coordinates && typeof venue.coordinates.lat === 'number' && typeof venue.coordinates.lng === 'number';
            const lat = venue.coordinates?.lat;
            const lng = venue.coordinates?.lng;

            return {
                title: venue.type === 'ceremony' ? 'LA CEREMONIA' : 'LA GALA',
                name: venue.name.toUpperCase(),
                address: `${venue.address}, ${venue.city}`.toUpperCase(),
                time: logistics.agenda?.[idx]?.time || '18:00',
                mapsLink: venue.google_maps_url || (hasCoordinates ? `https://maps.google.com/?q=${lat},${lng}` : `https://maps.google.com/?q=${encodeURIComponent(venue.address + ', ' + venue.city)}`),
                calendarLink: generateCalendarLink({ title: venue.type === 'ceremony' ? 'LA CEREMONIA' : 'LA GALA', name: venue.name, address: `${venue.address}, ${venue.city}`, time: logistics.agenda?.[idx]?.time || '18:00' }, logistics.event_date),
                isEven: idx % 2 === 0
            };
        })
        : [
            {
                title: 'LA CEREMONIA',
                name: 'SANTA MARIA DEL AVANT',
                address: 'CALLE DE LA MODA 1234, CABA.',
                time: '17:00',
                mapsLink: 'https://maps.google.com/?q=Palermo,Buenos+Aires',
                calendarLink: generateCalendarLink({ title: 'LA CEREMONIA', name: 'SANTA MARIA DEL AVANT', address: 'CALLE DE LA MODA 1234, CABA.', time: '17:00' }, logistics.event_date),
                isEven: true
            },
            {
                title: 'LA GALA',
                name: 'THE WAREHOUSE STUDIO',
                address: 'AVENIDA INDUSTRIAL 567, PUERTO MADERO.',
                time: '19:30',
                mapsLink: 'https://maps.google.com/?q=Puerto+Madero,Buenos+Aires',
                calendarLink: generateCalendarLink({ title: 'LA GALA', name: 'THE WAREHOUSE STUDIO', address: 'AVENIDA INDUSTRIAL 567, PUERTO MADERO.', time: '19:30' }, logistics.event_date),
                isEven: false
            }
        ];

    const hasSingleVenue = venues.length === 1;

    return (
        <section className="bg-black text-white py-16 md:py-24 px-6 md:px-12 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header editorial */}
                <motion.div 
                    className="mb-12 md:mb-16 flex items-end justify-between border-b-4 border-white pb-4"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div>
                        <div className="font-mono text-[10px] tracking-[0.3em] text-red-600 uppercase font-bold mb-2">
                            Direcciones
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase">
                            UBICACIONES
                        </h2>
                    </div>
                    <div className="hidden md:block font-mono text-xs text-white/40 uppercase">
                        {venues.length === 1 ? '01' : '02'} Lugares
                    </div>
                </motion.div>

                <div className={`grid grid-cols-1 ${hasSingleVenue ? 'lg:grid-cols-1 lg:max-w-3xl lg:mx-auto' : 'lg:grid-cols-2'} gap-8 lg:gap-16`}>
                    {venues.map((venue, index) => (
                        <motion.div 
                            key={index}
                            className={`relative ${index === 1 ? 'lg:mt-16' : ''}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                        >
                            {/* Card constructivista sin imagen */}
                            <div className={`relative p-8 md:p-10 border-4 ${venue.isEven ? 'bg-white text-black border-white' : 'bg-red-600 text-white border-red-600'} shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)]`}>
                                {/* Número de lugar grande como decoración */}
                                <div className={`absolute -top-6 ${venue.isEven ? '-left-2' : '-right-2'} text-7xl md:text-8xl font-black opacity-20 select-none`}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                {/* Label */}
                                <div className={`font-mono text-[10px] tracking-[0.3em] mb-4 uppercase font-bold ${venue.isEven ? 'text-red-600' : 'text-black'}`}>
                                    Lugar {venue.isEven ? 'A' : 'B'}: {venue.title}
                                </div>

                                {/* Nombre del lugar */}
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 leading-none uppercase tracking-tight">
                                    {venue.name}
                                </h3>

                                {/* Divider */}
                                <div className={`w-16 h-1 mb-6 ${venue.isEven ? 'bg-black' : 'bg-white'}`} />

                                {/* Dirección */}
                                <p className="font-mono text-xs md:text-sm leading-relaxed mb-2 opacity-90 uppercase">
                                    {venue.address}
                                </p>

                                {/* Horario */}
                                <p className="font-mono text-[10px] tracking-widest mb-8 opacity-70 uppercase">
                                    {venue.time} HS
                                </p>

                                {/* Botones de acción */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a 
                                        href={venue.mapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex-1 inline-flex items-center justify-center gap-3 font-mono text-[11px] py-3 px-6 uppercase tracking-[0.2em] font-bold transition-all border-2 ${
                                            venue.isEven 
                                                ? 'bg-black text-white border-black hover:bg-transparent hover:text-black' 
                                                : 'bg-white text-red-600 border-white hover:bg-transparent hover:text-white'
                                        }`}
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Ver en Maps
                                    </a>
                                    <a 
                                        href={venue.calendarLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center justify-center gap-3 font-mono text-[11px] py-3 px-6 uppercase tracking-[0.2em] font-bold transition-all border-2 ${
                                            venue.isEven 
                                                ? 'bg-white text-black border-black hover:bg-black hover:text-white' 
                                                : 'bg-black text-white border-white hover:bg-white hover:text-red-600'
                                        }`}
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Agendar
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Dress Code Section
function DressCode({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const dressCodeText = logistics.dress_code?.code === 'formal' ? 'FORMAL ELEGANTE' :
        logistics.dress_code?.code === 'black-tie' ? 'BLACK TIE' :
            logistics.dress_code?.code === 'cocktail' ? 'COCKTAIL' : 
                logistics.dress_code?.code === 'semi-formal' ? 'SEMI FORMAL' :
                    logistics.dress_code?.code === 'casual-elegante' ? 'CASUAL ELEGANTE' :
                        logistics.dress_code?.code === 'themed' ? 'TEMÁTICA ESPECIAL' :
                            logistics.dress_code?.description?.toUpperCase() || 'FORMAL ELEGANTE';

    return (
        <section className="bg-white py-16 md:py-20 px-6 md:px-12 border-t border-black/5">
            <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
                <motion.h2 
                    className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-black uppercase leading-[0.85]"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    CÓDIGO <br/><span className="text-red-600">DE GALA</span>
                </motion.h2>
                
                <motion.div 
                    className="font-mono text-xs tracking-[0.2em] uppercase text-black border-t-2 border-b-2 border-black py-3 px-6 mt-4 font-bold"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    ETIQUETA: {dressCodeText}
                </motion.div>
            </div>
        </section>
    );
}

// Gallery Lookbook Section
function GalleryLookbook({ content }: { content: InvitationSchema['content'] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    const photos = content.gallery_images?.length
        ? content.gallery_images
        : [
            "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&h=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1519225495810-7512312635db?q=80&w=1200&h=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&h=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=1200&h=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&h=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1465495910483-db4452178c1f?q=80&w=1200&h=800&auto=format&fit=crop",
        ];

    // Duplicar fotos para scroll infinito
    const allPhotos = [...photos, ...photos];

    return (
        <section className="bg-black py-16 md:py-20 overflow-hidden">
            <div className="px-6 md:px-12 mb-8 lg:mb-10 flex justify-between items-end">
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter uppercase">PORTAFOLIO</h2>
                <div className="font-mono text-[10px] text-red-600 font-bold tracking-[0.4em] hidden md:block uppercase">
                    GALLERY_SPREAD_FINAL.PDF
                </div>
            </div>
            
            <div className="relative px-6 md:px-12 overflow-hidden">
                <motion.div 
                    ref={containerRef}
                    animate={{ x: [0, -50 * photos.length * 8] }}
                    transition={{ 
                        duration: 80, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatType: "loop"
                    }}
                    className="flex gap-6 lg:gap-8 items-start whitespace-nowrap"
                >
                    {allPhotos.map((src, idx) => (
                        <motion.div 
                            key={idx}
                            className={`gallery-item relative flex-shrink-0 overflow-hidden select-none ${idx % 2 === 0 ? 'w-[70vw] md:w-[40vw] lg:w-[30vw] aspect-[4/3]' : 'w-[50vw] md:w-[28vw] lg:w-[22vw] aspect-[3/4] mt-8 md:mt-12'}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: (idx % photos.length) * 0.1, duration: 0.8 }}
                        >
                            <img 
                                src={src} 
                                alt={`Imagen ${(idx % photos.length) + 1}`} 
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 pointer-events-none" 
                            />
                            <div className="absolute bottom-4 left-4 bg-white text-black font-mono text-[10px] px-3 py-1 uppercase font-bold">
                                SHOT_ID: 0{(idx % photos.length) + 1}
                            </div>
                        </motion.div>
                    ))}
                    <div className="flex-shrink-0 w-24 h-1"></div>
                </motion.div>
            </div>
            
            <div className="mt-12 md:mt-16 px-6 md:px-12 flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-white/10"></div>
                <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>
        </section>
    );
}

// Luxury Registry Section
function LuxuryRegistry({ features }: { features: InvitationSchema['features'] }) {
    const [copied, setCopied] = useState(false);
    const alias = features.gift_registry?.bank_details?.alias || 'VALENTINA.MATEO.BODA';
    const externalRegistry = features.gift_registry?.registries?.[0];

    const handleCopy = () => {
        navigator.clipboard.writeText(alias);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="bg-white py-16 md:py-20 px-6 md:px-12">
            <div className="max-w-3xl mx-auto border border-black/10 p-6 md:p-10 lg:p-12 relative overflow-hidden text-black">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/[0.02] text-[20vw] font-mono -rotate-12 pointer-events-none select-none uppercase">
                    RECIBO ORIGINAL
                </div>

                <div className="mb-10 lg:mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-4 uppercase">LISTA DE REGALOS</h2>
                </div>

                <div className="border-y-2 border-black py-6 lg:py-8 mb-10 lg:mb-12">
                    <p className="font-sans text-sm text-black/70 mb-6 lg:mb-8 leading-relaxed max-w-xl">
                        {features.gift_registry?.message || 'Su presencia es el mejor regalo. Sin embargo, si desea contribuir a nuestra nueva aventura, hemos habilitado esta "factura de amor" para facilitar su gesto.'}
                    </p>

                    <div className="bg-neutral-50 p-5 lg:p-6 border-l-8 border-red-600 flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-6">
                        <div>
                            <div className="font-mono text-[10px] tracking-widest text-black/40 mb-1 uppercase">ALIAS</div>
                            <div className="font-mono text-xl lg:text-2xl font-bold tracking-tighter uppercase">{alias}</div>
                        </div>
                        <button 
                            onClick={handleCopy}
                            className={`px-6 lg:px-8 py-3 lg:py-4 font-mono text-xs font-bold transition-all ${copied ? 'bg-black text-white' : 'bg-red-600 text-white hover:bg-black'}`}
                        >
                            {copied ? 'COPIADO' : 'COPIAR ALIAS'}
                        </button>
                    </div>

                    {externalRegistry && (
                        <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t-2 border-black/10">
                            <div className="font-mono text-[10px] tracking-widest text-black/40 mb-3 lg:mb-4 uppercase">TAMBIÉN EN</div>
                            <a 
                                href={externalRegistry.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 bg-black text-white px-6 lg:px-8 py-3 lg:py-4 font-mono text-sm font-bold uppercase hover:bg-red-600 transition-colors"
                            >
                                <span>VER LISTA EN {externalRegistry.platform.toUpperCase()}</span>
                                <span>→</span>
                            </a>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-end">
                    <div className="w-24 lg:w-32 h-10 lg:h-12 bg-black flex items-center justify-center">
                        <div className="w-full h-[2px] bg-white mx-2" />
                        <div className="w-full h-[2px] bg-white mx-2" />
                    </div>
                    <div className="font-mono text-[10px] text-black/20 text-right uppercase leading-tight">
                        GRACIAS POR SER PARTE DE <br/> LA DIRECCIÓN CREATIVA DE NUESTRA VIDA.
                    </div>
                </div>
            </div>
        </section>
    );
}

// Music Suggestion Field - Componente para integrar en el formulario RSVP
function MusicSuggestionField({ onSongAdd }: { onSongAdd?: (song: string) => void }) {
    const [song, setSong] = useState('');
    const [songsList, setSongsList] = useState<string[]>([]);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!song.trim()) return;
        
        setSongsList([...songsList, song]);
        onSongAdd?.(song);
        setSong('');
        setShowForm(false);
    };

    return (
        <div className="w-full">
            {/* Suggested Songs List */}
            {songsList.length > 0 && (
                <motion.div
                    className="mb-6 border-l-4 border-black pl-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="font-mono text-[10px] tracking-widest text-black uppercase font-bold mb-2">
                        CANCIONES SUGERIDAS
                    </div>
                    <ul className="space-y-2">
                        {songsList.map((s, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                                <span className="font-mono text-xs text-black font-bold">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <span className="font-mono text-sm text-white/90 uppercase">
                                    {s}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Add Song Button / Form */}
            {!showForm ? (
                <motion.button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="w-full group flex items-center justify-center gap-4 border-2 border-black p-4 hover:border-white hover:bg-black transition-all"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-lg group-hover:bg-white group-hover:text-black transition-colors">
                        +
                    </div>
                    <div className="text-left">
                        <div className="font-mono text-[10px] tracking-widest text-black/60 uppercase font-bold">
                            SUGERIR CANCIÓN
                        </div>
                        <div className="font-black text-lg uppercase text-white">
                            ¿Qué no puede faltar?
                        </div>
                    </div>
                </motion.button>
            ) : (
                <motion.div
                    className="border-2 border-black bg-black/20 p-5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="font-mono text-[10px] tracking-widest text-red-600 uppercase font-bold mb-3">
                        AGREGAR CANCIÓN
                    </div>
                    <input
                        type="text"
                        value={song}
                        onChange={(e) => setSong(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && song.trim()) {
                                e.preventDefault();
                                handleSubmit(e as unknown as React.FormEvent);
                            }
                        }}
                        placeholder="ARTISTA - TÍTULO"
                        className="w-full bg-transparent border-b-2 border-white/30 py-3 font-mono text-lg uppercase placeholder:text-white/30 focus:outline-none focus:border-red-600 mb-4"
                        autoFocus
                    />
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!song.trim()}
                            className="flex-1 bg-white text-red-600 font-black py-3 uppercase tracking-tight hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                        >
                            AGREGAR
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 border border-white/20 font-mono text-xs uppercase text-white hover:border-white transition-colors"
                        >
                            CANCELAR
                        </button>
                    </div>
                </motion.div>
            )}
            
            <p className="font-mono text-[10px] tracking-widest text-white/50 uppercase mt-4 text-center">
                ¿Qué canción no puede faltar en nuestra fiesta? Sugiere ese tema especial.
            </p>
        </div>
    );
}

// RSVP Section
function RSVPSection({ features, content, metadata }: { features: InvitationSchema['features']; content: InvitationSchema['content']; metadata: InvitationSchema['metadata'] }) {
    const [formData, setFormData] = useState({ name: '', attendance: 'YES', message: '', email: '', phone: '', guests: 1, dietary: [] as string[] });
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
            const result = await submitRSVP({
                invitationId: metadata.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                attendance: formData.attendance === 'YES',
                guestsCount: formData.guests,
                dietaryRestrictions: formData.dietary.join(', '),
                message: '',
                customAnswers: customAnswers
            });

            if (result.success) {
                setSuccess(true);
                setFormData({ name: '', attendance: 'YES', message: '', email: '', phone: '', guests: 1, dietary: [] });
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

    // Obtener preguntas personalizadas desde features.rsvp
    const customQuestions = features.rsvp?.custom_questions || [];

    if (success) {
        return (
            <section className="bg-red-600 text-white py-16 md:py-20 px-6 md:px-12 flex flex-col items-center justify-center">
                <motion.div 
                    className="max-w-4xl w-full text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="text-6xl lg:text-7xl mb-6">✓</div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 uppercase">CONFIRMACIÓN ENVIADA</h2>
                    <p className="font-mono text-sm tracking-[0.2em] uppercase">Gracias por ser parte de nuestra historia</p>
                </motion.div>
            </section>
        );
    }

    return (
        <section id="rsvp-section" className="bg-red-600 text-white py-16 md:py-20 px-6 md:px-12 flex flex-col items-center justify-center">
            <motion.div 
                className="max-w-4xl w-full text-center mb-10 lg:mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 uppercase">CONFIRMAR</h2>
                <div className="font-mono text-xs tracking-[0.4em] uppercase text-black font-bold">SUSCRIPCIÓN AL EVENTO</div>
            </motion.div>

            <form className="max-w-xl lg:max-w-2xl w-full grid grid-cols-1 gap-5 lg:gap-6" onSubmit={handleSubmit}>
                <div className="relative">
                    <label className="font-mono text-[10px] tracking-widest uppercase mb-2 block text-black font-bold">NOMBRE COMPLETO</label>
                    <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="ESCRIBE TU NOMBRE AQUÍ"
                        className="w-full bg-transparent border-b-4 border-black p-3 lg:p-4 font-black text-2xl md:text-3xl lg:text-4xl placeholder:text-white/30 focus:outline-none focus:border-white transition-colors uppercase"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, attendance: 'YES'})}
                        className={`py-3 lg:py-4 font-mono text-sm font-bold transition-all border-2 border-black uppercase ${formData.attendance === 'YES' ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-white'}`}
                    >
                        ASISTIRÉ
                    </button>
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, attendance: 'NO'})}
                        className={`py-3 lg:py-4 font-mono text-sm font-bold transition-all border-2 border-black uppercase ${formData.attendance === 'NO' ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-white'}`}
                    >
                        NO PODRÉ IR
                    </button>
                </div>

                {/* Preguntas que se ocultan si no asiste */}
                {formData.attendance === 'YES' && (
                    <>
                        <div className="relative">
                            <label className="font-mono text-[10px] tracking-widest uppercase mb-2 block text-white font-bold">RESTRICCIONES ALIMENTARIAS</label>
                            <div className="relative">
                                <DietaryRestrictionsDropdown
                                value={formData.dietary}
                                onChange={(value) => setFormData({...formData, dietary: value})}
                                options={[
                                    "Vegetariano",
                                    "Vegano", 
                                    "Sin gluten",
                                    "Diabético",
                                    "Sin lactosa",
                                    "Kosher",
                                    "Halal",
                                    "ALERGIAS"
                                ]}
                                placeholder="SELECCIONA RESTRICCIONES..."
                                allergyGroups={{
                                    "ALERGIAS": [
                                        "ALERGIA FRUTOS SECOS",
                                        "ALERGIA MARISCOS", 
                                        "ALERGIA LÁCTEOS",
                                        "ALERGIA HUEVO",
                                        "ALERGIA SOJA",
                                        "ALERGIA PESCADO",
                                        "ALERGIA MANÍ",
                                        "ALERGIA SÉSAMO"
                                    ]
                                }}
                                styles={{
                                    triggerClassName: "w-full bg-black/20 border-2 border-black p-3 lg:p-4 font-mono text-sm text-white placeholder:text-white/70 focus:outline-none focus:border-white focus:bg-black/40 transition-colors resize-none uppercase",
                                    dropdownClassName: "absolute z-50 w-full border-2 border-black bg-black/95 backdrop-blur-sm rounded-lg shadow-2xl mt-2",
                                    optionClassName: "px-4 py-3 font-mono text-xs text-white hover:bg-white/20 cursor-pointer transition-colors border-b border-white/10 last:border-b-0",
                                    tagClassName: "px-2 py-1 bg-white/20 text-white font-mono text-[10px] uppercase border border-white/30",
                                    inputClassName: "px-3 py-2 bg-black/80 border border-white/50 text-white font-mono text-xs placeholder:text-white/50"
                                }}
                                colors={{
                                    border: '#000000',
                                    text: '#FFFFFF',
                                    placeholder: '#FFFFFF70',
                                    background: '#00000033',
                                    hover: '#FFFFFF20',
                                    selected: '#FFFFFF30',
                                    tagBg: '#FFFFFF20',
                                    tagText: '#FFFFFF',
                                    buttonBg: '#FF0000',
                                    buttonHover: '#CC0000',
                                    buttonText: '#FFFFFF',
                                    checkColor: '#FFFFFF',
                                    checkBg: '#FF0000'
                                }}
                            />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="font-mono text-[10px] tracking-widest uppercase mb-2 block text-white font-bold">NOTAS ESPECIALES</label>
                            <textarea 
                                rows={3}
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                placeholder="DATOS ADICIONALES..."
                                className="w-full bg-black/20 border-2 border-black p-3 lg:p-4 font-mono text-sm text-white placeholder:text-white/70 focus:outline-none focus:border-white focus:bg-black/40 transition-colors resize-none uppercase"
                            />
                        </div>

                        {/* Preguntas Personalizadas */}
                        {customQuestions.length > 0 && (
                            <div className="space-y-6 pt-4 border-t-4 border-black">
                                <p className="font-mono text-[10px] tracking-widest uppercase mb-2 block text-black font-bold">PREGUNTAS ADICIONALES</p>
                                {customQuestions.map((question) => (
                                    <div key={question.id}>
                                        <label className="font-mono text-[10px] tracking-widest uppercase mb-2 block text-white font-bold">
                                            {question.question}
                                            {question.required && <span className="text-red-300 ml-1">*</span>}
                                        </label>
                                        {question.type === 'text' ? (
                                            <input
                                                type="text"
                                                required={question.required}
                                                value={customAnswers[question.id] || ''}
                                                onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                                                className="w-full bg-black/20 border-2 border-black p-3 lg:p-4 font-mono text-sm text-white placeholder:text-white/70 focus:outline-none focus:border-white focus:bg-black/40 transition-colors uppercase"
                                                placeholder="TU RESPUESTA..."
                                                disabled={loading}
                                            />
                                        ) : question.type === 'select' ? (
                                            <select
                                                required={question.required}
                                                value={customAnswers[question.id] || ''}
                                                onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                                                className="w-full bg-black/20 border-2 border-black p-3 lg:p-4 font-mono text-sm text-white focus:outline-none focus:border-white focus:bg-black/40 transition-colors cursor-pointer uppercase"
                                                disabled={loading}
                                            >
                                                <option value="" className="bg-red-800">SELECCIONAR OPCIÓN</option>
                                                {question.options?.map((opt) => (
                                                    <option key={opt} value={opt} className="bg-red-800 uppercase">{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <textarea
                                                required={question.required}
                                                value={customAnswers[question.id] || ''}
                                                onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                                                className="w-full bg-black/20 border-2 border-black p-3 lg:p-4 font-mono text-sm text-white placeholder:text-white/70 focus:outline-none focus:border-white focus:bg-black/40 transition-colors resize-none uppercase"
                                                rows={3}
                                                placeholder="TU RESPUESTA..."
                                                disabled={loading}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Música integrada en el formulario */}
                        {features.show_music && (
                            <div className="pt-6 border-t-4 border-black">
                                <div className="text-left mb-4">
                                    <div className="font-mono text-[10px] tracking-widest text-black uppercase font-bold mb-1">
                                        BANDA SONORA
                                    </div>
                                    <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight">
                                        LA MÚSICA
                                    </h3>
                                </div>
                                <MusicSuggestionField 
                                    onSongAdd={(song: string) => {
                                        // Almacenar la canción en customAnswers para enviar con el RSVP
                                        handleCustomAnswerChange('suggested_song', song);
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}

                {error && (
                    <div className="font-mono text-sm text-black bg-white p-4 border-4 border-black text-center">
                        {error}
                    </div>
                )}

                <motion.button 
                    whileHover={{ backgroundColor: '#000000', color: '#ffffff', scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full bg-white text-red-600 font-black text-xl lg:text-2xl py-5 lg:py-6 tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all uppercase disabled:opacity-50"
                >
                    {loading ? 'ENVIANDO...' : 'ENVIAR CONFIRMACIÓN'}
                </motion.button>

                <p className="text-center font-mono text-[10px] tracking-[0.2em] mt-4 lg:mt-6 text-white/80 uppercase">
                    FECHA LÍMITE: {features.rsvp?.deadline || '15 DE OCTUBRE, 2024'}
                </p>
            </form>
        </section>
    );
}

// Footer Credits
function FooterCredits({ content }: { content: InvitationSchema['content'] }) {
    const person1Name = content.couple?.person1.name || 'VALENTINA';
    const person2Name = content.couple?.person2.name || 'MATEO';

    return (
        <footer className="bg-white py-12 px-6 md:px-12 border-t border-black/10 text-black">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-2">
                    <h2 className="text-4xl font-black tracking-tighter mb-4 italic">{person1Name} & {person2Name}</h2>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-black/40 leading-relaxed uppercase">
                        ESTE EVENTO ES UNA PRODUCCIÓN PRIVADA. TODOS LOS DERECHOS RESERVADOS PARA EL COMIENZO DE NUESTRA FAMILIA. <br/>
                        COPYRIGHT © 2024 BUENOS AIRES, ARGENTINA.
                    </p>
                </div>
                
                <div className="flex flex-col gap-2">
                    <div className="font-mono text-[10px] font-bold text-red-600 tracking-widest uppercase">CRÉDITOS</div>
                    <div className="font-mono text-[10px] text-black uppercase">DIRECTOR: {person2Name}</div>
                    <div className="font-mono text-[10px] text-black uppercase">DIR. CREATIVA: {person1Name}</div>
                    <div className="font-mono text-[10px] text-black uppercase">PRODUCCIÓN: VOWS</div>
                </div>

                <div className="flex flex-col items-end justify-end">
                    <div className="w-12 h-12 bg-black flex items-center justify-center mb-4">
                        <div className="text-white font-mono text-[8px] font-bold rotate-90 tracking-widest uppercase">VOWS</div>
                    </div>
                    <div className="font-mono text-[8px] text-black/40 text-right uppercase">
                        EDICIÓN ESPECIAL — VARIANTE: VANGUARDIA <br/>
                        PLATAFORMA: REACT_LUXURY_EDITION
                    </div>
                </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity">
                <div className="font-mono text-[8px]">01010010 01001111 01000010 01001111 01010100 01010011</div>
                <div className="font-mono text-[8px] uppercase">MANTENTE TRENDY. MANTENTE ENAMORADO.</div>
            </div>
        </footer>
    );
}

// Floating RSVP Button
function FloatingRSVPButton({ features }: { features: InvitationSchema['features'] }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const heroHeight = window.innerHeight;
            const scrollY = window.scrollY;
            setIsVisible(scrollY > heroHeight * 0.8);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToRSVP = () => {
        const rsvpSection = document.getElementById('rsvp-section');
        if (rsvpSection) {
            rsvpSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!features.show_rsvp) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-6 right-6 z-[90] lg:bottom-8 lg:right-8"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                >
                    <motion.button
                        onClick={scrollToRSVP}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="group relative flex items-center gap-3 bg-black text-white px-5 py-4 lg:px-6 lg:py-5 shadow-[4px_4px_0px_0px_rgba(255,0,0,1)] border-2 border-black hover:shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Icon */}
                        <motion.div
                            animate={{ rotate: isHovered ? 360 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-red-600"
                        >
                            <Check className="w-5 h-5 lg:w-6 lg:h-6" />
                        </motion.div>

                        {/* Text */}
                        <div className="flex flex-col items-start">
                            <span className="font-mono text-[10px] tracking-widest text-red-600 uppercase font-bold leading-none">
                                RSVP
                            </span>
                            <span className="font-black text-sm lg:text-base tracking-tight uppercase leading-none">
                                Confirmar
                            </span>
                        </div>

                        {/* Hover indicator */}
                        <motion.div
                            className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full"
                            animate={{ scale: isHovered ? 1.2 : 1 }}
                            transition={{ duration: 0.2 }}
                        />
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Main Layout Component
export function AvantGardeLayout({ invitation, preview, previewMobile }: AvantGardeLayoutProps) {
    const { metadata, content, logistics, features } = invitation;
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white selection:bg-red-600 selection:text-white overflow-hidden">
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        key="loader"
                        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white p-8"
                        exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    >
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="font-mono text-xs mb-4 tracking-[0.3em] uppercase"
                        >
                            PREPARANDO EDICIÓN NUPCIAL
                        </motion.div>
                        <motion.div 
                            className="w-48 h-[2px] bg-white/20 overflow-hidden"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.2 }}
                        >
                            <motion.div 
                                className="w-full h-full bg-red-600 origin-left"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="relative lg:max-w-6xl xl:max-w-7xl lg:mx-auto">
                <HeroSection content={content} logistics={logistics} previewMobile={previewMobile} />
            </main>
                
            <FeatureGate 
                isVisible={features.show_countdown} 
                fallback={preview ? <EmptyStatePreview icon="⏱" title="CUENTA REGRESIVA" description="Se mostrará el countdown hasta el evento" /> : null}
            >
                <CountdownMarquee logistics={logistics} />
            </FeatureGate>

            <main className="relative lg:max-w-6xl xl:max-w-7xl lg:mx-auto">

                <FeatureGate 
                    isVisible={!!content.quote?.text || !!content.couple?.love_story}
                    fallback={preview ? <EmptyStatePreview icon="❝" title="MANIFIESTO" description="Se mostrará la cita o historia de amor" /> : null}
                >
                    <QuoteManifesto content={content} />
                </FeatureGate>

                <FeatureGate 
                    isVisible={features.show_agenda}
                    fallback={preview ? <EmptyStatePreview icon="📋" title="CRONOGRAMA" description="Se mostrará la agenda del evento" /> : null}
                >
                    <TechnicalTimeline logistics={logistics} />
                </FeatureGate>

                <FeatureGate 
                    isVisible={features.show_venue_map}
                    fallback={preview ? <EmptyStatePreview icon="📍" title="UBICACIONES" description="Se mostrarán los lugares del evento" /> : null}
                >
                    <VenuesSection logistics={logistics} content={content} />
                </FeatureGate>

                <FeatureGate 
                    isVisible={features.show_dress_code}
                    fallback={preview ? <EmptyStatePreview icon="👔" title="CÓDIGO DE VESTIMENTA" description="Se mostrará el dress code" /> : null}
                >
                    <DressCode logistics={logistics} />
                </FeatureGate>

                <FeatureGate 
                    isVisible={features.show_gallery}
                    data={content.gallery_images}
                    fallback={preview ? <EmptyStatePreview icon="📸" title="PORTAFOLIO" description="Se mostrará la galería de fotos" /> : null}
                >
                    <GalleryLookbook content={content} />
                </FeatureGate>

                <FeatureGate 
                    isVisible={features.show_gift_registry}
                    fallback={preview ? <EmptyStatePreview icon="🎁" title="LISTA DE REGALOS" description="Se mostrará la mesa de regalos" /> : null}
                >
                    <LuxuryRegistry features={features} />
                </FeatureGate>

                <FeatureGate 
                    isVisible={features.show_rsvp}
                    fallback={preview ? <EmptyStatePreview icon="✉️" title="CONFIRMAR ASISTENCIA" description="Se mostrará el formulario RSVP" /> : null}
                >
                    <RSVPSection features={features} content={content} metadata={metadata} />
                </FeatureGate>

                <FooterCredits content={content} />
            </main>

            {/* Floating RSVP Button */}
            <FloatingRSVPButton features={features} />
        </div>
    );
}
