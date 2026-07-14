'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, MessageCircle, Phone, Clock } from 'lucide-react'
import { SITE, SERVICES, IMAGES, whatsappUrl } from '@/lib/constants'

export default function ExitPopup() {
  const [show, setShow] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [servico, setServico] = useState('')

  useEffect(() => {
    const dismissed = sessionStorage.getItem('exit_popup_dismissed')
    if (dismissed) return

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0 && !show) {
        setShow(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [show])

  function dismiss() {
    setShow(false)
    sessionStorage.setItem('exit_popup_dismissed', 'true')
  }

  function maskPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const origem = document.title || window.location.pathname
    const msg = `Olá! Quero minha consultoria gratuita. Meu nome é ${nome}, telefone: ${telefone}.${servico ? ` Interesse: ${servico}.` : ''} 📍 Origem: Exit Popup`

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, telefone, origem: `Exit Popup - ${origem}`, pagina_slug: window.location.pathname }),
    }).catch(() => {})

    window.open(whatsappUrl(msg), '_blank')
    dismiss()
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-popup-in grid grid-cols-1 md:grid-cols-2">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 md:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lado da pessoa + contatos */}
        <div className="hidden md:flex flex-col">
          <div className="relative flex-1 min-h-[300px]">
            <Image src={IMAGES.atendente} alt="Wagner, especialista do Sindbes" fill className="object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-bold">Wagner</p>
              <p className="text-white/80 text-xs">Especialista do Sindbes</p>
            </div>
          </div>
          <div className="p-4 space-y-2 bg-bg-alt">
            <a
              href={whatsappUrl('Olá! Quero minha consultoria gratuita sobre meu negócio da beleza.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center justify-center gap-2 w-full py-3 gradient-primary text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              <Phone className="w-4 h-4" /> Ligar agora
            </a>
          </div>
        </div>

        {/* Lado do formulário + urgência */}
        <div className="p-7 md:p-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-4">
            <Clock className="w-3.5 h-3.5" /> Oferta por tempo limitado
          </span>
          <h3 className="text-2xl font-bold text-text leading-tight">Espere! Antes de ir embora…</h3>
          <p className="text-sm text-gray-500 mt-2 mb-5 leading-relaxed">
            Garanta agora uma <strong className="text-primary">consultoria 100% gratuita</strong> sobre como fortalecer o seu negócio da beleza. São <strong>poucas vagas por semana</strong> — não deixe essa passar!
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required
              className="w-full h-12 px-4 rounded-xl border border-gray-200 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <input
              type="tel" placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(maskPhone(e.target.value))} required
              className="w-full h-12 px-4 rounded-xl border border-gray-200 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <select
              value={servico} onChange={(e) => setServico(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 text-base text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none bg-white"
            >
              <option value="">Tipo de serviço...</option>
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.nome}>{s.nome}</option>
              ))}
            </select>
            <button type="submit" className="w-full h-12 gradient-cta text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
              Quero minha consultoria gratuita
            </button>
            <p className="text-xs text-gray-400 text-center">🔒 Seus dados estão protegidos pela LGPD.</p>
          </form>

          <button onClick={dismiss} className="block mx-auto mt-3 text-xs text-gray-400 hover:text-gray-600 underline">
            Não, obrigado
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes popupIn {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-popup-in { animation: popupIn 0.3s ease-out; }
      `}</style>
    </div>
  )
}
