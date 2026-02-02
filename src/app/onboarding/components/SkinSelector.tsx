'use client';

import type { ServiceTier } from '@/types/database';

interface SkinSelectorProps {
  tier: ServiceTier;
  selectedSkin: string;
  onSelect: (skinId: string) => void;
}

const ALL_SKINS = [
  // Essential skins
  { id: 'classic-elegance', name: 'Classic Elegance', tier: 'essential', preview: 'Diseño clásico y elegante' },
  { id: 'minimal-chic', name: 'Minimal Chic', tier: 'essential', preview: 'Minimalista y moderno' },
  { id: 'garden-romance', name: 'Garden Romance', tier: 'essential', preview: 'Romántico con toques florales' },
  
  // Pro skins
  { id: 'royal-gold', name: 'Royal Gold', tier: 'pro', preview: 'Lujoso con detalles dorados' },
  { id: 'modern-luxe', name: 'Modern Luxe', tier: 'pro', preview: 'Contemporáneo y sofisticado' },
  { id: 'vintage-rose', name: 'Vintage Rose', tier: 'pro', preview: 'Vintage con rosas' },
  
  // Premium skins
  { id: 'celestial-noir', name: 'Celestial Noir', tier: 'premium', preview: 'Oscuro y celestial' },
  { id: 'enchanted-garden', name: 'Enchanted Garden', tier: 'premium', preview: 'Jardín encantado' },
  { id: 'art-deco', name: 'Art Deco', tier: 'premium', preview: 'Estilo Art Deco' },
];

function getAvailableSkins(tier: ServiceTier) {
  switch (tier) {
    case 'essential':
      return ALL_SKINS.filter(s => s.tier === 'essential');
    case 'pro':
      return ALL_SKINS.filter(s => s.tier === 'essential' || s.tier === 'pro');
    case 'premium':
      return ALL_SKINS;
    default:
      return [];
  }
}

const TIER_BADGE_STYLES = {
  essential: 'bg-gray-100 text-gray-600',
  pro: 'bg-blue-100 text-blue-600',
  premium: 'bg-amber-100 text-amber-600',
};

export function SkinSelector({ tier, selectedSkin, onSelect }: SkinSelectorProps) {
  const availableSkins = getAvailableSkins(tier);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Diseño de invitación *
      </label>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableSkins.map((skin) => (
          <button
            key={skin.id}
            type="button"
            onClick={() => onSelect(skin.id)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              selectedSkin === skin.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {/* Skin tier badge */}
            <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
              TIER_BADGE_STYLES[skin.tier as keyof typeof TIER_BADGE_STYLES]
            }`}>
              {skin.tier}
            </span>

            {/* Preview placeholder */}
            <div className={`h-24 rounded-lg mb-3 flex items-center justify-center ${
              skin.tier === 'premium' 
                ? 'bg-gradient-to-br from-gray-900 to-gray-700' 
                : skin.tier === 'pro'
                ? 'bg-gradient-to-br from-amber-100 to-amber-200'
                : 'bg-gradient-to-br from-cream-100 to-gray-100'
            }`}>
              <span className={`text-2xl ${skin.tier === 'premium' ? 'text-white' : 'text-gray-600'}`}>
                {skin.name.charAt(0)}
              </span>
            </div>

            <h3 className="font-medium text-gray-900">{skin.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{skin.preview}</p>

            {/* Selected indicator */}
            {selectedSkin === skin.id && (
              <div className="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        {tier === 'essential' && 'Con tu plan Essential tienes acceso a 3 diseños.'}
        {tier === 'pro' && 'Con tu plan Pro tienes acceso a 6 diseños.'}
        {tier === 'premium' && 'Con tu plan Premium tienes acceso a todos los diseños.'}
      </p>
    </div>
  );
}
