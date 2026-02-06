
import React from 'react';
import { motion } from 'framer-motion';
import { Music, Play, SkipBack, SkipForward } from 'lucide-react';

const SpotifyPlayer: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-white/30 backdrop-blur-sm">
      <div className="max-w-xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <h3 className="font-pinyon text-3xl text-[#96adc0] mb-2">The Melody</h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a9a9a9]">Nuestra banda sonora</p>
        </motion.div>

        <div className="relative p-8 rounded-[40px] silver-border bg-white flex flex-col items-center">
          {/* Floral Decoration Frame */}
          <div className="absolute -top-6 -left-6 w-24 h-24 opacity-20 pointer-events-none">
            <img src="https://picsum.photos/id/152/200/200?blur=10" alt="decor" className="rounded-full" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-20 pointer-events-none">
            <img src="https://picsum.photos/id/152/200/200?blur=10" alt="decor" className="rounded-full" />
          </div>

          <div className="w-full flex flex-col items-center z-10">
             <div className="w-32 h-32 bg-[#96adc0]/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner overflow-hidden">
                <Music className="w-12 h-12 text-[#96adc0] opacity-30" />
                <img src="https://picsum.photos/id/201/200/200" className="absolute w-32 h-32 object-cover opacity-80 group-hover:scale-110 transition-transform duration-[3s]" alt="Album cover" />
             </div>
             
             <h4 className="text-sm tracking-widest uppercase font-medium text-[#4a4a4a] mb-1">Perfect</h4>
             <p className="text-[10px] text-[#a9a9a9] tracking-widest uppercase mb-8">Ed Sheeran</p>

             {/* Player Controls Mockup */}
             <div className="w-full max-w-xs space-y-6">
                <div className="w-full h-[2px] bg-[#fcf9f2] relative">
                   <div className="absolute top-0 left-0 w-1/3 h-full bg-[#96adc0]" />
                   <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-2 h-2 rounded-full bg-[#96adc0]" />
                </div>
                <div className="flex justify-between text-[8px] text-[#a9a9a9] tracking-tighter">
                   <span>1:24</span>
                   <span>4:23</span>
                </div>
                <div className="flex items-center justify-center gap-8">
                   <button className="text-[#c0c0c0] hover:text-[#96adc0] transition-colors"><SkipBack className="w-5 h-5 fill-current" /></button>
                   <button className="w-14 h-14 bg-[#96adc0] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#4a4a4a] transition-all"><Play className="w-6 h-6 fill-current ml-1" /></button>
                   <button className="text-[#c0c0c0] hover:text-[#96adc0] transition-colors"><SkipForward className="w-5 h-5 fill-current" /></button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotifyPlayer;
