'use client';

import React, { useState, useCallback } from 'react';
import { StepIndicator } from './components/StepIndicator';
import { Step1Personal } from './components/Step1Personal';
import { Step2Wedding } from './components/Step2Wedding';
import { Step3Logistics } from './components/Step3Logistics';
import { Step4Multimedia } from './components/Step4Multimedia';
import { Step5Config } from './components/Step5Config';
import { LivePreview } from './components/LivePreview';
import { OnboardingData } from './types';
import { submitOnboarding } from '@/app/actions/onboarding';

const INITIAL_DATA: Partial<OnboardingData> = {
  skinId: 'classic-standard',
  slug: '',
  isSlugValid: false,
  eventType: 'wedding',
  showHero: true,
  showCountdown: true,
  showAgenda: true,
  showVenueMap: true,
  showDressCode: true,
  showGiftRegistry: true,
  showRSVP: true,
  showGallery: true,
  showMusic: true,
  showGuestMessages: false,
  rsvpEnabled: true,
  maxCompanions: 2,
  allowChildren: false,
  agendaItems: [
    { id: '1', time: '18:00', title: 'Ceremonia', icon: 'church' },
    { id: '2', time: '19:00', title: 'Cóctel', icon: 'wine' },
    { id: '3', time: '20:00', title: 'Cena', icon: 'utensils' },
    { id: '4', time: '22:00', title: 'Fiesta', icon: 'music' },
  ]
};

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<{ temporarySlug?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const updateFormData = useCallback((newData: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await submitOnboarding(formData as OnboardingData);
      
      if (response.success) {
        setResult({ temporarySlug: response.temporarySlug });
        setIsSuccess(true);
      } else {
        setError(response.error || 'Error al crear la invitación');
      }
    } catch (err) {
      setError('Error inesperado al crear la invitación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = !!(formData.clientName && formData.clientEmail && /^\S+@\S+\.\S+$/.test(formData.clientEmail));
  const isStep2Valid = !!(
    formData.headline && 
    formData.eventDate && 
    formData.eventTime && 
    formData.person1Name && 
    formData.person2Name && 
    formData.mainMessage &&
    formData.slug &&
    formData.isSlugValid
  );

  const isNextDisabled = () => {
    if (currentStep === 1) return !isStep1Valid;
    if (currentStep === 2) return !isStep2Valid;
    return false;
  };

  if (isSuccess) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px] fade-in">
        <div className="w-20 h-20 bg-[#E7D2CC] rounded-full flex items-center justify-center mb-6 text-[#A27B5C]">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-4xl text-[#2C3333] mb-4">¡Todo listo para brillar!</h2>
        <p className="text-[#2C3333]/70 mb-8 max-w-md">
          Tu invitación digital se está generando con el toque de elegancia que merece tu evento. 
          Recibirás un link temporal en tu correo en unos instantes.
        </p>
        <div className="p-4 bg-gray-50 rounded-xl mb-8 border border-gray-100">
          <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Tu URL Exclusiva</p>
          <code className="text-[#A27B5C] font-mono text-lg tracking-tighter">invitame.com/{formData.slug}</code>
        </div>
        {result?.temporarySlug && (
          <p className="text-sm text-gray-500 mb-6">
            Referencia: <code className="bg-gray-100 px-2 py-1 rounded">{result.temporarySlug}</code>
          </p>
        )}
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#2C3333] text-white px-10 py-4 rounded-xl font-bold tracking-premium text-xs uppercase hover:bg-[#A27B5C] transition-all duration-500"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="bg-[#2C3333] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showPreview ? "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showPreview ? "" : "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
          </svg>
          {showPreview ? 'Editar' : 'Vista Previa'}
        </button>
      </div>

      {/* Left Panel - Form */}
      <div className={`flex-1 flex flex-col ${showPreview ? 'hidden lg:flex' : 'flex'}`}>
        <StepIndicator currentStep={currentStep} />
        
        <div className="p-8 flex-grow overflow-y-auto">
          {currentStep === 1 && <Step1Personal formData={formData} updateFormData={updateFormData} />}
          {currentStep === 2 && <Step2Wedding formData={formData} updateFormData={updateFormData} />}
          {currentStep === 3 && <Step3Logistics formData={formData} updateFormData={updateFormData} />}
          {currentStep === 4 && <Step4Multimedia formData={formData} updateFormData={updateFormData} />}
          {currentStep === 5 && <Step5Config formData={formData} updateFormData={updateFormData} />}
        </div>

        {error && (
          <div className="px-8 pb-4">
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          </div>
        )}

        <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className={`px-8 py-3 rounded-xl font-bold tracking-premium text-[10px] uppercase transition-all ${
              currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-[#2C3333] hover:text-[#A27B5C]'
            }`}
          >
            Anterior
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="bg-[#2C3333] disabled:bg-gray-200 text-white px-10 py-4 rounded-xl font-bold tracking-premium text-[10px] uppercase hover:bg-[#A27B5C] transition-all duration-500 shadow-xl shadow-black/10 flex items-center gap-3"
            >
              Siguiente
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#A27B5C] text-white px-12 py-4 rounded-xl font-bold tracking-premium text-[10px] uppercase hover:bg-[#2C3333] transition-all duration-500 shadow-xl shadow-bronze-500/20 flex items-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Finalizar'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Right Panel - Live Preview (Desktop always visible, Mobile toggle) */}
      <div className={`lg:w-[460px] xl:w-[540px] bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-200 flex flex-col ${showPreview ? 'flex' : 'hidden lg:flex'}`}>
        <div className="p-4 border-b border-gray-200 bg-white/50">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-center">
            Vista Previa en Tiempo Real
          </h3>
        </div>
        <div className="flex-1 py-4 lg:py-6 overflow-y-auto flex items-start lg:items-center justify-center min-h-0 px-0">
          <LivePreview formData={formData} />
        </div>
      </div>
    </div>
  );
}
