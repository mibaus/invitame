'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PhotoGalleryProps {
  images: string[];
  className?: string;
  styles?: {
    gridClassName?: string;
    imageClassName?: string;
  };
}

export function PhotoGallery({
  images,
  className = '',
  styles = {},
}: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const limit = 15;
  const displayImages = images.slice(0, limit);

  if (!displayImages || displayImages.length === 0) {
    return null;
  }

  // Masonry layout - diferentes tamaños para crear efecto visual
  const getImageSize = (index: number) => {
    const patterns = [
      'col-span-1 row-span-1', // normal
      'col-span-1 row-span-2', // vertical
      'col-span-2 row-span-1', // horizontal
      'col-span-2 row-span-2', // grande
    ];
    return patterns[index % patterns.length];
  };

  const getAspectRatio = (index: number) => {
    const patterns = ['aspect-square', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-square'];
    return patterns[index % patterns.length];
  };

  return (
    <div className={`photo-gallery ${className}`}>
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] ${styles.gridClassName || ''}`}>
        {displayImages.map((src, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={() => setSelectedImage(src)}
            className={`relative overflow-hidden rounded-xl group cursor-pointer ${getImageSize(index)} ${getAspectRatio(index)} ${styles.imageClassName || ''}`}
          >
            <Image
              src={src}
              alt={`Foto ${index + 1}`}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-5xl hover:text-gray-300 transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-5xl max-h-[90vh] w-full aspect-[4/3]"
          >
            <Image
              src={selectedImage}
              alt="Foto ampliada"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
