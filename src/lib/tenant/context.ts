import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { SITE, COLORS } from '@/lib/constants'
import type { TenantWithConfig, TenantConfig } from './types'

const SINDIBES_FALLBACK: TenantWithConfig = {
  id: '00000000-0000-0000-0000-000000000001',
  slug: 'sindibes',
  nome: SITE.name,
  status: 'ativo',
  plano: 'profissional',
  config: {
    tenant_id: '00000000-0000-0000-0000-000000000001',
    nome: SITE.name,
    tagline: SITE.tagline,
    whatsapp: SITE.whatsapp,
    whatsapp_display: SITE.whatsappDisplay,
    phone: SITE.phone,
    email: SITE.email,
    endereco: SITE.address,
    cidade: 'Uberlândia',
    uf: 'MG',
    instagram: SITE.instagram,
    cnpj: null,
    horario: SITE.horario,
    google_maps_url: SITE.googleMapsUrl,
    lat: null,
    lng: null,
    cor_primaria: COLORS.primary,
    cor_primaria_dark: '#1E6E62',
    cor_secundaria: COLORS.secondary,
    cor_secundaria_dark: '#52406F',
    cor_accent: COLORS.accent,
    cor_text: COLORS.text,
    cor_bg_alt: COLORS.bgAlt,
    logo_url: '/images/logo.jpg',
    favicon_url: null,
    meta: {},
    atendente_nome: 'Wagner',
    atendente_foto_url: null,
  },
}

// Resolve o tenant a partir do header x-tenant-host injetado pelo middleware.
// Memoizado com React.cache() — executa no máximo 1x por request.
export const getTenant = cache(async (): Promise<TenantWithConfig> => {
  if (!isSupabaseConfigured()) {
    return SINDIBES_FALLBACK
  }

  const headerStore = await headers()
  const host = headerStore.get('x-tenant-host')

  if (!host) {
    const tenantSlug = headerStore.get('x-tenant-slug')
    if (tenantSlug) {
      return getTenantBySlug(tenantSlug)
    }
    return SINDIBES_FALLBACK
  }

  try {
    const supabase = getPublicClient()

    const { data: dominio } = await supabase
      .from('dominios')
      .select('tenant_id')
      .eq('host', host)
      .single()

    if (!dominio) {
      console.warn(`[tenant] Host não encontrado no banco: ${host} — usando fallback Sindibes`)
      return SINDIBES_FALLBACK
    }

    return getTenantById(dominio.tenant_id)
  } catch (err) {
    console.warn('[tenant] Erro ao consultar Supabase — usando fallback Sindibes:', err)
    return SINDIBES_FALLBACK
  }
})

async function getTenantById(tenantId: string): Promise<TenantWithConfig> {
  const supabase = getPublicClient()

  const [{ data: tenant }, { data: config }] = await Promise.all([
    supabase.from('tenants').select('*').eq('id', tenantId).eq('status', 'ativo').single(),
    supabase.from('tenant_config').select('*').eq('tenant_id', tenantId).single(),
  ])

  if (!tenant || !config) {
    console.warn(`[tenant] Tenant não encontrado ou inativo: ${tenantId} — usando fallback`)
    return SINDIBES_FALLBACK
  }

  return {
    ...tenant,
    config: config as TenantConfig,
  }
}

async function getTenantBySlug(slug: string): Promise<TenantWithConfig> {
  const supabase = getPublicClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'ativo')
    .single()

  if (!tenant) {
    console.warn(`[tenant] Slug não encontrado: ${slug} — usando fallback`)
    return SINDIBES_FALLBACK
  }

  return getTenantById(tenant.id)
}

// Helper: gera URL do WhatsApp a partir do config do tenant
export function tenantWhatsappUrl(config: TenantConfig, message: string): string {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`
}
