import { NextResponse } from 'next/server'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Registra impressão/clique de banner.
 * Usa a chave anon: a policy "Insert publico banner_eventos" já autoriza
 * inserção anônima, então não há motivo para envolver o service role aqui.
 */
export async function POST(request: Request) {
  try {
    const { banner_id, tipo } = await request.json()

    if (typeof banner_id !== 'string' || !UUID_RE.test(banner_id)) {
      return NextResponse.json({ error: 'banner_id inválido' }, { status: 400 })
    }
    if (tipo !== 'impressao' && tipo !== 'clique') {
      return NextResponse.json({ error: 'tipo inválido' }, { status: 400 })
    }
    if (!isSupabaseConfigured()) return NextResponse.json({ success: true })

    const { error } = await getPublicClient()
      .from('banner_eventos')
      .insert({ banner_id, tipo })

    if (error) console.error('banner_eventos insert error:', error)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
