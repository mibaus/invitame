
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownMarquee: React.FC = () => {
  const targetDate = new Date('2024-11-24T18:30:00');
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = `${timeLeft.days}D ${timeLeft.hours}H ${timeLeft.minutes}M ${timeLeft.seconds}S`.toUpperCase();

  return (
    <div className="bg-black py-10 overflow-hidden whitespace-nowrap border-y-[1px] border-white/10">
      <motion.div 
        className="flex gap-20 items-center"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-20 items-center">
            <span className="text-red-600 font-mono-tech text-5xl md:text-7xl font-bold tracking-tighter">
              {timeString}
            </span>
            <span className="text-white/40 font-serif-bold italic text-5xl md:text-7xl uppercase">
              PARA EL SÍ, QUIERO
            </span>
            <div className="w-3 h-3 bg-red-600 rotate-45" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CountdownMarquee;
