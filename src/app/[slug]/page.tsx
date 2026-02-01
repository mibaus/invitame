import { notFound } from 'next/navigation';
import { InvitationRenderer } from '@/components/engine';
import type { InvitationSchema } from '@/types';

// Mock data - en producción vendría de Supabase
import mockInvitation from '@/data/mock-invitation.json';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getInvitation(slug: string): Promise<InvitationSchema | null> {
  // TODO: Fetch from Supabase
  // const { data } = await supabase
  //   .from('invitations')
  //   .select('*')
  //   .eq('slug', slug)
  //   .eq('is_active', true)
  //   .single();

  // Mock: retornar datos de prueba si el slug coincide
  if (slug === mockInvitation.metadata.slug || slug === 'demo') {
    return mockInvitation as InvitationSchema;
  }

  return null;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const invitation = await getInvitation(slug);

  if (!invitation) {
    return { title: 'Invitación no encontrada' };
  }

  const { content, features } = invitation;

  return {
    title: content.headline,
    description: content.main_message,
    openGraph: {
      title: features.social_sharing?.og_title || content.headline,
      description: features.social_sharing?.og_description || content.main_message,
      images: features.social_sharing?.og_image ? [features.social_sharing.og_image] : [],
    },
  };
}

export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const invitation = await getInvitation(slug);

  if (!invitation) {
    notFound();
  }

  return <InvitationRenderer invitation={invitation} preview={false} />;
}
