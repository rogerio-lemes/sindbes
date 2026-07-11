import Link from 'next/link'
import Image from 'next/image'
import { SERVICES, IMAGES } from '@/lib/constants'
import { ArrowRight, Star } from 'lucide-react'

const serviceImages: Record<string, string> = {
  'treinamentos-e-qualificacoes-profissionais': IMAGES.servTreinamentos,
  'assessoria-juridica-e-contabil-para-empresas-da-be': IMAGES.servAssessoria,
  'beneficios-para-associados': IMAGES.servBeneficios,
  'plano-de-saude': IMAGES.servPlanoSaude,
  'qualificacao-em-gestao-financeira': IMAGES.servGestaoFinanceira,
  'qualificacao-em-gestao-de-pessoas': IMAGES.servGestaoPessoas,
  'planejamento-empresarial-para-empresas-da-beleza': IMAGES.servPlanejamento,
  'plano-odontologico': IMAGES.servPlanoOdonto,
  'regularizacao-e-certificacao-profissional': IMAGES.servRegularizacao,
  'acesso-de-credito': IMAGES.servCredito,
}

// Dois serviços prioritários (foco de SEO e conteúdo do blog)
const PRIORITY_SLUGS = [
  'treinamentos-e-qualificacoes-profissionais',
  'assessoria-juridica-e-contabil-para-empresas-da-be',
]

const priorityDescriptions: Record<string, string> = {
  'treinamentos-e-qualificacoes-profissionais':
    'Capacite sua equipe com treinamentos práticos e certificados reconhecidos no mercado da beleza em Uberlândia.',
  'assessoria-juridica-e-contabil-para-empresas-da-be':
    'Proteja seu negócio da beleza com assessoria jurídica e contábil especializada no setor, em Uberlândia.',
}

export default function ServicesGrid() {
  const priorityServices = PRIORITY_SLUGS.map((slug) => SERVICES.find((s) => s.slug === slug)!).filter(Boolean)
  const otherServices = SERVICES.filter((s) => !PRIORITY_SLUGS.includes(s.slug))

  return (
    <section className="py-20 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Nossos Serviços</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Tudo que seu negócio da beleza <span>precisa</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Do treinamento à gestão, da assessoria ao crédito. Conheça as soluções do Sindbes para profissionais e empresas da beleza em Uberlândia.
          </p>
        </div>

        {/* Dois serviços prioritários em destaque */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {priorityServices.map((s, i) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all scroll-reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="relative h-64 md:h-72 overflow-hidden">
                <Image
                  src={serviceImages[s.slug]}
                  alt={s.nome}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-white" /> Destaque
                </span>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-bold text-xl md:text-2xl text-text group-hover:text-primary transition-colors leading-snug">
                  {s.nome}
                </h3>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  {priorityDescriptions[s.slug]}
                </p>
                <span className="inline-flex items-center gap-2 text-sm text-white font-semibold mt-5 gradient-primary px-5 py-2.5 rounded-xl group-hover:opacity-90 transition-opacity">
                  Saiba mais <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Demais serviços em slide contínuo */}
        <div className="scroll-reveal">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
            Mais soluções para você
          </p>
          <div className="marquee">
            <div className="marquee-track">
              {[...otherServices, ...otherServices].map((s, i) => (
                <Link
                  key={`${s.slug}-${i}`}
                  href={`/${s.slug}`}
                  className="group shrink-0 w-[260px] mx-3 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                  aria-hidden={i >= otherServices.length}
                  tabIndex={i >= otherServices.length ? -1 : undefined}
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={serviceImages[s.slug]}
                      alt={s.nome}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-text group-hover:text-primary transition-colors text-sm leading-snug min-h-[40px]">
                      {s.nome}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs text-secondary font-medium mt-3">
                      Saiba mais <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
