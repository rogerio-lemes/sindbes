export const POSICOES_BANNER = [
  { value: 'blog_topo',   label: 'Blog — topo da listagem',        descricao: 'Faixa larga acima dos artigos' },
  { value: 'blog_grid',   label: 'Blog — dentro da grade',         descricao: 'Card intercalado entre os artigos' },
  { value: 'blog_rodape', label: 'Blog — rodapé da listagem',      descricao: 'Faixa larga abaixo dos artigos' },
  { value: 'home_topbar', label: 'Home — faixa superior',          descricao: 'Barra fina no topo da home' },
] as const

export type PosicaoBanner = (typeof POSICOES_BANNER)[number]['value']

export interface Banner {
  id: string
  titulo: string | null
  anunciante_nome: string
  imagem_url: string
  link_destino: string | null
  posicao: string
  ordem: number
}

export type StatusBanner = 'ativo' | 'inativo' | 'agendado' | 'expirado'

/** Status é derivado das datas + flag, nunca armazenado (evita divergência). */
export function statusBanner(
  b: { ativo: boolean; data_inicio: string | null; data_fim: string | null },
  hoje = new Date().toISOString().slice(0, 10),
): { status: StatusBanner; label: string } {
  if (!b.ativo) return { status: 'inativo', label: 'Pausado' }
  if (b.data_inicio && b.data_inicio > hoje) return { status: 'agendado', label: 'Agendado' }
  if (b.data_fim && b.data_fim < hoje) return { status: 'expirado', label: 'Expirado' }
  return { status: 'ativo', label: 'No ar' }
}

export function rotuloPosicao(posicao: string): string {
  return POSICOES_BANNER.find((p) => p.value === posicao)?.label ?? posicao
}
