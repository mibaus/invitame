import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decorative Elements - matching landing style */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-rose/10 rounded-full blur-[140px] opacity-60"></div>
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-bronze/5 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-charcoal/5 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="text-center max-w-lg relative z-10">
        {/* 404 Number */}
        <div className="mb-6 relative">
          <span className="font-serif text-[140px] sm:text-[180px] leading-none text-bronze/10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-6xl sm:text-7xl text-charcoal">404</span>
          </div>
        </div>
        
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/50">
            <Search className="w-7 h-7 text-bronze" />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal mb-4">
          Página no encontrada
        </h1>
        
        {/* Description */}
        <p className="text-sm sm:text-base text-charcoal/60 mb-8 max-w-sm mx-auto leading-relaxed font-light">
          Lo sentimos, la página que buscas no existe o ha sido movida. 
          <span className="block mt-2 text-charcoal/40">Verifica la URL o vuelve al inicio.</span>
        </p>

        {/* CTA Button - matching landing style */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-9 py-4 bg-charcoal text-cloud text-[10px] uppercase tracking-widest font-bold hover:bg-bronze hover:shadow-[0_15px_30px_rgba(162,123,92,0.15)] transition-all duration-500"
        >
          <Home className="w-4 h-4" />
          Volver al Inicio
        </Link>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 opacity-30">
        <div className="h-8 w-[1px] bg-gradient-to-b from-charcoal to-transparent"></div>
      </div>
    </div>
  );
}
