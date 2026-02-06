
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FallingPetals: React.FC = () => {
  const petals = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 20,
      size: 10 + Math.random() * 15,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ 
            top: '-5%', 
            left: petal.left, 
            opacity: 0,
            rotate: petal.rotation 
          }}
          animate={{ 
            top: '105%', 
            opacity: [0, 0.4, 0.4, 0],
            rotate: petal.rotation + 360,
            x: [0, 50, -50, 0]
          }}
          transition={{ 
            duration: petal.duration, 
            repeat: Infinity, 
            delay: petal.delay,
            ease: "linear"
          }}
          className="absolute"
          style={{ width: petal.size, height: petal.size }}
        >
          {/* Simple petal shape with soft pink gradient */}
          <div className="w-full h-full bg-[#f4d7d4]/30 rounded-full blur-[1px]" 
               style={{ borderRadius: '50% 0 50% 50%' }} />
        </motion.div>
      ))}
    </div>
  );
};

export default FallingPetals;
