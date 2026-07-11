'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IMAGES, whatsappUrl, SITE } from '@/lib/constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    image: IMAGES.hero1,
    alt: 'Treinamentos profissionais Sindbes Uberlândia',
    headline: 'Qualifique sua equipe',
    highlight: 'com quem entende de beleza',
    description: 'Treinamentos, certificações e capacitação para profissionais e empresas da beleza em Uberlândia.',
    cta: 'Conheça nossos treinamentos',
    href: '/treinamentos-e-qualificacoes-profissionais',
  },
  {
    image: IMAGES.hero2,
    alt: 'Equipe salão de beleza qualificação Sindbes',
    headline: 'Assessoria completa',
    highlight: 'para seu negócio crescer',
    description: 'Jurídico, contábil, planejamento e gestão: tudo que seu salão precisa em um só lugar.',
    cta: 'Fale com um especialista',
    href: '/contato',
  },
  {
    image: IMAGES.hero3,
    alt: 'Benefícios associados Sindbes sindicato beleza',
    headline: 'Benefícios exclusivos',
    highlight: 'para associados',
    description: 'Planos de saúde, odontológico, crédito facilitado e muito mais para quem faz parte do Sindbes.',
    cta: 'Veja os benefícios',
    href: '/beneficios-para-associados',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const slide = slides[current]

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={s.image}
            alt={s.alt}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-[1200px] mx-auto px-4 flex items-center">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {slide.headline}{' '}
            <span className="text-secondary">{slide.highlight}</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            {slide.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={slide.href}
              className="inline-flex items-center justify-center px-8 py-4 gradient-cta text-white font-semibold rounded-xl text-base hover:opacity-90 transition-opacity"
            >
              {slide.cta}
            </Link>
            <a
              href={whatsappUrl(`Olá! Vim pelo site da ${SITE.name} e gostaria de mais informações.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl text-base border border-white/30 hover:bg-white/20 transition-colors"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-colors ${i === current ? 'bg-secondary' : 'bg-white/50'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Próximo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  )
}
