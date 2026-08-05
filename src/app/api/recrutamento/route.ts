import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getServiceClient, isSupabaseConfigured } from '@/lib/supabase/server'

const FALLBACK_TENANT_ID = '00000000-0000-0000-0000-000000000001'

async function resolveTenantId() {
  if (!isSupabaseConfigured()) return FALLBACK_TENANT_ID

  const headerStore = await headers()
  const host = headerStore.get('x-tenant-host')
  if (!host) return FALLBACK_TENANT_ID

  try {
    const supabase = getServiceClient()

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
