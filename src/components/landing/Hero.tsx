'use client';

import React from 'react';
import { ChevronDown, Download, CheckCircle2, LayoutDashboard, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center pt-28 pb-12 px-6 md:px-12 lg:pt-32 lg:pb-32 overflow-hidden bg-cloud">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-rose/10 rounded-full blur-[140px] opacity-60"></div>
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-bronze/5 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        <div className="animate-in-up space-y-7 text-center lg:text-left order-1">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/50 backdrop-blur-sm text-bronze text-[9px] uppercase tracking-[0.5em] font-bold rounded-full mb-2 border border-bronze/10 shadow-sm">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bronze opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-bronze"></span>
              </span>
              Inteligencia para tu boda
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif leading-[1.1] text-charcoal">
              La paz mental <br />
              <span className="italic font-light text-bronze">de tener todo resuelto.</span>
            </h1>
            <p className="text-sm md:text-lg text-charcoal/60 max-w-md mx-auto lg:mx-0 leading-relaxed font-light">
              Una <span className="font-medium text-charcoal/80">invitación web</span> de diseño exclusivo que gestiona a tus invitados de forma inteligente. El equilibrio perfecto entre estética de alta gama y el control absoluto de tu evento.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
            <a 
              href="/onboarding" 
              className="px-9 py-4 bg-charcoal text-cloud text-center text-[10px] uppercase tracking-widest font-bold hover:bg-bronze hover:shadow-[0_15px_30px_rgba(162,123,92,0.15)] transition-all duration-500"
            >
              Comenzar Ahora
            </a>
            <button className="px-9 py-4 border border-charcoal/10 text-charcoal/80 text-[10px] uppercase tracking-widest font-bold hover:bg-white/50 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bronze opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-bronze"></span>
              </span>
              Demo Dashboard
            </button>
          </div>
        </div>

        {/* VISUAL CONTENT */}
        <div className="relative order-2 flex justify-center lg:justify-end mt-12 lg:mt-0 animate-in-up-delayed">
          <div className="relative w-[240px] sm:w-[280px] md:w-[320px]">
            
            {/* BADGE 1 */}
            <div className="absolute -left-12 sm:-left-16 top-10 z-40 bg-white/70 backdrop-blur-xl p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/50 flex items-center gap-3 w-40 sm:w-52 animate-float">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/10 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[7px] sm:text-[8px] uppercase tracking-widest text-charcoal/40 font-black">Confirmación</p>
                <p className="text-[10px] sm:text-[12px] font-bold text-charcoal">Familia Zuber +3</p>
              </div>
            </div>

            {/* BADGE 2 */}
            <div className="absolute -right-8 sm:-right-12 bottom-16 z-40 bg-charcoal/90 backdrop-blur-xl p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center gap-3 w-36 sm:w-48 animate-float-delayed">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-bronze rounded-full flex items-center justify-center">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-cloud" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[7px] sm:text-[8px] uppercase tracking-widest text-white/40 font-black">Planificación</p>
                <p className="text-[10px] sm:text-[12px] font-bold text-cloud">Lista Exportada</p>
              </div>
            </div>

            <div className="relative z-10 p-2.5 bg-charcoal rounded-[2.8rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.25)] border-[5px] border-[#1e2323]">
              <div className="overflow-hidden rounded-[2rem] bg-charcoal/20 aspect-[9/19] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop" 
                  alt="Invitación de Boda Premium" 
                  className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-1000 opacity-0 animate-fade-in"
                  onLoad={(e) => (e.currentTarget as HTMLImageElement).classList.remove('opacity-0')}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    <div className="flex justify-between items-end mb-1">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3 h-3 text-bronze" />
                            <p className="text-[8px] uppercase tracking-widest text-white/70 font-bold">Invitados</p>
                        </div>
                        <p className="text-[10px] text-white font-serif italic">142 / 180</p>
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-bronze h-full w-[78%] transition-all duration-1000"></div>
                    </div>
                  </div>
                  
                  <div className="text-center pb-2">
                     <h3 className="font-serif text-lg text-white mb-0.5 tracking-wide">Sofía & Marcos</h3>
                     <p className="text-[8px] uppercase tracking-[0.3em] text-white/40 font-light">Modelo Ethereal Skin</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_5s_infinite] pointer-events-none"></div>
              </div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1e2323] rounded-b-xl z-20 flex items-center justify-center">
                <div className="w-6 h-0.5 bg-white/5 rounded-full"></div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-bronze/5 rounded-full blur-[100px] -z-10"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 opacity-30 hover:opacity-100 transition-all cursor-pointer group">
        <span className="text-[8px] uppercase tracking-[0.5em] font-bold text-charcoal group-hover:text-bronze">Explorar Invitame</span>
        <div className="h-10 w-[1px] bg-gradient-to-b from-charcoal to-transparent relative">
           <div className="absolute top-0 left-0 w-full h-1/2 bg-bronze animate-scroll-down"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(25deg); }
          50% { transform: translateX(100%) rotate(25deg); }
          100% { transform: translateX(100%) rotate(25deg); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-in-up { 
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        .animate-in-up-delayed { 
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
        .animate-scroll-down { animation: scroll-down 2s infinite; }
      `}</style>
    </section>
  );
}
