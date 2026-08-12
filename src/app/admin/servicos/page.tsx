'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { PageHeader, Card, Field, TextArea, Toggle, EmptyState, PermissionGuard } from '@/components/admin/ui'
import { slugify } from '@/lib/slug'

interface Servico {
  id: string | null
  tenant_id: string
  nome: string
  slug: string
  seo_title: string | null
  seo_description: string | null
  descricao: string | null
  imagem_url: string | null
  ordem: number
  ativo: boolean
}

export default function ServicosPage() {
  const { tenantId, canAccess } = useAdminAuth()
  const [servicos, setServicos] = useState<Servico[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const podeEditar = canAccess('servicos.editar')

  const carregar = useCallback(async () => {
    const { data } = await getBrowserClient()
      .from('servicos').select('*').eq('tenant_id', tenantId).order('ordem')
    setServicos((data ?? []) as Servico[])
  }, [tenantId])

  useEffect(() => { carregar() }, [carregar])

  function flash(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  async function salvar(s: Servico) {
    setSaving(true)
    const { id, ...rest } = s
    const payload = { ...rest, slug: s.slug || slugify(s.nome) }
    if (id) await getBrowserClient().from('servicos').update(payload).eq('id', id)
    else await getBrowserClient().from('servicos').insert({ ...payload, tenant_id: tenantId })
    setSaving(false)
    flash('Serviço salvo!')
    carregar()
  }

  async function excluir(id: string) {
    await getBrowserClient().from('servicos').delete().eq('id', id)
    flash('Serviço excluído')
    carregar()
  }

  function adicionar() {
    setServicos([
      {
        id: null, tenant_id: tenantId, nome: '', slug: '', seo_title: '', seo_description: '',
        descricao: '', imagem_url: '', ordem: servicos.length + 1, ativo: true,
      },
      ...servicos,
    ])
  }

  return (
    <PermissionGuard permissao="servicos.ver">
      <PageHeader
        titulo="Serviços"
        descricao={`${servicos.length} serviço(s) exibidos no site.`}
        acoes={
          podeEditar && (
            <button onClick={adicionar} className="flex items-center gap-1.5 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90">
              <Plus className="w-4 h-4" /> Novo serviço
            </button>
          )
        }
      />

      {message && <p className="text-sm text-green-600 font-medium mb-4">{message}</p>}

      {servicos.length === 0 ? (
        <Card>
          <EmptyState titulo="Nenhum serviço cadastrado" descricao="Adicione os serviços que o sindicato oferece." />
        </Card>
      ) : (
        <div className="space-y-3">
          {servicos.map((s, i) => (
            <ServicoEditor
              key={s.id ?? `novo-${i}`}
              servico={s}
              saving={saving}
              podeEditar={podeEditar}
              onSave={salvar}
              onDelete={s.id ? () => excluir(s.id!) : undefined}
            />
          ))}
        </div>
      )}
    </PermissionGuard>
  )
}

function ServicoEditor({
  servico, onSave, onDelete, saving, podeEditar,
}: {
  servico: Servico
  onSave: (s: Servico) => void
  onDelete?: () => void
  saving: boolean
  podeEditar: boolean
}) {
  const [open, setOpen] = useState(!servico.id)
  const [data, setData] = useState(servico)

  const set = <K extends keyof Servico>(campo: K) => (v: Servico[K]) => setData({ ...data, [campo]: v })

  return (
    <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left"
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${data.ativo ? 'bg-green-400' : 'bg-gray-300'}`} />
          <span className="text-sm font-medium truncate">{data.nome || 'Novo serviço'}</span>
          <span className="text-xs text-gray-400 shrink-0">ordem {data.ordem}</span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-4 space-y-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nome do serviço" value={data.nome} onChange={set('nome')} disabled={!podeEditar} />
            <Field label="Slug (URL)" value={data.slug} onChange={set('slug')} placeholder="gerado automaticamente" hint="Deixe vazio para gerar a partir do nome" disabled={!podeEditar} />
            <div className="md:col-span-2">
              <Field label="Título SEO" value={data.seo_title} onChange={set('seo_title')} disabled={!podeEditar} />
            </div>
            <div className="md:col-span-2">
              <Field label="Descrição SEO" value={data.seo_description} onChange={set('seo_description')} hint="Ideal até 160 caracteres" disabled={!podeEditar} />
            </div>
            <Field label="URL da imagem" value={data.imagem_url} onChange={set('imagem_url')} placeholder="https://..." disabled={!podeEditar} />
            <Field label="Ordem de exibição" value={data.ordem} onChange={(v) => set('ordem')(parseInt(v) || 0)} type="number" disabled={!podeEditar} />
          </div>

          <TextArea label="Descrição curta" value={data.descricao} onChange={set('descricao')} rows={3} />

          <Toggle label="Ativo no site" checked={data.ativo} onChange={set('ativo')} />

          {podeEditar && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onSave(data)}
                disabled={saving}
                className="flex items-center gap-1.5 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}
              </button>
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1.5 h-11 px-5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
