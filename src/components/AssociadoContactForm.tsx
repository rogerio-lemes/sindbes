'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

interface Props {
  associadoNome: string
  whatsapp: string
}

export default function AssociadoContactForm({ associadoNome, whatsapp }: Props) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

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
        body: JSON.stringify({
          nome,
          telefone,
          mensagem,
          origem: `Filiado: ${associadoNome}`,
          pagina_slug: `associados`,
        }),
      })
    } catch {
      /* segue para o WhatsApp mesmo se a API falhar */
    }
    const texto = `Olá! Vim pelo Sindibes e gostaria de falar com ${associadoNome}. Meu nome é ${nome}.`
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`, '_blank')
    setEnviando(false)
    setEnviado(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        placeholder="Seu nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
      />
      <input
        type="tel"
        required
        placeholder="Seu WhatsApp"
        value={telefone}
        onChange={(e) => setTelefone(maskPhone(e.target.value))}
        className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
      />
      <textarea
        placeholder="Sua mensagem (opcional)"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm resize-none"
      />
      <button
        type="submit"
        disabled={enviando}
        className="w-full h-12 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {enviando ? 'Enviando...' : enviado ? 'Enviado! Abrindo WhatsApp...' : (<><Send className="w-4 h-4" /> Enviar mensagem</>)}
      </button>
      <p className="text-[11px] text-gray-400 text-center">
        Seus dados serão usados apenas para contato. Sem spam.
      </p>
    </form>
  )
}
