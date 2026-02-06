
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
} from 'lucide-react';

// Components
import FallingPetals from './components/FallingPetals';
import Countdown from './components/Countdown';
import Hero from './sections/Hero';
import Quote from './sections/Quote';
import Timeline from './sections/Timeline';
import Venues from './sections/Venues';
import DressCode from './sections/DressCode';
import Gallery from './sections/Gallery';
import Gifts from './sections/Gifts';
import RSVP from './sections/RSVP';
import SpotifyPlayer from './sections/SpotifyPlayer';
import Footer from './sections/Footer';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startInvitation = () => {
    setHasStarted(true);
    // Intentar reproducir música tras la interacción del usuario
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log("Audio play blocked:", err));
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative min-h-screen linen-texture overflow-hidden selection:bg-pink-100">
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3" // Romantic Piano Track
      />

      <AnimatePresence>
        {!hasStarted ? (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fcf9f2] p-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="max-w-md"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 border-2 border-[#c0c0c0] rounded-full flex items-center justify-center relative">
                  <span className="font-script text-4xl text-[#96adc0] z-10">A & L</span>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-[#96adc0]/20 rounded-full"
                  />
                </div>
              </div>
              <h1 className="font-pinyon text-3xl mb-4 text-[#4a4a4a]">Nuestra Historia Comienza</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-[#a9a9a9] mb-12">Te invitamos a ser parte de este sueño</p>
              <button 
                onClick={startInvitation}
                className="px-10 py-4 border border-[#c0c0c0] text-[#96adc0] hover:bg-[#96adc0] hover:text-white transition-all duration-700 tracking-widest uppercase text-xs rounded-full shadow-sm hover:shadow-md"
              >
                Abrir Invitación
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.main 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="relative"
          >
            <FallingPetals />
            
            <Hero />
            <Countdown />
            <Quote />
            <Timeline />
            <Venues />
            <DressCode />
            <Gallery />
            <Gifts />
            <RSVP />
            <SpotifyPlayer />
            <Footer />

            {/* Floating Audio Control */}
            <motion.button 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={toggleAudio}
              className="fixed bottom-6 right-6 z-50 bg-white/40 backdrop-blur-md p-4 rounded-full border border-white/50 shadow-lg hover:bg-white/60 transition-all active:scale-95 group overflow-hidden"
              aria-label={isPlaying ? "Silenciar música" : "Reproducir música"}
            >
              {isPlaying ? (
                <div className="relative">
                  <Music className="w-5 h-5 text-[#96adc0]" />
                  {/* Seraphic Pulse Animation */}
                  <motion.div 
                    animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 bg-[#96adc0] rounded-full -z-10"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-[#96adc0] rounded-full -z-10"
                  />
                </div>
              ) : (
                <div className="relative opacity-40">
                  <Music className="w-5 h-5 text-[#a9a9a9]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1.5px] bg-[#a9a9a9] rotate-45" />
                </div>
              )}
            </motion.button>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
