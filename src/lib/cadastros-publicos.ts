/**
 * Leitura pública de parceiros e associados (somente servidor).
 *
 * Junta duas fontes:
 *  1. Os cadastros fixos do código (`PARCEIROS` e `ASSOCIADOS`), que sempre
 *     aparecem e vêm primeiro.
 *  2. Os cadastros feitos pelo site e aprovados no painel, lidos do banco com a
 *     chave pública. A política de acesso só devolve linhas com `ativo = true`
 *     (status "publicado"), então pendentes, ocultos e reprovados nunca chegam aqui.
 *
 * Se dois cadastros tiverem o mesmo slug, o fixo vence.
 * Se o banco não estiver configurado ou falhar, devolve só os fixos: o site
 * nunca pode quebrar por causa desta leitura.
 *
 * Tudo é memoizado com `React.cache`, então a página, o generateMetadata e os
 * componentes da mesma renderização compartilham uma única consulta.
 */
import { cache } from 'react'
import { unstable_rethrow } from 'next/navigation'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { getTenant } from '@/lib/tenant'
import { PARCEIROS, type Parceiro } from '@/lib/parceiros'
import { ASSOCIADOS, type Associado } from '@/lib/associados'
import {
  parceiroDaLinha, associadoDaLinha,
  type ParceiroRow, type AssociadoRow,
} from '@/lib/cadastros'

type Tabela = 'parceiros' | 'associados'

/** Lê as linhas publicadas do tenant atual. Qualquer falha vira lista vazia. */
async function linhasPublicadas<T>(tabela: Tabela): Promise<T[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const { id: tenantId } = await getTenant()
    const { data, error } = await getPublicClient()
      .from(tabela)
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('ativo', true)
      .order('destaque', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`[${tabela}] falha ao consultar o banco:`, error.message)
      return []
    }
    return (data || []) as T[]
  } catch (err) {
    // Erros internos do Next (renderização dinâmica, notFound etc.) precisam subir
    unstable_rethrow(err)
    console.error(`[${tabela}] erro inesperado ao consultar o banco:`, err)
    return []
  }
}

/** Fixos primeiro; do banco entra só o que tiver slug novo (sem repetir). */
function juntar<T extends { slug: string }>(fixos: T[], doBanco: T[]): T[] {
  const usados = new Set(fixos.map((x) => x.slug))
  const extras: T[] = []
  for (const item of doBanco) {
    if (!item.slug || usados.has(item.slug)) continue
    usados.add(item.slug)
    extras.push(item)
  }
  return [...fixos, ...extras]
}

/** Converte linha a linha, descartando a que vier com dado quebrado. */
function converter<R, T>(linhas: R[], fn: (r: R) => T, tabela: Tabela): T[] {
  const saida: T[] = []
  for (const linha of linhas) {
    try {
      saida.push(fn(linha))
    } catch (err) {
      console.error(`[${tabela}] cadastro ignorado por dado inválido:`, err)
    }
  }
  return saida
}

// ── Parceiros ──────────────────────────────────────────────────────────────

export const listarParceiros = cache(async (): Promise<Parceiro[]> => {
  const linhas = await linhasPublicadas<ParceiroRow>('parceiros')
  return juntar(PARCEIROS, converter(linhas, parceiroDaLinha, 'parceiros'))
})

export const buscarParceiro = cache(async (slug: string): Promise<Parceiro | undefined> => {
  const fixo = PARCEIROS.find((p) => p.slug === slug)
  if (fixo) return fixo
  const todos = await listarParceiros()
  return todos.find((p) => p.slug === slug)
})

// ── Associados ─────────────────────────────────────────────────────────────

export const listarAssociados = cache(async (): Promise<Associado[]> => {
  const linhas = await linhasPublicadas<AssociadoRow>('associados')
  return juntar(ASSOCIADOS, converter(linhas, associadoDaLinha, 'associados'))
})

export const buscarAssociado = cache(async (slug: string): Promise<Associado | undefined> => {
  const fixo = ASSOCIADOS.find((a) => a.slug === slug)
  if (fixo) return fixo
  const todos = await listarAssociados()
  return todos.find((a) => a.slug === slug)
})
