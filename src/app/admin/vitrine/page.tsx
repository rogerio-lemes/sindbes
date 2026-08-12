'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Save, Trash2, ChevronUp, ChevronDown, Images, Info } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import ImageUploader from '@/components/admin/ImageUploader'
import {
  PageHeader, Card, Field, TextArea, Toggle, EmptyState, StatusBadge, PermissionGuard,
} from '@/components/admin/ui'

interface Slide {
  id: string | null
  imagem_url: string | null
  titulo: string | null
  destaque: string | null
  subtitulo: string | null
  link_url: string | null
  cta_texto: string | null
  ordem: number
  ativo: boolean
  data_inicio: string | null
  data_fim: string | null
}

const SLIDE_VAZIO: Slide = {
  id: null, imagem_url: null, titulo: '', destaque: '', subtitulo: '',
  link_url: '', cta_texto: '', ordem: 0, ativo: true, data_inicio: null, data_fim: null,
}

export default function VitrinePage() {
  const { tenantId, canAccess } = useAdminAuth()
  const [slides, setSlides] = useState<Slide[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const podeEditar = canAccess('vitrine.editar')

  const carregar = useCallback(async () => {
    const { data } = await getBrowserClient()
      .from('vitrine_slides').select('*')
      .eq('tenant_id', tenantId).eq('slider_key', 'home_hero')
      .order('ordem')
    setSlides((data ?? []) as Slide[])
  }, [tenantId])

  useEffect(() => { carregar() }, [carregar])

  function flash(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  async function salvar(s: Slide) {
    if (!s.imagem_url) { flash('Envie uma imagem antes de salvar.'); return }
    setSaving(true)
    const sb = getBrowserClient()
    const payload = {
      imagem_url: s.imagem_url, titulo: s.titulo, destaque: s.destaque,
      subtitulo: s.subtitulo, link_url: s.link_url, cta_texto: s.cta_texto,
      ordem: s.ordem, ativo: s.ativo,
      data_inicio: s.data_inicio || null, data_fim: s.data_fim || null,
    }
    if (s.id) await sb.from('vitrine_slides').update(payload).eq('id', s.id)
    else await sb.from('vitrine_slides').insert({ ...payload, tenant_id: tenantId, slider_key: 'home_hero' })
    setSaving(false)
    flash('Slide salvo!')
    carregar()
  }

  async function excluir(s: Slide) {
    if (!s.id) { setSlides((prev) => prev.filter((x) => x !== s)); return }
    await getBrowserClient().from('vitrine_slides').delete().eq('id', s.id)
    flash('Slide excluído')
    carregar()
  }

  /** Troca a ordem com o vizinho e persiste os dois. */
  async function mover(index: number, direcao: -1 | 1) {
    const destino = index + direcao
    if (destino < 0 || destino >= slides.length) return
    const a = slides[index]
    const b = slides[destino]
    if (!a.id || !b.id) { flash('Salve os slides novos antes de reordenar.'); return }

    const sb = getBrowserClient()
    await Promise.all([
      sb.from('vitrine_slides').update({ ordem: b.ordem }).eq('id', a.id),
      sb.from('vitrine_slides').update({ ordem: a.ordem }).eq('id', b.id),
    ])
    carregar()
  }

  return (
    <PermissionGuard permissao="vitrine.ver">
      <PageHeader
        titulo="Vitrine da home"
        descricao="Slides do carrossel principal do site."
        acoes={
          podeEditar && (
            <button
              onClick={() => setSlides([...slides, { ...SLIDE_VAZIO, ordem: slides.length + 1 }])}
              className="flex items-center gap-1.5 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90"
            >
              <Plus className="w-4 h-4" /> Novo slide
            </button>
          )
        }
      />

      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl px-4 py-3 mb-6 text-sm">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          Enquanto nenhum slide estiver cadastrado, o site exibe os três slides padrão do template.
          Ao salvar o primeiro slide aqui, ele passa a comandar o carrossel da home.
        </p>
      </div>

      {message && <p className="text-sm text-green-600 font-medium mb-4">{message}</p>}

      {slides.length === 0 ? (
        <Card>
          <EmptyState
            titulo="Nenhum slide cadastrado"
            descricao="O site está usando os slides padrão do template."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {slides.map((s, i) => (
            <SlideEditor
              key={s.id ?? `novo-${i}`}
              slide={s}
              indice={i}
              total={slides.length}
              saving={saving}
              podeEditar={podeEditar}
              onSave={salvar}
              onDelete={() => excluir(s)}
              onMover={(dir) => mover(i, dir)}
            />
          ))}
        </div>
      )}
    </PermissionGuard>
  )
}

function SlideEditor({
  slide, indice, total, onSave, onDelete, onMover, saving, podeEditar,
}: {
  slide: Slide
  indice: number
  total: number
  onSave: (s: Slide) => void
  onDelete: () => void
  onMover: (dir: -1 | 1) => void
  saving: boolean
  podeEditar: boolean
}) {
  const [data, setData] = useState(slide)
  const set = <K extends keyof Slide>(campo: K) => (v: Slide[K]) => setData({ ...data, [campo]: v })

  const hoje = new Date().toISOString().slice(0, 10)
  const status = !data.ativo
    ? { s: 'inativo' as const, l: 'Pausado' }
    : data.data_inicio && data.data_inicio > hoje
      ? { s: 'agendado' as const, l: 'Agendado' }
      : data.data_fim && data.data_fim < hoje
        ? { s: 'expirado' as const, l: 'Expirado' }
        : { s: 'ativo' as const, l: 'No ar' }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-semibold text-gray-400 shrink-0">#{indice + 1}</span>
          <p className="font-bold text-sm truncate">{data.titulo || 'Novo slide'}</p>
          <StatusBadge status={status.s} label={status.l} />
        </div>
        {podeEditar && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onMover(-1)}
              disabled={indice === 0}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30"
              aria-label="Subir"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => onMover(1)}
              disabled={indice === total - 1}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30"
              aria-label="Descer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <ImageUploader
            label="Imagem de fundo"
            value={data.imagem_url}
            onChange={set('imagem_url')}
            pasta="vitrine"
            hint="Recomendado 1920×1080 (paisagem)"
            alturaPreview="h-44"
          />
          <PreviewSlide slide={data} />
        </div>

        <div className="space-y-4">
          <Field label="Título" value={data.titulo} onChange={set('titulo')} placeholder="Qualifique sua equipe" disabled={!podeEditar} />
          <Field
            label="Destaque (parte colorida)"
            value={data.destaque}
            onChange={set('destaque')}
            placeholder="com quem entende de beleza"
            hint="Aparece em verde-claro logo após o título"
            disabled={!podeEditar}
          />
          <TextArea label="Subtítulo" value={data.subtitulo} onChange={set('subtitulo')} rows={2} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Texto do botão" value={data.cta_texto} onChange={set('cta_texto')} placeholder="Saiba mais" disabled={!podeEditar} />
            <Field label="Link do botão" value={data.link_url} onChange={set('link_url')} placeholder="/contato" disabled={!podeEditar} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Exibir a partir de" value={data.data_inicio} onChange={set('data_inicio')} type="date" hint="Opcional" disabled={!podeEditar} />
            <Field label="Exibir até" value={data.data_fim} onChange={set('data_fim')} type="date" hint="Opcional" disabled={!podeEditar} />
          </div>
          <Toggle label="Slide ativo" checked={data.ativo} onChange={set('ativo')} hint="Desmarque para pausar sem excluir" />
        </div>
      </div>

      {podeEditar && (
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={() => onSave(data)}
            disabled={saving}
            className="flex items-center gap-1.5 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar slide'}
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 h-11 px-5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 ml-auto"
          >
            <Trash2 className="w-4 h-4" /> Excluir
          </button>
        </div>
      )}
    </section>
  )
}

/** Réplica reduzida do HeroCarousel para conferir o texto sobre a imagem. */
function PreviewSlide({ slide }: { slide: Slide }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5">
        <Images className="w-3.5 h-3.5" /> Pré-visualização
      </p>
      <div className="relative h-44 rounded-xl overflow-hidden bg-gray-800">
        {slide.imagem_url && (
          <Image src={slide.imagem_url} alt="" fill className="object-cover" unoptimized />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 p-4 flex flex-col justify-center">
          <p className="text-white font-bold text-lg leading-tight line-clamp-2">
            {slide.titulo || 'Título do slide'}{' '}
            {slide.destaque && <span className="text-[#8FD9CE]">{slide.destaque}</span>}
          </p>
          {slide.subtitulo && (
            <p className="text-white/85 text-xs mt-1.5 line-clamp-2">{slide.subtitulo}</p>
          )}
          {slide.cta_texto && (
            <span className="mt-3 inline-flex self-start px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold">
              {slide.cta_texto}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
