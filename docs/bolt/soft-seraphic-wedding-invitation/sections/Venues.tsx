
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail } from 'lucide-react';

const Venues: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h3 className="font-pinyon text-3xl text-[#96adc0] mb-2">The Venues</h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a9a9a9]">Donde celebraremos</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Ceremony Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[40px] silver-border text-center flex flex-col items-center transition-all duration-500"
          >
            <div className="w-16 h-16 bg-[#fcf9f2] rounded-full flex items-center justify-center mb-6">
               <MapPin className="w-6 h-6 text-[#96adc0]" />
            </div>
            <h4 className="font-pinyon text-3xl text-[#4a4a4a] mb-2">Ceremonia Religiosa</h4>
            <p className="text-xs uppercase tracking-[0.2em] text-[#96adc0] font-medium mb-4">Catedral Basílica de la Inmaculada</p>
            <p className="text-[11px] text-[#a9a9a9] leading-relaxed mb-8 max-w-[250px]">
              Calle Real 123, Centro Histórico <br/> 17:00 HRS
            </p>
            <button className="px-6 py-3 border border-[#c0c0c0] text-[10px] tracking-[0.3em] uppercase text-[#96adc0] rounded-full hover:bg-[#96adc0] hover:text-white transition-all flex items-center gap-2">
              <Mail className="w-3 h-3" /> Cómo llegar
            </button>
          </motion.div>

          {/* Reception Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[40px] silver-border text-center flex flex-col items-center transition-all duration-500"
          >
            <div className="w-16 h-16 bg-[#fcf9f2] rounded-full flex items-center justify-center mb-6">
               <MapPin className="w-6 h-6 text-[#96adc0]" />
            </div>
            <h4 className="font-pinyon text-3xl text-[#4a4a4a] mb-2">Recepción & Fiesta</h4>
            <p className="text-xs uppercase tracking-[0.2em] text-[#96adc0] font-medium mb-4">Quinta Los Seraphines</p>
            <p className="text-[11px] text-[#a9a9a9] leading-relaxed mb-8 max-w-[250px]">
              Camino al Valle 45, Sector Jardín <br/> 19:30 HRS
            </p>
            <button className="px-6 py-3 border border-[#c0c0c0] text-[10px] tracking-[0.3em] uppercase text-[#96adc0] rounded-full hover:bg-[#96adc0] hover:text-white transition-all flex items-center gap-2">
              <Mail className="w-3 h-3" /> Cómo llegar
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Venues;
