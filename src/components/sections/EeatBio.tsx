import Image from 'next/image'
import { IMAGES, SITE } from '@/lib/constants'
import { CheckCircle2 } from 'lucide-react'

interface Props {
  context?: string
}

export default function EeatBio({ context = 'serviço' }: Props) {
  return (
    <section className="py-16 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm scroll-reveal">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-secondary/20 mb-3">
                <Image
                  src={IMAGES.sobre}
                  alt="Equipe Sindbes - Sindicato da Beleza"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="font-bold text-sm">Equipe Sindbes</p>
              <p className="text-xs text-gray-500">Sindicato da Beleza</p>
              <p className="text-xs text-gray-400">Uberlândia, MG</p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Quem cuida de você</span>
              <h3 className="text-xl font-bold mt-1 mb-4 bicolor-title">
                Profissionais especializados no setor da <span>beleza</span>
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                O {SITE.name} reúne profissionais com experiência real no setor da beleza de Uberlândia. Nossa equipe inclui advogados especializados em direito trabalhista e empresarial do setor, contadores com carteira de clientes de salões e clínicas, e instrutores com certificação reconhecida em gestão e técnicas da beleza.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Todo {context} oferecido pelo Sindbes passa por profissionais que entendem a realidade do dia a dia de quem trabalha com beleza. Não é teoria: é orientação baseada em centenas de casos reais de associados de Uberlândia e região.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Experiência comprovada no setor',
                  'Atendimento personalizado',
                  'Centenas de associados atendidos',
                  'Atuação exclusiva em Uberlândia',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Equipe Sindbes',
            jobTitle: 'Profissionais do Sindicato da Beleza',
            worksFor: {
              '@type': 'Organization',
              name: SITE.name,
            },
            areaServed: { '@type': 'City', name: 'Uberlândia' },
          }),
        }}
      />
    </section>
  )
}
