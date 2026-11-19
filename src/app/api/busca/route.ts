/**
 * Índice da busca do site (menu "Pesquisar" no topo).
 *
 * Devolve uma lista enxuta de tudo que é público e pode ser encontrado:
 * páginas fixas, institucional, blog, eventos, parceiros e associados
 * publicados. Os serviços vêm do próprio cabeçalho (configuração do site),
 * então não entram aqui.
 *
 * O filtro por texto é feito no navegador, que baixa este índice uma vez
 * quando a busca é aberta. Só entram campos públicos (nome, categoria e um
 * resumo curto); nada de dado privado dos cadastros.
 */
import { NextResponse } from 'next/server'
import { BLOG_ARTICLES, INSTITUCIONAL, CURRICULOS_MENU } from '@/lib/constants'
import { EVENTOS } from '@/lib/eventos'
import { listarParceiros, listarAssociados } from '@/lib/cadastros-publicos'

export const revalidate = 300

export type TipoBusca =
  | 'pagina' | 'institucional' | 'blog' | 'evento' | 'parceiro' | 'associado' | 'servico'

export interface ItemBusca {
  tipo: TipoBusca
  titulo: string
  href: string
  resumo?: string
}

const PAGINAS: ItemBusca[] = [
  { tipo: 'pagina', titulo: 'Lei Salão-Parceiro (Lei 13.352/2016)', href: '/lei-salao-parceiro', resumo: 'Contrato de parceria homologado, nota fiscal, parentes no salão e riscos trabalhistas' },
  { tipo: 'pagina', titulo: 'Seja Associado', href: '/faca-parte/associado', resumo: 'Cadastre seu salão e ganhe uma página no site do Sindibes' },
  { tipo: 'pagina', titulo: 'Seja Parceiro', href: '/faca-parte/parceiro', resumo: 'Ofereça descontos aos associados e divulgue sua empresa' },
  { tipo: 'pagina', titulo: 'Associados filiados', href: '/associados', resumo: 'Salões, barbearias e clínicas filiados' },
  { tipo: 'pagina', titulo: 'Parceiros', href: '/parceiros', resumo: 'Empresas com descontos para associados' },
  { tipo: 'pagina', titulo: 'Eventos', href: '/eventos', resumo: 'Agenda de cursos, palestras e encontros' },
  { tipo: 'pagina', titulo: 'Blog', href: '/blog', resumo: 'Dicas de gestão e beleza' },
  { tipo: 'pagina', titulo: 'Contato', href: '/contato', resumo: 'Fale com o Sindibes' },
  ...CURRICULOS_MENU.map((c) => ({ tipo: 'pagina' as const, titulo: c.nome, href: `/${c.slug}` })),
]

function curto(texto: string | undefined, max = 110) {
  if (!texto) return undefined
  const t = texto.replace(/\s+/g, ' ').trim()
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}

export async function GET() {
  const [parceiros, associados] = await Promise.all([
    listarParceiros().catch(() => []),
    listarAssociados().catch(() => []),
  ])

  const itens: ItemBusca[] = [
    ...PAGINAS,
    ...INSTITUCIONAL.map((i) => ({ tipo: 'institucional' as const, titulo: i.nome, href: `/${i.slug}` })),
    ...BLOG_ARTICLES.map((a) => ({
      tipo: 'blog' as const, titulo: a.titulo, href: `/${a.slug}`, resumo: curto(a.seoDescription),
    })),
    ...EVENTOS.map((e) => ({
      tipo: 'evento' as const, titulo: e.titulo, href: `/eventos/${e.slug}`, resumo: curto(`${e.categoria} · ${e.resumo}`),
    })),
    // A busca acha o mesmo que as listas do site mostram (fixos + aprovados).
    ...parceiros.map((p) => ({
      tipo: 'parceiro' as const, titulo: p.nome, href: `/parceiros/${p.slug}`, resumo: curto(`${p.categoria} · ${p.resumo}`),
    })),
    ...associados.map((a) => ({
      tipo: 'associado' as const, titulo: a.nome, href: `/associados/${a.slug}`, resumo: curto(`${a.categoria} · ${a.endereco}`),
    })),
  ]

  return NextResponse.json({ itens })
}
