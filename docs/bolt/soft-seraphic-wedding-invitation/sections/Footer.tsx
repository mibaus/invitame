
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-32 px-4 relative overflow-hidden flex flex-col items-center text-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#96adc0]/10 to-transparent -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="relative z-10"
      >
        <div className="mb-12 flex justify-center opacity-30">
          {/* Silhouette / Line drawing placeholder using an icon */}
          <Heart className="w-16 h-16 stroke-1 text-[#4a4a4a]" />
        </div>

        <h3 className="font-pinyon text-4xl text-[#96adc0] mb-4">Contando los días para veros</h3>
        <p className="font-script text-5xl text-[#4a4a4a] mb-12">Alejandro & Luciana</p>

        <div className="space-y-2 mb-16">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#a9a9a9]">22 . 08 . 2026</p>
          <div className="w-8 h-[1px] bg-[#c0c0c0] mx-auto" />
        </div>

        <div className="text-[9px] uppercase tracking-[0.2em] text-[#c0c0c0]">
          Hecho con amor • 2026
        </div>
      </motion.div>

      {/* Final decorative watercolor smear */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#f4d7d4]/10 rounded-full blur-[80px]" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#96adc0]/10 rounded-full blur-[80px]" />
    </footer>
  );
};

export default Footer;
