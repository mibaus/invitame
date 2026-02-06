
import React from 'react';
import { motion } from 'framer-motion';

const DressCode: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-white/20">
      <div className="max-w-xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12"
        >
          <h3 className="font-pinyon text-3xl text-[#96adc0] mb-2">The Attire</h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a9a9a9]">Código de Vestimenta</p>
        </motion.div>

        <div className="flex justify-center items-center gap-12 md:gap-20 mb-10">
          <div className="flex flex-col items-center group">
            <div className="w-24 h-24 mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
               {/* Watercolor Boutonniere Illustration Placeholder */}
               <img src="https://picsum.photos/id/111/200/200?blur=1" alt="Boutonniere" className="w-full h-full object-cover rounded-full shadow-lg" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#a9a9a9]">Traje Oscuro</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-24 h-24 mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
               {/* Watercolor Bouquet Illustration Placeholder */}
               <img src="https://picsum.photos/id/152/200/200?blur=1" alt="Bouquet" className="w-full h-full object-cover rounded-full shadow-lg" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#a9a9a9]">Vestido Largo</span>
          </div>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="p-8 border-y border-[#c0c0c0]/30"
        >
          <h4 className="font-script text-4xl text-[#4a4a4a] mb-2">Etiqueta Rigurosa</h4>
          <p className="text-[11px] text-[#a9a9a9] tracking-widest uppercase italic leading-relaxed">
            Deseamos veros en vuestra mejor gala para celebrar este gran momento.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DressCode;
