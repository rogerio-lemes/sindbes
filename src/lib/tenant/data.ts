import { cache } from 'react'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { SERVICES } from '@/lib/constants'
import type {
  TenantConfig, Servico, Associado, Evento,
  Parceiro, MembroDiretoria, Curriculo, Vaga,
} from './types'

// ========================================
// Funções de leitura por tenant (server-side)
// Todas cacheadas com React.cache() por request
// ========================================

const TENANT_FALLBACK_ID = '00000000-0000-0000-0000-000000000001'

/**
 * Serviços do template, usados quando o Supabase não está acessível.
 * Sem isto o site fica sem nenhuma página de serviço (todas dariam 404),
 * mesmo com o conteúdo completo já existindo em service-content.ts.
 */
const SERVICOS_FALLBACK: Servico[] = SERVICES.map((s, i) => ({
  id: `fallback-${s.slug}`,
  tenant_id: TENANT_FALLBACK_ID,
  nome: s.nome,
  slug: s.slug,
  seo_title: s.seoTitle,
  seo_description: s.seoDescription,
  descricao: null,
  imagem_url: null,
  ordem: i + 1,
  ativo: true,
}))

// Config
export const getConfig = cache(async (tenantId: string): Promise<TenantConfig | null> => {
  const { data } = await getPublicClient()
    .from('tenant_config')
    .select('*')
    .eq('tenant_id', tenantId)
    .single()
  return data as TenantConfig | null
})

// Serviços
export const getServicos = cache(async (tenantId: string): Promise<Servico[]> => {
  if (!isSupabaseConfigured()) return SERVICOS_FALLBACK

  const { data, error } = await getPublicClient()
    .from('servicos')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('ativo', true)
    .order('ordem', { ascending: true })

  // Falha de conexão/credencial não pode derrubar as páginas de serviço
  if (error) {
    console.error('[servicos] falha ao consultar Supabase:', error.message)
    return tenantId === TENANT_FALLBACK_ID ? SERVICOS_FALLBACK : []
  }
  return (data || []) as Servico[]
})

export const getServicoPorSlug = cache(async (tenantId: string, slug: string): Promise<Servico | null> => {
  if (!isSupabaseConfigured()) {
    return SERVICOS_FALLBACK.find((s) => s.slug === slug) ?? null
  }

  const { data, error } = await getPublicClient()
    .from('servicos')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('[servicos] falha ao consultar Supabase:', error.message)
    return tenantId === TENANT_FALLBACK_ID
      ? SERVICOS_FALLBACK.find((s) => s.slug === slug) ?? null
      : null
  }
  return data as Servico | null
})

// Associados
export const getAssociados = cache(async (tenantId: string): Promise<Associado[]> => {
  const { data } = await getPublicClient()
    .from('associados')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('ativo', true)
    .order('destaque', { ascending: false })
  return (data || []) as Associado[]
})

export const getAssociadoPorSlug = cache(async (tenantId: string, slug: string): Promise<Associado | null> => {
  const { data } = await getPublicClient()
    .from('associados')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .single()
  return data as Associado | null
})

// Eventos
export const getEventos = cache(async (tenantId: string): Promise<Evento[]> => {
  const { data } = await getPublicClient()
    .from('eventos')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('data_inicio', { ascending: false })
  return (data || []) as Evento[]
})

export const getEventoPorSlug = cache(async (tenantId: string, slug: string): Promise<Evento | null> => {
  const { data } = await getPublicClient()
    .from('eventos')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .single()
  return data as Evento | null
})

// Parceiros
export const getParceiros = cache(async (tenantId: string): Promise<Parceiro[]> => {
  const { data } = await getPublicClient()
    .from('parceiros')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('ativo', true)
    .order('destaque', { ascending: false })
  return (data || []) as Parceiro[]
})

export const getParceiroPorSlug = cache(async (tenantId: string, slug: string): Promise<Parceiro | null> => {
  const { data } = await getPublicClient()
    .from('parceiros')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .single()
  return data as Parceiro | null
})

// Diretoria
export const getDiretoria = cache(async (tenantId: string): Promise<MembroDiretoria[]> => {
  const { data } = await getPublicClient()
    .from('diretoria')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('ordem', { ascending: true })
  return (data || []) as MembroDiretoria[]
})

// Currículos
export const getCurriculos = cache(async (tenantId: string): Promise<Curriculo[]> => {
  const { data } = await getPublicClient()
    .from('curriculos')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('ativo', true)
    .order('created_at', { ascending: false })
  return (data || []) as Curriculo[]
})

// Vagas
export const getVagas = cache(async (tenantId: string): Promise<Vaga[]> => {
  const { data } = await getPublicClient()
    .from('vagas')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('ativa', true)
    .order('created_at', { ascending: false })
  return (data || []) as Vaga[]
})

export const getVagaPorSlug = cache(async (tenantId: string, id: string): Promise<Vaga | null> => {
  const { data } = await getPublicClient()
    .from('vagas')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('id', id)
    .single()
  return data as Vaga | null
})
