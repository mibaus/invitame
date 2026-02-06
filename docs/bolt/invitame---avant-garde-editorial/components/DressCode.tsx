
import React from 'react';
import { motion } from 'framer-motion';

const DressCode: React.FC = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 border-t border-black/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2">
          <motion.h2 
            className="text-6xl md:text-8xl font-serif-bold tracking-tighter mb-6 uppercase leading-[0.85]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            CÓDIGO <br/><span className="text-red-600">DE GALA</span>
          </motion.h2>
          
          <div className="font-mono-tech text-xs tracking-[0.2em] uppercase text-black mb-8 border-l-4 border-black pl-4 font-bold">
            ETIQUETA: BLACK TIE AVANT-GARDE
          </div>
        </div>

        <div className="w-full md:w-1/2 border-t-2 md:border-t-0 md:border-l-2 border-black pt-8 md:pt-0 md:pl-12">
          <p className="font-sans-body text-lg leading-relaxed text-black mb-12 max-w-md italic">
            "La elegancia no es destacar, sino ser recordado." <br/><br/>
            <span className="not-italic text-sm font-mono-tech uppercase tracking-widest text-black/60">
              Celebramos la sofisticación. Solicitamos a nuestros invitados lucir smoking y vestidos de gala. El rojo, como nuestra pasión, es el acento sugerido para esta noche.
            </span>
          </p>
          
          <div className="flex items-center gap-6">
            <div className="bg-black text-white p-6 font-mono-tech text-[10px] tracking-[0.3em] uppercase inline-block">
              REF_DRESS_CODE: #FORMAL_LUXURY
            </div>
            <div className="h-[2px] flex-1 bg-black/10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DressCode;
