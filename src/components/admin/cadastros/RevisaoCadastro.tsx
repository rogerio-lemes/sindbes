'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, Globe, Send, XCircle, EyeOff, RotateCcw, Save, ExternalLink, Pencil, Eye, Lock,
  User, Briefcase, Phone, Mail, MessageCircle, FileText, IdCard, CheckCircle2, AlertTriangle, X,
  Loader2, ImageIcon, SearchX, LayoutPanelLeft,
} from 'lucide-react'
import ParceiroPagina from '@/components/vitrine/ParceiroPagina'
import AssociadoPagina from '@/components/vitrine/AssociadoPagina'
import { getBrowserClient } from '@/lib/supabase/browser'
import {
  associadoDaLinha, enderecoEmLinha, parceiroDaLinha,
  type AssociadoRow, type CadastroPrivadoRow, type EnderecoCadastro, type ParceiroRow, type StatusCadastro,
} from '@/lib/cadastros'
import type { Parceiro } from '@/lib/parceiros'
import type { Associado } from '@/lib/associados'
import { useAdminAuth } from '../AdminAuthProvider'
import { PermissionGuard } from '../ui'
import { FormAssociado, FormParceiro } from './Formularios'
import {
  CONFIG, StatusCadastroBadge, avisarCadastrosAtualizados, dataHoraBr, haQuanto, revalidarPagina,
  rotuloOrigem, slugFinal, type TipoCadastro,
} from './comum'

type Linha = ParceiroRow | AssociadoRow

/* ------------------------------------------------------------------ */
/* Campos gravados: normaliza o formulário antes de comparar e salvar  */
/* ------------------------------------------------------------------ */

const txt = (s?: string | null) => {
  const v = (s ?? '').trim()
  return v || null
}

function enderecoLimpo(e?: EnderecoCadastro | null): EnderecoCadastro {
  const out: EnderecoCadastro = {}
  for (const [k, v] of Object.entries(e ?? {})) {
    const t = typeof v === 'string' ? v.trim() : ''
    if (t) out[k as keyof EnderecoCadastro] = t
  }
  return out
}

function camposParceiro(r: ParceiroRow) {
  return {
    nome: (r.nome ?? '').trim(),
    slug: slugFinal(r.slug ?? ''),
    categoria: txt(r.categoria),
    resumo: txt(r.resumo),
    descricao: txt(r.descricao),
    servicos: (r.servicos ?? []).map((s) => s.trim()).filter(Boolean),
    beneficio_associados: txt(r.beneficio_associados),
    whatsapp: txt(r.whatsapp),
    whatsapp_display: txt(r.whatsapp_display),
    telefone: txt(r.telefone),
    email: txt(r.email),
    site_url: txt(r.site_url),
    instagram: txt(r.instagram),
    redes: (r.redes ?? []).map((x) => ({ tipo: x.tipo, url: (x.url ?? '').trim() })).filter((x) => x.url),
    endereco: enderecoLimpo(r.endereco),
    destaque: !!r.destaque,
    foto_capa_url: r.foto_capa_url || null,
    fotos: r.fotos ?? [],
  }
}

function camposAssociado(r: AssociadoRow) {
  const detalhe = enderecoLimpo({
    ...(r.endereco_detalhe ?? {}),
    bairro: r.endereco_detalhe?.bairro ?? r.bairro ?? '',
    cidade: r.endereco_detalhe?.cidade ?? r.cidade ?? '',
  })
  return {
    nome: (r.nome ?? '').trim(),
    slug: slugFinal(r.slug ?? ''),
    categoria: txt(r.categoria),
    descricao: txt(r.descricao),
    telefone: txt(r.telefone),
    telefone_display: txt(r.telefone_display),
    whatsapp: txt(r.whatsapp),
    email: txt(r.email),
    instagram: txt(r.instagram),
    site_url: txt(r.site_url),
    horario: txt(r.horario),
    endereco_detalhe: detalhe,
    // Endereço em uma linha para a página; se o detalhado estiver vazio, mantém o texto antigo.
    endereco: txt(enderecoEmLinha(detalhe)) ?? txt(r.endereco),
    cidade: detalhe.cidade ?? null,
    bairro: detalhe.bairro ?? null,
    destaque: !!r.destaque,
    novo: !!r.novo,
    foto_capa_url: r.foto_capa_url || null,
    fotos: r.fotos ?? [],
  }
}

