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
  LogisticsGuide,
  Guestbook,
  TierGate 
} from '@/components/shared';

interface LayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
}

/**
 * ROYAL GOLD - Pro Tier
 * 
 * Secciones disponibles en Pro:
 * - Hero con countdown (full styles)
 * - Mensaje principal
 * - Agenda ✓
 * - Ubicación con mapa embebido ✓
 * - Dress Code ✓
 * - Regalo completo ✓
 * - RSVP Formulario ✓
 * - Música de fondo ✓
 * 
 * NO incluye (Premium only):
 * - Logistics Guide
 * - Guestbook
 * - Spotify Playlist
 */
export function RoyalGoldLayout({ invitation }: LayoutProps) {
  const { metadata, content, logistics, features } = invitation;
  const tier = metadata.tier;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] font-[Montserrat]">
      {/* Hero - Palace Grandeur */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Ornate Background */}
        <div className="absolute inset-0 bg-[url('/patterns/damask.png')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#800020]/20 via-transparent to-[#800020]/20" />

        {/* Gold Frame Corners */}
        <div className="absolute top-8 left-8 w-32 h-32 border-l-4 border-t-4 border-[#FFD700]" />
        <div className="absolute top-8 right-8 w-32 h-32 border-r-4 border-t-4 border-[#FFD700]" />
        <div className="absolute bottom-8 left-8 w-32 h-32 border-l-4 border-b-4 border-[#FFD700]" />
        <div className="absolute bottom-8 right-8 w-32 h-32 border-r-4 border-b-4 border-[#FFD700]" />

        <div className="relative z-10 text-center max-w-3xl">
          {/* Crown Icon */}
          <div className="text-[#FFD700] text-4xl mb-6">👑</div>

          {content.subtitle && (
            <p className="text-[#FFD700] text-sm tracking-[0.4em] uppercase mb-6">
              {content.subtitle}
            </p>
          )}

          <h1 className="font-[Cinzel] text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]">
            {content.headline}
          </h1>

          {/* Ornate Divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#FFD700]" />
            <span className="text-[#FFD700] text-2xl">❖</span>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#FFD700]" />
          </div>

          <p className="text-xl text-[#f5f5f5]/90 tracking-wider">
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
                className="[&_*]:border-[#FFD700]/30 [&_span]:text-[#FFD700]"
              />
            </div>
          )}
        </div>
      </section>

      {/* Message - Velvet Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#800020] to-[#600018]">
        <div className="max-w-3xl mx-auto text-center">
          {content.hosts && content.hosts.length > 0 && (
            <div className="mb-12">
              <p className="text-[#FFD700] text-xs tracking-[0.3em] uppercase mb-4">
                Con el honor de sus familias
              </p>
              {content.hosts.map((host, index) => (
                <p key={index} className="text-[#f5f5f5]/90 text-lg">
                  {host.name}
                </p>
              ))}
            </div>
          )}

          <p className="text-xl md:text-2xl text-[#f5f5f5] leading-relaxed">
            {content.main_message}
          </p>

          {content.quote && (
            <div className="mt-16 p-8 bg-[#1a1a1a]/30 border border-[#FFD700]/30 rounded-lg">
              <p className="text-[#f5f5f5]/80 italic text-lg">&quot;{content.quote.text}&quot;</p>
              {content.quote.author && (
                <p className="text-[#FFD700] text-sm mt-4">— {content.quote.author}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Music Player (Pro/Premium) */}
      <MusicPlayer tier={tier} config={features.music} />

      {/* Agenda - Royal Timeline (Pro/Premium) */}
      <TierGate currentTier={tier} requiredFeature="agenda">
        <section className="py-24 px-6 bg-[#1a1a1a]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-[Cinzel] text-3xl text-center text-[#FFD700] mb-16">
              ❖ PROGRAMA ❖
            </h2>
            <AgendaTimeline
              tier={tier}
              items={logistics.agenda}
              styles={{
                itemClassName: 'p-6 bg-[#800020]/10 border-l-4 border-[#FFD700]',
                timeClassName: 'font-[Cinzel] text-[#FFD700]',
                titleClassName: 'font-[Cinzel] text-[#f5f5f5]',
              }}
            />
          </div>
        </section>
      </TierGate>

      {/* Venues */}
      <section className="py-24 px-6 bg-[#800020]/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[Cinzel] text-3xl text-center text-[#FFD700] mb-16">
            ❖ UBICACIONES ❖
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <VenueDisplay
              tier={tier}
              venues={logistics.venues}
              styles={{
                cardClassName: 'p-8 bg-[#1a1a1a] border-2 border-[#FFD700]/30 text-center',
                titleClassName: 'font-[Cinzel] text-[#FFD700]',
                buttonClassName: 'border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1a1a1a]',
              }}
            />
          </div>
        </div>
      </section>

      {/* Dress Code (Pro/Premium) */}
      <TierGate currentTier={tier} requiredFeature="dress_code">
        {logistics.dress_code && (
          <section className="py-16 px-6 bg-[#1a1a1a]">
            <div className="max-w-lg mx-auto text-center">
              <span className="text-[#FFD700] text-xs tracking-widest">CÓDIGO DE VESTIMENTA</span>
              <p className="font-[Cinzel] text-3xl text-[#f5f5f5] mt-4 capitalize">
                {logistics.dress_code.code.replace('-', ' ')}
              </p>
              {logistics.dress_code.description && (
                <p className="text-[#f5f5f5]/60 mt-2">{logistics.dress_code.description}</p>
              )}
            </div>
          </section>
        )}
      </TierGate>

      {/* Gift Section */}
      {features.gift_registry?.enabled && (
        <section className="py-24 px-6 bg-[#800020]/10">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-[Cinzel] text-3xl text-center text-[#FFD700] mb-8">
              ❖ MESA DE REGALOS ❖
            </h2>
            <GiftSection
              tier={tier}
              registry={features.gift_registry}
              styles={{
                cardClassName: 'bg-[#1a1a1a] border-[#FFD700]/20',
                buttonClassName: 'border-[#FFD700] text-[#FFD700]',
              }}
            />
          </div>
        </section>
      )}

      {/* Logistics Guide (Premium only) */}
      <LogisticsGuide
        tier={tier}
        logistics={logistics}
        className="py-24 px-6 bg-[#1a1a1a]"
        styles={{
          cardClassName: 'bg-[#800020]/10 border-[#FFD700]/20',
          titleClassName: 'text-[#FFD700]',
        }}
      />

      {/* Guestbook (Premium only) */}
      <TierGate currentTier={tier} requiredFeature="guestbook">
        <section className="py-24 px-6 bg-[#800020]/20">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-[Cinzel] text-3xl text-center text-[#FFD700] mb-8">
              ❖ LIBRO DE VISITAS ❖
            </h2>
            <Guestbook
              tier={tier}
              invitationId={metadata.id}
              enabled={features.guestbook?.enabled}
              styles={{
                formClassName: 'bg-[#1a1a1a]/50',
                entryClassName: 'bg-[#1a1a1a] border-[#FFD700]/20',
                inputClassName: 'bg-[#1a1a1a] border-[#FFD700]/20 text-[#f5f5f5]',
              }}
            />
          </div>
        </section>
      </TierGate>

      {/* RSVP */}
      {features.rsvp.enabled && (
        <section className="py-24 px-6 bg-gradient-to-b from-[#1a1a1a] to-[#800020]/30">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-[Cinzel] text-3xl text-[#FFD700] mb-8">
              Confirma tu Asistencia
            </h2>
            <RSVPManager
              tier={tier}
              config={features.rsvp}
              metadata={metadata}
              whatsappMessage={features.social_sharing?.whatsapp_message}
              styles={{
                buttonClassName: 'bg-[#FFD700] text-[#1a1a1a] hover:bg-[#ffec8b] font-[Cinzel]',
                formClassName: 'text-left',
                inputClassName: 'bg-[#1a1a1a] border-[#FFD700]/20 text-[#f5f5f5]',
              }}
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#1a1a1a] border-t border-[#FFD700]/20 text-center">
        <div className="text-[#FFD700] text-2xl mb-4">❖</div>
        {content.couple?.hashtag && (
          <p className="text-[#FFD700]/80 tracking-widest font-[Cinzel]">
            {content.couple.hashtag}
          </p>
        )}
      </footer>
    </div>
  );
}
