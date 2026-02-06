
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cloud/80 backdrop-blur-md border-b border-charcoal/5 px-6 md:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-serif font-bold text-charcoal tracking-wider">Invitame</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-12 text-sm uppercase tracking-widest font-medium text-charcoal/80">
          <a href="#proceso" className="hover:text-bronze transition-colors">Cómo Funciona</a>
          <a href="#galeria" className="hover:text-bronze transition-colors">Catálogo</a>
          <a href="#beneficios" className="hover:text-bronze transition-colors">Beneficios</a>
          <a href="#faq" className="hover:text-bronze transition-colors">FAQ</a>
        </div>

        <div>
          <a 
            href="https://wa.me/5491100000000?text=Hola!%20Me%20gustaría%20consultar%20disponibilidad%20para%20mi%20boda." 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2 border border-charcoal text-charcoal text-sm uppercase tracking-widest font-bold hover:bg-charcoal hover:text-cloud transition-all duration-300"
          >
            Consultar Fecha
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
