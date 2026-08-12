'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, Plus, Save, Trash2, ArrowLeft, ShieldCheck } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { PageHeader, Card, Field, TextArea, EmptyState, PermissionGuard } from '@/components/admin/ui'

interface Departamento {
  id: string | null
  nome: string
  descricao: string | null
  cor: string | null
  ativo: boolean
  _usuarios?: number
  _permissoes?: number
}

export default function DepartamentosPage() {
  const { tenantId, canAccess } = useAdminAuth()
  const [deps, setDeps] = useState<Departamento[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const podeEditar = canAccess('usuarios.editar')

  const carregar = useCallback(async () => {
    const sb = getBrowserClient()
    const { data } = await sb
      .from('departamentos')
      .select('id, nome, descricao, cor, ativo, departamento_permissoes(permissao_chave), perfis(user_id)')
      .eq('tenant_id', tenantId)
      .order('nome')

    setDeps((data ?? []).map((d) => {
      const row = d as Record<string, unknown>
      return {
        id: row.id as string,
        nome: row.nome as string,
        descricao: row.descricao as string | null,
        cor: row.cor as string | null,
        ativo: row.ativo as boolean,
        _permissoes: (row.departamento_permissoes as unknown[] | null)?.length ?? 0,
        _usuarios: (row.perfis as unknown[] | null)?.length ?? 0,
      }
    }))
  }, [tenantId])

  useEffect(() => { carregar() }, [carregar])

  function flash(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  async function salvar(d: Departamento) {
    setSaving(true)
    const sb = getBrowserClient()
    const payload = { nome: d.nome, descricao: d.descricao, cor: d.cor, ativo: d.ativo }
    if (d.id) await sb.from('departamentos').update(payload).eq('id', d.id)
    else await sb.from('departamentos').insert({ ...payload, tenant_id: tenantId })
    setSaving(false)
    flash('Departamento salvo!')
    carregar()
  }

  async function excluir(d: Departamento) {
    if (!d.id) { setDeps((prev) => prev.filter((x) => x !== d)); return }
    await getBrowserClient().from('departamentos').delete().eq('id', d.id)
    flash('Departamento excluído. Usuários que estavam nele passam a ter acesso total.')
    carregar()
  }

  return (
    <PermissionGuard permissao="usuarios.ver">
      <Link href="/admin/usuarios" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar para usuários
      </Link>

      <PageHeader
        titulo="Departamentos"
        descricao="Agrupe a equipe por área. As permissões de cada departamento são definidas na tela de Permissões."
        acoes={
          podeEditar && (
            <button
              onClick={() => setDeps([{ id: null, nome: '', descricao: '', cor: '#6E5A97', ativo: true }, ...deps])}
              className="flex items-center gap-1.5 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90"
            >
              <Plus className="w-4 h-4" /> Novo departamento
            </button>
          )
        }
      />

      {message && <p className="text-sm text-green-600 font-medium mb-4">{message}</p>}

      {deps.length === 0 ? (
        <Card>
          <EmptyState titulo="Nenhum departamento" descricao="Sem departamentos, todos os usuários têm acesso total ao painel." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {deps.map((d, i) => (
            <DepartamentoCard
              key={d.id ?? `novo-${i}`}
              dep={d}
              saving={saving}
              podeEditar={podeEditar}
              onSave={salvar}
              onDelete={() => excluir(d)}
            />
          ))}
        </div>
      )}
    </PermissionGuard>
  )
}

function DepartamentoCard({
  dep, onSave, onDelete, saving, podeEditar,
}: {
  dep: Departamento
  onSave: (d: Departamento) => void
  onDelete: () => void
  saving: boolean
  podeEditar: boolean
}) {
  const [data, setData] = useState(dep)

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start gap-3 mb-4">
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: data.cor || '#6E5A97' }}
        >
          <Building2 className="w-4 h-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm truncate">{data.nome || 'Novo departamento'}</p>
          <p className="text-xs text-gray-400">
            {dep._usuarios ?? 0} usuário(s) · {dep._permissoes ?? 0} permissão(ões)
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Field label="Nome" value={data.nome} onChange={(v) => setData({ ...data, nome: v })} disabled={!podeEditar} />
        <TextArea label="Descrição" value={data.descricao} onChange={(v) => setData({ ...data, descricao: v })} rows={2} />
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Cor do selo</span>
          <span className="flex items-center gap-2">
            <input
              type="color"
              value={data.cor || '#6E5A97'}
              onChange={(e) => setData({ ...data, cor: e.target.value })}
              className="w-11 h-11 rounded-lg border border-gray-200 cursor-pointer shrink-0"
            />
            <input
              type="text"
              value={data.cor ?? ''}
              onChange={(e) => setData({ ...data, cor: e.target.value })}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary"
            />
          </span>
        </label>
      </div>

      {podeEditar && (
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => onSave(data)}
            disabled={saving}
            className="flex items-center gap-1.5 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> Salvar
          </button>
          {dep.id && (
            <Link
              href="/admin/configuracoes/permissoes"
              className="flex items-center gap-1.5 h-10 px-4 bg-white border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50"
            >
              <ShieldCheck className="w-4 h-4" /> Permissões
            </Link>
          )}
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 h-10 px-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 ml-auto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  )
}
