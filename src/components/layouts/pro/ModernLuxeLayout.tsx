'use client';

import type { InvitationSchema } from '@/types';
import { formatDate } from '@/lib/utils';
import { CountdownDisplay } from '@/components/shared/CountdownDisplay';
import { LuxuryButton } from '@/components/shared/LuxuryButton';

interface LayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
}

/**
 * MODERN LUXE - Pro Tier
 * Vibe: Arquitectónico, audaz, nocturno
 * Typography: Bodoni / Open Sans
 * Palette: Azul Medianoche (#191970), Plata (#C0C0C0), Blanco brillante
 */
export function ModernLuxeLayout({ invitation }: LayoutProps) {
  const { content, logistics, features } = invitation;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-[Open_Sans]">
      {/* Hero - Architectural Lines */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Geometric Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent" />
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-[#C0C0C0]/20 via-transparent to-[#C0C0C0]/20" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-[#C0C0C0]/20 via-transparent to-[#C0C0C0]/20" />
        </div>

        <div className="relative z-10 text-center max-w-3xl">
          {content.subtitle && (
            <p className="text-[#C0C0C0] text-xs tracking-[0.5em] uppercase mb-8 font-light">
              {content.subtitle}
            </p>
          )}

          <h1 className="font-[Bodoni_Moda] text-6xl md:text-8xl lg:text-9xl font-normal mb-8 tracking-tight text-white">
            {content.headline}
          </h1>

          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="w-24 h-px bg-[#C0C0C0]" />
            <span className="text-[#C0C0C0] text-lg tracking-widest">
              {formatDate(logistics.event_date, 'es-MX', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
            <div className="w-24 h-px bg-[#C0C0C0]" />
          </div>

          {features.countdown?.enabled && (
            <div className="mt-12">
              <CountdownDisplay
                config={{ ...features.countdown, style: 'minimal' }}
                className="[&_*]:text-[#C0C0C0]"
              />
            </div>
          )}
        </div>
      </section>

      {/* Message Section - Clean Architecture */}
      <section className="py-24 px-6 bg-[#191970]/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
            {content.main_message}
          </p>

          {content.quote && (
            <div className="mt-16 border-l-2 border-[#C0C0C0] pl-8 text-left">
              <p className="text-white/70 italic text-lg">&quot;{content.quote.text}&quot;</p>
              {content.quote.author && (
                <p className="text-[#C0C0C0] text-sm mt-4">— {content.quote.author}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Agenda - Grid Layout */}
      {logistics.agenda.length > 0 && (
        <section className="py-24 px-6 bg-[#0a0a1a]">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-[Bodoni_Moda] text-4xl text-center text-[#C0C0C0] mb-16">
              ITINERARIO
            </h2>

            <div className="grid md:grid-cols-2 gap-1">
              {logistics.agenda.map((item) => (
                <div
                  key={item.id}
                  className="p-8 bg-[#191970]/20 border border-[#C0C0C0]/10 hover:border-[#C0C0C0]/30 transition-colors"
                >
                  <span className="text-[#C0C0C0] text-3xl font-[Bodoni_Moda]">{item.time}</span>
                  <h3 className="text-white text-xl mt-4 mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/60 text-sm">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venues - Minimal Cards */}
      <section className="py-24 px-6 bg-[#191970]/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[Bodoni_Moda] text-4xl text-center text-[#C0C0C0] mb-16">
            UBICACIÓN
          </h2>

          <div className="space-y-8">
            {logistics.venues.map((venue) => (
              <div
                key={venue.id}
                className="p-8 bg-[#0a0a1a] border border-[#C0C0C0]/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[#C0C0C0] text-xs tracking-widest uppercase">
                      {venue.type === 'ceremony' ? 'Ceremonia' : 'Recepción'}
                    </span>
                    <h3 className="font-[Bodoni_Moda] text-2xl text-white mt-2">{venue.name}</h3>
                    <p className="text-white/60 mt-2">{venue.address}, {venue.city}</p>
                  </div>
                  {venue.google_maps_url && (
                    <a href={venue.google_maps_url} target="_blank" rel="noopener noreferrer">
                      <LuxuryButton
                        variant="outline"
                        size="sm"
                        className="border-[#C0C0C0] text-[#C0C0C0] hover:bg-[#C0C0C0] hover:text-[#0a0a1a]"
                      >
                        Ver Mapa
                      </LuxuryButton>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      {features.rsvp.enabled && (
        <section className="py-24 px-6 bg-[#0a0a1a]">
          <div className="max-w-md mx-auto text-center">
            <h2 className="font-[Bodoni_Moda] text-4xl text-[#C0C0C0] mb-8">RSVP</h2>
            <LuxuryButton
              size="lg"
              className="bg-[#C0C0C0] text-[#0a0a1a] hover:bg-white min-w-[200px]"
            >
              Confirmar Asistencia
            </LuxuryButton>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0a0a1a] border-t border-[#C0C0C0]/10 text-center">
        {content.couple?.hashtag && (
          <p className="text-[#C0C0C0] tracking-widest">{content.couple.hashtag}</p>
        )}
      </footer>
    </div>
  );
}
