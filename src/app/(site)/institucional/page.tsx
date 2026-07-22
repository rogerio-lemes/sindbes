import { Metadata } from 'next'
import Link from 'next/link'
import { INSTITUCIONAL } from '@/lib/constants'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import { BookOpen, MessageSquareQuote, Users, LandmarkIcon, ArrowRight } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `Institucional | ${config.nome}`,
    description: `Conheça a história, a diretoria e a estrutura institucional do ${config.nome}.`,
    alternates: { canonical: '/institucional' },
  }
}

const icons = [BookOpen, MessageSquareQuote, Users, LandmarkIcon]
const descriptions = [
  'A trajetória do Sindicato da Beleza de Uberlândia, desde a fundação até os dias de hoje.',
  'Uma mensagem da presidência sobre o compromisso do Sindbes com a categoria.',
  'Conheça os presidentes que construíram a história da nossa entidade.',
  'A diretoria e o conselho fiscal que representam a categoria na gestão 2026–2028.',
]

export default function InstitucionalPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Institucional' }]} />

      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Institucional</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Quem somos e o que nos <span>representa</span>
          </h1>
          <p className="text-gray-500 mt-4">
            O Sindbes é a entidade que representa, qualifica e fortalece os profissionais e empresas da beleza em Uberlândia. Conheça nossa história, nossa liderança e nossa estrutura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INSTITUCIONAL.map((item, i) => {
            const Icon = icons[i]
            return (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-8 flex items-start gap-5"
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-text group-hover:text-primary transition-colors">
                    {item.nome}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{descriptions[i]}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-secondary font-semibold mt-4">
                    Acessar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
