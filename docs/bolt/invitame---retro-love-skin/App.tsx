
import React from 'react';
import { RetroLoveSkin } from './components/RetroLoveSkin';
import { Invitation } from './types';

const SAMPLE_INVITATION: Invitation = {
  names: {
    bride: "MARINA",
    groom: "DANIEL"
  },
  date: "2025-09-20T17:00:00",
  message: "Nos conocimos en un café de Madrid y, desde entonces, cada día ha sido una nueva página de nuestra historia. Queremos que seas parte del capítulo más importante.",
  heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
  gallery: [
    "https://picsum.photos/seed/love1/600/800",
    "https://picsum.photos/seed/love2/800/600",
    "https://picsum.photos/seed/love3/600/600",
    "https://picsum.photos/seed/love4/700/900",
    "https://picsum.photos/seed/love5/800/800",
    "https://picsum.photos/seed/love6/600/700",
  ],
  logistics: {
    locations: [
      {
        name: "Parroquia de San Jerónimo",
        address: "Calle Moreto, 4, Madrid",
        link: "https://maps.google.com",
        calendarLink: "https://calendar.google.com",
        time: "17:30",
        type: "ceremony"
      },
      {
        name: "Finca El Pendolero",
        address: "Ctra. de Colmenar Viejo, km 28",
        link: "https://maps.google.com",
        calendarLink: "https://calendar.google.com",
        time: "19:30",
        type: "party"
      }
    ],
    timeline: [
      { time: "17:30", event: "Ceremonia Religiosa", icon: 'church' },
      { time: "19:00", event: "Cóctel de Bienvenida", icon: 'glass' },
      { time: "21:00", event: "Cena & Sorpresas", icon: 'fork' },
      { time: "23:30", event: "Fiesta & Barra Libre", icon: 'music' }
    ],
    dressCode: {
      type: "Elegante con un toque Retro",
      description: "Queremos ver vuestro mejor estilo vintage. Piensa en linos, encajes y colores tierra.",
      colors: ["#A63F24", "#F2E8DF", "#2C1810", "#D9C5B2"]
    }
  },
  gifts: {
    bankName: "Banco Santander",
    cbu: "0000003100012345678901",
    alias: "marina.y.daniel.boda",
    holder: "Marina Garcia",
    mercadoLibreLink: "https://www.mercadolibre.com.ar"
  },
  features: {
    rsvpDeadline: "2025-08-15",
    whatsappNumber: "34600000000",
    spotifyPlaylistId: "37i9dQZF1DX50Uo8K9N0vH"
  }
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F2E8DF]">
      <RetroLoveSkin invitation={SAMPLE_INVITATION} />
    </div>
  );
};

export default App;
