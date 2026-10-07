import type { MetadataRoute } from 'next'
import { BLOG_ARTICLES } from '@/lib/constants'
import { getTenant, getServicos } from '@/lib/tenant'
import { PARCEIROS } from '@/lib/parceiros'
import { ASSOCIADOS } from '@/lib/associados'
import { listarParceiros, listarAssociados } from '@/lib/cadastros-publicos'

/**
 * Mapa do site para o Google (/sitemap.xml).
 * Parceiros e associados aprovados no painel entram sozinhos; o mapa se
 * refaz a cada hora. Ficam de fora os dados de exemplo do código
 * (parceiros marcados como exemplo, associados e eventos demonstrativos),
 * para o Google não indexar telefones e negócios fictícios.
 */
export const revalidate = 3600

const BASE = 'https://sindibes.com.br'

const PAGINAS_FIXAS: { caminho: string; prioridade: number; frequencia: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { caminho: '', prioridade: 1, frequencia: 'weekly' },
  { caminho: '/faca-parte', prioridade: 0.9, frequencia: 'monthly' },
  { caminho: '/faca-parte/associado', prioridade: 0.9, frequencia: 'monthly' },
  { caminho: '/faca-parte/parceiro', prioridade: 0.9, frequencia: 'monthly' },
  { caminho: '/parceiros', prioridade: 0.8, frequencia: 'weekly' },
  { caminho: '/associados', prioridade: 0.8, frequencia: 'weekly' },
  { caminho: '/blog', prioridade: 0.7, frequencia: 'weekly' },
  { caminho: '/eventos', prioridade: 0.6, frequencia: 'weekly' },
  { caminho: '/contato', prioridade: 0.7, frequencia: 'yearly' },
  { caminho: '/vagas', prioridade: 0.6, frequencia: 'weekly' },
  { caminho: '/curriculos', prioridade: 0.5, frequencia: 'weekly' },
  { caminho: '/institucional', prioridade: 0.6, frequencia: 'yearly' },
  { caminho: '/institucional/historia', prioridade: 0.5, frequencia: 'yearly' },
  { caminho: '/institucional/diretoria', prioridade: 0.5, frequencia: 'yearly' },
  { caminho: '/institucional/convencoes', prioridade: 0.7, frequencia: 'monthly' },
  { caminho: '/institucional/palavra-do-presidente', prioridade: 0.4, frequencia: 'yearly' },
  { caminho: '/institucional/galeria-de-presidentes', prioridade: 0.4, frequencia: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date()
  const itens: MetadataRoute.Sitemap = PAGINAS_FIXAS.map(p => ({
    url: `${BASE}${p.caminho}`,
    lastModified: agora,
    changeFrequency: p.frequencia,
    priority: p.prioridade,
  }))

  // Páginas de serviço (plano odontológico, assessoria jurídica etc.)
  try {
    const { id } = await getTenant()
    for (const s of await getServicos(id)) {
      itens.push({ url: `${BASE}/${s.slug}`, lastModified: agora, changeFrequency: 'monthly', priority: 0.8 })
    }
  } catch (err) {
    console.error('[sitemap] falha ao listar serviços:', err)
  }

  for (const a of BLOG_ARTICLES) {
    itens.push({ url: `${BASE}/${a.slug}`, lastModified: agora, changeFrequency: 'monthly', priority: 0.6 })
  }

  // Parceiros reais (fixos não marcados como exemplo + aprovados no painel)
  const exemplos = new Set(PARCEIROS.filter(p => p.exemplo).map(p => p.slug))
  for (const p of await listarParceiros()) {
    if (exemplos.has(p.slug)) continue
    itens.push({ url: `${BASE}/parceiros/${p.slug}`, lastModified: agora, changeFrequency: 'monthly', priority: 0.7 })
  }

  // Associados: só os aprovados no painel (os fixos do código são demonstrativos)
  const demonstrativos = new Set(ASSOCIADOS.map(a => a.slug))
  for (const a of await listarAssociados()) {
    if (demonstrativos.has(a.slug)) continue
    itens.push({ url: `${BASE}/associados/${a.slug}`, lastModified: agora, changeFrequency: 'monthly', priority: 0.7 })
  }

  // Sem duplicados, caso um serviço e um artigo compartilhem o endereço
  const vistos = new Set<string>()
  return itens.filter(i => (vistos.has(i.url) ? false : (vistos.add(i.url), true)))
}
