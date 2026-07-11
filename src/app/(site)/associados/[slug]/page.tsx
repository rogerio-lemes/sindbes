import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { ASSOCIADOS, getAssociado } from '@/lib/associados'
import Breadcrumbs from '@/components/Breadcrumbs'
import AssociadoContactForm from '@/components/AssociadoContactForm'
import { MapPin, Phone, Clock, Mail, AtSign, MessageCircle, Sparkles, Images, Info } from 'lucide-react'

export function generateStaticParams() {
  return ASSOCIADOS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const a = getAssociado(slug)
  if (!a) return {}
  return {
    title: `${a.nome} | Filiado ${SITE.shortName}`,
    description: `${a.nome} - ${a.categoria} em Uberlândia, filiado ao ${SITE.name}. ${a.descricao.slice(0, 120)}`,
    alternates: { canonical: `/associados/${a.slug}` },
  }
}

export default async function AssociadoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getAssociado(slug)
  if (!a) notFound()

  const outros = ASSOCIADOS.filter((x) => x.slug !== a.slug).slice(0, 3)

  return (
    <>
      <Breadcrumbs items={[{ label: 'Filiados', href: '/associados' }, { label: a.nome }]} />

      {/* Cover */}
      <section className="relative h-[320px] md:h-[420px] overflow-hidden">
        <Image src={a.capa} alt={a.nome} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 h-full max-w-[1200px] mx-auto px-4 flex flex-col justify-end pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white/95 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">{a.categoria}</span>
            {a.novo && (
              <span className="inline-flex items-center gap-1 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Novo associado
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white">{a.nome}</h1>
          <p className="text-white/80 mt-2 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" /> {a.endereco}
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Conteúdo principal */}
          <div>
            {/* Sobre */}
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold bicolor-title">Sobre o <span>estabelecimento</span></h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">{a.descricao}</p>
            <p className="text-sm text-gray-400 mb-10">Filiado ao {SITE.name} desde {a.desde}.</p>

            {/* Galeria */}
            <div className="flex items-center gap-2 mb-4">
              <Images className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold bicolor-title">Galeria de <span>fotos</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
              {a.fotos.map((foto, i) => (
                <div key={i} className={`relative rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 md:col-span-2 h-64' : 'h-40'}`}>
                  <Image src={foto} alt={`${a.nome} - foto ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>

            {/* Mapa */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold bicolor-title">Como <span>chegar</span></h2>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-[320px]">
              <iframe
                title={`Mapa ${a.nome}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(a.mapsQuery)}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Sidebar de contato */}
          <aside>
            <div className="sticky top-24 space-y-6">
              {/* Card de contatos */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Contato</h3>
                <ul className="space-y-3.5 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-gray-600">{a.endereco}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-secondary shrink-0" />
                    <span className="text-gray-600">{a.telefoneDisplay}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-secondary shrink-0" />
                    <span className="text-gray-600">{a.horario}</span>
                  </li>
                  {a.instagram && (
                    <li className="flex items-center gap-3">
                      <AtSign className="w-5 h-5 text-secondary shrink-0" />
                      <span className="text-gray-600">{a.instagram}</span>
                    </li>
                  )}
                  {a.email && (
                    <li className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-secondary shrink-0" />
                      <span className="text-gray-600 break-all">{a.email}</span>
                    </li>
                  )}
                </ul>

                <a
                  href={`https://wa.me/${a.whatsapp}?text=${encodeURIComponent(`Olá! Vim pelo Sindbes e gostaria de falar com ${a.nome}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-5 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-5 h-5" /> Chamar no WhatsApp
                </a>
              </div>

              {/* Formulário */}
              <div className="bg-bg-alt rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-base mb-1">Enviar uma mensagem</h3>
                <p className="text-xs text-gray-500 mb-4">Fale diretamente com {a.nome}.</p>
                <AssociadoContactForm associadoNome={a.nome} whatsapp={a.whatsapp} />
              </div>
            </div>
          </aside>
        </div>

        {/* Outros filiados */}
        {outros.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6 bicolor-title">Outros <span>filiados</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {outros.map((o) => (
                <Link key={o.slug} href={`/associados/${o.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                  <div className="relative h-36 overflow-hidden">
                    <Image src={o.capa} alt={o.nome} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] text-secondary font-semibold uppercase tracking-wide">{o.categoria}</span>
                    <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors mt-1">{o.nome}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: a.nome,
            description: a.descricao,
            address: { '@type': 'PostalAddress', streetAddress: a.endereco, addressLocality: 'Uberlândia', addressRegion: 'MG', addressCountry: 'BR' },
            telephone: a.telefoneDisplay,
            memberOf: { '@type': 'Organization', name: SITE.name },
          }),
        }}
      />
    </>
  )
}
