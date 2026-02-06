
import React from 'react';
import { motion } from 'framer-motion';

const QuoteManifesto: React.FC = () => {
  return (
    <section className="relative bg-white py-32 md:py-64 px-6 flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/[0.03] text-[60vw] font-serif-bold pointer-events-none leading-none select-none">
        “
      </div>
      
      <div className="max-w-6xl mx-auto text-center z-10">
        <motion.h2 
          className="text-5xl md:text-[8vw] font-serif-bold leading-[0.9] tracking-[-0.05em] text-black uppercase"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          EL AMOR ES EL ÚNICO <br/>
          <span className="italic text-red-600">LUJO</span> QUE NUNCA <br/>
          PASA DE MODA.
        </motion.h2>
        
        <motion.div 
          className="mt-12 font-mono-tech text-xs tracking-[0.4em] text-black/60 uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          — UNA DECLARACIÓN DE ESTILO Y DESTINO
        </motion.div>
      </div>

      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-full text-black/[0.03] text-[60vw] font-serif-bold pointer-events-none leading-none select-none">
        ”
      </div>
    </section>
  );
};

export default QuoteManifesto;
