'use client'

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Save, ArrowLeft, Info } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { PageHeader, Card, EmptyState, PermissionGuard } from '@/components/admin/ui'

interface Permissao {
  chave: string
  modulo: string
  acao: string
  descricao: string | null
  ordem: number
}

interface Departamento {
  id: string
  nome: string
  cor: string | null
}

/** Rótulo amigável por módulo, na mesma ordem visual da sidebar. */
const GRUPOS: { titulo: string; modulos: string[] }[] = [
  { titulo: 'Conteúdo do site', modulos: ['marca', 'servicos', 'vitrine', 'diretoria', 'eventos'] },
  { titulo: 'Rede', modulos: ['associados', 'parceiros', 'afiliados', 'indicacoes'] },
  { titulo: 'Monetização', modulos: ['banners'] },
  { titulo: 'Relacionamento', modulos: ['leads', 'leads_financeiro', 'recrutamento'] },
  { titulo: 'Administração', modulos: ['usuarios', 'permissoes'] },
]

const NOMES_MODULO: Record<string, string> = {
  marca: 'Marca e identidade',
  servicos: 'Serviços',
  vitrine: 'Vitrine da home',
  diretoria: 'Diretoria',
  eventos: 'Eventos',
  associados: 'Associados',
  parceiros: 'Parceiros',
  afiliados: 'Afiliados',
  indicacoes: 'Indicações e comissões',
  banners: 'Banners de anunciantes',
  leads: 'Leads',
  leads_financeiro: 'Leads financeiros',
  recrutamento: 'Recrutamento',
  usuarios: 'Usuários e departamentos',
  permissoes: 'Configurar permissões',
}

