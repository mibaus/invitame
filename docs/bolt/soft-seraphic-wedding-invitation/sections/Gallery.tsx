
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const images = [
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    caption: "El comienzo"
  },
  {
    src: "https://images.unsplash.com/photo-1519225495810-7517c33000e1?q=80&w=800&auto=format&fit=crop",
    caption: "Promesas"
  },
  {
    src: "https://images.unsplash.com/photo-1522673607200-16488321499b?q=80&w=800&auto=format&fit=crop",
    caption: "Nuestro lugar"
  },
  {
    src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
    caption: "Para siempre"
  },
];

const Gallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { scrollWidth, offsetWidth } = containerRef.current;
      setConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
    }
  }, []);

  return (
    <section className="py-24 px-4 overflow-hidden bg-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h3 className="font-pinyon text-4xl text-[#96adc0] mb-2">The Keepsakes</h3>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#a9a9a9]">Nuestros momentos favoritos</p>
        </motion.div>

        {/* Draggable Container */}
        <div className="relative cursor-grab active:cursor-grabbing">
          <motion.div 
            ref={containerRef}
            drag="x"
            dragConstraints={constraints}
            dragElastic={0.1}
            className="flex gap-6 md:gap-10 pb-12 pt-6 px-4 no-scrollbar"
            style={{ width: 'max-content' }}
          >
            {images.map((img, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-[280px] md:w-[320px] select-none"
              >
                <div 
                  className="bg-white p-4 shadow-[0_15px_45px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center relative group overflow-hidden"
                  style={{ 
                    rotate: index % 2 === 0 ? '-1.5deg' : '1.5deg',
                    borderRadius: '1px'
                  }}
                >
                  {/* Decorative tape effect */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#fcf9f2]/60 backdrop-blur-sm -translate-y-2 rotate-2 z-20 border border-black/5" />
                  
                  <div className="w-full aspect-[4/5] overflow-hidden mb-6 bg-[#fcf9f2] relative">
                    <img 
                      src={img.src} 
                      alt={img.caption} 
                      draggable="false"
                      className="w-full h-full object-cover sepia-[0.1] contrast-[0.98] transition-transform duration-[3s] group-hover:scale-110 pointer-events-none" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="w-full text-center pb-3">
                    <span className="font-script text-2xl text-[#4a4a4a] opacity-80">
                      {img.caption}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Interaction Indicator */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="flex gap-1.5 items-center">
            {images.map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-[#96adc0]' : 'bg-[#c0c0c0]/40'}`} />
            ))}
          </div>
          <p className="text-[9px] uppercase tracking-[0.5em] text-[#a9a9a9] opacity-60 animate-pulse">
            Desliza para explorar
          </p>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
