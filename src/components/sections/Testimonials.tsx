'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const reviews = [
  {
    name: 'Avaliação Google',
    text: 'Depoimentos reais do Google Meu Negócio serão exibidos aqui. Nenhum depoimento fictício é permitido.',
    rating: 5,
    date: '',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  return (
    <section className="py-20 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Depoimentos</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            O que nossos associados <span>dizem</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm">
            Avaliações reais extraídas do Google Meu Negócio. Nenhum depoimento aqui é fictício.
          </p>
        </div>

        <div className="max-w-2xl mx-auto scroll-reveal">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: reviews[current].rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 italic leading-relaxed mb-6">
              &ldquo;{reviews[current].text}&rdquo;
            </p>
            <p className="font-semibold text-text">{reviews[current].name}</p>
            {reviews[current].date && (
              <p className="text-xs text-gray-400 mt-1">{reviews[current].date}</p>
            )}
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrent((current - 1 + reviews.length) % reviews.length)}
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrent((current + 1) % reviews.length)}
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
