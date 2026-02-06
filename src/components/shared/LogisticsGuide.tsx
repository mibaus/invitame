'use client';

import type { EventLogistics } from '@/types';
import { useTheme } from '@/lib/theme-adapter';

interface LogisticsGuideProps {
  skinId: string;
  logistics: EventLogistics;
  className?: string;
  styles?: {
    cardClassName?: string;
    titleClassName?: string;
  };
}

/**
 * LogisticsGuide - Guía logística detallada
 * Single Price Model: Siempre disponible si hay información.
 */
export function LogisticsGuide({
  skinId,
  logistics,
  className = '',
  styles = {},
}: LogisticsGuideProps) {
  const { classes, styles: themeStyles } = useTheme(skinId);

  const hasContent = logistics.accommodation_suggestions?.length || logistics.parking_info;

  if (!hasContent) {
    return null;
  }

  return (
    <div className={`logistics-guide ${className}`} style={themeStyles.section}>
      {/* Section Title */}
      <div className="text-center mb-12">
        <h3 className={classes.heading} style={themeStyles.heading}>
          Guía Logística
        </h3>
        <p className="mt-4 opacity-70" style={themeStyles.body}>
          Información útil para tu visita
        </p>
      </div>

      <div className={classes.container}>
        {/* Accommodation */}
        {logistics.accommodation_suggestions && logistics.accommodation_suggestions.length > 0 && (
          <div className="accommodation-section mb-12">
            <h4 className={`${classes.subheading} mb-6 flex items-center gap-2 ${styles.titleClassName || ''}`} style={themeStyles.heading}>
              <HotelIcon className="w-5 h-5" />
              Hospedaje Sugerido
            </h4>
            <div className={classes.spacing}>
              {logistics.accommodation_suggestions.map((hotel, index) => (
                <div
                  key={index}
                  className={`${classes.card} ${styles.cardClassName || ''}`}
                  style={themeStyles.card}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h5 className="font-medium text-lg mb-2" style={themeStyles.body}>{hotel.name}</h5>
                      {hotel.distance && (
                        <p className="text-sm opacity-60" style={themeStyles.body}>
                          📍 {hotel.distance}
                        </p>
                      )}
                    </div>
                    {hotel.url && (
                      <a
                        href={hotel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.button}
                        style={{
                          borderColor: themeStyles.colors.primary,
                          color: themeStyles.colors.primary,
                          fontSize: '0.875rem',
                          padding: '0.5rem 1rem',
                        }}
                      >
                        Ver →
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
            <h4 className={`${classes.subheading} mb-6 flex items-center gap-2 ${styles.titleClassName || ''}`} style={themeStyles.heading}>
              <ParkingIcon className="w-5 h-5" />
              Estacionamiento
            </h4>
            <div className={classes.card} style={themeStyles.card}>
              <p className="opacity-80" style={themeStyles.body}>{logistics.parking_info}</p>
            </div>
          </div>
        )}
      </div>
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