const camposDe = (tipo: TipoCadastro, r: Linha) =>
  tipo === 'parceiro' ? camposParceiro(r as ParceiroRow) : camposAssociado(r as AssociadoRow)

/* ------------------------------------------------------------------ */
/* Ações de status                                                     */
/* ------------------------------------------------------------------ */

type Acao = 'publicar' | 'reprovar' | 'ocultar' | 'reanalisar'

interface DefAcao {
  novo: StatusCadastro
  titulo: string
  botao: string
  sucesso: string
  tom: 'primary' | 'red' | 'gray' | 'secondary'
}

const ACOES: Record<Acao, DefAcao> = {
  publicar: { novo: 'publicado', titulo: 'Publicar no site?', botao: 'Publicar agora', sucesso: 'Página publicada! Já está no ar.', tom: 'primary' },
  reprovar: { novo: 'reprovado', titulo: 'Reprovar este cadastro?', botao: 'Reprovar cadastro', sucesso: 'Cadastro reprovado. Ele fica guardado na aba Reprovados.', tom: 'red' },
  ocultar: { novo: 'oculto', titulo: 'Tirar a página do ar?', botao: 'Tirar do ar', sucesso: 'Página tirada do ar.', tom: 'gray' },
  reanalisar: { novo: 'pendente', titulo: 'Voltar para análise?', botao: 'Voltar para análise', sucesso: 'Cadastro voltou para a fila de análise.', tom: 'secondary' },
}

const ACOES_POR_STATUS: Record<StatusCadastro, Acao[]> = {
  pendente: ['reprovar', 'publicar'],
  publicado: ['reanalisar', 'ocultar'],
  oculto: ['reanalisar', 'publicar'],
  reprovado: ['reanalisar', 'publicar'],
}

const ICONE_ACAO: Record<Acao, typeof Send> = {
  publicar: Send, reprovar: XCircle, ocultar: EyeOff, reanalisar: RotateCcw,
}

const BOTAO_TOM: Record<DefAcao['tom'], string> = {
  primary: 'bg-primary text-white hover:opacity-90',
  red: 'bg-red-600 text-white hover:bg-red-700',
  gray: 'bg-gray-800 text-white hover:bg-gray-900',
  secondary: 'bg-secondary text-white hover:opacity-90',
}

/* ------------------------------------------------------------------ */
/* Aviso de saída com alterações não salvas                            */
/* ------------------------------------------------------------------ */

const MSG_SAIR = 'Você tem alterações não salvas neste cadastro. Sair mesmo assim e descartar as alterações?'

