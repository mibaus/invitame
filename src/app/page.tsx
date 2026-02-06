'use client';

import { useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Gallery from '@/components/landing/Gallery';
import Features from '@/components/landing/Features';
import FAQ from '@/components/landing/FAQ';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/landing/Footer';
import FloatingWhatsApp from '@/components/landing/FloatingWhatsApp';

export default function Home() {
  useEffect(() => {
    // Reveal animation on scroll
    const reveal = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', reveal);
    reveal(); // Initial check
    return () => window.removeEventListener('scroll', reveal);
  }, []);

  return (
    <div className="min-h-screen bg-cloud">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Gallery />
        <Features />
        <FAQ />
        <Pricing />
      </main>
      <Footer />
      <FloatingWhatsApp />
      
      {/* Global reveal animation styles */}
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out;
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
