'use client'

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Singleton para o browser (anon key — respeita RLS)
let browserClient: SupabaseClient | null = null

export function getBrowserClient() {
  if (browserClient) return browserClient
  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
  return browserClient
}
