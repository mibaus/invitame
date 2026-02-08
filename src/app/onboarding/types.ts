export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: 'church' | 'wine' | 'utensils' | 'music' | 'camera' | 'sparkles' | 'clock';
}

export interface OnboardingData {
  // Paso 1
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  
  // Paso 2
  slug: string;
  isSlugValid?: boolean;
  skinId: string;
  eventType: 'wedding' | 'quinceañera' | 'birthday' | 'baby_shower' | 'corporate' | 'other';
  headline: string;
  subtitle?: string;
  mainMessage: string;
  eventDate: string;
  eventTime: string;
  dressCode?: string;
  dressCodeDescription?: string;
  quote?: string;
  quoteAuthor?: string;
  person1Name: string;
  person2Name: string;
  coupleHashtag?: string;
  
  // Paso 3
  ceremonyName?: string;
  ceremonyTime?: string;
  ceremonyAddress?: string;
  ceremonyMapsUrl?: string;
  receptionName?: string;
  receptionTime?: string;
  receptionAddress?: string;
  receptionMapsUrl?: string;
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  giftRegistryMessage?: string;
  
  // Paso 4
  coverImage?: string;
  galleryImages?: string[];
  musicTrackUrl?: string;
  spotifyPlaylistUrl?: string;
  
  // Paso 5
  showHero?: boolean;
  showCountdown?: boolean;
  showAgenda?: boolean;
  showVenueMap?: boolean;
  showCeremony?: boolean;
  showReception?: boolean;
  showDressCode?: boolean;
  showGiftRegistry?: boolean;
  showRSVP?: boolean;
  showGallery?: boolean;
  showMusic?: boolean;
  showGuestMessages?: boolean;
  
  agendaItems?: AgendaItem[];
  
  rsvpEnabled?: boolean;
  rsvpDeadline?: string;
  maxCompanions?: number;
  allowChildren?: boolean;
  rsvpConfirmationMessage?: string;
  
  // Preguntas personalizadas para RSVP (hasta 3)
  rsvpCustomQuestions?: Array<{
    id: string;
    question: string;
    isActive: boolean;
  }>;
}

export interface StepProps {
  formData: Partial<OnboardingData>;
  updateFormData: (data: Partial<OnboardingData>) => void;
  isValid?: boolean;
}
