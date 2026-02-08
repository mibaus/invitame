'use client';

import { useState, useEffect } from 'react';
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
    Shirt,
    Sparkles,
    X,
    Gift,
    Copy,
    Check,
    ExternalLink,
    Send,
    MessageCircle,
    Plus,
    Loader2
} from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { createClient } from '@supabase/supabase-js';
import { submitRSVP } from '@/app/actions/rsvp';

interface BoltDarkLayoutProps {
    invitation: InvitationSchema;
    preview?: boolean;
    previewMobile?: boolean;
}

// Initialize Supabase client for music suggestions
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Empty state component for preview mode
function EmptyStatePreview({
    icon,
    title,
    description
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="py-16 px-6 text-center bg-black">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );
}

// Hero Section - Exactamente como bolt original
function HeroSection({ content, logistics }: { content: InvitationSchema['content']; logistics: InvitationSchema['logistics'] }) {
    const scrollToContent = () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    };

    const eventDate = new Date(logistics.event_date);
    const day = eventDate.getDate().toString().padStart(2, '0');
    const month = eventDate.toLocaleDateString('es-ES', { month: 'long' });
    const year = eventDate.getFullYear();

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${content.cover_image || 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1920'})`,
                    filter: 'brightness(0.5)'
                }}
            />

            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <h1 className="text-6xl md:text-8xl font-normal text-white mb-6 tracking-wide">
                        {content.couple?.person1.name || 'Ana'} <span className="text-amber-400">&</span> {content.couple?.person2.name || 'Pablo'}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-xl md:text-2xl text-gray-200 mb-4 font-light tracking-wider"
                >
                    <span className="text-amber-400">{day}</span> | {month.charAt(0).toUpperCase() + month.slice(1)} | <span className="text-amber-400">{year}</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-sm md:text-base text-gray-300 tracking-widest uppercase"
                >
                    {logistics.venues[0]?.city || 'Buenos Aires'}, {logistics.venues[0]?.country || 'Argentina'}
                </motion.div>
            </div>

            <motion.button
                onClick={scrollToContent}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="flex flex-col items-center text-white hover:text-amber-400 transition-colors">
                    <span className="text-sm mb-2 tracking-wide">Descubrir más</span>
                    <ChevronDown className="w-6 h-6" />
                </div>
            </motion.button>
        </section>
    );
}

// Countdown Section - Exactamente como bolt original
function CountdownSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const targetDate = new Date(logistics.event_date).getTime();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

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
            <motion.div
                key={value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-7xl font-bold text-amber-400 mb-2"
            >
                {String(value).padStart(2, '0')}
            </motion.div>
            <div className="text-sm md:text-base text-gray-400 uppercase tracking-widest">{label}</div>
        </div>
    );

    return (
        <section className="bg-zinc-950 py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto"
            >
                <h2 className="text-3xl md:text-4xl text-center text-white font-light mb-12 tracking-wide">
                    Cuenta Regresiva
                </h2>

                <div className="grid grid-cols-4 gap-4 md:gap-8">
                    <TimeUnit value={timeLeft.days} label="Días" />
                    <TimeUnit value={timeLeft.hours} label="Horas" />
                    <TimeUnit value={timeLeft.minutes} label="Minutos" />
                    <TimeUnit value={timeLeft.seconds} label="Segundos" />
                </div>
            </motion.div>
        </section>
    );
}

// Quote Section - Exactamente como bolt original
function QuoteSection({ content }: { content: InvitationSchema['content'] }) {
    const quoteText = content.quote?.text || content.couple?.love_story ||
        '"Nos conocimos en una tarde lluviosa de otoño, cuando el destino cruzó nuestros caminos en una librería del barrio. Cinco años después, aquí estamos, listos para escribir juntos el capítulo más importante de nuestras vidas."';

    return (
        <section className="bg-black py-24 px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto text-center"
            >
                <Heart className="w-12 h-12 text-amber-400 mx-auto mb-8" />

                <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-6 italic">
                    {quoteText}
                </p>

                <div className="h-px w-32 bg-amber-400 mx-auto mt-8"></div>
            </motion.div>
        </section>
    );
}

