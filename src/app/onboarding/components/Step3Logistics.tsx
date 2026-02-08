'use client';

import React from 'react';
import { StepProps } from '../types';

// Iconos para los toggles - más pequeños y sutiles
const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CeremonyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ReceptionIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const GiftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

export function Step3Logistics({ formData, updateFormData }: StepProps) {
  const showVenueMap = formData.showVenueMap !== false;
  const showCeremony = formData.showCeremony !== false;
  const showReception = formData.showReception !== false;
  const showGiftRegistry = formData.showGiftRegistry !== false;

  const venueToggles = [
    {
      key: 'showCeremony',
      label: 'Ceremonia',
      icon: <CeremonyIcon />,
      active: showCeremony,
    },
    {
      key: 'showReception',
      label: 'Recepción',
      icon: <ReceptionIcon />,
      active: showReception,
    },
  ] as const;

  const handleVenueToggle = (key: string) => {
    updateFormData({ [key]: !((formData as Record<string, unknown>)[key]) });
  };

  if (!showVenueMap && !showGiftRegistry) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center fade-in">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[#2C3333]/40 text-sm font-serif italic">Has desactivado las secciones de mapas y regalos. Puedes avanzar al siguiente paso.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 fade-in">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2C3333] mb-3">Logística y Recepción <span className="text-gray-400 text-lg font-normal normal-case">(opcional)</span></h2>
        <p className="text-[#2C3333]/60 text-sm italic">Organiza dónde ocurrirá la magia. Si no especificás, se usarán datos de muestra.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda: Ubicaciones */}
        <div className="space-y-5">
          {/* Toggle principal de Mapas - más prominente */}
          <section className="p-4 bg-gradient-to-r from-[#F8F9FA] to-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[#A27B5C]"><MapPinIcon /></span>
                <span className="text-xs font-semibold text-[#2C3333] tracking-wide">Ubicaciones</span>
              </div>
              <button
                onClick={() => updateFormData({ showVenueMap: !showVenueMap })}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                  showVenueMap ? 'bg-stone-800' : 'bg-stone-300'
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  showVenueMap ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              {showVenueMap ? 'Mostrando mapas en la invitación' : 'Los mapas están ocultos'}
            </p>
          </section>

          {/* Sub-opciones de ubicaciones - indentadas y sutiles */}
          {showVenueMap && (
            <section className="pl-4 border-l-2 border-[#A27B5C]/30 fade-in">
              <label className="block text-[9px] uppercase tracking-[0.15em] text-gray-400 mb-3">¿Dónde será tu evento? Seleccioná una o ambas opciones</label>
              <p className="text-[10px] text-[#A27B5C]/80 italic mb-3">
                ¿Todavía no tenés el salón confirmado? Podés dejar estos campos vacíos y completarlos cuando tengas la información final.
              </p>
              <div className="flex flex-wrap gap-2">
                {venueToggles.map((toggle) => (
                  <button
                    key={toggle.key}
                    onClick={() => handleVenueToggle(toggle.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] transition-all duration-200 ${
                      toggle.active
                        ? 'bg-stone-800 border-stone-800 text-white'
                        : 'bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    <span className={toggle.active ? 'text-stone-300' : 'text-stone-400'}>
                      {toggle.icon}
                    </span>
                    <span className="font-medium">{toggle.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Formularios de ubicación */}
          {showVenueMap && (
            <div className="space-y-6">
              {showCeremony && (
                <section className="p-6 bg-[#F8F9FA] rounded-3xl border border-gray-100 fade-in">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#A27B5C] border-b border-gray-200 pb-3 mb-5">Ceremonia</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Lugar</label>
                      <input
                        type="text"
                        placeholder="Ej: Templo, Iglesia, Parque..."
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:border-[#A27B5C] focus:ring-1 focus:ring-[#A27B5C] transition-all"
                        value={formData.ceremonyName || ''}
                        onChange={(e) => updateFormData({ ceremonyName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Dirección</label>
                      <input
                        type="text"
                        placeholder="Dirección completa"
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:border-[#A27B5C] focus:ring-1 focus:ring-[#A27B5C] transition-all"
                        value={formData.ceremonyAddress || ''}
                        onChange={(e) => updateFormData({ ceremonyAddress: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Google Maps</label>
                      <input
                        type="url"
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:border-[#A27B5C] focus:ring-1 focus:ring-[#A27B5C] transition-all"
                        value={formData.ceremonyMapsUrl || ''}
                        onChange={(e) => updateFormData({ ceremonyMapsUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </section>
              )}

              {showReception && (
                <section className="p-6 bg-[#F8F9FA] rounded-3xl border border-gray-100 fade-in">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#A27B5C] border-b border-gray-200 pb-3 mb-5">Recepción</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Salón / Quinta</label>
                      <input
                        type="text"
                        placeholder="Nombre del lugar"
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:border-[#A27B5C] focus:ring-1 focus:ring-[#A27B5C] transition-all"
                        value={formData.receptionName || ''}
                        onChange={(e) => updateFormData({ receptionName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Dirección</label>
                      <input
                        type="text"
                        placeholder="Dirección completa"
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:border-[#A27B5C] focus:ring-1 focus:ring-[#A27B5C] transition-all"
                        value={formData.receptionAddress || ''}
                        onChange={(e) => updateFormData({ receptionAddress: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Google Maps</label>
                      <input
                        type="url"
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:border-[#A27B5C] focus:ring-1 focus:ring-[#A27B5C] transition-all"
                        value={formData.receptionMapsUrl || ''}
                        onChange={(e) => updateFormData({ receptionMapsUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Columna derecha: Mesa de Regalos */}
        <div className="space-y-5">
          <section className="p-4 bg-gradient-to-r from-[#F8F9FA] to-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[#A27B5C]"><GiftIcon /></span>
                <span className="text-xs font-semibold text-[#2C3333] tracking-wide">Mesa de Regalos</span>
              </div>
              <button
                onClick={() => updateFormData({ showGiftRegistry: !showGiftRegistry })}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                  showGiftRegistry ? 'bg-stone-800' : 'bg-stone-300'
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  showGiftRegistry ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              {showGiftRegistry ? 'Mostrando datos bancarios a invitados' : 'Sección de regalos oculta'}
            </p>
          </section>

          {showGiftRegistry && (
            <section className="p-5 bg-[#F8F9FA] rounded-2xl border border-gray-100 fade-in">
              {/* Transferencia bancaria */}
              <div className="mb-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#A27B5C] mb-4">Transferencia bancaria</h3>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Alias</label>
                  <input
                    type="text"
                    placeholder="tu.alias.boda"
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:border-[#A27B5C] focus:ring-1 focus:ring-[#A27B5C] transition-all"
                    value={formData.bankAccountNumber || ''}
                    onChange={(e) => updateFormData({ bankAccountNumber: e.target.value })}
                  />
                </div>
              </div>

              {/* Mensaje personalizado */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Mensaje para invitados</label>
                <textarea
                  rows={3}
                  placeholder="Ej: Tu presencia es el mejor regalo, pero si querés ayudarnos con nuestra luna de miel..."
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm resize-none focus:border-[#A27B5C] focus:ring-1 focus:ring-[#A27B5C] transition-all"
                  value={formData.giftRegistryMessage || ''}
                  onChange={(e) => updateFormData({ giftRegistryMessage: e.target.value })}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
