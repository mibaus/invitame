'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Heart,
    Church,
    Wine,
    Music,
    Cake,
    MapPin,
    Calendar,
    X,
    Gift,
    Copy,
    Check,
    ExternalLink,
    Send,
    Plus,
    Loader2,
    Disc3,
} from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { createClient } from '@supabase/supabase-js';
import { submitRSVP } from '@/app/actions/rsvp';

interface RetroLoveLayoutProps {
    invitation: InvitationSchema;
    preview?: boolean;
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Empty state component
function EmptyStatePreview({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="py-16 px-6 text-center bg-rose-50 border-2 border-dashed border-rose-300">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-medium mb-2 text-rose-900 font-serif">{title}</h3>
            <p className="text-sm text-rose-600">{description}</p>
        </div>
    );
}

// HERO SECTION - Vintage Romance
function HeroSection({ content, logistics }: { content: InvitationSchema['content']; logistics: InvitationSchema['logistics'] }) {
    const scrollToContent = () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    };

    const eventDate = new Date(logistics.event_date);
    const day = eventDate.getDate().toString().padStart(2, '0');
    const month = eventDate.toLocaleDateString('es-ES', { month: 'long' });
    const year = eventDate.getFullYear();

    return (
        <section id="retro-hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-rose-50 to-amber-100">
            {/* Vintage paper texture overlay */}
            <div className="absolute inset-0 z-0 opacity-40"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'multiply'
                }}
            />
            
            {/* Soft vintage background image */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{
                        backgroundImage: `url(${content.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920'})`,
                        filter: 'sepia(0.4) contrast(0.9) saturate(0.8)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 via-rose-50/40 to-amber-100/60" />
            </div>
            
            {/* Decorative vintage border frame */}
            <div className="absolute inset-8 md:inset-16 z-10 border-2 border-rose-300/60 rounded-sm">
                <div className="absolute inset-2 border border-rose-200/40" />
                {/* Corner ornaments */}
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-rose-400" />
                <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-rose-400" />
                <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-rose-400" />
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-rose-400" />
            </div>

            <div className="relative z-20 text-center px-4 max-w-4xl">
                {/* Date badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="mb-8"
                >
                    <span className="inline-block px-6 py-2 bg-rose-100 border border-rose-300 text-rose-800 font-serif text-sm tracking-widest uppercase">
                        {day} de {month} de {year}
                    </span>
                </motion.div>

                {/* Couple names */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-rose-900 mb-4 tracking-wide">
                        {content.couple?.person1.name || 'Amanda'}
                    </h1>
                    <div className="flex items-center justify-center gap-4 my-6">
                        <span className="h-px w-16 bg-rose-400" />
                        <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                        <span className="h-px w-16 bg-rose-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-rose-900 tracking-wide">
                        {content.couple?.person2.name || 'Sebastián'}
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-8 text-rose-700 font-serif text-lg md:text-xl italic"
                >
                    Nuestra historia de amor continúa...
                </motion.p>

                {/* Location */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-6 flex items-center justify-center gap-2 text-rose-600 font-serif"
                >
                    <MapPin className="w-4 h-4" />
                    <span>{logistics.venues[0]?.city || 'Buenos Aires'}, Argentina</span>
                </motion.div>

                {/* Scroll indicator */}
                <motion.button
                    onClick={scrollToContent}
                    className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-12 h-12 rounded-full border-2 border-rose-400 flex items-center justify-center bg-white/50">
                        <ChevronDown className="w-5 h-5 text-rose-600" />
                    </div>
                </motion.button>
            </div>
        </section>
    );
}

// COUNTDOWN SECTION - Vintage Countdown
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
        <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-rose-50 border-2 border-rose-300 rounded-lg flex items-center justify-center mb-2 shadow-sm">
                <span className="text-3xl md:text-4xl font-serif text-rose-800">
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span className="text-rose-600 font-serif text-sm uppercase tracking-wider">{label}</span>
        </div>
    );

    return (
        <section className="relative py-20 px-4 bg-amber-50 overflow-hidden">
            {/* Paper texture */}
            <div className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto relative z-10 text-center"
            >
                <div className="mb-12">
                    <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-2">Falta poco para nuestro día</h2>
                    <p className="text-rose-600 font-serif italic">El momento más esperado de nuestras vidas</p>
                </div>

                <div className="flex justify-center gap-4 md:gap-8">
                    <TimeUnit value={timeLeft.days} label="Días" />
                    <TimeUnit value={timeLeft.hours} label="Horas" />
                    <TimeUnit value={timeLeft.minutes} label="Minutos" />
                    <TimeUnit value={timeLeft.seconds} label="Segundos" />
                </div>
            </motion.div>
        </section>
    );
}

