'use client';

import React from 'react';

interface PremiumPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
}

export function PremiumPaywallModal({ isOpen, onClose, onActivate }: PremiumPaywallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-[#A27B5C] via-[#8B6F47] to-[#A27B5C]" />
        
        <div className="p-8 md:p-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Title */}
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C3333] mb-4 text-center leading-tight">
            ¡Tu VOWS. cobra vida!
          </h2>
          
          {/* Body */}
          <p className="text-gray-600 text-center mb-8 leading-relaxed text-sm">
            Tu diseño luce increíble. Completá tu compra para activar el Dashboard de Gestión, 
            subir tus fotos y publicar tu enlace exclusivo.
          </p>
          
          {/* Benefits List */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E7D2CC] flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-[#A27B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm leading-tight">
                Acceso al Dashboard VOWS en vivo
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E7D2CC] flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-[#A27B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm leading-tight">
                Personalización y Multimedia ilimitada
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E7D2CC] flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-[#A27B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm leading-tight">
                Gestión de RSVP y exportación de listas inteligentes
              </span>
            </div>
          </div>
          
          {/* CTA Button */}
          <button
            onClick={onActivate}
            className="w-full bg-gradient-to-r from-[#A27B5C] to-[#8B6F47] text-white px-8 py-4 rounded-2xl font-bold tracking-premium text-sm uppercase hover:from-[#8B6F47] hover:to-[#A27B5C] transition-all duration-500 shadow-lg shadow-[#A27B5C]/20 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Activar mi VOWS. por $49.000
          </button>
          
          {/* Trust indicators */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Pago seguro • Acceso inmediato • Soporte premium
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
