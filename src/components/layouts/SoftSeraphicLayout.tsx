'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Music,
    Heart,
    GlassWater,
    Sparkles,
    MapPin,
    Mail,
    Gift,
    Send,
    Play,
    SkipBack,
    SkipForward,
    Calendar,
} from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { submitRSVP } from '@/app/actions/rsvp';

interface SoftSeraphicLayoutProps {
    invitation: InvitationSchema;
    preview?: boolean;
}

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
        <div className="py-16 px-6 text-center bg-[#fcf9f2]">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-medium mb-2 text-[#4a4a4a]">{title}</h3>
            <p className="text-sm text-[#a9a9a9]">{description}</p>
        </div>
    );
}

// Falling Petals Animation
function FallingPetals() {
    const petals = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: Math.random() * 10,
            duration: 15 + Math.random() * 20,
            size: 10 + Math.random() * 15,
            rotation: Math.random() * 360,
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    initial={{
                        top: '-5%',
                        left: petal.left,
                        opacity: 0,
                        rotate: petal.rotation
                    }}
                    animate={{
                        top: '105%',
                        opacity: [0, 0.4, 0.4, 0],
                        rotate: petal.rotation + 360,
                        x: [0, 50, -50, 0]
                    }}
                    transition={{
                        duration: petal.duration,
                        repeat: Infinity,
                        delay: petal.delay,
                        ease: "linear"
                    }}
                    className="absolute"
                    style={{ width: petal.size, height: petal.size }}
                >
                    <div className="w-full h-full bg-[#f4d7d4]/30 rounded-full blur-[1px]"
                        style={{ borderRadius: '50% 0 50% 50%' }} />
                </motion.div>
            ))}
        </div>
    );
}

