import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { P } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipoRegistro, ...dados } = body // tipoRegistro: 'curriculo' | 'vaga'

    const tabela = tipoRegistro === 'vaga' ? `${P}vagas` : `${P}curriculos`

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { error } = await supabase.from(tabela).insert(dados)
      if (error) console.error('Recrutamento insert error:', error)
    } catch (err) {
      console.error('Supabase indisponível:', err)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