function useAvisoSaida(ativo: boolean) {
  useEffect(() => {
    if (!ativo) return
    const antesDeFechar = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    // Links internos (menu, voltar): pergunta antes de trocar de tela.
    const aoClicar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const alvo = e.target as HTMLElement | null
      const a = alvo?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return
      if (!window.confirm(MSG_SAIR)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('beforeunload', antesDeFechar)
    document.addEventListener('click', aoClicar, true)
    return () => {
      window.removeEventListener('beforeunload', antesDeFechar)
      document.removeEventListener('click', aoClicar, true)
    }
  }, [ativo])
}

/* ------------------------------------------------------------------ */
/* Tela                                                                */
/* ------------------------------------------------------------------ */

interface Aviso { tipo: 'ok' | 'erro'; texto: string }

export default function RevisaoCadastro({ tipo, id }: { tipo: TipoCadastro; id: string }) {
  const cfg = CONFIG[tipo]
  const { tenantId, canAccess } = useAdminAuth()
  const podeEditar = canAccess(cfg.permissaoEditar)

  const [original, setOriginal] = useState<Linha | null>(null)
  const [edit, setEdit] = useState<Linha | null>(null)
  const [privado, setPrivado] = useState<CadastroPrivadoRow | null>(null)
  const [outros, setOutros] = useState<(Parceiro | Associado)[]>([])
  const [estado, setEstado] = useState<'carregando' | 'ok' | 'nao-encontrado' | 'erro'>('carregando')
  const [aba, setAba] = useState<'editar' | 'previa'>('editar')
  const [slugErro, setSlugErro] = useState('')
  const [salvando, setSalvando] = useState<Acao | 'salvar' | null>(null)
  const [confirmar, setConfirmar] = useState<Acao | null>(null)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const timerAviso = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mostrarAviso = useCallback((a: Aviso) => {
    setAviso(a)
    if (timerAviso.current) clearTimeout(timerAviso.current)
    if (a.tipo === 'ok') timerAviso.current = setTimeout(() => setAviso(null), 4500)
  }, [])

  const carregar = useCallback(async () => {
    setEstado('carregando')
    const sb = getBrowserClient()
    const { data, error } = await sb.from(cfg.tabela).select('*')
      .eq('id', id).eq('tenant_id', tenantId).maybeSingle()
    if (error || !data) {
      // Id inválido também cai aqui (o banco recusa o formato): trata como não encontrado.
      setEstado(error && error.code !== '22P02' ? 'erro' : 'nao-encontrado')
      return
    }
    setOriginal(data as Linha)
    setEdit(data as Linha)
    setEstado('ok')

    const [priv, pub] = await Promise.all([
      sb.from('cadastros_privados').select('*')
        .eq('tipo', tipo).eq('registro_id', id)
        .order('created_at', { ascending: false }).limit(1),
      sb.from(cfg.tabela).select('*')
        .eq('tenant_id', tenantId).eq('status', 'publicado').neq('id', id)
        .order('destaque', { ascending: false }).order('created_at', { ascending: false }).limit(6),
    ])
    setPrivado(((priv.data ?? [])[0] as CadastroPrivadoRow) ?? null)
    setOutros(
      (pub.data ?? []).map((r) =>
        tipo === 'parceiro' ? parceiroDaLinha(r as ParceiroRow) : associadoDaLinha(r as AssociadoRow)),
    )
  }, [cfg.tabela, id, tenantId, tipo])

  useEffect(() => { carregar() }, [carregar])
  useEffect(() => () => { if (timerAviso.current) clearTimeout(timerAviso.current) }, [])

  const camposEdit = useMemo(() => (edit ? camposDe(tipo, edit) : null), [edit, tipo])
  const camposOrig = useMemo(() => (original ? camposDe(tipo, original) : null), [original, tipo])
  const alterado = !!camposEdit && !!camposOrig && JSON.stringify(camposEdit) !== JSON.stringify(camposOrig)

  useAvisoSaida(alterado)

  // Verificação do endereço enquanto edita (fixos do código e outros cadastros).
  const slugAtual = camposEdit?.slug ?? ''
  useEffect(() => {
    if (!original) return
    setSlugErro('')
    if (!slugAtual || slugAtual === slugFinal(original.slug)) return
    if (cfg.slugsReservados.includes(slugAtual)) {
      setSlugErro('Este endereço já é de uma página fixa do site. Escolha outro.')
      return
    }
    const t = setTimeout(async () => {
      const { data } = await getBrowserClient().from(cfg.tabela).select('nome')
        .eq('tenant_id', tenantId).eq('slug', slugAtual).neq('id', id).limit(1)
      if (data?.length) setSlugErro(`Este endereço já é usado por "${data[0].nome}". Escolha outro.`)
    }, 450)
    return () => clearTimeout(t)
  }, [slugAtual, original, cfg.slugsReservados, cfg.tabela, tenantId, id])

  const set = useCallback((patch: Partial<Linha>) => {
    setEdit((e) => (e ? ({ ...e, ...patch } as Linha) : e))
  }, [])

  /** Confere nome e endereço antes de gravar. */
  async function validar(): Promise<boolean> {
    if (!camposEdit) return false
    if (!camposEdit.nome) {
      setAba('editar')
      mostrarAviso({ tipo: 'erro', texto: 'Informe o nome antes de salvar.' })
      return false
    }
    const slug = camposEdit.slug
    let erro = ''
    if (!slug) erro = 'Informe o endereço da página.'
    else if (cfg.slugsReservados.includes(slug)) erro = 'Este endereço já é de uma página fixa do site. Escolha outro.'
    else {
      const { data } = await getBrowserClient().from(cfg.tabela).select('nome')
        .eq('tenant_id', tenantId).eq('slug', slug).neq('id', id).limit(1)
      if (data?.length) erro = `Este endereço já é usado por "${data[0].nome}". Escolha outro.`
    }
    if (erro) {
      setSlugErro(erro)
      setAba('editar')
      mostrarAviso({ tipo: 'erro', texto: `Não foi possível gravar: ${erro}` })
      return false
    }
    return true
  }

  /** Grava no banco e atualiza a tela. Devolve true quando deu certo. */
  async function gravar(payload: Record<string, unknown>, acao: Acao | 'salvar', msgSucesso: string) {
    if (!original) return false
    setSalvando(acao)
    const statusAntes = original.status
    const slugAntes = original.slug
    const { data, error } = await getBrowserClient().from(cfg.tabela)
      .update(payload).eq('id', id).select('*').maybeSingle()
    setSalvando(null)

    if (error || !data) {
      const texto = error?.code === '23505'
        ? 'Este endereço de página já está em uso. Escolha outro.'
        : !data && !error
          ? 'Você não tem permissão para alterar este cadastro.'
          : 'Não foi possível gravar agora. Confira sua conexão e tente de novo.'
      if (error?.code === '23505') { setSlugErro(texto); setAba('editar') }
      mostrarAviso({ tipo: 'erro', texto })
      return false
    }

    const nova = data as Linha
    setOriginal(nova)
    setEdit(nova)
    mostrarAviso({ tipo: 'ok', texto: msgSucesso })
    if (nova.status !== statusAntes) avisarCadastrosAtualizados()

    // Atualiza a página pública quando ela está (ou estava) no ar.
    if (statusAntes === 'publicado' || nova.status === 'publicado') {
      const slugs = new Set([slugAntes, nova.slug].filter(Boolean))
      slugs.forEach((s) => { revalidarPagina(tipo, s) })
    }
    return true
  }

  async function salvar() {
    if (!camposEdit || !alterado) return
    if (!(await validar())) return
    await gravar(
      camposEdit,
      'salvar',
      original?.status === 'publicado' ? 'Alterações salvas e enviadas para a página no ar.' : 'Alterações salvas.',
    )
  }

  async function executar(acao: Acao) {
    if (!camposEdit) return
    const def = ACOES[acao]
    // Publicar sempre confere o endereço; nas outras ações só se houver edição junto.
    if ((alterado || def.novo === 'publicado') && !(await validar())) { setConfirmar(null); return }
    const payload: Record<string, unknown> = alterado ? { ...camposEdit } : {}
    payload.status = def.novo
    if (def.novo === 'publicado' || def.novo === 'reprovado') payload.analisado_em = new Date().toISOString()
    if (def.novo === 'pendente') payload.analisado_em = null
    const ok = await gravar(payload, acao, def.sucesso)
    if (ok) setConfirmar(null)
  }

  function descartar() {
    if (!original) return
    if (!window.confirm('Descartar todas as alterações que ainda não foram salvas?')) return
    setEdit(original)
    setSlugErro('')
  }

  /* ---------------- estados de carregamento ---------------- */

  if (estado === 'carregando' && !original) {
    return (
      <PermissionGuard permissao={cfg.permissaoVer}>
        <div className="flex items-center justify-center py-24 text-gray-400 gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" /> Carregando cadastro...
        </div>
      </PermissionGuard>
    )
  }

  if (estado === 'nao-encontrado' || estado === 'erro' || !original || !edit || !camposEdit) {
    return (
      <PermissionGuard permissao={cfg.permissaoVer}>
        <div className="bg-white rounded-2xl border border-gray-100 text-center px-6 py-16">
          <span className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gray-100 text-gray-400">
            <SearchX className="w-7 h-7" />
          </span>
          <p className="font-bold text-gray-800">
            {estado === 'erro' ? 'Não foi possível abrir o cadastro' : 'Cadastro não encontrado'}
          </p>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            {estado === 'erro'
              ? 'Houve uma falha ao buscar os dados. Tente de novo em instantes.'
              : 'Este cadastro não existe mais ou o link está incorreto.'}
          </p>
          <Link href={cfg.rotaAdmin} className="inline-flex items-center gap-1.5 mt-5 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90">
            <ArrowLeft className="w-4 h-4" /> Voltar para {cfg.plural}
          </Link>
        </div>
      </PermissionGuard>
    )
  }

  /* ---------------- tela ---------------- */

  const status = original.status
  const urlPublica = `${cfg.rotaSite}/${original.slug}`
  const host = typeof window !== 'undefined' ? window.location.host : ''
  const ocupado = salvando !== null
  const linhaPrevia = { ...edit, ...camposEdit } as Linha

  return (
    <PermissionGuard permissao={cfg.permissaoVer}>
      {/* Aviso flutuante de sucesso/erro */}
      {aviso && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-[60] sm:max-w-sm" role="status">
          <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
            aviso.tipo === 'ok' ? 'bg-white border-green-200' : 'bg-white border-red-200'
          }`}>
            {aviso.tipo === 'ok'
              ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              : <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
            <p className={`text-sm flex-1 ${aviso.tipo === 'ok' ? 'text-gray-800' : 'text-red-700'}`}>{aviso.texto}</p>
            <button onClick={() => setAviso(null)} className="text-gray-400 hover:text-gray-700" aria-label="Fechar aviso">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <Link href={cfg.rotaAdmin} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> {cfg.plural}
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <div className="flex flex-col xl:flex-row xl:items-center gap-5">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <span className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 flex items-center justify-center">
              {camposEdit.foto_capa_url
                ? <Image src={camposEdit.foto_capa_url} alt={camposEdit.nome} fill className="object-cover" unoptimized sizes="80px" />
                : <ImageIcon className="w-6 h-6 text-gray-300" />}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{original.nome || 'Sem nome'}</h1>
                <StatusCadastroBadge status={status} grande />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {original.categoria || 'Sem categoria'}
              </p>
              <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Chegou em {dataHoraBr(original.created_at)} ({haQuanto(original.created_at)})</span>
                <span className="inline-flex items-center gap-1">
                  · {original.origem === 'painel' ? <LayoutPanelLeft className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                  {rotuloOrigem(original.origem)}
                </span>
                {original.analisado_em && <span>· Analisado em {dataHoraBr(original.analisado_em)}</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            {status === 'publicado' && (
              <a
                href={urlPublica}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" /> Ver no site
              </a>
            )}
            {podeEditar && (
              <>
                <button
                  onClick={salvar}
                  disabled={!alterado || ocupado}
                  className="h-11 px-4 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5 disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent flex items-center gap-1.5"
                >
                  {salvando === 'salvar' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Salvar alterações
                </button>
                {ACOES_POR_STATUS[status].map((acao) => {
                  const def = ACOES[acao]
                  const Icone = ICONE_ACAO[acao]
                  const principal = acao === 'publicar'
                  return (
                    <button
                      key={acao}
                      onClick={() => setConfirmar(acao)}
                      disabled={ocupado}
                      className={`h-11 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 disabled:opacity-60 ${
                        principal
                          ? 'bg-primary text-white hover:opacity-90 shadow-sm'
                          : acao === 'reprovar'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icone className="w-4 h-4" />
                      {acao === 'publicar' ? 'Publicar no site' : def.botao}
                    </button>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 mb-5">
        <div className="flex gap-1">
          {([['editar', 'Editar', Pencil], ['previa', 'Pré-visualizar', Eye]] as const).map(([chave, rotulo, Icone]) => (
            <button
              key={chave}
              onClick={() => setAba(chave)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                aba === chave ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icone className="w-4 h-4" /> {rotulo}
              {aba === chave && <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
        {alterado && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Alterações não salvas
          </span>
        )}
      </div>

      {aba === 'editar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <fieldset disabled={!podeEditar || ocupado} className="min-w-0">
            {!podeEditar && (
              <p className="mb-4 text-sm text-gray-600 bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" /> Seu departamento pode consultar, mas não editar nem publicar este cadastro.
              </p>
            )}
            {tipo === 'parceiro' ? (
              <FormParceiro valor={edit as ParceiroRow} set={set as (p: Partial<ParceiroRow>) => void} slugErro={slugErro} />
            ) : (
              <FormAssociado valor={edit as AssociadoRow} set={set as (p: Partial<AssociadoRow>) => void} slugErro={slugErro} />
            )}
          </fieldset>

          <aside className="lg:sticky lg:top-6 space-y-4">
            <DadosInternos privado={privado} origem={original.origem} />
          </aside>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            É assim que a página vai aparecer no site{alterado ? ', já com as alterações que ainda não foram salvas' : ''}.
          </p>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="h-11 bg-gray-100 border-b border-gray-200 flex items-center gap-3 px-4">
              <span className="flex gap-1.5 shrink-0">
                <span className="w-3 h-3 rounded-full bg-red-300" />
                <span className="w-3 h-3 rounded-full bg-amber-300" />
                <span className="w-3 h-3 rounded-full bg-green-300" />
              </span>
              <span className="flex-1 min-w-0 h-7 rounded-lg bg-white border border-gray-200 px-3 text-xs text-gray-500 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">{host}{cfg.rotaSite}/{camposEdit.slug || '...'}</span>
              </span>
            </div>
            {/* translateZ cria um contexto próprio: elementos fixos da página ficam presos na moldura */}
            <div className="relative bg-white overflow-hidden" style={{ transform: 'translateZ(0)' }}>
              {tipo === 'parceiro' ? (
                <ParceiroPagina parceiro={parceiroDaLinha(linhaPrevia as ParceiroRow)} outros={outros as Parceiro[]} previa />
              ) : (
                <AssociadoPagina associado={associadoDaLinha(linhaPrevia as AssociadoRow)} outros={outros as Associado[]} previa />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Barra fixa quando há alterações pendentes */}
      {alterado && podeEditar && (
        <div className="sticky bottom-0 z-30 mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/95 backdrop-blur border-t border-gray-200 flex flex-wrap items-center gap-3">
          <span className="text-sm text-amber-700 font-medium flex items-center gap-2 mr-auto">
            <AlertTriangle className="w-4 h-4" /> Você tem alterações não salvas.
          </span>
          <button
            onClick={descartar}
            disabled={ocupado}
            className="h-10 px-4 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-60"
          >
            Descartar
          </button>
          <button
            onClick={salvar}
            disabled={ocupado}
            className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center gap-1.5"
          >
            {salvando === 'salvar' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar alterações
          </button>
        </div>
      )}

      {confirmar && (
        <ModalConfirmacao
          acao={confirmar}
          nome={camposEdit.nome || original.nome}
          endereco={`${host}${cfg.rotaSite}/${camposEdit.slug}`}
          statusAtual={status}
          alterado={alterado}
          carregando={salvando === confirmar}
          onCancelar={() => setConfirmar(null)}
          onConfirmar={() => executar(confirmar)}
        />
      )}
    </PermissionGuard>
  )
}

/* ------------------------------------------------------------------ */
/* Bloco lateral: dados que não vão para o site                        */
/* ------------------------------------------------------------------ */

function DadosInternos({ privado, origem }: { privado: CadastroPrivadoRow | null; origem: string }) {
  const r = privado?.responsavel ?? {}
  const digitos = (r.telefone ?? '').replace(/\D/g, '')
  const wa = digitos ? (digitos.startsWith('55') ? digitos : `55${digitos}`) : ''
  const vazio = !privado || (!r.nome && !r.cargo && !r.telefone && !r.email && !privado.documento && !privado.mensagem)

  return (
    <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <header className="px-5 py-4 border-b border-gray-100 bg-secondary/5">
        <h2 className="font-bold text-sm flex items-center gap-2 text-gray-900">
          <Lock className="w-4 h-4 text-secondary" /> Dados internos
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Não aparecem no site. Só para contato e conferência.</p>
      </header>
      <div className="p-5">
        {vazio ? (
          <p className="text-sm text-gray-400">
            {origem === 'painel'
              ? 'Cadastro criado pelo painel, sem dados internos.'
              : 'Nenhum dado interno foi enviado com este cadastro.'}
          </p>
        ) : (
          <dl className="space-y-4 text-sm">
            {r.nome && <ItemDado icone={User} rotulo="Responsável">{r.nome}</ItemDado>}
            {r.cargo && <ItemDado icone={Briefcase} rotulo="Cargo">{r.cargo}</ItemDado>}
            {r.telefone && (
              <ItemDado icone={Phone} rotulo="Telefone">
                <a href={`tel:+${wa}`} className="text-primary hover:underline">{r.telefone}</a>
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#25D366] hover:opacity-90 rounded-lg px-2.5 py-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chamar no WhatsApp
                </a>
              </ItemDado>
            )}
            {r.email && (
              <ItemDado icone={Mail} rotulo="E-mail">
                <a href={`mailto:${r.email}`} className="text-primary hover:underline break-all">{r.email}</a>
              </ItemDado>
            )}
            {privado?.documento && <ItemDado icone={IdCard} rotulo="CPF / CNPJ"><span className="font-mono">{privado.documento}</span></ItemDado>}
            {privado?.mensagem && (
              <ItemDado icone={FileText} rotulo="Mensagem">
                <span className="block whitespace-pre-line text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-100">{privado.mensagem}</span>
              </ItemDado>
            )}
          </dl>
        )}
      </div>
    </section>
  )
}

function ItemDado({ icone: Icone, rotulo, children }: { icone: typeof User; rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-gray-400">{rotulo}</dt>
        <dd className="text-gray-800 flex flex-col items-start">{children}</dd>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Confirmação das mudanças de status                                  */
/* ------------------------------------------------------------------ */

function ModalConfirmacao({
  acao, nome, endereco, statusAtual, alterado, carregando, onCancelar, onConfirmar,
}: {
  acao: Acao
  nome: string
  endereco: string
  statusAtual: StatusCadastro
  alterado: boolean
  carregando: boolean
  onCancelar: () => void
  onConfirmar: () => void
}) {
  const def = ACOES[acao]
  const Icone = ICONE_ACAO[acao]

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape' && !carregando) onCancelar() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [carregando, onCancelar])

  const texto: Record<Acao, React.ReactNode> = {
    publicar: <>A página de <strong>{nome}</strong> ficará visível para todos em <span className="font-mono text-gray-800 break-all">{endereco}</span>.</>,
    reprovar: <>A página de <strong>{nome}</strong> não será publicada. O cadastro fica guardado na aba Reprovados e pode ser publicado depois.</>,
    ocultar: <>A página de <strong>{nome}</strong> deixa de aparecer no site. O cadastro continua guardado na aba Fora do ar e pode voltar quando quiser.</>,
    reanalisar: statusAtual === 'publicado'
      ? <>A página de <strong>{nome}</strong> sai do ar e o cadastro volta para a fila Aguardando análise.</>
      : <>O cadastro de <strong>{nome}</strong> volta para a fila Aguardando análise.</>,
  }

  const corIcone: Record<DefAcao['tom'], string> = {
    primary: 'bg-primary/10 text-primary',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-gray-100 text-gray-700',
    secondary: 'bg-secondary/10 text-secondary',
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => { if (!carregando) onCancelar() }} />
      <div role="dialog" aria-modal="true" className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <span className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${corIcone[def.tom]}`}>
          <Icone className="w-6 h-6" />
        </span>
        <h3 className="text-lg font-bold text-gray-900">{def.titulo}</h3>
        <p className="text-sm text-gray-600 mt-2">{texto[acao]}</p>
        {alterado && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mt-4 flex gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            Há alterações não salvas. Elas serão salvas junto com esta ação.
          </p>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancelar}
            disabled={carregando}
            className="h-11 px-5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={carregando}
            className={`h-11 px-5 rounded-xl text-sm font-semibold flex items-center gap-1.5 disabled:opacity-70 ${BOTAO_TOM[def.tom]}`}
          >
            {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icone className="w-4 h-4" />}
            {def.botao}
          </button>
        </div>
      </div>
    </div>
  )
}
