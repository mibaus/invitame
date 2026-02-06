'use client';

import React, { useState } from 'react';
import { getAllSkins, SkinConfig } from '@/lib/skins';

const INITIAL_SKINS_COUNT = 4;

const ALL_SKINS = getAllSkins();

function SkinCard({ skin }: { skin: SkinConfig }) {
  return (
    <div className="group cursor-pointer space-y-6">
      <div className="overflow-hidden bg-rose/10 aspect-[3/4] relative">
        <img 
          src={skin.image} 
          alt={skin.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <a 
            href={`/preview/${skin.id}`}
            className="px-6 py-3 bg-cloud text-charcoal text-xs font-bold uppercase tracking-widest hover:bg-bronze hover:text-cloud transition-colors"
          >
            Ver Demo en Vivo
          </a>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-serif text-charcoal">{skin.name}</h3>
        <p className="text-sm text-charcoal/70 font-light leading-relaxed">{skin.description}</p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [showAll, setShowAll] = useState(false);
  
  const mainSkins = ALL_SKINS.slice(0, INITIAL_SKINS_COUNT);
  const additionalSkins = ALL_SKINS.slice(INITIAL_SKINS_COUNT);
  const hasMoreSkins = additionalSkins.length > 0;

  return (
    <section id="galeria" className="py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 reveal">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal">Diseños de autor para cada tipo de boda.</h2>
            <p className="text-charcoal/60 font-light">Nuestras &quot;Skins&quot; están diseñadas para adaptarse a la estética de tu gran día, manteniendo siempre el toque Invitame.</p>
          </div>
          {hasMoreSkins && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-charcoal text-sm font-bold uppercase tracking-[0.2em] border-b-2 border-bronze pb-1 hover:text-bronze transition-colors"
            >
              {showAll ? 'Cerrar catálogo' : 'Explorar todo el catálogo'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mainSkins.map((skin) => (
            <div key={skin.id} className="reveal">
              <SkinCard skin={skin} />
            </div>
          ))}
        </div>

        {/* Additional skins with fade-in animation */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 ease-out ${
            showAll && additionalSkins.length > 0 
              ? 'opacity-100 translate-y-0 max-h-[1000px] mt-8' 
              : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden mt-0'
          }`}
        >
          {additionalSkins.map((skin) => (
            <div key={skin.id} className={showAll ? 'reveal active' : 'reveal'}>
              <SkinCard skin={skin} />
            </div>
          ))}
        </div>

        {/* Cerrar catálogo text at the bottom when expanded */}
        {showAll && (
          <div 
            className="flex justify-center pt-8 transition-all duration-500 ease-out"
          >
            <button 
              onClick={() => setShowAll(false)}
              className="text-charcoal text-sm font-bold uppercase tracking-[0.2em] border-b-2 border-bronze pb-1 hover:text-bronze transition-colors"
            >
              Cerrar catálogo
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
