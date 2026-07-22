import { Metadata } from 'next'
import Link from 'next/link'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import VagasList from '@/components/recrutamento/VagasList'
import { Briefcase, Plus } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `Vagas de Emprego | ${config.nome}`,
    description: `Vagas de trabalho no setor da beleza${config.cidade ? ` em ${config.cidade}` : ''}. Candidate-se pelo ${config.nome}.`,
    alternates: { canonical: '/vagas' },
  }
}

export default function BuscarVagasPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Vagas' }]} />
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
              <Briefcase className="w-4 h-4" /> Oportunidades
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-3 bicolor-title">
              Vagas na área da <span>beleza</span>
            </h1>
            <p className="text-gray-500 mt-3 max-w-xl">
              Oportunidades de trabalho em salões, barbearias, esmalterias e clínicas de estética de Uberlândia. Filtre e candidate-se.
            </p>
          </div>
          <Link href="/vagas/cadastrar" className="inline-flex items-center gap-2 px-5 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shrink-0">
            <Plus className="w-4 h-4" /> Publicar uma vaga
          </Link>
        </div>
        <VagasList />
        <p className="text-xs text-gray-400 mt-10 text-center">
          As vagas exibidas são exemplos demonstrativos. As vagas reais cadastradas pelas empresas aparecerão aqui.
        </p>
      </section>
    </>
  )
}
