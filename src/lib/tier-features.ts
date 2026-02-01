import type { ServiceTier } from '@/types';

/**
 * Definición centralizada de features por tier
 * Esto controla qué secciones se muestran en cada nivel de servicio
 */

/**
 * Límites de fotos en galería por tier
 */
export const GALLERY_LIMITS: Record<ServiceTier, number> = {
  essential: 1,
  pro: 2,
  premium: 15,
};

/**
 * Obtiene el límite de fotos para un tier
 */
export function getGalleryLimit(tier: ServiceTier): number {
  return GALLERY_LIMITS[tier];
}

export type FeatureKey =
  // Essential Features
  | 'hero'
  | 'countdown_minimal'
  | 'venue_link'
  | 'gift_text_only'
  | 'rsvp_whatsapp'
  // Pro Features (incluye Essential)
  | 'countdown_full'
  | 'agenda'
  | 'venue_map_embed'
  | 'background_music'
  | 'rsvp_form'
  | 'gift_registry_full'
  | 'dress_code'
  // Premium Features (incluye Pro)
  | 'logistics_guide'
  | 'spotify_playlist'
  | 'guestbook'
  | 'photo_gallery_interactive'
  | 'live_streaming';

/**
 * Matriz de features por tier
 * Essential: Funcionalidad básica
 * Pro: Funcionalidad intermedia
 * Premium: Todas las funcionalidades
 */
export const TIER_FEATURE_MAP: Record<ServiceTier, FeatureKey[]> = {
  essential: [
    'hero',
    'countdown_minimal',
    'venue_link',
    'gift_text_only',
    'rsvp_whatsapp',
  ],
  pro: [
    'hero',
    'countdown_full',
    'venue_link',
    'venue_map_embed',
    'gift_text_only',
    'gift_registry_full',
    'rsvp_whatsapp',
    'rsvp_form',
    'agenda',
    'background_music',
    'dress_code',
  ],
  premium: [
    'hero',
    'countdown_full',
    'venue_link',
    'venue_map_embed',
    'gift_text_only',
    'gift_registry_full',
    'rsvp_whatsapp',
    'rsvp_form',
    'agenda',
    'background_music',
    'dress_code',
    'logistics_guide',
    'spotify_playlist',
    'guestbook',
    'photo_gallery_interactive',
    'live_streaming',
  ],
};

/**
 * Verifica si un tier tiene acceso a una feature específica
 */
export function hasFeature(tier: ServiceTier, feature: FeatureKey): boolean {
  return TIER_FEATURE_MAP[tier].includes(feature);
}

/**
 * Obtiene todas las features disponibles para un tier
 */
export function getTierFeatures(tier: ServiceTier): FeatureKey[] {
  return TIER_FEATURE_MAP[tier];
}

/**
 * Verifica si el tier actual es igual o superior al requerido
 */
export function meetsMinimumTier(currentTier: ServiceTier, requiredTier: ServiceTier): boolean {
  const tierOrder: ServiceTier[] = ['essential', 'pro', 'premium'];
  return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(requiredTier);
}

/**
 * Obtiene el tier mínimo requerido para una feature
 */
export function getMinimumTierForFeature(feature: FeatureKey): ServiceTier {
  if (TIER_FEATURE_MAP.essential.includes(feature)) return 'essential';
  if (TIER_FEATURE_MAP.pro.includes(feature)) return 'pro';
  return 'premium';
}
