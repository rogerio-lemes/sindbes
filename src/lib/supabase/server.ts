import { createClient } from '@supabase/supabase-js'

// Client com service role key — usar APENAS em Server Components e Route Handlers
// Nunca expor em client components
export function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Client com anon key — usar em Server Components para leitura pública (RLS)
export function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
