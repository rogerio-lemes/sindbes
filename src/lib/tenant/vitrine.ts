import { cache } from 'react'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { IMAGES } from '@/lib/constants'

export interface VitrineSlide {
  id: string
  imagem_url: string
  titulo: string | null
  destaque: string | null
  subtitulo: string | null
  link_url: string | null
  cta_texto: string | null
  ordem: number
}

/** Slides padrão do template, usados quando o tenant ainda não cadastrou nenhum. */
export const SLIDES_FALLBACK: VitrineSlide[] = [
  {
    id: 'fallback-1',
    imagem_url: IMAGES.hero1,
    titulo: 'Qualifique sua equipe',
    destaque: 'com quem entende de beleza',
    subtitulo: 'Treinamentos, certificações e capacitação para profissionais e empresas da beleza.',
    link_url: '/treinamentos-e-qualificacoes-profissionais',
    cta_texto: 'Conheça nossos treinamentos',
    ordem: 1,
  },
  {
    id: 'fallback-2',
    imagem_url: IMAGES.hero2,
    titulo: 'Assessoria completa',
    destaque: 'para seu negócio crescer',
    subtitulo: 'Jurídico, contábil, planejamento e gestão: tudo que seu salão precisa em um só lugar.',
    link_url: '/contato',
    cta_texto: 'Fale com um especialista',
    ordem: 2,
  },
  {
    id: 'fallback-3',
    imagem_url: IMAGES.hero3,
    titulo: 'Benefícios exclusivos',
    destaque: 'para associados',
    subtitulo: 'Planos de saúde, odontológico, crédito facilitado e muito mais para quem faz parte.',
    link_url: '/beneficios-para-associados',
    cta_texto: 'Veja os benefícios',
    ordem: 3,
  },
]

/**
 * Busca os slides vigentes do tenant. A RLS já filtra por ativo e período,
 * mas repetimos o filtro de data aqui para o caso de leitura autenticada.
 */
export const getVitrineSlides = cache(async (
  tenantId: string,
  sliderKey = 'home_hero',
): Promise<VitrineSlide[]> => {
  if (!isSupabaseConfigured()) return SLIDES_FALLBACK

  try {
    const hoje = new Date().toISOString().slice(0, 10)
    const { data } = await getPublicClient()
      .from('vitrine_slides')
      .select('id, imagem_url, titulo, destaque, subtitulo, link_url, cta_texto, ordem')
      .eq('tenant_id', tenantId)
      .eq('slider_key', sliderKey)
      .eq('ativo', true)
      .or(`data_inicio.is.null,data_inicio.lte.${hoje}`)
      .or(`data_fim.is.null,data_fim.gte.${hoje}`)
      .order('ordem')

    if (!data || data.length === 0) return SLIDES_FALLBACK
    return data as VitrineSlide[]
  } catch {
    return SLIDES_FALLBACK
  }
})
