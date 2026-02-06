
import React from 'react';
import { motion } from 'framer-motion';

const SpotifyRecord: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[80] group">
      <motion.div 
        className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-black shadow-2xl flex items-center justify-center p-2"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-[1px] border-white/10" />
        <div className="absolute inset-4 rounded-full border-[1px] border-white/10" />
        <div className="absolute inset-8 rounded-full border-[1px] border-white/10" />
        
        <div className="w-full h-full rounded-full overflow-hidden relative">
          <img src="https://picsum.photos/seed/album/200/200" alt="Portada de álbum" className="w-full h-full object-cover grayscale brightness-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-black" />
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="absolute right-full mr-4 bottom-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border-2 border-black p-4 w-48 shadow-[5px_5px_0px_0px_rgba(255,0,0,1)]">
        <div className="font-mono-tech text-[10px] text-black font-bold uppercase mb-1">REPRODUCIENDO</div>
        <div className="font-serif-bold text-sm text-black uppercase">NUESTRA BANDA SONORA</div>
        <button className="mt-2 text-[10px] font-mono-tech text-red-600 font-bold hover:underline uppercase">ABRIR SPOTIFY →</button>
      </div>
    </div>
  );
};

export default SpotifyRecord;
