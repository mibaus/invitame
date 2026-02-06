
export interface Location {
  name: string;
  address: string;
  link: string;
  calendarLink: string;
  time: string;
  type: 'ceremony' | 'party';
}

export interface TimelineEvent {
  time: string;
  event: string;
  icon: 'church' | 'glass' | 'fork' | 'music' | 'camera';
}

export interface Invitation {
  names: {
    bride: string;
    groom: string;
  };
  date: string; // ISO format
  message: string;
  heroImage: string;
  gallery: string[];
  logistics: {
    locations: Location[];
    timeline: TimelineEvent[];
    dressCode: {
      type: string;
      description: string;
      colors: string[];
    };
  };
  gifts: {
    bankName: string;
    cbu: string;
    alias: string;
    holder: string;
    mercadoLibreLink?: string;
  };
  features: {
    rsvpDeadline: string;
    whatsappNumber: string;
    spotifyPlaylistId: string;
    registryLink?: string;
  };
}
