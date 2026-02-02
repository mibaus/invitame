import { notFound } from 'next/navigation';
import { InvitationRenderer } from '@/components/engine';
import { createServerComponentClient } from '@/lib/supabase';
import type { InvitationSchema, ServiceTier, SkinId, EventType } from '@/types';
import type { Invitation } from '@/types/database';

// Mock data - fallback para desarrollo sin Supabase
import mockInvitation from '@/data/mock-invitation.json';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Transforma los datos de Supabase al formato InvitationSchema
 * El content de Supabase contiene TODO el objeto de la invitación
 */
function transformToInvitationSchema(dbInvitation: Invitation): InvitationSchema {
  // El campo content de Supabase contiene logistics, features y skin_config
  const content = dbInvitation.content as {
    headline: string;
    subtitle?: string;
    main_message: string;
    couple?: InvitationSchema['content']['couple'];
    hosts?: InvitationSchema['content']['hosts'];
    cover_image?: string;
    gallery_images?: string[];
    quote?: InvitationSchema['content']['quote'];
    logistics: InvitationSchema['logistics'];
    features: InvitationSchema['features'];
    skin_config?: InvitationSchema['skin_config'];
  };

  return {
    metadata: {
      id: dbInvitation.id,
      slug: dbInvitation.slug,
      tier: dbInvitation.tier as ServiceTier,
      skin_id: dbInvitation.skin_id as SkinId,
      event_type: dbInvitation.event_type as EventType,
      created_at: dbInvitation.created_at,
      updated_at: dbInvitation.updated_at,
      expires_at: dbInvitation.expires_at || undefined,
      is_active: dbInvitation.is_active,
      owner_id: dbInvitation.client_id || '',
      language: dbInvitation.language as 'es' | 'en',
    },
    content: {
      headline: content.headline,
      subtitle: content.subtitle,
      main_message: content.main_message,
      couple: content.couple,
      hosts: content.hosts,
      cover_image: content.cover_image || '',
      gallery_images: content.gallery_images,
      quote: content.quote,
    },
    logistics: content.logistics,
    features: content.features,
    skin_config: content.skin_config,
  };
}

/**
 * Obtiene la invitación desde Supabase (Server Component)
 */
async function getInvitation(slug: string): Promise<InvitationSchema | null> {
  // Verificar si las variables de entorno de Supabase están configuradas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si Supabase no está configurado, usar mock para desarrollo
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
    console.log('[Dev Mode] Supabase no configurado, usando mock data');
    if (slug === mockInvitation.metadata.slug || slug === 'demo') {
      return mockInvitation as InvitationSchema;
    }
    return null;
  }

  try {
    const supabase = createServerComponentClient();

    // Buscar invitación por slug
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.log(`[Supabase] Invitación no encontrada: ${slug}`);
      
      // Fallback a mock para demo
      if (slug === 'demo' || slug === mockInvitation.metadata.slug) {
        return mockInvitation as InvitationSchema;
      }
      return null;
    }

    // Incrementar contador de vistas (fire and forget)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.rpc as any)('increment_invitation_views', { invitation_slug: slug });

    return transformToInvitationSchema(data);
  } catch (error) {
    console.error('[Supabase] Error al obtener invitación:', error);
    
    // Fallback a mock en caso de error
    if (slug === 'demo' || slug === mockInvitation.metadata.slug) {
      return mockInvitation as InvitationSchema;
    }
    return null;
  }
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
