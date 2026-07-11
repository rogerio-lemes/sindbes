'use client'

import { useState } from 'react'
import Image from 'next/image'
import { IMAGES, SITE, SERVICES, whatsappUrl } from '@/lib/constants'

export default function ContactSection() {
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [servico, setServico] = useState('')
  const [loading, setLoading] = useState(false)

  function maskPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const origem = document.title || window.location.pathname

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, telefone: whatsapp, email, origem, pagina_slug: window.location.pathname }),
      })
    } catch {}

    const msg = `Olá! Meu nome é ${nome}. WhatsApp: ${whatsapp}. Email: ${email}.${servico ? ` Interesse: ${servico}.` : ''} 📍 Origem: ${origem}`
    window.open(whatsappUrl(msg), '_blank')
    setLoading(false)
  }

  return (
    <section className="py-20" id="contato">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="scroll-reveal text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">FALE CONOSCO</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-8 bicolor-title">
              Agende sua <span>visita</span>
            </h2>
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src={IMAGES.atendente}
                  alt="Atendente Sindbes pronta para ajudar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-semibold text-text">Júlia</p>
                <p className="text-sm text-gray-500">Está online e pronta pra te ajudar 💬</p>
              </div>
            </div>
          </div>

          <div className="scroll-reveal">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold mb-6">Solicite seu agendamento</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Seu nome
                  </label>
                  <input
                    id="contact-nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Como podemos te chamar?"
                  />
                </div>

                <div>
                  <label htmlFor="contact-whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    id="contact-whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(maskPhone(e.target.value))}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="contact-servico" className="block text-sm font-medium text-gray-700 mb-1">
                    Serviço de interesse (opcional)
                  </label>
                  <select
                    id="contact-servico"
                    value={servico}
                    onChange={(e) => setServico(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none bg-white"
                  >
                    <option value="">Selecione...</option>
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.nome}>{s.nome}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 gradient-cta text-white font-bold rounded-xl text-base hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Quero Agendar'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  🔒 Seus dados estão protegidos pela LGPD.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
