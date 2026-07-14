import Image from 'next/image'
import { IMAGES, SITE } from '@/lib/constants'
import { CheckCircle2, Users, ShieldCheck, MapPin } from 'lucide-react'

interface Props {
  context?: string
}

export default function EeatBio({ context = 'serviço' }: Props) {
  return (
    <section className="py-20 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Imagem grande e valorizada */}
          <div className="relative scroll-reveal">
            <div className="relative h-[420px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <Image
                src={IMAGES.equipe}
                alt="Equipe Sindbes - Sindicato da Beleza de Uberlândia"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block bg-secondary text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">Equipe Sindbes</span>
                <p className="text-white font-bold text-lg leading-tight">Profissionais a serviço da categoria</p>
                <p className="text-white/80 text-sm">Sindicato da Beleza · Uberlândia, MG</p>
              </div>
            </div>

            {/* Card de estatística flutuante */}
            <div className="absolute -bottom-6 -right-4 md:-right-6 bg-white rounded-2xl shadow-xl px-6 py-4 hidden sm:block border border-gray-100">
              <span className="block text-3xl font-bold text-primary leading-none">+500</span>
              <span className="text-xs text-gray-500">associados atendidos</span>
            </div>
          </div>

          {/* Conteúdo corporativo */}
          <div className="scroll-reveal">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Quem cuida de você</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-2 mb-5 bicolor-title">
              Profissionais especializados no setor da <span>beleza</span>
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              O {SITE.name} reúne profissionais com experiência real no setor da beleza de Uberlândia: advogados especializados em direito trabalhista e empresarial, contadores com carteira de clientes de salões e clínicas, e instrutores com certificação reconhecida em gestão e técnicas da beleza.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Todo {context} oferecido pelo Sindbes passa por profissionais que entendem a realidade do dia a dia de quem trabalha com beleza. Não é teoria: é orientação baseada em centenas de casos reais de associados de Uberlândia e região.
            </p>

            {/* Estatísticas corporativas */}
            <div className="grid grid-cols-3 gap-4 mb-8 border-y border-gray-200 py-6">
              <div className="text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-1.5" />
                <span className="block text-xl font-bold text-text leading-none">+500</span>
                <span className="text-[11px] text-gray-500">Associados</span>
              </div>
              <div className="text-center border-x border-gray-200">
                <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-1.5" />
                <span className="block text-xl font-bold text-text leading-none">100%</span>
                <span className="text-[11px] text-gray-500">Foco na beleza</span>
              </div>
              <div className="text-center">
                <MapPin className="w-6 h-6 text-primary mx-auto mb-1.5" />
                <span className="block text-xl font-bold text-text leading-none">UDI</span>
                <span className="text-[11px] text-gray-500">Atuação local</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Experiência comprovada no setor',
                'Atendimento personalizado',
                'Equipe multidisciplinar',
                'Atuação exclusiva em Uberlândia',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  {item}
                </div>
              ))}
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
            worksFor: { '@type': 'Organization', name: SITE.name },
            areaServed: { '@type': 'City', name: 'Uberlândia' },
          }),
        }}
      />
    </section>
  )
}
