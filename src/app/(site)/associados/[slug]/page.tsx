import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTenant } from '@/lib/tenant'
import { ASSOCIADOS } from '@/lib/associados'
import { buscarAssociado, listarAssociados } from '@/lib/cadastros-publicos'
import AssociadoPagina from '@/components/vitrine/AssociadoPagina'

// Os fixos são gerados no build; os aprovados no painel entram sob demanda
// e a página é refeita em até 1 minuto (ou na hora, via /api/admin/revalidar).
export const dynamicParams = true
export const revalidate = 60

export function generateStaticParams() {
  return ASSOCIADOS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const a = await buscarAssociado(slug)
  if (!a) return {}
  const { config } = await getTenant()
  return {
    title: `${a.nome} | ${a.categoria} - Filiado ${config.nome}`,
    description: `${a.nome} - ${a.categoria}, filiado ao ${config.nome}. ${a.descricao.slice(0, 120)}`,
    alternates: { canonical: `/associados/${a.slug}` },
  }
}

export default async function AssociadoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = await buscarAssociado(slug)
  if (!a) notFound()

  const outros = (await listarAssociados()).filter((x) => x.slug !== a.slug).slice(0, 3)

  return <AssociadoPagina associado={a} outros={outros} />
}
