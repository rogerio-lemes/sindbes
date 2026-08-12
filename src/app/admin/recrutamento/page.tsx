'use client'

import { useCallback, useEffect, useState } from 'react'
import { Briefcase, GraduationCap } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { PageHeader, Card, StatusBadge, PermissionGuard } from '@/components/admin/ui'
import DataTable, { WhatsappLink, DataBr, type Coluna } from '@/components/admin/DataTable'

interface Vaga {
  id: string
  titulo: string
  funcao: string | null
  empresa: string | null
  tipo: string | null
  contato: string | null
  ativa: boolean
  created_at: string
}

interface Curriculo {
  id: string
  nome: string
  funcao: string | null
  cidade: string | null
  telefone: string | null
  experiencia: string | null
  created_at: string
}

export default function RecrutamentoPage() {
  const { tenantId, canAccess } = useAdminAuth()
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [curriculos, setCurriculos] = useState<Curriculo[]>([])

  const podeEditar = canAccess('recrutamento.editar')

  const carregar = useCallback(async () => {
    const sb = getBrowserClient()
    const [v, c] = await Promise.all([
      sb.from('vagas').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(300),
      sb.from('curriculos').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(300),
    ])
    setVagas((v.data ?? []) as Vaga[])
    setCurriculos((c.data ?? []) as Curriculo[])
  }, [tenantId])

  useEffect(() => { carregar() }, [carregar])

  async function alternarVaga(id: string, ativa: boolean) {
    await getBrowserClient().from('vagas').update({ ativa }).eq('id', id)
    carregar()
  }

  const colunasVagas: Coluna<Vaga>[] = [
    { header: 'Título', cell: (v) => <span className="font-medium">{v.titulo}</span> },
    { header: 'Função', cell: (v) => <span className="text-gray-500">{v.funcao || '—'}</span> },
    { header: 'Empresa', cell: (v) => <span className="text-gray-500">{v.empresa || '—'}</span> },
    { header: 'Tipo', cell: (v) => <span className="text-gray-500">{v.tipo || '—'}</span> },
    { header: 'Contato', cell: (v) => <span className="text-gray-500">{v.contato || '—'}</span> },
    {
      header: 'Status',
      cell: (v) => podeEditar ? (
        <button onClick={() => alternarVaga(v.id, !v.ativa)} title="Clique para alternar">
          <StatusBadge status={v.ativa ? 'ativo' : 'inativo'} label={v.ativa ? 'Ativa' : 'Inativa'} />
        </button>
      ) : (
        <StatusBadge status={v.ativa ? 'ativo' : 'inativo'} label={v.ativa ? 'Ativa' : 'Inativa'} />
      ),
    },
    { header: 'Data', cell: (v) => <DataBr valor={v.created_at} /> },
  ]

  const colunasCurriculos: Coluna<Curriculo>[] = [
    { header: 'Nome', cell: (c) => <span className="font-medium">{c.nome}</span> },
    { header: 'Função', cell: (c) => <span className="text-gray-500">{c.funcao || '—'}</span> },
    { header: 'Cidade', cell: (c) => <span className="text-gray-500">{c.cidade || '—'}</span> },
    { header: 'Telefone', cell: (c) => <WhatsappLink telefone={c.telefone} /> },
    { header: 'Experiência', cell: (c) => <span className="text-gray-500">{c.experiencia || '—'}</span> },
    { header: 'Data', cell: (c) => <DataBr valor={c.created_at} /> },
  ]

  return (
    <PermissionGuard permissao="recrutamento.ver">
      <PageHeader titulo="Recrutamento" descricao="Vagas publicadas e currículos cadastrados pelo site." />

      <Card title={`Vagas (${vagas.length})`} icon={<Briefcase className="w-4 h-4 text-primary" />}>
        <DataTable colunas={colunasVagas} dados={vagas} rowKey={(v) => v.id} vazio="Nenhuma vaga cadastrada." />
      </Card>

      <Card title={`Currículos (${curriculos.length})`} icon={<GraduationCap className="w-4 h-4 text-primary" />}>
        <DataTable colunas={colunasCurriculos} dados={curriculos} rowKey={(c) => c.id} vazio="Nenhum currículo cadastrado." />
      </Card>
    </PermissionGuard>
  )
}
