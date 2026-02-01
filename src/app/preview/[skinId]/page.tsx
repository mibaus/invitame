import { notFound } from 'next/navigation';
import { InvitationRenderer } from '@/components/engine';
import type { InvitationSchema, SkinId } from '@/types';
import mockInvitation from '@/data/mock-invitation.json';
import Link from 'next/link';
import { PreviewNavbar } from './PreviewNavbar';

const VALID_SKINS: SkinId[] = [
  'classic-elegance',
  'minimal-chic',
  'garden-romance',
  'modern-luxe',
  'royal-gold',
  'botanical-dream',
  'celestial-noir',
  'renaissance-opulence',
  'bespoke-couture',
];

interface PageProps {
  params: Promise<{ skinId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { skinId } = await params;
  return {
    title: `Preview: ${skinId} | Invita.me`,
  };
}

export default async function SkinPreviewPage({ params }: PageProps) {
  const { skinId } = await params;

  if (!VALID_SKINS.includes(skinId as SkinId)) {
    notFound();
  }

  // Clone mock invitation and override skin_id
  const previewInvitation: InvitationSchema = {
    ...(mockInvitation as InvitationSchema),
    metadata: {
      ...(mockInvitation as InvitationSchema).metadata,
      skin_id: skinId as SkinId,
    },
  };

  return (
    <div className="relative">
      {/* Navigation Bar - Client Component */}
      <PreviewNavbar currentSkin={skinId} />

      {/* Invitation Preview */}
      <div className="pt-12">
        <InvitationRenderer invitation={previewInvitation} preview={true} />
      </div>
    </div>
  );
}
