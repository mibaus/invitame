/**
 * Centralized Skin Registry
 * Single source of truth for all available invitation skins
 */

export interface SkinConfig {
  id: string;
  name: string;
  description: string;
  tagline: string;
  image: string;
  order: number;
  style: {
    bg: string;
    text: string;
    accent: string;
    font: 'serif' | 'sans' | 'script';
  };
}

export const SKINS_REGISTRY: SkinConfig[] = [
//   {
//     id: 'bolt-dark',
//     name: 'Bolt Dark',
//     description: 'Elegancia moderna en tonos oscuros. Ideal para eventos nocturnos y sofisticados.',
//     tagline: 'Elegancia moderna en tonos oscuros',
//     image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
//     order: 3,
//     style: { bg: '#000000', text: '#ffffff', accent: '#fbbf24', font: 'serif' },
//   },
  {
    id: 'avant-garde-editorial',
    name: 'Avant-Garde Editorial',
    description: 'Diseño editorial vanguardista. Para quienes buscan romper esquemas con estilo.',
    tagline: 'Diseño editorial vanguardista en blanco, negro y rojo',
    image: '/avant-hero.png',
    order: 1,
    style: { bg: '#ffffff', text: '#000000', accent: '#FF0000', font: 'serif' },
  },
//   {
//     id: 'soft-seraphic',
//     name: 'Soft Seraphic',
//     description: 'Romance celestial con tonos suaves y acentos en azul. Para bodas etéreas y románticas.',
//     tagline: 'Romance celestial con tonos suaves y acentos azules',
//     image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop',
//     order: 4,
//     style: { bg: '#fcf9f2', text: '#4a4a4a', accent: '#96adc0', font: 'script' },
//   },
  // {
  //   id: 'cyberpunk-romance',
  //   name: 'Cyberpunk Romance',
  //   description: 'Estilo futurista con toques románticos. Neón, contraste y tecnología para bodas únicas.',
  //   tagline: 'Futurismo romántico con luces de neón',
  //   image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop',
  //   order: 5,
  //   style: { bg: '#0a0a0a', text: '#00ff9d', accent: '#ff00a0', font: 'sans' },
  // },
  // {
  //   id: 'japandi-zen',
  //   name: 'Japandi Zen',
  //   description: 'Fusión de minimalismo japonés y escandinavo. Serenidad, naturaleza y equilibrio.',
  //   tagline: 'Minimalismo zen con calidez escandinava',
  //   image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=600&auto=format&fit=crop',
  //   order: 2,
  //   style: { bg: '#f5f5f0', text: '#2c3e33', accent: '#d4a373', font: 'sans' },
  // },
//   {
//     id: 'mediterranean-artisanal',
//     name: 'Mediterranean Artisanal',
//     description: 'Invitación inspirada en el verano eterno del Mediterráneo. Azulejos vibrantes, luz solar intensa y elegancia artesanal.',
//     tagline: 'Verano eterno del Mediterráneo con azulejos y luz solar',
//     image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&auto=format&fit=crop',
//     order: 6,
//     style: { bg: '#F5F5DC', text: '#0047AB', accent: '#FFD700', font: 'serif' },
//   },
  {
    id: 'the-monogram-edit',
    name: 'The Monogram Edit',
    description: 'Lujo silencioso con estética editorial Vogue. Minimalismo absoluto, tipografía de alto contraste y fotografía tratada como arte.',
    tagline: 'Elegancia editorial con lujo silencioso',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
    order: 3,
    style: { bg: '#FFFFFF', text: '#1A1A1A', accent: '#4A4A4A', font: 'serif' },
  },
  {
    id: 'botanical-greenhouse',
    name: 'Botanical Greenhouse',
    description: 'Elegancia de herbario del siglo XVIII con ilustraciones botánicas, tipografía clásica y paleta de colores orgánica.',
    tagline: 'Herbario del siglo XVIII con ilustraciones botánicas',
    image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=600&auto=format&fit=crop',
    order: 4,
    style: { bg: '#F5F0E6', text: '#3D3D3D', accent: '#4A5D23', font: 'serif' },
  },
  {
    id: 'legacy-editorial',
    name: 'Legacy Editorial',
    description: 'Romance clásico editorial con estética de libro de arte. Asimetría, contraste tipográfico y detalles gráficos sutiles en tonos bronce y dusty rose.',
    tagline: 'Romance clásico editorial con estética de libro de arte',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
    order: 5,
    style: { bg: '#F8F9FA', text: '#2C3333', accent: '#A27B5C', font: 'serif' },
  },
];

export function getAllSkins(): SkinConfig[] {
  return [...SKINS_REGISTRY].sort((a, b) => a.order - b.order);
}

export function getSkinById(id: string): SkinConfig | undefined {
  return SKINS_REGISTRY.find(skin => skin.id === id);
}

export function getSkinIds(): string[] {
  return SKINS_REGISTRY.map(skin => skin.id);
}
