'use client';

import type { ServiceTier, EventLogistics } from '@/types';
import { useTierAccess } from './TierGate';
import { LuxuryButton } from './LuxuryButton';

interface LogisticsGuideProps {
  tier: ServiceTier;
  logistics: EventLogistics;
  className?: string;
  styles?: {
    cardClassName?: string;
    titleClassName?: string;
  };
}

/**
 * LogisticsGuide - Guía logística detallada
 * 
 * Essential/Pro: No disponible
 * Premium: Hoteles, transporte, estacionamiento
 */
export function LogisticsGuide({
  tier,
  logistics,
  className = '',
  styles = {},
}: LogisticsGuideProps) {
  const { hasFeature } = useTierAccess(tier);

  // Solo Premium
  if (!hasFeature('logistics_guide')) {
    return null;
  }

  const hasContent = logistics.accommodation_suggestions?.length || logistics.parking_info;

  if (!hasContent) {
    return null;
  }

  return (
    <div className={`logistics-guide ${className}`}>
      {/* Accommodation */}
      {logistics.accommodation_suggestions && logistics.accommodation_suggestions.length > 0 && (
        <div className="accommodation-section mb-8">
          <h4 className={`text-lg font-heading mb-4 flex items-center gap-2 ${styles.titleClassName || ''}`}>
            <HotelIcon className="w-5 h-5" />
            Hospedaje Sugerido
          </h4>
          <div className="space-y-3">
            {logistics.accommodation_suggestions.map((hotel, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg bg-white/5 border border-current/10 ${styles.cardClassName || ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h5 className="font-medium">{hotel.name}</h5>
                    {hotel.distance && (
                      <p className="text-sm opacity-60 mt-1">
                        📍 {hotel.distance}
                      </p>
                    )}
                  </div>
                  {hotel.url && (
                    <a href={hotel.url} target="_blank" rel="noopener noreferrer">
                      <LuxuryButton variant="ghost" size="sm">
                        Ver →
                      </LuxuryButton>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parking */}
      {logistics.parking_info && (
        <div className="parking-section">
          <h4 className={`text-lg font-heading mb-4 flex items-center gap-2 ${styles.titleClassName || ''}`}>
            <ParkingIcon className="w-5 h-5" />
            Estacionamiento
          </h4>
          <p className="opacity-80">{logistics.parking_info}</p>
        </div>
      )}
    </div>
  );
}

function HotelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function ParkingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}
