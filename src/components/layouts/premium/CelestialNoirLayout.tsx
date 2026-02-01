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
 * CELESTIAL NOIR - Premium Tier
 * 
 * FLEX MODE: Este skin soporta TODAS las secciones.
 * Las features visibles dependen del `tier` en metadata, no del skin.
 * 
 * Vibe: Místico, estrellas, elegancia nocturna
 * Typography: Tenor Sans / Montserrat
 * Palette: Negro profundo (#0a0a0f), Oro estelar (#d4af37), Violeta oscuro (#2d1b4e)
 */
export function CelestialNoirLayout({ invitation }: LayoutProps) {
  const { metadata, content, logistics, features } = invitation;
  const tier = metadata.tier;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-[Montserrat]">
      {/* Hero - Celestial Night Sky */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Starfield Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-[20%] right-[25%] w-0.5 h-0.5 bg-white/80 rounded-full animate-pulse delay-100" />
          <div className="absolute top-[35%] left-[40%] w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse delay-200" />
          <div className="absolute top-[15%] right-[10%] w-1 h-1 bg-white/70 rounded-full animate-pulse delay-300" />
          <div className="absolute top-[45%] left-[10%] w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-150" />
          <div className="absolute top-[60%] right-[35%] w-1 h-1 bg-[#d4af37]/80 rounded-full animate-pulse delay-250" />
          <div className="absolute bottom-[30%] left-[25%] w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[15%] w-1 h-1 bg-white rounded-full animate-pulse delay-200" />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b4e]/30 via-transparent to-[#2d1b4e]/30" />

        <div className="relative z-10 text-center max-w-3xl">
          {/* Moon/Star Icon */}
          <div className="text-[#d4af37] text-5xl mb-8">☽</div>

          {content.subtitle && (
            <p className="text-[#d4af37] text-sm tracking-[0.5em] uppercase mb-6 font-light">
              {content.subtitle}
            </p>
          )}

          <h1 className="font-[Tenor_Sans] text-5xl md:text-7xl lg:text-8xl font-normal mb-8 bg-gradient-to-r from-[#d4af37] via-white to-[#d4af37] bg-clip-text text-transparent">
            {content.headline}
          </h1>

          {/* Celestial Divider */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <span className="text-[#d4af37]/60">✦</span>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <span className="text-[#d4af37]">★</span>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <span className="text-[#d4af37]/60">✦</span>
          </div>

          <p className="text-white/80 text-xl tracking-wider">
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
                className="[&_*]:border-[#d4af37]/20 [&_*]:bg-[#2d1b4e]/30"
              />
            </div>
          )}
        </div>
      </section>

      {/* Message - Mystic Purple */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0f] via-[#2d1b4e]/40 to-[#0a0a0f]">
        <div className="max-w-3xl mx-auto text-center">
          {content.hosts && content.hosts.length > 0 && (
            <div className="mb-12">
              <p className="text-[#d4af37] text-xs tracking-[0.3em] uppercase mb-4">
                ✦ Con la bendición de ✦
              </p>
              {content.hosts.map((host, index) => (
                <p key={index} className="text-white/80 text-lg">{host.name}</p>
              ))}
            </div>
          )}

          <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
            {content.main_message}
          </p>

          {content.quote && (
            <div className="mt-16 p-8 bg-[#2d1b4e]/20 border border-[#d4af37]/20 rounded-lg">
              <span className="text-[#d4af37] text-2xl">☆</span>
              <p className="text-white/70 italic text-lg mt-4">&quot;{content.quote.text}&quot;</p>
              {content.quote.author && (
                <p className="text-[#d4af37] text-sm mt-4">— {content.quote.author}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Music Player (Pro/Premium) */}
      <MusicPlayer tier={tier} config={features.music} />

      {/* Photo Gallery */}
      {content.gallery_images && content.gallery_images.length > 0 && (
        <section className="py-24 px-6 bg-[#0a0a0f]">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-[Tenor_Sans] text-4xl text-center text-[#d4af37] mb-16">
              ✦ Nuestra Historia ✦
            </h2>
            <PhotoGallery
              tier={tier}
              images={content.gallery_images}
              styles={{
                imageClassName: 'border border-[#d4af37]/20 rounded-lg',
              }}
            />
          </div>
        </section>
      )}

      {/* Agenda - Constellation Style (Pro/Premium) */}
      <TierGate currentTier={tier} requiredFeature="agenda">
        <section className="py-24 px-6 bg-[#0a0a0f]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-[Tenor_Sans] text-4xl text-center text-[#d4af37] mb-16">
              ☽ Itinerario Celestial ☽
            </h2>
            <AgendaTimeline
              tier={tier}
              items={logistics.agenda}
              styles={{
                itemClassName: 'p-6 bg-[#2d1b4e]/20 border border-[#d4af37]/20 rounded-lg',
                timeClassName: 'font-[Tenor_Sans] text-[#d4af37]',
                titleClassName: 'font-[Tenor_Sans] text-white',
              }}
            />
          </div>
        </section>
      </TierGate>

      {/* Venues - Night Cards */}
      {logistics.venues.length > 0 && (
        <section className="py-24 px-6 bg-[#2d1b4e]/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-[Tenor_Sans] text-4xl text-center text-[#d4af37] mb-16">
              ✦ Ubicaciones ✦
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <VenueDisplay
                tier={tier}
                venues={logistics.venues}
                styles={{
                  cardClassName: 'p-8 bg-[#0a0a0f]/80 border border-[#d4af37]/20 rounded-lg text-center backdrop-blur-sm',
                  titleClassName: 'font-[Tenor_Sans] text-white',
                  buttonClassName: 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0f]',
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Dress Code (Pro/Premium) */}
      <TierGate currentTier={tier} requiredFeature="dress_code">
        {logistics.dress_code && (
          <section className="py-16 px-6 bg-[#0a0a0f]">
            <div className="max-w-lg mx-auto text-center">
              <span className="text-[#d4af37]">✦</span>
              <p className="text-[#d4af37] text-xs tracking-widest uppercase mt-2">Código de Vestimenta</p>
              <p className="font-[Tenor_Sans] text-3xl text-white mt-4 capitalize">
                {logistics.dress_code.code.replace('-', ' ')}
              </p>
              {logistics.dress_code.description && (
                <p className="text-white/60 mt-2">{logistics.dress_code.description}</p>
              )}
            </div>
          </section>
        )}
      </TierGate>

      {/* Gift Section */}
      {features.gift_registry?.enabled && (
        <section className="py-24 px-6 bg-[#2d1b4e]/10">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-[Tenor_Sans] text-4xl text-center text-[#d4af37] mb-8">
              ✦ Mesa de Regalos ✦
            </h2>
            <GiftSection
              tier={tier}
              registry={features.gift_registry}
              styles={{
                cardClassName: 'bg-[#0a0a0f]/80 border-[#d4af37]/20',
                buttonClassName: 'border-[#d4af37] text-[#d4af37]',
              }}
            />
          </div>
        </section>
      )}

      {/* Logistics Guide (Premium) */}
      <LogisticsGuide
        tier={tier}
        logistics={logistics}
        className="py-24 px-6 bg-[#0a0a0f]"
        styles={{
          cardClassName: 'bg-[#2d1b4e]/20 border-[#d4af37]/20',
          titleClassName: 'text-[#d4af37]',
        }}
      />

      {/* Guestbook (Premium) */}
      <TierGate currentTier={tier} requiredFeature="guestbook">
        <section className="py-24 px-6 bg-[#2d1b4e]/20">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-[Tenor_Sans] text-4xl text-center text-[#d4af37] mb-8">
              ☆ Libro de Visitas ☆
            </h2>
            <Guestbook
              tier={tier}
              invitationId={metadata.id}
              enabled={features.guestbook?.enabled}
              styles={{
                formClassName: 'bg-[#0a0a0f]/50',
                entryClassName: 'bg-[#0a0a0f] border-[#d4af37]/20',
                inputClassName: 'bg-[#0a0a0f] border-[#d4af37]/20 text-white',
              }}
            />
          </div>
        </section>
      </TierGate>

      {/* RSVP */}
      {features.rsvp.enabled && (
        <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0f] to-[#2d1b4e]/30">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-5xl">☽</span>
            <h2 className="font-[Tenor_Sans] text-3xl text-[#d4af37] mt-6 mb-8">
              Confirma tu Presencia
            </h2>
            <RSVPManager
              tier={tier}
              config={features.rsvp}
              metadata={metadata}
              whatsappMessage={features.social_sharing?.whatsapp_message}
              styles={{
                buttonClassName: 'bg-gradient-to-r from-[#d4af37] to-[#b8960b] text-[#0a0a0f] hover:from-[#e5c04a] hover:to-[#d4af37]',
                inputClassName: 'bg-[#0a0a0f] border-[#d4af37]/20 text-white',
              }}
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0a0a0f] border-t border-[#d4af37]/10 text-center">
        <div className="flex items-center justify-center gap-3 text-[#d4af37]/60 mb-4">
          <span>✦</span>
          <span>☆</span>
          <span>☽</span>
          <span>☆</span>
          <span>✦</span>
        </div>
        {content.couple?.hashtag && (
          <p className="text-[#d4af37] tracking-widest font-[Tenor_Sans]">
            {content.couple.hashtag}
          </p>
        )}
      </footer>
    </div>
  );
}
