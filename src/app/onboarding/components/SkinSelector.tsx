'use client';

import { getAllSkins, SkinConfig } from '@/lib/skins';

interface SkinSelectorProps {
  selectedSkin: string;
  onSelect: (skinId: string) => void;
}

const ALL_SKINS = getAllSkins();

function getFontClass(font: 'serif' | 'sans' | 'script'): string {
  switch (font) {
    case 'serif': return 'font-serif';
    case 'sans': return 'font-sans';
    case 'script': return 'font-serif italic';
  }
}

function openPreview(skinId: string) {
  window.open(`/preview/${skinId}`, '_blank', 'noopener,noreferrer');
}

export function SkinSelector({ selectedSkin, onSelect }: SkinSelectorProps) {
  const availableSkins = ALL_SKINS;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Elige tu diseño
        </label>
        <p className="text-sm text-gray-500">
          Selecciona el estilo que mejor represente tu evento
        </p>
      </div>
      
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {availableSkins.map((skin) => {
          const isSelected = selectedSkin === skin.id;
          
          return (
            <div
              key={skin.id}
              className={`group relative rounded-lg overflow-hidden transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-offset-2 ring-gray-900'
                  : 'ring-1 ring-gray-200 hover:ring-gray-300'
              }`}
            >
              {/* Main clickable area */}
              <button
                type="button"
                onClick={() => onSelect(skin.id)}
                className="w-full text-left focus:outline-none"
              >
                {/* Invitation Preview - Simulates a real invitation card */}
                <div 
                  className="relative aspect-[4/5] p-6 flex flex-col items-center justify-center"
                  style={{ backgroundColor: skin.style.bg }}
                >
                  {/* Subtle border frame */}
                  <div 
                    className="absolute inset-4 border opacity-20"
                    style={{ borderColor: skin.style.text }}
                  />
                  
                  {/* Content */}
                  <div className="relative text-center space-y-3">
                    {/* Small decorative element */}
                    <div 
                      className="w-8 h-px mx-auto"
                      style={{ backgroundColor: skin.style.accent }}
                    />
                    
                    {/* Names */}
                    <div className={`${getFontClass(skin.style.font)}`}>
                      <span 
                        className="block text-lg tracking-wide"
                        style={{ color: skin.style.text }}
                      >
                        María
                      </span>
                      <span 
                        className="block text-xs tracking-[0.3em] uppercase my-1 opacity-60"
                        style={{ color: skin.style.text }}
                      >
                        &
                      </span>
                      <span 
                        className="block text-lg tracking-wide"
                        style={{ color: skin.style.text }}
                      >
                        Carlos
                      </span>
                    </div>
                    
                    {/* Date placeholder */}
                    <div 
                      className="text-[10px] tracking-[0.2em] uppercase opacity-50"
                      style={{ color: skin.style.text }}
                    >
                      15 · 03 · 2025
                    </div>
                    
                    {/* Small decorative element */}
                    <div 
                      className="w-8 h-px mx-auto"
                      style={{ backgroundColor: skin.style.accent }}
                    />
                  </div>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info footer */}
                <div className="px-4 py-3 bg-white border-t border-gray-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {skin.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {skin.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
              
              {/* Preview link - appears on hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPreview(skin.id);
                }}
                className="absolute bottom-14 left-0 right-0 py-2 bg-black/80 text-white text-xs font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver demo
              </button>
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-400 text-center">
        1 diseño disponible - Más diseños próximamente
      </p>
    </div>
  );
}
