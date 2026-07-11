import { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import Breadcrumbs from '@/components/Breadcrumbs'
import CurriculoForm from '@/components/recrutamento/CurriculoForm'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: `Cadastrar Currículo | ${SITE.name}`,
  description: `Cadastre seu currículo no banco de talentos do ${SITE.name} e conecte-se a vagas em salões, barbearias e clínicas de estética de Uberlândia.`,
  alternates: { canonical: '/curriculos/cadastrar' },
}

export default function CadastrarCurriculoPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Currículos', href: '/curriculos' }, { label: 'Cadastrar Currículo' }]} />
      <section className="max-w-[900px] mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
            <FileText className="w-4 h-4" /> Banco de Talentos
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3 bicolor-title">
            Cadastre seu <span>currículo</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Faça parte do banco de talentos do Sindbes e seja encontrado por salões, barbearias, esmalterias e clínicas de estética que buscam profissionais como você.
          </p>
        </div>
        <CurriculoForm />
      </section>
    </>
  )
}
