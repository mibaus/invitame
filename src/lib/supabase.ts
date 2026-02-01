// TODO: Configurar Supabase client cuando se tengan las credenciales
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Placeholder export para evitar errores de importación
export const supabase = null;

export function getSupabaseClient() {
  // TODO: Implementar cuando se configure Supabase
  console.warn('Supabase client not configured yet');
  return null;
}
