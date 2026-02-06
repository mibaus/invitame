
import React, { useState } from 'react';
import { StepProps } from '../types';

const Step2Wedding: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

  const toggles = [
    { 
      key: 'showAgenda', 
      label: 'Cronograma', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      key: 'showVenueMap', 
      label: 'Ubicaciones', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      key: 'showGiftRegistry', 
      label: 'Regalos', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      key: 'showGallery', 
      label: 'Galería', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      key: 'showMusic', 
      label: 'Música', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
  ];

  const handleToggle = (key: string) => {
    updateFormData({ [key]: !((formData as any)[key]) });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitizar: solo minúsculas, números y guiones
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    updateFormData({ slug: value, isSlugValid: false });
    setSlugError(null);
  };

  const validateSlug = async () => {
    const slug = formData.slug;
    if (!slug || slug.length < 3) {
      setSlugError('Mínimo 3 caracteres');
      updateFormData({ isSlugValid: false });
      return;
    }

    setCheckingSlug(true);
    setSlugError(null);

    // Simulación de validación en base de datos
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Simular que 'boda-real' ya está tomado
    if (slug === 'boda-real' || slug === 'test') {
      setSlugError('Esta URL ya está en uso');
      updateFormData({ isSlugValid: false });
    } else {
      updateFormData({ isSlugValid: true });
    }
    setCheckingSlug(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2C3333] mb-3">Diseña la Experiencia</h2>
        <p className="text-[#2C3333]/60 text-sm italic">Define el estilo y el enlace exclusivo de tu boda.</p>
      </div>

      {/* URL PERSONALIZADA SECTION */}
      <section className="mb-10 p-6 bg-[#F8F9FA] rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="md:w-1/3">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A27B5C] mb-1">Enlace de tu Invitación</h3>
          <p className="text-[10px] text-gray-400 italic">Será la dirección web que compartirás.</p>
        </div>
        <div className="md:w-2/3 w-full relative">
          <div className="flex items-center bg-white border border-gray-100 rounded-2xl overflow-hidden focus-within:border-[#A27B5C] focus-within:ring-1 focus-within:ring-[#A27B5C] transition-all duration-300">
            <span className="pl-4 pr-1 py-4 text-[#2C3333]/30 font-medium text-sm">invitame.com/</span>
            <input
              type="text"
              placeholder="tu-boda-aqui"
              className="flex-grow py-4 pr-10 text-sm font-semibold outline-none bg-transparent"
              value={formData.slug || ''}
              onChange={handleSlugChange}
              onBlur={validateSlug}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {checkingSlug ? (
                <svg className="animate-spin h-4 w-4 text-[#A27B5C]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : formData.isSlugValid ? (
                <svg className="h-5 w-5 text-green-500 fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : slugError ? (
                <svg className="h-5 w-5 text-red-400 fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : null}
            </div>
          </div>
          {slugError && <p className="absolute -bottom-5 left-4 text-[9px] font-bold text-red-400 uppercase tracking-widest fade-in">{slugError}</p>}
          {formData.isSlugValid && <p className="absolute -bottom-5 left-4 text-[9px] font-bold text-green-600 uppercase tracking-widest fade-in">¡Disponible!</p>}
        </div>
      </section>

      {/* FEATURE SELECTOR */}
      <section className="mb-14">
        <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#A27B5C] mb-6 text-center">Configuración de Secciones</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {toggles.map((t) => (
            <button
              key={t.key}
              onClick={() => handleToggle(t.key)}
              className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all duration-500 group ${
                (formData as any)[t.key] 
                ? 'bg-[#2C3333] border-[#A27B5C] text-white shadow-2xl shadow-black/10' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-[#E7D2CC] hover:bg-[#F8F9FA]'
              }`}
            >
              <div className={`mb-3 transition-colors duration-500 ${
                (formData as any)[t.key] ? 'text-[#A27B5C]' : 'text-gray-300 group-hover:text-[#E7D2CC]'
              }`}>
                {t.icon}
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-[0.2em] text-center leading-tight ${
                (formData as any)[t.key] ? 'text-white' : 'text-gray-400'
              }`}>
                {t.label}
              </span>
              <div className={`mt-3 w-1 h-1 rounded-full transition-all duration-500 ${
                (formData as any)[t.key] ? 'bg-[#A27B5C] scale-150' : 'bg-transparent'
              }`}></div>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#A27B5C] border-b border-gray-100 pb-2 mb-4">Información Base</h3>
          
          <div>
            <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Título de la Invitación</label>
            <input
              type="text"
              required
              placeholder="Ej: Nuestra Boda"
              className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:bg-white transition-all text-sm"
              value={formData.headline || ''}
              onChange={(e) => updateFormData({ headline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Fecha del Evento</label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:bg-white transition-all text-sm"
                value={formData.eventDate || ''}
                onChange={(e) => updateFormData({ eventDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Hora de Inicio</label>
              <input
                type="time"
                required
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:bg-white transition-all text-sm"
                value={formData.eventTime || ''}
                onChange={(e) => updateFormData({ eventTime: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Nombre Pareja 1</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:bg-white transition-all text-sm"
                value={formData.person1Name || ''}
                onChange={(e) => updateFormData({ person1Name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Nombre Pareja 2</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:bg-white transition-all text-sm"
                value={formData.person2Name || ''}
                onChange={(e) => updateFormData({ person2Name: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#A27B5C] border-b border-gray-100 pb-2 mb-4">Detalles Editoriales</h3>
          
          <div>
            <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Mensaje de Bienvenida</label>
            <textarea
              required
              rows={4}
              placeholder="Escribe algo inspirador..."
              className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:bg-white transition-all resize-none text-sm leading-relaxed"
              value={formData.mainMessage || ''}
              onChange={(e) => updateFormData({ mainMessage: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Código de Vestimenta</label>
            <select
              className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:bg-white transition-all text-sm mb-3"
              value={formData.dressCode || ''}
              onChange={(e) => updateFormData({ dressCode: e.target.value })}
            >
              <option value="">Sin especificar</option>
              <option value="formal">Formal</option>
              <option value="semi-formal">Semi-formal</option>
              <option value="casual">Casual</option>
              <option value="themed">Temático</option>
            </select>
            {formData.dressCode && (
              <input
                type="text"
                placeholder="Ej: Elegante Sport, tonos tierra..."
                className="w-full px-4 py-2 bg-transparent border-b border-gray-100 focus:border-[#A27B5C] transition-all text-[11px] italic text-gray-500 outline-none"
                value={formData.dressCodeDescription || ''}
                onChange={(e) => updateFormData({ dressCodeDescription: e.target.value })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Wedding;
