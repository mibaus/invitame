'use client';

import React from 'react';
import { InteractiveDemoShowcase } from './InteractiveDemoShowcase';
import { MobileStoriesGallery } from './MobileStoriesGallery';

export default function Gallery() {
  return (
    <section id="galeria" className="py-16 md:py-20">
      {/* Mobile View - Stories Gallery */}
      <div className="md:hidden pb-8">
        <MobileStoriesGallery />
      </div>

      {/* Desktop View - Interactive Demo Showcase */}
      <div className="hidden md:block px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <InteractiveDemoShowcase />
        </div>
      </div>
    </section>
  );
}
