
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isGallery, setIsGallery] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const computedCursor = window.getComputedStyle(target).cursor;
      setIsPointer(computedCursor === 'pointer' || computedCursor === 'grab' || computedCursor === 'grabbing');
      setIsGallery(!!target.closest('.gallery-item') || !!target.closest('.cursor-grab'));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:flex items-center justify-center"
      animate={{
        x: mousePos.x,
        y: mousePos.y,
        scale: isPointer ? 1.2 : 1,
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.5 }}
    >
      <div className={`
        ${isGallery ? 'w-24 h-24 rounded-full bg-red-600' : 'w-4 h-4 rounded-full bg-white'}
        flex items-center justify-center transition-all duration-300
      `}>
        {isGallery && (
          <span className="text-white font-mono-tech text-[10px] font-bold tracking-widest">DRAG</span>
        )}
      </div>
    </motion.div>
  );
};

export default CustomCursor;
