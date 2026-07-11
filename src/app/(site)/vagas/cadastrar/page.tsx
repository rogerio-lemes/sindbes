import { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import Breadcrumbs from '@/components/Breadcrumbs'
import VagaForm from '@/components/recrutamento/VagaForm'
import { Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: `Cadastrar Vaga | ${SITE.name}`,
  description: `Divulgue sua vaga de trabalho no ${SITE.name} e encontre profissionais da beleza qualificados em Uberlândia.`,
  alternates: { canonical: '/vagas/cadastrar' },
}

export default function CadastrarVagaPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Vagas', href: '/vagas' }, { label: 'Cadastrar Vaga' }]} />
      <section className="max-w-[900px] mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
            <Briefcase className="w-4 h-4" /> Oportunidades
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3 bicolor-title">
            Publique uma <span>vaga</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Divulgue gratuitamente sua vaga para os profissionais da beleza filiados ao Sindbes e encontre o talento certo para o seu negócio.
          </p>
        </div>
        <VagaForm />
      </section>
    </>
  )
}
