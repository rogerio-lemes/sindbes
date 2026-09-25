import { NextResponse } from 'next/server'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { getTenant } from '@/lib/tenant'

/**
 * Registra o clique nos botões de download de app indicado pelo sindicato.
 * Usa a chave anon: a policy de insert público já autoriza, e aqui não há
 * motivo para rodar com privilégio total.
 */

const LOJAS = ['android', 'ios']

export async function POST(request: Request) {
  try {
    const { app, loja } = await request.json()

    if (typeof app !== 'string' || !app || app.length > 40) {
      return NextResponse.json({ error: 'app inválido' }, { status: 400 })
    }
    if (!LOJAS.includes(loja)) {
      return NextResponse.json({ error: 'loja inválida' }, { status: 400 })
    }
    if (!isSupabaseConfigured()) return NextResponse.json({ ok: true })

    const { id: tenantId } = await getTenant()
    const { error } = await getPublicClient()
      .from('app_cliques')
      .insert({ tenant_id: tenantId, app, loja })

    if (error) console.error('[app-clique] falha ao registrar:', error.message)
    return NextResponse.json({ ok: true })
  } catch {
    // Nunca atrapalhar o download: o clique segue mesmo se o registro falhar
    return NextResponse.json({ ok: true })
  }
}
