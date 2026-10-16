'use client'

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { DB_OPTIONS, SUPABASE_ANON_KEY } from './options'

// Singleton para o browser (anon key — respeita RLS)
let browserClient: SupabaseClient | null = null

export function getBrowserClient() {
  if (browserClient) return browserClient
  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_ANON_KEY || 'placeholder',
    DB_OPTIONS,
  ) as unknown as SupabaseClient
  return browserClient
}
