import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PARCEIROS } from '@/lib/parceiros'
import { SITE } from '@/lib/constants'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  Handshake, BadgePercent, ArrowRight, Sparkles,
  MapPin, Phone, Mail, Clock, UserCheck,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Parceiros | Sindibes - Sindicato da Beleza',
  description: 'Conheça os parceiros do Sindibes, veja nossa localização e cadastre-se como parceiro ou associado.',
  alternates: { canonical: '/parceiros' },
}

export default function ParceirosPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Parceiros' }]} />

      {/* ── Hero ── */}
      <section className="max-w-[1200px] mx-auto px-4 pt-14 pb-10 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
          <Handshake className="w-4 h-4" /> Rede de Parceiros
        </span>
        <h1 className="text-3xl md:text-5xl font-bold mt-3 bicolor-title">
          Parceiros que <span>valorizam você</span>
        </h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Empresas parceiras do Sindibes que oferecem produtos, serviços e condições exclusivas
          para os associados. Ser do Sindibes é ter vantagens de verdade.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <Link
            href="/faca-parte"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/25"
          >
            <Handshake className="w-4 h-4" /> Quero ser Parceiro
          </Link>
          <Link
            href="/faca-parte#associado"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition shadow-lg shadow-secondary/25"
          >
            <UserCheck className="w-4 h-4" /> Quero ser Associado
          </Link>
        </div>
      </section>

      {/* ── Mapa + Contato ── */}
      <section className="max-w-[1200px] mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Mapa */}
          <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 min-h-[320px]">
            <iframe
              title="Localização Sindibes"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE.address + ', Uberlândia')}&output=embed&z=15`}
              width="100%"
              height="100%"
              style={{ minHeight: 320, border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Informações */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col justify-between">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                Onde estamos
              </span>
              <h2 className="text-2xl font-bold text-text mb-6">Venha nos visitar</h2>

              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm">Endereço</p>
                    <p className="text-gray-500 text-sm mt-0.5">{SITE.address}</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm">Telefone / WhatsApp</p>
                    <a
                      href={`https://wa.me/${SITE.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm hover:underline mt-0.5 inline-block"
                    >
                      {SITE.whatsappDisplay}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm">E-mail</p>
                    <a href={`mailto:${SITE.email}`} className="text-primary text-sm hover:underline mt-0.5 inline-block">
                      {SITE.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm">Horário de atendimento</p>
                    <p className="text-gray-500 text-sm mt-0.5">{SITE.horario}</p>
                  </div>
                </li>
              </ul>
            </div>

            <a
              href={SITE.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition"
            >
              <MapPin className="w-4 h-4" /> Abrir no Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ── Parceiros cadastrados ── */}
      {PARCEIROS.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 pb-16">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
              <BadgePercent className="w-4 h-4" /> Parceiros oficiais
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2 text-text">Quem já faz parte da rede</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARCEIROS.map((p) => (
              <Link
                key={p.slug}
                href={`/parceiros/${p.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image src={p.capa} alt={p.nome} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/95 text-primary text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                    {p.categoria}
                  </span>
                  {p.destaque && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" /> Oficial
                    </span>
                  )}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-bold text-white text-lg drop-shadow-md">{p.nome}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{p.resumo}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
                    <BadgePercent className="w-3.5 h-3.5" /> {p.desconto}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-secondary font-semibold">
                    Ver parceiro <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA final ── */}
      <section className="max-w-[1200px] mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Pronto para fazer parte?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Cadastre-se como parceiro ou associado — é rápido e nossa equipe entrará em contato para dar continuidade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/faca-parte"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition shadow-lg"
            >
              <Handshake className="w-5 h-5" /> Quero ser Parceiro
            </Link>
            <Link
              href="/faca-parte"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition shadow-lg shadow-secondary/30"
            >
              <UserCheck className="w-5 h-5" /> Quero ser Associado
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
