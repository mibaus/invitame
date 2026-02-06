
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import CountdownMarquee from './components/CountdownMarquee';
import QuoteManifesto from './components/QuoteManifesto';
import TechnicalTimeline from './components/TechnicalTimeline';
import VenuesSection from './components/VenuesSection';
import DressCode from './components/DressCode';
import GalleryLookbook from './components/GalleryLookbook';
import LuxuryRegistry from './components/LuxuryRegistry';
import RSVPSection from './components/RSVPSection';
import SpotifyRecord from './components/SpotifyRecord';
import FooterCredits from './components/FooterCredits';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-red-600 selection:text-white overflow-hidden cursor-default">
      <CustomCursor />
      <SpotifyRecord />
      
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white p-8"
            exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          >
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="font-mono-tech text-xs mb-4 tracking-[0.3em]"
            >
              PREPARANDO EDICIÓN NUPCIAL
            </motion.div>
            <motion.div 
              className="w-48 h-[2px] bg-white/20 overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2 }}
            >
              <motion.div 
                className="w-full h-full bg-red-600 origin-left"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative">
        <Hero />
        <CountdownMarquee />
        <QuoteManifesto />
        <TechnicalTimeline />
        <VenuesSection />
        <DressCode />
        <GalleryLookbook />
        <LuxuryRegistry />
        <RSVPSection />
        <FooterCredits />
      </main>
    </div>
  );
};

export default App;
