import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Handshake, UserCheck, ArrowRight, BadgePercent, Globe, Users, HeartPulse, Scale, GraduationCap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Faça Parte | Sindibes - Sindicato da Beleza',
  description: 'Seja parceiro ou associado do Sindibes, o Sindicato da Beleza de Uberlândia.',
  alternates: { canonical: '/faca-parte' },
}

export default function FacaPartePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Faça Parte' }]} />

      {/* Título da página */}
      <section className="max-w-[860px] mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-text leading-tight">
          Como você quer <span className="text-primary">fazer parte</span>?
        </h1>
        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Escolha o seu perfil e preencha o cadastro. Nossa equipe entra em contato em breve.
        </p>
      </section>

      {/* Cards */}
      <section className="max-w-[860px] mx-auto px-4 pb-20 space-y-6">

        {/* ── Card Parceiro ── */}
        <Link
          href="/faca-parte/parceiro"
          className="group relative flex flex-col md:flex-row items-stretch overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-primary/30 transition-all duration-300 bg-white"
        >
          {/* Faixa lateral colorida */}
          <div className="md:w-2 w-full h-2 md:h-auto bg-primary rounded-t-3xl md:rounded-t-none md:rounded-l-3xl flex-shrink-0" />

          {/* Ícone */}
          <div className="flex items-center justify-center p-7 md:p-8 bg-primary/5 md:bg-primary/5 flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/15 group-hover:bg-primary flex items-center justify-center transition-colors duration-300">
              <Handshake className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:text-white transition-colors duration-300" />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col justify-center px-6 md:px-8 py-7 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Para empresas</p>
            <h2 className="text-xl md:text-2xl font-bold text-text mb-2">Quero ser Parceiro</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Ofereça vantagens aos associados e ganhe visibilidade junto a centenas de profissionais
              e empresas da beleza de Uberlândia.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { icon: Users, label: 'Visibilidade para associados' },
                { icon: Globe, label: 'Presença no site e redes sociais' },
                { icon: BadgePercent, label: 'Página própria na vitrine' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 px-3 py-1.5 rounded-full">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
              Fazer meu cadastro <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Seta decorativa no canto */}
          <div className="hidden md:flex items-center pr-8 text-gray-200 group-hover:text-primary/30 transition-colors">
            <ArrowRight className="w-8 h-8" />
          </div>
        </Link>

        {/* ── Card Associado ── */}
        <Link
          href="/faca-parte/associado"
          className="group relative flex flex-col md:flex-row items-stretch overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-secondary/30 transition-all duration-300 bg-white"
        >
          {/* Faixa lateral colorida */}
          <div className="md:w-2 w-full h-2 md:h-auto bg-secondary rounded-t-3xl md:rounded-t-none md:rounded-l-3xl flex-shrink-0" />

          {/* Ícone */}
          <div className="flex items-center justify-center p-7 md:p-8 bg-secondary/5 flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-secondary/15 group-hover:bg-secondary flex items-center justify-center transition-colors duration-300">
              <UserCheck className="w-8 h-8 md:w-10 md:h-10 text-secondary group-hover:text-white transition-colors duration-300" />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col justify-center px-6 md:px-8 py-7 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Para profissionais</p>
            <h2 className="text-xl md:text-2xl font-bold text-text mb-2">Quero ser Associado</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Acesse planos de saúde, assessoria jurídica, treinamentos e muito mais —
              tudo negociado coletivamente para o setor da beleza.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { icon: HeartPulse, label: 'Plano de saúde e odonto' },
                { icon: Scale, label: 'Assessoria jurídica' },
                { icon: GraduationCap, label: 'Treinamentos com certificado' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary bg-secondary/8 px-3 py-1.5 rounded-full">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary group-hover:gap-3 transition-all">
              Fazer meu cadastro <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Seta decorativa no canto */}
          <div className="hidden md:flex items-center pr-8 text-gray-200 group-hover:text-secondary/30 transition-colors">
            <ArrowRight className="w-8 h-8" />
          </div>
        </Link>

      </section>
    </>
  )
}
