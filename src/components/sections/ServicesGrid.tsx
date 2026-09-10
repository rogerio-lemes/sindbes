'use client'

import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/lib/constants'
import { useTenant } from '@/components/TenantProvider'
import { ArrowRight, Star } from 'lucide-react'

const fallbackImages: Record<string, string> = {
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

export default function ServicesGrid() {
  const { config, servicos } = useTenant()

  const priorityServices = servicos.slice(0, 2)
  const otherServices = servicos.slice(2)

  function getImage(slug: string, imagemUrl: string | null) {
    return imagemUrl || fallbackImages[slug] || IMAGES.vitrine1
  }

  return (
    <section className="py-20 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Nossos Serviços</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Tudo que seu negócio da beleza <span>precisa</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Do treinamento à gestão, da assessoria ao crédito. Conheça as soluções do {config.nome} para profissionais e empresas da beleza.
          </p>
        </div>

        {priorityServices.length > 0 && (
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
                    src={getImage(s.slug, s.imagem_url)}
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
                  {s.descricao && (
                    <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                      {s.descricao}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-sm text-white font-semibold mt-5 gradient-primary px-5 py-2.5 rounded-xl group-hover:opacity-90 transition-opacity">
                    Saiba mais <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {otherServices.length > 0 && (
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
                    className="group shrink-0 w-[260px] mx-3 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    aria-hidden={i >= otherServices.length}
                    tabIndex={i >= otherServices.length ? -1 : undefined}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={getImage(s.slug, s.imagem_url)}
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
        )}
      </div>
    </section>
  )
}
