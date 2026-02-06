
import React from 'react';
import { PieChart, Download, BellRing, ShieldCheck } from 'lucide-react';

const Features: React.FC = () => {
  const items = [
    {
      icon: <PieChart className="w-4 h-4" />,
      title: "Dashboard en vivo",
      text: "Controlá confirmaciones y restricciones en tiempo real."
    },
    {
      icon: <Download className="w-4 h-4" />,
      title: "Listas inteligentes",
      text: "Exportá archivos listos para tu salón o Wedding Planner."
    },
    {
      icon: <BellRing className="w-4 h-4" />,
      title: "Notificaciones",
      text: "Alertas sutiles cada vez que un invitado confirma."
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      title: "Privacidad",
      text: "Seguridad total y eliminación de datos post-evento."
    }
  ];

  return (
    <section id="beneficios" className="py-32 px-6 md:px-12 bg-cloud">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Visual: Gallery Frame Style */}
          <div className="lg:col-span-7 reveal">
            <div className="bg-charcoal/[0.02] p-6 md:p-12 rounded-[2.5rem] border border-charcoal/5 group transition-all duration-700 hover:bg-white hover:shadow-2xl">
              <div className="relative rounded-xl overflow-hidden shadow-sm border border-charcoal/5">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" 
                  alt="Invitame Dashboard Interface" 
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Content: Minimalist Specs */}
          <div className="lg:col-span-5 space-y-12 reveal">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-bronze/40"></div>
                <p className="text-[9px] uppercase tracking-[0.6em] text-bronze font-bold">La Tecnología</p>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-charcoal leading-[1.1]">
                Gestión <span className="italic">silenciosa,</span> <br/>
                resultados visibles.
              </h2>
              <p className="text-sm text-charcoal/50 max-w-sm leading-relaxed font-light">
                Herramientas de nivel profesional diseñadas para ser invisibles hasta que las necesitás.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {items.map((item, i) => (
                <div key={i} className="group flex gap-6 items-start">
                  <div className="mt-1 w-2 h-2 rounded-full bg-bronze/20 group-hover:bg-bronze transition-all duration-500 relative">
                    <div className="absolute inset-0 rounded-full bg-bronze animate-ping opacity-0 group-hover:opacity-20"></div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] font-bold text-charcoal uppercase tracking-widest flex items-center gap-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-charcoal/40 font-light leading-relaxed max-w-xs">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
