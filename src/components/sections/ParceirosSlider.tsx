'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PARCEIROS } from '@/lib/parceiros'
import { Handshake, BadgePercent, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ParceirosSlider() {
  const [current, setCurrent] = useState(0)
  const total = PARCEIROS.length

  useEffect(() => {
    if (total <= 1) return
    const interval = setInterval(() => setCurrent((c) => (c + 1) % total), 5000)
    return () => clearInterval(interval)
  }, [total])

  const p = PARCEIROS[current]

  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-10 scroll-reveal">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
            <Handshake className="w-4 h-4" /> Parceiros
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Vantagens exclusivas com nossos <span>parceiros</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Ser associado do Sindibes é ter acesso a descontos e condições especiais com empresas parceiras selecionadas.
          </p>
        </div>

        <div className="relative scroll-reveal">
          <Link
            href={`/parceiros/${p.slug}`}
            className="group block bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 md:h-[380px]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="relative h-56 md:h-full overflow-hidden">
                <Image src={p.capa} alt={p.nome} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 to-transparent" />
                <span className="absolute top-4 left-4 bg-white/95 text-primary text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">{p.categoria}</span>
              </div>

              <div className="p-8 md:p-10 flex flex-col justify-center overflow-hidden">
                <h3 className="text-2xl font-bold text-text mb-3 line-clamp-1">{p.nome}</h3>
                <p className="text-gray-500 leading-relaxed mb-5 line-clamp-3">{p.resumo}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full w-fit mb-6">
                  <BadgePercent className="w-4 h-4 shrink-0" /> <span className="line-clamp-1">{p.desconto}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-white font-semibold gradient-primary px-6 py-3 rounded-xl w-fit group-hover:opacity-90 transition-opacity">
                  Conhecer parceiro <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {total > 1 && (
            <>
              <button
                onClick={() => setCurrent((current - 1 + total) % total)}
                className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors z-10"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrent((current + 1) % total)}
                className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors z-10"
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {total > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {PARCEIROS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-primary/50'}`}
                aria-label={`Parceiro ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
