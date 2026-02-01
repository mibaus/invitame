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
 * BESPOKE COUTURE - Premium Tier
 * Vibe: Alta costura, texturas de tela, editorial
 * Typography: Didot / Source Sans 3
 * Palette: Gris Perla (#D3D3D3), Negro seda (#1c1c1c), Acentos de Cobre (#B87333)
 */
export function BespokeCoutureLayout({ invitation }: LayoutProps) {
  const { content, logistics, features } = invitation;

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#1c1c1c] font-[Source_Sans_3]">
      {/* Hero - Editorial Spread */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Subtle Fabric Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D3D3D3]/20 via-transparent to-[#D3D3D3]/20" />
        
        {/* Copper Accent Lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-[#B87333] to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-t from-[#B87333] to-transparent" />

        <div className="relative z-10 text-center max-w-4xl">
          {content.subtitle && (
            <p className="text-[#B87333] text-[10px] tracking-[0.6em] uppercase mb-12 font-semibold">
              {content.subtitle}
            </p>
          )}

          <h1 className="font-[Didot] text-6xl md:text-8xl lg:text-[10rem] font-normal mb-8 tracking-tight leading-none text-[#1c1c1c]">
            {content.headline}
          </h1>

          {/* Minimal Copper Line */}
          <div className="w-16 h-0.5 bg-[#B87333] mx-auto mb-8" />

          <p className="text-[#1c1c1c]/70 text-sm tracking-[0.3em] uppercase">
            {formatDate(logistics.event_date, 'es-MX', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          {features.countdown?.enabled && (
            <div className="mt-20">
              <CountdownDisplay
                config={{ ...features.countdown, style: 'minimal' }}
                className="[&_*]:text-[#1c1c1c]"
              />
            </div>
          )}
        </div>
      </section>

      {/* Message - Clean Editorial */}
      <section className="py-32 px-6 bg-[#1c1c1c] text-white">
        <div className="max-w-3xl mx-auto">
          {content.hosts && content.hosts.length > 0 && (
            <div className="text-center mb-16">
              <p className="text-[#B87333] text-[10px] tracking-[0.4em] uppercase mb-6">
                Together with their families
              </p>
              <div className="space-y-1">
                {content.hosts.map((host, index) => (
                  <p key={index} className="text-white/70 text-sm tracking-wider">{host.name}</p>
                ))}
              </div>
            </div>
          )}

          <p className="font-[Didot] text-2xl md:text-3xl text-white/90 leading-relaxed text-center font-light">
            {content.main_message}
          </p>

          {content.quote && (
            <div className="mt-20 text-center">
              <div className="w-8 h-0.5 bg-[#B87333] mx-auto mb-8" />
              <p className="text-white/60 italic text-lg">&quot;{content.quote.text}&quot;</p>
              {content.quote.author && (
                <p className="text-[#B87333] text-xs tracking-widest uppercase mt-6">
                  — {content.quote.author}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Agenda - Magazine Grid */}
      {logistics.agenda.length > 0 && (
        <section className="py-32 px-6 bg-[#f8f8f8]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-8 mb-20">
              <div className="flex-1 h-px bg-[#D3D3D3]" />
              <h2 className="font-[Didot] text-4xl text-[#1c1c1c] tracking-tight">
                The Day
              </h2>
              <div className="flex-1 h-px bg-[#D3D3D3]" />
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-[#D3D3D3]">
              {logistics.agenda.map((item) => (
                <div
                  key={item.id}
                  className="p-12 bg-[#f8f8f8] hover:bg-white transition-colors"
                >
                  <span className="text-[#B87333] text-xs tracking-widest">{item.time}</span>
                  <h3 className="font-[Didot] text-2xl text-[#1c1c1c] mt-3 mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-[#1c1c1c]/50 text-sm">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venues - Split Layout */}
      <section className="py-32 px-6 bg-[#D3D3D3]/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-8 mb-20">
            <div className="flex-1 h-px bg-[#D3D3D3]" />
            <h2 className="font-[Didot] text-4xl text-[#1c1c1c] tracking-tight">
              Venues
            </h2>
            <div className="flex-1 h-px bg-[#D3D3D3]" />
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {logistics.venues.map((venue) => (
              <div key={venue.id} className="text-center">
                <span className="text-[#B87333] text-[10px] tracking-[0.4em] uppercase">
                  {venue.type === 'ceremony' ? 'Ceremony' : 'Reception'}
                </span>
                <h3 className="font-[Didot] text-3xl text-[#1c1c1c] mt-4 mb-4">{venue.name}</h3>
                <p className="text-[#1c1c1c]/50 text-sm mb-8">
                  {venue.address}<br />{venue.city}
                </p>
                {venue.google_maps_url && (
                  <a href={venue.google_maps_url} target="_blank" rel="noopener noreferrer">
                    <LuxuryButton
                      variant="ghost"
                      size="sm"
                      className="text-[#B87333] hover:text-[#1c1c1c] underline underline-offset-4"
                    >
                      View Map →
                    </LuxuryButton>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dress Code - Minimal */}
      {logistics.dress_code && (
        <section className="py-20 px-6 bg-[#f8f8f8]">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-[#B87333] text-[10px] tracking-[0.4em] uppercase">Dress Code</span>
            <p className="font-[Didot] text-4xl text-[#1c1c1c] mt-4 capitalize">
              {logistics.dress_code.code.replace('-', ' ')}
            </p>
          </div>
        </section>
      )}

      {/* RSVP - Bold Statement */}
      {features.rsvp.enabled && (
        <section className="py-32 px-6 bg-[#1c1c1c]">
          <div className="max-w-md mx-auto text-center">
            <h2 className="font-[Didot] text-5xl text-white mb-12">
              RSVP
            </h2>
            <LuxuryButton
              size="lg"
              className="bg-[#B87333] text-white hover:bg-[#a06630] min-w-[200px] tracking-widest text-sm"
            >
              RESPOND
            </LuxuryButton>
            {features.rsvp.deadline && (
              <p className="text-white/40 text-xs tracking-widest uppercase mt-8">
                Kindly respond by {formatDate(features.rsvp.deadline, 'en-US', { month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Footer - Editorial Close */}
      <footer className="py-16 px-6 bg-[#f8f8f8] text-center">
        <div className="w-8 h-0.5 bg-[#B87333] mx-auto mb-8" />
        {content.couple?.hashtag && (
          <p className="text-[#1c1c1c]/40 text-xs tracking-[0.4em] uppercase">
            {content.couple.hashtag}
          </p>
        )}
      </footer>
    </div>
  );
}