// Timeline Section - Armonizada
function TimelineSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const events = logistics.agenda.length > 0
        ? logistics.agenda.map((item, idx) => ({
            time: item.time,
            icon: [Church, Wine, Cake, Music][idx % 4],
            title: item.title,
            description: item.description || ''
        }))
        : [
            { time: '18:00', icon: Church, title: 'Ceremonia', description: 'Iglesia Nuestra Señora' },
            { time: '19:30', icon: Wine, title: 'Recepción', description: 'Cóctel de bienvenida' },
            { time: '21:00', icon: Cake, title: 'Cena', description: 'Salón principal' },
            { time: '23:00', icon: Music, title: 'Fiesta', description: 'Baile hasta el amanecer' }
        ];

    return (
        <section className="bg-zinc-950 py-24 px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
            >
                <h2 className="text-3xl md:text-4xl text-center text-white font-light mb-16 tracking-wide">
                    Agenda del Día
                </h2>

                <div className="relative overflow-hidden">
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-amber-400/30 transform md:-translate-x-1/2"></div>

                    {events.map((event, index) => {
                        const Icon = event.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className={`relative flex items-center mb-16 md:mb-20 ${
                                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                }`}
                            >
                                <div className={`flex-1 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                                    <h3 className="text-xl md:text-2xl text-white font-light mb-2">{event.title}</h3>
                                    <p className="text-gray-400 mb-2 text-sm md:text-base">{event.description}</p>
                                    <p className="text-amber-400 font-light text-base">{event.time}</p>
                                </div>

                                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-zinc-900 border border-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/10">
                                    <Icon className="w-5 h-5 text-amber-400" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}

// Venues Section - Con botón Agendar funcional
function VenuesSection({ logistics, content }: { logistics: InvitationSchema['logistics']; content: InvitationSchema['content'] }) {
    // Helper para generar link de Google Calendar
    const generateCalendarLink = (venue: any, eventDate: string) => {
        const eventTitle = encodeURIComponent(`${content.headline || content.couple?.person1.name + ' & ' + content.couple?.person2.name} - ${venue.title}`);
        const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
        const details = encodeURIComponent(`Te esperamos para celebrar con nosotros. ${content.couple?.hashtag || ''}`);
        
        // Parsear fecha y hora
        const baseDate = new Date(eventDate);
        const [hours, minutes] = venue.time ? venue.time.split(':') : ['18', '00'];
        baseDate.setHours(parseInt(hours), parseInt(minutes));
        
        // Formato YYYYMMDDTHHMMSS para Google Calendar
        const formatDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0];
        };
        
        // Evento de 1 hora por defecto
        const endDate = new Date(baseDate);
        endDate.setHours(endDate.getHours() + 1);
        
        const start = formatDate(baseDate);
        const end = formatDate(endDate);
        
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${start}/${end}&details=${details}&location=${location}`;
    };

    const eventDate = logistics.event_date;

    const venues = logistics.venues.length > 0
        ? logistics.venues.map((venue, idx) => ({
            title: venue.type === 'ceremony' ? 'Ceremonia Religiosa' :
                venue.type === 'reception' ? 'Salón de Fiesta' : venue.name,
            name: venue.name,
            address: venue.address,
            time: logistics.agenda[idx]?.time || '18:00',
            mapUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d${venue.coordinates.lng}!3d${venue.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjQiUyA1OMKwMjUnMTMuNyJX!5e0!3m2!1sen!2sar!4v1234567890`,
            mapsLink: venue.google_maps_url || `https://maps.google.com/?q=${venue.coordinates.lat},${venue.coordinates.lng}`,
            calendarLink: generateCalendarLink({
                title: venue.type === 'ceremony' ? 'Ceremonia Religiosa' : 'Salón de Fiesta',
                name: venue.name,
                address: venue.address,
                time: logistics.agenda[idx]?.time || '18:00'
            }, eventDate)
        }))
        : [
            {
                title: 'Ceremonia Religiosa',
                name: 'Iglesia Nuestra Señora del Carmen',
                address: 'Av. Libertador 5234, Palermo, Buenos Aires',
                time: '18:00',
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d-58.420469!3d-34.603722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjQiUyA1OMKwMjUnMTMuNyJX!5e0!3m2!1sen!2sar!4v1234567890',
                mapsLink: 'https://maps.google.com/?q=Palermo,Buenos+Aires',
                calendarLink: generateCalendarLink({
                    title: 'Ceremonia Religiosa',
                    name: 'Iglesia Nuestra Señora del Carmen',
                    address: 'Av. Libertador 5234, Palermo, Buenos Aires',
                    time: '18:00'
                }, eventDate)
            },
            {
                title: 'Salón de Fiesta',
                name: 'Casa Serena Events',
                address: 'Thames 2456, Palermo Soho, Buenos Aires',
                time: '19:30',
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d-58.420469!3d-34.603722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjQiUyA1OMKwMjUnMTMuNyJX!5e0!3m2!1sen!2sar!4v1234567890',
                mapsLink: 'https://maps.google.com/?q=Palermo+Soho,Buenos+Aires',
                calendarLink: generateCalendarLink({
                    title: 'Salón de Fiesta',
                    name: 'Casa Serena Events',
                    address: 'Thames 2456, Palermo Soho, Buenos Aires',
                    time: '19:30'
                }, eventDate)
            }
        ];

    return (
        <section className="bg-black py-24 px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto"
            >
                <h2 className="text-3xl md:text-4xl text-center text-white font-light mb-16 tracking-wide">
                    Ubicaciones
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {venues.map((venue, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 hover:border-amber-400/50 transition-colors"
                        >
                            <div className="h-64 relative overflow-hidden">
                                <iframe
                                    src={venue.mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    className="grayscale hover:grayscale-0 transition-all"
                                ></iframe>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl text-amber-400 font-light mb-3 uppercase tracking-wider">
                                    {venue.title}
                                </h3>
                                <h4 className="text-2xl text-white mb-4">{venue.name}</h4>
                                <p className="text-gray-400 mb-6 flex items-start">
                                    <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                                    {venue.address}
                                </p>

                                <div className="flex gap-3">
                                    <a
                                        href={venue.mapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-amber-400 text-black px-4 py-3 rounded-lg font-medium hover:bg-amber-500 transition-colors text-center"
                                    >
                                        Cómo llegar
                                    </a>
                                    <a
                                        href={venue.calendarLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-zinc-800 text-white px-4 py-3 rounded-lg hover:bg-zinc-700 transition-colors"
                                    >
                                        <Calendar className="w-5 h-5" />
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

// Dress Code Section - Exactamente como bolt original
function DressCodeSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const dressCodeText = logistics.dress_code?.code === 'formal' ? 'Formal Elegante' :
        logistics.dress_code?.code === 'black-tie' ? 'Black Tie' :
            logistics.dress_code?.code === 'cocktail' ? 'Cocktail' :
                logistics.dress_code?.description || 'Formal Elegante';

    return (
        <section className="bg-zinc-950 py-24 px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center"
            >
                <h2 className="text-3xl md:text-4xl text-white font-light mb-8 tracking-wide">
                    Código de Vestimenta
                </h2>

                <div className="flex justify-center gap-6 mb-8">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-20 h-20 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center"
                    >
                        <Shirt className="w-10 h-10 text-amber-400" />
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="w-20 h-20 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center"
                    >
                        <Sparkles className="w-10 h-10 text-amber-400" />
                    </motion.div>
                </div>

                <h3 className="text-3xl md:text-4xl text-amber-400 font-light mb-4">
                    {dressCodeText}
                </h3>
                <p className="text-gray-400 text-lg">
                    Invitamos a todos nuestros invitados a vestir de forma elegante para celebrar esta ocasión especial
                </p>
            </motion.div>
        </section>
    );
}

// Gallery Section - Con carga progresiva de fotos
function GallerySection({ content }: { content: InvitationSchema['content'] }) {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(6);

    const photos = content.gallery_images?.length
        ? content.gallery_images
        : [
            'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2072179/pexels-photo-2072179.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1445696/pexels-photo-1445696.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1488310/pexels-photo-1488310.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800'
        ];

    const visiblePhotos = photos.slice(0, visibleCount);
    const hasMore = visibleCount < photos.length;

    const handleShowMore = () => {
        setVisibleCount(prev => Math.min(prev + 6, photos.length));
    };

    return (
        <section className="bg-black py-24 px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto"
            >
                <h2 className="text-3xl md:text-4xl text-center text-white font-light mb-16 tracking-wide">
                    Nuestra Historia
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {visiblePhotos.map((photo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            whileHover={{ scale: 1.03, zIndex: 10 }}
                            className="aspect-square cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            <img
                                src={photo}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                loading="lazy"
                            />
                        </motion.div>
                    ))}
                </div>

                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-10"
                    >
                        <button
                            onClick={handleShowMore}
                            className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-lg font-light transition-colors border border-zinc-700"
                        >
                            Ver más fotos ({photos.length - visibleCount} restantes)
                        </button>
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-amber-400 transition-colors"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            src={selectedPhoto}
                            alt="Selected"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// Gift Registry Section - Exactamente como bolt original
function GiftRegistrySection({ features }: { features: InvitationSchema['features'] }) {
    const [copied, setCopied] = useState(false);
    const cbu = features.gift_registry?.bank_details?.account_number || '0000003100012345678900';

    const handleCopy = () => {
        navigator.clipboard.writeText(cbu);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="bg-zinc-950 py-24 px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-12">
                    <Gift className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl text-white font-light mb-4 tracking-wide">
                        Mesa de Regalos
                    </h2>
                    <p className="text-gray-400 text-lg">
                        {features.gift_registry?.message || 'Tu presencia es nuestro mayor regalo, pero si deseas obsequiarnos algo más...'}
                    </p>
                </div>

                <div className="grid md:grid-cols-1 gap-6 max-w-xl mx-auto">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-black border-2 border-zinc-800 rounded-lg p-8"
                    >
                        <h3 className="text-xl text-white mb-4 font-light">Transferencia Bancaria</h3>
                        <div className="bg-zinc-900 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-400 mb-2">ALIAS</p>
                            <p className="text-lg text-amber-400 font-mono">{cbu}</p>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="w-full bg-amber-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-amber-500 transition-colors flex items-center justify-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    ¡Copiado!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    Copiar ALIAS
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}

// RSVP Section - Con envío real a base de datos
function RSVPSection({ features, content, metadata }: { features: InvitationSchema['features']; content: InvitationSchema['content']; metadata: InvitationSchema['metadata'] }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        attendance: true,
        guests: 1,
        dietary: '',
        message: '',
        songTitle: '',
        songArtist: ''
    });
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
                attendance: formData.attendance,
                guestsCount: formData.guests,
                dietaryRestrictions: formData.dietary,
                message: formData.message,
                customAnswers: customAnswers
            });

            if (result.success) {
                // If song suggestion provided, save it
                if (formData.songTitle && formData.songArtist) {
                    await supabase.from('song_suggestions').insert([{
                        guest_name: formData.name,
                        song_title: formData.songTitle,
                        artist: formData.songArtist,
                        status: 'pending'
                    }]);
                }
                setSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    attendance: true,
                    guests: 1,
                    dietary: '',
                    message: '',
                    songTitle: '',
                    songArtist: ''
                });
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

    const handleWhatsApp = () => {
        const message = encodeURIComponent(
            `¡Hola! Confirmo mi asistencia a la boda de ${content.couple?.person1.name || 'Ana'} & ${content.couple?.person2.name || 'Pablo'}.\n\nNombre: ${formData.name}\nInvitados: ${formData.guests}`
        );
        window.open(`https://wa.me/5491112345678?text=${message}`, '_blank');
    };

    const handleCustomAnswerChange = (questionId: string, value: string) => {
        setCustomAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    // Obtener preguntas personalizadas desde features.rsvp
    const customQuestions = features.rsvp?.custom_questions || [];

    if (success) {
        return (
            <section className="bg-black py-24 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="bg-zinc-950 rounded-lg p-8 border border-amber-400">
                        <Check className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                        <h2 className="text-2xl text-white font-light mb-4">¡Confirmación Enviada!</h2>
                        <p className="text-gray-400 mb-6">
                            Gracias {formData.name}, hemos registrado tu confirmación. ¡Te esperamos!
                        </p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="text-amber-400 hover:text-amber-300 underline"
                        >
                            Enviar otra confirmación
                        </button>
                    </div>
                </motion.div>
            </section>
        );
    }

    return (
        <section className="bg-black py-24 px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl mx-auto"
            >
                <h2 className="text-3xl md:text-4xl text-center text-white font-light mb-4 tracking-wide">
                    Confirmación de Asistencia
                </h2>
                <p className="text-center text-gray-400 mb-12">
                    Por favor, confirma tu asistencia antes del {features.rsvp?.deadline || '30 de noviembre'}
                </p>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 text-red-200 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-zinc-950 rounded-lg p-8 border border-zinc-800">
                    <div className="mb-6">
                        <label className="block text-white mb-2 font-light">Nombre Completo *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
                            placeholder="Juan Pérez"
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-white mb-2 font-light">Email *</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
                            placeholder="juan@email.com"
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-white mb-2 font-light">Teléfono</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
                            placeholder="+54 9 11 1234-5678"
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-white mb-2 font-light">¿Asistirás? *</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, attendance: true })}
                                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                                    formData.attendance
                                        ? 'bg-amber-400 text-black'
                                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                }`}
                                disabled={loading}
                            >
                                Sí, asistiré
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, attendance: false })}
                                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                                    !formData.attendance
                                        ? 'bg-red-500 text-white'
                                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                }`}
                                disabled={loading}
                            >
                                No podré ir
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-white mb-2 font-light">Número de Acompañantes *</label>
                        <select
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
                            disabled={loading}
                        >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'persona' : 'personas'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-white mb-2 font-light">Restricciones Dietéticas</label>
                        <textarea
                            value={formData.dietary}
                            onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors h-24 resize-none"
                            placeholder="Vegetariano, vegano, celíaco, alergias, etc."
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-white mb-2 font-light">Mensaje para los novios</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors h-24 resize-none"
                            placeholder="Escribe un mensaje especial..."
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6 border-t border-zinc-800 pt-6">
                        <label className="block text-white mb-2 font-light flex items-center gap-2">
                            <Music className="w-4 h-4 text-amber-400" />
                            Sugiere una canción para la fiesta
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={formData.songTitle}
                                onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
                                placeholder="Título de la canción"
                                disabled={loading}
                            />
                            <input
                                type="text"
                                value={formData.songArtist}
                                onChange={(e) => setFormData({ ...formData, songArtist: e.target.value })}
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
                                placeholder="Artista"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Preguntas Personalizadas */}
                    {customQuestions.length > 0 && (
                        <div className="mb-6 border-t border-zinc-800 pt-6">
                            <label className="block text-white mb-4 font-light">Preguntas Adicionales</label>
                            <div className="space-y-4">
                                {customQuestions.map((question) => (
                                    <div key={question.id}>
                                        <label className="block text-gray-400 mb-2 text-sm">
                                            {question.question}
                                            {question.required && <span className="text-amber-400 ml-1">*</span>}
                                        </label>
                                        {question.type === 'text' ? (
                                            <input
                                                type="text"
                                                required={question.required}
                                                value={customAnswers[question.id] || ''}
                                                onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
                                                placeholder="Tu respuesta..."
                                                disabled={loading}
                                            />
                                        ) : question.type === 'select' ? (
                                            <select
                                                required={question.required}
                                                value={customAnswers[question.id] || ''}
                                                onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors cursor-pointer"
                                                disabled={loading}
                                            >
                                                <option value="" className="bg-zinc-950">Selecciona una opción</option>
                                                {question.options?.map((opt) => (
                                                    <option key={opt} value={opt} className="bg-zinc-950">{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <textarea
                                                required={question.required}
                                                value={customAnswers[question.id] || ''}
                                                onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors h-24 resize-none"
                                                placeholder="Tu respuesta..."
                                                disabled={loading}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-400 text-black px-6 py-4 rounded-lg font-medium hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Confirmar Asistencia
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </section>
    );
}

// Music Player - Exactamente como bolt original
function MusicPlayer({ features }: { features: InvitationSchema['features'] }) {
    const [showPlayer, setShowPlayer] = useState(false);
    const [showSuggestForm, setShowSuggestForm] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        guestName: '',
        songTitle: '',
        artist: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleSubmitSuggestion = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('song_suggestions')
            .insert([{
                guest_name: formData.guestName,
                song_title: formData.songTitle,
                artist: formData.artist
            }]);

        if (!error) {
            setSubmitted(true);
            setFormData({ guestName: '', songTitle: '', artist: '' });
            setTimeout(() => {
                setSubmitted(false);
                setShowSuggestForm(false);
            }, 2000);
        }
        setLoading(false);
    };

    return (
        <>
            <motion.button
                onClick={() => setShowPlayer(!showPlayer)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Music className="w-6 h-6 text-black" />
            </motion.button>

            <AnimatePresence>
                {showPlayer && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-24 right-6 z-50 bg-zinc-950 border-2 border-amber-400 rounded-xl p-5 shadow-2xl w-[calc(100vw-3rem)] max-w-[420px] max-h-[85vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-normal text-lg">Nuestra Playlist</h3>
                            <button
                                onClick={() => setShowPlayer(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-zinc-900 rounded-xl overflow-hidden mb-4 p-6 text-center border border-zinc-800">
                            <Music className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                            <p className="text-white mb-4 font-light">Escucha nuestra playlist especial</p>
                            <a
                                href={features.music?.spotify_playlist_url || 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-black px-6 py-3 rounded-full font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                </svg>
                                Abrir en Spotify
                            </a>
                        </div>

                        <p className="text-gray-400 text-sm text-center mb-4 px-2">
                            Las canciones que acompañarán nuestra celebración
                        </p>

                        <button
                            onClick={() => setShowSuggestForm(!showSuggestForm)}
                            className="w-full bg-amber-400 text-black px-4 py-3 rounded-lg font-medium hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 mb-4"
                        >
                            <Plus className="w-4 h-4" />
                            {showSuggestForm ? 'Cancelar' : 'Sugerir Canción'}
                        </button>

                        {showSuggestForm && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleSubmitSuggestion}
                                className="bg-black rounded-lg p-4 border border-zinc-800 mb-4"
                            >
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        required
                                        value={formData.guestName}
                                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                                        placeholder="Tu nombre"
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        required
                                        value={formData.songTitle}
                                        onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                                        placeholder="Título de la canción"
                                    />
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        required
                                        value={formData.artist}
                                        onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                                        placeholder="Artista"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || submitted}
                                    className="w-full bg-amber-400 text-black px-3 py-2.5 rounded-lg font-medium hover:bg-amber-500 transition-colors text-sm disabled:opacity-50"
                                >
                                    {submitted ? '¡Sugerida!' : loading ? 'Enviando...' : 'Enviar Sugerencia'}
                                </button>
                            </motion.form>
                        )}

                        {suggestions.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-zinc-800">
                                <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Sugerencias recientes</p>
                                <div className="space-y-2">
                                    {suggestions.map((suggestion) => (
                                        <div key={suggestion.id} className="bg-black rounded p-3 border border-zinc-800">
                                            <p className="text-white text-sm font-medium">{suggestion.song_title}</p>
                                            <p className="text-gray-400 text-xs">{suggestion.artist}</p>
                                            <p className="text-gray-500 text-xs mt-1">— {suggestion.guest_name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Footer - Exactamente como bolt original
function Footer({ content }: { content: InvitationSchema['content'] }) {
    return (
        <footer className="bg-zinc-950 py-12 px-4 border-t border-zinc-800">
            <div className="max-w-4xl mx-auto text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Heart className="w-6 h-6 text-amber-400 fill-amber-400" />
                </div>

                <h3 className="text-2xl text-white font-light mb-4">
                    ¡Los esperamos para celebrar!
                </h3>

                <p className="text-gray-400 mb-8">
                    {content.couple?.person1.name || 'Ana'} & {content.couple?.person2.name || 'Pablo'}
                </p>

                <div className="h-px w-32 bg-zinc-800 mx-auto mb-6"></div>

                <p className="text-sm text-gray-500">
                    Invitame © 2026. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

// Main Layout Component
export function BoltDarkLayout({ invitation, preview, previewMobile }: BoltDarkLayoutProps) {
    const { metadata, content, logistics, features } = invitation;

    return (
        <main className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <HeroSection content={content} logistics={logistics} />
            </motion.div>

            {/* Countdown Section */}
            <FeatureGate
                isVisible={features.show_countdown}
                data={features.countdown}
                fallback={preview ? (
                    <EmptyStatePreview
                        icon="⏰"
                        title="Cuenta Regresiva"
                        description="Configura la fecha de tu evento para activar la cuenta regresiva"
                    />
                ) : null}
            >
                <CountdownSection logistics={logistics} />
            </FeatureGate>

            {/* Quote Section */}
            <FeatureGate
                isVisible={!!content.quote || !!content.couple?.love_story}
                data={content.quote}
                fallback={preview ? (
                    <EmptyStatePreview
                        icon="💭"
                        title="Frase Especial"
                        description="Agrega una frase o historia de amor"
                    />
                ) : null}
            >
                <QuoteSection content={content} />
            </FeatureGate>

            {/* Timeline/Agenda Section */}
            <FeatureGate
                isVisible={features.show_agenda}
                data={logistics.agenda}
                fallback={preview ? (
                    <EmptyStatePreview
                        icon="📋"
                        title="Agenda del Día"
                        description="Agrega los momentos clave de tu evento"
                    />
                ) : null}
            >
                <TimelineSection logistics={logistics} />
            </FeatureGate>

            {/* Venues Section */}
            <FeatureGate
                isVisible={features.show_venue_map}
                data={logistics.venues}
                fallback={preview ? (
                    <EmptyStatePreview
                        icon="📍"
                        title="Ubicaciones"
                        description="Indica dónde será la ceremonia y la celebración"
                    />
                ) : null}
            >
                <VenuesSection logistics={logistics} content={content} />
            </FeatureGate>

            {/* Dress Code Section */}
            <FeatureGate
                isVisible={features.show_dress_code}
                data={logistics.dress_code}
                fallback={preview ? (
                    <EmptyStatePreview
                        icon="👔"
                        title="Código de Vestimenta"
                        description="Especifica el dress code para tu evento"
                    />
                ) : null}
            >
                <DressCodeSection logistics={logistics} />
            </FeatureGate>

            {/* Gallery Section */}
            <FeatureGate
                isVisible={features.show_gallery}
                data={content.gallery_images}
                fallback={preview ? (
                    <EmptyStatePreview
                        icon="🖼️"
                        title="Galería de Fotos"
                        description="Sube hasta 15 fotos para compartir momentos especiales"
                    />
                ) : null}
            >
                <GallerySection content={content} />
            </FeatureGate>

            {/* Gift Registry Section */}
            <FeatureGate
                isVisible={features.show_gift_registry}
                data={features.gift_registry}
                fallback={preview ? (
                    <EmptyStatePreview
                        icon="🎁"
                        title="Mesa de Regalos"
                        description="Comparte los datos bancarios o listas de regalos"
                    />
                ) : null}
            >
                <GiftRegistrySection features={features} />
            </FeatureGate>

            {/* RSVP Section */}
            <FeatureGate
                isVisible={features.show_rsvp}
                data={features.rsvp}
                fallback={preview ? (
                    <EmptyStatePreview
                        icon="✉️"
                        title="Confirmar Asistencia"
                        description="Activa el formulario para que tus invitados confirmen"
                    />
                ) : null}
            >
                <RSVPSection features={features} content={content} metadata={metadata} />
            </FeatureGate>

            {/* Footer */}
            <Footer content={content} />
        </main>
    );
}
