
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Countdown: React.FC = () => {
  const targetDate = new Date('2026-08-22T18:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ label, value, pulse = false }: { label: string, value: number, pulse?: boolean }) => (
    <div className="flex flex-col items-center">
      <motion.div 
        animate={pulse ? { scale: [1, 1.05, 1] } : {}}
        transition={pulse ? { duration: 1, repeat: Infinity } : {}}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-dashed border-[#96adc0]/40 flex items-center justify-center mb-2 relative bg-white/30 backdrop-blur-sm"
      >
        <span className="text-xl md:text-2xl font-light text-[#4a4a4a]">{value.toString().padStart(2, '0')}</span>
        {/* Ornamental lace effect corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#c0c0c0]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#c0c0c0]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#c0c0c0]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#c0c0c0]" />
      </motion.div>
      <span className="text-[9px] uppercase tracking-[0.2em] text-[#a9a9a9]">{label}</span>
    </div>
  );

  return (
    <section className="py-20 px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="max-w-xl mx-auto text-center"
      >
        <h3 className="font-pinyon text-2xl text-[#96adc0] mb-10 tracking-widest">The Wait</h3>
        <div className="flex justify-center gap-4 md:gap-8">
          <TimeUnit label="Días" value={timeLeft.days} />
          <TimeUnit label="Horas" value={timeLeft.hours} />
          <TimeUnit label="Minutos" value={timeLeft.minutes} />
          <TimeUnit label="Segundos" value={timeLeft.seconds} pulse={true} />
        </div>
      </motion.div>
    </section>
  );
};

export default Countdown;
