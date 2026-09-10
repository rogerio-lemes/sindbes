'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Send, MessageCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useTenant, useWhatsappUrl } from '@/components/TenantProvider'
import { useDeclararOverlay, useDeveSumir } from '@/components/OverlayProvider'
import { PERGUNTAS_SUGERIDAS, type PerguntaSugerida } from '@/lib/atendimento/conhecimento'
import { ATENDIMENTO_PADRAO, type AtendimentoConfig } from '@/lib/atendimento/config'

type Estado = 'convite' | 'aberto' | 'minimizado'

interface Bolha {
  autor: 'visitante' | 'assistente'
  texto: string
  link?: { texto: string; href: string }
  encaminhar?: boolean
}

const CHAVE_SESSAO = 'atendimento_estado'

export default function AtendimentoChat({
  config: cfgAtendimento = ATENDIMENTO_PADRAO,
}: {
  config?: AtendimentoConfig
}) {
  const { config } = useTenant()
  const [estado, setEstado] = useState<Estado | null>(null)
  const [bolhas, setBolhas] = useState<Bolha[]>([])
  const [texto, setTexto] = useState('')
  const [pensando, setPensando] = useState(false)
  const [usadas, setUsadas] = useState<string[]>([])
  const fimRef = useRef<HTMLDivElement>(null)

  const nome = config.atendente_nome || 'Atendente'
  const whatsUrl = useWhatsappUrl(
    `Olá ${nome}! Vim pelo site da ${config.nome} e quero finalizar meu atendimento.`,
  )

  // Estado inicial: respeita o que o visitante já escolheu nesta sessão
  useEffect(() => {
    if (!cfgAtendimento.ativo) return
    const salvo = sessionStorage.getItem(CHAVE_SESSAO) as Estado | null
    if (salvo === 'minimizado') { setEstado('minimizado'); return }
    const timer = setTimeout(
      () => setEstado('convite'),
      Math.max(0, cfgAtendimento.segundos_para_abrir) * 1000,
    )
    return () => clearTimeout(timer)
  }, [cfgAtendimento.ativo, cfgAtendimento.segundos_para_abrir])

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [bolhas, pensando])

  // Com o chat aberto, o card do app e a barra do celular saem da frente
  useDeclararOverlay('chat', estado === 'aberto')

  // O modal de saída cobre a tela: o atendimento sai da frente
  const sumir = useDeveSumir({ modal: true })

  const abrir = useCallback(() => {
    setEstado('aberto')
    sessionStorage.setItem(CHAVE_SESSAO, 'aberto')
    setBolhas((atual) =>
      atual.length > 0
        ? atual
        : [{
            autor: 'assistente',
            texto:
              cfgAtendimento.saudacao?.trim() ||
              `Olá! Sou o ${nome}, do ${config.nome}. Posso te explicar os benefícios de ser associado ou parceiro. O que você quer saber?`,
          }],
    )
  }, [nome, config.nome, cfgAtendimento.saudacao])

  // A foto flutuante no canto abre este chat
  useEffect(() => {
    window.addEventListener('abrir-atendimento', abrir)
    return () => window.removeEventListener('abrir-atendimento', abrir)
  }, [abrir])

  function minimizar() {
    setEstado('minimizado')
    sessionStorage.setItem(CHAVE_SESSAO, 'minimizado')
  }

  /** Pergunta sugerida: resposta imediata, sem custo de IA */
  function escolherSugestao(s: PerguntaSugerida) {
    setUsadas((u) => [...u, s.chip])
    setBolhas((b) => [
      ...b,
      { autor: 'visitante', texto: s.pergunta },
      { autor: 'assistente', texto: s.resposta, link: s.link },
    ])
  }

  /** Pergunta livre: vai para a IA no servidor */
  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    const pergunta = texto.trim()
    if (!pergunta || pensando) return

    const historico = bolhas.map((b) => ({ autor: b.autor, texto: b.texto }))
    setBolhas((b) => [...b, { autor: 'visitante', texto: pergunta }])
    setTexto('')
    setPensando(true)

    try {
      const r = await fetch('/api/atendimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta, historico }),
      })
      const d = await r.json()
      setBolhas((b) => [
        ...b,
        { autor: 'assistente', texto: d.resposta || 'Não consegui responder agora.', encaminhar: d.encaminhar },
      ])
    } catch {
      setBolhas((b) => [
        ...b,
        { autor: 'assistente', texto: 'Falha de conexão. Fale com o Wagner pelo WhatsApp.', encaminhar: true },
      ])
    }
    setPensando(false)
  }

  if (!cfgAtendimento.ativo || estado === null || sumir) return null

  // ── Balão menor, depois de fechar ──
  if (estado === 'minimizado') {
    return (
      <button
        onClick={abrir}
        className="fixed bottom-60 md:bottom-40 right-6 z-[42] max-w-[210px] bg-white rounded-2xl rounded-br-sm shadow-xl border border-gray-100 px-3.5 py-2.5 hover:shadow-2xl transition-shadow text-left animate-balao-in"
      >
        {/* Sem foto aqui: o botão logo abaixo já mostra o atendente */}
        <span className="text-[12.5px] leading-snug text-text font-medium">
          {cfgAtendimento.texto_minimizado || ATENDIMENTO_PADRAO.texto_minimizado}
        </span>
      </button>
    )
  }

  // ── Convite inicial ──
  if (estado === 'convite') {
    return (
      <div className="fixed bottom-60 md:bottom-40 right-6 z-[42] max-w-[240px] animate-balao-in">
        <div className="relative bg-white rounded-2xl rounded-br-sm shadow-xl border border-gray-100 p-3.5">
          <button
            onClick={minimizar}
            className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-500"
            aria-label="Fechar convite"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-start gap-2.5">
            <Avatar url={config.atendente_foto_url} nome={nome} tamanho={36} />
            <div>
              <p className="text-[13px] leading-snug text-text font-medium">
                {cfgAtendimento.texto_convite || ATENDIMENTO_PADRAO.texto_convite}
              </p>
              <button
                onClick={abrir}
                className="mt-2 w-full h-8 rounded-lg gradient-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Tirar dúvida
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Chat aberto ──
  const disponiveis = PERGUNTAS_SUGERIDAS.filter((s) => !usadas.includes(s.chip))

  return (
    <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-6 md:bottom-40 z-[42] md:w-[370px] max-h-[min(78vh,620px)] flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-balao-in">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 px-4 py-3 gradient-primary text-white shrink-0">
        <div className="relative">
          <Avatar url={config.atendente_foto_url} nome={nome} tamanho={40} borda />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm leading-tight">{nome}</p>
          <p className="text-white/80 text-[11px]">Atendimento do {config.nome}</p>
        </div>
        <button
          onClick={minimizar}
          className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Fechar atendimento"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Conversa */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-bg-alt">
        {bolhas.map((b, i) => (
          <div key={i} className={b.autor === 'visitante' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                b.autor === 'visitante'
                  ? 'bg-secondary text-white rounded-br-sm'
                  : 'bg-white text-text border border-gray-100 rounded-bl-sm shadow-sm'
              }`}
            >
              {b.texto}

              {b.link && (
                <Link
                  href={b.link.href}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  {b.link.texto} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}

              {b.encaminhar && (
                <a
                  href={whatsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Falar com o {nome}
                </a>
              )}
            </div>
          </div>
        ))}

        {pensando && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
          </div>
        )}

        <div ref={fimRef} />
      </div>

      {/* Sugestões de pergunta */}
      {disponiveis.length > 0 && (
        <div className="px-3 pt-3 pb-1 border-t border-gray-100 bg-white shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">
            Perguntas frequentes
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {disponiveis.map((s) => (
              <button
                key={s.chip}
                onClick={() => escolherSugestao(s)}
                className="shrink-0 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                {s.chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Digitar + falar com humano */}
      <div className="px-3 pb-3 pt-2 bg-white border-t border-gray-100 shrink-0 space-y-2">
        <form onSubmit={enviar} className="flex items-center gap-2">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva sua dúvida..."
            maxLength={600}
            className="flex-1 h-10 px-3.5 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!texto.trim() || pensando}
            className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <a
          href={whatsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-10 rounded-xl bg-[#25D366] text-white text-[13px] font-bold hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-4 h-4" /> Finalizar com o {nome} no WhatsApp
        </a>
      </div>
    </div>
  )
}

function Avatar({
  url, nome, tamanho, borda,
}: {
  url?: string | null
  nome: string
  tamanho: number
  borda?: boolean
}) {
  // block é obrigatório: um span inline ignora width/height e a foto estoura o layout
  const classe = `block rounded-full overflow-hidden shrink-0 ${borda ? 'border-2 border-white' : ''}`
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
