'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 right-6 z-50 reveal active">
      <a 
        href="https://wa.me/5491100000000?text=Hola!%20Me%20gustaría%20recibir%20más%20información%20sobre%20las%20invitaciones%20de%20Invitame." 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-charcoal text-cloud rounded-full shadow-2xl transition-all duration-500 hover:bg-bronze hover:scale-110 active:scale-95 border border-white/10"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulsing effect */}
        <span className="absolute inset-0 rounded-full bg-bronze/40 animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></span>
        
        <MessageCircle className="w-6 h-6 relative z-10" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-4 py-2 bg-charcoal text-[10px] uppercase tracking-widest font-bold text-cloud whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden sm:block pointer-events-none border border-white/5">
          ¿Dudas? Escribinos
        </span>
      </a>
    </div>
  );
}
