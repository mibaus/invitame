'use client';

import React from 'react';
import { Instagram, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal pt-20 pb-10 px-6 md:px-12 text-cloud/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-white/5">
          <div className="space-y-6">
            <span className="text-2xl font-serif font-bold text-cloud tracking-tighter">Invitame.</span>
            <p className="text-xs uppercase tracking-[0.3em] font-light max-w-xs leading-relaxed">
              Redefiniendo la estética nupcial digital. <br/> Hecho con calma en Argentina.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-10 md:gap-16">
            <div className="space-y-4">
               <p className="text-[9px] uppercase tracking-[0.4em] text-bronze font-bold">Contacto</p>
               <a href="mailto:hola@invitame.ar" className="block text-sm hover:text-cloud transition-colors">hola@invitame.ar</a>
               <a href="https://wa.me/5491100000000" className="block text-sm hover:text-cloud transition-colors">WhatsApp Concierge</a>
            </div>
            <div className="space-y-4">
               <p className="text-[9px] uppercase tracking-[0.4em] text-bronze font-bold">Social</p>
               <a href="#" className="flex items-center gap-2 text-sm hover:text-cloud transition-colors group">
                 Instagram <ArrowUpRight className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
               </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
             © {new Date().getFullYear()} Invitame Studio. Todos los derechos reservados.
           </p>
           <div className="flex gap-8">
              <a href="#" className="text-[10px] uppercase tracking-[0.2em] hover:text-cloud transition-colors">Privacidad</a>
              <a href="#" className="text-[10px] uppercase tracking-[0.2em] hover:text-cloud transition-colors">Términos</a>
           </div>
        </div>
      </div>
    </footer>
  );
}
