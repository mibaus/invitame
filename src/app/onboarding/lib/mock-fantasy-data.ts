import { OnboardingData } from '../types';

export interface MockFantasyData {
  person1Name: string;
  person2Name: string;
  headline: string;
  mainMessage: string;
  eventDate: string;
  eventTime: string;
  ceremonyName: string;
  ceremonyAddress: string;
  receptionName: string;
  receptionAddress: string;
  bankName: string;
  bankAccountNumber: string;
  giftRegistryMessage: string;
  quote: string;
  quoteAuthor: string;
  dressCode: string;
  dressCodeDescription: string;
  agendaItems: { time: string; title: string; }[];
  rsvpDeadline: string;
  rsvpConfirmationMessage: string;
  maxCompanions: number;
  allowChildren: boolean;
}

const FANTASY_NAMES = [
  { p1: 'Isabella', p2: 'Santiago' },
  { p1: 'Valentina', p2: 'Mateo' },
  { p1: 'Camila', p2: 'Lucas' },
  { p1: 'Sofía', p2: 'Benjamín' },
  { p1: 'Mariana', p2: 'Nicolás' },
  { p1: 'Luciana', p2: 'Gabriel' },
];

const FANTASY_QUOTES = [
  { text: 'Encontré a quien mi alma ama', author: 'Cantar de los Cantares' },
  { text: 'El amor es la poesía de los sentidos', author: 'Honoré de Balzac' },
  { text: 'Donde hay amor hay vida', author: 'Mahatma Gandhi' },
  { text: 'El amor todo lo puede', author: 'Ovidio' },
  { text: 'Dos almas, un solo pensamiento', author: 'Aristóteles' },
];

export function generateFantasyData(formData: Partial<OnboardingData>): MockFantasyData {
  const names = FANTASY_NAMES[Math.floor(Math.random() * FANTASY_NAMES.length)];
  const quote = FANTASY_QUOTES[Math.floor(Math.random() * FANTASY_QUOTES.length)];
  
  const person1Name = formData.person1Name || names.p1;
  const person2Name = formData.person2Name || names.p2;
  
  return {
    person1Name,
    person2Name,
    headline: formData.headline || 'Nuestra Boda',
    mainMessage: formData.mainMessage || `Con gran alegría queremos compartir con ustedes que ${person1Name} y ${person2Name} unirán sus vidas en matrimonio. Será un día lleno de amor, celebración y momentos inolvidables.`,
    eventDate: formData.eventDate || '2025-09-20',
    eventTime: formData.eventTime || '18:00',
    ceremonyName: formData.ceremonyName || 'Basílica Nuestra Señora de Luján',
    ceremonyAddress: formData.ceremonyAddress || 'Gral. Las Heras 226, Luján, Buenos Aires',
    receptionName: formData.receptionName || 'Estancia La Aurora',
    receptionAddress: formData.receptionAddress || 'Ruta 192 km 35, Open Door, Buenos Aires',
    bankName: formData.bankName || 'Banco Santander',
    bankAccountNumber: formData.bankAccountNumber || 'ES91 0001 2091 4501 2345 6789',
    giftRegistryMessage: formData.giftRegistryMessage || 'Tu presencia es el mejor regalo que podemos recibir. Si deseas hacernos un obsequio, hemos habilitado esta cuenta para nuestra luna de miel.',
    quote: formData.quote || quote.text,
    quoteAuthor: formData.quoteAuthor || quote.author,
    dressCode: formData.dressCode || 'formal',
    dressCodeDescription: formData.dressCodeDescription || 'Elegante, colores oscuros preferidos',
    agendaItems: formData.agendaItems || [
      { time: '17:30', title: 'Ceremonia Religiosa' },
      { time: '19:00', title: 'Cóctel de Bienvenida' },
      { time: '20:30', title: 'Cena de Gala' },
      { time: '22:00', title: 'Fiesta hasta el amanecer' },
    ],
    rsvpDeadline: formData.rsvpDeadline || '2025-08-15',
    rsvpConfirmationMessage: formData.rsvpConfirmationMessage || '¡Gracias por confirmar! No podemos esperar para celebrar juntos.',
    maxCompanions: formData.maxCompanions ?? 2,
    allowChildren: formData.allowChildren ?? true,
  };
}
