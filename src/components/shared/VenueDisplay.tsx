'use client';

import type { ServiceTier, VenueLocation } from '@/types';
import { useTierAccess } from './TierGate';
import { LuxuryButton } from './LuxuryButton';

interface VenueDisplayProps {
  tier: ServiceTier;
  venues: VenueLocation[];
  className?: string;
  styles?: {
    cardClassName?: string;
    titleClassName?: string;
    buttonClassName?: string;
  };
}

/**
 * VenueDisplay - Componente inteligente para ubicaciones
 * 
 * Essential: Solo link a Google Maps
 * Pro/Premium: Mapa embebido + links
 */
export function VenueDisplay({
  tier,
  venues,
  className = '',
  styles = {},
}: VenueDisplayProps) {
  const { hasFeature } = useTierAccess(tier);
  const showEmbedMap = hasFeature('venue_map_embed');

  if (!venues || venues.length === 0) {
    return null;
  }

  return (
    <div className={`venue-display ${className}`}>
      {venues.map((venue) => (
        <VenueCard
          key={venue.id}
          venue={venue}
          showEmbed={showEmbedMap}
          styles={styles}
        />
      ))}
    </div>
  );
}

interface VenueCardProps {
  venue: VenueLocation;
  showEmbed: boolean;
  styles?: {
    cardClassName?: string;
    titleClassName?: string;
    buttonClassName?: string;
  };
}

function VenueCard({ venue, showEmbed, styles = {} }: VenueCardProps) {
  return (
    <div className={`venue-card ${styles.cardClassName || ''}`}>
      {/* Header */}
      <div className="venue-header mb-4">
        <span className="text-xs uppercase tracking-widest opacity-60">
          {getVenueTypeLabel(venue.type)}
        </span>
        <h3 className={`text-xl font-heading mt-1 ${styles.titleClassName || ''}`}>
          {venue.name}
        </h3>
      </div>

      {/* Address */}
      <p className="venue-address text-sm opacity-70 mb-4">
        {venue.address}, {venue.city}
      </p>

      {/* Instructions */}
      {venue.instructions && (
        <p className="venue-instructions text-sm opacity-60 italic mb-4">
          {venue.instructions}
        </p>
      )}

      {/* Embedded Map (Pro/Premium) */}
      {showEmbed && venue.coordinates && (
        <div className="venue-map mb-4 rounded-lg overflow-hidden aspect-video">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${venue.coordinates.lat},${venue.coordinates.lng}&zoom=15`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa de ${venue.name}`}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="venue-actions flex flex-wrap gap-2">
        {venue.google_maps_url && (
          <a href={venue.google_maps_url} target="_blank" rel="noopener noreferrer">
            <LuxuryButton
              variant="outline"
              size="sm"
              className={styles.buttonClassName}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Google Maps
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
