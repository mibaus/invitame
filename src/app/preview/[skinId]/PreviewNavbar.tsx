'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PreviewNavbarProps {
  currentSkin: string;
  isRealData?: boolean;
}

export function PreviewNavbar({ currentSkin, isRealData = false }: PreviewNavbarProps) {
  const router = useRouter();

  const handleSkinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/preview/${e.target.value}`);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link 
          href={isRealData ? "/admin" : "/gallery"}
          className="text-gold-400 text-sm hover:text-gold-300 flex items-center gap-2"
        >
          ← {isRealData ? 'Volver a Admin' : 'Volver a Galería'}
        </Link>
        
        <div className="flex items-center gap-4">
          {isRealData ? (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
              Datos reales del cliente
            </span>
          ) : (
            <span className="text-cream-400 text-sm">
              Previewing: <strong className="text-gold-400">{currentSkin}</strong>
            </span>
          )}
          
          {/* Skin Switcher */}
          <select
            value={currentSkin}
            onChange={handleSkinChange}
            className="bg-charcoal-900 text-cream-100 text-sm px-3 py-1.5 rounded-lg border border-gold-500/20 focus:border-gold-500/50 focus:outline-none"
          >
            <option value="bolt-dark">Bolt Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
}
