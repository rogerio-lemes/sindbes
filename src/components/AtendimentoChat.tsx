'use client'

/**
 * Balão de atendimento do canto da tela.
 *
 * Não abre mais janela de conversa: qualquer clique no balão (convite ou
 * versão menor) leva direto ao WhatsApp do Wagner com a mensagem pronta.
 * A foto flutuante logo abaixo (FloatingButtons) faz o mesmo.
 *
 * Estados: 'convite' aparece depois de alguns segundos; ao fechar no X vira
 * 'minimizado' (balão menor), lembrado durante a visita.
 */
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, MessageCircle } from 'lucide-react'
import { useTenant } from '@/components/TenantProvider'
import { useDeveSumir } from '@/components/OverlayProvider'
import { ATENDIMENTO_PADRAO, type AtendimentoConfig } from '@/lib/atendimento/config'

type Estado = 'convite' | 'minimizado'

const CHAVE_SESSAO = 'atendimento_estado'

/** WhatsApp pessoal do Wagner (consultor do Sindibes). */
const WAGNER_WHATS = '5534984274161'
const MSG_WAGNER = 'Olá, Wagner! Vim pelo site do Sindibes e quero tirar uma dúvida sobre os benefícios para o meu negócio.'
const LINK_WAGNER = `https://wa.me/${WAGNER_WHATS}?text=${encodeURIComponent(MSG_WAGNER)}`

export default function AtendimentoChat({
  config: cfgAtendimento = ATENDIMENTO_PADRAO,
}: {
  config?: AtendimentoConfig
}) {
  const { config } = useTenant()
  const [estado, setEstado] = useState<Estado | null>(null)
  const nome = config.atendente_nome || 'Atendente'

  // Estado inicial: respeita o que o visitante já escolheu nesta sessão
  useEffect(() => {
    if (!cfgAtendimento.ativo) return
    if (sessionStorage.getItem(CHAVE_SESSAO) === 'minimizado') { setEstado('minimizado'); return }
    const timer = setTimeout(
      () => setEstado('convite'),
      Math.max(0, cfgAtendimento.segundos_para_abrir) * 1000,
    )
    return () => clearTimeout(timer)
  }, [cfgAtendimento.ativo, cfgAtendimento.segundos_para_abrir])

  // O modal de saída cobre a tela: o balão sai da frente
  const sumir = useDeveSumir({ modal: true })

  function minimizar() {
    setEstado('minimizado')
    sessionStorage.setItem(CHAVE_SESSAO, 'minimizado')
  }

  if (!cfgAtendimento.ativo || estado === null || sumir) return null

  // ── Balão menor, depois de fechar ──
  if (estado === 'minimizado') {
    return (
      <a
        href={LINK_WAGNER}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Falar com o ${nome} no WhatsApp`}
        className="fixed bottom-60 md:bottom-40 right-6 z-[42] max-w-[210px] bg-white rounded-2xl rounded-br-sm shadow-xl border border-gray-100 px-3.5 py-2.5 hover:shadow-2xl transition-shadow text-left animate-balao-in"
      >
        {/* Sem foto aqui: o botão logo abaixo já mostra o atendente */}
        <span className="text-[12.5px] leading-snug text-text font-medium">
          {cfgAtendimento.texto_minimizado || ATENDIMENTO_PADRAO.texto_minimizado}
        </span>
      </a>
    )
  }

  // ── Convite inicial ──
  return (
    <div className="fixed bottom-60 md:bottom-40 right-6 z-[42] max-w-[240px] animate-balao-in">
      <div className="relative bg-white rounded-2xl rounded-br-sm shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
        <button
          onClick={minimizar}
          className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-500"
          aria-label="Fechar convite"
        >
          <X className="w-3 h-3" />
        </button>
        <a
          href={LINK_WAGNER}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Falar com o ${nome} no WhatsApp`}
          className="flex items-start gap-2.5 p-3.5"
        >
          <Avatar url={config.atendente_foto_url} nome={nome} tamanho={36} />
          <span className="block">
            <span className="block text-[13px] leading-snug text-text font-medium">
              {cfgAtendimento.texto_convite || ATENDIMENTO_PADRAO.texto_convite}
            </span>
            <span className="mt-2 w-full h-8 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> Tirar dúvida
            </span>
          </span>
        </a>
      </div>
    </div>
  )
}

function Avatar({
  url, nome, tamanho,
}: {
  url?: string | null
  nome: string
  tamanho: number
}) {
  // block é obrigatório: um span inline ignora width/height e a foto estoura o layout
  const classe = 'block rounded-full overflow-hidden shrink-0'
  if (url) {
    return (
      <span className={classe} style={{ width: tamanho, height: tamanho }}>
        <Image src={url} alt={nome} width={tamanho} height={tamanho} className="object-cover w-full h-full" unoptimized />
      </span>
    )
  }
  return (
    <span
      className={`${classe} bg-secondary text-white font-bold flex items-center justify-center`}
      style={{ width: tamanho, height: tamanho, fontSize: tamanho / 2.5 }}
    >
      {nome[0]}
    </span>
  )
}
