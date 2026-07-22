'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SERVICE_CONTENT } from '@/lib/service-content'
import { useTenant, useWhatsappUrl } from '@/components/TenantProvider'
import ContactSection from '@/components/sections/ContactSection'
import Faq from '@/components/sections/Faq'
import CtaBanner from '@/components/sections/CtaBanner'
import Testimonials from '@/components/sections/Testimonials'
import MapLocation from '@/components/sections/MapLocation'
import EeatBio from '@/components/sections/EeatBio'
import ProBadge from '@/components/sections/ProBadge'
import ScrollSpyNav from '@/components/ScrollSpyNav'
import ServiceFaq from '@/components/pages/ServiceFaq'
import Breadcrumbs from '@/components/Breadcrumbs'
import { CheckCircle2, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react'

interface Props {
  service: { nome: string; slug: string }
  image: string
}

export default function ServicePage({ service, image }: Props) {
  const { config, servicos } = useTenant()
  const content = SERVICE_CONTENT[service.slug]
  const otherServices = servicos.filter((s) => s.slug !== service.slug).slice(0, 4)

  const whatsMsg = `Olá! Quero saber mais sobre ${service.nome}. 📍 Origem: ${service.nome}`
  const whatsUrl = useWhatsappUrl(whatsMsg)

  const sections = [
    { id: 'hero-srv', label: 'Início' },
    { id: 'problema', label: 'O problema' },
    { id: 'solucao', label: 'A solução' },
    { id: 'objecao', label: 'Investimento' },
    { id: 'bio', label: 'Quem somos' },
    { id: 'depoimentos', label: 'Depoimentos' },
    { id: 'faq-srv', label: 'Dúvidas' },
    { id: 'contato', label: 'Contato' },
  ]

  return (
    <>
      <ScrollSpyNav sections={sections} />

      <Breadcrumbs items={[{ label: service.nome }]} />

      <section id="hero-srv" className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Image src={image} alt={service.nome} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 h-full max-w-[1200px] mx-auto px-4 flex items-center">
          <div className="max-w-xl">
            <div className="mb-4">
              <ProBadge type={content?.badgeType || 'associado'} text={content?.badgeText} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              {content?.headline || service.nome}{' '}
              <span className="text-[#8FD9CE]">{content?.highlightWord || ''}</span>
            </h1>
            <p className="text-lg text-white/90 mb-6">
              {content?.heroDescription || `Conheça como o ${config.nome} pode ajudar sua empresa da beleza com ${service.nome.toLowerCase()}.`}
            </p>
            <a
              href={whatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 gradient-cta text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              {content?.ctaText || 'Falar no WhatsApp'}
            </a>
          </div>
        </div>
      </section>

      <section id="problema" className="py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="scroll-reveal">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-red-500">O problema</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 bicolor-title">
                  {content?.painTitle || <>Por que isso <span>importa</span>?</>}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {content?.painText || `Entenda os riscos de não agir e como o ${config.nome} pode ajudar.`}
                </p>

                {content?.painPoints && (
                  <div className="bg-red-50 rounded-2xl p-6 space-y-3">
                    {content.painPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0" />
                        <span className="text-sm text-red-800">{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div id="solucao" className="scroll-reveal">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-green-600">A solução</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 bicolor-title">
                  {content?.benefitTitle || <>O que o {config.nome} <span>oferece</span></>}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {content?.benefitText || `Conheça os benefícios de contar com o ${config.nome}.`}
                </p>

                {content?.benefits && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {content.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-bg-alt rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 scroll-reveal">
                <div className="flex-1">
                  <p className="font-semibold text-sm">Quer resolver isso agora?</p>
                  <p className="text-xs text-gray-500">Fale com nossa equipe pelo WhatsApp.</p>
                </div>
                <a
                  href={whatsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 gradient-cta text-white font-semibold rounded-xl text-sm whitespace-nowrap"
                >
                  {content?.ctaText || 'Falar agora'}
                </a>
              </div>

              <div id="objecao" className="scroll-reveal">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 bicolor-title">
                  {content?.objectionTitle || <>Investimento <span>inteligente</span></>}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {content?.objectionText || `O ${config.nome} oferece condições exclusivas para associados.`}
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white scroll-reveal">
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
                  Oferta para associados
                </span>
                <h3 className="text-xl font-bold mb-2">
                  Condições especiais em {service.nome}
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Associados {config.nome} têm acesso a condições diferenciadas. Fale com nossa equipe e descubra como economizar.
                </p>
                <a
                  href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Quero conhecer as condições especiais de ${service.nome}! 📍 Origem: ${service.nome}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-xl text-sm hover:bg-secondary-dark transition-colors"
                >
                  Quero saber mais <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {content?.faqItems && (
                <div id="faq-srv" className="scroll-reveal">
                  <h2 className="text-2xl font-bold mb-6 bicolor-title">
                    Dúvidas sobre <span>{service.nome.toLowerCase()}</span>
                  </h2>
                  <ServiceFaq items={content.faqItems} serviceName={service.nome} />
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="bg-bg-alt rounded-2xl p-6 sticky top-24">
                <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-500">Outros serviços</h4>
                <ul className="space-y-3">
                  {otherServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/${s.slug}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-3 h-3 text-secondary" />
                        {s.nome}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-primary">
                      Ver todos os serviços →
                    </Link>
                  </li>
                </ul>

                <hr className="my-6 border-gray-200" />

                <a
                  href={whatsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 gradient-primary text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div id="bio">
        <EeatBio context={service.nome.toLowerCase()} />
      </div>

      <div id="depoimentos">
        <Testimonials />
      </div>

      <CtaBanner
        title="Precisa de"
        highlight={`${service.nome.toLowerCase()}?`}
        description={`Fale com o ${config.nome} e descubra as melhores condições para ${service.nome.toLowerCase()}.`}
      />
      <ContactSection />
      <MapLocation />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.nome,
            provider: { '@type': 'LocalBusiness', name: config.nome },
            areaServed: config.cidade ? { '@type': 'City', name: config.cidade } : undefined,
          }),
        }}
      />
    </>
  )
}
