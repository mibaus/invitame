
import React from 'react';
import { motion } from 'framer-motion';

const VenuesSection: React.FC = () => {
  return (
    <section className="bg-black text-white py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Ceremonia */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="aspect-[4/5] bg-neutral-900 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <img src="https://picsum.photos/seed/church/800/1000" alt="Lugar de Ceremonia" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-6 md:-right-12 bg-red-600 p-8 md:p-12 z-20 max-w-sm border-4 border-black shadow-[15px_15px_0px_0px_rgba(255,255,255,1)]">
              <div className="font-mono-tech text-[10px] mb-2 tracking-widest text-black font-bold">LUGAR A: LA CEREMONIA</div>
              <h3 className="text-3xl md:text-4xl font-serif-bold mb-4 leading-none uppercase">SANTA MARIA DEL AVANT</h3>
              <p className="font-mono-tech text-xs leading-relaxed mb-6 opacity-80 uppercase">
                Calle de la Moda 1234, CABA.<br/>
                Espacio arquitectónico moderno con vista 360.
              </p>
              <button className="w-full bg-black text-white font-mono-tech text-xs py-4 px-6 uppercase tracking-[0.2em] border-2 border-black hover:bg-white hover:text-black transition-all">
                CÓMO LLEGAR
              </button>
            </div>
          </motion.div>

          {/* Fiesta */}
          <motion.div 
            className="relative lg:mt-64"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="aspect-[4/5] bg-neutral-900 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <img src="https://picsum.photos/seed/party/800/1000" alt="Lugar de Fiesta" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-10 -left-6 md:-left-12 bg-white text-black p-8 md:p-12 z-20 max-w-sm border-4 border-black shadow-[15px_15px_0px_0px_rgba(255,0,0,1)]">
              <div className="font-mono-tech text-[10px] mb-2 tracking-widest text-red-600 font-bold uppercase">LUGAR B: LA GALA</div>
              <h3 className="text-3xl md:text-4xl font-serif-bold mb-4 leading-none uppercase">THE WAREHOUSE STUDIO</h3>
              <p className="font-mono-tech text-xs leading-relaxed mb-6 opacity-80 uppercase">
                Avenida Industrial 567, Puerto Madero.<br/>
                Donde el lujo industrial se encuentra con la moda.
              </p>
              <button className="w-full bg-red-600 text-white font-mono-tech text-xs py-4 px-6 uppercase tracking-[0.2em] border-2 border-red-600 hover:bg-black transition-all">
                VER UBICACIÓN
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default VenuesSection;
