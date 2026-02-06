
import React, { useState, useCallback } from 'react';
import StepIndicator from './StepIndicator';
import Step1Personal from './Step1Personal';
import Step2Wedding from './Step2Wedding';
import Step3Logistics from './Step3Logistics';
import Step4Multimedia from './Step4Multimedia';
import Step5Config from './Step5Config';
import { OnboardingData } from '../types';

const INITIAL_DATA: Partial<OnboardingData> = {
  skinId: 'bolt-dark',
  slug: '',
  isSlugValid: false,
  showHero: true,
  showCountdown: true,
  showAgenda: true,
  showVenueMap: true,
  showDressCode: true,
  showGiftRegistry: true,
  showRSVP: true, // Mandatory
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

const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
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
    <div className="flex flex-col h-full">
      <StepIndicator currentStep={currentStep} />
      
      <div className="p-8 flex-grow">
        {currentStep === 1 && <Step1Personal formData={formData} updateFormData={updateFormData} />}
        {currentStep === 2 && <Step2Wedding formData={formData} updateFormData={updateFormData} />}
        {currentStep === 3 && <Step3Logistics formData={formData} updateFormData={updateFormData} />}
        {currentStep === 4 && <Step4Multimedia formData={formData} updateFormData={updateFormData} />}
        {currentStep === 5 && <Step5Config formData={formData} updateFormData={updateFormData} />}
      </div>

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
  );
};

export default OnboardingWizard;
