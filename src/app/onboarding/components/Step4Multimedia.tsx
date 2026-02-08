'use client';

import React from 'react';
import { StepProps } from '../types';
import { ImageUploader, MultiImageUploader } from './ImageUploader';

export function Step4Multimedia({ formData, updateFormData }: StepProps) {
  const showAnything = formData.showHero || formData.showGallery;

  if (!showAnything) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center fade-in">
        <p className="text-[#2C3333]/40 text-sm font-serif italic">Has desactivado todas las funciones multimedia. Puedes continuar.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 fade-in">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2C3333] mb-3">Multimedia <span className="text-gray-400 text-lg font-normal normal-case">(opcional)</span></h2>
        <p className="text-[#2C3333]/60 text-sm">Añadí fotos a la galería. Si no tenés las fotos finales a mano, podés avanzar ahora y subirlas después.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {formData.showHero && (
            <div className="fade-in">
              <ImageUploader 
                label="Foto de Portada Principal" 
                value={formData.coverImage} 
                onChange={(url) => updateFormData({ coverImage: url })} 
              />
            </div>
          )}

          {formData.showGallery && (
            <div className="fade-in">
              <MultiImageUploader
                folder="temp"
                currentImages={formData.galleryImages || []}
                onUpload={(urls) => updateFormData({ galleryImages: urls })}
                maxImages={15}
                label="Galería (Máx 15)"
                hint="Estas fotos aparecerán en la sección de galería de tu invitación"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
