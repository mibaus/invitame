'use client';

import type { VenueLocation } from '@/types';
import { LuxuryButton } from './LuxuryButton';

interface VenueDisplayProps {
  venues: VenueLocation[];
  className?: string;
  styles?: {
    cardClassName?: string;
    titleClassName?: string;
    buttonClassName?: string;
  };
}

export function VenueDisplay({
  venues,
  className = '',
  styles = {},
}: VenueDisplayProps) {
  if (!venues || venues.length === 0) {
    return null;
  }

  return (
    <div className={`venue-display grid gap-8 md:grid-cols-2 ${className}`}>
      {venues.map((venue) => (
        <VenueCard
          key={venue.id}
          venue={venue}
          styles={styles}
        />
      ))}
    </div>
  );
}

interface VenueCardProps {
  venue: VenueLocation;
  styles?: {
    cardClassName?: string;
    titleClassName?: string;
    buttonClassName?: string;
  };
}

function VenueCard({ venue, styles = {} }: VenueCardProps) {
  const generateICS = () => {
    // Generate .ics file content
    const eventDate = new Date();
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${venue.name}
LOCATION:${venue.address}, ${venue.city}
DTSTART:${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${venue.name.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`venue-card p-6 rounded-xl border border-current/10 ${styles.cardClassName || ''}`}>
      {/* Header */}
      <div className="venue-header mb-4">
        <span className="text-xs uppercase tracking-widest opacity-60">
          {getVenueTypeLabel(venue.type)}
        </span>
        <h3 className={`text-2xl font-heading mt-2 ${styles.titleClassName || ''}`}>
          {venue.name}
        </h3>
      </div>

      {/* Address */}
      <p className="venue-address text-base opacity-80 mb-4 leading-relaxed">
        {venue.address}, {venue.city}
      </p>

      {/* Instructions */}
      {venue.instructions && (
        <p className="venue-instructions text-sm opacity-60 italic mb-4">
          {venue.instructions}
        </p>
      )}

      {/* Map Preview (if coordinates) */}
      {venue.coordinates && (
        <div className="venue-map mb-6 rounded-lg overflow-hidden aspect-video bg-gray-100">
          <a 
            href={`https://www.google.com/maps?q=${venue.coordinates.lat},${venue.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full relative"
          >
            <img 
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${venue.coordinates.lat},${venue.coordinates.lng}&zoom=15&size=600x400&markers=${venue.coordinates.lat},${venue.coordinates.lng}&key=YOUR_API_KEY`}
              alt={`Mapa de ${venue.name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if API key not set
                (e.target as HTMLImageElement).src = `https://placehold.co/600x400/333/white?text=Ver+en+Google+Maps`;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors">
              <span className="bg-white/90 px-4 py-2 rounded-lg text-sm font-medium">
                Ver Mapa
              </span>
            </div>
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="venue-actions flex flex-wrap gap-3">
        {venue.google_maps_url && (
          <a href={venue.google_maps_url} target="_blank" rel="noopener noreferrer">
            <LuxuryButton
              variant="outline"
              size="sm"
              className={styles.buttonClassName}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Cómo llegar
            </LuxuryButton>
          </a>
        )}
        {venue.waze_url && (
          <a href={venue.waze_url} target="_blank" rel="noopener noreferrer">
            <LuxuryButton
              variant="ghost"
              size="sm"
              className={styles.buttonClassName}
            >
              Waze
            </LuxuryButton>
          </a>
        )}
        <LuxuryButton
          variant="outline"
          size="sm"
          onClick={generateICS}
          className={styles.buttonClassName}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Agendar
        </LuxuryButton>
      </div>
    </div>
  );
}

function getVenueTypeLabel(type: VenueLocation['type']): string {
  const labels: Record<VenueLocation['type'], string> = {
    ceremony: 'Ceremonia',
    reception: 'Recepción',
    party: 'Fiesta',
    custom: 'Ubicación',
  };
  return labels[type] || 'Ubicación';
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
