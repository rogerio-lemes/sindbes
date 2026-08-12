'use client'

import { useCallback, useEffect, useState } from 'react'
import { Inbox, Search, Trash2 } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { PageHeader, Card, PermissionGuard } from '@/components/admin/ui'
import DataTable, { WhatsappLink, DataBr, type Coluna } from '@/components/admin/DataTable'

interface Lead {
  id: string
  nome: string | null
  telefone: string | null
  email: string | null
  mensagem: string | null
  origem: string | null
  pagina_slug: string | null
  created_at: string
}

export default function LeadsPage() {
  const { tenantId, canAccess } = useAdminAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [busca, setBusca] = useState('')

  const podeEditar = canAccess('leads.editar')

  const carregar = useCallback(async () => {
    const { data } = await getBrowserClient()
      .from('leads').select('*').eq('tenant_id', tenantId)
      .order('created_at', { ascending: false }).limit(500)
    setLeads((data ?? []) as Lead[])
  }, [tenantId])

  useEffect(() => { carregar() }, [carregar])

  async function excluir(id: string) {
    await getBrowserClient().from('leads').delete().eq('id', id)
    carregar()
  }

  const termo = busca.trim().toLowerCase()
  const filtrados = termo
    ? leads.filter((l) =>
        [l.nome, l.telefone, l.email, l.origem, l.pagina_slug]
          .some((v) => v?.toLowerCase().includes(termo)))
    : leads

  const colunas: Coluna<Lead>[] = [
    { header: 'Nome', cell: (l) => <span className="font-medium">{l.nome || '—'}</span> },
    { header: 'Telefone', cell: (l) => <WhatsappLink telefone={l.telefone} /> },
    { header: 'E-mail', cell: (l) => <span className="text-gray-500">{l.email || '—'}</span> },
    { header: 'Origem', cell: (l) => <span className="text-gray-500">{l.origem || l.pagina_slug || '—'}</span> },
    { header: 'Data', cell: (l) => <DataBr valor={l.created_at} /> },
  ]

  if (podeEditar) {
    colunas.push({
      header: 'Ações',
      align: 'right',
      cell: (l) => (
        <button
          onClick={() => excluir(l.id)}
          className="text-gray-400 hover:text-red-600 p-1"
          aria-label="Excluir lead"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    })
  }

  return (
    <PermissionGuard permissao="leads.ver">
      <PageHeader
        titulo="Leads"
        descricao="Contatos recebidos pelos formulários do site."
        acoes={
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar lead..."
              className="h-11 pl-9 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        }
      />

      <Card title={`${filtrados.length} lead(s)`} icon={<Inbox className="w-4 h-4 text-primary" />}>
        <DataTable
          colunas={colunas}
          dados={filtrados}
          rowKey={(l) => l.id}
          vazio={termo ? 'Nenhum lead encontrado para esta busca.' : 'Nenhum lead capturado ainda.'}
        />
      </Card>
    </PermissionGuard>
  )
}
