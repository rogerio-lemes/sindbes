import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTenant } from '@/lib/tenant'
import { ASSOCIADOS } from '@/lib/associados'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Sparkles, MapPin, ArrowRight, Store, BadgeCheck } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `Filiados | ${config.nome}`,
    description: `Conheça os salões, barbearias e clínicas filiados ao ${config.nome}. Vitrine de associados e novos filiados.`,
    alternates: { canonical: '/associados' },
  }
}

function AssociadoCard({ a, i = 0 }: { a: (typeof ASSOCIADOS)[number]; i?: number }) {
  return (
    <Link
      href={`/associados/${a.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 scroll-reveal"
      style={{ transitionDelay: `${i * 70}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        <Image src={a.capa} alt={a.nome} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/95 text-primary text-xs font-semibold px-3 py-1 rounded-full shadow backdrop-blur-sm">
          {a.categoria}
        </span>
        {a.novo && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            <Sparkles className="w-3 h-3" /> Novo
          </span>
        )}
        {/* Nome sobre a imagem */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-bold text-white text-lg drop-shadow-md">{a.nome}</h3>
        </div>
      </div>
      <div className="p-5 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin className="w-3.5 h-3.5 text-secondary" /> {a.mapsQuery}
        </p>
        <span className="inline-flex items-center gap-1 text-sm text-secondary font-semibold shrink-0">
          Ver perfil <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  )
}

export default function FiliadosPage() {
  const novos = ASSOCIADOS.filter((a) => a.novo)

  return (
    <>
      <Breadcrumbs items={[{ label: 'Associados' }, { label: 'Filiados' }]} />

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-4 pt-14 pb-8 text-center scroll-reveal">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
          <Store className="w-4 h-4" /> Rede de Filiados
        </span>
        <h1 className="text-3xl md:text-5xl font-bold mt-3 bicolor-title">
          Conheça quem faz parte do <span>Sindbes</span>
        </h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Salões, barbearias, esmalterias, clínicas de estética e profissionais da beleza que confiam no Sindicato da Beleza de Uberlândia. Apoie quem faz parte da nossa rede.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          <div className="text-center">
            <span className="block text-3xl font-bold text-primary">{ASSOCIADOS.length}+</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Filiados na vitrine</span>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <span className="block text-3xl font-bold text-primary">+500</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Associados ativos</span>
          </div>
        </div>
      </section>

      {/* Novos Associados */}
      {novos.length > 0 && (
        <section id="novos" className="bg-bg-alt py-16 scroll-mt-24">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex items-center gap-2 mb-8 scroll-reveal">
              <Sparkles className="w-5 h-5 text-secondary" />
              <h2 className="text-2xl md:text-3xl font-bold bicolor-title">Novos <span>Associados</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {novos.map((a, i) => (
                <AssociadoCard key={a.slug} a={a} i={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vitrine completa */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="flex items-center gap-2 mb-8 scroll-reveal">
          <BadgeCheck className="w-5 h-5 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold bicolor-title">Vitrine de <span>Filiados</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ASSOCIADOS.map((a, i) => (
            <AssociadoCard key={a.slug} a={a} i={i} />
          ))}
        </div>
      </section>

      {/* CTA seja um filiado */}
      <section className="max-w-[1200px] mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Sua empresa também pode estar aqui</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-6">
            Filie-se ao Sindbes e ganhe visibilidade na nossa vitrine de associados, além de treinamentos, assessoria e benefícios exclusivos.
          </p>
          <Link href="/contato" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark transition-colors">
            Quero ser um filiado <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <p className="text-xs text-gray-400 pb-10 text-center px-4">
        Os filiados exibidos são exemplos demonstrativos. Cadastre os associados reais no painel administrativo.
      </p>
    </>
  )
}
