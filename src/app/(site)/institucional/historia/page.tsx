import { Metadata } from 'next'
import Link from 'next/link'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Target, Eye, Heart, Flag } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `História do Sindicato | ${config.nome}`,
    description: `Conheça a história do ${config.nome}: fundação, marcos e a missão de fortalecer o setor da beleza.`,
    alternates: { canonical: '/institucional/historia' },
  }
}

const timeline = [
  { ano: '[Ano de fundação]', titulo: 'Fundação do Sindbes', texto: 'O Sindicato da Beleza de Uberlândia nasce da união de profissionais e empresários do setor, com o propósito de representar e defender os interesses da categoria.' },
  { ano: '[Ano]', titulo: 'Primeiras conquistas', texto: 'Início das negociações coletivas, convênios e parcerias que trouxeram benefícios concretos para os associados da beleza em Uberlândia.' },
  { ano: '[Ano]', titulo: 'Expansão dos serviços', texto: 'Ampliação da atuação com treinamentos, assessoria jurídica e contábil, planos de saúde e odontológico e apoio à regularização dos negócios.' },
  { ano: '2026', titulo: 'Sindbes hoje', texto: 'Com centenas de associados ativos, o Sindbes se consolida como referência na representação e no fortalecimento do setor da beleza na região.' },
]

const valores = [
  { icon: Target, titulo: 'Missão', texto: 'Representar, qualificar e fortalecer os profissionais e empresas da beleza de Uberlândia, promovendo o crescimento sustentável do setor.' },
  { icon: Eye, titulo: 'Visão', texto: 'Ser a principal referência de apoio e representação da categoria da beleza na região, reconhecida pela credibilidade e pelos resultados.' },
  { icon: Heart, titulo: 'Valores', texto: 'Ética, transparência, valorização do profissional, união da categoria e compromisso com a qualificação e o desenvolvimento contínuo.' },
]

export default function HistoriaPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Institucional', href: '/institucional' }, { label: 'História do Sindicato' }]} />

      <section className="max-w-[900px] mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Institucional</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            História do <span>Sindicato</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Uma trajetória de representação, união e conquistas ao lado dos profissionais e empresas da beleza de Uberlândia.
          </p>
        </div>

        <div className="prose-custom space-y-4 mb-16">
          <p className="text-gray-600 leading-relaxed">
            O <strong>Sindicato da Beleza</strong> surgiu da necessidade de dar voz e representatividade a um dos setores que mais crescem e empregam em Uberlândia: o da beleza. Salões de cabeleireiro, barbearias, esmalterias, clínicas de estética e profissionais autônomos encontraram no sindicato um espaço de união, apoio e defesa de seus direitos.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Desde a fundação, o Sindbes trabalha para transformar a realidade da categoria: negocia condições melhores, oferece qualificação profissional, orienta juridicamente e contabilmente os negócios e cria benefícios que fazem diferença real no dia a dia de quem vive da beleza.
          </p>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Flag className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold bicolor-title">Nossa <span>trajetória</span></h2>
          </div>
          <div className="relative border-l-2 border-primary/20 pl-8 space-y-8">
            {timeline.map((t, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[41px] w-5 h-5 rounded-full bg-primary border-4 border-white shadow" />
                <span className="inline-block text-xs font-bold text-white bg-secondary px-3 py-1 rounded-full mb-2">{t.ano}</span>
                <h3 className="font-bold text-lg text-text">{t.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mt-1">{t.texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Missão, Visão, Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {valores.map((v) => (
            <div key={v.titulo} className="bg-bg-alt rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{v.titulo}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{v.texto}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Faça parte dessa história</h3>
          <p className="text-white/80 text-sm mb-5 max-w-lg mx-auto">
            Associe-se ao Sindbes e tenha acesso a treinamentos, assessoria e benefícios exclusivos para o seu negócio da beleza.
          </p>
          <Link href="/contato" className="inline-flex px-8 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark transition-colors">
            Quero me associar
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8 text-center">
          Os campos entre colchetes [ ] devem ser preenchidos com as datas e informações históricas oficiais do sindicato no painel administrativo.
        </p>
      </section>
    </>
  )
}
