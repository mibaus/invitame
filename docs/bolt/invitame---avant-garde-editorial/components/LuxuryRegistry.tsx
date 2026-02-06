
import React from 'react';
import { motion } from 'framer-motion';

const LuxuryRegistry: React.FC = () => {
  const [copied, setCopied] = React.useState(false);
  const cbu = "0000003100098765432101";

  const handleCopy = () => {
    navigator.clipboard.writeText(cbu);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto border-[1px] border-black/10 p-8 md:p-16 relative overflow-hidden text-black">
        {/* Marca de agua de factura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/[0.02] text-[20vw] font-mono-tech -rotate-12 pointer-events-none select-none uppercase">
          RECIBO ORIGINAL
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif-bold tracking-tighter mb-4 uppercase">LISTA DE REGALOS</h2>
            <div className="font-mono-tech text-xs text-black/40 uppercase">INVITAME_PORTAL_REGALOS</div>
          </div>
          <div className="text-right">
            <div className="font-mono-tech text-[10px] tracking-widest text-black/60 mb-1 uppercase">FECHA DE EMISIÓN</div>
            <div className="font-mono-tech text-sm font-bold">24 / NOV / 2024</div>
          </div>
        </div>

        <div className="border-y-2 border-black py-8 mb-12">
          <p className="font-sans-body text-sm text-black/70 mb-8 leading-relaxed max-w-xl">
            Su presencia es el mejor regalo. Sin embargo, si desea contribuir a nuestra nueva aventura, hemos habilitado esta "factura de amor" para facilitar su gesto.
          </p>

          <div className="bg-neutral-50 p-6 border-l-8 border-red-600 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="font-mono-tech text-[10px] tracking-widest text-black/40 mb-1 uppercase">CBU / ALIAS</div>
              <div className="font-mono-tech text-xl font-bold tracking-tighter uppercase">{cbu}</div>
              <div className="font-mono-tech text-[10px] text-red-600 mt-1 uppercase font-bold uppercase">VALENTINA.MATEO.BODA</div>
            </div>
            <button 
              onClick={handleCopy}
              className={`
                px-8 py-4 font-mono-tech text-xs font-bold transition-all
                ${copied ? 'bg-black text-white' : 'bg-red-600 text-white hover:bg-black'}
              `}
            >
              {copied ? 'DATOS COPIADOS' : 'COPIAR DATOS'}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="w-32 h-12 bg-black flex items-center justify-center">
            <div className="w-full h-[2px] bg-white mx-2" />
            <div className="w-full h-[2px] bg-white mx-2" />
          </div>
          <div className="font-mono-tech text-[10px] text-black/20 text-right uppercase leading-tight">
            GRACIAS POR SER PARTE DE <br/> LA DIRECCIÓN CREATIVA DE NUESTRA VIDA.
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryRegistry;
