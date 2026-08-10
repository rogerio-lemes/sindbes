'use client'

import { useState } from 'react'
import ConfirmModal from '@/components/ConfirmModal'
import { Bell, Send } from 'lucide-react'

export default function NewsletterForm() {
  const [nome, setNome] = useState('')
  const [contato, setContato] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [modal, setModal] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    const isEmail = contato.includes('@')
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email: isEmail ? contato : null,
          telefone: isEmail ? null : contato,
          origem: 'Cadastro - Informações do Sindibes',
          pagina_slug: 'eventos',
        }),
      })
    } catch {}
    setEnviando(false)
    setModal(true)
    setNome(''); setContato('')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
        <input
          type="text" required placeholder="Seu nome" value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="flex-1 h-13 px-4 py-3.5 rounded-xl border-0 text-sm text-text outline-none focus:ring-2 focus:ring-white/60"
        />
        <input
          type="text" required placeholder="E-mail ou WhatsApp" value={contato}
          onChange={(e) => setContato(e.target.value)}
          className="flex-1 h-13 px-4 py-3.5 rounded-xl border-0 text-sm text-text outline-none focus:ring-2 focus:ring-white/60"
        />
        <button type="submit" disabled={enviando} className="h-13 px-6 py-3.5 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60">
          <Send className="w-4 h-4" /> {enviando ? 'Enviando...' : 'Quero receber'}
        </button>
      </form>

      <ConfirmModal
        open={modal}
        onClose={() => setModal(false)}
        titulo="Cadastro realizado!"
        mensagem="Pronto! Você vai receber em primeira mão as novidades, eventos e benefícios do Sindibes. Fique de olho no seu WhatsApp e e-mail."
      />
    </>
  )
}
