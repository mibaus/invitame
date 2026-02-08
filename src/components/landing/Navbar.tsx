'use client';

import React from 'react';

export default function Navbar() {
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('precio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cloud/80 backdrop-blur-md border-b border-charcoal/5 px-6 md:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={scrollToHero}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <span className="text-2xl font-serif font-bold text-charcoal tracking-wider">VOWS<span className="text-bronze">.</span></span>
        </button>
        
        <div className="hidden md:flex items-center space-x-12 text-sm uppercase tracking-widest font-medium text-charcoal/80">
          <a href="#proceso" className="hover:text-bronze transition-colors">Cómo Funciona</a>
          <a href="#galeria" className="hover:text-bronze transition-colors">Catálogo</a>
          <a href="#beneficios" className="hover:text-bronze transition-colors">Beneficios</a>
          <a href="#faq" className="hover:text-bronze transition-colors">FAQ</a>
        </div>

        <div>
          <button 
            onClick={scrollToPricing}
            className="px-6 py-2 border border-charcoal text-charcoal text-sm uppercase tracking-widest font-bold hover:bg-charcoal hover:text-cloud transition-all duration-300 cursor-pointer"
          >
            Comenzar Ahora
          </button>
        </div>
      </div>
    </nav>
  );
}
