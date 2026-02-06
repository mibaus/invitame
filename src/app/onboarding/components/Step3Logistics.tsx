'use client';

import React from 'react';
import { StepProps } from '../types';

export function Step3Logistics({ formData, updateFormData }: StepProps) {
  const showAnything = formData.showVenueMap || formData.showGiftRegistry;

  if (!showAnything) {
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
        <h2 className="font-serif text-3xl md:text-4xl text-[#2C3333] mb-3">Logística y Recepción</h2>
        <p className="text-[#2C3333]/60 text-sm">Organiza dónde ocurrirá la magia.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {formData.showVenueMap && (
          <div className="space-y-8 fade-in">
            <section className="p-6 bg-[#F8F9FA] rounded-2xl border border-gray-100">
              <h3 className="font-serif text-xl mb-4 text-[#A27B5C] italic">Ceremonia</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Lugar"
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm"
                  value={formData.ceremonyName || ''}
                  onChange={(e) => updateFormData({ ceremonyName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm"
                  value={formData.ceremonyAddress || ''}
                  onChange={(e) => updateFormData({ ceremonyAddress: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Link Google Maps"
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm"
                  value={formData.ceremonyMapsUrl || ''}
                  onChange={(e) => updateFormData({ ceremonyMapsUrl: e.target.value })}
                />
              </div>
            </section>

            <section className="p-6 bg-[#F8F9FA] rounded-2xl border border-gray-100">
              <h3 className="font-serif text-xl mb-4 text-[#A27B5C] italic">Recepción</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Salón / Quinta"
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm"
                  value={formData.receptionName || ''}
                  onChange={(e) => updateFormData({ receptionName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm"
                  value={formData.receptionAddress || ''}
                  onChange={(e) => updateFormData({ receptionAddress: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Link Google Maps"
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm"
                  value={formData.receptionMapsUrl || ''}
                  onChange={(e) => updateFormData({ receptionMapsUrl: e.target.value })}
                />
              </div>
            </section>
          </div>
        )}

        {formData.showGiftRegistry && (
          <div className="space-y-8 fade-in">
            <section className="p-6 bg-white border border-[#E7D2CC] rounded-2xl shadow-sm">
              <h3 className="font-serif text-xl mb-4 text-[#A27B5C] italic">Mesa de Regalos</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Banco"
                  className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm"
                  value={formData.bankName || ''}
                  onChange={(e) => updateFormData({ bankName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="CBU / Alias"
                  className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm"
                  value={formData.bankAccountNumber || ''}
                  onChange={(e) => updateFormData({ bankAccountNumber: e.target.value })}
                />
                <textarea
                  rows={3}
                  placeholder="Mensaje sobre los regalos..."
                  className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-xl text-sm resize-none"
                  value={formData.giftRegistryMessage || ''}
                  onChange={(e) => updateFormData({ giftRegistryMessage: e.target.value })}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
