
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

const RSVP: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', attendance: 'yes', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section className="py-24 px-4 bg-[#fcf9f2] linen-texture">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h3 className="font-pinyon text-4xl text-[#96adc0] mb-2">The Response</h3>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#a9a9a9]">Por favor confirma tu asistencia</p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div 
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-8 md:p-12 shadow-2xl rounded-sm border border-gray-100 relative"
              >
                {/* Visual card edges */}
                <div className="absolute inset-0 border-[15px] border-white z-0 pointer-events-none" />
                
                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-[#a9a9a9] block mb-2">Nombre Completo</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-transparent border-b border-[#c0c0c0] py-2 text-sm focus:outline-none focus:border-[#96adc0] transition-colors font-light tracking-wide"
                      placeholder="Escribe tu nombre..."
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-[#a9a9a9] block mb-2">¿Asistirás?</label>
                    <div className="flex gap-8 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="attendance" 
                          value="yes" 
                          checked={formData.attendance === 'yes'}
                          onChange={() => setFormData({...formData, attendance: 'yes'})}
                          className="accent-[#96adc0]"
                        />
                        <span className="text-[11px] uppercase tracking-wider text-[#4a4a4a]">Confirmar Asistencia</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer opacity-50">
                        <input 
                          type="radio" 
                          name="attendance" 
                          value="no"
                          checked={formData.attendance === 'no'}
                          onChange={() => setFormData({...formData, attendance: 'no'})}
                          className="accent-[#a9a9a9]"
                        />
                        <span className="text-[11px] uppercase tracking-wider text-[#4a4a4a]">No podré asistir</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-[#a9a9a9] block mb-2">Algún mensaje o restricción alimentaria</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-transparent border border-[#c0c0c0]/50 p-4 text-sm focus:outline-none focus:border-[#96adc0] transition-colors font-light tracking-wide resize-none italic"
                      placeholder="Ej. Vegetariano, alergias..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="text-center pt-4">
                    <button 
                      type="submit"
                      className="px-10 py-3 bg-[#96adc0] text-white text-[10px] tracking-[0.4em] uppercase rounded-full hover:bg-[#4a4a4a] transition-all duration-500 shadow-md shadow-[#96adc0]/20"
                    >
                      Enviar Respuesta
                    </button>
                  </div>
                  
                  <p className="text-center text-[9px] text-[#a9a9a9] mt-6 tracking-widest">Favor de confirmar antes del 1 de Agosto</p>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 text-center rounded-sm border border-gray-100 shadow-2xl relative min-h-[400px] flex flex-col items-center justify-center"
              >
                {/* Wax Seal Animation */}
                <motion.div 
                   initial={{ scale: 3, opacity: 0, rotate: -45 }}
                   animate={{ scale: 1, opacity: 1, rotate: 0 }}
                   transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
                   className="mb-8"
                >
                   <div className="w-20 h-20 bg-[#f4d7d4] rounded-full flex items-center justify-center shadow-lg relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-pink-300/30 to-transparent" />
                      <span className="font-script text-4xl text-[#4a4a4a] relative z-10">AL</span>
                      {/* Wax drip effect */}
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#f4d7d4] rounded-full blur-[2px]" />
                   </div>
                </motion.div>
                
                <h4 className="font-pinyon text-4xl text-[#4a4a4a] mb-4">Gracias</h4>
                <p className="text-[11px] text-[#a9a9a9] tracking-widest uppercase italic max-w-xs mx-auto">
                  Tu mensaje ha sido sellado con amor. <br/> Esperamos verte pronto.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default RSVP;
