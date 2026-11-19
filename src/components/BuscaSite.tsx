'use client'

/**
 * Menu "Pesquisar" do cabeçalho.
 *
 * Botão com lupa que abre uma janela de busca. Ao abrir, baixa o índice
 * público em /api/busca (uma vez por visita) e junta com os serviços do
 * site. O filtro ignora acentos e maiúsculas e procura todas as palavras
 * digitadas no título e no resumo. Atalhos: Ctrl+K (ou /) abre, Esc fecha,
 * setas navegam e Enter abre o resultado marcado.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search, X, Loader2, FileText, Landmark, Newspaper, CalendarDays,
  Handshake, Store, Sparkles, CornerDownLeft, type LucideIcon,
} from 'lucide-react'
import { useTenant } from '@/components/TenantProvider'

type Tipo = 'servico' | 'pagina' | 'institucional' | 'blog' | 'evento' | 'parceiro' | 'associado'

interface Item {
  tipo: Tipo
  titulo: string
  href: string
  resumo?: string
}

/** Mesmo ícone e mesma cor para o mesmo tipo em todos os lugares da busca. */
const TIPOS: Record<Tipo, { rotulo: string; icone: LucideIcon; cor: string; fundo: string }> = {
  servico:       { rotulo: 'Serviços',      icone: Sparkles,     cor: 'text-teal-600',    fundo: 'bg-teal-50' },
  pagina:        { rotulo: 'Páginas',       icone: FileText,     cor: 'text-slate-600',   fundo: 'bg-slate-100' },
  institucional: { rotulo: 'Institucional', icone: Landmark,     cor: 'text-indigo-600',  fundo: 'bg-indigo-50' },
  blog:          { rotulo: 'Blog',          icone: Newspaper,    cor: 'text-amber-600',   fundo: 'bg-amber-50' },
  evento:        { rotulo: 'Eventos',       icone: CalendarDays, cor: 'text-rose-600',    fundo: 'bg-rose-50' },
  parceiro:      { rotulo: 'Parceiros',     icone: Handshake,    cor: 'text-violet-600',  fundo: 'bg-violet-50' },
  associado:     { rotulo: 'Associados',    icone: Store,        cor: 'text-emerald-600', fundo: 'bg-emerald-50' },
}

const ORDEM: Tipo[] = ['servico', 'pagina', 'institucional', 'associado', 'parceiro', 'evento', 'blog']
const SUGESTOES = ['Treinamentos', 'Plano de Saúde', 'Convenções', 'Parceiros', 'Seja Associado']
const MAX_POR_GRUPO = 6

