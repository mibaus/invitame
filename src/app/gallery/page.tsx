import Link from 'next/link';
import type { SkinId, ServiceTier } from '@/types';

interface SkinInfo {
  id: SkinId;
  name: string;
  tier: ServiceTier;
  description: string;
  palette: string[];
  fonts: string;
}

const SKINS: SkinInfo[] = [
  // Essential
  {
    id: 'classic-elegance',
    name: 'Classic Elegance',
    tier: 'essential',
    description: 'Boda tradicional, atemporal',
    palette: ['#FFFFFF', '#1a1a2e', '#d4af37'],
    fonts: 'Playfair Display / Lato',
  },
  {
    id: 'minimal-chic',
    name: 'Minimal Chic',
    tier: 'essential',
    description: 'Limpieza absoluta, estilo Apple/Vogue',
    palette: ['#FAF9F6', '#8B8589', '#D3D3D3'],
    fonts: 'Montserrat / Lato',
  },
  {
    id: 'garden-romance',
    name: 'Garden Romance',
    tier: 'essential',
    description: 'Orgánico, suave, flores y aire libre',
    palette: ['#7a9d7a', '#E8B4B8', '#F5F0E6'],
    fonts: 'Great Vibes / Montserrat',
  },
  // Pro
  {
    id: 'modern-luxe',
    name: 'Modern Luxe',
    tier: 'pro',
    description: 'Arquitectónico, audaz, nocturno',
    palette: ['#191970', '#C0C0C0', '#FFFFFF'],
    fonts: 'Bodoni Moda / Open Sans',
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    tier: 'pro',
    description: 'Máxima opulencia, palacios, brillo',
    palette: ['#FFD700', '#1a1a1a', '#800020'],
    fonts: 'Cinzel / Montserrat',
  },
  {
    id: 'botanical-dream',
    name: 'Botanical Dream',
    tier: 'pro',
    description: 'Selva tropical, boho-chic moderno',
    palette: ['#046307', '#E07A5F', '#F4E8D1'],
    fonts: 'Cormorant Garamond / Lato',
  },
  // Premium
  {
    id: 'celestial-noir',
    name: 'Celestial Noir',
    tier: 'premium',
    description: 'Místico, estrellas, elegancia nocturna',
    palette: ['#0a0a0f', '#d4af37', '#2d1b4e'],
    fonts: 'Tenor Sans / Montserrat',
  },
  {
    id: 'renaissance-opulence',
    name: 'Renaissance Opulence',
    tier: 'premium',
    description: 'Arte clásico, texturas de mármol y óleo',
    palette: ['#F5F0E6', '#B8860B', '#A0522D'],
    fonts: 'Italianno / Playfair Display',
  },
  {
    id: 'bespoke-couture',
    name: 'Bespoke Couture',
    tier: 'premium',
    description: 'Alta costura, texturas de tela, editorial',
    palette: ['#D3D3D3', '#1c1c1c', '#B87333'],
    fonts: 'Didot / Source Sans 3',
  },
];

const TIER_COLORS: Record<ServiceTier, string> = {
  essential: 'bg-emerald-500',
  pro: 'bg-blue-500',
  premium: 'bg-purple-500',
};

const TIER_LABELS: Record<ServiceTier, string> = {
  essential: 'Essential',
  pro: 'Pro',
  premium: 'Premium',
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-charcoal-950 text-cream-100 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="text-gold-400 text-sm tracking-widest hover:text-gold-300">
            ← Volver al Inicio
          </Link>
          <h1 className="font-heading text-5xl text-gold-400 mt-8 mb-4">
            Galería de Skins
          </h1>
          <p className="text-cream-400 max-w-2xl mx-auto">
            Explora los 9 diseños disponibles. Haz clic en cualquiera para ver el preview completo.
          </p>
        </div>

        {/* Grid de Skins */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SKINS.map((skin) => (
            <Link
              key={skin.id}
              href={`/preview/${skin.id}`}
              className="group block"
            >
              <div className="bg-charcoal-900 rounded-2xl overflow-hidden border border-gold-500/10 hover:border-gold-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/5">
                {/* Color Preview */}
                <div className="h-32 flex">
                  {skin.palette.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${TIER_COLORS[skin.tier]} text-white text-xs px-2 py-0.5 rounded-full`}>
                      {TIER_LABELS[skin.tier]}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl text-cream-100 group-hover:text-gold-400 transition-colors">
                    {skin.name}
                  </h3>
                  
                  <p className="text-cream-500 text-sm mt-2 mb-4">
                    {skin.description}
                  </p>

                  <div className="text-xs text-cream-600">
                    <span className="text-cream-400">Fonts:</span> {skin.fonts}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Instrucciones */}
        <div className="mt-16 p-8 bg-charcoal-900/50 rounded-2xl border border-gold-500/10">
          <h2 className="font-heading text-2xl text-gold-400 mb-4">
            Cómo Probar un Skin
          </h2>
          <ol className="space-y-3 text-cream-400">
            <li className="flex gap-3">
              <span className="text-gold-500 font-bold">1.</span>
              <span>Haz clic en cualquier skin de arriba para ver el preview completo</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold-500 font-bold">2.</span>
              <span>O edita <code className="bg-charcoal-800 px-2 py-0.5 rounded text-sm">src/data/mock-invitation.json</code> y cambia el campo <code className="bg-charcoal-800 px-2 py-0.5 rounded text-sm">skin_id</code></span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold-500 font-bold">3.</span>
              <span>Visita <code className="bg-charcoal-800 px-2 py-0.5 rounded text-sm">/demo</code> para ver el resultado</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
