'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ServiceTier } from '@/types';
import { getGalleryLimit } from '@/lib/tier-features';

interface PhotoGalleryProps {
  tier: ServiceTier;
  images: string[];
  className?: string;
  styles?: {
    gridClassName?: string;
    imageClassName?: string;
  };
}

/**
 * PhotoGallery - Galería de fotos con límite por tier
 * 
 * Essential: 1 foto
 * Pro: 2 fotos
 * Premium: 15 fotos
 */
export function PhotoGallery({
  tier,
  images,
  className = '',
  styles = {},
}: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const limit = getGalleryLimit(tier);
  const displayImages = images.slice(0, limit);

  if (!displayImages || displayImages.length === 0) {
    return null;
  }

  // Grid layout basado en cantidad de imágenes
  const getGridClass = () => {
    const count = displayImages.length;
    if (count === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2 md:grid-cols-2';
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  return (
    <div className={`photo-gallery ${className}`}>
      <div className={`grid gap-4 ${getGridClass()} ${styles.gridClassName || ''}`}>
        {displayImages.map((src, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(src)}
            className={`relative aspect-square overflow-hidden rounded-lg group cursor-pointer ${styles.imageClassName || ''}`}
          >
            <Image
              src={src}
              alt={`Foto ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="Foto ampliada"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Indicador de fotos limitadas */}
      {images.length > limit && (
        <p className="text-center text-sm opacity-50 mt-4">
          Mostrando {limit} de {images.length} fotos
          {tier !== 'premium' && (
            <span className="block text-xs mt-1">
              Actualiza a {tier === 'essential' ? 'Pro o Premium' : 'Premium'} para ver más
            </span>
          )}
        </p>
      )}
    </div>
  );
}
