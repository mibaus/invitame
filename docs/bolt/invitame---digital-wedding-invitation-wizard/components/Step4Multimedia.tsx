
import React from 'react';
import { StepProps } from '../types';
import ImageUploader from './ImageUploader';

const Step4Multimedia: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const showAnything = formData.showHero || formData.showGallery || formData.showMusic;

  if (!showAnything) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center fade-in">
        <p className="text-[#2C3333]/40 text-sm font-serif italic">Has desactivado todas las funciones multimedia. Puedes continuar.</p>
      </div>
    );
  }

  const handleGalleryChange = (newImages: string[]) => {
    updateFormData({ galleryImages: newImages });
  };

  const addGalleryImage = (url: string) => {
    const current = formData.galleryImages || [];
    if (current.length >= 15) return;
    handleGalleryChange([...current, url]);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 fade-in">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2C3333] mb-3">Multimedia</h2>
        <p className="text-[#2C3333]/60 text-sm">Imágenes y atmósfera de tu invitación.</p>
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
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#A27B5C] mb-4">Galería (Máx 15)</label>
              <div className="grid grid-cols-4 gap-2">
                {formData.galleryImages?.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-100">
                    <img src={img} className="w-full h-full object-cover" />
                  </div>
                ))}
                {(formData.galleryImages?.length || 0) < 15 && (
                  <button 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => {
                        const file = e.target.files[0];
                        if (file) {
                          const r = new FileReader();
                          r.onload = () => addGalleryImage(r.result as string);
                          r.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 hover:border-[#A27B5C] hover:text-[#A27B5C] transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {formData.showMusic && (
          <div className="space-y-6 fade-in">
            <section className="p-8 bg-[#2C3333] text-white rounded-3xl">
              <h3 className="font-serif text-2xl italic mb-6">Música de Fondo</h3>
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="Link MP3 Directo"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm"
                  value={formData.musicTrackUrl || ''}
                  onChange={(e) => updateFormData({ musicTrackUrl: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Playlist de Spotify"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm"
                  value={formData.spotifyPlaylistUrl || ''}
                  onChange={(e) => updateFormData({ spotifyPlaylistUrl: e.target.value })}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4Multimedia;
