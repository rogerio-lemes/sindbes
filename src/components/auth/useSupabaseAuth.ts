'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getBrowserClient } from '@/lib/supabase/browser'

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getBrowserClient()
    sb.auth.getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => {})
      .finally(() => setLoading(false))

    const { data } = sb.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await getBrowserClient().auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }, [])

  const sendRecovery = useCallback(async (email: string, redirectTo: string) => {
    const { error } = await getBrowserClient().auth.resetPasswordForEmail(email, { redirectTo })
    return error?.message ?? null
  }, [])

  const signOut = useCallback(async () => {
    await getBrowserClient().auth.signOut()
    setSession(null)
  }, [])

  return { session, loading, signIn, sendRecovery, signOut }
}
