'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search, ChevronRight, ImageIcon, Inbox, CheckCircle2, EyeOff, XCircle, Globe, LayoutPanelLeft, RefreshCw,
} from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '../AdminAuthProvider'
import { PageHeader, PermissionGuard } from '../ui'
import { STATUS_ROTULO, type StatusCadastro } from '@/lib/cadastros'
import {
  CONFIG, ORDEM_STATUS, StatusCadastroBadge, rotuloOrigem, dataBr, haQuanto, EVENTO_CADASTROS,
  type TipoCadastro,
} from './comum'

interface ItemLista {
  id: string
  nome: string
  slug: string
  categoria: string | null
  foto_capa_url: string | null
  status: StatusCadastro
  origem: string
  created_at: string
  analisado_em: string | null
}

const VAZIO: Record<StatusCadastro, { titulo: string; texto: string; icone: typeof Inbox; cor: string }> = {
  pendente: {
    titulo: 'Nenhum cadastro aguardando análise',
    texto: 'Tudo em dia. Quando alguém preencher o formulário do site, o cadastro aparece aqui para você revisar e publicar.',
    icone: CheckCircle2,
    cor: 'text-primary bg-primary/10',
  },
  publicado: {
    titulo: 'Nenhuma página publicada ainda',
    texto: 'Os cadastros aprovados aparecem aqui assim que entram no ar.',
    icone: Globe,
    cor: 'text-green-600 bg-green-50',
  },
  oculto: {
    titulo: 'Nenhum cadastro fora do ar',
    texto: 'Páginas tiradas do ar temporariamente ficam guardadas aqui.',
    icone: EyeOff,
    cor: 'text-gray-500 bg-gray-100',
  },
  reprovado: {
    titulo: 'Nenhum cadastro reprovado',
    texto: 'Os cadastros recusados na análise ficam guardados aqui.',
    icone: XCircle,
    cor: 'text-red-500 bg-red-50',
  },
}

