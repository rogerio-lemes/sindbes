'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTenant, useWhatsappUrl } from '@/components/TenantProvider'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { VitrineSlide } from '@/lib/tenant/vitrine'
import VitrineLeiSalaoParceiro, { ID_SLIDE_LEI, IMAGEM_SLIDE_LEI } from '@/components/sections/VitrineLeiSalaoParceiro'

/** Slide fixo de alerta da Lei Salão-Parceiro: sempre o primeiro da vitrine. */
const SLIDE_LEI: VitrineSlide = {
  id: ID_SLIDE_LEI, imagem_url: IMAGEM_SLIDE_LEI, titulo: 'Lei Salão-Parceiro',
  destaque: null, subtitulo: null, link_url: '/lei-salao-parceiro', cta_texto: null, ordem: 0,
}
/** O alerta fica mais tempo na tela que os demais slides. */
const TEMPO_LEI = 9000
const TEMPO_PADRAO = 5000

export default function HeroCarousel({ slides: slidesPainel }: { slides: VitrineSlide[] }) {
  const slides = [SLIDE_LEI, ...slidesPainel.filter((s) => s.id !== ID_SLIDE_LEI)]
  const { config } = useTenant()
  const [current, setCurrent] = useState(0)
  const whatsUrl = useWhatsappUrl(`Olá! Vim pelo site da ${config.nome} e gostaria de mais informações.`)

  const idAtual = slides[current]?.id
  useEffect(() => {
    if (slides.length <= 1) return
    const tempo = idAtual === ID_SLIDE_LEI ? TEMPO_LEI : TEMPO_PADRAO
    const timer = setTimeout(() => setCurrent((prev) => (prev + 1) % slides.length), tempo)
    return () => clearTimeout(timer)
  }, [current, idAtual, slides.length])

  if (slides.length === 0) return null

  const slide = slides[Math.min(current, slides.length - 1)]

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={s.imagem_url}
            alt={s.titulo || 'Destaque'}
            fill
            className="object-cover"
            priority={i === 0}
            unoptimized
          />
          {s.id === ID_SLIDE_LEI ? (
            <>
              {/* Alerta: fundo azul-escuro com brilho vermelho para chamar atenção */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1B2444] via-[#1B2444]/85 to-[#1B2444]/40" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.35),transparent_55%)]" />
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-600 via-[#FFC94D] to-red-600" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
          )}
        </div>
      ))}

      <div className="relative z-10 h-full max-w-[1200px] mx-auto px-4 md:px-16 flex items-center">
        {slide.id === ID_SLIDE_LEI ? <VitrineLeiSalaoParceiro /> : (
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {slide.titulo}{' '}
            {slide.destaque && <span className="text-[#8FD9CE]">{slide.destaque}</span>}
          </h1>
          {slide.subtitulo && (
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              {slide.subtitulo}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            {slide.link_url && slide.cta_texto && (
              <Link
                href={slide.link_url}
                className="inline-flex items-center justify-center px-8 py-4 gradient-cta text-white font-semibold rounded-xl text-base hover:opacity-90 transition-opacity"
              >
                {slide.cta_texto}
              </Link>
            )}
            <a
              href={whatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl text-base border border-white/30 hover:bg-white/20 transition-colors"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-colors ${i === current ? 'bg-secondary' : 'bg-white/50'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hidden md:flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrent((current + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hidden md:flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </section>
  )
}
