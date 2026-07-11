'use client'

import { useState } from 'react'
import { User, Phone, Send, GripHorizontal } from 'lucide-react'
import { SITE, SERVICES, whatsappUrl } from '@/lib/constants'

export default function MobileCaptureBar() {
  const [collapsed, setCollapsed] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [servico, setServico] = useState('')

  function maskPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const origem = document.title || window.location.pathname
    const msg = `Olá! Meu nome é ${nome}, telefone: ${telefone}.${servico ? ` Interesse: ${servico}.` : ''} 📍 Origem: ${origem}`
    window.open(whatsappUrl(msg), '_blank')
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${collapsed ? 'translate-y-[calc(100%-40px)]' : ''}`}>
      <div className="bg-white border-t-4 border-primary rounded-t-2xl shadow-2xl px-6 pt-2 pb-6">
        <div
          className="flex justify-center py-2 cursor-grab"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {!collapsed && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="font-bold text-lg text-text">Se desejar, ligamos pra você</p>
            <p className="text-sm text-gray-500">Deixe seu nome e telefone. Retornamos o mais rápido possível.</p>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => setTelefone(maskPhone(e.target.value))}
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

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
              className="w-full h-12 gradient-cta text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              ✈️ Quero que me liguem
            </button>

            <p className="text-xs text-gray-400 text-center">
              🔒 Seus dados serão usados apenas para contato.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
