import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PARCEIROS } from '@/lib/parceiros'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Handshake, BadgePercent, ArrowRight, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Parceiros | Sindbes - Sindicato da Beleza',
  description: 'Conheça os parceiros do Sindbes que oferecem produtos, serviços e condições exclusivas para os associados do Sindicato da Beleza de Uberlândia.',
  alternates: { canonical: '/parceiros' },
}

export default function ParceirosPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Parceiros' }]} />

      <section className="max-w-[1200px] mx-auto px-4 pt-14 pb-8 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
          <Handshake className="w-4 h-4" /> Rede de Parceiros
        </span>
        <h1 className="text-3xl md:text-5xl font-bold mt-3 bicolor-title">
          Parceiros que <span>valorizam você</span>
        </h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Empresas parceiras do Sindbes que oferecem produtos, serviços e condições exclusivas para os associados. Ser do Sindbes é ter vantagens de verdade.
        </p>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 pb-16">
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
                <span className="absolute top-3 left-3 bg-white/95 text-primary text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">{p.categoria}</span>
                {p.destaque && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" /> Oficial
                  </span>
                )}
                <div className="absolute bottom-3 left-4 right-4">
                  <h2 className="font-bold text-white text-lg drop-shadow-md">{p.nome}</h2>
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

      <section className="max-w-[1200px] mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Sua empresa quer ser parceira do Sindbes?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-6">
            Ofereça vantagens aos nossos associados e ganhe visibilidade junto a centenas de profissionais e empresas da beleza de Uberlândia.
          </p>
          <Link href="/contato" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark transition-colors">
            Quero ser parceiro <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
