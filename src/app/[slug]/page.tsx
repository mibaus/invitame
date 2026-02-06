import { notFound } from 'next/navigation';
import type { InvitationSchema, SkinId, EventType } from '@/types';
import type { Invitation } from '@/types/database';
import { MasterLayout } from '@/components/layouts/MasterLayout';
import { createServerComponentClient } from '@/lib/supabase';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const supabase = createServerComponentClient();

  // Fetch invitation data
  const { data: rawData, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !rawData) {
    notFound();
  }

  // Explicit cast to avoid type inference issues
  const invitation = rawData as unknown as Invitation;

  // Transform DB data to Schema
  // Note: Tier field is removed from DB schema interaction
  const invitationSchema: InvitationSchema = {
    metadata: {
      id: invitation.id,
      slug: invitation.slug,
      skin_id: invitation.skin_id as SkinId,
      event_type: invitation.event_type as EventType,
      created_at: invitation.created_at,
      updated_at: invitation.updated_at,
      expires_at: invitation.expires_at || undefined,
      is_active: invitation.is_active,
      owner_id: 'unknown', // not needed for display
      language: invitation.language as 'es' | 'en' | 'pt',
    },
    // Cast content carefully as database JSONB logic matches Schema
    content: invitation.content as any,
    logistics: invitation.content.logistics as any,
    features: invitation.content.features as any,
    skin_config: invitation.content.skin_config as any,
  };

  return (
    <MasterLayout
      invitation={invitationSchema}
      preview={resolvedSearchParams?.preview === 'true'}
    />
  );
}
