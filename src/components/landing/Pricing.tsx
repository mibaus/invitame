'use client';

import React from 'react';
import { Check, Info } from 'lucide-react';

export default function Pricing() {
  const benefits = [
    { title: "Ecosistema Modular", desc: "Acceso a las 11 secciones premium (Countdown, Timeline, Galería, etc)." },
    { title: "Flexibilidad Total", desc: "Activá o desactivá secciones según la sobriedad que busques." },
    { title: "RSVP Inteligente", desc: "Formulario de confirmación con restricciones alimentarias, alertas y hasta 3 preguntas personalizadas." },
    { title: "Logística Integrada", desc: "Información clara de ubicación con dirección detallada e indicaciones, con botón directo a Google Maps." },
    { title: "Galería de Autor", desc: "Layout Masonry curado para lucir tu sesión de fotos pre-boda." },
    { title: "Gestión de Regalos", desc: "Sección de CBU/CVU con copiado rápido para transferencias." },
    { title: "Dashboard en Vivo", desc: "Panel de control para exportar listas, gestionar invitados y enviar invitaciones por WhatsApp con texto personalizado." },
    { title: "Sugerencia de Canciones", desc: "Tus invitados pueden proponer temas para la playlist de la fiesta directamente desde la invitación." },
  ];

  return (
    <section id="precio" className="py-24 px-6 md:px-12 bg-rose/10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-cloud p-8 md:p-16 lg:p-20 shadow-2xl relative overflow-hidden reveal">
          <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1 bg-charcoal text-cloud text-[9px] uppercase tracking-[0.3em] font-bold">Experiencia Full Access — Pago Único</span>
                <h2 className="text-4xl md:text-6xl font-serif text-charcoal leading-tight">Invertí en tu <br/><span className="italic text-bronze">paz mental.</span></h2>
                <p className="text-charcoal/50 font-light max-w-lg text-sm md:text-base leading-relaxed">
                  Creemos en la simplicidad del lujo: un solo precio, todas las funcionalidades disponibles. Vos decidís qué secciones mostrar para que la invitación cuente tu historia.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-bronze/10 flex items-center justify-center mt-1 group-hover:bg-bronze/20 transition-colors">
                        <Check className="w-3 h-3 text-bronze" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-charcoal uppercase tracking-widest">{b.title}</p>
                      <p className="text-xs text-charcoal/40 font-light leading-snug">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-charcoal/5 flex items-center gap-3 text-charcoal/40 italic">
                <Info className="w-4 h-4 text-bronze/40" />
                <p className="text-[10px] tracking-wide">Podés reconfigurar o quitar módulos en cualquier momento desde tu panel.</p>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 md:p-12 border border-charcoal/5 rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-8 lg:sticky lg:top-32">
               <div className="text-center space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-charcoal/30 font-bold">Inversión Final</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-serif text-charcoal/40">$</span>
                    <span className="text-7xl md:text-8xl font-serif text-charcoal tracking-tighter">49.000</span>
                  </div>
                  <p className="text-[9px] text-charcoal/50 uppercase tracking-widest font-bold">Pesos Argentinos</p>
               </div>
               
               <div className="w-full space-y-4">
                 <a 
                  href="/onboarding"
                  className="block w-full px-8 py-5 bg-charcoal text-cloud text-center text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-bronze hover:shadow-xl transition-all duration-500"
                 >
                   Comenzar mi Historia
                 </a>
                 <div className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-[9px] uppercase text-charcoal/40 font-bold tracking-widest">Entrega inmediata post-pago</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
