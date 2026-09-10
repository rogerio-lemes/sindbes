import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServiceClient, isSupabaseConfigured } from '@/lib/supabase/server'

/**
 * Cadastro da chave da IA pelo painel.
 *
 * A chave entra por aqui e NUNCA é devolvida ao navegador: o GET informa apenas
 * se existe uma chave salva e as 4 últimas letras, para conferência.
 * A gravação usa a chave de serviço, que só existe no servidor.
 */

function clienteComToken(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  )
}

/** Confere se quem chamou é admin do tenant informado. */
async function autorizar(request: Request, tenantId: string) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return { ok: false, erro: 'Sessão não informada' }

  const sb = clienteComToken(token)
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return { ok: false, erro: 'Sessão inválida ou expirada' }

  // O perfil é lido com o próprio token: a policy só devolve o registro do usuário
  const { data: perfil } = await sb
    .from('perfis')
    .select('tenant_id, papel')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!perfil) return { ok: false, erro: 'Perfil não encontrado' }
  if (perfil.papel !== 'super_admin' && perfil.tenant_id !== tenantId) {
    return { ok: false, erro: 'Sem permissão neste site' }
  }
  return { ok: true, email: user.email ?? '' }
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configurada: false, motivo: 'banco-nao-configurado' })
  }

  const tenantId = new URL(request.url).searchParams.get('tenant_id')
  if (!tenantId) return NextResponse.json({ error: 'tenant_id ausente' }, { status: 400 })

  const auth = await autorizar(request, tenantId)
  if (!auth.ok) return NextResponse.json({ error: auth.erro }, { status: 401 })

  // Chave no ambiente do servidor tem prioridade e dispensa o banco
  const doAmbiente = process.env.ANTHROPIC_API_KEY
  if (doAmbiente && !doAmbiente.includes('<')) {
    return NextResponse.json({ configurada: true, origem: 'servidor', final: doAmbiente.slice(-4) })
  }

  try {
    const { data } = await getServiceClient()
      .from('integracoes_secretas')
      .select('chave_ia, atualizado_em, atualizado_por')
      .eq('tenant_id', tenantId)
      .maybeSingle()

    if (!data?.chave_ia) return NextResponse.json({ configurada: false })
    return NextResponse.json({
      configurada: true,
      origem: 'painel',
      final: data.chave_ia.slice(-4),
      atualizado_em: data.atualizado_em,
      atualizado_por: data.atualizado_por,
    })
  } catch {
    return NextResponse.json({ configurada: false, motivo: 'sem-chave-de-servico' })
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Banco de dados não configurado' }, { status: 400 })
  }

  const { tenant_id, chave } = await request.json()
  if (!tenant_id) return NextResponse.json({ error: 'tenant_id ausente' }, { status: 400 })

  const auth = await autorizar(request, tenant_id)
  if (!auth.ok) return NextResponse.json({ error: auth.erro }, { status: 401 })

  // Apagar: chave vazia remove o cadastro
  if (chave === '' || chave === null) {
    try {
      await getServiceClient().from('integracoes_secretas')
        .upsert({ tenant_id, chave_ia: null, atualizado_em: new Date().toISOString(), atualizado_por: auth.email })
      return NextResponse.json({ ok: true, removida: true })
    } catch {
      return NextResponse.json({ error: 'Não foi possível remover' }, { status: 500 })
    }
  }

  if (typeof chave !== 'string' || !chave.startsWith('sk-ant-') || chave.length < 40) {
    return NextResponse.json(
      { error: 'A chave não parece válida. Ela começa com "sk-ant-" e é bem longa.' },
      { status: 400 },
    )
  }

  // Testa a chave antes de salvar, para não guardar algo que não funciona
  try {
    const teste = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': chave,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'ok' }],
      }),
    })

    if (!teste.ok) {
      const detalhe = teste.status === 401
        ? 'A chave foi recusada pela Anthropic. Confira se copiou inteira.'
        : `A Anthropic respondeu com erro ${teste.status}.`
      return NextResponse.json({ error: detalhe }, { status: 400 })
    }
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível falar com a Anthropic para validar a chave.' },
      { status: 400 },
    )
  }

  try {
    const { error } = await getServiceClient().from('integracoes_secretas').upsert({
      tenant_id,
      chave_ia: chave,
      atualizado_em: new Date().toISOString(),
      atualizado_por: auth.email,
    })
    if (error) throw error
    return NextResponse.json({ ok: true, final: chave.slice(-4) })
  } catch {
    return NextResponse.json(
      { error: 'Chave validada, mas não foi possível salvar. Falta configurar a chave de serviço do banco no servidor.' },
      { status: 500 },
    )
  }
}
