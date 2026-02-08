'use client';

import React from 'react';
import { Sparkles, Clock, Send } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      index: "I",
      title: "Curaduría",
      description: "Explorá diseños de autor pensados para integrarse con la narrativa de tu boda.",
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      index: "II",
      title: "Configuración",
      description: "Cargá los datos de tu evento y personalizá cada detalle en minutos.",
      icon: <Clock className="w-4 h-4" />
    },
    {
      index: "III",
      title: "Despliegue",
      description: "Recibí tu link exclusivo y compartí una pieza de diseño digital única.",
      icon: <Send className="w-4 h-4" />
    }
  ];

  return (
    <section id="proceso" className="py-32 px-6 md:px-12 bg-charcoal text-cloud relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 reveal">
          <div className="space-y-4">
            <p className="text-[9px] uppercase tracking-[0.6em] text-bronze font-bold">El Método VOWS</p>
            <h2 className="text-3xl md:text-5xl font-serif font-light leading-tight">Del concepto <br/>a la <span className="italic">realidad digital.</span></h2>
          </div>
          <div className="hidden md:block w-32 h-[1px] bg-bronze/20 mb-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="reveal group relative pt-12 border-t border-cloud/5 hover:border-bronze/30 transition-colors duration-700"
            >
              <div className="absolute top-4 left-0 text-[10px] font-serif italic text-bronze opacity-50 group-hover:opacity-100 transition-opacity">
                Step {step.index}
              </div>
              
              <div className="space-y-6">
                <div className="w-8 h-8 flex items-center justify-center text-bronze/40 group-hover:text-bronze transition-colors duration-500">
                  {step.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-cloud">{step.title}</h3>
                  <p className="text-[13px] text-cloud/40 leading-relaxed font-light max-w-[260px]">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
