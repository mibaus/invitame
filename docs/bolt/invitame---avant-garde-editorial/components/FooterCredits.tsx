
import React from 'react';

const FooterCredits: React.FC = () => {
  return (
    <footer className="bg-white py-12 px-6 md:px-12 border-t-[1px] border-black/10 text-black">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-4xl font-serif-bold tracking-tighter mb-4 italic">VALENTINA & MATEO</h2>
          <p className="font-mono-tech text-[10px] tracking-[0.2em] text-black/40 leading-relaxed uppercase">
            ESTE EVENTO ES UNA PRODUCCIÓN PRIVADA. TODOS LOS DERECHOS RESERVADOS PARA EL COMIENZO DE NUESTRA FAMILIA. <br/>
            COPYRIGHT © 2024 BUENOS AIRES, ARGENTINA.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="font-mono-tech text-[10px] font-bold text-red-600 tracking-widest uppercase">CRÉDITOS</div>
          <div className="font-mono-tech text-[10px] text-black uppercase">DIRECTOR: MATEO G.</div>
          <div className="font-mono-tech text-[10px] text-black uppercase">DIR. CREATIVA: VALENTINA R.</div>
          <div className="font-mono-tech text-[10px] text-black uppercase">PRODUCCIÓN: INVITAME APPS</div>
        </div>

        <div className="flex flex-col items-end justify-end">
          <div className="w-12 h-12 bg-black flex items-center justify-center mb-4">
             <div className="text-white font-mono-tech text-[8px] font-bold rotate-90 tracking-widest uppercase">INVITAME</div>
          </div>
          <div className="font-mono-tech text-[8px] text-black/40 text-right uppercase">
            EDICIÓN ESPECIAL — VARIANTE: VANGUARDIA <br/>
            PLATAFORMA: REACT_LUXURY_EDITION
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t-[1px] border-black/5 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity">
        <div className="font-mono-tech text-[8px]">01010010 01001111 01000010 01001111 01010100 01010011</div>
        <div className="font-mono-tech text-[8px] uppercase">MANTENTE TRENDY. MANTENTE ENAMORADO.</div>
      </div>
    </footer>
  );
};

export default FooterCredits;
