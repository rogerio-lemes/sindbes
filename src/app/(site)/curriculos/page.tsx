import { Metadata } from 'next'
import Link from 'next/link'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import CurriculosList from '@/components/recrutamento/CurriculosList'
import { Users, Plus } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `Buscar Currículos | ${config.nome}`,
    description: `Encontre profissionais da beleza${config.cidade ? ` em ${config.cidade}` : ''}. Banco de talentos do ${config.nome}.`,
    alternates: { canonical: '/curriculos' },
  }
}

export default function BuscarCurriculosPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Currículos' }]} />
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
              <Users className="w-4 h-4" /> Banco de Talentos
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-3 bicolor-title">
              Encontre o profissional <span>ideal</span>
            </h1>
            <p className="text-gray-500 mt-3 max-w-xl">
              Profissionais da beleza qualificados e disponíveis em Uberlândia. Use os filtros para encontrar quem combina com a sua vaga.
            </p>
          </div>
          <Link href="/curriculos/cadastrar" className="inline-flex items-center gap-2 px-5 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shrink-0">
            <Plus className="w-4 h-4" /> Cadastrar meu currículo
          </Link>
        </div>
        <CurriculosList />
        <p className="text-xs text-gray-400 mt-10 text-center">
          Os currículos exibidos são exemplos demonstrativos. Os cadastros reais dos candidatos aparecerão aqui.
        </p>
      </section>
    </>
  )
}
