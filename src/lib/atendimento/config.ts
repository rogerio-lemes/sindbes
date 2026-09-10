import { cache } from 'react'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'

export interface AtendimentoConfig {
  ativo: boolean
  saudacao: string | null
  segundos_para_abrir: number
  texto_convite: string | null
  texto_minimizado: string | null
}

/** Usado quando o tenant ainda não configurou nada ou o banco está fora. */
export const ATENDIMENTO_PADRAO: AtendimentoConfig = {
  ativo: true,
  saudacao: null, // montado com o nome do atendente no componente
  segundos_para_abrir: 3,
  texto_convite: 'Está com alguma dúvida? Fale comigo agora!',
  texto_minimizado: 'Ainda estou aqui, qualquer dúvida me chame!',
}

export const getAtendimentoConfig = cache(async (tenantId: string): Promise<AtendimentoConfig> => {
  if (!isSupabaseConfigured()) return ATENDIMENTO_PADRAO

  try {
    const { data } = await getPublicClient()
      .from('atendimento_config')
      .select('ativo, saudacao, segundos_para_abrir, texto_convite, texto_minimizado')
      .eq('tenant_id', tenantId)
      .maybeSingle()

    if (!data) return ATENDIMENTO_PADRAO
    return {
      ativo: data.ativo ?? true,
      saudacao: data.saudacao,
      segundos_para_abrir: data.segundos_para_abrir ?? 3,
      texto_convite: data.texto_convite || ATENDIMENTO_PADRAO.texto_convite,
      texto_minimizado: data.texto_minimizado || ATENDIMENTO_PADRAO.texto_minimizado,
    }
  } catch {
    return ATENDIMENTO_PADRAO
  }
})
