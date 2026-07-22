import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getServiceClient } from '@/lib/supabase/server'

async function resolveTenantId() {
  const headerStore = await headers()
  const host = headerStore.get('x-tenant-host')
  if (!host) return null

  const supabase = getServiceClient()

  const { data: dominio } = await supabase
    .from('dominios')
    .select('tenant_id')
    .eq('host', host)
    .single()

  return dominio?.tenant_id ?? null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipoRegistro, ...dados } = body

    const tenantId = await resolveTenantId()
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 400 })
    }

    const tabela = tipoRegistro === 'vaga' ? 'vagas' : 'curriculos'

    try {
      const supabase = getServiceClient()
      const { error } = await supabase.from(tabela).insert({ ...dados, tenant_id: tenantId })
      if (error) console.error('Recrutamento insert error:', error)
    } catch (err) {
      console.error('Supabase indisponível:', err)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
