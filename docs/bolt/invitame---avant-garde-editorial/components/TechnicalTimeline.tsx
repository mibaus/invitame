
import React from 'react';
import { motion } from 'framer-motion';

const schedule = [
  { time: '18:30', event: 'EL RECIBIMIENTO', detail: 'CÓCTEL DE BIENVENIDA Y RECEPCIÓN' },
  { time: '19:30', event: 'LOS VOTOS', detail: 'CEREMONIA BAJO EL ARCO GEOMÉTRICO' },
  { time: '21:00', event: 'EL BANQUETE', detail: 'EXPERIENCIA GASTRONÓMICA DE VANGUARDIA' },
  { time: '23:30', event: 'LA FIESTA', detail: 'RITMOS DE MEDIANOCHE Y CELEBRACIÓN' },
  { time: '04:00', event: 'EL CIERRE', detail: 'CRÉDITOS FINALES' },
];

const TechnicalTimeline: React.FC = () => {
  return (
    <section className="bg-white px-6 md:px-12 py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-4 border-black pb-4">
        <h2 className="text-6xl md:text-8xl font-serif-bold tracking-tighter">CRONOGRAMA</h2>
        <div className="font-mono-tech text-xs tracking-widest text-black/40 uppercase">TECH_DOC_04_SECUENCIA.EXE</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 border-t-2 border-black">
        {schedule.map((item, idx) => (
          <motion.div 
            key={idx}
            className="flex flex-col md:flex-row group border-b-2 border-black items-center overflow-hidden"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="w-full md:w-48 bg-black text-white py-12 px-6 flex items-center justify-center font-mono-tech text-4xl font-bold transition-colors group-hover:bg-red-600">
              {item.time}
            </div>
            <div className="flex-1 px-8 py-12 flex flex-col justify-center items-start md:items-start text-center md:text-left w-full">
              <h3 className="text-4xl md:text-5xl font-serif-bold mb-2 tracking-tight group-hover:translate-x-4 transition-transform duration-500 text-black uppercase">
                {item.event}
              </h3>
              <p className="font-mono-tech text-xs tracking-[0.2em] text-black/60 uppercase">
                {item.detail}
              </p>
            </div>
            <div className="hidden md:flex w-24 h-full items-center justify-center border-l-2 border-black bg-white group-hover:bg-black transition-colors">
              <div className="w-4 h-4 rounded-full border-2 border-black group-hover:bg-red-600 group-hover:border-red-600 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TechnicalTimeline;
