'use client'

import { useState } from 'react'
import { useTenant } from '@/components/TenantProvider'
import ConfirmModal from '@/components/ConfirmModal'
import { Send, MessageCircle } from 'lucide-react'

export default function EventoRsvpForm({ eventoTitulo }: { eventoTitulo: string }) {
  const { config } = useTenant()
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [modal, setModal] = useState(false)

  function maskPhone(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, telefone, origem: `Confirmação de presença: ${eventoTitulo}`, pagina_slug: 'eventos' }),
      })
    } catch {}
    setEnviando(false)
    setModal(true)
    setNome(''); setTelefone('')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text" required placeholder="Seu nome" value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
        />
        <input
          type="tel" required placeholder="Seu WhatsApp" value={telefone}
          onChange={(e) => setTelefone(maskPhone(e.target.value))}
          className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
        />
        <button type="submit" disabled={enviando} className="w-full h-12 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60">
          <Send className="w-4 h-4" /> {enviando ? 'Enviando...' : 'Confirmar presença'}
        </button>
        <a
          href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Olá! Quero confirmar minha presença no evento "${eventoTitulo}".`)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full h-12 bg-[#25D366] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-4 h-4" /> Confirmar pelo WhatsApp
        </a>
      </form>

      <ConfirmModal
        open={modal}
        onClose={() => setModal(false)}
        titulo="Presença confirmada!"
        mensagem={`Sua presença no evento "${eventoTitulo}" foi registrada. Em breve enviaremos os detalhes pelo WhatsApp. Até lá!`}
        ctaLabel="Ver outros eventos"
        ctaHref="/eventos"
      />
    </>
  )
}
