
import React from 'react';
import { motion } from 'framer-motion';

const Quote: React.FC = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Subtle Wreath decoration - Simulated with SVG and gradient circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full rotate-45">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#96adc0" strokeWidth="0.5" strokeDasharray="5 5" />
          <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#f4d7d4" transform="rotate(30, 100, 100)" />
          <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#96adc0" transform="rotate(90, 100, 100)" />
          <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#f4d7d4" transform="rotate(150, 100, 100)" />
          <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#96adc0" transform="rotate(210, 100, 100)" />
          <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#f4d7d4" transform="rotate(270, 100, 100)" />
          <path d="M100 10 Q110 30 100 50 Q90 30 100 10" fill="#96adc0" transform="rotate(330, 100, 100)" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="max-w-2xl mx-auto text-center relative z-10"
      >
        <div className="mb-8">
           <span className="font-pinyon text-4xl text-[#c0c0c0]">"</span>
        </div>
        <p className="font-script text-3xl md:text-4xl text-[#4a4a4a] leading-relaxed mb-8 italic">
          Que todas nuestras noches sean aventuras <br className="hidden md:block"/>
          y que cada mañana sea un nuevo comienzo <br className="hidden md:block"/>
          de este amor que hoy decidimos unir para siempre.
        </p>
        <div className="w-20 h-[1px] bg-[#c0c0c0] mx-auto mb-6" />
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#a9a9a9]">Nuestro Voto Eterno</span>
      </motion.div>
    </section>
  );
};

export default Quote;
