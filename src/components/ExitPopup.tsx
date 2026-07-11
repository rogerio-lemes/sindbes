'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { SITE, SERVICES, whatsappUrl } from '@/lib/constants'

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
    const msg = `Olá! Meu nome é ${nome}, telefone: ${telefone}.${servico ? ` Interesse: ${servico}.` : ''} 📍 Origem: Exit Popup - ${origem}`

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

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-popup-in">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">🤚</span>
          <h3 className="text-xl font-bold text-text">Espere! Antes de sair...</h3>
          <p className="text-sm text-gray-500 mt-2">
            Deixe seu contato e receba uma consultoria gratuita sobre como fortalecer seu negócio da beleza.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-200 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={(e) => setTelefone(maskPhone(e.target.value))}
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-200 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <select
            value={servico}
            onChange={(e) => setServico(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-gray-200 text-base text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none bg-white"
          >
            <option value="">Tipo de serviço...</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.nome}>{s.nome}</option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full h-12 gradient-cta text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Quero minha consultoria gratuita
          </button>

          <p className="text-xs text-gray-400 text-center">
            🔒 Seus dados estão protegidos pela LGPD.
          </p>
        </form>

        <button
          onClick={dismiss}
          className="block mx-auto mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
        >
          Não, obrigado
        </button>
      </div>

      <style jsx>{`
        @keyframes popupIn {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-popup-in {
          animation: popupIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