export default function PermissoesPage() {
  const { tenantId, canAccess } = useAdminAuth()
  const [permissoes, setPermissoes] = useState<Permissao[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  /** Set de "departamentoId::permissaoChave" */
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set())
  const [original, setOriginal] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const podeEditar = canAccess('permissoes.editar')

  const carregar = useCallback(async () => {
    const sb = getBrowserClient()
    const [p, d] = await Promise.all([
      sb.from('permissoes').select('*').order('ordem'),
      sb.from('departamentos').select('id, nome, cor').eq('tenant_id', tenantId).order('nome'),
    ])
    const deps = (d.data ?? []) as Departamento[]
    setPermissoes((p.data ?? []) as Permissao[])
    setDepartamentos(deps)

    if (deps.length > 0) {
      const { data: dp } = await sb
        .from('departamento_permissoes')
        .select('departamento_id, permissao_chave')
        .in('departamento_id', deps.map((x) => x.id))
      const set = new Set((dp ?? []).map((r) => `${r.departamento_id}::${r.permissao_chave}`))
      setMarcadas(new Set(set))
      setOriginal(new Set(set))
    }
  }, [tenantId])

  useEffect(() => { carregar() }, [carregar])

  function alternar(depId: string, chave: string) {
    const k = `${depId}::${chave}`
    setMarcadas((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  function alternarLinha(chave: string, marcar: boolean) {
    setMarcadas((prev) => {
      const next = new Set(prev)
      departamentos.forEach((d) => {
        const k = `${d.id}::${chave}`
        if (marcar) next.add(k)
        else next.delete(k)
      })
      return next
    })
  }

  function alternarColuna(depId: string, marcar: boolean) {
    setMarcadas((prev) => {
      const next = new Set(prev)
      permissoes.forEach((p) => {
        const k = `${depId}::${p.chave}`
        if (marcar) next.add(k)
        else next.delete(k)
      })
      return next
    })
  }

  const sujo = useMemo(() => {
    if (marcadas.size !== original.size) return true
    for (const k of marcadas) if (!original.has(k)) return true
    return false
  }, [marcadas, original])

  async function salvar() {
    setSaving(true)
    const sb = getBrowserClient()
    const inserir: { departamento_id: string; permissao_chave: string }[] = []
    const remover: { departamento_id: string; permissao_chave: string }[] = []

    for (const k of marcadas) {
      if (!original.has(k)) {
        const [departamento_id, permissao_chave] = k.split('::')
        inserir.push({ departamento_id, permissao_chave })
      }
    }
    for (const k of original) {
      if (!marcadas.has(k)) {
        const [departamento_id, permissao_chave] = k.split('::')
        remover.push({ departamento_id, permissao_chave })
      }
    }

    if (inserir.length) await sb.from('departamento_permissoes').insert(inserir)
    for (const r of remover) {
      await sb.from('departamento_permissoes').delete()
        .eq('departamento_id', r.departamento_id)
        .eq('permissao_chave', r.permissao_chave)
    }

    setSaving(false)
    setOriginal(new Set(marcadas))
    setMessage('Permissões atualizadas!')
    setTimeout(() => setMessage(''), 3000)
  }

  const porModulo = useMemo(() => {
    const mapa = new Map<string, Permissao[]>()
    permissoes.forEach((p) => {
      const lista = mapa.get(p.modulo) ?? []
      lista.push(p)
      mapa.set(p.modulo, lista)
    })
    return mapa
  }, [permissoes])

  return (
    <PermissionGuard permissao="permissoes.editar">
      <Link href="/admin/usuarios" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar para usuários
      </Link>

      <PageHeader
        titulo="Permissões por departamento"
        descricao="Marque o que cada departamento pode ver e editar no painel."
      />

      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl px-4 py-3 mb-6 text-sm">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          Usuários <strong>sem departamento</strong> têm acesso total ao painel, independente desta
          matriz. Para restringir alguém, atribua um departamento a ele na tela de usuários.
        </p>
      </div>

      {departamentos.length === 0 ? (
        <Card>
          <EmptyState
            titulo="Nenhum departamento criado"
            descricao="Crie departamentos primeiro para poder configurar permissões."
            acao={
              <Link href="/admin/usuarios/departamentos" className="inline-flex h-11 px-5 items-center bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90">
                Criar departamento
              </Link>
            }
          />
        </Card>
      ) : (
        <Card title="Matriz de permissões" icon={<ShieldCheck className="w-4 h-4 text-primary" />}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white z-10 text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase min-w-[240px]">
                    Permissão
                  </th>
                  {departamentos.map((d) => (
                    <th key={d.id} className="px-3 py-3 text-center min-w-[120px]">
                      <span className="block text-xs font-semibold truncate" style={{ color: d.cor || undefined }}>
                        {d.nome}
                      </span>
                      {podeEditar && (
                        <span className="flex items-center justify-center gap-1 mt-1">
                          <button onClick={() => alternarColuna(d.id, true)} className="text-[10px] text-gray-400 hover:text-primary">todas</button>
                          <span className="text-[10px] text-gray-300">/</span>
                          <button onClick={() => alternarColuna(d.id, false)} className="text-[10px] text-gray-400 hover:text-red-500">nenhuma</button>
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRUPOS.map((grupo) => {
                  const modulosComPerm = grupo.modulos.filter((m) => porModulo.has(m))
                  if (modulosComPerm.length === 0) return null
                  return (
                    <Fragment key={grupo.titulo}>
                      <tr>
                        <td
                          colSpan={departamentos.length + 1}
                          className="sticky left-0 bg-gray-50 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-y border-gray-100"
                        >
                          {grupo.titulo}
                        </td>
                      </tr>
                      {modulosComPerm.flatMap((modulo) =>
                        (porModulo.get(modulo) ?? []).map((p) => (
                          <tr key={p.chave} className="hover:bg-gray-50">
                            <td className="sticky left-0 bg-white hover:bg-gray-50 px-5 py-2.5 border-b border-gray-50">
                              <span className="block text-sm text-gray-800">
                                {NOMES_MODULO[p.modulo] ?? p.modulo}
                                <span className={`ml-2 text-xs ${p.acao === 'editar' ? 'text-amber-600' : 'text-gray-400'}`}>
                                  {p.acao}
                                </span>
                              </span>
                              {podeEditar && (
                                <span className="flex items-center gap-1 mt-0.5">
                                  <button onClick={() => alternarLinha(p.chave, true)} className="text-[10px] text-gray-400 hover:text-primary">marcar todos</button>
                                  <span className="text-[10px] text-gray-300">/</span>
                                  <button onClick={() => alternarLinha(p.chave, false)} className="text-[10px] text-gray-400 hover:text-red-500">limpar</button>
                                </span>
                              )}
                            </td>
                            {departamentos.map((d) => (
                              <td key={d.id} className="text-center border-b border-gray-50">
                                <input
                                  type="checkbox"
                                  checked={marcadas.has(`${d.id}::${p.chave}`)}
                                  onChange={() => alternar(d.id, p.chave)}
                                  disabled={!podeEditar}
                                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:cursor-default"
                                />
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {podeEditar && departamentos.length > 0 && (
        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-gray-50/90 backdrop-blur py-3">
          {message && <span className="text-sm text-green-600 font-medium mr-auto">{message}</span>}
          {sujo && <span className="text-sm text-amber-600 font-medium mr-auto">Alterações não salvas</span>}
          <button
            onClick={salvar}
            disabled={saving || !sujo}
            className="flex items-center gap-1.5 h-11 px-6 bg-primary text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-40"
          >
            <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      )}
    </PermissionGuard>
  )
}
