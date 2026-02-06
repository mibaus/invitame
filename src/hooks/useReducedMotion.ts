'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para detectar preferencia de reduced motion del usuario
 * UX Bible: Accesibilidad - Reduced Motion Support
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook para obtener variantes de animación seguras
 * Retorna variantes reducidas si el usuario prefiere reduced motion
 */
export function useMotionSafe<T>(fullMotion: T, reducedMotion: T): T {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedMotion : fullMotion;
}
