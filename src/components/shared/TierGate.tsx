'use client';

import type { ServiceTier } from '@/types';
import { hasFeature, meetsMinimumTier, type FeatureKey } from '@/lib/tier-features';
import type { ReactNode } from 'react';

interface TierGateProps {
  /** Tier actual de la invitación */
  currentTier: ServiceTier;
  /** Feature requerida para mostrar el contenido */
  requiredFeature?: FeatureKey;
  /** Tier mínimo requerido (alternativa a requiredFeature) */
  minimumTier?: ServiceTier;
  /** Contenido a mostrar si tiene acceso */
  children: ReactNode;
  /** Contenido alternativo si no tiene acceso (opcional) */
  fallback?: ReactNode;
  /** Si true, muestra el fallback en lugar de null cuando no tiene acceso */
  showFallback?: boolean;
}

/**
 * TierGate - Componente para controlar visibilidad basada en tier
 * 
 * Uso con feature específica:
 * <TierGate currentTier={tier} requiredFeature="agenda">
 *   <AgendaSection />
 * </TierGate>
 * 
 * Uso con tier mínimo:
 * <TierGate currentTier={tier} minimumTier="pro">
 *   <ProFeature />
 * </TierGate>
 */
export function TierGate({
  currentTier,
  requiredFeature,
  minimumTier,
  children,
  fallback = null,
  showFallback = false,
}: TierGateProps) {
  let hasAccess = false;

  if (requiredFeature) {
    hasAccess = hasFeature(currentTier, requiredFeature);
  } else if (minimumTier) {
    hasAccess = meetsMinimumTier(currentTier, minimumTier);
  } else {
    // Si no se especifica ningún requisito, siempre muestra
    hasAccess = true;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showFallback) {
    return <>{fallback}</>;
  }

  return null;
}

/**
 * Hook para usar la lógica de TierGate de forma programática
 */
export function useTierAccess(currentTier: ServiceTier) {
  return {
    hasFeature: (feature: FeatureKey) => hasFeature(currentTier, feature),
    meetsMinimum: (tier: ServiceTier) => meetsMinimumTier(currentTier, tier),
    isEssential: currentTier === 'essential',
    isPro: currentTier === 'pro',
    isPremium: currentTier === 'premium',
    isProOrHigher: meetsMinimumTier(currentTier, 'pro'),
    isPremiumOnly: currentTier === 'premium',
  };
}
