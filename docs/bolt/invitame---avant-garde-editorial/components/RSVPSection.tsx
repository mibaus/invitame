
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RSVPSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', attendance: 'YES', message: '' });

  return (
    <section className="bg-red-600 text-white py-24 px-6 md:px-12 flex flex-col items-center justify-center">
      <motion.div 
        className="max-w-4xl w-full text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-7xl md:text-9xl font-serif-bold tracking-tighter mb-4 uppercase">CONFIRMAR</h2>
        <div className="font-mono-tech text-xs tracking-[0.6em] uppercase text-black font-bold">SUSCRIPCIÓN AL EVENTO</div>
      </motion.div>

      <form className="max-w-2xl w-full grid grid-cols-1 gap-8" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <label className="font-mono-tech text-[10px] tracking-widest uppercase mb-2 block text-black font-bold">NOMBRE COMPLETO</label>
          <input 
            type="text" 
            placeholder="ESCRIBE TU NOMBRE AQUÍ"
            className="w-full bg-transparent border-b-4 border-black p-4 font-serif-bold text-3xl md:text-5xl placeholder:text-white/30 focus:outline-none focus:border-white transition-colors uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => setFormData({...formData, attendance: 'YES'})}
            className={`py-6 font-mono-tech text-xl font-bold transition-all border-4 border-black uppercase ${formData.attendance === 'YES' ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-white'}`}
          >
            ASISTIRÉ
          </button>
          <button 
            type="button"
            onClick={() => setFormData({...formData, attendance: 'NO'})}
            className={`py-6 font-mono-tech text-xl font-bold transition-all border-4 border-black uppercase ${formData.attendance === 'NO' ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-white'}`}
          >
            NO PODRÉ IR
          </button>
        </div>

        <div className="relative">
          <label className="font-mono-tech text-[10px] tracking-widest uppercase mb-2 block text-black font-bold">NOTAS ESPECIALES / ALERGIAS</label>
          <textarea 
            rows={3}
            placeholder="DATOS ADICIONALES..."
            className="w-full bg-transparent border-4 border-black p-4 font-mono-tech text-sm placeholder:text-white/30 focus:outline-none focus:border-white transition-colors resize-none uppercase"
          />
        </div>

        <motion.button 
          whileHover={{ backgroundColor: '#000000', color: '#ffffff', scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white text-red-600 font-serif-bold text-4xl py-8 tracking-tighter shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all uppercase"
        >
          ENVIAR CONFIRMACIÓN
        </motion.button>

        <p className="text-center font-mono-tech text-[10px] tracking-[0.2em] mt-8 text-black opacity-60 uppercase">
          FECHA LÍMITE: 15 DE OCTUBRE, 2024. <br/>
          RESPUESTAS FUERA DE TÉRMINO NO SERÁN ACEPTADAS POR EL EDITOR.
        </p>
      </form>
    </section>
  );
};

export default RSVPSection;
