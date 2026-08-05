import { createClient, SupabaseClient } from '@supabase/supabase-js'

const DUMMY_URL = 'https://placeholder.supabase.co'
const DUMMY_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.placeholder'

function safeUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return (url && !url.includes('<')) ? url : DUMMY_URL
}

function safeServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return (key && !key.includes('<')) ? key : DUMMY_KEY
}

function safeAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return (key && !key.includes('<')) ? key : DUMMY_KEY
}

export function getServiceClient(): SupabaseClient {
  return createClient(safeUrl(), safeServiceKey())
}

export function getPublicClient(): SupabaseClient {
  return createClient(safeUrl(), safeAnonKey())
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && !url.includes('<') && !key.includes('<'))
}
