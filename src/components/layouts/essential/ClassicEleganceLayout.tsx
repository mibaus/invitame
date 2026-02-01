'use client';

import type { InvitationSchema } from '@/types';
import { formatDate } from '@/lib/utils';
import { CountdownDisplay, LuxuryButton, RSVPManager, VenueDisplay, GiftSection, AgendaTimeline, MusicPlayer, TierGate, PhotoGallery, LogisticsGuide, Guestbook } from '@/components/shared';

interface LayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
}

/**
 * ClassicEleganceLayout - Skin Visual "Classic Elegance"
 * 
 * FLEX MODE: Este skin soporta TODAS las secciones.
 * Las features visibles dependen del `tier` en metadata, no del skin.
 * 
 * Essential: Hero, Countdown minimal, Venues (links), Gift (texto), RSVP WhatsApp, 1 foto
 * Pro: + Agenda, Dress Code, Mapa embebido, Música, RSVP Form, 2 fotos
 * Premium: + Logistics Guide, Guestbook, Spotify, 15 fotos
 */
export function ClassicEleganceLayout({ invitation }: LayoutProps) {
  const { metadata, content, logistics, features, skin_config } = invitation;
  const tier = metadata.tier;
  const colors = skin_config?.colors;

  return (
    <div
      className="min-h-screen bg-charcoal-950 text-cream-100"
      style={{
        backgroundColor: colors?.background,
        color: colors?.text_primary,
      }}
    >
      {/* Music Player (Pro/Premium) */}
      <MusicPlayer tier={tier} config={features.music} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.cover_image})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px bg-gold-500" />
            <div className="w-2 h-2 rotate-45 border border-gold-500" />
            <div className="w-16 h-px bg-gold-500" />
          </div>

          {content.subtitle && (
            <p className="text-gold-400 text-lg tracking-[0.3em] uppercase mb-4 font-light">
              {content.subtitle}
            </p>
          )}

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-light tracking-wide mb-6">
            {content.headline}
          </h1>

          <p className="text-xl md:text-2xl text-cream-200 mb-8 tracking-wider">
            {formatDate(logistics.event_date, 'es-MX', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {/* Countdown - Essential usa estilo minimal */}
          {features.countdown?.enabled && (
            <div className="mt-12">
              <CountdownDisplay 
                config={{ 
                  ...features.countdown, 
                  style: tier === 'essential' ? 'minimal' : features.countdown.style 
                }} 
              />
            </div>
          )}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-20 px-4 bg-charcoal-900">
        <div className="max-w-3xl mx-auto text-center">
          {content.hosts && content.hosts.length > 0 && (
            <div className="mb-12">
              <p className="text-gold-400 text-sm tracking-[0.2em] uppercase mb-4">
                Con la bendición de
              </p>
              {content.hosts.map((host, index) => (
                <p key={index} className="text-cream-200 text-lg">
                  {host.name}
                  {host.relation && (
                    <span className="text-cream-400 text-sm ml-2">({host.relation})</span>
                  )}
                </p>
              ))}
            </div>
          )}

          <p className="text-xl md:text-2xl leading-relaxed text-cream-200 mb-12">
            {content.main_message}
          </p>

          {content.quote && (
            <blockquote className="border-l-2 border-gold-500 pl-6 text-left">
              <p className="text-cream-300 italic text-lg mb-2">&quot;{content.quote.text}&quot;</p>
              {content.quote.author && (
                <cite className="text-gold-400 text-sm not-italic">— {content.quote.author}</cite>
              )}
            </blockquote>
          )}
        </div>
      </section>

      {/* Photo Gallery - Fotos según tier */}
      {content.gallery_images && content.gallery_images.length > 0 && (
        <section className="py-20 px-4 bg-charcoal-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl text-center mb-16 text-gold-400">
              Nuestra Historia en Fotos
            </h2>
            <PhotoGallery
              tier={tier}
              images={content.gallery_images}
              styles={{
                imageClassName: 'border border-gold-500/10',
              }}
            />
          </div>
        </section>
      )}

      {/* Agenda Section (Pro/Premium only) */}
      <TierGate currentTier={tier} requiredFeature="agenda">
        <section className="py-20 px-4 bg-charcoal-950">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl text-center mb-16 text-gold-400">
              Agenda del Día
            </h2>
            <AgendaTimeline
              tier={tier}
              items={logistics.agenda}
              styles={{
                itemClassName: 'p-6 bg-charcoal-900/50 rounded-lg border border-gold-500/10',
                timeClassName: 'text-gold-500',
                titleClassName: 'text-cream-100',
              }}
            />
          </div>
        </section>
      </TierGate>

      {/* Venues Section */}
      {logistics.venues.length > 0 && (
        <section className="py-20 px-4 bg-charcoal-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl text-center mb-16 text-gold-400">
              Ubicación
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <VenueDisplay
                tier={tier}
                venues={logistics.venues}
                styles={{
                  cardClassName: 'p-6 bg-charcoal-950 rounded-xl border border-gold-500/10',
                  titleClassName: 'text-cream-100',
                  buttonClassName: 'border-gold-500 text-gold-400',
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Dress Code (Pro/Premium only) */}
      <TierGate currentTier={tier} requiredFeature="dress_code">
        {logistics.dress_code && (
          <section className="py-16 px-4 bg-charcoal-950">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-heading text-2xl text-gold-400 mb-4">Código de Vestimenta</h2>
              <p className="text-3xl font-heading text-cream-100 mb-4 capitalize">
                {logistics.dress_code.code.replace('-', ' ')}
              </p>
              {logistics.dress_code.description && (
                <p className="text-cream-400">{logistics.dress_code.description}</p>
              )}
              {logistics.dress_code.colors_to_avoid && (
                <p className="text-cream-500 text-sm mt-4">
                  Evitar colores: {logistics.dress_code.colors_to_avoid.join(', ')}
                </p>
              )}
            </div>
          </section>
        )}
      </TierGate>

      {/* Gift Section */}
      {features.gift_registry?.enabled && (
        <section className="py-20 px-4 bg-charcoal-900">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl text-center mb-8 text-gold-400">
              Mesa de Regalos
            </h2>
            <GiftSection
              tier={tier}
              registry={features.gift_registry}
              styles={{
                cardClassName: 'bg-charcoal-950 border-gold-500/10',
                buttonClassName: 'border-gold-500 text-gold-400',
              }}
            />
          </div>
        </section>
      )}

      {/* Logistics Guide (Premium only) */}
      <LogisticsGuide
        tier={tier}
        logistics={logistics}
        className="py-20 px-4 bg-charcoal-900"
        styles={{
          cardClassName: 'bg-charcoal-950 border-gold-500/10',
          titleClassName: 'text-gold-400',
        }}
      />

      {/* Guestbook (Premium only) */}
      <TierGate currentTier={tier} requiredFeature="guestbook">
        <section className="py-20 px-4 bg-charcoal-950">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl text-center mb-8 text-gold-400">
              Libro de Visitas
            </h2>
            <Guestbook
              tier={tier}
              invitationId={metadata.id}
              enabled={features.guestbook?.enabled}
              styles={{
                formClassName: 'bg-charcoal-900/50',
                entryClassName: 'bg-charcoal-900 border-gold-500/10',
                inputClassName: 'bg-charcoal-800 border-gold-500/20 text-cream-100',
              }}
            />
          </div>
        </section>
      </TierGate>

      {/* RSVP Section */}
      {features.rsvp.enabled && (
        <section className="py-20 px-4 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-gold-400 mb-6">
              Confirma tu Asistencia
            </h2>
            {features.rsvp.deadline && (
              <p className="text-cream-300 mb-8">
                Por favor confirma tu asistencia antes del{' '}
                {formatDate(features.rsvp.deadline, 'es-MX', {
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            )}
            <RSVPManager
              tier={tier}
              config={features.rsvp}
              metadata={metadata}
              whatsappMessage={features.social_sharing?.whatsapp_message}
              styles={{
                buttonClassName: 'bg-gold-500 text-charcoal-950 hover:bg-gold-400',
                inputClassName: 'bg-charcoal-800 border-gold-500/20 text-cream-100',
              }}
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 bg-black text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-8 h-px bg-gold-500/50" />
          <div className="w-1.5 h-1.5 rotate-45 border border-gold-500/50" />
          <div className="w-8 h-px bg-gold-500/50" />
        </div>
        {content.couple?.hashtag && (
          <p className="text-gold-400 text-sm">{content.couple.hashtag}</p>
        )}
        <p className="text-cream-600 text-xs mt-4">Creado con ♥ en Invita.me</p>
      </footer>
    </div>
  );
}
