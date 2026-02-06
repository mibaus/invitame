
import React from 'react';
import OnboardingWizard from './components/OnboardingWizard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative">
      <header className="mb-12 text-center fade-in">
        <h1 className="font-serif text-5xl md:text-7xl text-[#2C3333] mb-2 tracking-tight">
          Invitame<span className="italic text-[#A27B5C]">.</span>
        </h1>
        <p className="text-xs md:text-sm uppercase tracking-premium text-[#A27B5C] font-medium">
          Onboarding Premium Experience
        </p>
      </header>
      
      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-black/5 overflow-hidden fade-in border border-black/5 z-10">
        <OnboardingWizard />
      </main>
      
      <footer className="mt-12 text-center text-xs text-[#2C3333]/40 tracking-wider">
        &copy; {new Date().getFullYear()} INVITAME. LUXURY TECH-ELEGANCE.
      </footer>

      {/* Luxury WhatsApp Support Button */}
      <a 
        href="https://wa.me/yournumber" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#2C3333] text-white px-5 py-3 rounded-full shadow-2xl hover:bg-[#A27B5C] transition-all duration-500 group"
      >
        <span className="hidden md:block text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          ¿Dudas? Consultanos
        </span>
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.237 3.483 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.652zm5.358-4.72l.341.202c1.45.859 3.102 1.313 4.793 1.314l.001.001c5.441 0 9.869-4.429 9.872-9.87.001-2.636-1.025-5.114-2.89-6.98s-4.342-2.893-6.979-2.893c-5.441 0-9.868 4.43-9.872 9.87-.001 1.83.504 3.616 1.46 5.181l.221.36-1.12 4.09 4.172-1.095z" />
        </svg>
      </a>
    </div>
  );
};

export default App;
