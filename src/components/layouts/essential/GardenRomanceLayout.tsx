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
 * GardenRomanceLayout - Skin Visual "Garden Romance"
 * 
 * FLEX MODE: Este skin soporta TODAS las secciones.
 * Las features visibles dependen del `tier` en metadata, no del skin.
 */
export function GardenRomanceLayout({ invitation }: LayoutProps) {
  const { metadata, content, logistics, features, skin_config } = invitation;
  const tier = metadata.tier;
  const colors = skin_config?.colors;

  return (
    <div
      className="min-h-screen bg-sage-50"
      style={{
        backgroundColor: colors?.background || '#f4f7f4',
        color: colors?.text_primary || '#2d3a2d',
      }}
    >
      {/* Hero with Floral Frame */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Decorative Corners */}
        <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-sage-400/50" />
        <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-sage-400/50" />
        <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-sage-400/50" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-sage-400/50" />

        <div className="text-center max-w-xl relative z-10">
          {/* Floral Divider Top */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-sage-400">❧</span>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-sage-400 to-transparent" />
            <span className="text-sage-400">✿</span>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-sage-400 to-transparent" />
            <span className="text-sage-400">❧</span>
          </div>

          {content.subtitle && (
            <p className="text-sage-600 text-sm tracking-[0.25em] uppercase mb-6 font-light">
              {content.subtitle}
            </p>
          )}

          <h1 className="font-heading text-5xl md:text-7xl text-sage-900 mb-6 leading-tight">
            {content.headline}
          </h1>

          {/* Date with Botanical Frame */}
          <div className="inline-block px-8 py-4 border border-sage-300 rounded-full bg-white/50 backdrop-blur-sm">
            <p className="text-sage-700 tracking-wider">
              {formatDate(logistics.event_date, 'es-MX', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Countdown */}
          {features.countdown?.enabled && (
            <div className="mt-14">
              <CountdownDisplay
                config={{ ...features.countdown, style: 'elegant' }}
                className="[&_*]:text-sage-800 [&_*]:border-sage-300"
              />
            </div>
          )}

          {/* Floral Divider Bottom */}
          <div className="flex items-center justify-center gap-3 mt-12">
            <span className="text-sage-400 text-2xl">⚘</span>
          </div>
        </div>
      </section>

      {/* Love Story Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Hosts */}
          {content.hosts && content.hosts.length > 0 && (
            <div className="text-center mb-12">
              <p className="text-sage-500 text-sm tracking-widest uppercase mb-4">
                Junto a sus familias
              </p>
              <div className="space-y-1">
                {content.hosts.map((host, index) => (
                  <p key={index} className="text-sage-700">
                    {host.name}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div className="text-center">
            <p className="text-xl md:text-2xl text-sage-800 leading-relaxed font-light">
              {content.main_message}
            </p>
          </div>

          {/* Quote in Botanical Frame */}
          {content.quote && (
            <div className="mt-16 p-8 bg-sage-50 rounded-2xl relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-sage-400 text-2xl">
                ❝
              </span>
              <p className="text-sage-700 italic text-center">{content.quote.text}</p>
              {content.quote.author && (
                <p className="text-sage-500 text-sm text-center mt-4">— {content.quote.author}</p>
              )}
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
            <h2 className="font-heading text-3xl text-sage-800 text-center mb-12">
              ✿ Nuestra Historia ✿
            </h2>
            <PhotoGallery
              tier={tier}
              images={content.gallery_images}
              styles={{
                imageClassName: 'rounded-2xl border border-sage-200',
              }}
            />
          </div>
        </section>
      )}

      {/* Agenda (Pro/Premium) */}
      <TierGate currentTier={tier} requiredFeature="agenda">
        <section className="py-20 px-6 bg-sage-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl text-sage-800 text-center mb-12">
              ✿ Itinerario ✿
            </h2>
            <AgendaTimeline
              tier={tier}
              items={logistics.agenda}
              styles={{
                itemClassName: 'p-6 bg-white rounded-2xl border border-sage-200',
                timeClassName: 'text-sage-500',
                titleClassName: 'text-sage-800',
              }}
            />
          </div>
        </section>
      </TierGate>

      {/* Venues */}
      {logistics.venues.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl text-sage-800 text-center mb-12">
              ❧ Lugares ❧
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <VenueDisplay
                tier={tier}
                venues={logistics.venues}
                styles={{
                  cardClassName: 'p-8 bg-sage-50 rounded-2xl border border-sage-200 text-center',
                  titleClassName: 'text-sage-800',
                  buttonClassName: 'border-sage-400 text-sage-700 hover:bg-sage-700 hover:text-white',
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Dress Code (Pro/Premium) */}
      <TierGate currentTier={tier} requiredFeature="dress_code">
        {logistics.dress_code && (
          <section className="py-16 px-6 bg-sage-100">
            <div className="max-w-lg mx-auto text-center">
              <p className="text-sage-500 text-xs tracking-widest uppercase mb-2">Vestimenta</p>
              <p className="text-sage-800 text-2xl font-heading capitalize">
                {logistics.dress_code.code.replace('-', ' ')}
              </p>
              {logistics.dress_code.description && (
                <p className="text-sage-600 mt-2">{logistics.dress_code.description}</p>
              )}
              {logistics.dress_code.colors_to_avoid && (
                <p className="text-sage-500 text-sm mt-3">
                  Favor de evitar: {logistics.dress_code.colors_to_avoid.join(', ')}
                </p>
              )}
            </div>
          </section>
        )}
      </TierGate>

      {/* Gift Section */}
      {features.gift_registry?.enabled && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl text-sage-800 text-center mb-8">
              ❧ Mesa de Regalos ❧
            </h2>
            <GiftSection
              tier={tier}
              registry={features.gift_registry}
              styles={{
                cardClassName: 'bg-sage-50 border-sage-200 rounded-2xl',
                buttonClassName: 'border-sage-400 text-sage-700',
              }}
            />
          </div>
        </section>
      )}

      {/* Logistics Guide (Premium) */}
      <LogisticsGuide
        tier={tier}
        logistics={logistics}
        className="py-20 px-6 bg-sage-50"
        styles={{
          cardClassName: 'bg-white border-sage-200 rounded-2xl',
          titleClassName: 'text-sage-700',
        }}
      />

      {/* Guestbook (Premium) */}
      <TierGate currentTier={tier} requiredFeature="guestbook">
        <section className="py-20 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl text-sage-800 text-center mb-8">
              ✿ Libro de Visitas ✿
            </h2>
            <Guestbook
              tier={tier}
              invitationId={metadata.id}
              enabled={features.guestbook?.enabled}
              styles={{
                formClassName: 'bg-sage-50 rounded-2xl',
                entryClassName: 'bg-sage-50 border-sage-200 rounded-xl',
                inputClassName: 'bg-white border-sage-200 text-sage-800 rounded-lg',
              }}
            />
          </div>
        </section>
      </TierGate>

      {/* RSVP */}
      {features.rsvp.enabled && (
        <section className="py-24 px-6 bg-sage-50">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-sage-400 text-3xl">✉</span>
            <h2 className="font-heading text-3xl text-sage-800 mt-4 mb-6">
              ¿Nos Acompañas?
            </h2>
            <p className="text-sage-600 mb-8">
              Confirma tu asistencia para preparar todo con cariño
            </p>
            <RSVPManager
              tier={tier}
              config={features.rsvp}
              metadata={metadata}
              whatsappMessage={features.social_sharing?.whatsapp_message}
              styles={{
                buttonClassName: 'bg-sage-700 hover:bg-sage-800 text-white',
                inputClassName: 'bg-white border-sage-200 text-sage-800 rounded-lg',
              }}
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-sage-100 text-center">
        <div className="flex items-center justify-center gap-2 text-sage-400 mb-4">
          <span>❧</span>
          <span>✿</span>
          <span>❧</span>
        </div>
        {content.couple?.hashtag && (
          <p className="text-sage-600 tracking-widest">{content.couple.hashtag}</p>
        )}
      </footer>
    </div>
  );
}