export default function ListaCadastros({ tipo }: { tipo: TipoCadastro }) {
  const cfg = CONFIG[tipo]
  const { tenantId } = useAdminAuth()
  const [itens, setItens] = useState<ItemLista[] | null>(null)
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState<StatusCadastro | null>(null)
  const [busca, setBusca] = useState('')

  const carregar = useCallback(async () => {
    setErro('')
    const { data, error } = await getBrowserClient()
      .from(cfg.tabela)
      .select('id, nome, slug, categoria, foto_capa_url, status, origem, created_at, analisado_em')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(1000)
    if (error) { setErro('Não foi possível carregar os cadastros. Tente atualizar a página.'); setItens([]); return }
    setItens((data ?? []) as ItemLista[])
  }, [cfg.tabela, tenantId])

  useEffect(() => { carregar() }, [carregar])
  useEffect(() => {
    const ouvir = () => { carregar() }
    window.addEventListener(EVENTO_CADASTROS, ouvir)
    return () => window.removeEventListener(EVENTO_CADASTROS, ouvir)
  }, [carregar])

  const contagem = useMemo(() => {
    const c: Record<StatusCadastro, number> = { pendente: 0, publicado: 0, oculto: 0, reprovado: 0 }
    ;(itens ?? []).forEach((i) => { if (i.status in c) c[i.status]++ })
    return c
  }, [itens])

  // Aba inicial: "Aguardando análise" quando há pendentes; senão "Publicados".
  // Lembra a última aba usada na sessão para quem volta do detalhe.
  useEffect(() => {
    if (!itens || aba) return
    let salva: StatusCadastro | null = null
    try { salva = sessionStorage.getItem(`admin:aba:${tipo}`) as StatusCadastro | null } catch {}
    if (contagem.pendente > 0) setAba('pendente')
    else if (salva && ORDEM_STATUS.includes(salva)) setAba(salva)
    else setAba('publicado')
  }, [itens, aba, contagem.pendente, tipo])

  function trocarAba(s: StatusCadastro) {
    setAba(s)
    try { sessionStorage.setItem(`admin:aba:${tipo}`, s) } catch {}
  }

  const abaAtual = aba ?? 'pendente'
  const termo = busca.trim().toLowerCase()
  const visiveis = (itens ?? [])
    .filter((i) => i.status === abaAtual)
    .filter((i) => !termo || [i.nome, i.categoria, i.slug].some((v) => v?.toLowerCase().includes(termo)))
    // Pendentes: o mais antigo primeiro (fila de análise). Demais: mais recentes primeiro.
    .sort((a, b) => abaAtual === 'pendente'
      ? a.created_at.localeCompare(b.created_at)
      : b.created_at.localeCompare(a.created_at))

  const vazio = VAZIO[abaAtual]

  return (
    <PermissionGuard permissao={cfg.permissaoVer}>
      <PageHeader
        titulo={cfg.plural}
        descricao={
          tipo === 'parceiro'
            ? 'Analise os cadastros de empresas parceiras e publique as páginas no site.'
            : 'Analise os cadastros de associados e publique as páginas no site.'
        }
        acoes={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome..."
                className="h-11 w-56 sm:w-64 pl-9 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
              />
            </div>
            <button
              onClick={() => { setItens(null); carregar() }}
              className="h-11 w-11 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-primary hover:border-primary/40 flex items-center justify-center"
              aria-label="Atualizar lista"
              title="Atualizar lista"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Abas por status */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-5 -mx-1 px-1">
        {ORDEM_STATUS.map((s) => {
          const ativa = s === abaAtual
          const destaque = s === 'pendente' && contagem.pendente > 0
          return (
            <button
              key={s}
              onClick={() => trocarAba(s)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                ativa ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {s === 'pendente' ? 'Aguardando análise' : s === 'publicado' ? 'Publicados' : s === 'oculto' ? 'Fora do ar' : 'Reprovados'}
              <span
                className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  destaque ? 'bg-amber-500 text-white' : ativa ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {itens ? contagem[s] : '·'}
              </span>
              {ativa && <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
          )
        })}
      </div>

      {erro && <p className="text-sm text-red-600 mb-4">{erro}</p>}

      <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {itens === null ? (
          <ul className="divide-y divide-gray-50">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <span className="w-20 h-14 rounded-lg bg-gray-100" />
                <span className="flex-1 space-y-2">
                  <span className="block h-3.5 w-48 bg-gray-100 rounded" />
                  <span className="block h-3 w-32 bg-gray-100 rounded" />
                </span>
              </li>
            ))}
          </ul>
        ) : visiveis.length === 0 ? (
          <div className="text-center px-6 py-16">
            <span className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${termo ? 'text-gray-400 bg-gray-100' : vazio.cor}`}>
              {termo ? <Search className="w-6 h-6" /> : <vazio.icone className="w-7 h-7" />}
            </span>
            <p className="font-bold text-gray-800">
              {termo ? 'Nenhum cadastro encontrado' : vazio.titulo}
            </p>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              {termo
                ? `Nada em "${STATUS_ROTULO[abaAtual]}" com "${busca.trim()}". Confira a grafia ou procure em outra aba.`
                : vazio.texto}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[minmax(0,1fr)_150px_150px_150px_24px] gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Cadastro</span>
              <span>Chegou em</span>
              <span>Origem</span>
              <span>Status</span>
              <span />
            </div>
            <ul className="divide-y divide-gray-50">
              {visiveis.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`${cfg.rotaAdmin}/${i.id}`}
                    className="group grid grid-cols-[minmax(0,1fr)_24px] md:grid-cols-[minmax(0,1fr)_150px_150px_150px_24px] items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-4 min-w-0">
                      <Capa url={i.foto_capa_url} alt={i.nome} />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-gray-900 truncate group-hover:text-primary">
                          {i.nome || 'Sem nome'}
                        </span>
                        <span className="block text-xs text-gray-500 truncate">{i.categoria || 'Sem categoria'}</span>
                        {/* Informações compactas no celular */}
                        <span className="md:hidden flex flex-wrap items-center gap-2 mt-1.5">
                          <StatusCadastroBadge status={i.status} />
                          <span className="text-[11px] text-gray-400">{dataBr(i.created_at)} · {rotuloOrigem(i.origem)}</span>
                        </span>
                      </span>
                    </span>
                    <span className="hidden md:block">
                      <span className="block text-sm text-gray-700">{dataBr(i.created_at)}</span>
                      <span className="block text-xs text-gray-400">{haQuanto(i.created_at)}</span>
                    </span>
                    <span className="hidden md:flex items-center gap-1.5 text-sm text-gray-600">
                      {i.origem === 'painel'
                        ? <LayoutPanelLeft className="w-3.5 h-3.5 text-secondary" />
                        : <Globe className="w-3.5 h-3.5 text-primary" />}
                      {rotuloOrigem(i.origem)}
                    </span>
                    <span className="hidden md:block"><StatusCadastroBadge status={i.status} /></span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary justify-self-end" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {itens && visiveis.length > 0 && (
        <p className="text-xs text-gray-400 mt-3">
          {visiveis.length} {visiveis.length === 1 ? 'cadastro' : 'cadastros'} em &quot;{STATUS_ROTULO[abaAtual]}&quot;
          {abaAtual === 'pendente' && ', do mais antigo para o mais recente'}.
        </p>
      )}
    </PermissionGuard>
  )
}

function Capa({ url, alt }: { url: string | null; alt: string }) {
  if (!url) {
    return (
      <span className="w-20 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">
        <ImageIcon className="w-5 h-5" />
      </span>
    )
  }
  return (
    <span className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 block shrink-0 border border-gray-100">
      <Image src={url} alt={alt} fill className="object-cover" unoptimized sizes="80px" />
    </span>
  )
}