// Splash Screen Component
function SplashScreen({ onStart }: { onStart: () => void }) {
    const { content } = useInvitationData();
    const person1 = content.couple?.person1.name || 'A';
    const person2 = content.couple?.person2.name || 'L';
    const initials = `${person1.charAt(0)} & ${person2.charAt(0)}`;

    return (
        <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fcf9f2] p-6 text-center"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="max-w-md"
            >
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 border-2 border-[#c0c0c0] rounded-full flex items-center justify-center relative">
                        <span className="font-script text-4xl text-[#96adc0] z-10">{initials}</span>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border border-dashed border-[#96adc0]/20 rounded-full"
                        />
                    </div>
                </div>
                <h1 className="font-pinyon text-3xl mb-4 text-[#4a4a4a]">Nuestra Historia Comienza</h1>
                <p className="text-xs uppercase tracking-[0.3em] text-[#a9a9a9] mb-12">Te invitamos a ser parte de este sueño</p>
                <button
                    onClick={onStart}
                    className="px-10 py-4 border border-[#c0c0c0] text-[#96adc0] hover:bg-[#96adc0] hover:text-white transition-all duration-700 tracking-widest uppercase text-xs rounded-full shadow-sm hover:shadow-md"
                >
                    Abrir Invitación
                </button>
            </motion.div>
        </motion.div>
    );
}

// Store invitation data in a ref to avoid prop drilling
let invitationData: InvitationSchema;
let previewMode: boolean = false;

function useInvitationData() {
    return invitationData;
}

function usePreviewMode() {
    return previewMode;
}

// Hero Section
function HeroSection() {
    const { content, logistics } = useInvitationData();
    const eventDate = new Date(logistics.event_date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('es-ES', { month: 'long' });
    const year = eventDate.getFullYear();

    return (
        <section className="relative min-h-screen flex items-center justify-center py-16 md:py-0 px-4 overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-b from-[#96adc0]/15 via-[#fcf9f2] to-[#fcf9f2] -z-10" />

            {/* Mobile: Layout centrado apilado (original) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="md:hidden text-center w-full max-w-lg mx-auto"
            >
                <span className="text-[10px] uppercase tracking-[0.6em] text-[#a9a9a9] mb-8 block font-light">Nuestra Boda</span>

                <div className="relative mb-10 mx-auto w-[260px]">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-10 text-[#c0c0c0] opacity-60 z-20">
                        <svg viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="0.5">
                            <path d="M10 15 Q30 5 50 15 Q70 5 90 15" strokeLinecap="round" />
                            <circle cx="50" cy="8" r="1.5" fill="currentColor" />
                        </svg>
                    </div>

                    <div className="relative group p-3">
                        <div className="absolute inset-[-12px] border border-[#c0c0c0]/40 rounded-[312px_312px_32px_32px] pointer-events-none z-[5]" />

                        <div className="relative z-10 aspect-[3/4] bg-white rounded-[300px_300px_20px_20px] overflow-hidden border border-[#c0c0c0]/30 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
                            <img
                                src={content.cover_image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop'}
                                alt="Romantic Wedding"
                                className="w-full h-full object-cover sepia-[0.1] contrast-[1.02] transition-transform duration-1000 group-hover:scale-105"
                                style={{ objectPosition: 'center 20%' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#96adc0]/10 to-transparent pointer-events-none" />
                        </div>
                    </div>

                    <div className="absolute -top-6 -right-10 w-24 h-24 opacity-15 pointer-events-none rotate-12 blur-[1px]">
                        <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=300&auto=format&fit=crop" alt="decor" className="rounded-full" />
                    </div>
                    <div className="absolute -bottom-6 -left-10 w-32 h-32 opacity-15 pointer-events-none -rotate-12 blur-[1px]">
                        <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=300&auto=format&fit=crop" alt="decor" className="rounded-full" />
                    </div>
                </div>

                <div className="mb-6 relative z-30">
                    <h2 className="font-script text-6xl text-[#4a4a4a] leading-[1.6] py-2">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 2 }}
                            className="block px-4"
                        >
                            {content.couple?.person1.name || 'Alejandro'}
                        </motion.span>

                        <div className="flex items-center justify-center my-[-10px]">
                            <span className="font-pinyon text-2xl mx-4 text-[#96adc0] opacity-60 italic tracking-widest leading-none">&</span>
                        </div>

                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 2 }}
                            className="block px-4"
                        >
                            {content.couple?.person2.name || 'Luciana'}
                        </motion.span>
                    </h2>
                </div>

                <div className="space-y-3 mt-8">
                    <div className="w-12 h-[1px] bg-[#c0c0c0] mx-auto mb-4 opacity-40" />
                    <p className="font-light tracking-[0.5em] text-xs uppercase text-[#a9a9a9]">{day} de {month}</p>
                    <p className="font-light tracking-[0.3em] text-[10px] uppercase text-[#a9a9a9] opacity-70">{year}</p>
                </div>
            </motion.div>

            {/* Desktop: Layout de dos columnas */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="hidden md:flex w-full max-w-6xl mx-auto items-center justify-between gap-8 lg:gap-16"
            >
                {/* Columna izquierda: Imagen grande */}
                <div className="w-[45%] lg:w-[40%] relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-12 text-[#c0c0c0] opacity-50 z-20">
                        <svg viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="0.5">
                            <path d="M10 15 Q30 5 50 15 Q70 5 90 15" strokeLinecap="round" />
                            <circle cx="50" cy="8" r="1.5" fill="currentColor" />
                        </svg>
                    </div>

                    <div className="relative group p-4">
                        <div className="absolute inset-[-16px] border border-[#c0c0c0]/30 rounded-[312px_312px_32px_32px] pointer-events-none z-[5]" />

                        <div className="relative z-10 aspect-[3/4] bg-white rounded-[300px_300px_20px_20px] overflow-hidden border border-[#c0c0c0]/20 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                            <img
                                src={content.cover_image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop'}
                                alt="Romantic Wedding"
                                className="w-full h-full object-cover sepia-[0.1] contrast-[1.02] transition-transform duration-1000 group-hover:scale-105"
                                style={{ objectPosition: 'center 20%' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#96adc0]/10 to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* Decoraciones florales */}
                    <div className="absolute -top-8 -right-12 w-32 h-32 opacity-20 pointer-events-none rotate-12 blur-[2px]">
                        <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=300&auto=format&fit=crop" alt="decor" className="rounded-full" />
                    </div>
                    <div className="absolute -bottom-8 -left-12 w-40 h-40 opacity-20 pointer-events-none -rotate-12 blur-[2px]">
                        <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=300&auto=format&fit=crop" alt="decor" className="rounded-full" />
                    </div>
                </div>

                {/* Columna derecha: Nombres y fecha */}
                <div className="w-[55%] lg:w-[55%] text-left pl-4 lg:pl-8">
                    <span className="text-[11px] uppercase tracking-[0.5em] text-[#a9a9a9] mb-6 block font-light">Nuestra Boda</span>

                    <div className="mb-8">
                        <h2 className="font-script text-7xl lg:text-8xl xl:text-9xl text-[#4a4a4a] leading-[1.3]">
                            <motion.span
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 1.5 }}
                                className="block"
                            >
                                {content.couple?.person1.name || 'Alejandro'}
                            </motion.span>

                            <div className="flex items-center my-2 lg:my-4">
                                <div className="w-12 lg:w-16 h-[1px] bg-[#c0c0c0]/40" />
                                <span className="font-pinyon text-3xl lg:text-4xl mx-4 text-[#96adc0] opacity-60 italic tracking-widest">&</span>
                                <div className="w-12 lg:w-16 h-[1px] bg-[#c0c0c0]/40" />
                            </div>

                            <motion.span
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6, duration: 1.5 }}
                                className="block"
                            >
                                {content.couple?.person2.name || 'Luciana'}
                            </motion.span>
                        </h2>
                    </div>

                    <div className="space-y-2 mt-8">
                        <div className="w-16 h-[1px] bg-[#c0c0c0] mb-6 opacity-40" />
                        <p className="font-light tracking-[0.4em] text-sm uppercase text-[#a9a9a9]">{day} de {month}</p>
                        <p className="font-light tracking-[0.2em] text-xs uppercase text-[#a9a9a9] opacity-70">{year}</p>
                    </div>

                    {/* Scroll indicator solo en desktop */}
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="mt-12 flex items-center gap-3 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <div className="w-[1px] h-8 bg-gradient-to-b from-[#c0c0c0] to-transparent" />
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#a9a9a9]">Scroll</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll indicator mobile */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center"
            >
                <div className="w-[1px] h-10 bg-gradient-to-b from-[#c0c0c0] to-transparent mb-3 opacity-50" />
                <div className="text-[#96adc0] opacity-40">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                </div>
            </motion.div>
        </section>
    );
}

// Countdown Section
function CountdownSection() {
    const { features, logistics } = useInvitationData();
    const targetDate = new Date(logistics.event_date).getTime();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const TimeUnit = ({ label, value, pulse = false }: { label: string, value: number, pulse?: boolean }) => (
        <div className="flex flex-col items-center">
            <motion.div
                animate={pulse ? { scale: [1, 1.05, 1] } : {}}
                transition={pulse ? { duration: 1, repeat: Infinity } : {}}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-dashed border-[#96adc0]/40 flex items-center justify-center mb-2 relative bg-white/30 backdrop-blur-sm"
            >
                <span className="text-xl md:text-2xl font-light text-[#4a4a4a]">{value.toString().padStart(2, '0')}</span>
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#c0c0c0]" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#c0c0c0]" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#c0c0c0]" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#c0c0c0]" />
            </motion.div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#a9a9a9]">{label}</span>
        </div>
    );

    const preview = usePreviewMode();

    return (
        <FeatureGate
            isVisible={features.show_countdown}
            fallback={preview ? <EmptyStatePreview icon="⏰" title="Cuenta Regresiva" description="Mostrará la cuenta regresiva hasta el evento" /> : null}
        >
            <section className="py-20 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="max-w-xl mx-auto text-center"
                >
                    <h3 className="font-pinyon text-2xl text-[#96adc0] mb-10 tracking-widest">The Wait</h3>
                    <div className="flex justify-center gap-4 md:gap-8">
                        <TimeUnit label="Días" value={timeLeft.days} />
                        <TimeUnit label="Horas" value={timeLeft.hours} />
                        <TimeUnit label="Minutos" value={timeLeft.minutes} />
                        <TimeUnit label="Segundos" value={timeLeft.seconds} pulse={true} />
                    </div>
                </motion.div>
            </section>
        </FeatureGate>
    );
}

// Quote Section
function QuoteSection() {
    const { content } = useInvitationData();
    const quote = content.quote?.text || content.main_message;
    const preview = usePreviewMode();

    if (!quote && !preview) return null;

    return (
        <FeatureGate
            isVisible={!!content.quote || !!content.main_message}
            fallback={preview ? <EmptyStatePreview icon="💬" title="Frase o Historia" description="Una frase romántica o historia de la pareja" /> : null}
        >
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-10">
                    <svg viewBox="0 0 200 200" className="w-full h-full rotate-45">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#96adc0" strokeWidth="0.5" strokeDasharray="5 5" />
                        <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#f4d7d4" transform="rotate(30, 100, 100)" />
                        <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#96adc0" transform="rotate(90, 100, 100)" />
                        <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#f4d7d4" transform="rotate(150, 100, 100)" />
                        <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#96adc0" transform="rotate(210, 100, 100)" />
                        <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#f4d7d4" transform="rotate(270, 100, 100)" />
                        <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#96adc0" transform="rotate(330, 100, 100)" />
                    </svg>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-2xl mx-auto text-center relative z-10"
                >
                    <div className="mb-8">
                        <span className="font-pinyon text-4xl text-[#c0c0c0]">&ldquo;</span>
                    </div>
                    <p className="font-script text-3xl md:text-4xl text-[#4a4a4a] leading-relaxed mb-8 italic">
                        {quote}
                    </p>
                    <div className="w-20 h-[1px] bg-[#c0c0c0] mx-auto mb-6" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#a9a9a9]">{content.quote?.author || 'Nuestro Voto Eterno'}</span>
                </motion.div>
            </section>
        </FeatureGate>
    );
}

// Timeline Section
function TimelineSection() {
    const { features, logistics } = useInvitationData();
    const preview = usePreviewMode();

    const events = logistics.agenda.map((item, index) => {
        const icons = [
            <Heart className="w-5 h-5 text-[#96adc0]" key="heart" />,
            <GlassWater className="w-5 h-5 text-[#96adc0]" key="glass" />,
            <Sparkles className="w-5 h-5 text-[#96adc0]" key="sparkles" />,
            <Music className="w-5 h-5 text-[#96adc0]" key="music" />
        ];
        return {
            time: item.time,
            title: item.title,
            description: item.description || '',
            icon: icons[index % icons.length]
        };
    });

    return (
        <FeatureGate
            isVisible={features.show_agenda && events.length > 0}
            fallback={preview ? <EmptyStatePreview icon="📅" title="Cronograma" description="Agenda del evento con timeline" /> : null}
        >
            <section className="py-24 px-4 bg-white/20">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-16"
                    >
                        <h3 className="font-pinyon text-3xl text-[#96adc0] mb-2">The Fairytale</h3>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a9a9a9]">Cronograma del Gran Día</p>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#c0c0c0] to-transparent -translate-x-1/2" />

                        <div className="space-y-16">
                            {events.map((event, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                    className={`relative flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <div className={`w-[45%] ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                        <span className="text-[10px] tracking-[0.2em] text-[#96adc0] font-medium block mb-1">{event.time}</span>
                                        <h4 className="font-pinyon text-2xl text-[#4a4a4a] mb-1">{event.title}</h4>
                                        <p className="text-[11px] text-[#a9a9a9] tracking-wider leading-relaxed">{event.description}</p>
                                    </div>

                                    <div className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-white border border-[#c0c0c0] flex items-center justify-center shadow-sm">
                                            {event.icon}
                                        </div>
                                    </div>

                                    <div className="w-[45%]" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </FeatureGate>
    );
}

// Venues Section
function VenuesSection() {
    const { features, logistics } = useInvitationData();
    const preview = usePreviewMode();
    const venues = logistics.venues;

    return (
        <FeatureGate
            isVisible={features.show_venue_map && venues.length > 0}
            fallback={preview ? <EmptyStatePreview icon="📍" title="Ubicaciones" description="Mapa y direcciones de los venues" /> : null}
        >
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-16"
                    >
                        <h3 className="font-pinyon text-3xl text-[#96adc0] mb-2">The Venues</h3>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a9a9a9]">Donde celebraremos</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {venues.map((venue, index) => (
                            <motion.div
                                key={venue.id}
                                whileHover={{ y: -5 }}
                                className="bg-white p-10 rounded-[40px] border border-[rgba(192,192,192,0.5)] shadow-[0_0_10px_rgba(192,192,192,0.2)] text-center flex flex-col items-center transition-all duration-500"
                            >
                                <div className="w-16 h-16 bg-[#fcf9f2] rounded-full flex items-center justify-center mb-6">
                                    <MapPin className="w-6 h-6 text-[#96adc0]" />
                                </div>
                                <h4 className="font-pinyon text-3xl text-[#4a4a4a] mb-2">
                                    {venue.type === 'ceremony' ? 'Ceremonia Religiosa' : venue.type === 'reception' ? 'Recepción & Fiesta' : venue.name}
                                </h4>
                                <p className="text-xs uppercase tracking-[0.2em] text-[#96adc0] font-medium mb-4">{venue.name}</p>
                                <p className="text-[11px] text-[#a9a9a9] leading-relaxed mb-8 max-w-[250px]">
                                    {venue.address}, {venue.city}<br />
                                    {venue.instructions}
                                </p>
                                {venue.google_maps_url && (
                                    <a
                                        href={venue.google_maps_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 border border-[#c0c0c0] text-[10px] tracking-[0.3em] uppercase text-[#96adc0] rounded-full hover:bg-[#96adc0] hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <Mail className="w-3 h-3" /> Cómo llegar
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </FeatureGate>
    );
}

// Dress Code Section
function DressCodeSection() {
    const { features, logistics } = useInvitationData();
    const preview = usePreviewMode();
    const dressCode = logistics.dress_code;

    const getDressCodeLabel = (code: string) => {
        const labels: Record<string, string> = {
            formal: 'Etiqueta Formal',
            'semi-formal': 'Semi-Formal',
            cocktail: 'Cocktail',
            'casual-elegante': 'Casual Elegante',
            'black-tie': 'Black Tie',
            'white-tie': 'White Tie',
            themed: 'Temática',
            custom: 'Código de Vestimenta'
        };
        return labels[code] || 'Etiqueta';
    };

    return (
        <FeatureGate
            isVisible={features.show_dress_code && !!dressCode}
            fallback={preview ? <EmptyStatePreview icon="👔" title="Código de Vestimenta" description="Información sobre el dress code" /> : null}
        >
            <section className="py-24 px-4 bg-white/20">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-12"
                    >
                        <h3 className="font-pinyon text-3xl text-[#96adc0] mb-2">The Attire</h3>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a9a9a9]">Código de Vestimenta</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-white/50 backdrop-blur-sm rounded-[30px] p-8 md:p-12 border border-[#c0c0c0]/20 shadow-sm"
                    >
                        {/* Título principal */}
                        <h4 className="font-script text-4xl text-[#4a4a4a] text-center mb-6">
                            {getDressCodeLabel(dressCode?.code || 'formal')}
                        </h4>

                        {/* Imagen si existe */}
                        {dressCode?.image_url && (
                            <div className="mb-8 flex justify-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#c0c0c0]/30 shadow-md">
                                    <img 
                                        src={dressCode.image_url} 
                                        alt="Dress code" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Descripción */}
                        {dressCode?.description && (
                            <p className="text-[12px] text-[#4a4a4a] tracking-wider leading-relaxed text-center mb-8 italic">
                                {dressCode.description}
                            </p>
                        )}

                        {/* Sugerencias */}
                        {dressCode?.suggestions && dressCode.suggestions.length > 0 && (
                            <div className="mb-6">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#96adc0] mb-4 text-center">Sugerencias</p>
                                <ul className="space-y-2">
                                    {dressCode.suggestions.map((suggestion, index) => (
                                        <li 
                                            key={index}
                                            className="flex items-center gap-3 text-[11px] text-[#a9a9a9] tracking-wider"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#96adc0]/60 flex-shrink-0" />
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Colores a evitar */}
                        {dressCode?.colors_to_avoid && dressCode.colors_to_avoid.length > 0 && (
                            <div className="pt-6 border-t border-[#c0c0c0]/20">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#96adc0] mb-4 text-center">Colores a evitar</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {dressCode.colors_to_avoid.map((color, index) => (
                                        <span 
                                            key={index}
                                            className="px-4 py-2 bg-[#fcf9f2] rounded-full text-[10px] text-[#a9a9a9] tracking-wider border border-[#c0c0c0]/20"
                                        >
                                            {color}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        </FeatureGate>
    );
}

// Gallery Section
function GallerySection() {
    const { features, content } = useInvitationData();
    const preview = usePreviewMode();
    const containerRef = useRef<HTMLDivElement>(null);

    const baseImages = (content.gallery_images || []).map((src, index) => ({
        src,
        caption: ['El comienzo', 'Promesas', 'Nuestro lugar', 'Para siempre'][index % 4]
    }));
    
    // Duplicar imágenes para crear el efecto de loop infinito
    const images = [...baseImages, ...baseImages, ...baseImages];

    // Calcular el ancho total para la animación
    const itemWidth = typeof window !== 'undefined' && window.innerWidth >= 768 ? 320 : 280;
    const gap = typeof window !== 'undefined' && window.innerWidth >= 768 ? 40 : 24;
    const totalWidth = baseImages.length * (itemWidth + gap);

    return (
        <FeatureGate
            isVisible={features.show_gallery && baseImages.length > 0}
            fallback={preview ? <EmptyStatePreview icon="📸" title="Galería de Fotos" description="Galería con fotos de la pareja" /> : null}
        >
            <section className="py-24 px-4 overflow-hidden bg-white/5">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-12"
                    >
                        <h3 className="font-pinyon text-4xl text-[#96adc0] mb-2">The Keepsakes</h3>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#a9a9a9]">Nuestros momentos favoritos</p>
                    </motion.div>

                    <div className="relative overflow-hidden">
                        <motion.div
                            ref={containerRef}
                            animate={{ x: [-totalWidth, 0] }}
                            transition={{
                                duration: 30,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "loop"
                            }}
                            className="flex gap-6 md:gap-10 pb-12 pt-6 px-4"
                            style={{ width: 'max-content' }}
                        >
                            {images.map((img, index) => (
                                <motion.div
                                    key={`${img.src}-${index}`}
                                    className="w-[280px] md:w-[320px] select-none flex-shrink-0"
                                >
                                    <div
                                        className="bg-white p-4 shadow-[0_15px_45px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center relative group overflow-hidden"
                                        style={{
                                            rotate: index % 2 === 0 ? '-1.5deg' : '1.5deg',
                                            borderRadius: '1px'
                                        }}
                                    >
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#fcf9f2]/60 backdrop-blur-sm -translate-y-2 rotate-2 z-20 border border-black/5" />

                                        <div className="w-full aspect-[4/5] overflow-hidden mb-6 bg-[#fcf9f2] relative">
                                            <img
                                                src={img.src}
                                                alt={img.caption}
                                                draggable="false"
                                                className="w-full h-full object-cover sepia-[0.1] contrast-[0.98] transition-transform duration-[3s] group-hover:scale-110 pointer-events-none"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
        </FeatureGate>
    );
}

// Gifts Section
function GiftsSection() {
    const { features } = useInvitationData();
    const preview = usePreviewMode();
    const giftRegistry = features.gift_registry;
    const [copied, setCopied] = useState(false);

    const handleCopyAlias = () => {
        if (giftRegistry?.bank_details?.alias) {
            navigator.clipboard.writeText(giftRegistry.bank_details.alias);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <FeatureGate
            isVisible={features.show_gift_registry && !!giftRegistry?.enabled}
            fallback={preview ? <EmptyStatePreview icon="🎁" title="Mesa de Regalos" description="Alias y opciones de regalos" /> : null}
        >
            <section className="py-24 px-4">
                <div className="max-w-xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mb-12"
                    >
                        <h3 className="font-pinyon text-3xl text-[#96adc0] mb-2">The Love Fund</h3>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a9a9a9]">Mesa de Regalos</p>
                    </motion.div>

                    <div className="bg-white/40 backdrop-blur-sm p-10 rounded-[30px] border border-[#c0c0c0]/20 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#96adc0]/20" />

                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-[#fcf9f2] flex items-center justify-center border border-[#c0c0c0]/30 shadow-inner">
                                <Gift className="w-6 h-6 text-[#96adc0]" />
                            </div>
                        </div>

                        <p className="text-[11px] text-[#a9a9a9] tracking-widest leading-relaxed mb-8 italic">
                            {giftRegistry?.message || `"Vuestra presencia es nuestro mejor regalo,
                            pero si deseáis tener un detalle con nosotros,
                            os agradecemos vuestro cariño a través de nuestro fondo de amor."`}
                        </p>

                        <div className="space-y-4 text-center">
                            {/* Alias Copiable - Estilo botón elegante */}
                            {giftRegistry?.bank_details?.alias && (
                                <div className="space-y-2">
                                    <p className="text-[9px] uppercase tracking-widest text-[#a9a9a9]">Alias para transferir</p>
                                    <button
                                        onClick={handleCopyAlias}
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#96adc0] text-white text-[10px] tracking-[0.2em] uppercase rounded-full hover:bg-[#4a4a4a] transition-all shadow-md w-full justify-center"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        {copied ? '¡Copiado!' : giftRegistry.bank_details.alias}
                                    </button>
                                    <p className="text-[9px] text-[#96adc0]">Titular: {giftRegistry.bank_details.account_holder}</p>
                                </div>
                            )}

                            {/* Botón a lista de regalos externa */}
                            {giftRegistry?.registries && giftRegistry.registries.length > 0 && (
                                <div className="space-y-3">
                                    {giftRegistry.registries.map((registry, index) => (
                                        <a
                                            key={index}
                                            href={registry.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-8 py-3 bg-[#96adc0] text-white text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-[#4a4a4a] transition-all shadow-md w-full justify-center"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            Ver lista en {registry.platform === 'mercado-libre' || registry.platform === 'mercadolibre' ? 'Mercado Libre' : registry.platform}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </FeatureGate>
    );
}

// RSVP Section
function RSVPSection() {
    const { features, metadata } = useInvitationData();
    const preview = usePreviewMode();
    const rsvp = features.rsvp;

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', attendance: 'yes', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await submitRSVP({
                invitationId: metadata.id,
                name: formData.name,
                attendance: formData.attendance === 'yes',
                guestsCount: 0,
                message: formData.message
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting RSVP:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FeatureGate
            isVisible={features.show_rsvp && rsvp.enabled}
            fallback={preview ? <EmptyStatePreview icon="✉️" title="RSVP" description="Formulario de confirmación de asistencia" /> : null}
        >
            <section id="rsvp-section" className="py-24 px-4 bg-[#fcf9f2]"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/handmade-paper.png")' }}>
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-12"
                    >
                        <h3 className="font-pinyon text-4xl text-[#96adc0] mb-2">The Response</h3>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#a9a9a9]">Por favor confirma tu asistencia</p>
                    </motion.div>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white p-8 md:p-12 shadow-2xl rounded-sm border border-gray-100 relative"
                                >
                                    <div className="absolute inset-0 border-[15px] border-white z-0 pointer-events-none" />

                                    <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                                        <div>
                                            <label className="text-[9px] uppercase tracking-widest text-[#a9a9a9] block mb-2">Nombre Completo</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-transparent border-b border-[#c0c0c0] py-2 text-sm focus:outline-none focus:border-[#96adc0] transition-colors font-light tracking-wide"
                                                placeholder="Escribe tu nombre..."
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[9px] uppercase tracking-widest text-[#a9a9a9] block mb-2">¿Asistirás?</label>
                                            <div className="flex gap-8 mt-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="attendance"
                                                        value="yes"
                                                        checked={formData.attendance === 'yes'}
                                                        onChange={() => setFormData({ ...formData, attendance: 'yes' })}
                                                        className="accent-[#96adc0]"
                                                    />
                                                    <span className="text-[11px] uppercase tracking-wider text-[#4a4a4a]">Confirmar Asistencia</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer opacity-50">
                                                    <input
                                                        type="radio"
                                                        name="attendance"
                                                        value="no"
                                                        checked={formData.attendance === 'no'}
                                                        onChange={() => setFormData({ ...formData, attendance: 'no' })}
                                                        className="accent-[#a9a9a9]"
                                                    />
                                                    <span className="text-[11px] uppercase tracking-wider text-[#4a4a4a]">No podré asistir</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[9px] uppercase tracking-widest text-[#a9a9a9] block mb-2">Algún mensaje o restricción alimentaria</label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-transparent border border-[#c0c0c0]/50 p-4 text-sm focus:outline-none focus:border-[#96adc0] transition-colors font-light tracking-wide resize-none italic"
                                                placeholder="Ej. Vegetariano, alergias..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <div className="text-center pt-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-10 py-3 bg-[#96adc0] text-white text-[10px] tracking-[0.4em] uppercase rounded-full hover:bg-[#4a4a4a] transition-all duration-500 shadow-md shadow-[#96adc0]/20 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
                                            </button>
                                        </div>

                                        {rsvp.deadline && (
                                            <p className="text-center text-[9px] text-[#a9a9a9] mt-6 tracking-widest">
                                                Favor de confirmar antes del {new Date(rsvp.deadline).toLocaleDateString('es-ES')}
                                            </p>
                                        )}
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-12 text-center rounded-sm border border-gray-100 shadow-2xl relative min-h-[400px] flex flex-col items-center justify-center"
                                >
                                    <motion.div
                                        initial={{ scale: 3, opacity: 0, rotate: -45 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
                                        className="mb-8"
                                    >
                                        <div className="w-20 h-20 bg-[#f4d7d4] rounded-full flex items-center justify-center shadow-lg relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-300/30 to-transparent" />
                                            <span className="font-script text-4xl text-[#4a4a4a] relative z-10">
                                                {useInvitationData().content.couple?.person1.name?.charAt(0) || 'A'}
                                                {useInvitationData().content.couple?.person2.name?.charAt(0) || 'L'}
                                            </span>
                                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#f4d7d4] rounded-full blur-[2px]" />
                                        </div>
                                    </motion.div>

                                    <h4 className="font-pinyon text-4xl text-[#4a4a4a] mb-4">Gracias</h4>
                                    <p className="text-[11px] text-[#a9a9a9] tracking-widest uppercase italic max-w-xs mx-auto">
                                        Tu mensaje ha sido sellado con amor. <br /> Esperamos verte pronto.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </FeatureGate>
    );
}

// Music Section
function MusicSection() {
    const { features, metadata } = useInvitationData();
    const preview = usePreviewMode();
    const music = features.music;
    
    const [songSuggestion, setSongSuggestion] = useState('');
    const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitSuggestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!songSuggestion.trim()) return;
        
        setIsSubmitting(true);
        try {
            await submitRSVP({
                invitationId: metadata.id,
                name: 'Invitado',
                attendance: true,
                guestsCount: 0,
                musicSuggestion: songSuggestion
            });
            setSuggestionSubmitted(true);
        } catch (error) {
            console.error('Error submitting suggestion:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FeatureGate
            isVisible={features.show_music && !!music?.enabled}
            fallback={preview ? <EmptyStatePreview icon="🎵" title="Música" description="Sugerir canciones para la fiesta" /> : null}
        >
            <section className="py-24 px-4 bg-[#fcf9f2] relative overflow-hidden"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/handmade-paper.png")' }}>
                {/* Decoración sutil */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c0c0c0]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c0c0c0]/30 to-transparent" />
                
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-10"
                    >
                        <h3 className="font-pinyon text-4xl text-[#96adc0] mb-2">The Melody</h3>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a9a9a9]">Sugiere una canción</p>
                        <div className="w-12 h-[1px] bg-[#c0c0c0]/40 mx-auto mt-6" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-white/60 backdrop-blur-sm rounded-[30px] p-8 border border-[#c0c0c0]/20 shadow-sm"
                    >
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 mx-auto rounded-full bg-[#f4d7d4]/30 flex items-center justify-center mb-4 border border-[#f4d7d4]/40">
                                <svg className="w-8 h-8 text-[#96adc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                                </svg>
                            </div>
                            <h4 className="text-[12px] uppercase tracking-[0.2em] text-[#4a4a4a] mb-2">¿Qué canción no puede faltar?</h4>
                            <p className="text-[10px] text-[#a9a9a9] tracking-widest">Ayúdanos a crear la playlist perfecta</p>
                        </div>

                        {!suggestionSubmitted ? (
                            <form onSubmit={handleSubmitSuggestion}>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={songSuggestion}
                                        onChange={(e) => setSongSuggestion(e.target.value)}
                                        placeholder="Nombre de la canción y artista..."
                                        className="w-full px-5 py-4 bg-white/50 border border-[#c0c0c0]/30 rounded-full text-[13px] text-[#4a4a4a] placeholder:text-[#a9a9a9] focus:outline-none focus:border-[#96adc0] transition-colors text-center"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !songSuggestion.trim()}
                                        className="w-full px-6 py-4 bg-[#96adc0] text-white text-[11px] tracking-[0.2em] uppercase rounded-full hover:bg-[#4a4a4a] transition-all disabled:opacity-50 shadow-md"
                                    >
                                        {isSubmitting ? 'Enviando...' : 'Sugerir canción'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <svg className="w-12 h-12 text-[#96adc0] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-[14px] text-[#4a4a4a] italic mb-2">¡Gracias por tu sugerencia!</p>
                                <p className="text-[11px] text-[#a9a9a9]">"{songSuggestion}"</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        </FeatureGate>
    );
}

// Footer Section
function FooterSection() {
    const { content, logistics } = useInvitationData();
    const eventDate = new Date(logistics.event_date);

    return (
        <footer className="py-32 px-4 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#96adc0]/10 to-transparent -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2 }}
                className="relative z-10"
            >
                <div className="mb-12 flex justify-center opacity-30">
                    <Heart className="w-16 h-16 stroke-1 text-[#4a4a4a]" />
                </div>

                <h3 className="font-pinyon text-4xl text-[#96adc0] mb-4">Contando los días para vernos</h3>
                <p className="font-script text-5xl text-[#4a4a4a] mb-12">
                    {content.couple?.person1.name || 'Alejandro'} & {content.couple?.person2.name || 'Luciana'}
                </p>

                <div className="space-y-2 mb-16">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-[#a9a9a9]">
                        {eventDate.getDate()} . {eventDate.getMonth() + 1} . {eventDate.getFullYear()}
                    </p>
                    <div className="w-8 h-[1px] bg-[#c0c0c0] mx-auto" />
                </div>

                <div className="text-[9px] uppercase tracking-[0.2em] text-[#c0c0c0]">
                    Hecho con amor • {new Date().getFullYear()}
                </div>
            </motion.div>

            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#f4d7d4]/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#96adc0]/10 rounded-full blur-[80px]" />
        </footer>
    );
}

// RSVP Float Button
function RSVPFloatButton({ onClick }: { onClick: () => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight * 0.8; // 80% del viewport
            const pastHero = scrollY > heroHeight;
            
            setHasScrolledPastHero(pastHero);
            
            // Solo mostrar si pasamos el hero y no estamos en la sección RSVP
            const rsvpSection = document.getElementById('rsvp-section');
            if (rsvpSection && pastHero) {
                const rsvpRect = rsvpSection.getBoundingClientRect();
                const isInRSVPSection = rsvpRect.top < window.innerHeight && rsvpRect.bottom > 0;
                setIsVisible(!isInRSVPSection);
            } else {
                setIsVisible(pastHero);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial state
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    onClick={onClick}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 
                        bg-[#96adc0]/95 backdrop-blur-md 
                        px-8 py-4 rounded-full 
                        shadow-[0_8px_30px_rgba(150,173,192,0.4)]
                        hover:shadow-[0_12px_40px_rgba(150,173,192,0.5)]
                        hover:scale-105 hover:bg-[#4a4a4a]/95
                        active:scale-95
                        transition-all duration-300 ease-out
                        group"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-white text-[10px] tracking-[0.3em] uppercase font-medium">
                            Confirmar asistencia
                        </span>
                        <svg 
                            className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                            />
                        </svg>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#96adc0]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
function AudioControl({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onToggle}
            className="fixed bottom-6 right-6 z-50 bg-white/40 backdrop-blur-md p-4 rounded-full border border-white/50 shadow-lg hover:bg-white/60 transition-all active:scale-95 group overflow-hidden"
            aria-label={isPlaying ? "Silenciar música" : "Reproducir música"}
        >
            {isPlaying ? (
                <div className="relative">
                    <Music className="w-5 h-5 text-[#96adc0]" />
                    <motion.div
                        animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute inset-0 bg-[#96adc0] rounded-full -z-10"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 bg-[#96adc0] rounded-full -z-10"
                    />
                </div>
            ) : (
                <div className="relative opacity-40">
                    <Music className="w-5 h-5 text-[#a9a9a9]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1.5px] bg-[#a9a9a9] rotate-45" />
                </div>
            )}
        </motion.button>
    );
}

// Main Layout Component
export function SoftSeraphicLayout({ invitation, preview }: SoftSeraphicLayoutProps) {
    // Store data for child components
    invitationData = invitation;
    previewMode = preview || false;

    const [hasStarted, setHasStarted] = useState(preview || false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const startInvitation = () => {
        setHasStarted(true);
        if (audioRef.current && invitation.features.music?.track_url) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(err => console.log("Audio play blocked:", err));
        }
    };

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const scrollToRSVP = () => {
        const rsvpSection = document.getElementById('rsvp-section');
        if (rsvpSection) {
            rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden selection:bg-pink-100"
            style={{
                backgroundColor: '#fcf9f2',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/handmade-paper.png")',
                color: '#4a4a4a'
            }}>

            {invitation.features.music?.track_url && (
                <audio
                    ref={audioRef}
                    loop
                    src={invitation.features.music.track_url}
                />
            )}

            <AnimatePresence>
                {!hasStarted && <SplashScreen onStart={startInvitation} />}
            </AnimatePresence>

            {hasStarted && (
                <motion.main
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="relative"
                >
                    <FallingPetals />

                    <HeroSection />
                    <CountdownSection />
                    <QuoteSection />
                    <TimelineSection />
                    <VenuesSection />
                    <DressCodeSection />
                    <GallerySection />
                    <GiftsSection />
                    <RSVPSection />
                    <MusicSection />
                    <FooterSection />
                </motion.main>
            )}

            {/* Botón flotante de confirmación - solo si RSVP está habilitado */}
            {hasStarted && invitation.features.show_rsvp && invitation.features.rsvp?.enabled && (
                <RSVPFloatButton onClick={scrollToRSVP} />
            )}
        </div>
    );
}
