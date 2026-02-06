
import React from 'react';

const Gallery: React.FC = () => {
  const models = [
    {
      name: "Ethereal",
      image: "https://picsum.photos/seed/ethereal/600/800?grayscale",
      description: "Elegancia minimalista. Ideal para bodas de día, quintas y estilos naturales."
    },
    {
      name: "Legacy",
      image: "https://picsum.photos/seed/legacy/600/800?grayscale",
      description: "Romance atemporal. Tipografías clásicas y calidez visual para bodas tradicionales."
    },
    {
      name: "Metropolitan",
      image: "https://picsum.photos/seed/metro/600/800?grayscale",
      description: "Estilo editorial y moderno. Perfecto para bodas urbanas, hoteles y eventos nocturnos."
    }
  ];

  return (
    <section id="galeria" className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 reveal">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal">Diseños de autor para cada tipo de boda.</h2>
            <p className="text-charcoal/60 font-light">Nuestras "Skins" están diseñadas para adaptarse a la estética de tu gran día, manteniendo siempre el toque Invitame.</p>
          </div>
          <button className="text-charcoal text-sm font-bold uppercase tracking-[0.2em] border-b-2 border-bronze pb-1 hover:text-bronze transition-colors">
            Explorar todo el catálogo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <div key={index} className="reveal group cursor-pointer space-y-6">
              <div className="overflow-hidden bg-rose/10 aspect-[3/4] relative">
                <img 
                  src={model.image} 
                  alt={model.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="px-6 py-3 bg-cloud text-charcoal text-xs font-bold uppercase tracking-widest">Ver Demo en Vivo</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-charcoal">Modelo {model.name}</h3>
                <p className="text-sm text-charcoal/70 font-light leading-relaxed">{model.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
