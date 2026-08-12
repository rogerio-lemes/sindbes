'use client'

import { useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'

/** Copia texto para a área de transferência, com fallback para navegadores antigos. */
async function copiar(texto: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(texto)
      return true
    } catch {
      /* cai no fallback */
    }
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = texto
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    return true
  } catch {
    return false
  }
}

export function CopyButton({
  texto, rotulo = 'Copiar', cor = 'primary',
}: {
  texto: string
  rotulo?: string
  cor?: 'primary' | 'secondary'
}) {
  const [ok, setOk] = useState(false)

  async function handle() {
    if (await copiar(texto)) {
      setOk(true)
      setTimeout(() => setOk(false), 1800)
    }
  }

  const ativo = cor === 'secondary' ? 'bg-secondary border-secondary' : 'bg-primary border-primary'

  return (
    <button
      type="button"
      onClick={handle}
      className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border text-xs font-semibold transition-colors shrink-0 ${
        ok
          ? `${ativo} text-white`
          : 'border-gray-200 bg-white text-gray-500 hover:text-text hover:border-gray-300'
      }`}
    >
      {ok ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {ok ? 'Copiado' : rotulo}
    </button>
  )
}

/** Botão que abre o link em nova aba. */
export function OpenButton({
  href, rotulo = 'Abrir', cor = 'primary',
}: {
  href: string
  rotulo?: string
  cor?: 'primary' | 'secondary'
}) {
  const base = cor === 'secondary'
    ? 'bg-secondary hover:bg-secondary/90'
    : 'bg-primary hover:bg-primary/90'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold text-white transition-colors shrink-0 ${base}`}
    >
      <ExternalLink className="w-3.5 h-3.5" />
      {rotulo}
    </a>
  )
}
