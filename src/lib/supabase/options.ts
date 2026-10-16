// Schema do Postgres onde ficam as tabelas do site. O projeto Supabase novo é
// compartilhado com outro sistema, então as tabelas do Sindibes vivem em "sindibes".
export const DB_SCHEMA = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || 'public'

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

export const DB_OPTIONS = { db: { schema: DB_SCHEMA } } as const