// QUOTE SECTION - Love Quote
function QuoteSection({ content }: { content: InvitationSchema['content'] }) {
    const quoteText = content.quote?.text || content.couple?.love_story ||
        'El amor no se mira, se siente. Y aún más, cuando ella está junto a ti.';

    return (
        <section className="relative py-24 px-4 bg-rose-50 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto relative z-10 text-center"
            >
                {/* Decorative frame */}
                <div className="relative border-2 border-rose-200 p-8 md:p-12 bg-white/50">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-50 px-4">
                        <Heart className="w-6 h-6 text-rose-400" />
                    </div>
                    
                    <blockquote className="font-serif text-xl md:text-2xl text-rose-800 leading-relaxed italic">
                        "{quoteText}"
                    </blockquote>
                    
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <span className="h-px w-12 bg-rose-300" />
                        <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                        <span className="h-px w-12 bg-rose-300" />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

// TIMELINE SECTION - Vintage Timeline
function TimelineSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const events = logistics.agenda.length > 0
        ? logistics.agenda.map((item, idx) => ({
            time: item.time,
            icon: [Church, Wine, Cake, Music][idx % 4],
            title: item.title,
            description: item.description || ''
        }))
        : [
            { time: '18:00', icon: Church, title: 'Ceremonia', description: 'El momento de decir "Sí, quiero"' },
            { time: '19:30', icon: Wine, title: 'Cóctel', description: 'Brindis y celebración' },
            { time: '21:00', icon: Cake, title: 'Cena', description: 'Una noche inolvidable' },
            { time: '23:00', icon: Music, title: 'Fiesta', description: '¡A bailar toda la noche!' }
        ];

    return (
        <section className="relative py-24 px-4 bg-amber-50 overflow-hidden">
            {/* Paper texture */}
            <div className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto relative z-10"
            >
                <div className="text-center mb-12">
                    <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-2">El Gran Día</h2>
                    <p className="text-rose-600 font-serif italic">Así será nuestra celebración</p>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-rose-300 md:-translate-x-1/2" />

                    {events.map((event, index) => {
                        const Icon = event.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative flex items-center mb-10"
                            >
                                {/* Content */}
                                <div className={`pl-20 md:pl-0 w-full md:w-1/2 ${index % 2 === 0 ? 'md:mr-auto md:pr-12 md:text-right' : 'md:ml-auto md:pl-12 md:text-left'}`}>
                                    <div className="bg-white border border-rose-200 p-5 rounded-lg shadow-sm">
                                        <span className="text-rose-500 font-serif text-lg">{event.time}</span>
                                        <h3 className="text-xl font-serif text-rose-900 mt-1">{event.title}</h3>
                                        <p className="text-rose-600 text-sm mt-1">{event.description}</p>
                                    </div>
                                </div>

                                {/* Node */}
                                <div className="absolute left-8 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center z-10">
                                    <Icon className="w-5 h-5 text-rose-500" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}

// VENUES SECTION - Locations
function VenuesSection({ logistics, content }: { logistics: InvitationSchema['logistics']; content: InvitationSchema['content'] }) {
    const generateCalendarLink = (venue: any, eventDate: string) => {
        const eventTitle = encodeURIComponent(`${content.headline || 'Evento'} - ${venue.title}`);
        const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
        const baseDate = new Date(eventDate);
        const [hours, minutes] = venue.time ? venue.time.split(':') : ['18', '00'];
        baseDate.setHours(parseInt(hours), parseInt(minutes));
        const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0];
        const endDate = new Date(baseDate);
        endDate.setHours(endDate.getHours() + 1);
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDate(baseDate)}/${formatDate(endDate)}&location=${location}`;
    };

    const eventDate = logistics.event_date;

    const venues = logistics.venues.length > 0
        ? logistics.venues.map((venue, idx) => ({
            title: venue.type === 'ceremony' ? 'Ceremonia' : 'Celebración',
            name: venue.name,
            address: venue.address,
            time: logistics.agenda[idx]?.time || '18:00',
            mapUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d${venue.coordinates.lng}!3d${venue.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjQiUyA1OMKwMjUnMTMuNyJX!5e0!3m2!1sen!2sar!4v1234567890`,
            mapsLink: venue.google_maps_url || `https://maps.google.com/?q=${venue.coordinates.lat},${venue.coordinates.lng}`,
            calendarLink: generateCalendarLink({
                title: venue.type === 'ceremony' ? 'Ceremonia' : 'Celebración',
                name: venue.name,
                address: venue.address,
                time: logistics.agenda[idx]?.time || '18:00'
            }, eventDate)
        }))
        : [
            {
                title: 'Ceremonia',
                name: 'Capilla Santa María',
                address: 'Av. Libertador 5234, Palermo, Buenos Aires',
                time: '18:00',
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d-58.420469!3d-34.603722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjQiUyA1OMKwMjUnMTMuNyJX!5e0!3m2!1sen!2sar!4v1234567890',
                mapsLink: 'https://maps.google.com/?q=Palermo,Buenos+Aires',
                calendarLink: generateCalendarLink({
                    title: 'Ceremonia',
                    name: 'Capilla Santa María',
                    address: 'Av. Libertador 5234',
                    time: '18:00'
                }, eventDate)
            },
            {
                title: 'Recepción',
                name: 'Salón Las Magnolias',
                address: 'Thames 2456, Palermo Soho, Buenos Aires',
                time: '19:30',
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d-58.420469!3d-34.603722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjQiUyA1OMKwMjUnMTMuNyJX!5e0!3m2!1sen!2sar!4v1234567890',
                mapsLink: 'https://maps.google.com/?q=Palermo+Soho,Buenos+Aires',
                calendarLink: generateCalendarLink({
                    title: 'Recepción',
                    name: 'Salón Las Magnolias',
                    address: 'Thames 2456',
                    time: '19:30'
                }, eventDate)
            }
        ];

    return (
        <section className="relative py-24 px-4 bg-rose-50 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto relative z-10"
            >
                <div className="text-center mb-12">
                    <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-2">Dónde Celebramos</h2>
                    <p className="text-rose-600 font-serif italic">Te esperamos en estos lugares especiales</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {venues.map((venue, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-white border border-rose-200 rounded-lg overflow-hidden shadow-sm"
                        >
                            <div className="h-48 relative">
                                <iframe
                                    src={venue.mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                />
                            </div>

                            <div className="p-6">
                                <span className="text-rose-500 font-serif text-sm">{venue.time} hs</span>
                                <h3 className="text-xl font-serif text-rose-900 mt-1">{venue.title}</h3>
                                <h4 className="text-lg text-rose-700">{venue.name}</h4>
                                <p className="text-rose-600 text-sm mt-2 flex items-start">
                                    <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                                    {venue.address}
                                </p>

                                <div className="flex gap-3 mt-4">
                                    <a
                                        href={venue.mapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-rose-100 text-rose-700 px-4 py-2 rounded font-serif text-sm hover:bg-rose-200 transition-colors text-center"
                                    >
                                        Cómo llegar
                                    </a>
                                    <a
                                        href={venue.calendarLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded font-serif text-sm hover:bg-amber-200 transition-colors"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Agendar
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

// DRESS CODE SECTION
function DressCodeSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const dressCodeText = logistics.dress_code?.code === 'formal' ? 'Formal Elegante' :
        logistics.dress_code?.code === 'black-tie' ? 'Black Tie' :
            logistics.dress_code?.code === 'cocktail' ? 'Cocktail' :
                logistics.dress_code?.description || 'Formal Elegante';

    return (
        <section className="relative py-24 px-4 bg-amber-50 overflow-hidden">
            {/* Paper texture */}
            <div className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto text-center relative z-10"
            >
                <div className="mb-12">
                    <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-2">Código de Vestimenta</h2>
                    <p className="text-rose-600 font-serif italic">Vístete para la ocasión</p>
                </div>

                <div className="bg-white border-2 border-rose-200 p-8 rounded-lg inline-block">
                    <h3 className="text-2xl md:text-3xl font-serif text-rose-900 mb-2">{dressCodeText}</h3>
                    <p className="text-rose-600 font-serif text-sm max-w-md">
                        Te sugerimos tonos pastel, tierra o neutros para armonizar con la decoración.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}

// GALLERY SECTION - Photo Gallery
function GallerySection({ content }: { content: InvitationSchema['content'] }) {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const photos = content.gallery_images?.length
        ? content.gallery_images
        : [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
            'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
            'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
            'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80'
        ];

    return (
        <section className="relative py-24 px-4 bg-rose-50 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto relative z-10"
            >
                <div className="text-center mb-12">
                    <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-2">Nuestros Momentos</h2>
                    <p className="text-rose-600 font-serif italic">Recuerdos que atesoramos</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedPhoto(photo)}
                            className="aspect-square overflow-hidden rounded-lg border-4 border-white shadow-md cursor-pointer"
                        >
                            <img
                                src={photo}
                                alt={`Foto ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPhoto(null)}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-4 right-4 text-white hover:text-rose-300"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <img
                            src={selectedPhoto}
                            alt="Foto ampliada"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// GIFT REGISTRY SECTION
function GiftRegistrySection({ features }: { features: InvitationSchema['features'] }) {
    const [copied, setCopied] = useState(false);

    const bankDetails = features.gift_registry?.bank_details;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="relative py-24 px-4 bg-amber-50 overflow-hidden">
            {/* Paper texture */}
            <div className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto relative z-10"
            >
                <div className="text-center mb-12">
                    <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-2">Mesa de Regalos</h2>
                    <p className="text-rose-600 font-serif italic">Tu presencia es nuestro mejor regalo</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Bank Transfer - Solo Alias */}
                    {bankDetails?.alias && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white border-2 border-rose-200 rounded-lg p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Gift className="w-6 h-6 text-rose-400" />
                                <h3 className="text-lg font-serif text-rose-900">Transferencia Bancaria</h3>
                            </div>

                            <div className="text-center py-4">
                                <p className="text-rose-600 font-serif text-sm mb-3">Alias para transferir</p>
                                <button
                                    onClick={() => copyToClipboard(bankDetails.alias!)}
                                    className="flex items-center justify-center gap-2 mx-auto bg-rose-50 border-2 border-rose-200 rounded-lg px-6 py-3 text-rose-900 font-serif hover:bg-rose-100 transition-colors"
                                >
                                    <span className="text-lg font-medium">{bankDetails.alias}</span>
                                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                                <p className="text-rose-500 text-xs mt-2 font-serif">{copied ? '¡Copiado!' : 'Toca para copiar'}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Gift Registry Link */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border-2 border-rose-200 rounded-lg p-6 flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Gift className="w-6 h-6 text-rose-400" />
                            <h3 className="text-lg font-serif text-rose-900">Lista de Regalos</h3>
                        </div>

                        <p className="text-rose-600 font-serif text-sm mb-6 flex-grow">
                            También tenemos una lista de regalos en caso de que quieras ver opciones.
                        </p>

                        <a
                            href={features.gift_registry?.registries?.[0]?.url || 'https://listaderegalos.mercadolibre.com.ar'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-rose-100 text-rose-700 px-6 py-3 rounded font-serif hover:bg-rose-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="w-5 h-5" />
                            Ver Regalos
                        </a>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}

// RSVP SECTION - Confirmation Form
function RSVPSection({ features, content, metadata }: { features: InvitationSchema['features']; content: InvitationSchema['content']; metadata: InvitationSchema['metadata'] }) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', attendance: true, guests: 1, message: '' });
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
                dietaryRestrictions: '',
                message: formData.message
            });

            if (result.success) {
                setSuccess(true);
                setFormData({ name: '', email: '', phone: '', attendance: true, guests: 1, message: '' });
            } else {
                setError(result.error || 'Error al enviar');
            }
        } catch {
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <section id="retro-rsvp" className="relative py-24 px-4 bg-rose-50 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="bg-white border-2 border-rose-300 rounded-lg p-8">
                        <Heart className="w-16 h-16 text-rose-400 mx-auto mb-4 fill-rose-400" />
                        <h2 className="text-2xl font-serif text-rose-900 mb-4">¡Gracias!</h2>
                        <p className="text-rose-600 font-serif mb-6">Tu confirmación ha sido recibida. ¡Te esperamos!</p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="text-rose-500 hover:text-rose-700 font-serif underline"
                        >
                            Enviar otra confirmación
                        </button>
                    </div>
                </motion.div>
            </section>
        );
    }

    return (
        <section id="retro-rsvp" className="relative py-24 px-4 bg-rose-50 overflow-hidden">
            {/* Paper texture */}
            <div className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl mx-auto relative z-10"
            >
                <div className="text-center mb-12">
                    <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-2">Confirma tu Asistencia</h2>
                    <p className="text-rose-600 font-serif italic">Nos encantaría contar con tu presencia</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6 text-red-600 font-serif text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white border-2 border-rose-200 rounded-lg p-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-rose-700 font-serif text-sm mb-2">Nombre completo</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-rose-200 rounded px-4 py-3 text-rose-900 font-serif focus:border-rose-400 focus:outline-none"
                                placeholder="Tu nombre"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-rose-700 font-serif text-sm mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border border-rose-200 rounded px-4 py-3 text-rose-900 font-serif focus:border-rose-400 focus:outline-none"
                                placeholder="tu@email.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-rose-700 font-serif text-sm mb-2">¿Asistirás?</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, attendance: true })}
                                    className={`flex-1 py-3 rounded font-serif text-sm transition-colors ${
                                        formData.attendance
                                            ? 'bg-rose-100 border-2 border-rose-400 text-rose-900'
                                            : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-rose-300'
                                    }`}
                                    disabled={loading}
                                >
                                    Sí, asistiré
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, attendance: false })}
                                    className={`flex-1 py-3 rounded font-serif text-sm transition-colors ${
                                        !formData.attendance
                                            ? 'bg-gray-100 border-2 border-gray-400 text-gray-900'
                                            : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                    disabled={loading}
                                >
                                    No podré ir
                                </button>
                            </div>
                        </div>

                        {formData.attendance && (
                            <div>
                                <label className="block text-rose-700 font-serif text-sm mb-2">Número de acompañantes</label>
                                <select
                                    value={formData.guests}
                                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                    className="w-full border border-rose-200 rounded px-4 py-3 text-rose-900 font-serif focus:border-rose-400 focus:outline-none"
                                    disabled={loading}
                                >
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-rose-700 font-serif text-sm mb-2">Mensaje (opcional)</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full border border-rose-200 rounded px-4 py-3 text-rose-900 font-serif focus:border-rose-400 focus:outline-none h-24 resize-none"
                                placeholder="Déjanos un mensaje..."
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 bg-rose-400 text-white px-6 py-4 rounded font-serif hover:bg-rose-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>
                        ) : (
                            <><Send className="w-5 h-5" /> Confirmar asistencia</>
                        )}
                    </button>
                </form>
            </motion.div>
        </section>
    );
}

// MUSIC SECTION - Vintage Music & Song Suggestions
function MusicSection({ features }: { features: InvitationSchema['features'] }) {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [formData, setFormData] = useState({ guestName: '', songTitle: '', artist: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

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
        const { error } = await supabase.from('song_suggestions').insert([{
            guest_name: formData.guestName,
            song_title: formData.songTitle,
            artist: formData.artist,
            status: 'pending'
        }]);
        if (!error) {
            setSubmitted(true);
            setFormData({ guestName: '', songTitle: '', artist: '' });
            setTimeout(() => {
                setSubmitted(false);
                setShowForm(false);
            }, 2000);
        }
        setLoading(false);
    };

    return (
        <section className="relative py-24 px-4 bg-amber-50 overflow-hidden">
            {/* Paper texture */}
            <div className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg"
                    >
                        <Music className="w-10 h-10 text-rose-500" />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-2">Nuestra Playlist</h2>
                    <p className="text-rose-600 font-serif italic">La música que nos une</p>
                </div>

                {/* Decorative vinyl record animation */}
                <div className="flex justify-center mb-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="relative w-32 h-32"
                    >
                        <div className="absolute inset-0 bg-gray-900 rounded-full shadow-2xl" />
                        <div className="absolute inset-2 bg-gray-800 rounded-full" />
                        <div className="absolute inset-4 bg-gray-700 rounded-full" />
                        <div className="absolute inset-8 bg-rose-400 rounded-full" />
                        <div className="absolute inset-[42%] bg-gray-900 rounded-full" />
                        {/* Grooves */}
                        <div className="absolute inset-6 border border-gray-600 rounded-full" />
                        <div className="absolute inset-10 border border-gray-600 rounded-full" />
                        <div className="absolute inset-14 border border-gray-600 rounded-full" />
                    </motion.div>
                </div>

                {/* Current Track Info */}
                <div className="bg-white border-2 border-rose-200 rounded-lg p-6 mb-8 text-center shadow-sm">
                    <p className="text-rose-400 font-serif text-sm mb-2">Ahora sonando</p>
                    <h3 className="text-xl font-serif text-rose-900 mb-1">
                        {features.music?.track_name || 'Perfect - Ed Sheeran'}
                    </h3>
                    <p className="text-rose-600 font-serif text-sm">
                        {features.music?.artist || 'Ed Sheeran'}
                    </p>
                    
                    {/* Audio visualizer bars */}
                    <div className="flex justify-center gap-1 mt-4 h-8 items-end">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: [8, 24 + Math.random() * 16, 8] }}
                                transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity }}
                                className="w-2 bg-rose-300 rounded-t"
                            />
                        ))}
                    </div>
                </div>

                {/* Suggest Song Button */}
                <div className="text-center mb-8">
                    <motion.button
                        onClick={() => setShowForm(!showForm)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-rose-400 text-white px-8 py-3 rounded-full font-serif shadow-lg hover:bg-rose-500 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <Plus className="w-5 h-5" />
                        {showForm ? 'Cancelar' : 'Sugerir una canción'}
                    </motion.button>
                </div>

                {/* Song Suggestion Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white border-2 border-rose-200 rounded-lg p-6 mb-8 shadow-sm">
                                <h3 className="text-xl font-serif text-rose-900 mb-4 text-center">
                                    ¿Qué canción no puede faltar?
                                </h3>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-rose-700 font-serif text-sm mb-2">Tu nombre</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.guestName}
                                            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                            className="w-full border border-rose-200 rounded px-4 py-3 text-rose-900 font-serif focus:border-rose-400 focus:outline-none"
                                            placeholder="¿Cómo te llamas?"
                                            disabled={loading}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-rose-700 font-serif text-sm mb-2">Nombre de la canción</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.songTitle}
                                            onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                                            className="w-full border border-rose-200 rounded px-4 py-3 text-rose-900 font-serif focus:border-rose-400 focus:outline-none"
                                            placeholder="¿Cuál es la canción?"
                                            disabled={loading}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-rose-700 font-serif text-sm mb-2">Artista</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.artist}
                                            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                            className="w-full border border-rose-200 rounded px-4 py-3 text-rose-900 font-serif focus:border-rose-400 focus:outline-none"
                                            placeholder="¿Quién la canta?"
                                            disabled={loading}
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={loading || submitted}
                                        className="w-full bg-rose-400 text-white px-6 py-3 rounded font-serif hover:bg-rose-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitted ? (
                                            <><Check className="w-5 h-5" /> ¡Enviado!</>
                                        ) : loading ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>
                                        ) : (
                                            <><Send className="w-5 h-5" /> Enviar sugerencia</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Recent Suggestions */}
                {suggestions.length > 0 && (
                    <div className="bg-white/50 border border-rose-200 rounded-lg p-6">
                        <h4 className="text-lg font-serif text-rose-900 mb-4 flex items-center gap-2">
                            <Disc3 className="w-5 h-5 text-rose-400 animate-spin" style={{ animationDuration: '3s' }} />
                            Sugerencias recientes
                        </h4>
                        <div className="space-y-3">
                            {suggestions.map((s, idx) => (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center gap-3 bg-white border border-rose-100 rounded-lg p-3"
                                >
                                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Music className="w-5 h-5 text-rose-400" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-serif text-rose-900 font-medium">{s.song_title}</p>
                                        <p className="text-rose-600 text-sm font-serif">{s.artist} • Sugerido por {s.guest_name}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Decorative bottom element */}
                <div className="flex items-center justify-center gap-4 mt-12">
                    <span className="h-px w-16 bg-rose-300" />
                    <Music className="w-6 h-6 text-rose-400" />
                    <span className="h-px w-16 bg-rose-300" />
                </div>
            </motion.div>
        </section>
    );
}

// FOOTER SECTION
function Footer({ content }: { content: InvitationSchema['content'] }) {
    return (
        <footer className="relative bg-rose-100 py-12 px-4 border-t border-rose-200">
            <div className="max-w-4xl mx-auto text-center">
                <Heart className="w-6 h-6 text-rose-400 mx-auto mb-4 fill-rose-400" />
                <p className="font-serif text-rose-800 text-lg mb-2">
                    {content.couple?.person1.name || 'Amanda'} & {content.couple?.person2.name || 'Sebastián'}
                </p>
                <p className="font-serif text-rose-600 text-sm italic mb-6">
                    "El amor es la poesía de los sentidos"
                </p>
                <div className="flex items-center justify-center gap-2 text-rose-400 text-xs">
                    <span>Hecho con</span>
                    <Heart className="w-3 h-3 fill-rose-400" />
                    <span>para siempre</span>
                </div>
            </div>
        </footer>
    );
}

// FLOATING RSVP BUTTON
function FloatingRSVPButton({ features }: { features: InvitationSchema['features'] }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const heroSection = document.getElementById('retro-hero');
        if (!heroSection) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(!entry.isIntersecting);
            },
            { threshold: 0.1, rootMargin: '-50px' }
        );

        observer.observe(heroSection);
        return () => observer.disconnect();
    }, []);

    const scrollToRSVP = () => {
        const rsvpSection = document.getElementById('retro-rsvp');
        if (rsvpSection) {
            rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (!features.show_rsvp) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
                >
                    <motion.button
                        onClick={scrollToRSVP}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-full font-serif shadow-lg hover:bg-rose-600 transition-colors"
                    >
                        <Heart className="w-5 h-5" />
                        <span className="hidden sm:inline">Confirmar asistencia</span>
                        <span className="sm:hidden">Confirmar</span>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// MAIN LAYOUT EXPORT
export function RetroLoveLayout({ invitation, preview }: RetroLoveLayoutProps) {
    const { metadata, content, logistics, features } = invitation;

    return (
        <main className="min-h-screen bg-amber-50 text-rose-900 overflow-x-hidden">
            <FloatingRSVPButton features={features} />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <HeroSection content={content} logistics={logistics} />
            </motion.div>

            <FeatureGate isVisible={features.show_countdown} data={features.countdown} fallback={preview ? <EmptyStatePreview icon="⏱️" title="Cuenta Regresiva" description="Configura la fecha del evento" /> : null}>
                <CountdownSection logistics={logistics} />
            </FeatureGate>

            <FeatureGate isVisible={!!content.quote || !!content.couple?.love_story} data={content.quote} fallback={preview ? <EmptyStatePreview icon="💌" title="Frase de Amor" description="Agrega una frase especial" /> : null}>
                <QuoteSection content={content} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_agenda} data={logistics.agenda} fallback={preview ? <EmptyStatePreview icon="📋" title="Itinerario" description="Agrega los momentos del evento" /> : null}>
                <TimelineSection logistics={logistics} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_venue_map} data={logistics.venues} fallback={preview ? <EmptyStatePreview icon="📍" title="Ubicaciones" description="Indica dónde será el evento" /> : null}>
                <VenuesSection logistics={logistics} content={content} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_dress_code} data={logistics.dress_code} fallback={preview ? <EmptyStatePreview icon="👔" title="Dress Code" description="Especifica el código de vestimenta" /> : null}>
                <DressCodeSection logistics={logistics} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_gallery} data={content.gallery_images} fallback={preview ? <EmptyStatePreview icon="📸" title="Galería" description="Sube fotos de la pareja" /> : null}>
                <GallerySection content={content} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_gift_registry} data={features.gift_registry} fallback={preview ? <EmptyStatePreview icon="🎁" title="Mesa de Regalos" description="Comparte datos para regalos" /> : null}>
                <GiftRegistrySection features={features} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_music} data={features.music} fallback={preview ? <EmptyStatePreview icon="🎵" title="Música" description="Activa la sección de música" /> : null}>
                <MusicSection features={features} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_rsvp} data={features.rsvp} fallback={preview ? <EmptyStatePreview icon="✉️" title="RSVP" description="Activa el formulario de confirmación" /> : null}>
                <RSVPSection features={features} content={content} metadata={metadata} />
            </FeatureGate>

            <Footer content={content} />
        </main>
    );
}
