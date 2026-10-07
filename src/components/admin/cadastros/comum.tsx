'use client'

/**
 * Peças compartilhadas da área de análise e liberação de cadastros
 * (parceiros e associados): configuração por tipo, selo de status,
 * contagem de pendentes, envio de imagens e aviso ao site para atualizar
 * a página pública depois de uma mudança.
 */
import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getBrowserClient } from '@/lib/supabase/browser'
import { slugify } from '@/lib/slug'
import { PARCEIROS } from '@/lib/parceiros'
import { ASSOCIADOS } from '@/lib/associados'
import { STATUS_ROTULO, type StatusCadastro } from '@/lib/cadastros'
import { useAdminAuth } from '../AdminAuthProvider'

export type TipoCadastro = 'parceiro' | 'associado'

export interface ConfigCadastro {
  tipo: TipoCadastro
  tabela: 'parceiros' | 'associados'
  singular: string
  plural: string
  rotaAdmin: string
  rotaSite: string
  permissaoVer: string
  permissaoEditar: string
  /** Slugs ocupados por páginas fixas no código */
  slugsReservados: string[]
}

export const CONFIG: Record<TipoCadastro, ConfigCadastro> = {
  parceiro: {
    tipo: 'parceiro',
    tabela: 'parceiros',
    singular: 'parceiro',
    plural: 'Parceiros',
    rotaAdmin: '/admin/parceiros',
    rotaSite: '/parceiros',
    permissaoVer: 'parceiros.ver',
    permissaoEditar: 'parceiros.editar',
    slugsReservados: PARCEIROS.map((p) => p.slug),
  },
  associado: {
    tipo: 'associado',
    tabela: 'associados',
    singular: 'associado',
    plural: 'Associados',
    rotaAdmin: '/admin/associados',
    rotaSite: '/associados',
    permissaoVer: 'associados.ver',
    permissaoEditar: 'associados.editar',
    slugsReservados: ASSOCIADOS.map((a) => a.slug),
  },
}

/** Ordem das abas na listagem: o que precisa de ação vem primeiro. */
export const ORDEM_STATUS: StatusCadastro[] = ['pendente', 'publicado', 'oculto', 'reprovado']

const CORES_STATUS: Record<StatusCadastro, string> = {
  pendente: 'bg-amber-50 text-amber-700 border-amber-200',
  publicado: 'bg-green-50 text-green-700 border-green-200',
  oculto: 'bg-gray-100 text-gray-600 border-gray-200',
  reprovado: 'bg-red-50 text-red-600 border-red-200',
}

const PONTO_STATUS: Record<StatusCadastro, string> = {
  pendente: 'bg-amber-500',
  publicado: 'bg-green-500',
  oculto: 'bg-gray-400',
  reprovado: 'bg-red-500',
}

export function StatusCadastroBadge({ status, grande }: { status: StatusCadastro; grande?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border whitespace-nowrap ${
        grande ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-xs'
      } ${CORES_STATUS[status] ?? CORES_STATUS.pendente}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${PONTO_STATUS[status] ?? PONTO_STATUS.pendente}`} />
      {STATUS_ROTULO[status] ?? status}
    </span>
  )
}

/** Cadastros criados pelo painel têm origem "painel"; o resto veio do formulário público. */
export function rotuloOrigem(origem: string | null | undefined) {
  return !origem || origem === 'painel' ? 'Painel' : 'Formulário do site'
}

export function dataHoraBr(iso: string | null | undefined) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

export function dataBr(iso: string | null | undefined) {
  return iso ? new Date(iso).toLocaleDateString('pt-BR') : ''
}

/** Há quanto tempo o cadastro chegou, em texto curto ("há 3 dias"). */
export function haQuanto(iso: string | null | undefined) {
  if (!iso) return ''
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return 'agora mesmo'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h} h`
  const d = Math.floor(h / 24)
  if (d < 30) return `há ${d} ${d === 1 ? 'dia' : 'dias'}`
  return `em ${dataBr(iso)}`
}

/**
 * Limpa o slug enquanto a pessoa digita: minúsculas, sem acento, só a-z, 0-9
 * e hífen. Mantém o hífen final para não atrapalhar a digitação; a versão
 * definitiva passa por `slugify` ao sair do campo e ao salvar.
 */
export function limparSlugDigitando(v: string) {
  return v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/, '')
    .slice(0, 80)
}

export function slugFinal(v: string) {
  return slugify(v, 80)
}

/** Avisa as telas do painel (menu, dashboard) que um status mudou. */
export const EVENTO_CADASTROS = 'admin:cadastros-atualizados'
export function avisarCadastrosAtualizados() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENTO_CADASTROS))
}

export interface Pendentes { parceiros: number; associados: number }

/**
 * Conta os cadastros aguardando análise. Recarrega ao trocar de tela e quando
 * alguma ação de status é feita no painel.
 */
export function usePendentes(): Pendentes | null {
  const { tenantId, canAccess } = useAdminAuth()
  const pathname = usePathname()
  const [p, setP] = useState<Pendentes | null>(null)
  const verParceiros = canAccess('parceiros.ver')
  const verAssociados = canAccess('associados.ver')

  const carregar = useCallback(async () => {
    const sb = getBrowserClient()
    const contar = async (tabela: string, pode: boolean) => {
      if (!pode) return 0
      const { count } = await sb.from(tabela).select('id', { count: 'exact', head: true })
        .eq('tenant_id', tenantId).eq('status', 'pendente')
      return count ?? 0
    }
    const [parceiros, associados] = await Promise.all([
      contar('parceiros', verParceiros), contar('associados', verAssociados),
    ])
    setP({ parceiros, associados })
  }, [tenantId, verParceiros, verAssociados])

  useEffect(() => { carregar() }, [carregar, pathname])

  useEffect(() => {
    const ouvir = () => { carregar() }
    window.addEventListener(EVENTO_CADASTROS, ouvir)
    return () => window.removeEventListener(EVENTO_CADASTROS, ouvir)
  }, [carregar])

  return p
}

/**
 * Pede ao site que atualize a página pública. Nunca trava a tela: se falhar,
 * a página se atualiza sozinha no próximo ciclo do cache.
 */
export async function revalidarPagina(tipo: TipoCadastro, slug: string) {
  try {
    const { data } = await getBrowserClient().auth.getSession()
    const token = data.session?.access_token
    if (!token || !slug) return
    await fetch('/api/admin/revalidar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tipo, slug }),
    })
  } catch {
    // Silencioso de propósito: a ação principal já foi gravada.
  }
}

const BUCKET = 'tenant-uploads'
export const MAX_IMAGEM = 5 * 1024 * 1024

/** Envia uma imagem para `<tenant>/<pasta>/...` e devolve a URL pública. */
export async function enviarImagem(tenantId: string, pasta: string, file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error(`"${file.name}" não é uma imagem.`)
  if (file.size > MAX_IMAGEM) throw new Error(`"${file.name}" passa de 5 MB.`)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const base = slugify(file.name.replace(/\.[^.]+$/, ''), 40) || 'imagem'
  const caminho = `${tenantId}/${pasta}/${base}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const sb = getBrowserClient()
  const { error } = await sb.storage.from(BUCKET).upload(caminho, file, { cacheControl: '3600', upsert: false })
  if (error) throw new Error(error.message)
  return sb.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl
}
