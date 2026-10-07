import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '@/lib/supabase/server'
import { getTenant } from '@/lib/tenant'

/**
 * Atualiza na hora as páginas públicas de um parceiro ou associado.
 *
 * O painel chama esta rota logo depois de aprovar, editar ou tirar do ar um
 * cadastro. Sem ela a mudança aparece sozinha em até 1 minuto; com ela,
 * aparece no próximo acesso.
 *
 * Corpo: { tipo: 'parceiro' | 'associado', slug: string, tenant_id?: string }
 * Cabeçalho: Authorization: Bearer <token da sessão do admin>
 */

function clienteComToken(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  )
}

/** Confere se quem chamou é admin do tenant informado (mesmo padrão de /api/admin/chave-ia). */
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

const ROTA_BASE = { parceiro: '/parceiros', associado: '/associados' } as const

/** Slug precisa ser um trecho simples de URL (sem barra, interrogação ou cerquilha). */
function slugValido(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.trim().length > 0 && slug.length <= 200 && !/[\/?#\s]/.test(slug)
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Banco de dados não configurado' }, { status: 400 })
  }

  let corpo: { tipo?: unknown; slug?: unknown; tenant_id?: unknown }
  try {
    corpo = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
  }

  const { tipo, slug } = corpo
  if (tipo !== 'parceiro' && tipo !== 'associado') {
    return NextResponse.json({ error: 'tipo deve ser "parceiro" ou "associado"' }, { status: 400 })
  }
  if (!slugValido(slug)) {
    return NextResponse.json({ error: 'slug inválido' }, { status: 400 })
  }

  // O painel pode informar o tenant; se não informar, vale o site atual
  const tenantId = typeof corpo.tenant_id === 'string' && corpo.tenant_id
    ? corpo.tenant_id
    : (await getTenant()).id

  const auth = await autorizar(request, tenantId)
  if (!auth.ok) return NextResponse.json({ error: auth.erro }, { status: 401 })

  const base = ROTA_BASE[tipo]
  revalidatePath(`${base}/${slug}`)  // página individual
  revalidatePath(base)               // listagem
  revalidatePath('/')                // home (slider de parceiros)

  return NextResponse.json({ ok: true })
}