function normalizar(t: string) {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

let cacheIndice: Item[] | null = null

export default function BuscaSite({ variante = 'desktop' }: { variante?: 'desktop' | 'mobile' }) {
  const { servicos } = useTenant()
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [termo, setTermo] = useState('')
  const [indice, setIndice] = useState<Item[] | null>(cacheIndice)
  const [carregando, setCarregando] = useState(false)
  const [ativo, setAtivo] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listaRef = useRef<HTMLDivElement>(null)

  const abrir = useCallback(() => setAberto(true), [])
  const fechar = useCallback(() => { setAberto(false); setTermo(''); setAtivo(0) }, [])

  // Atalhos de teclado (só o botão do desktop escuta, para não duplicar).
  useEffect(() => {
    if (variante !== 'desktop') return
    const onKey = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null
      const digitando = alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setAberto(true) }
      else if (e.key === '/' && !digitando) { e.preventDefault(); setAberto(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [variante])

  // Ao abrir: foca o campo, trava a rolagem da página e baixa o índice.
  useEffect(() => {
    if (!aberto) return
    const t = setTimeout(() => inputRef.current?.focus(), 30)
    const overflowAntes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!cacheIndice) {
      setCarregando(true)
      fetch('/api/busca')
        .then((r) => (r.ok ? r.json() : { itens: [] }))
        .then((d: { itens: Item[] }) => { cacheIndice = d.itens ?? []; setIndice(cacheIndice) })
        .catch(() => setIndice([]))
        .finally(() => setCarregando(false))
    }
    return () => { clearTimeout(t); document.body.style.overflow = overflowAntes }
  }, [aberto])

  const todos = useMemo<Item[]>(() => [
    ...servicos.map((s) => ({ tipo: 'servico' as const, titulo: s.nome, href: `/${s.slug}` })),
    ...(indice ?? []),
  ], [servicos, indice])

  const grupos = useMemo(() => {
    const palavras = normalizar(termo).split(/\s+/).filter(Boolean)
    if (!palavras.length) return []
    const achados = todos
      .map((item) => {
        const titulo = normalizar(item.titulo)
        const texto = `${titulo} ${normalizar(item.resumo ?? '')}`
        if (!palavras.every((p) => texto.includes(p))) return null
        // Título que começa com o termo vem primeiro, depois título que contém.
        const pontos = titulo.startsWith(palavras[0]) ? 0 : palavras.every((p) => titulo.includes(p)) ? 1 : 2
        return { item, pontos }
      })
      .filter((x): x is { item: Item; pontos: number } => x !== null)
      .sort((a, b) => a.pontos - b.pontos)
    return ORDEM
      .map((tipo) => ({ tipo, itens: achados.filter((a) => a.item.tipo === tipo).slice(0, MAX_POR_GRUPO).map((a) => a.item) }))
      .filter((g) => g.itens.length)
  }, [termo, todos])

  const planos = useMemo(() => grupos.flatMap((g) => g.itens), [grupos])

  useEffect(() => { setAtivo(0) }, [termo])

  useEffect(() => {
    listaRef.current?.querySelector(`[data-indice="${ativo}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [ativo])

  const irPara = (href: string) => { fechar(); router.push(href) }

  const onKeyDownCampo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); fechar() }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setAtivo((i) => Math.min(i + 1, planos.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAtivo((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && planos[ativo]) { e.preventDefault(); irPara(planos[ativo].href) }
  }

  let contador = -1

  return (
    <>
      {variante === 'desktop' ? (
        <button
          type="button"
          onClick={abrir}
          aria-label="Pesquisar no site"
          title="Pesquisar (Ctrl+K)"
          className="ml-1 w-10 h-10 flex items-center justify-center rounded-xl text-text hover:text-primary hover:bg-bg-alt transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      ) : (
        <button type="button" onClick={abrir} aria-label="Pesquisar no site" className="p-2 text-text">
          <Search className="w-6 h-6" />
        </button>
      )}

      {aberto && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] bg-black/50 backdrop-blur-sm"
          onMouseDown={(e) => { if (e.target === e.currentTarget) fechar() }}
          role="dialog"
          aria-modal="true"
          aria-label="Pesquisar no site"
        >
          <div className="w-full max-w-[640px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[75vh]">
            {/* Campo */}
            <div className="flex items-center gap-3 px-5 border-b border-gray-100">
              <Search className="w-5 h-5 text-primary flex-shrink-0" />
              <input
                ref={inputRef}
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                onKeyDown={onKeyDownCampo}
                placeholder="O que você procura? Ex.: treinamentos, plano de saúde…"
                className="flex-1 h-14 text-base text-text placeholder:text-gray-400 outline-none bg-transparent"
                aria-label="Termo da pesquisa"
                autoComplete="off"
              />
              {carregando && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
              <button type="button" onClick={fechar} aria-label="Fechar pesquisa"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-text hover:bg-bg-alt">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resultados */}
            <div ref={listaRef} className="overflow-y-auto py-2">
              {!termo.trim() && (
                <div className="px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Sugestões</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGESTOES.map((s) => (
                      <button key={s} type="button" onClick={() => setTermo(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-bg-alt text-text hover:bg-primary/10 hover:text-primary transition-colors">
                        <Search className="w-3.5 h-3.5 text-primary" /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {termo.trim() && !grupos.length && !carregando && (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-text">Nada encontrado para <strong>“{termo}”</strong>.</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Tente outra palavra ou <Link href="/contato" onClick={fechar} className="text-primary font-semibold hover:underline">fale com o Sindibes</Link>.
                  </p>
                </div>
              )}

              {grupos.map((g) => {
                const t = TIPOS[g.tipo]
                const Icone = t.icone
                return (
                  <div key={g.tipo} className="pb-1">
                    <p className="flex items-center gap-1.5 px-5 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <Icone className={`w-3.5 h-3.5 ${t.cor}`} /> {t.rotulo}
                    </p>
                    {g.itens.map((item) => {
                      contador += 1
                      const i = contador
                      const selecionado = i === ativo
                      return (
                        <Link
                          key={`${item.tipo}-${item.href}`}
                          href={item.href}
                          data-indice={i}
                          onClick={fechar}
                          onMouseMove={() => setAtivo(i)}
                          className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl transition-colors ${selecionado ? 'bg-bg-alt' : ''}`}
                        >
                          <span className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${t.fundo}`}>
                            <Icone className={`w-4 h-4 ${t.cor}`} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={`block text-sm font-medium truncate ${selecionado ? 'text-primary' : 'text-text'}`}>{item.titulo}</span>
                            {item.resumo && <span className="block text-xs text-gray-500 truncate">{item.resumo}</span>}
                          </span>
                          {selecionado && <CornerDownLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                        </Link>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            <div className="hidden md:flex items-center gap-4 px-5 py-2.5 border-t border-gray-100 text-[11px] text-gray-400">
              <span><kbd className="font-sans px-1.5 py-0.5 rounded bg-bg-alt text-gray-500">↑↓</kbd> navegar</span>
              <span><kbd className="font-sans px-1.5 py-0.5 rounded bg-bg-alt text-gray-500">Enter</kbd> abrir</span>
              <span><kbd className="font-sans px-1.5 py-0.5 rounded bg-bg-alt text-gray-500">Esc</kbd> fechar</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
