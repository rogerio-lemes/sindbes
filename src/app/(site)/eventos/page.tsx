import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { EVENTOS, formatarData } from '@/lib/eventos'
import Breadcrumbs from '@/components/Breadcrumbs'
import EventosCalendar from '@/components/eventos/EventosCalendar'
import EventoRsvpForm from '@/components/eventos/EventoRsvpForm'
import NewsletterForm from '@/components/eventos/NewsletterForm'
import { CalendarDays, Clock, MapPin, Sparkles, ArrowRight, Images, Bell } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Eventos | Sindbes - Sindicato da Beleza',
  description: 'Confira os próximos eventos, workshops, cursos e palestras do Sindbes em Uberlândia, além dos eventos já realizados. Confirme sua presença.',
  alternates: { canonical: '/eventos' },
}

export default function EventosPage() {
  const futuros = EVENTOS.filter((e) => e.futuro)
  const passados = EVENTOS.filter((e) => !e.futuro)

  return (
    <>
      <Breadcrumbs items={[{ label: 'Eventos' }]} />

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-4 pt-14 pb-8 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
          <CalendarDays className="w-4 h-4" /> Agenda Sindbes
        </span>
        <h1 className="text-3xl md:text-5xl font-bold mt-3 bicolor-title">
          Eventos que movem a <span>beleza</span>
        </h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Workshops, cursos, palestras e encontros para profissionais e empresas da beleza de Uberlândia. Participe, aprenda e faça networking com o Sindbes.
        </p>
      </section>

      {/* Calendário + Próximos eventos */}
      <section className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          <div className="lg:sticky lg:top-24">
            <EventosCalendar />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-secondary" />
              <h2 className="text-2xl md:text-3xl font-bold bicolor-title">Próximos <span>eventos</span></h2>
            </div>

            <div className="space-y-6">
              {futuros.map((e) => {
                const d = formatarData(e.data)
                return (
                  <div key={e.slug} id={`ev-${e.slug}`} className="scroll-mt-24 bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-56 md:h-full min-h-[240px]">
                      <Image src={e.capa} alt={e.titulo} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 left-4 bg-white rounded-2xl shadow-lg px-4 py-2 text-center">
                        <span className="block text-2xl font-bold text-primary leading-none">{d.dia}</span>
                        <span className="block text-xs font-semibold text-gray-500 uppercase">{d.mes} {d.ano}</span>
                      </div>
                      <span className="absolute bottom-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">{e.categoria}</span>
                    </div>

                    <div className="p-6 md:p-7">
                      <h3 className="font-bold text-lg text-text mb-2">{e.titulo}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">{e.resumo}</p>
                      <ul className="space-y-1.5 text-xs text-gray-500 mb-5">
                        <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-secondary" /> {e.horario}</li>
                        <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-secondary" /> {e.local}</li>
                      </ul>
                      <EventoRsvpForm eventoTitulo={e.titulo} />
                      <Link href={`/eventos/${e.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-4 hover:gap-2 transition-all">
                        Ver detalhes do evento <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Eventos passados */}
      <section className="bg-bg-alt py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Images className="w-5 h-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold bicolor-title">Eventos <span>realizados</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {passados.map((e) => {
              const d = formatarData(e.data)
              return (
                <Link key={e.slug} href={`/eventos/${e.slug}`} id={`ev-${e.slug}`} className="group scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                  <div className="relative h-44 overflow-hidden">
                    <Image src={e.capa} alt={e.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/90 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">{e.categoria}</span>
                    <span className="absolute bottom-3 left-3 text-white text-xs font-medium">{d.dia} {d.mes} {d.ano}</span>
                    <span className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-xs"><Images className="w-3.5 h-3.5" /> {e.galeria.length}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-text group-hover:text-primary transition-colors leading-snug mb-2">{e.titulo}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{e.resumo}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-secondary font-semibold mt-3">Ver galeria <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Cadastro / newsletter */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="gradient-primary rounded-3xl p-10 md:p-14 text-center text-white">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm mb-5">
            <Bell className="w-7 h-7 text-white" />
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Receba as novidades do Sindbes</h2>
          <p className="text-white/85 max-w-xl mx-auto mb-8">
            Cadastre-se e seja o primeiro a saber sobre eventos, treinamentos, benefícios e oportunidades para o setor da beleza em Uberlândia.
          </p>
          <NewsletterForm />
        </div>
      </section>

      <p className="text-xs text-gray-400 pb-10 text-center px-4">
        Os eventos exibidos são exemplos demonstrativos. Os eventos reais serão cadastrados no painel administrativo.
      </p>
    </>
  )
}
