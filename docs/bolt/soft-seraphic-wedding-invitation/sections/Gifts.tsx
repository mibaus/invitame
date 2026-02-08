
import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Mail } from 'lucide-react';

const Gifts: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12"
        >
          <h3 className="font-pinyon text-3xl text-[#96adc0] mb-2">The Love Fund</h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a9a9a9]">Mesa de Regalos</p>
        </motion.div>

        <div className="bg-white/40 backdrop-blur-sm p-10 rounded-[30px] border border-[#c0c0c0]/20 shadow-sm relative overflow-hidden">
          {/* Subtle envelope-like background detail */}
          <div className="absolute top-0 left-0 w-full h-2 bg-[#96adc0]/20" />
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#fcf9f2] flex items-center justify-center border border-[#c0c0c0]/30 shadow-inner">
               <Mail className="w-6 h-6 text-[#96adc0]" />
            </div>
          </div>

          <p className="text-[11px] text-[#a9a9a9] tracking-widest leading-relaxed mb-8 italic italic">
            "Tu presencia es nuestro mejor regalo, <br className="hidden md:block"/>
            pero si deseáis tener un detalle con nosotros, <br className="hidden md:block"/>
            os agradecemos vuestro cariño a través de nuestro fondo de amor."
          </p>

          <div className="space-y-4 text-center">
             <div className="p-4 border border-dashed border-[#c0c0c0] rounded-xl bg-white/50">
                <span className="text-[9px] uppercase tracking-widest text-[#a9a9a9] block mb-1">CBU / Cuenta Bancaria</span>
                <span className="text-sm tracking-wider font-light text-[#4a4a4a]">0000003100094918237465</span>
                <p className="text-[9px] text-[#96adc0] mt-1">Titular: Alejandro y Luciana</p>
             </div>
             
             <button className="text-[10px] uppercase tracking-[0.3em] text-[#96adc0] border-b border-[#96adc0] pb-1 hover:text-[#4a4a4a] hover:border-[#4a4a4a] transition-all">
               Ver lista en Amazon
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gifts;
