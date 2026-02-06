
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Tus Datos' },
    { num: 2, label: 'Funciones' },
    { num: 3, label: 'Logística' },
    { num: 4, label: 'Multimedia' },
    { num: 5, label: 'RSVP' }
  ];

  return (
    <div className="px-8 pt-8 pb-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-px bg-[#A27B5C] -translate-y-1/2 transition-all duration-500 ease-in-out z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => (
          <div key={step.num} className="relative z-10 flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                currentStep >= step.num 
                ? 'bg-[#2C3333] border-[#2C3333] text-white' 
                : 'bg-white border-gray-200 text-gray-400'
              } ${currentStep === step.num ? 'ring-4 ring-[#E7D2CC]' : ''}`}
            >
              <span className="text-sm font-semibold font-serif italic">{step.num}</span>
            </div>
            <span className={`mt-2 text-[10px] uppercase tracking-widest font-bold ${
              currentStep >= step.num ? 'text-[#2C3333]' : 'text-gray-300'
            } hidden sm:block`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
