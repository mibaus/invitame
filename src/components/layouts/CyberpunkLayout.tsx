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
    Loader2,
    Cpu,
    Zap,
    Terminal,
    Radio,
    Database,
    Wifi,
    Signal,
    Binary,
    Code2,
    ScanLine,
    Disc3,
    Headphones,
    CheckCircle2
} from 'lucide-react';
import { InvitationSchema } from '@/types';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { createClient } from '@supabase/supabase-js';
import { submitRSVP } from '@/app/actions/rsvp';

interface CyberpunkLayoutProps {
    invitation: InvitationSchema;
    preview?: boolean;
    previewMobile?: boolean;
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Empty state component
function EmptyStatePreview({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="py-16 px-6 text-center bg-black border-2 border-dashed border-cyan-500/30">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-medium mb-2 text-cyan-400 font-mono">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    );
}

// Glitch text effect component
function GlitchText({ children, className = '' }: { children: string; className?: string }) {
    return (
        <span className={`relative inline-block ${className}`}>
            <span className="relative z-10">{children}</span>
            <span className="absolute top-0 left-0 -z-10 text-fuchsia-500 opacity-50 animate-pulse" style={{ clipPath: 'inset(0 0 50% 0)', transform: 'translateX(-2px)' }}>
                {children}
            </span>
            <span className="absolute top-0 left-0 -z-10 text-cyan-500 opacity-50 animate-pulse" style={{ clipPath: 'inset(50% 0 0 0)', transform: 'translateX(2px)' }}>
                {children}
            </span>
        </span>
    );
}

// Scanline overlay
function Scanlines() {
    return (
        <div className="pointer-events-none fixed inset-0 z-50 opacity-20 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.03)_50%)] bg-[length:100%_4px] animate-scanline" />
        </div>
    );
}

// Digital rain background
function DigitalRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const columns = canvas.width / 20;
        const drops: number[] = Array(Math.floor(columns)).fill(1);
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff41';
            ctx.font = '15px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 20, drops[i] * 20);
                
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        const interval = setInterval(draw, 50);
        return () => clearInterval(interval);
    }, []);
    
    return <canvas ref={canvasRef} className="fixed inset-0 opacity-10 pointer-events-none z-0" />;
}

