'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { whatsappUrl, SITE } from '@/lib/constants'

const faqs = [
  {
    q: 'Quem pode se associar ao Sindbes?',
    a: 'Profissionais e empresas do setor da beleza de Uberlândia e região, incluindo salões, barbearias, clínicas de estética, e profissionais autônomos.',
  },
  {
    q: 'Quais benefícios o associado recebe?',
    a: 'Planos de saúde e odontológico com condições exclusivas, assessoria jurídica e contábil, treinamentos, acesso a crédito facilitado e muito mais.',
  },
  {
    q: 'Os treinamentos têm certificado?',
    a: 'Sim, todos os treinamentos e qualificações emitem certificado reconhecido, valorizando você e sua equipe no mercado.',
  },
  {
    q: 'Como funciona a assessoria jurídica?',
    a: 'Nossa equipe de advogados especializados oferece consultoria preventiva, resolução de conflitos trabalhistas e apoio na regularização da sua empresa.',
  },
  {
    q: 'Posso contratar apenas o plano de saúde?',
    a: 'Os planos de saúde e odontológico são benefícios exclusivos para associados. Ao se filiar, você já tem acesso a todos os benefícios do Sindbes.',
  },
  {
    q: 'Como faço para me filiar?',
    a: `Entre em contato pelo WhatsApp ${SITE.whatsappDisplay} ou pelo formulário do site. Nossa equipe vai explicar tudo e guiar seu cadastro.`,
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-bg-alt">
      <div className="max-w-[800px] mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Perguntas Frequentes</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Dúvidas <span>comuns</span>
          </h2>
        </div>

        <div className="space-y-3 scroll-reveal">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl overflow-hidden transition-shadow ${openIndex === i ? 'shadow-md ring-1 ring-primary/20' : 'shadow-sm'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className={`font-semibold text-sm pr-4 ${openIndex === i ? 'text-primary' : 'text-text'}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform text-gray-400 ${openIndex === i ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{faq.a}</p>
                  <a
                    href={whatsappUrl(`Olá! Tenho uma dúvida sobre: ${faq.q}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-xs font-semibold text-secondary hover:text-secondary-dark"
                  >
                    Ainda tem dúvida? Fale conosco →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
