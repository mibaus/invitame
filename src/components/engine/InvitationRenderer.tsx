'use client';

import { useMemo } from 'react';
import type { InvitationSchema, SkinId, ServiceTier } from '@/types';

// Essential Tier Layouts
import { ClassicEleganceLayout } from '@/components/layouts/essential/ClassicEleganceLayout';
import { MinimalChicLayout } from '@/components/layouts/essential/MinimalChicLayout';
import { GardenRomanceLayout } from '@/components/layouts/essential/GardenRomanceLayout';

// Pro Tier Layouts
import { ModernLuxeLayout } from '@/components/layouts/pro/ModernLuxeLayout';
import { RoyalGoldLayout } from '@/components/layouts/pro/RoyalGoldLayout';
import { BotanicalDreamLayout } from '@/components/layouts/pro/BotanicalDreamLayout';

// Premium Tier Layouts
import { CelestialNoirLayout } from '@/components/layouts/premium/CelestialNoirLayout';
import { RenaissanceOpulenceLayout } from '@/components/layouts/premium/RenaissanceOpulenceLayout';
import { BespokeCoutureLayout } from '@/components/layouts/premium/BespokeCoutureLayout';

interface InvitationRendererProps {
  invitation: InvitationSchema;
  preview?: boolean;
}

type LayoutComponent = React.ComponentType<{ invitation: InvitationSchema; preview?: boolean }>;

const SKIN_LAYOUTS: Record<SkinId, LayoutComponent> = {
  // Essential Tier
  'classic-elegance': ClassicEleganceLayout,
  'minimal-chic': MinimalChicLayout,
  'garden-romance': GardenRomanceLayout,
  // Pro Tier
  'modern-luxe': ModernLuxeLayout,
  'royal-gold': RoyalGoldLayout,
  'botanical-dream': BotanicalDreamLayout,
  // Premium Tier
  'celestial-noir': CelestialNoirLayout,
  'renaissance-opulence': RenaissanceOpulenceLayout,
  'bespoke-couture': BespokeCoutureLayout,
};

const TIER_LABELS: Record<ServiceTier, string> = {
  essential: 'Essential',
  pro: 'Pro',
  premium: 'Premium',
};

export function InvitationRenderer({ invitation, preview = false }: InvitationRendererProps) {
  const { metadata } = invitation;

  const LayoutComponent = useMemo(() => {
    return SKIN_LAYOUTS[metadata.skin_id] || ClassicEleganceLayout;
  }, [metadata.skin_id]);

  return (
    <div className="invitation-wrapper" data-tier={metadata.tier} data-skin={metadata.skin_id}>
      {preview && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          {TIER_LABELS[metadata.tier]} • {metadata.skin_id}
        </div>
      )}
      <LayoutComponent invitation={invitation} preview={preview} />
    </div>
  );
}

export default InvitationRenderer;
