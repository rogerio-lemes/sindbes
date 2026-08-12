import { cache } from 'react'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { Banner } from '@/lib/banners'

/**
 * Banners vigentes de uma posição. Repetimos os filtros da RLS aqui porque
 * a mesma query pode rodar autenticada (admin navegando no site).
 */
export const getBanners = cache(async (
  tenantId: string,
  posicao: string,
): Promise<Banner[]> => {
  if (!isSupabaseConfigured()) return []

  try {
    const hoje = new Date().toISOString().slice(0, 10)
    const { data } = await getPublicClient()
      .from('banners')
      .select('id, titulo, anunciante_nome, imagem_url, link_destino, posicao, ordem')
      .eq('tenant_id', tenantId)
      .eq('posicao', posicao)
      .eq('ativo', true)
      .lte('data_inicio', hoje)
      .gte('data_fim', hoje)
      .order('ordem')

    return (data ?? []) as Banner[]
  } catch {
    return []
  }
})
