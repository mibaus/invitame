import Link from 'next/link';
import type { SkinId } from '@/types';

interface SkinInfo {
  id: SkinId;
  name: string;
  description: string;
  previewImage: string;
}

const SKINS: SkinInfo[] = [
  {
    id: 'bolt-dark',
    name: 'Bolt Dark',
    description: 'Elegancia moderna en tonos oscuros con acentos ámbar.',
    previewImage: '/images/skins/bolt-dark-preview.jpg',
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Galería de Diseños
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Explora nuestra colección exclusiva de invitaciones digitales.
            Cada diseño incluye todas las funcionalidades premium.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {SKINS.map((skin) => (
            <div key={skin.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
              {/* Preview Area */}
              <div className="aspect-[9/16] bg-gray-200 w-full relative overflow-hidden group-hover:opacity-95 transition-opacity">
                {/* Placeholder for image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="text-sm">Preview: {skin.name}</span>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    <Link href={`/preview/${skin.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {skin.name}
                    </Link>
                  </h3>
                </div>

                <p className="text-sm text-gray-500 mb-4 flex-1">
                  {skin.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Todo Incluido
                  </span>
                  <span className="text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Ver Demo &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
