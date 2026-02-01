'use client';

import type { InvitationSchema } from '@/types';
import {
  TierGate,
  RSVPManager,
  VenueDisplay,
  GiftSection,
  AgendaTimeline,
  MusicPlayer,
  LogisticsGuide,
  Guestbook,
  CountdownDisplay,
} from '@/components/shared';

interface BaseLayoutProps {
  invitation: InvitationSchema;
  preview?: boolean;
  children?: React.ReactNode;
}

/**
 * BaseLayout - Provee la estructura base y componentes compartidos
 * 
 * Los layouts específicos (ClassicElegance, RoyalGold, etc.) 
 * solo definen el estilo visual, mientras que BaseLayout
 * maneja la lógica de qué secciones mostrar según el tier.
 */
export function BaseLayout({ invitation, preview, children }: BaseLayoutProps) {
  const { metadata, content, logistics, features } = invitation;
  const tier = metadata.tier;

  return (
    <>
      {/* Music Player - Flotante (Pro/Premium) */}
      <MusicPlayer
        tier={tier}
        config={features.music}
      />

      {/* El contenido específico del layout */}
      {children}
    </>
  );
}

/**
 * Secciones reutilizables que los layouts pueden importar
 * Cada una respeta automáticamente las restricciones del tier
 */

interface SectionProps {
  invitation: InvitationSchema;
  className?: string;
  styles?: Record<string, string>;
}

// Countdown Section
export function CountdownSection({ invitation, className, styles }: SectionProps) {
  const { features, metadata } = invitation;
  
  if (!features.countdown?.enabled) return null;

  // Essential: solo estilo minimal
  const countdownStyle = metadata.tier === 'essential' ? 'minimal' : features.countdown.style;

  return (
    <div className={className}>
      <CountdownDisplay
        config={{ ...features.countdown, style: countdownStyle }}
        className={styles?.countdown}
      />
    </div>
  );
}

// Venue Section
export function VenueSection({ invitation, className, styles }: SectionProps) {
  const { logistics, metadata } = invitation;

  return (
    <div className={className}>
      <VenueDisplay
        tier={metadata.tier}
        venues={logistics.venues}
        styles={{
          cardClassName: styles?.card,
          titleClassName: styles?.title,
          buttonClassName: styles?.button,
        }}
      />
    </div>
  );
}

// Agenda Section (Pro/Premium only)
export function AgendaSection({ invitation, className, styles }: SectionProps) {
  const { logistics, metadata } = invitation;

  return (
    <AgendaTimeline
      tier={metadata.tier}
      items={logistics.agenda}
      className={className}
      styles={{
        itemClassName: styles?.item,
        timeClassName: styles?.time,
        titleClassName: styles?.title,
      }}
    />
  );
}

// Gift Section
export function GiftSectionWrapper({ invitation, className, styles }: SectionProps) {
  const { features, metadata } = invitation;

  return (
    <GiftSection
      tier={metadata.tier}
      registry={features.gift_registry}
      className={className}
      styles={{
        cardClassName: styles?.card,
        buttonClassName: styles?.button,
      }}
    />
  );
}

// RSVP Section
export function RSVPSection({ invitation, className, styles }: SectionProps) {
  const { features, metadata } = invitation;

  return (
    <RSVPManager
      tier={metadata.tier}
      config={features.rsvp}
      metadata={metadata}
      whatsappMessage={features.social_sharing?.whatsapp_message}
      className={className}
      styles={{
        buttonClassName: styles?.button,
        formClassName: styles?.form,
        inputClassName: styles?.input,
      }}
    />
  );
}

// Logistics Guide (Premium only)
export function LogisticsSection({ invitation, className, styles }: SectionProps) {
  const { logistics, metadata } = invitation;

  return (
    <LogisticsGuide
      tier={metadata.tier}
      logistics={logistics}
      className={className}
      styles={{
        cardClassName: styles?.card,
        titleClassName: styles?.title,
      }}
    />
  );
}

// Guestbook (Premium only)
export function GuestbookSection({ invitation, className, styles }: SectionProps) {
  const { features, metadata } = invitation;

  return (
    <Guestbook
      tier={metadata.tier}
      invitationId={metadata.id}
      enabled={features.guestbook?.enabled}
      className={className}
      styles={{
        formClassName: styles?.form,
        entryClassName: styles?.entry,
        inputClassName: styles?.input,
      }}
    />
  );
}

// Dress Code Section (Pro/Premium)
export function DressCodeSection({ invitation, className }: SectionProps) {
  const { logistics, metadata } = invitation;
  
  // Essential no muestra dress code
  if (metadata.tier === 'essential') return null;
  if (!logistics.dress_code) return null;

  return (
    <div className={className}>
      <p className="text-sm uppercase tracking-widest opacity-60 mb-2">
        Código de Vestimenta
      </p>
      <p className="text-xl capitalize">
        {logistics.dress_code.code.replace('-', ' ')}
      </p>
      {logistics.dress_code.description && (
        <p className="text-sm opacity-70 mt-2">{logistics.dress_code.description}</p>
      )}
    </div>
  );
}
