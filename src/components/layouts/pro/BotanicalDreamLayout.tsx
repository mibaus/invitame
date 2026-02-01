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
 * BOTANICAL DREAM - Pro Tier
 * Vibe: Selva tropical, boho-chic moderno
 * Typography: Cormorant Garamond / Lato
 * Palette: Verde Esmeralda (#046307), Terracota (#E07A5F), Arena (#F4E8D1)
 */
export function BotanicalDreamLayout({ invitation }: LayoutProps) {
  const { content, logistics, features } = invitation;

  return (
    <div className="min-h-screen bg-[#F4E8D1] text-[#2d3a2d] font-[Lato]">
      {/* Hero - Tropical Vibes */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Botanical Background Elements */}
        <div className="absolute top-0 left-0 text-[#046307]/10 text-[200px] leading-none select-none">
          🌿
        </div>
        <div className="absolute bottom-0 right-0 text-[#046307]/10 text-[200px] leading-none select-none rotate-180">
          🌿
        </div>

        <div className="relative z-10 text-center max-w-2xl">
          {/* Leaf Decorations */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-[#046307] text-2xl">🍃</span>
            <div className="w-16 h-px bg-[#046307]/40" />
            <span className="text-[#E07A5F] text-xl">✿</span>
            <div className="w-16 h-px bg-[#046307]/40" />
            <span className="text-[#046307] text-2xl transform scale-x-[-1]">🍃</span>
          </div>

          {content.subtitle && (
            <p className="text-[#E07A5F] text-sm tracking-[0.3em] uppercase mb-6 font-light">
              {content.subtitle}
            </p>
          )}

          <h1 className="font-[Cormorant_Garamond] text-5xl md:text-7xl lg:text-8xl font-light text-[#046307] mb-8">
            {content.headline}
          </h1>

          <p className="text-[#2d3a2d]/80 text-xl tracking-wide">
            {formatDate(logistics.event_date, 'es-MX', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          {features.countdown?.enabled && (
            <div className="mt-16">
              <CountdownDisplay
                config={{ ...features.countdown, style: 'elegant' }}
                className="[&_*]:border-[#046307]/20 [&_span]:text-[#046307]"
              />
            </div>
          )}
        </div>
      </section>

      {/* Message - Warm Terracotta */}
      <section className="py-24 px-6 bg-[#E07A5F]/10">
        <div className="max-w-3xl mx-auto">
          {content.hosts && content.hosts.length > 0 && (
            <div className="text-center mb-12">
              <p className="text-[#E07A5F] text-xs tracking-[0.2em] uppercase mb-4">
                Junto a sus familias
              </p>
              {content.hosts.map((host, index) => (
                <p key={index} className="text-[#2d3a2d]/80">{host.name}</p>
              ))}
            </div>
          )}

          <p className="text-xl md:text-2xl text-[#2d3a2d] leading-relaxed text-center font-light">
            {content.main_message}
          </p>

          {content.quote && (
            <div className="mt-16 p-8 bg-white/50 rounded-3xl text-center">
              <span className="text-[#046307] text-3xl">🌸</span>
              <p className="text-[#2d3a2d]/80 italic text-lg mt-4">&quot;{content.quote.text}&quot;</p>
              {content.quote.author && (
                <p className="text-[#E07A5F] text-sm mt-4">— {content.quote.author}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Agenda - Organic Cards */}
      {logistics.agenda.length > 0 && (
        <section className="py-24 px-6 bg-[#F4E8D1]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-[Cormorant_Garamond] text-4xl text-center text-[#046307] mb-16">
              🌿 Itinerario 🌿
            </h2>

            <div className="space-y-6">
              {logistics.agenda.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm"
                >
                  <div className="w-16 h-16 bg-[#046307]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-[Cormorant_Garamond] text-xl text-[#046307]">
                      {item.time}
                    </span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-[Cormorant_Garamond] text-xl text-[#046307]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-[#2d3a2d]/60 text-sm mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venues - Nature Cards */}
      <section className="py-24 px-6 bg-[#046307]/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[Cormorant_Garamond] text-4xl text-center text-[#046307] mb-16">
            🍃 Ubicaciones 🍃
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {logistics.venues.map((venue) => (
              <div
                key={venue.id}
                className="p-8 bg-white rounded-3xl shadow-sm text-center"
              >
                <span className="text-3xl">
                  {venue.type === 'ceremony' ? '⛪' : '🏡'}
                </span>
                <span className="block text-[#E07A5F] text-xs tracking-widest uppercase mt-4">
                  {venue.type === 'ceremony' ? 'Ceremonia' : 'Celebración'}
                </span>
                <h3 className="font-[Cormorant_Garamond] text-2xl text-[#046307] mt-2 mb-3">
                  {venue.name}
                </h3>
                <p className="text-[#2d3a2d]/60 text-sm mb-6">
                  {venue.address}, {venue.city}
                </p>
                {venue.google_maps_url && (
                  <a href={venue.google_maps_url} target="_blank" rel="noopener noreferrer">
                    <LuxuryButton
                      variant="outline"
                      size="sm"
                      className="border-[#046307] text-[#046307] hover:bg-[#046307] hover:text-white"
                    >
                      Ver Mapa
                    </LuxuryButton>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dress Code */}
      {logistics.dress_code && (
        <section className="py-16 px-6 bg-[#F4E8D1]">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-[#E07A5F] text-xs tracking-widest uppercase">Vestimenta</span>
            <p className="font-[Cormorant_Garamond] text-3xl text-[#046307] mt-2 capitalize">
              {logistics.dress_code.code.replace('-', ' ')}
            </p>
          </div>
        </section>
      )}

      {/* RSVP */}
      {features.rsvp.enabled && (
        <section className="py-24 px-6 bg-[#E07A5F]/20">
          <div className="max-w-md mx-auto text-center">
            <span className="text-4xl">💌</span>
            <h2 className="font-[Cormorant_Garamond] text-3xl text-[#046307] mt-4 mb-8">
              ¿Nos Acompañas?
            </h2>
            <LuxuryButton
              size="lg"
              className="bg-[#046307] text-white hover:bg-[#034d05] min-w-[200px]"
            >
              Confirmar Asistencia
            </LuxuryButton>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#F4E8D1] text-center border-t border-[#046307]/10">
        <div className="flex items-center justify-center gap-2 text-[#046307]/60 mb-4">
          <span>🌿</span>
          <span>✿</span>
          <span className="transform scale-x-[-1]">🌿</span>
        </div>
        {content.couple?.hashtag && (
          <p className="text-[#046307] tracking-widest font-[Cormorant_Garamond] text-lg">
            {content.couple.hashtag}
          </p>
        )}
      </footer>
    </div>
  );
}
