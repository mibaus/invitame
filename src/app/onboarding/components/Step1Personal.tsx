'use client';

import React from 'react';
import { StepProps } from '../types';
import { getAllSkins } from '@/lib/skins';

interface Step1PersonalProps extends StepProps {
  onNext?: () => void;
  isNextDisabled?: boolean;
}

export function Step1Personal({ formData, updateFormData, onNext, isNextDisabled }: Step1PersonalProps) {
  const designs = getAllSkins();

  return (
    <div className="max-w-4xl mx-auto py-4 fade-in">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2C3333] mb-3">Comencemos tu Historia</h2>
        <p className="text-[#2C3333]/60 text-sm leading-relaxed max-w-lg mx-auto">
          Elegí el estilo de tu invitación. No te preocupes, podrás cambiar de diseño (Skin) con un clic desde tu panel más adelante.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* DESIGN SELECTOR */}
        <div className="lg:col-span-7 space-y-6">
          <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#A27B5C] mb-6">Selecciona el Estilo Visual</label>
          <div className="grid grid-cols-2 gap-4">
            {designs.map((design) => (
              <div 
                key={design.id}
                className={`relative p-1 rounded-[2.2rem] border-2 transition-all duration-500 overflow-hidden group ${
                  formData.skinId === design.id 
                  ? 'border-[#A27B5C] bg-white shadow-2xl shadow-black/5' 
                  : 'border-transparent'
                }`}
              >
                <div 
                  onClick={() => updateFormData({ skinId: design.id })}
                  className="aspect-[4/5] cursor-pointer rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden border border-black/5 transition-transform duration-500 group-hover:scale-[0.98]"
                  style={{ backgroundColor: design.style.bg }}
                >
                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <div className="absolute top-4 left-4 w-12 h-12 border border-current rounded-full"></div>
                     <div className="absolute bottom-10 right-4 w-20 h-20 border border-current rotate-45"></div>
                  </div>
                  
                  <span className="font-serif italic text-3xl mb-2" style={{ color: design.style.text }}>
                    Aa
                  </span>
                  <div className="w-8 h-[1px]" style={{ backgroundColor: design.style.text, opacity: 0.2 }}></div>

                  {formData.skinId === design.id && (
                    <div className="absolute top-4 right-4 bg-[#A27B5C] text-white p-1 rounded-full shadow-lg z-10">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-4 pb-2 text-center">
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${formData.skinId === design.id ? 'text-[#A27B5C]' : 'text-gray-400'}`}>
                    {design.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PERSONAL DATA */}
        <div className="lg:col-span-5 space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100 self-start">
          <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#A27B5C]">Tus Datos</label>
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">Nombre Completo *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl transition-all focus:shadow-lg focus:shadow-black/5 text-sm"
                value={formData.clientName || ''}
                onChange={(e) => updateFormData({ clientName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">Correo Electrónico *</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl transition-all focus:shadow-lg focus:shadow-black/5 text-sm"
                value={formData.clientEmail || ''}
                onChange={(e) => updateFormData({ clientEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="+54 9 11 1234 5678"
                pattern="^[+]?[0-9\s-]{8,20}$"
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl transition-all focus:shadow-lg focus:shadow-black/5 text-sm"
                value={formData.clientPhone || ''}
                onChange={(e) => updateFormData({ clientPhone: e.target.value })}
              />
              <p className="text-[8px] text-gray-400 mt-1 ml-1">Formato: +54 9 11 1234 5678</p>
            </div>
          </div>
          
          {/* Botón Siguiente dentro de Tus Datos */}
          {onNext && (
            <button
              onClick={onNext}
              disabled={isNextDisabled}
              className="w-full mt-4 bg-[#2C3333] disabled:bg-gray-200 text-white px-6 py-3 rounded-xl font-bold tracking-premium text-[10px] uppercase hover:bg-[#A27B5C] transition-all duration-500 shadow-lg shadow-black/10 flex items-center justify-center gap-2"
            >
              Siguiente
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
