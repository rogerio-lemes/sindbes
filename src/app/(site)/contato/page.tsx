import { Metadata } from 'next'
import { SITE, whatsappUrl } from '@/lib/constants'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactSection from '@/components/sections/ContactSection'
import MapLocation from '@/components/sections/MapLocation'
import { MessageCircle, Phone, Mail, MapPin, Clock, AtSign, ArrowRight, Headset } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato | Fale com o Sindbes em Uberlândia',
  description: `Entre em contato com o ${SITE.name}. Agende uma visita, tire suas dúvidas ou solicite um orçamento pelo WhatsApp, telefone ou formulário.`,
  alternates: { canonical: '/contato' },
}

const canais = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    valor: SITE.whatsappDisplay,
    sub: 'Resposta rápida no horário comercial',
    href: whatsappUrl('Olá! Vim pelo site e gostaria de mais informações. 📍 Origem: Página de Contato'),
    cor: 'bg-[#25D366]',
    externo: true,
  },
  {
    icon: Phone,
    label: 'Telefone',
    valor: SITE.whatsappDisplay,
    sub: 'Ligue e fale com nossa equipe',
    href: `tel:${SITE.phone}`,
    cor: 'gradient-primary',
  },
  {
    icon: Mail,
    label: 'E-mail',
    valor: SITE.email,
    sub: 'Envie sua mensagem por e-mail',
    href: `mailto:${SITE.email}`,
    cor: 'gradient-cta',
  },
  {
    icon: AtSign,
    label: 'Instagram',
    valor: SITE.instagram,
    sub: 'Acompanhe nossas novidades',
    href: `https://instagram.com/${SITE.instagram.replace('@', '')}`,
    cor: 'bg-gradient-to-br from-[#833AB4] via-[#C13584] to-[#F77737]',
    externo: true,
  },
]

export default function ContatoPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Contato' }]} />

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-4 pt-14 pb-8 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
          <Headset className="w-4 h-4" /> Atendimento
        </span>
        <h1 className="text-3xl md:text-5xl font-bold mt-3 bicolor-title">
          Fale com o <span>Sindbes</span>
        </h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Estamos prontos para ajudar você e o seu negócio da beleza. Escolha o canal de sua preferência ou preencha o formulário: nossa equipe responde rapidinho.
        </p>
      </section>

      {/* Canais de atendimento */}
      <section className="max-w-[1200px] mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {canais.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              target={c.externo ? '_blank' : undefined}
              rel={c.externo ? 'noopener noreferrer' : undefined}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 scroll-reveal"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${c.cor} flex items-center justify-center mb-4 shadow-lg`}>
                <c.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{c.label}</p>
              <p className="font-bold text-text mt-1 break-words">{c.valor}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.sub}</p>
              <span className="inline-flex items-center gap-1 text-sm text-secondary font-semibold mt-4">
                Acessar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          ))}
        </div>

        {/* Faixa endereço + horário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div className="flex items-center gap-4 bg-primary/5 rounded-2xl p-6 scroll-reveal">
            <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Endereço</p>
              <p className="font-semibold text-text">{SITE.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-primary/5 rounded-2xl p-6 scroll-reveal">
            <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Horário de atendimento</p>
              <p className="font-semibold text-text">{SITE.horario}</p>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
      <MapLocation />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sindbes.vercel.app/' },
              { '@type': 'ListItem', position: 2, name: 'Contato', item: 'https://sindbes.vercel.app/contato' },
            ],
          }),
        }}
      />
    </>
  )
}
