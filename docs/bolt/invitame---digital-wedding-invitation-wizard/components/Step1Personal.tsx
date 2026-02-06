
import React, { useState } from 'react';
import { StepProps } from '../types';

const Step1Personal: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const designs = [
    { 
      id: 'silk-white', 
      name: 'Minimalist Silk', 
      bg: 'bg-white',
      accent: '#A27B5C',
      textColor: '#2C3333',
      description: 'Limpio, moderno y sofisticado. Ideal para bodas urbanas.'
    },
    { 
      id: 'royal-gold', 
      name: 'Royal Gold', 
      bg: 'bg-[#F9F6F0]',
      accent: '#A27B5C',
      textColor: '#2C3333',
      description: 'Cálido y atemporal con detalles en oro viejo.'
    },
    { 
      id: 'charcoal-dark', 
      name: 'Modern Charcoal', 
      bg: 'bg-[#2C3333]',
      accent: '#E7D2CC',
      textColor: '#FFFFFF',
      description: 'Drama y elegancia para eventos nocturnos de gala.'
    },
    { 
      id: 'floral-soft', 
      name: 'Floral Bloom', 
      bg: 'bg-[#FDF2F0]',
      accent: '#D4A373',
      textColor: '#4A4A4A',
      description: 'Romántico y etéreo, perfecto para bodas al aire libre.'
    }
  ];

  const currentSkin = designs.find(d => d.id === (activeDemo || formData.skinId));

  return (
    <div className="max-w-4xl mx-auto py-4 fade-in">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2C3333] mb-3">Comencemos tu Historia</h2>
        <p className="text-[#2C3333]/60 text-sm leading-relaxed max-w-lg mx-auto">
          Elige la esencia visual de tu invitación. Puedes previsualizar cada estilo antes de elegirlo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* DESIGN SELECTOR */}
        <div className="lg:col-span-7 space-y-6">
          <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#A27B5C] mb-6">Selecciona el Estilo Visual</label>
          <div className="grid grid-cols-2 gap-4">
            {designs.map((design) => (
              <div 
                key={design.id}
                className={`relative p-1 rounded-[2.2rem] border-2 transition-all duration-500 overflow-hidden group ${
                  formData.skinId === design.id 
                  ? 'border-[#A27B5C] bg-white shadow-2xl shadow-black/5' 
                  : 'border-transparent'
                }`}
              >
                <div 
                  onClick={() => updateFormData({ skinId: design.id })}
                  className={`aspect-[4/5] cursor-pointer rounded-[2rem] ${design.bg} flex flex-col items-center justify-center relative overflow-hidden border border-black/5 transition-transform duration-500 group-hover:scale-[0.98]`}
                >
                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <div className="absolute top-4 left-4 w-12 h-12 border border-current rounded-full"></div>
                     <div className="absolute bottom-10 right-4 w-20 h-20 border border-current rotate-45"></div>
                  </div>
                  
                  <span className={`font-serif italic text-3xl mb-2 ${design.id === 'charcoal-dark' ? 'text-white' : 'text-[#2C3333]'}`}>
                    Aa
                  </span>
                  <div className={`w-8 h-[1px] ${design.id === 'charcoal-dark' ? 'bg-white/20' : 'bg-black/10'}`}></div>

                  {formData.skinId === design.id && (
                    <div className="absolute top-4 right-4 bg-[#A27B5C] text-white p-1 rounded-full shadow-lg z-10">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {/* Demo Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDemo(design.id);
                    }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-[#2C3333] px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-[#2C3333] hover:text-white"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Demo
                  </button>
                </div>
                <div className="mt-4 pb-2 text-center">
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${formData.skinId === design.id ? 'text-[#A27B5C]' : 'text-gray-400'}`}>
                    {design.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PERSONAL DATA */}
        <div className="lg:col-span-5 space-y-8 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
          <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#A27B5C] mb-2">Tus Datos</label>
          <div className="space-y-6">
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2">Nombre Completo *</label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl transition-all focus:shadow-xl focus:shadow-black/5 text-sm"
                value={formData.clientName || ''}
                onChange={(e) => updateFormData({ clientName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2">Correo Electrónico *</label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl transition-all focus:shadow-xl focus:shadow-black/5 text-sm"
                value={formData.clientEmail || ''}
                onChange={(e) => updateFormData({ clientEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2">WhatsApp</label>
              <input
                type="tel"
                className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl transition-all focus:shadow-xl focus:shadow-black/5 text-sm"
                value={formData.clientPhone || ''}
                onChange={(e) => updateFormData({ clientPhone: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* DEMO MODAL */}
      {activeDemo && currentSkin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2C3333]/90 backdrop-blur-md fade-in">
          <button 
            onClick={() => setActiveDemo(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl w-full">
            {/* Info Section */}
            <div className="md:w-1/2 text-white space-y-6 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#A27B5C]">Diseño Seleccionado</span>
              <h3 className="font-serif text-5xl">{currentSkin.name}</h3>
              <p className="text-white/60 text-lg italic font-light">{currentSkin.description}</p>
              <div className="pt-8 flex flex-col items-center md:items-start gap-4">
                <button 
                  onClick={() => {
                    updateFormData({ skinId: currentSkin.id });
                    setActiveDemo(null);
                  }}
                  className="bg-[#A27B5C] text-white px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#2C3333] transition-all duration-500"
                >
                  Elegir este Diseño
                </button>
                <p className="text-white/30 text-[9px] uppercase tracking-widest">* Previsualización simulada</p>
              </div>
            </div>

            {/* Mobile Phone Frame */}
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-[8px] border-black shadow-2xl overflow-hidden ring-4 ring-white/10 ring-inset">
                {/* Speaker/Camera detail */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
                
                {/* Content Area */}
                <div className={`w-full h-full ${currentSkin.bg} p-8 pt-16 flex flex-col items-center text-center overflow-y-auto custom-scrollbar relative`}>
                  {/* Decorative corner */}
                  <div className="absolute top-10 left-0 w-20 h-20 border-l border-t opacity-20" style={{ borderColor: currentSkin.accent }}></div>
                  <div className="absolute bottom-10 right-0 w-20 h-20 border-r border-b opacity-20" style={{ borderColor: currentSkin.accent }}></div>

                  <span className="text-[8px] uppercase tracking-[0.4em] mb-4 opacity-60" style={{ color: currentSkin.textColor }}>¡Nos Casamos!</span>
                  
                  <h4 className="font-serif text-4xl mb-6" style={{ color: currentSkin.textColor }}>
                    {formData.person1Name || 'Novia'} <br/> 
                    <span className="italic text-2xl font-light opacity-50">&</span> <br/>
                    {formData.person2Name || 'Novio'}
                  </h4>

                  <div className="w-10 h-[1px] mb-8" style={{ backgroundColor: currentSkin.accent }}></div>

                  <p className="text-[10px] leading-relaxed italic opacity-70 mb-10" style={{ color: currentSkin.textColor }}>
                    "Encontré a quien mi alma ama." <br/>
                    <span className="not-italic font-bold tracking-widest block mt-2 text-[8px]">— CANTAR DE LOS CANTARES</span>
                  </p>

                  <div className="grid grid-cols-3 gap-4 w-full mb-10">
                    {[
                      { l: 'Días', v: '124' },
                      { l: 'Horas', v: '08' },
                      { l: 'Min', v: '45' }
                    ].map((t, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-xl font-serif" style={{ color: currentSkin.textColor }}>{t.v}</span>
                        <span className="text-[7px] uppercase tracking-widest opacity-40" style={{ color: currentSkin.textColor }}>{t.l}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    disabled
                    className="w-full py-4 rounded-full text-[8px] uppercase tracking-[0.3em] font-bold transition-all"
                    style={{ backgroundColor: currentSkin.accent, color: '#FFF' }}
                  >
                    Confirmar Asistencia
                  </button>

                  <div className="mt-12 opacity-20">
                    <svg className="w-12 h-12" style={{ color: currentSkin.textColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1Personal;
