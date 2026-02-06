
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-20 pb-32 px-4 overflow-visible">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#96adc0]/15 via-[#fcf9f2] to-[#fcf9f2] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center w-full max-w-lg mx-auto"
      >
        <span className="text-[10px] uppercase tracking-[0.6em] text-[#a9a9a9] mb-8 block font-light">Nuestra Boda</span>
        
        {/* Main Photo Frame - Sustainable Archway */}
        <div className="relative mb-10 mx-auto w-[260px] md:w-[350px]">
          {/* Decorative SVG Filigree Top */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-10 text-[#c0c0c0] opacity-60 z-20">
            <svg viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="0.5">
              <path d="M10 15 Q30 5 50 15 Q70 5 90 15" strokeLinecap="round" />
              <circle cx="50" cy="8" r="1.5" fill="currentColor" />
            </svg>
          </div>

          <div className="relative group p-3">
            <div className="decorative-outline" />
            
            <div className="seraphic-arch relative z-10 aspect-[3/4] bg-white">
              <img 
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop" 
                alt="Romantic Wedding" 
                className="w-full h-full object-cover sepia-[0.1] contrast-[1.02] transition-transform duration-1000 group-hover:scale-105"
                style={{ objectPosition: 'center 20%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#96adc0]/10 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Floral floating ornaments */}
          <div className="absolute -top-6 -right-10 w-24 h-24 opacity-15 pointer-events-none rotate-12 blur-[1px]">
            <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=300&auto=format&fit=crop" alt="decor" className="rounded-full" />
          </div>
          <div className="absolute -bottom-6 -left-10 w-32 h-32 opacity-15 pointer-events-none -rotate-12 blur-[1px]">
            <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=300&auto=format&fit=crop" alt="decor" className="rounded-full" />
          </div>
        </div>

        {/* Names Container - High Line Height to prevent clipping */}
        <div className="mb-6 relative z-30">
          <h2 className="font-script text-6xl md:text-8xl text-[#4a4a4a] leading-[1.6] py-2">
            <motion.span 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              transition={{ delay: 0.5, duration: 2 }}
              className="block px-4"
            >
              Alejandro
            </motion.span>
            
            <div className="flex items-center justify-center my-[-10px]">
               <div className="w-8 h-[1px] bg-[#c0c0c0]/30 hidden md:block" />
               <span className="font-pinyon text-2xl md:text-3xl mx-4 text-[#96adc0] opacity-60 italic tracking-widest leading-none">&</span>
               <div className="w-8 h-[1px] bg-[#c0c0c0]/30 hidden md:block" />
            </div>

            <motion.span
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              transition={{ delay: 0.8, duration: 2 }}
              className="block px-4"
            >
              Luciana
            </motion.span>
          </h2>
        </div>

        {/* Date in Letters */}
        <div className="space-y-3 mt-8">
          <div className="w-12 h-[1px] bg-[#c0c0c0] mx-auto mb-4 opacity-40" />
          <p className="font-light tracking-[0.5em] text-xs uppercase text-[#a9a9a9]">Sábado veintidós de Agosto</p>
          <p className="font-light tracking-[0.3em] text-[10px] uppercase text-[#a9a9a9] opacity-70">Dos mil veintiséis</p>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute bottom-8 cursor-pointer flex flex-col items-center"
      >
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#c0c0c0] to-transparent mb-3 opacity-50" />
        <div className="text-[#96adc0] opacity-40">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
