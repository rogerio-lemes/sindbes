'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Save, ShieldCheck, Building2 } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { PageHeader, Card, StatusBadge, PermissionGuard } from '@/components/admin/ui'
import DataTable, { DataBr, type Coluna } from '@/components/admin/DataTable'

interface Perfil {
  user_id: string
  nome: string | null
  email: string | null
  papel: string
  departamento_id: string | null
  ativo: boolean | null
  created_at: string
}

interface Departamento {
  id: string
  nome: string
  cor: string | null
}

export default function UsuariosPage() {
  const { tenantId, perfil: eu, canAccess } = useAdminAuth()
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [pendentes, setPendentes] = useState<Record<string, Partial<Perfil>>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const podeEditar = canAccess('usuarios.editar')

  const carregar = useCallback(async () => {
    const sb = getBrowserClient()
    const [p, d] = await Promise.all([
      sb.from('perfis').select('user_id, nome, email, papel, departamento_id, ativo, created_at')
        .eq('tenant_id', tenantId).order('created_at'),
      sb.from('departamentos').select('id, nome, cor').eq('tenant_id', tenantId).order('nome'),
    ])
    setPerfis((p.data ?? []) as Perfil[])
    setDepartamentos((d.data ?? []) as Departamento[])
    setPendentes({})
  }, [tenantId])

  useEffect(() => { carregar() }, [carregar])

  function alterar(userId: string, campo: keyof Perfil, valor: unknown) {
    setPendentes((p) => ({ ...p, [userId]: { ...p[userId], [campo]: valor } }))
  }

  async function salvar() {
    const entradas = Object.entries(pendentes)
    if (entradas.length === 0) return
    setSaving(true)
    const sb = getBrowserClient()
    await Promise.all(entradas.map(([userId, mudancas]) =>
      sb.from('perfis').update(mudancas).eq('user_id', userId)))
    setSaving(false)
    setMessage('Usuários atualizados!')
    setTimeout(() => setMessage(''), 3000)
    carregar()
  }

  function valorAtual<K extends keyof Perfil>(p: Perfil, campo: K): Perfil[K] {
    const pend = pendentes[p.user_id]
    return (pend && campo in pend ? pend[campo] : p[campo]) as Perfil[K]
  }

  const opcoesDepartamento = [
    { value: '', label: 'Acesso total (sem departamento)' },
    ...departamentos.map((d) => ({ value: d.id, label: d.nome })),
  ]

  const colunas: Coluna<Perfil>[] = [
    {
      header: 'Usuário',
      cell: (p) => (
        <div className="min-w-0">
          <p className="font-medium truncate">{p.nome || '—'}</p>
          <p className="text-xs text-gray-400 truncate">{p.email}</p>
        </div>
      ),
    },
    {
      header: 'Papel',
      cell: (p) => (
        <StatusBadge
          status={p.papel === 'super_admin' ? 'agendado' : 'neutro'}
          label={p.papel === 'super_admin' ? 'Super admin' : 'Administrador'}
        />
      ),
    },
    {
      header: 'Departamento',
      cell: (p) => {
        if (!podeEditar) {
          const dep = departamentos.find((d) => d.id === p.departamento_id)
          return <span className="text-gray-500">{dep?.nome ?? 'Acesso total'}</span>
        }
        return (
          <div className="min-w-[220px]">
            <select
              value={valorAtual(p, 'departamento_id') ?? ''}
              onChange={(e) => alterar(p.user_id, 'departamento_id', e.target.value || null)}
              className="w-full h-10 px-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
            >
              {opcoesDepartamento.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )
      },
    },
    {
      header: 'Acesso',
      cell: (p) => {
        const ativo = valorAtual(p, 'ativo') !== false
        const ehEu = p.user_id === eu.user_id
        if (!podeEditar || ehEu) {
          return <StatusBadge status={ativo ? 'ativo' : 'inativo'} label={ativo ? 'Ativo' : 'Desativado'} />
        }
        return (
          <button onClick={() => alterar(p.user_id, 'ativo', !ativo)} title="Clique para alternar">
            <StatusBadge status={ativo ? 'ativo' : 'inativo'} label={ativo ? 'Ativo' : 'Desativado'} />
          </button>
        )
      },
    },
    { header: 'Desde', cell: (p) => <DataBr valor={p.created_at} /> },
  ]

  const temPendencias = Object.keys(pendentes).length > 0

  return (
    <PermissionGuard permissao="usuarios.ver">
      <PageHeader
        titulo="Usuários e departamentos"
        descricao="Quem tem acesso ao painel e com qual escopo de permissões."
        acoes={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/usuarios/departamentos"
              className="flex items-center gap-1.5 h-11 px-4 bg-white border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50"
            >
              <Building2 className="w-4 h-4" /> Departamentos
            </Link>
            <Link
              href="/admin/configuracoes/permissoes"
              className="flex items-center gap-1.5 h-11 px-4 bg-white border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50"
            >
              <ShieldCheck className="w-4 h-4" /> Permissões
            </Link>
          </div>
        }
      />

      <Card title={`${perfis.length} usuário(s)`} icon={<Users className="w-4 h-4 text-primary" />}>
        <DataTable colunas={colunas} dados={perfis} rowKey={(p) => p.user_id} vazio="Nenhum usuário vinculado a este site." />
      </Card>

      <p className="text-xs text-gray-500 -mt-2 mb-6">
        Novos acessos são criados no Supabase Auth e vinculados a este site pela equipe da plataforma.
        Um usuário <strong>sem departamento</strong> tem acesso total ao painel.
      </p>

      {podeEditar && temPendencias && (
        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-gray-50/90 backdrop-blur py-3">
          {message && <span className="text-sm text-green-600 font-medium mr-auto">{message}</span>}
          <button onClick={carregar} className="h-11 px-5 text-sm font-medium text-gray-600 hover:text-gray-900">
            Descartar
          </button>
          <button
            onClick={salvar}
            disabled={saving}
            className="flex items-center gap-1.5 h-11 px-6 bg-primary text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      )}
      {message && !temPendencias && <p className="text-sm text-green-600 font-medium">{message}</p>}
    </PermissionGuard>
  )
}
