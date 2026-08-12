'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Save, Trash2, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import ImageUploader, { Thumb } from '@/components/admin/ImageUploader'
import {
  PageHeader, Card, Field, TextArea, Toggle, SelectField, EmptyState, StatusBadge, PermissionGuard,
} from '@/components/admin/ui'
import { POSICOES_BANNER, statusBanner, rotuloPosicao } from '@/lib/banners'

interface BannerRow {
  id: string | null
  titulo: string | null
  anunciante_nome: string
  anunciante_contato: string | null
  imagem_url: string | null
  link_destino: string | null
  posicao: string
  ordem: number
  data_inicio: string | null
  data_fim: string | null
  ativo: boolean
  valor_contrato: number | null
  observacoes: string | null
}

const hojeISO = () => new Date().toISOString().slice(0, 10)

function bannerVazio(ordem: number): BannerRow {
  return {
    id: null, titulo: '', anunciante_nome: '', anunciante_contato: '',
    imagem_url: null, link_destino: '', posicao: 'blog_topo', ordem,
    data_inicio: hojeISO(), data_fim: null, ativo: true,
    valor_contrato: null, observacoes: '',
  }
}

export default function BannersPage() {
  const { tenantId, canAccess } = useAdminAuth()
  const [banners, setBanners] = useState<BannerRow[]>([])
  const [metricas, setMetricas] = useState<Record<string, { impressao: number; clique: number }>>({})
  const [filtro, setFiltro] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const podeEditar = canAccess('banners.editar')

  const carregar = useCallback(async () => {
    const sb = getBrowserClient()
    const { data } = await sb.from('banners').select('*')
      .eq('tenant_id', tenantId).order('posicao').order('ordem')
    const lista = (data ?? []) as BannerRow[]
    setBanners(lista)

    const ids = lista.map((b) => b.id).filter(Boolean) as string[]
    if (ids.length === 0) { setMetricas({}); return }
    const { data: ev } = await sb.from('banner_eventos').select('banner_id, tipo').in('banner_id', ids)
    const agregado: Record<string, { impressao: number; clique: number }> = {}
    ;(ev ?? []).forEach((e) => {
      const k = e.banner_id as string
      agregado[k] = agregado[k] ?? { impressao: 0, clique: 0 }
      if (e.tipo === 'clique') agregado[k].clique++
      else agregado[k].impressao++
    })
    setMetricas(agregado)
  }, [tenantId])

  useEffect(() => { carregar() }, [carregar])

  function flash(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  async function salvar(b: BannerRow) {
    if (!b.imagem_url) { flash('Envie a imagem do banner antes de salvar.'); return }
    if (!b.anunciante_nome.trim()) { flash('Informe o nome do anunciante.'); return }
    if (!b.data_inicio || !b.data_fim) { flash('Informe o período do contrato (início e fim).'); return }
    if (b.data_fim < b.data_inicio) { flash('A data final não pode ser anterior à inicial.'); return }

    setSaving(true)
    const sb = getBrowserClient()
    const payload = {
      titulo: b.titulo, anunciante_nome: b.anunciante_nome,
      anunciante_contato: b.anunciante_contato, imagem_url: b.imagem_url,
      link_destino: b.link_destino, posicao: b.posicao, ordem: b.ordem,
      data_inicio: b.data_inicio, data_fim: b.data_fim, ativo: b.ativo,
      valor_contrato: b.valor_contrato, observacoes: b.observacoes,
    }
    if (b.id) await sb.from('banners').update(payload).eq('id', b.id)
    else await sb.from('banners').insert({ ...payload, tenant_id: tenantId })
    setSaving(false)
    flash('Banner salvo!')
    carregar()
  }

  async function excluir(b: BannerRow) {
    if (!b.id) { setBanners((prev) => prev.filter((x) => x !== b)); return }
    await getBrowserClient().from('banners').delete().eq('id', b.id)
    flash('Banner excluído')
    carregar()
  }

  const visiveis = filtro ? banners.filter((b) => b.posicao === filtro) : banners

  return (
    <PermissionGuard permissao="banners.ver">
      <PageHeader
        titulo="Banners de anunciantes"
        descricao="Espaços publicitários vendidos, com período de contrato e métricas de exibição."
        acoes={
          <div className="flex items-center gap-2">
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary"
            >
              <option value="">Todas as posições</option>
              {POSICOES_BANNER.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            {podeEditar && (
              <button
                onClick={() => setBanners([bannerVazio(banners.length + 1), ...banners])}
                className="flex items-center gap-1.5 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90"
              >
                <Plus className="w-4 h-4" /> Novo banner
              </button>
            )}
          </div>
        }
      />

      {message && <p className="text-sm text-green-600 font-medium mb-4">{message}</p>}

      {visiveis.length === 0 ? (
        <Card>
          <EmptyState
            titulo={filtro ? 'Nenhum banner nesta posição' : 'Nenhum banner cadastrado'}
            descricao="Cadastre um banner para começar a veicular anúncios no site."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {visiveis.map((b, i) => (
            <BannerEditor
              key={b.id ?? `novo-${i}`}
              banner={b}
              metrica={b.id ? metricas[b.id] : undefined}
              saving={saving}
              podeEditar={podeEditar}
              onSave={salvar}
              onDelete={() => excluir(b)}
            />
          ))}
        </div>
      )}
    </PermissionGuard>
  )
}

function BannerEditor({
  banner, metrica, onSave, onDelete, saving, podeEditar,
}: {
  banner: BannerRow
  metrica?: { impressao: number; clique: number }
  onSave: (b: BannerRow) => void
  onDelete: () => void
  saving: boolean
  podeEditar: boolean
}) {
  const [open, setOpen] = useState(!banner.id)
  const [data, setData] = useState(banner)
  const set = <K extends keyof BannerRow>(campo: K) => (v: BannerRow[K]) => setData({ ...data, [campo]: v })

  const { status, label } = statusBanner(data)
  const ctr = metrica && metrica.impressao > 0
    ? ((metrica.clique / metrica.impressao) * 100).toFixed(1)
    : null

  return (
    <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left"
      >
        <Thumb url={data.imagem_url} alt={data.anunciante_nome || 'Banner'} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium truncate">
            {data.anunciante_nome || 'Novo banner'}
          </span>
          <span className="block text-xs text-gray-400 truncate">
            {rotuloPosicao(data.posicao)}
            {data.data_inicio && data.data_fim && (
              <> · {fmt(data.data_inicio)} a {fmt(data.data_fim)}</>
            )}
          </span>
        </span>
        {metrica && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
            <BarChart3 className="w-3.5 h-3.5" />
            {metrica.impressao} exib. · {metrica.clique} cliq.
            {ctr && <span className="text-gray-500 font-medium">({ctr}%)</span>}
          </span>
        )}
        <StatusBadge status={status} label={label} />
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-4 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-4">
            <ImageUploader
              label="Imagem do banner"
              value={data.imagem_url}
              onChange={set('imagem_url')}
              pasta="banners"
              hint="Faixas do blog: 1200×200. Card da grade: 600×600."
              alturaPreview="h-40"
            />
            <SelectField
              label="Posição no site"
              value={data.posicao}
              onChange={set('posicao')}
              options={POSICOES_BANNER.map((p) => ({ value: p.value, label: p.label }))}
              hint={POSICOES_BANNER.find((p) => p.value === data.posicao)?.descricao}
            />
            <Field
              label="Link de destino"
              value={data.link_destino}
              onChange={set('link_destino')}
              placeholder="https://site-do-anunciante.com.br"
              disabled={!podeEditar}
            />
          </div>

          <div className="space-y-4">
            <Field label="Anunciante" value={data.anunciante_nome} onChange={set('anunciante_nome')} placeholder="Nome da empresa" disabled={!podeEditar} />
            <Field label="Contato do anunciante" value={data.anunciante_contato} onChange={set('anunciante_contato')} placeholder="E-mail ou telefone" disabled={!podeEditar} />
            <Field label="Título interno" value={data.titulo} onChange={set('titulo')} hint="Só para organização no painel" disabled={!podeEditar} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Início do contrato" value={data.data_inicio} onChange={set('data_inicio')} type="date" disabled={!podeEditar} />
              <Field label="Fim do contrato" value={data.data_fim} onChange={set('data_fim')} type="date" disabled={!podeEditar} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Valor do contrato (R$)"
                value={data.valor_contrato ?? ''}
                onChange={(v) => set('valor_contrato')(v ? parseFloat(v) : null)}
                type="number"
                disabled={!podeEditar}
              />
              <Field label="Ordem" value={data.ordem} onChange={(v) => set('ordem')(parseInt(v) || 0)} type="number" hint="Menor aparece primeiro" disabled={!podeEditar} />
            </div>
            <TextArea label="Observações" value={data.observacoes} onChange={set('observacoes')} rows={2} />
            <Toggle label="Banner ativo" checked={data.ativo} onChange={set('ativo')} hint="Pausa a veiculação sem apagar o cadastro" />
          </div>

          {podeEditar && (
            <div className="lg:col-span-2 flex items-center gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => onSave(data)}
                disabled={saving}
                className="flex items-center gap-1.5 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar banner'}
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 h-11 px-5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 ml-auto"
              >
                <Trash2 className="w-4 h-4" /> Excluir
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function fmt(iso: string) {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a.slice(2)}`
}
