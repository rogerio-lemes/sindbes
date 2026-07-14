import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { EVENTOS, getEvento, formatarData } from '@/lib/eventos'
import Breadcrumbs from '@/components/Breadcrumbs'
import Gallery from '@/components/Gallery'
import EventoRsvpForm from '@/components/eventos/EventoRsvpForm'
import { Calendar, Clock, MapPin, Tag, Images, CheckCircle2, ArrowRight } from 'lucide-react'

export function generateStaticParams() {
  return EVENTOS.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const e = getEvento(slug)
  if (!e) return {}
  return {
    title: `${e.titulo} | Eventos Sindbes`.slice(0, 60),
    description: e.resumo.slice(0, 158),
    alternates: { canonical: `/eventos/${e.slug}` },
  }
}

export default async function EventoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const e = getEvento(slug)
  if (!e) notFound()

  const d = formatarData(e.data)
  const outros = EVENTOS.filter((x) => x.slug !== e.slug).slice(0, 3)

  return (
    <>
      <Breadcrumbs items={[{ label: 'Eventos', href: '/eventos' }, { label: e.titulo }]} />

      {/* Cover */}
      <section className="relative h-[320px] md:h-[440px] overflow-hidden">
        <Image src={e.capa} alt={e.titulo} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="relative z-10 h-full max-w-[1200px] mx-auto px-4 flex flex-col justify-end pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full">{e.categoria}</span>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${e.futuro ? 'bg-white/90 text-primary' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
              {e.futuro ? 'Próximo evento' : 'Evento realizado'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white max-w-3xl">{e.titulo}</h1>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Conteúdo */}
          <div>
            <h2 className="text-xl font-bold bicolor-title mb-4">Sobre o <span>evento</span></h2>
            {e.descricao.map((p, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-4">{p}</p>
            ))}

            {/* Galeria */}
            <div className="flex items-center gap-2 mt-8 mb-4">
              <Images className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold bicolor-title">Galeria de <span>fotos</span></h2>
            </div>
            <Gallery images={e.galeria} alt={e.titulo} />
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex flex-col items-center justify-center text-white shrink-0">
                    <span className="text-2xl font-bold leading-none">{d.dia}</span>
                    <span className="text-[10px] uppercase font-semibold">{d.mes}</span>
                  </div>
                  <div>
                    <p className="font-bold text-text leading-tight">{e.titulo}</p>
                    <p className="text-xs text-gray-400 mt-1">{d.dia} de {d.mes} de {d.ano}</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-secondary shrink-0" /><span className="text-gray-600">{e.horario}</span></li>
                  <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-secondary shrink-0" /><span className="text-gray-600">{e.local} — {e.endereco}</span></li>
                  <li className="flex items-start gap-3"><Tag className="w-5 h-5 text-secondary shrink-0" /><span className="text-gray-600">{e.categoria}</span></li>
                </ul>
              </div>

              {e.futuro ? (
                <div className="bg-bg-alt rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-base mb-1">Confirme sua presença</h3>
                  <p className="text-xs text-gray-500 mb-4">Garanta sua vaga neste evento.</p>
                  <EventoRsvpForm eventoTitulo={e.titulo} />
                </div>
              ) : (
                <div className="bg-bg-alt rounded-2xl border border-gray-100 p-6 text-center">
                  <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
                  <p className="font-bold text-text">Evento já realizado</p>
                  <p className="text-xs text-gray-500 mt-1 mb-4">Confira a galeria e fique de olho nos próximos.</p>
                  <Link href="/eventos" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">Ver próximos eventos <ArrowRight className="w-4 h-4" /></Link>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Outros eventos */}
        {outros.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6 bicolor-title">Outros <span>eventos</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {outros.map((o) => {
                const od = formatarData(o.data)
                return (
                  <Link key={o.slug} href={`/eventos/${o.slug}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative h-36 overflow-hidden">
                      <Image src={o.capa} alt={o.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <span className="text-[11px] text-secondary font-semibold uppercase">{o.categoria} · {od.dia} {od.mes}</span>
                      <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors mt-1 leading-snug">{o.titulo}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: e.titulo,
            startDate: e.data,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: { '@type': 'Place', name: e.local, address: e.endereco },
            description: e.resumo,
            organizer: { '@type': 'Organization', name: 'Sindbes - Sindicato da Beleza' },
          }),
        }}
      />
    </>
  )
}
