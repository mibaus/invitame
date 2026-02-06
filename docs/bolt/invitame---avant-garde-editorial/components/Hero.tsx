
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-white flex flex-col justify-end p-6 md:p-12 overflow-hidden">
      {/* Texto en capas de fondo */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
        <motion.h1 
          className="text-[25vw] font-serif-bold leading-none select-none text-black/5 whitespace-nowrap"
          initial={{ x: '10%' }}
          animate={{ x: '-10%' }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        >
          VALENTINA & MATEO
        </motion.h1>
      </div>

      {/* Revelado de imagen principal */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[60%] lg:w-[45%] h-[70vh] z-10"
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 1.6 }}
      >
        <img 
          src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&h=1800&auto=format&fit=crop" 
          alt="Alta Costura Nupcial" 
          className="w-full h-full object-cover grayscale brightness-90 transition-all duration-700 hover:grayscale-0"
        />
        <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-20">
          <div className="flex justify-between items-start">
            <div className="font-mono-tech text-[10px] tracking-widest bg-red-600 px-3 py-1 uppercase font-bold">INVITACIÓN DE GALA</div>
            <div className="font-mono-tech text-[10px] tracking-widest text-right">BUENOS AIRES<br/>ARGENTINA</div>
          </div>
        </div>
      </motion.div>

      {/* Contenido en primer plano */}
      <div className="relative z-30 flex flex-col md:flex-row items-end justify-between w-full">
        <div className="w-full md:w-2/3">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            <h1 className="text-8xl md:text-[11vw] font-serif-bold leading-[0.8] tracking-tighter uppercase">
              EL <br/> <span className="text-red-600">ENLACE</span>
            </h1>
          </motion.div>
        </div>

        <div className="flex flex-col items-end mt-8 md:mt-0">
          <div className="font-mono-tech text-sm mb-6 border-r-4 border-red-600 pr-4 text-right text-black uppercase leading-tight font-bold">
            DOMINGO 24 NOV 2024<br/>
            RECEPCIÓN 18:30 HS<br/>
            GALA & BANQUETE
          </div>
          <motion.button 
            whileHover={{ backgroundColor: '#000', scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 text-white font-mono-tech px-14 py-7 text-xs font-bold tracking-[0.3em] transition-all uppercase shadow-lg shadow-red-600/20"
          >
            CONFIRMAR ASISTENCIA
          </motion.button>
        </div>
      </div>

      {/* Barra lateral vertical */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block overflow-hidden h-[300px]">
        <motion.div 
          className="rotate-[-90deg] origin-left font-mono-tech text-[9px] tracking-[0.6em] text-black/30 uppercase whitespace-nowrap"
          animate={{ x: [0, -100, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          VALENTINA R. + MATEO G. — UNIÓN CIVIL Y RELIGIOSA — MMXXIV
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
