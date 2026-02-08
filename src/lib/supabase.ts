import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Variables de entorno (pueden no estar definidas durante build)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Verifica si Supabase está configurado
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('tu-proyecto'));
}

// Cliente singleton (lazy initialization)
let _supabase: SupabaseClient<Database> | null = null;

/**
 * Cliente Supabase para uso general (legacy)
 * Retorna null si no está configurado
 */
export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!_supabase) {
    _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Export para compatibilidad - usar getSupabase() en su lugar
export const supabase = null; // Deprecated: usar getSupabase()

/**
 * Cliente para Client Components (browser)
 * Usar en componentes con 'use client'
 */
export function createClientComponentClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase no está configurado. Retornando cliente nulo.');
    return null;
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Cliente para Server Components
 * Usar en componentes de servidor y Server Actions
 */
export function createServerComponentClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase no está configurado. Retornando cliente nulo.');
    return null;
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Cliente para Server Actions con cookies (SSR)
 */
export function createServerActionClient(cookieStore: {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options?: object) => void;
}) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options) {
        cookieStore.set(name, '', options);
      },
    },
  });
}

