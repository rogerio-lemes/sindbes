import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPublicClient } from '@/lib/supabase/server'
import type { TenantWithConfig, TenantConfig } from './types'

// Resolve o tenant a partir do header x-tenant-host injetado pelo middleware.
// Memoizado com React.cache() — executa no máximo 1x por request.
export const getTenant = cache(async (): Promise<TenantWithConfig> => {
  const headerStore = await headers()
  const host = headerStore.get('x-tenant-host')

  if (!host) {
    // Fallback: em dev sem middleware, tenta query param via cookie
    const tenantSlug = headerStore.get('x-tenant-slug')
    if (tenantSlug) {
      return getTenantBySlug(tenantSlug)
    }
    console.error('[tenant] Nenhum x-tenant-host encontrado')
    notFound()
  }

  const supabase = getPublicClient()

  // Buscar domínio → tenant → config
  const { data: dominio } = await supabase
    .from('dominios')
    .select('tenant_id')
    .eq('host', host)
    .single()

  if (!dominio) {
    console.error(`[tenant] Host não encontrado: ${host}`)
    notFound()
  }

  return getTenantById(dominio.tenant_id)
})

// Buscar tenant por ID (interno)
async function getTenantById(tenantId: string): Promise<TenantWithConfig> {
  const supabase = getPublicClient()

  const [{ data: tenant }, { data: config }] = await Promise.all([
    supabase.from('tenants').select('*').eq('id', tenantId).eq('status', 'ativo').single(),
    supabase.from('tenant_config').select('*').eq('tenant_id', tenantId).single(),
  ])

  if (!tenant || !config) {
    console.error(`[tenant] Tenant não encontrado ou inativo: ${tenantId}`)
    notFound()
  }

  return {
    ...tenant,
    config: config as TenantConfig,
  }
}

// Buscar tenant por slug (para dev com ?tenant=slug)
async function getTenantBySlug(slug: string): Promise<TenantWithConfig> {
  const supabase = getPublicClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'ativo')
    .single()

  if (!tenant) {
    console.error(`[tenant] Slug não encontrado: ${slug}`)
    notFound()
  }

  return getTenantById(tenant.id)
}

// Helper: gera URL do WhatsApp a partir do config do tenant
export function tenantWhatsappUrl(config: TenantConfig, message: string): string {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`
}
