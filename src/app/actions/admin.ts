'use server';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('tu-proyecto'));
}

export interface PendingInvitation {
  id: string;
  slug: string;
  tier: string;
  skin_id: string;
  event_type: string;
  is_active: boolean;
  created_at: string;
  content: {
    headline?: string;
    cover_image?: string;
    couple?: {
      person1?: { name: string };
      person2?: { name: string };
    };
    logistics?: {
      event_date?: string;
    };
  };
  client?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
}

export async function getPendingInvitations(): Promise<{ 
  success: boolean; 
  data?: PendingInvitation[]; 
  error?: string 
}> {
  if (!isConfigured()) {
    return {
      success: true,
      data: [
        {
          id: 'demo-1',
          slug: 'draft-demo-123',
          tier: 'premium',
          skin_id: 'celestial-noir',
          event_type: 'wedding',
          is_active: false,
          created_at: new Date().toISOString(),
          content: {
            headline: 'María & Carlos',
            logistics: { event_date: '2025-06-15T18:00:00' },
          },
          client: {
            id: 'client-1',
            full_name: 'María García',
            email: 'maria@ejemplo.com',
            phone: '+54 11 1234 5678',
          },
        },
      ],
    };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('invitations')
      .select(`
        id,
        slug,
        tier,
        skin_id,
        event_type,
        is_active,
        created_at,
        content,
        clients:onboarding_client_id (
          id,
          full_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invitations:', error);
      return { success: false, error: error.message };
    }

    const invitations: PendingInvitation[] = (data || []).map((inv: any) => ({
      id: inv.id,
      slug: inv.slug,
      tier: inv.tier,
      skin_id: inv.skin_id,
      event_type: inv.event_type,
      is_active: inv.is_active,
      created_at: inv.created_at,
      content: inv.content || {},
      client: inv.clients ? {
        id: inv.clients.id,
        full_name: inv.clients.full_name,
        email: inv.clients.email,
        phone: inv.clients.phone,
      } : undefined,
    }));

    return { success: true, data: invitations };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'Error inesperado' };
  }
}

export async function activateInvitation(
  invitationId: string,
  newSlug: string
): Promise<{ success: boolean; error?: string }> {
  // Validate slug format
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(newSlug)) {
    return { 
      success: false, 
      error: 'El slug solo puede contener letras minúsculas, números y guiones' 
    };
  }

  if (!isConfigured()) {
    console.log('[Dev Mode] Activating invitation:', { invitationId, newSlug });
    return { success: true };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    // Check if slug is available
    const { data: existing } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', newSlug)
      .neq('id', invitationId)
      .single();

    if (existing) {
      return { success: false, error: 'Este slug ya está en uso' };
    }

    // Update invitation
    const { error } = await (supabase
      .from('invitations') as any)
      .update({
        slug: newSlug,
        is_active: true,
      })
      .eq('id', invitationId);

    if (error) {
      console.error('Error activating invitation:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'Error inesperado' };
  }
}

export async function deactivateInvitation(
  invitationId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured()) {
    console.log('[Dev Mode] Deactivating invitation:', invitationId);
    return { success: true };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    const { error } = await (supabase
      .from('invitations') as any)
      .update({ is_active: false })
      .eq('id', invitationId);

    if (error) {
      console.error('Error deactivating invitation:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'Error inesperado' };
  }
}

export async function deleteInvitation(
  invitationId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured()) {
    console.log('[Dev Mode] Deleting invitation:', invitationId);
    return { success: true };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', invitationId);

    if (error) {
      console.error('Error deleting invitation:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'Error inesperado' };
  }
}
