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
 * RENAISSANCE OPULENCE - Premium Tier
 * Vibe: Arte clásico, texturas de mármol y óleo
 * Typography: Italianno / Playfair Display
 * Palette: Crema Mármol (#F5F0E6), Dorado envejecido (#B8860B), Siena (#A0522D)
 */
export function RenaissanceOpulenceLayout({ invitation }: LayoutProps) {
  const { content, logistics, features } = invitation;

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#3d2914] font-[Playfair_Display]">
      {/* Hero - Classical Art Frame */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Marble Texture Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJ0dXJidWxlbmNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC40Ii8+PC9zdmc+')]" />
        
        {/* Ornate Frame */}
        <div className="absolute inset-8 md:inset-16 border-8 border-double border-[#B8860B]/40" />
        <div className="absolute inset-12 md:inset-20 border border-[#B8860B]/20" />

        <div className="relative z-10 text-center max-w-3xl px-8">
          {/* Fleur-de-lis */}
          <div className="text-[#B8860B] text-4xl mb-8">⚜</div>

          {content.subtitle && (
            <p className="text-[#A0522D] text-sm tracking-[0.4em] uppercase mb-6">
              {content.subtitle}
            </p>
          )}

          <h1 className="font-[Italianno] text-6xl md:text-8xl lg:text-9xl text-[#B8860B] mb-6 leading-tight">
            {content.headline}
          </h1>

          {/* Classical Ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px bg-[#B8860B]/50" />
            <span className="text-[#B8860B] text-xl">❧</span>
            <div className="text-[#A0522D] text-sm tracking-widest">
              {formatDate(logistics.event_date, 'es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <span className="text-[#B8860B] text-xl transform scale-x-[-1]">❧</span>
            <div className="w-16 h-px bg-[#B8860B]/50" />
          </div>

          {features.countdown?.enabled && (
            <div className="mt-12">
              <CountdownDisplay
                config={{ ...features.countdown, style: 'classic' }}
                className="[&_*]:bg-[#F5F0E6] [&_*]:border-[#B8860B]/30"
              />
            </div>
          )}
        </div>
      </section>

      {/* Message - Parchment Style */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#F5F0E6] via-[#EDE5D5] to-[#F5F0E6]">
        <div className="max-w-3xl mx-auto">
          {content.hosts && content.hosts.length > 0 && (
            <div className="text-center mb-12">
              <p className="text-[#A0522D] text-xs tracking-[0.3em] uppercase mb-4">
                Con el beneplácito de
              </p>
              {content.hosts.map((host, index) => (
                <p key={index} className="text-[#3d2914] text-lg italic">{host.name}</p>
              ))}
            </div>
          )}

          <div className="text-center">
            <span className="text-[#B8860B] text-3xl">❦</span>
            <p className="text-xl md:text-2xl text-[#3d2914] leading-relaxed mt-6 first-letter:text-5xl first-letter:font-[Italianno] first-letter:text-[#B8860B] first-letter:mr-1 first-letter:float-left">
              {content.main_message}
            </p>
          </div>

          {content.quote && (
            <div className="mt-16 p-8 bg-[#F5F0E6] border-l-4 border-[#B8860B] shadow-lg">
              <p className="text-[#3d2914]/80 italic text-lg">&quot;{content.quote.text}&quot;</p>
              {content.quote.author && (
                <p className="text-[#A0522D] text-sm mt-4 text-right">— {content.quote.author}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Agenda - Classical Scroll */}
      {logistics.agenda.length > 0 && (
        <section className="py-24 px-6 bg-[#EDE5D5]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-[Italianno] text-5xl text-center text-[#B8860B] mb-16">
              Programa de Celebración
            </h2>

            <div className="space-y-6">
              {logistics.agenda.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-6 p-6 bg-[#F5F0E6] border border-[#B8860B]/20 shadow-md"
                >
                  <div className="w-24 text-center flex-shrink-0">
                    <span className="font-[Italianno] text-4xl text-[#B8860B]">{item.time}</span>
                  </div>
                  <div className="w-px h-16 bg-[#B8860B]/30" />
                  <div className="flex-1">
                    <h3 className="text-xl text-[#3d2914]">{item.title}</h3>
                    {item.description && (
                      <p className="text-[#A0522D] text-sm mt-1 italic">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venues - Classical Cards */}
      <section className="py-24 px-6 bg-[#F5F0E6]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[Italianno] text-5xl text-center text-[#B8860B] mb-16">
            Lugares del Evento
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {logistics.venues.map((venue) => (
              <div
                key={venue.id}
                className="p-8 bg-[#EDE5D5] border-2 border-[#B8860B]/30 text-center shadow-lg"
              >
                <span className="text-[#B8860B] text-xl">⚜</span>
                <span className="block text-[#A0522D] text-xs tracking-widest uppercase mt-4">
                  {venue.type === 'ceremony' ? 'Santa Ceremonia' : 'Recepción'}
                </span>
                <h3 className="font-[Italianno] text-4xl text-[#B8860B] mt-2 mb-3">{venue.name}</h3>
                <p className="text-[#3d2914]/70 text-sm mb-6">
                  {venue.address}, {venue.city}
                </p>
                {venue.google_maps_url && (
                  <a href={venue.google_maps_url} target="_blank" rel="noopener noreferrer">
                    <LuxuryButton
                      variant="outline"
                      size="sm"
                      className="border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-[#F5F0E6]"
                    >
                      Ver Ubicación
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
        <section className="py-16 px-6 bg-[#EDE5D5]">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-[#B8860B] text-xl">❧</span>
            <p className="text-[#A0522D] text-xs tracking-widest uppercase mt-2">Etiqueta</p>
            <p className="font-[Italianno] text-5xl text-[#B8860B] mt-2 capitalize">
              {logistics.dress_code.code.replace('-', ' ')}
            </p>
          </div>
        </section>
      )}

      {/* RSVP */}
      {features.rsvp.enabled && (
        <section className="py-24 px-6 bg-gradient-to-b from-[#EDE5D5] to-[#F5F0E6]">
          <div className="max-w-md mx-auto text-center">
            <span className="text-[#B8860B] text-4xl">⚜</span>
            <h2 className="font-[Italianno] text-5xl text-[#B8860B] mt-4 mb-8">
              Confirme su Asistencia
            </h2>
            <LuxuryButton
              size="lg"
              className="bg-[#B8860B] text-[#F5F0E6] hover:bg-[#9a7209] font-[Playfair_Display] min-w-[220px]"
            >
              Responder Invitación
            </LuxuryButton>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#F5F0E6] border-t border-[#B8860B]/20 text-center">
        <div className="flex items-center justify-center gap-4 text-[#B8860B]/60 mb-4">
          <span>❧</span>
          <span>⚜</span>
          <span className="transform scale-x-[-1]">❧</span>
        </div>
        {content.couple?.hashtag && (
          <p className="text-[#B8860B] tracking-widest font-[Italianno] text-2xl">
            {content.couple.hashtag}
          </p>
        )}
      </footer>
    </div>
  );
}
