import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'

const FALLBACK_TENANT_ID = '00000000-0000-0000-0000-000000000001'

async function resolveTenantId() {
  if (!isSupabaseConfigured()) return FALLBACK_TENANT_ID

  const headerStore = await headers()
  const host = headerStore.get('x-tenant-host')
  if (!host) return FALLBACK_TENANT_ID

  try {
    const supabase = getPublicClient()

    const { data: dominio } = await supabase
      .from('dominios')
      .select('tenant_id')
      .eq('host', host)
      .single()

    return dominio?.tenant_id ?? FALLBACK_TENANT_ID
  } catch {
    return FALLBACK_TENANT_ID
  }
}

const txt = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '') || null

// Só os campos que o formulário pode preencher; o resto (ativa, tenant_id...) fica com o banco
function montarVaga(b: Record<string, unknown>) {
  return {
    titulo: txt(b.titulo, 200),
    funcao: txt(b.funcao, 100),
    empresa: txt(b.empresa, 200),
    tipo: txt(b.tipo, 50),
    local_vaga: txt(b.local_vaga ?? b.local, 200),
    salario: txt(b.salario, 100),
    contato: txt(b.contato, 200),
    descricao: txt(b.descricao, 4000),
  }
}

function montarCurriculo(b: Record<string, unknown>) {
  return {
    nome: txt(b.nome, 200),
    telefone: txt(b.telefone, 40),
    email: txt(b.email, 200),
    cidade: txt(b.cidade, 100),
    funcao: txt(b.funcao, 100),
    experiencia: txt(b.experiencia, 100),
    disponibilidade: txt(b.disponibilidade, 200),
    sobre: txt(b.sobre, 4000),
    portfolio: txt(b.portfolio, 300),
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const ehVaga = body?.tipoRegistro === 'vaga'
    const vaga = ehVaga ? montarVaga(body) : null
    const curriculo = ehVaga ? null : montarCurriculo(body)
    const dados = vaga ?? curriculo

    if (vaga ? !vaga.titulo : !curriculo?.nome) {
      return NextResponse.json({ error: vaga ? 'Título obrigatório' : 'Nome obrigatório' }, { status: 400 })
    }

    const tenantId = await resolveTenantId()
    const tabela = ehVaga ? 'vagas' : 'curriculos'

    const { error } = await getPublicClient().from(tabela).insert({ ...dados, tenant_id: tenantId })
    if (error) {
      console.error('Recrutamento insert error:', error)
      return NextResponse.json({ error: 'Não foi possível salvar' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Recrutamento erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
