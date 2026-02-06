'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para tracking de progreso de scroll
 * UX Bible: Scroll Storytelling - Orientación del usuario
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, currentSection, setCurrentSection };
}
