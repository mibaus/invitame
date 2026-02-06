
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "¿Cuánto tiempo demora en estar lista mi invitación?",
      a: "Nada. Gracias a nuestro sistema de generación automática, una vez que cargás tus datos y confirmás el pago, la invitación se genera al instante y recibís el link listo para enviar."
    },
    {
      q: "¿Mis invitados necesitan descargar alguna aplicación?",
      a: "No, para nada. Se abre directamente desde el navegador de cualquier celular, sea iPhone o Android. Solo necesitan conexión a internet."
    },
    {
      q: "¿Es difícil para las personas mayores?",
      a: "Diseñamos la interfaz pensando en todos. El botón de confirmación es grande, claro y sencillo. Todo el flujo es lineal para evitar confusiones."
    },
    {
      q: "¿Es seguro poner mi CBU?",
      a: "Totalmente. La invitación solo la ven quienes tengan el link compartido por vos. Además, se borra 48hs post-evento por seguridad adicional."
    },
    {
      q: "¿Qué pasa si hay cambios de último momento?",
      a: "Tenés acceso a un panel de edición rápido para que actualices cualquier dato en tiempo real sin que el link de tus invitados cambie."
    }
  ];

  return (
    <section id="faq" className="py-20 px-6 md:px-12 bg-charcoal text-cloud overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center reveal">
          <h2 className="text-4xl md:text-5xl font-serif">Despejá tus dudas y relajate.</h2>
          <p className="text-cloud/50 mt-4 italic">Tecnología a tu servicio para que disfrutes tu gran día.</p>
        </div>

        <div className="space-y-4 reveal">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border-b border-cloud/10 pb-4 transition-all duration-500 ${openIndex === i ? 'mb-8' : 'mb-0'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left group"
              >
                <span className={`text-lg transition-colors ${openIndex === i ? 'text-bronze' : 'text-cloud hover:text-rose'}`}>
                  {faq.q}
                </span>
                {openIndex === i ? <Minus className="w-5 h-5 text-bronze" /> : <Plus className="w-5 h-5 text-cloud/40" />}
              </button>
              <div className={`overflow-hidden transition-all duration-500 max-h-0 ${openIndex === i ? 'max-h-40' : ''}`}>
                <p className="text-cloud/60 text-sm leading-relaxed max-w-2xl font-light pr-8">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