// FLOATING RSVP BUTTON - System Alert
function FloatingRSVPButton({ features }: { features: InvitationSchema['features'] }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const heroSection = document.getElementById('cyberpunk-hero');
        if (!heroSection) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Show button when hero is NOT intersecting (scrolled past)
                setIsVisible(!entry.isIntersecting);
            },
            { threshold: 0.1, rootMargin: '-50px' }
        );

        observer.observe(heroSection);
        return () => observer.disconnect();
    }, []);

    const scrollToRSVP = () => {
        const rsvpSection = document.getElementById('cyberpunk-rsvp');
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
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Glow effect */}
                    <motion.div
                        animate={{ 
                            boxShadow: isHovered 
                                ? '0 0 40px rgba(34, 211, 238, 0.6), 0 0 80px rgba(232, 121, 249, 0.3)' 
                                : '0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(232, 121, 249, 0.15)'
                        }}
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 blur-xl opacity-60"
                    />
                    
                    {/* Button */}
                    <motion.button
                        onClick={scrollToRSVP}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative flex items-center gap-3 bg-black border-2 border-cyan-400 px-6 py-4 rounded-lg font-mono text-sm uppercase tracking-wider text-cyan-400 hover:text-white hover:border-fuchsia-400 transition-colors group overflow-hidden"
                    >
                        {/* Animated background gradient */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-cyan-500/20"
                            animate={{ x: isHovered ? ['0%', '100%', '0%'] : '0%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                        
                        {/* Pulsing indicator */}
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                        </span>
                        
                        <span className="relative z-10 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="hidden sm:inline">Confirmar Asistencia</span>
                            <span className="sm:hidden">Confirmar</span>
                        </span>
                        
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400 group-hover:border-fuchsia-400 transition-colors" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 group-hover:border-fuchsia-400 transition-colors" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400 group-hover:border-fuchsia-400 transition-colors" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400 group-hover:border-fuchsia-400 transition-colors" />
                    </motion.button>
                    
                    {/* Status text below */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-400/60 whitespace-nowrap"
                    >
                        CLICK_TO_INITIATE_PROTOCOL
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
function HeroSection({ content, logistics }: { content: InvitationSchema['content']; logistics: InvitationSchema['logistics'] }) {
    const scrollToContent = () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    };

    const eventDate = new Date(logistics.event_date);
    const day = eventDate.getDate().toString().padStart(2, '0');
    const month = eventDate.toLocaleDateString('es-ES', { month: 'long' });
    const year = eventDate.getFullYear();

    return (
        <section id="cyberpunk-hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Cyberpunk city background with rain effect */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{
                        backgroundImage: `url(${content.cover_image || 'https://images.unsplash.com/photo-1515630278258-407f66498911?auto=format&fit=crop&q=80&w=1920'})`,
                        filter: 'contrast(1.2) saturate(0.8) hue-rotate(180deg)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-900/30 via-cyan-900/20 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_70%)]" />
            </div>
            
            {/* HUD Grid */}
            <div className="absolute inset-0 z-5 opacity-20" style={{
                backgroundImage: `
                    linear-gradient(to right, rgba(0,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
            }} />

            {/* Corner HUD decorations */}
            <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-mono text-xs tracking-widest">SYS.ONLINE</span>
            </div>
            <div className="absolute top-8 right-8 z-20 text-right">
                <div className="text-fuchsia-400 font-mono text-xs tracking-widest">LAT: {logistics.venues[0]?.coordinates?.lat?.toFixed(4) || '34.6037'}</div>
                <div className="text-fuchsia-400 font-mono text-xs tracking-widest">LNG: {logistics.venues[0]?.coordinates?.lng?.toFixed(4) || '-58.3816'}</div>
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Signal className="w-4 h-4 text-green-400 animate-pulse" />
                        <span className="text-green-400 font-mono text-sm tracking-[0.3em] uppercase">Conexión establecida</span>
                        <Signal className="w-4 h-4 text-green-400 animate-pulse" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <h1 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 mb-6 tracking-wider uppercase" style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}>
                        <GlitchText>{content.couple?.person1.name || 'NOVA'}</GlitchText>
                        <span className="mx-4 text-green-400 animate-pulse">::</span>
                        <GlitchText>{content.couple?.person2.name || 'CYBER'}</GlitchText>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="font-mono text-lg md:text-xl text-cyan-300 mb-4 tracking-widest"
                >
                    <span className="border border-cyan-500/50 px-4 py-2 bg-black/50">
                        {day}.{month.toUpperCase()}.{year}
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    className="text-slate-400 font-mono text-sm tracking-widest uppercase"
                >
                    <Terminal className="w-4 h-4 inline mr-2 text-green-400" />
                    {logistics.venues[0]?.city || 'BUENOS_AIRES'}, {logistics.venues[0]?.country || 'ARGENTINA'}_SECTOR
                </motion.div>

                {/* Holographic frame */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="mt-12 mx-auto w-64 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                />
            </div>

            {/* Scroll indicator with circuit pattern */}
            <motion.button
                onClick={scrollToContent}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-cyan-500 flex items-center justify-center bg-black/50">
                        <div className="absolute inset-0 rounded-full border border-fuchsia-500 animate-ping opacity-30" />
                        <ChevronDown className="w-6 h-6 text-cyan-400 animate-pulse" />
                    </div>
                    <div className="absolute -inset-2 border border-dashed border-cyan-500/30 rounded-full" />
                </div>
                <span className="block mt-4 text-cyan-400 font-mono text-xs tracking-widest text-center">DESCARGAR_DATOS</span>
            </motion.button>
        </section>
    );
}

// COUNTDOWN SECTION - The System Clock
function CountdownSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const targetDate = new Date(logistics.event_date).getTime();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [glitchTrigger, setGlitchTrigger] = useState(0);

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
                if (Math.random() > 0.9) setGlitchTrigger(prev => prev + 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    const TimeUnit = ({ value, label, color }: { value: number; label: string; color: string }) => (
        <div className="flex flex-col items-center">
            <motion.div
                key={`${value}-${glitchTrigger}`}
                initial={glitchTrigger > 0 ? { x: [-2, 2, -2, 0], opacity: [1, 0.8, 1] } : {}}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono ${color} mb-2 bg-black/50 px-2 sm:px-4 py-2 border border-current min-w-[70px] sm:min-w-[90px] md:min-w-[110px] text-center`}
                style={{ textShadow: `0 0 20px ${color === 'text-cyan-400' ? '#22d3ee' : color === 'text-fuchsia-400' ? '#e879f9' : '#4ade80'}` }}
            >
                {String(value).padStart(2, '0')}
            </motion.div>
            <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest font-mono">{label}</div>
        </div>
    );

    return (
        <section className="relative py-16 sm:py-20 px-4 bg-black overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(to right, #00ffff 1px, transparent 1px),
                                  linear-gradient(to bottom, #00ffff 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto relative z-10"
            >
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
                    <ScanLine className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl md:text-3xl text-cyan-400 font-mono tracking-widest uppercase text-center">Reloj del Sistema</h2>
                    <ScanLine className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
                    <TimeUnit value={timeLeft.days} label="Días" color="text-cyan-400" />
                    <TimeUnit value={timeLeft.hours} label="Horas" color="text-fuchsia-400" />
                    <TimeUnit value={timeLeft.minutes} label="Min" color="text-green-400" />
                    <TimeUnit value={timeLeft.seconds} label="Seg" color="text-cyan-400" />
                </div>

                <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />SYNC_ACTIVE</span>
                    <span className="hidden sm:inline">|</span>
                    <span>PROTOCOL: WEDDING_V1.0</span>
                </div>
            </motion.div>
        </section>
    );
}

// QUOTE SECTION - The Manifesto Encrypted
function QuoteSection({ content }: { content: InvitationSchema['content'] }) {
    const quoteText = content.quote?.text || content.couple?.love_story ||
        'Nuestros códigos se sincronizaron en el momento exacto. Ahora iniciamos el protocolo de unión eterna.';
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i <= quoteText.length) {
                setDisplayText(quoteText.slice(0, i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [quoteText]);

    useEffect(() => {
        const cursor = setInterval(() => setShowCursor(prev => !prev), 500);
        return () => clearInterval(cursor);
    }, []);

    return (
        <section className="relative py-24 px-4 bg-zinc-950 overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <Binary className="w-5 h-5 text-fuchsia-400" />
                        <span className="text-fuchsia-400 font-mono text-sm tracking-widest">ENCRYPTED_MESSAGE</span>
                        <Binary className="w-5 h-5 text-fuchsia-400" />
                    </div>

                    <div className="relative bg-black/50 border border-fuchsia-500/30 p-8 md:p-12 rounded-lg">
                        <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-2 border-b border-fuchsia-500/30 bg-fuchsia-500/10">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="ml-4 text-xs text-fuchsia-400 font-mono">manifesto.exe</span>
                        </div>

                        <div className="mt-8 font-mono text-lg md:text-xl text-cyan-300 leading-relaxed text-left">
                            <span className="text-green-400 mr-2">$</span>
                            {displayText}
                            <span className={`inline-block w-3 h-5 bg-cyan-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
                        </div>

                        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen">
                            <div className="absolute inset-0 text-fuchsia-400 font-mono text-lg md:text-xl p-8 mt-8" style={{ transform: 'translateX(2px)' }}>
                                {displayText}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400" />
                        <Wifi className="w-5 h-5 text-cyan-400 animate-pulse" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// TIMELINE SECTION - The Protocol Schedule
function TimelineSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const events = logistics.agenda.length > 0
        ? logistics.agenda.map((item, idx) => ({
            time: item.time,
            icon: [Church, Wine, Cake, Music][idx % 4],
            title: item.title,
            description: item.description || ''
        }))
        : [
            { time: '18:00', icon: Church, title: 'Ceremonia', description: 'Protocolo de unión' },
            { time: '19:30', icon: Wine, title: 'Cóctel', description: 'Sincronización social' },
            { time: '21:00', icon: Cake, title: 'Cena', description: 'Carga de energía' },
            { time: '23:00', icon: Music, title: 'Fiesta', description: 'Ejecución total' }
        ];

    return (
        <section className="relative py-24 px-4 bg-black overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)]" />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto relative z-10"
            >
                <div className="flex items-center justify-center gap-4 mb-12 md:mb-16">
                    <Cpu className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400 flex-shrink-0" />
                    <h2 className="text-xl md:text-3xl text-fuchsia-400 font-mono tracking-widest uppercase text-center">Protocolo Schedule</h2>
                    <Cpu className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400 flex-shrink-0" />
                </div>

                <div className="relative">
                    {/* Timeline line - left on mobile (more space), center on desktop */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-fuchsia-500 to-cyan-500 md:-translate-x-1/2">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-fuchsia-400 to-cyan-400 animate-pulse opacity-50" />
                    </div>

                    {events.map((event, index) => {
                        const Icon = event.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative flex items-center mb-10 md:mb-16 min-h-[100px] md:min-h-0"
                            >
                                {/* Content card - right side with proper left padding on mobile */}
                                <div className={`pl-24 md:pl-0 w-full md:w-1/2 ${index % 2 === 0 ? 'md:mr-auto md:pr-16 md:text-right' : 'md:ml-auto md:pl-16 md:text-left'}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-zinc-950/90 border border-cyan-500/30 p-4 md:p-5 rounded-lg backdrop-blur-sm"
                                    >
                                        <h3 className="text-lg md:text-xl text-cyan-400 font-mono mb-1">{event.title}</h3>
                                        <p className="text-slate-400 mb-1 text-sm leading-relaxed">{event.description}</p>
                                        <p className="text-fuchsia-400 font-mono text-base md:text-lg">{event.time}</p>
                                    </motion.div>
                                </div>

                                {/* Node - on timeline line */}
                                <div className="absolute left-8 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black border-2 border-cyan-400 flex items-center justify-center z-20 shadow-lg shadow-cyan-400/30">
                                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                                    <div className="absolute inset-0 rounded-full border border-fuchsia-400 animate-ping opacity-30" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}

// VENUES SECTION - The Coordinates
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
                title: 'Ceremonia Principal',
                name: 'Sector A - Catedral del Código',
                address: 'Av. Libertador 5234, Palermo, Buenos Aires',
                time: '18:00',
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d-58.420469!3d-34.603722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjQiUyA1OMKwMjUnMTMuNyJX!5e0!3m2!1sen!2sar!4v1234567890',
                mapsLink: 'https://maps.google.com/?q=Palermo,Buenos+Aires',
                calendarLink: generateCalendarLink({
                    title: 'Ceremonia',
                    name: 'Catedral del Código',
                    address: 'Av. Libertador 5234',
                    time: '18:00'
                }, eventDate)
            },
            {
                title: 'Nodo de Celebración',
                name: 'Hub Neural Events',
                address: 'Thames 2456, Palermo Soho, Buenos Aires',
                time: '19:30',
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168753236905!2d-58.420469!3d-34.603722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjQiUyA1OMKwMjUnMTMuNyJX!5e0!3m2!1sen!2sar!4v1234567890',
                mapsLink: 'https://maps.google.com/?q=Palermo+Soho,Buenos+Aires',
                calendarLink: generateCalendarLink({
                    title: 'Celebración',
                    name: 'Hub Neural Events',
                    address: 'Thames 2456',
                    time: '19:30'
                }, eventDate)
            }
        ];

    return (
        <section className="relative py-24 px-4 bg-zinc-950 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto relative z-10"
            >
                <div className="flex items-center justify-center gap-4 mb-16">
                    <Database className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-2xl md:text-3xl text-cyan-400 font-mono tracking-widest uppercase">Coordenadas</h2>
                    <Database className="w-6 h-6 text-cyan-400" />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {venues.map((venue, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-black border border-cyan-500/30 rounded-lg overflow-hidden group hover:border-cyan-400 transition-colors"
                        >
                            <div className="bg-zinc-900 px-4 py-2 flex items-center gap-2 border-b border-cyan-500/30">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-4 text-xs text-cyan-400 font-mono">{venue.title.toLowerCase().replace(/\s/g, '_')}.sys</span>
                            </div>

                            <div className="h-48 relative overflow-hidden">
                                <iframe
                                    src={venue.mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'invert(1) hue-rotate(180deg)' }}
                                    loading="lazy"
                                />
                                <motion.div
                                    animate={{ y: [-192, 192] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50"
                                />
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl text-fuchsia-400 font-mono mb-2 uppercase tracking-wider">{venue.title}</h3>
                                <h4 className="text-2xl text-white mb-4">{venue.name}</h4>
                                <p className="text-slate-400 mb-6 flex items-start font-mono text-sm">
                                    <MapPin className="w-5 h-5 mr-2 mt-0.5 text-cyan-400 flex-shrink-0" />
                                    {venue.address}
                                </p>

                                <div className="flex gap-3">
                                    <a
                                        href={venue.mapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-cyan-500/20 border border-cyan-500 text-cyan-400 px-4 py-3 rounded font-mono text-sm hover:bg-cyan-500/30 hover:text-cyan-300 transition-colors text-center uppercase tracking-wider"
                                    >
                                        Cómo llegar
                                    </a>
                                    <a
                                        href={venue.calendarLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-fuchsia-500/20 border border-fuchsia-500 text-fuchsia-400 px-4 py-3 rounded font-mono text-sm hover:bg-fuchsia-500/30 hover:text-fuchsia-300 transition-colors"
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

// DRESS CODE SECTION - The Bio-Upgrade
function DressCodeSection({ logistics }: { logistics: InvitationSchema['logistics'] }) {
    const [selectedFigure, setSelectedFigure] = useState<number | null>(null);

    const dressCodeText = logistics.dress_code?.code === 'formal' ? 'Formal Elegante' :
        logistics.dress_code?.code === 'black-tie' ? 'Black Tie' :
            logistics.dress_code?.code === 'cocktail' ? 'Cocktail' :
                logistics.dress_code?.description || 'Formal Elegante';

    const figures = [
        { icon: Shirt, label: 'Masculino', color: 'cyan' },
        { icon: Sparkles, label: 'Femenino', color: 'fuchsia' }
    ];

    return (
        <section className="relative py-24 px-4 bg-black overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center relative z-10"
            >
                <div className="flex items-center justify-center gap-4 mb-12">
                    <Zap className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl md:text-3xl text-green-400 font-mono tracking-widest uppercase">Bio-Upgrade</h2>
                    <Zap className="w-6 h-6 text-green-400" />
                </div>

                <div className="flex justify-center gap-8 mb-8">
                    {figures.map((figure, index) => {
                        const Icon = figure.icon;
                        const isSelected = selectedFigure === index;
                        const isOtherSelected = selectedFigure !== null && selectedFigure !== index;

                        return (
                            <motion.button
                                key={index}
                                onClick={() => setSelectedFigure(index)}
                                whileHover={{ scale: 1.1 }}
                                animate={{
                                    opacity: isOtherSelected ? 0.3 : 1,
                                    boxShadow: isSelected ? `0 0 30px ${figure.color === 'cyan' ? '#22d3ee' : '#e879f9'}` : '0 0 0px transparent'
                                }}
                                className={`relative w-24 h-24 rounded-lg bg-zinc-950 border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                                    figure.color === 'cyan' ? 'border-cyan-400 hover:border-cyan-300' : 'border-fuchsia-400 hover:border-fuchsia-300'
                                }`}
                            >
                                <Icon className={`w-10 h-10 ${figure.color === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-400'}`} />
                                <span className={`text-xs mt-2 font-mono ${figure.color === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-400'}`}>{figure.label}</span>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`absolute -inset-2 rounded-lg bg-gradient-to-r ${figure.color === 'cyan' ? 'from-cyan-500/20 to-transparent' : 'from-fuchsia-500/20 to-transparent'} blur-xl`}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="bg-zinc-950/80 border border-green-500/30 p-8 rounded-lg inline-block">
                    <h3 className="text-3xl md:text-4xl text-green-400 font-mono mb-4 uppercase tracking-wider">{dressCodeText}</h3>
                    <p className="text-slate-400 font-mono text-sm max-w-md">
                        Protocolo de vestimenta activado. Se recomienda implementar estética cyber-romance con elementos neón y textiles premium.
                    </p>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 text-xs font-mono text-slate-500">
                    <span>STATUS: ACTIVE</span>
                    <span>|</span>
                    <span>OPTIMIZATION: 100%</span>
                </div>
            </motion.div>
        </section>
    );
}

// GALLERY SECTION - The Memory Chip (Auto-sliding Carousel)
function GallerySection({ content }: { content: InvitationSchema['content'] }) {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const photos = content.gallery_images?.length
        ? content.gallery_images
        : [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
            'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
            'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
            'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80',
            'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80'
        ];

    // Auto-slide effect
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % photos.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [photos.length, isPaused]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    return (
        <section className="relative py-24 px-4 bg-zinc-950 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto relative z-10"
            >
                <div className="flex items-center justify-center gap-4 mb-12">
                    <Disc3 className="w-6 h-6 text-fuchsia-400 animate-spin" style={{ animationDuration: '3s' }} />
                    <h2 className="text-2xl md:text-3xl text-fuchsia-400 font-mono tracking-widest uppercase">Memory Chip</h2>
                    <Disc3 className="w-6 h-6 text-fuchsia-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs font-mono text-green-400">STREAM_ACTIVE</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                        FRAME: {String(currentIndex + 1).padStart(2, '0')}/{String(photos.length).padStart(2, '0')}
                    </span>
                </div>

                {/* Carousel container */}
                <div 
                    className="relative bg-black border-2 border-cyan-500/30 rounded-lg overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Main slide area */}
                    <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 cursor-pointer"
                                onClick={() => setSelectedPhoto(photos[currentIndex])}
                            >
                                <img
                                    src={photos[currentIndex]}
                                    alt={`Memory ${currentIndex + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {/* Scanline overlay on image */}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />
                                
                                {/* Corner decorations */}
                                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
                                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
                                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
                                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

                                {/* Frame counter */}
                                <div className="absolute bottom-4 right-16 bg-black/70 px-3 py-1 rounded font-mono text-cyan-400 text-sm">
                                    #{String(currentIndex + 1).padStart(3, '0')}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation arrows */}
                        <button
                            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 border border-cyan-500/50 rounded-full flex items-center justify-center hover:bg-cyan-500/20 transition-colors group"
                        >
                            <ChevronDown className="w-6 h-6 text-cyan-400 rotate-90 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); goToNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 border border-cyan-500/50 rounded-full flex items-center justify-center hover:bg-cyan-500/20 transition-colors group"
                        >
                            <ChevronDown className="w-6 h-6 text-cyan-400 -rotate-90 group-hover:scale-110 transition-transform" />
                        </button>

                        {/* Progress bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                                initial={{ width: '0%' }}
                                animate={{ width: isPaused ? '0%' : '100%' }}
                                transition={{ duration: 3, ease: 'linear' }}
                                key={`progress-${currentIndex}-${isPaused}`}
                            />
                        </div>
                    </div>

                    {/* Thumbnail strip */}
                    <div className="bg-zinc-950 border-t border-cyan-500/20 p-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {photos.map((photo, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`relative flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                                        index === currentIndex
                                            ? 'border-cyan-400 shadow-lg shadow-cyan-400/30'
                                            : 'border-slate-700 hover:border-cyan-500/50'
                                    }`}
                                >
                                    <img
                                        src={photo}
                                        alt={`Thumb ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {index === currentIndex && (
                                        <div className="absolute inset-0 bg-cyan-400/20" />
                                    )}
                                    <span className="absolute bottom-1 right-1 text-xs font-mono text-cyan-400 bg-black/70 px-1 rounded">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    {photos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'w-8 bg-cyan-400'
                                    : 'w-2 bg-slate-600 hover:bg-cyan-500/50'
                            }`}
                        />
                    ))}
                </div>

                {/* Pause indicator */}
                {isPaused && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 border border-cyan-500/50 rounded-lg px-4 py-2"
                    >
                        <span className="text-cyan-400 font-mono text-sm">PAUSED</span>
                    </motion.div>
                )}
            </motion.div>

            {/* Lightbox modal */}
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
                            className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors z-10"
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
                            className="max-w-full max-h-full object-contain rounded-lg border border-cyan-500/30"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// GIFT REGISTRY SECTION - The Data Transfer
function GiftRegistrySection({ features }: { features: InvitationSchema['features'] }) {
    const [copied, setCopied] = useState(false);
    const [transferProgress, setTransferProgress] = useState(0);
    const cbu = features.gift_registry?.bank_details?.account_number || '0000003100012345678900';
    const alias = features.gift_registry?.bank_details?.alias || 'NOVA.CYBER.2024';

    useEffect(() => {
        const interval = setInterval(() => {
            setTransferProgress(prev => (prev >= 100 ? 0 : prev + 10));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(cbu);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="relative py-24 px-4 bg-black overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto relative z-10"
            >
                <div className="flex items-center justify-center gap-4 mb-12">
                    <Code2 className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl md:text-3xl text-green-400 font-mono tracking-widest uppercase">Data Transfer</h2>
                    <Code2 className="w-6 h-6 text-green-400" />
                </div>

                {/* Transfer animation */}
                <div className="mb-8 bg-zinc-950 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2 text-xs font-mono text-green-400">
                        <span>TRANSFERENCIA DE DATOS</span>
                        <span>{transferProgress}%</span>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                            animate={{ width: `${transferProgress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between text-xs font-mono text-slate-500">
                        <span>PACKETS: {Math.floor(transferProgress * 1.5)}/150</span>
                        <span>SPEED: 1.2 Gbps</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Bank transfer card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-zinc-950 border border-cyan-500/30 rounded-lg p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="w-6 h-6 text-cyan-400" />
                            <h3 className="text-lg text-cyan-400 font-mono">Acceso Bancario</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-black rounded-lg p-4 border border-cyan-500/20">
                                <p className="text-xs text-slate-400 font-mono mb-1">ALIAS</p>
                                <p className="text-lg text-cyan-300 font-mono">{alias}</p>
                            </div>
                            <div className="bg-black rounded-lg p-4 border border-cyan-500/20">
                                <p className="text-xs text-slate-400 font-mono mb-1">CBU</p>
                                <p className="text-lg text-cyan-300 font-mono break-all">{cbu}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="w-full mt-4 bg-cyan-500/20 border border-cyan-500 text-cyan-400 px-6 py-3 rounded font-mono uppercase tracking-wider hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
                        >
                            {copied ? (
                                <><Check className="w-5 h-5" /> ¡COPIADO!</>
                            ) : (
                                <><Copy className="w-5 h-5" /> COPIAR CBU</>
                            )}
                        </button>
                    </motion.div>

                    {/* Registry card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-zinc-950 border border-fuchsia-500/30 rounded-lg p-6 flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Gift className="w-6 h-6 text-fuchsia-400" />
                            <h3 className="text-lg text-fuchsia-400 font-mono">Lista de Regalos</h3>
                        </div>

                        <p className="text-slate-400 font-mono text-sm mb-6 flex-grow">
                            Accede a nuestra lista de regalos en la nube. Selecciona el item que deseas transferir.
                        </p>

                        <a
                            href={features.gift_registry?.registries?.[0]?.url || 'https://listaderegalos.mercadolibre.com.ar'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-fuchsia-500/20 border border-fuchsia-500 text-fuchsia-400 px-6 py-3 rounded font-mono uppercase tracking-wider hover:bg-fuchsia-500/30 transition-colors flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="w-5 h-5" />
                            VER REGALOS
                        </a>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}

// RSVP SECTION - The System Ping
function RSVPSection({ features, content, metadata }: { features: InvitationSchema['features']; content: InvitationSchema['content']; metadata: InvitationSchema['metadata'] }) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', attendance: true, guests: 1, dietary: '', message: '' });
    // Estado para respuestas de preguntas personalizadas
    const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pingActive, setPingActive] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPingActive(true);

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
                setSuccess(true);
                setFormData({ name: '', email: '', phone: '', attendance: true, guests: 1, dietary: '', message: '' });
                setCustomAnswers({});
            } else {
                setError(result.error || 'Error en la transmisión');
            }
        } catch {
            setError('Error de conexión. Reintentando...');
        } finally {
            setLoading(false);
            setTimeout(() => setPingActive(false), 1000);
        }
    };

    const handleCustomAnswerChange = (questionId: string, value: string) => {
        setCustomAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    // Obtener preguntas personalizadas desde features.rsvp
    const customQuestions = features.rsvp?.custom_questions || [];

    if (success) {
        return (
            <section className="relative py-24 px-4 bg-black overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="bg-zinc-950 border border-green-500/50 rounded-lg p-8">
                        <Signal className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
                        <h2 className="text-2xl text-green-400 font-mono mb-4">¡PING ENVIADO!</h2>
                        <p className="text-slate-400 font-mono mb-6">Confirmación registrada en el sistema. Tu presencia ha sido codificada.</p>
                        <button onClick={() => setSuccess(false)} className="text-cyan-400 hover:text-cyan-300 font-mono text-sm underline">
                            Enviar otro ping
                        </button>
                    </div>
                </motion.div>
            </section>
        );
    }

    return (
        <section id="cyberpunk-rsvp" className="relative py-24 px-4 bg-zinc-950 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl mx-auto relative z-10"
            >
                <div className="flex items-center justify-center gap-4 mb-12">
                    <Radio className={`w-6 h-6 ${pingActive ? 'text-green-400 animate-pulse' : 'text-cyan-400'}`} />
                    <h2 className="text-2xl md:text-3xl text-cyan-400 font-mono tracking-widest uppercase">System Ping</h2>
                    <Radio className={`w-6 h-6 ${pingActive ? 'text-green-400 animate-pulse' : 'text-cyan-400'}`} />
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 text-red-300 font-mono text-center text-sm">
                        ⚠ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-black border border-cyan-500/30 rounded-lg p-8">
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-cyan-500/30">
                        <Terminal className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-mono text-sm">root@invitame:~$ init_rsvp_protocol</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-cyan-400 font-mono text-sm mb-2">&gt; NOMBRE_COMPLETO</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-zinc-950 border border-cyan-500/30 rounded px-4 py-3 text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                                placeholder="Ingresa tu identificación..."
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-cyan-400 font-mono text-sm mb-2">&gt; EMAIL</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-zinc-950 border border-cyan-500/30 rounded px-4 py-3 text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                                placeholder="usuario@dominio.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-cyan-400 font-mono text-sm mb-2">&gt; ASISTENCIA</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, attendance: true })}
                                    className={`flex-1 py-3 rounded font-mono text-sm transition-colors ${
                                        formData.attendance
                                            ? 'bg-green-500/20 border border-green-500 text-green-400'
                                            : 'bg-zinc-950 border border-slate-700 text-slate-400 hover:border-cyan-500/50'
                                    }`}
                                    disabled={loading}
                                >
                                    CONFIRMAR [1]
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, attendance: false })}
                                    className={`flex-1 py-3 rounded font-mono text-sm transition-colors ${
                                        !formData.attendance
                                            ? 'bg-red-500/20 border border-red-500 text-red-400'
                                            : 'bg-zinc-950 border border-slate-700 text-slate-400 hover:border-cyan-500/50'
                                    }`}
                                    disabled={loading}
                                >
                                    DECLINAR [0]
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-cyan-400 font-mono text-sm mb-2">&gt; ACOMPAÑANTES</label>
                            <select
                                value={formData.guests}
                                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                className="w-full bg-zinc-950 border border-cyan-500/30 rounded px-4 py-3 text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                                disabled={loading}
                            >
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                    <option key={num} value={num} className="bg-zinc-950">{num} unidad{num > 1 ? 'es' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-cyan-400 font-mono text-sm mb-2">&gt; MENSAJE_OPCIONAL</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-zinc-950 border border-cyan-500/30 rounded px-4 py-3 text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none h-24 resize-none"
                                placeholder="Insertar mensaje cifrado..."
                                disabled={loading}
                            />
                        </div>
                        {/* Preguntas Personalizadas */}
                        {customQuestions.length > 0 && (
                            <div className="space-y-6 pt-4 border-t border-fuchsia-500/30">
                                <p className="text-cyan-400 font-mono text-xs">&gt; PREGUNTAS_ADICIONALES</p>
                                {customQuestions.map((question) => (
                                    <div key={question.id}>
                                        <label className="block text-cyan-400 font-mono text-sm mb-2">&gt; {question.question}{question.required && ' [REQ]'}</label>
                                        {question.type === 'text' ? (
                                            <input
                                                type="text"
                                                required={question.required}
                                                value={customAnswers[question.id] || ''}
                                                onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                                                className="w-full bg-zinc-950 border border-cyan-500/30 rounded px-4 py-3 text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                                                placeholder="Ingresar dato..."
                                                disabled={loading}
                                            />
                                        ) : question.type === 'select' ? (
                                            <select
                                                required={question.required}
                                                value={customAnswers[question.id] || ''}
                                                onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                                                className="w-full bg-zinc-950 border border-cyan-500/30 rounded px-4 py-3 text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                                                disabled={loading}
                                            >
                                                <option value="" className="bg-zinc-950">SELECCIONAR_OPCION</option>
                                                {question.options?.map((opt) => (
                                                    <option key={opt} value={opt} className="bg-zinc-950">{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <textarea
                                                required={question.required}
                                                value={customAnswers[question.id] || ''}
                                                onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                                                className="w-full bg-zinc-950 border border-cyan-500/30 rounded px-4 py-3 text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none h-24 resize-none"
                                                placeholder="Ingresar dato extendido..."
                                                disabled={loading}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 bg-cyan-500/20 border border-cyan-500 text-cyan-400 px-6 py-4 rounded font-mono uppercase tracking-wider hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> ENVIANDO_PING...</>
                        ) : (
                            <><Send className="w-5 h-5" /> EJECUTAR_COMANDO</>
                        )}
                    </button>
                </form>
            </motion.div>
        </section>
    );
}

// MUSIC PLAYER - The Neural Link
function MusicPlayer({ features }: { features: InvitationSchema['features'] }) {
    const [showPlayer, setShowPlayer] = useState(false);
    const [showSuggestForm, setShowSuggestForm] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [formData, setFormData] = useState({ guestName: '', songTitle: '', artist: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        const { data } = await supabase.from('song_suggestions').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(5);
        if (data) setSuggestions(data);
    };

    const handleSubmitSuggestion = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('song_suggestions').insert([{
            guest_name: formData.guestName,
            song_title: formData.songTitle,
            artist: formData.artist
        }]);
        if (!error) {
            setSubmitted(true);
            setFormData({ guestName: '', songTitle: '', artist: '' });
            setTimeout(() => { setSubmitted(false); setShowSuggestForm(false); }, 2000);
        }
        setLoading(false);
    };

    return (
        <>
            <motion.button
                onClick={() => setShowPlayer(!showPlayer)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-cyan-500/20 border border-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-500/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Headphones className="w-6 h-6 text-cyan-400" />
            </motion.button>

            <AnimatePresence>
                {showPlayer && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 right-6 z-50 bg-black border border-cyan-500/50 rounded-xl p-6 shadow-2xl w-[calc(100vw-3rem)] max-w-[380px]"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
                                <h3 className="text-cyan-400 font-mono text-sm">Neural Link</h3>
                            </div>
                            <button onClick={() => setShowPlayer(false)} className="text-slate-400 hover:text-cyan-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Equalizer visualization */}
                        <div className="bg-zinc-950 rounded-lg p-4 mb-4 border border-cyan-500/20">
                            <div className="flex items-end justify-center gap-1 h-16 mb-3">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [10, 40 + Math.random() * 20, 10] }}
                                        transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
                                        className="w-2 bg-gradient-to-t from-cyan-500 to-fuchsia-500 rounded-t"
                                    />
                                ))}
                            </div>
                            <p className="text-center text-cyan-300 font-mono text-sm">Neural Link Active</p>
                        </div>

                        <button
                            onClick={() => setShowSuggestForm(!showSuggestForm)}
                            className="w-full bg-cyan-500/20 border border-cyan-500 text-cyan-400 px-4 py-3 rounded font-mono text-sm hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            {showSuggestForm ? 'CANCELAR' : 'SUGERIR TRACK'}
                        </button>

                        {showSuggestForm && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleSubmitSuggestion}
                                className="mt-4 space-y-3"
                            >
                                <input
                                    type="text"
                                    required
                                    value={formData.guestName}
                                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                    className="w-full bg-zinc-950 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                                    placeholder="Tu identificador"
                                />
                                <input
                                    type="text"
                                    required
                                    value={formData.songTitle}
                                    onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                                    className="w-full bg-zinc-950 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                                    placeholder="Título del track"
                                />
                                <input
                                    type="text"
                                    required
                                    value={formData.artist}
                                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                    className="w-full bg-zinc-950 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                                    placeholder="Artista"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || submitted}
                                    className="w-full bg-fuchsia-500/20 border border-fuchsia-500 text-fuchsia-400 px-3 py-2 rounded font-mono text-sm hover:bg-fuchsia-500/30 transition-colors disabled:opacity-50"
                                >
                                    {submitted ? '✓ ENVIADO' : loading ? 'PROCESANDO...' : 'TRANSMITIR'}
                                </button>
                            </motion.form>
                        )}

                        {suggestions.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-cyan-500/20">
                                <p className="text-slate-500 text-xs font-mono mb-2">SUGERENCIAS RECIENTES</p>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {suggestions.map((s) => (
                                        <div key={s.id} className="bg-zinc-950 rounded p-2 border border-cyan-500/10">
                                            <p className="text-cyan-300 text-xs font-medium">{s.song_title}</p>
                                            <p className="text-slate-500 text-xs">{s.artist} — {s.guest_name}</p>
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

// FOOTER - The Trace Log
function Footer({ content }: { content: InvitationSchema['content'] }) {
    return (
        <footer className="relative bg-black py-12 px-4 border-t border-cyan-500/20 overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-left font-mono text-xs text-green-400/80 space-y-1">
                    <p><span className="text-slate-500">[LOG]</span> System initialization complete</p>
                    <p><span className="text-slate-500">[LOG]</span> Connection established with {content.couple?.person1.name || 'User_01'}::{content.couple?.person2.name || 'User_02'}</p>
                    <p><span className="text-slate-500">[LOG]</span> Protocol: WEDDING_V1.0</p>
                    <p><span className="text-slate-500">[LOG]</span> Encryption: AES-256-GCM</p>
                    <p className="text-green-500">[SUCCESS] All systems operational. Ready for celebration.</p>
                </div>

                <div className="mt-8 pt-6 border-t border-cyan-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-fuchsia-400 fill-fuchsia-400" />
                        <span className="text-cyan-400 font-mono text-sm">
                            {content.couple?.person1.name || 'NOVA'}::{content.couple?.person2.name || 'CYBER'}
                        </span>
                    </div>
                    <p className="text-slate-600 font-mono text-xs">
                        &lt;invitame /&gt; © 2026 // BUILD v2.0.0
                    </p>
                </div>
            </div>
        </footer>
    );
}

// MAIN LAYOUT EXPORT
export function CyberpunkLayout({ invitation, preview, previewMobile }: CyberpunkLayoutProps) {
    const { metadata, content, logistics, features } = invitation;

    return (
        <main className="min-h-screen bg-black text-white overflow-x-hidden">
            <Scanlines />
            <DigitalRain />

            <FloatingRSVPButton features={features} />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <HeroSection content={content} logistics={logistics} />
            </motion.div>

            <FeatureGate isVisible={features.show_countdown} data={features.countdown} fallback={preview ? <EmptyStatePreview icon="⏱️" title="Reloj del Sistema" description="Configura la fecha del evento para activar la cuenta regresiva" /> : null}>
                <CountdownSection logistics={logistics} />
            </FeatureGate>

            <FeatureGate isVisible={!!content.quote || !!content.couple?.love_story} data={content.quote} fallback={preview ? <EmptyStatePreview icon="📡" title="Manifiesto Encriptado" description="Agrega una frase o historia de amor" /> : null}>
                <QuoteSection content={content} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_agenda} data={logistics.agenda} fallback={preview ? <EmptyStatePreview icon="📋" title="Protocolo Schedule" description="Agrega los momentos clave de tu evento" /> : null}>
                <TimelineSection logistics={logistics} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_venue_map} data={logistics.venues} fallback={preview ? <EmptyStatePreview icon="📍" title="Coordenadas" description="Indica las ubicaciones del evento" /> : null}>
                <VenuesSection logistics={logistics} content={content} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_dress_code} data={logistics.dress_code} fallback={preview ? <EmptyStatePreview icon="👔" title="Bio-Upgrade" description="Especifica el dress code para tu evento" /> : null}>
                <DressCodeSection logistics={logistics} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_gallery} data={content.gallery_images} fallback={preview ? <EmptyStatePreview icon="💾" title="Memory Chip" description="Sube fotos para compartir momentos especiales" /> : null}>
                <GallerySection content={content} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_gift_registry} data={features.gift_registry} fallback={preview ? <EmptyStatePreview icon="💻" title="Data Transfer" description="Comparte los datos bancarios o listas de regalos" /> : null}>
                <GiftRegistrySection features={features} />
            </FeatureGate>

            <FeatureGate isVisible={features.show_rsvp} data={features.rsvp} fallback={preview ? <EmptyStatePreview icon="📶" title="System Ping" description="Activa el formulario para confirmar asistencia" /> : null}>
                <RSVPSection features={features} content={content} metadata={metadata} />
            </FeatureGate>

            <Footer content={content} />
        </main>
    );
}
