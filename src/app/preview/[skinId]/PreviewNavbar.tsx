'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PreviewNavbarProps {
  currentSkin: string;
}

export function PreviewNavbar({ currentSkin }: PreviewNavbarProps) {
  const router = useRouter();

  const handleSkinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/preview/${e.target.value}`);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link 
          href="/gallery"
          className="text-gold-400 text-sm hover:text-gold-300 flex items-center gap-2"
        >
          ← Volver a Galería
        </Link>
        
        <div className="flex items-center gap-4">
          <span className="text-cream-400 text-sm">
            Previewing: <strong className="text-gold-400">{currentSkin}</strong>
          </span>
          
          {/* Skin Switcher */}
          <select
            value={currentSkin}
            onChange={handleSkinChange}
            className="bg-charcoal-900 text-cream-100 text-sm px-3 py-1.5 rounded-lg border border-gold-500/20 focus:border-gold-500/50 focus:outline-none"
          >
            <optgroup label="Essential">
              <option value="classic-elegance">Classic Elegance</option>
              <option value="minimal-chic">Minimal Chic</option>
              <option value="garden-romance">Garden Romance</option>
            </optgroup>
            <optgroup label="Pro">
              <option value="modern-luxe">Modern Luxe</option>
              <option value="royal-gold">Royal Gold</option>
              <option value="botanical-dream">Botanical Dream</option>
            </optgroup>
            <optgroup label="Premium">
              <option value="celestial-noir">Celestial Noir</option>
              <option value="renaissance-opulence">Renaissance Opulence</option>
              <option value="bespoke-couture">Bespoke Couture</option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}
