import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PARCEIROS } from '@/lib/parceiros'
import { buscarParceiro, listarParceiros } from '@/lib/cadastros-publicos'
import ParceiroPagina from '@/components/vitrine/ParceiroPagina'

// Os fixos são gerados no build; os aprovados no painel entram sob demanda
// e a página é refeita em até 1 minuto (ou na hora, via /api/admin/revalidar).
export const dynamicParams = true
export const revalidate = 60

export function generateStaticParams() {
  return PARCEIROS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await buscarParceiro(slug)
  if (!p) return {}
  return {
    title: `${p.nome} | Parceiro Sindbes`.slice(0, 60),
    description: p.resumo.slice(0, 158),
    alternates: { canonical: `/parceiros/${p.slug}` },
  }
}

export default async function ParceiroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await buscarParceiro(slug)
  if (!p) notFound()

  const outros = (await listarParceiros()).filter((x) => x.slug !== p.slug).slice(0, 3)

  return <ParceiroPagina parceiro={p} outros={outros} />
}
