
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const photos = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&h=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225495810-7512312635db?q=80&w=1200&h=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&h=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=1200&h=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&h=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495910483-db4452178c1f?q=80&w=1200&h=800&auto=format&fit=crop",
];

const GalleryLookbook: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  
  // Usamos un valor de movimiento para un scroll suave
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = containerRef.current.scrollWidth;
      setConstraints({ left: -(contentWidth - containerWidth + 48), right: 0 });
    }
    
    // Recalcular al cambiar el tamaño de la ventana
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = containerRef.current.scrollWidth;
        setConstraints({ left: -(contentWidth - containerWidth + 48), right: 0 });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="bg-black py-24 overflow-hidden">
      <div className="px-6 md:px-12 mb-12 flex justify-between items-end">
        <h2 className="text-white text-6xl md:text-8xl font-serif-bold tracking-tighter uppercase">PORTAFOLIO</h2>
        <div className="font-mono-tech text-xs text-red-600 font-bold tracking-[0.4em] hidden md:block uppercase">
          GALLERY_SPREAD_FINAL.PDF
        </div>
      </div>
      
      {/* Contenedor con DRAG de Framer Motion */}
      <div className="relative cursor-grab active:cursor-grabbing px-6 md:px-12">
        <motion.div 
          ref={containerRef}
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.1}
          style={{ x: springX }}
          className="flex gap-8 items-start whitespace-nowrap"
        >
          {photos.map((src, idx) => (
            <motion.div 
              key={idx}
              className={`
                gallery-item relative flex-shrink-0 overflow-hidden select-none
                ${idx % 2 === 0 ? 'w-[70vw] md:w-[45vw] aspect-[4/3]' : 'w-[50vw] md:w-[35vw] aspect-[3/4] mt-12 md:mt-24'}
              `}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
            >
              <img 
                src={src} 
                alt={`Imagen de boda ${idx}`} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 pointer-events-none" 
              />
              <div className="absolute bottom-4 left-4 bg-white text-black font-mono-tech text-[10px] px-3 py-1 uppercase font-bold">
                SHOT_ID: 0{idx + 1}
              </div>
            </motion.div>
          ))}
          {/* Espaciador final para el drag */}
          <div className="flex-shrink-0 w-24 h-1"></div>
        </motion.div>
      </div>
      
      <div className="mt-16 px-6 md:px-12 flex items-center gap-4">
        <div className="flex-1 h-[1px] bg-white/10"></div>
        <div className="font-mono-tech text-[10px] text-white/40 tracking-[0.5em] uppercase">
          ARRASTRA O DESLIZA PARA NAVEGAR
        </div>
        <div className="flex-1 h-[1px] bg-white/10"></div>
      </div>
    </section>
  );
};

export default GalleryLookbook;
