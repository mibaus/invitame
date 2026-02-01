'use client';

import type { InvitationSchema } from '@/types';
import { formatDate } from '@/lib/utils';
import { 
  CountdownDisplay, 
  LuxuryButton, 
  RSVPManager, 
  VenueDisplay, 
  GiftSection, 
  AgendaTimeline, 
  MusicPlayer, 
  TierGate, 
  PhotoGallery, 
  LogisticsGuide, 
  Guestbook 
} from '@/components/shared';

interface LayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
}

/**
 * MinimalChicLayout - Skin Visual "Minimal Chic"
 * 
 * FLEX MODE: Este skin soporta TODAS las secciones.
 * Las features visibles dependen del `tier` en metadata, no del skin.
 */
export function MinimalChicLayout({ invitation }: LayoutProps) {
  const { metadata, content, logistics, features, skin_config } = invitation;
  const tier = metadata.tier;
  const colors = skin_config?.colors;

  return (
    <div
      className="min-h-screen bg-cream-50"
      style={{
        backgroundColor: colors?.background || '#fdfbf7',
        color: colors?.text_primary || '#1a1a1a',
      }}
    >
      {/* Hero - Minimal */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-lg">
          {content.subtitle && (
            <p className="text-charcoal-500 text-sm tracking-[0.4em] uppercase mb-8">
              {content.subtitle}
            </p>
          )}

          <h1 className="font-heading text-6xl md:text-8xl font-light text-charcoal-900 mb-8 leading-none">
            {content.headline}
          </h1>

          <div className="w-12 h-px bg-charcoal-300 mx-auto mb-8" />

          <p className="text-charcoal-600 text-lg tracking-wide">
            {formatDate(logistics.event_date, 'es-MX', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          {features.countdown?.enabled && (
            <div className="mt-16">
              <CountdownDisplay
                config={{ ...features.countdown, style: 'minimal' }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Message - Clean Lines */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl text-charcoal-700 leading-relaxed text-center font-light">
            {content.main_message}
          </p>

          {content.quote && (
            <div className="mt-16 text-center">
              <p className="text-charcoal-500 italic">&quot;{content.quote.text}&quot;</p>
            </div>
          )}
        </div>
      </section>

      {/* Music Player (Pro/Premium) */}
      <MusicPlayer tier={tier} config={features.music} />

      {/* Photo Gallery */}
      {content.gallery_images && content.gallery_images.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs tracking-[0.3em] text-charcoal-400 uppercase mb-12 text-center">
              Nuestra Historia
            </p>
            <PhotoGallery
              tier={tier}
              images={content.gallery_images}
              styles={{
                imageClassName: 'border border-charcoal-200',
              }}
            />
          </div>
        </section>
      )}

      {/* Agenda (Pro/Premium) */}
      <TierGate currentTier={tier} requiredFeature="agenda">
        <section className="py-20 px-6 bg-cream-50">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs tracking-[0.3em] text-charcoal-400 uppercase mb-12 text-center">
              Itinerario
            </p>
            <AgendaTimeline
              tier={tier}
              items={logistics.agenda}
              styles={{
                itemClassName: 'p-6 bg-white rounded-lg border border-charcoal-100',
                timeClassName: 'text-charcoal-500',
                titleClassName: 'text-charcoal-800',
              }}
            />
          </div>
        </section>
      </TierGate>

      {/* Venues */}
      {logistics.venues.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs tracking-[0.3em] text-charcoal-400 uppercase mb-12 text-center">
              Ubicación
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <VenueDisplay
                tier={tier}
                venues={logistics.venues}
                styles={{
                  cardClassName: 'p-6 bg-cream-50 rounded-lg border border-charcoal-100 text-center',
                  titleClassName: 'text-charcoal-800',
                  buttonClassName: 'border-charcoal-300 text-charcoal-700',
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Dress Code (Pro/Premium) */}
      <TierGate currentTier={tier} requiredFeature="dress_code">
        {logistics.dress_code && (
          <section className="py-16 px-6 bg-cream-50">
            <div className="max-w-lg mx-auto text-center">
              <p className="text-xs tracking-[0.3em] text-charcoal-400 uppercase mb-4">
                Vestimenta
              </p>
              <p className="text-2xl font-heading text-charcoal-800 capitalize">
                {logistics.dress_code.code.replace('-', ' ')}
              </p>
              {logistics.dress_code.description && (
                <p className="text-charcoal-500 mt-2">{logistics.dress_code.description}</p>
              )}
            </div>
          </section>
        )}
      </TierGate>

      {/* Gift Section */}
      {features.gift_registry?.enabled && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.3em] text-charcoal-400 uppercase mb-8 text-center">
              Mesa de Regalos
            </p>
            <GiftSection
              tier={tier}
              registry={features.gift_registry}
              styles={{
                cardClassName: 'bg-cream-50 border-charcoal-100',
                buttonClassName: 'border-charcoal-300 text-charcoal-700',
              }}
            />
          </div>
        </section>
      )}

      {/* Logistics Guide (Premium) */}
      <LogisticsGuide
        tier={tier}
        logistics={logistics}
        className="py-20 px-6 bg-cream-50"
        styles={{
          cardClassName: 'bg-white border-charcoal-100',
          titleClassName: 'text-charcoal-700',
        }}
      />

      {/* Guestbook (Premium) */}
      <TierGate currentTier={tier} requiredFeature="guestbook">
        <section className="py-20 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.3em] text-charcoal-400 uppercase mb-8 text-center">
              Libro de Visitas
            </p>
            <Guestbook
              tier={tier}
              invitationId={metadata.id}
              enabled={features.guestbook?.enabled}
              styles={{
                formClassName: 'bg-cream-50',
                entryClassName: 'bg-cream-50 border-charcoal-100',
                inputClassName: 'bg-white border-charcoal-200 text-charcoal-800',
              }}
            />
          </div>
        </section>
      </TierGate>

      {/* RSVP */}
      {features.rsvp.enabled && (
        <section className="py-20 px-6 bg-cream-50">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] text-charcoal-400 uppercase mb-6">
              Confirmar Asistencia
            </p>
            {features.rsvp.deadline && (
              <p className="text-charcoal-500 text-sm mb-8">
                Antes del{' '}
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
                buttonClassName: 'border-charcoal-300 text-charcoal-700 hover:bg-charcoal-900 hover:text-white',
                inputClassName: 'bg-white border-charcoal-200 text-charcoal-800',
              }}
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-cream-50 text-center border-t border-charcoal-100">
        {content.couple?.hashtag && (
          <p className="text-charcoal-400 text-sm tracking-widest">
            {content.couple.hashtag}
          </p>
        )}
      </footer>
    </div>
  );
}
