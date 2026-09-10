import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PARCEIROS, getParceiro } from '@/lib/parceiros'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  CheckCircle2, Globe, MessageCircle, BadgePercent, Sparkles, ArrowRight, Handshake,
  Trophy, Search, FileSearch, Clock, MapPin,
} from 'lucide-react'

// Ícones aplicados na ordem dos destaques cadastrados no parceiro
const ICONES_DESTAQUE = [Trophy, Search, FileSearch, Clock, MapPin]
import ImageCarousel from '@/components/parceiros/ImageCarousel'

export function generateStaticParams() {
  return PARCEIROS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = getParceiro(slug)
  if (!p) return {}
  return {
    title: `${p.nome} | Parceiro Sindbes`.slice(0, 60),
    description: p.resumo.slice(0, 158),
    alternates: { canonical: `/parceiros/${p.slug}` },
  }
}

export default async function ParceiroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getParceiro(slug)
  if (!p) notFound()

  const outros = PARCEIROS.filter((x) => x.slug !== p.slug).slice(0, 3)
  const waMsg = `Olá! Vim pelo site do Sindbes e quero conhecer as condições da ${p.nome} para associados.`

  return (
    <>
      <Breadcrumbs items={[{ label: 'Parceiros', href: '/parceiros' }, { label: p.nome }]} />

      {/* Cover */}
      <section className="relative h-[320px] md:h-[420px] overflow-hidden">
        <Image src={p.capa} alt={p.nome} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="relative z-10 h-full max-w-[1200px] mx-auto px-4 flex flex-col justify-end pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white/95 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">{p.categoria}</span>
            {p.destaque && (
              <span className="inline-flex items-center gap-1 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Parceiro Oficial
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white">{p.nome}</h1>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Conteúdo */}
          <div>
            {/* Diferenciais em destaque, antes do texto institucional */}
            {p.destaques && p.destaques.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <h2 className="text-xl font-bold bicolor-title">
                    O que você <span>ganha na prática</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {p.destaques.map((d, i) => {
                    const Icone = ICONES_DESTAQUE[i % ICONES_DESTAQUE.length]
                    return (
                      <div
                        key={d.titulo}
                        className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-hidden
                                   first:sm:col-span-2 hover:shadow-md transition-shadow"
                      >
                        <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-secondary" />
                        <div className="flex items-start gap-3 pl-2">
                          <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icone className="w-5 h-5 text-primary" />
                          </span>
                          <div>
                            <p className="font-bold text-text leading-snug">{d.titulo}</p>
                            <p className="text-sm text-gray-500 leading-relaxed mt-1">{d.texto}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Handshake className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold bicolor-title">Sobre o <span>parceiro</span></h2>
            </div>
            {p.descricao.map((par, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-4">{par}</p>
            ))}

            <h2 className="text-xl font-bold bicolor-title mt-8 mb-4">O que a {p.nome} <span>oferece</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {p.servicos.map((s) => (
                <div key={s} className="flex items-start gap-3 bg-bg-alt rounded-xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{s}</span>
                </div>
              ))}
            </div>

            {/* Carrossel de fotos adicionais */}
            {p.fotos && p.fotos.length > 0 && (
              <ImageCarousel fotos={p.fotos} nome={p.nome} />
            )}

            {/* Faixa de desconto */}
            <div className="mt-8 bg-gradient-to-r from-secondary to-secondary-dark rounded-2xl p-6 text-white flex items-center gap-4">
              <BadgePercent className="w-10 h-10 shrink-0" />
              <div>
                <p className="font-bold text-lg leading-tight">{p.desconto}</p>
                <p className="text-white/80 text-sm">Aproveite este benefício exclusivo por ser associado do Sindbes.</p>
              </div>
            </div>
          </div>

          {/* Sidebar contato */}
          <aside>
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Fale com {p.nome}</h3>
                <ul className="space-y-3 text-sm mb-5">
                  {p.site && (
                    <li className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-secondary shrink-0" />
                      <a href={p.siteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">{p.site}</a>
                    </li>
                  )}
                  {p.whatsappDisplay && (
                    <li className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-secondary shrink-0" />
                      <span className="text-gray-600">{p.whatsappDisplay}</span>
                    </li>
                  )}
                </ul>

                {p.whatsapp && (
                  <a
                    href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(waMsg)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity mb-2"
                  >
                    <MessageCircle className="w-5 h-5" /> Chamar no WhatsApp
                  </a>
                )}
                {p.siteUrl && (
                  <a
                    href={p.siteUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Globe className="w-5 h-5" /> Visitar site
                  </a>
                )}
              </div>

              <div className="bg-primary/5 rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-3">Ainda não é associado do Sindbes?</p>
                <Link href="/contato" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Associe-se e aproveite <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Outros parceiros */}
        {outros.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6 bicolor-title">Outros <span>parceiros</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {outros.map((o) => (
                <Link key={o.slug} href={`/parceiros/${o.slug}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative h-36 overflow-hidden">
                    <Image src={o.capa} alt={o.nome} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] text-secondary font-semibold uppercase">{o.categoria}</span>
                    <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors mt-1 leading-snug">{o.nome}</h3>
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
            '@type': 'Organization',
            name: p.nome,
            description: p.resumo,
            url: p.siteUrl || undefined,
            memberOf: { '@type': 'Organization', name: 'Sindicato da Beleza' },
          }),
        }}
      />
    </>
  )
}
