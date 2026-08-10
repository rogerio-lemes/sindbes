'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const AMBIENTES = [
  { src: '/images/ambiente-cabeleireiro.jpg', label: 'Salão' },
  { src: '/images/ambiente-barbearia.jpg', label: 'Barbearia' },
  { src: '/images/ambiente-esmalteria.jpg', label: 'Esmalteria' },
  { src: '/images/ambiente-estetica.jpg', label: 'Estética' },
  { src: '/images/ambiente-corte.jpg', label: 'Corte' },
  { src: '/images/ambiente-facial.jpg', label: 'Facial' },
  { src: '/images/ambiente-maquiagem.jpg', label: 'Maquiagem' },
  { src: '/images/ambiente-spa.jpg', label: 'Spa' },
]

export default function About() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % AMBIENTES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Coluna da imagem (bem visível) */}
          <div className="scroll-reveal">
            <div className="relative rounded-3xl overflow-hidden shadow-xl h-[380px] md:h-[460px]">
              {AMBIENTES.map((amb, i) => (
                <div
                  key={amb.src}
                  className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Image
                    src={amb.src}
                    alt={`Profissional da beleza em ${amb.label}`}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
              {/* leve gradiente só na base para a legenda */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-4 left-4 bg-white/95 text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                {AMBIENTES[current].label}
              </span>

              {/* Badge +500 flutuante */}
              <div className="absolute top-4 right-4 gradient-primary text-white rounded-2xl px-5 py-3 shadow-lg">
                <span className="text-2xl font-bold block leading-none">+500</span>
                <span className="text-[11px] opacity-90">associados ativos</span>
              </div>
            </div>

            {/* Badges indicadores dos ambientes */}
            <div className="flex flex-wrap gap-2 mt-4">
              {AMBIENTES.map((amb, i) => (
                <button
                  key={amb.src}
                  onClick={() => setCurrent(i)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    i === current
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {amb.label}
                </button>
              ))}
            </div>
          </div>

          {/* Coluna de informações (mockup/card) */}
          <div className="scroll-reveal">
            <div className="bg-bg-alt rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Sobre Nós</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-5 bicolor-title">
                Quem é o <span>Sindibes</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                O Sindibes é o Sindicato da Beleza de Uberlândia, uma entidade dedicada a representar, qualificar e fortalecer profissionais e empresas do setor da beleza: salões, barbearias, esmalterias, clínicas de estética e muito mais.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Oferecemos treinamentos, assessoria jurídica e contábil, benefícios exclusivos como planos de saúde e odontológico, além de suporte completo para a regularização e crescimento do seu negócio.
              </p>

              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
                {[
                  'Treinamentos e qualificações reconhecidas',
                  'Assessoria jurídica e contábil especializada',
                  'Planos de saúde e odontológico exclusivos',
                  'Acesso facilitado a crédito e financiamento',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contato"
                className="inline-flex items-center justify-center px-8 py-4 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Quero ser associado
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
