'use client'

import {
  Plus, Trash2, Wand2, Store, Phone, MapPin, Sparkles, Images, ListChecks, Share2, Link2,
} from 'lucide-react'
import { Card, Field, TextArea, Toggle } from '../ui'
import { CATEGORIA_OPTIONS, REDES_OPTIONS, UF_OPTIONS } from '@/lib/select-options'
import { ASSOCIADOS } from '@/lib/associados'
import type { AssociadoRow, EnderecoCadastro, ParceiroRow } from '@/lib/cadastros'
import EditorFotos from './EditorFotos'
import { limparSlugDigitando, slugFinal } from './comum'

const inputBase =
  'w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white disabled:bg-gray-50 disabled:text-gray-400'

const CATEGORIAS_ASSOCIADO = Array.from(new Set(ASSOCIADOS.map((a) => a.categoria))).sort()

/* ------------------------------------------------------------------ */
/* Campos reaproveitados                                               */
/* ------------------------------------------------------------------ */

function CampoSlug({
  valor, nome, prefixo, erro, onChange,
}: {
  valor: string
  nome: string
  prefixo: string
  erro: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="block text-sm font-medium text-gray-700">Endereço da página</span>
        <button
          type="button"
          onClick={() => onChange(slugFinal(nome))}
          className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 disabled:opacity-50"
        >
          <Wand2 className="w-3 h-3" /> gerar pelo nome
        </button>
      </div>
      <div className={`flex items-stretch rounded-xl border overflow-hidden bg-white focus-within:ring-1 ${
        erro ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-400' : 'border-gray-200 focus-within:border-primary focus-within:ring-primary'
      }`}>
        <span className="px-3 flex items-center text-sm text-gray-400 bg-gray-50 border-r border-gray-200 whitespace-nowrap">
          {prefixo}/
        </span>
        <input
          value={valor}
          onChange={(e) => onChange(limparSlugDigitando(e.target.value))}
          onBlur={() => onChange(slugFinal(valor))}
          className="flex-1 min-w-0 h-11 px-3 text-sm outline-none disabled:bg-gray-50 disabled:text-gray-400"
          placeholder="nome-da-empresa"
        />
      </div>
      {erro
        ? <span className="block text-xs text-red-600 mt-1">{erro}</span>
        : <span className="block text-xs text-gray-400 mt-1">Só letras minúsculas, números e hífen.</span>}
    </div>
  )
}

function CampoCategoria({
  valor, onChange, opcoes, id,
}: { valor: string | null; onChange: (v: string) => void; opcoes: string[]; id: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">Categoria</span>
      <input
        list={id}
        value={valor ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escolha ou digite"
        className={inputBase}
      />
      <datalist id={id}>
        {opcoes.map((o) => <option key={o} value={o} />)}
      </datalist>
    </label>
  )
}

function CamposEndereco({
  valor, onChange,
}: { valor: EnderecoCadastro; onChange: (e: EnderecoCadastro) => void }) {
  const set = (k: keyof EnderecoCadastro) => (v: string) => onChange({ ...valor, [k]: v })
  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-6 sm:col-span-4"><Field label="Rua / avenida" value={valor.rua} onChange={set('rua')} /></div>
      <div className="col-span-3 sm:col-span-2"><Field label="Número" value={valor.numero} onChange={set('numero')} /></div>
      <div className="col-span-3 sm:col-span-3"><Field label="Complemento" value={valor.complemento} onChange={set('complemento')} placeholder="Sala, loja..." /></div>
      <div className="col-span-6 sm:col-span-3"><Field label="Bairro" value={valor.bairro} onChange={set('bairro')} /></div>
      <div className="col-span-6 sm:col-span-3"><Field label="Cidade" value={valor.cidade} onChange={set('cidade')} /></div>
      <label className="block col-span-3 sm:col-span-1">
        <span className="block text-sm font-medium text-gray-700 mb-1">UF</span>
        <select value={valor.uf ?? ''} onChange={(e) => set('uf')(e.target.value)} className={inputBase}>
          <option value="">--</option>
          {UF_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
        </select>
      </label>
      <div className="col-span-3 sm:col-span-2"><Field label="CEP" value={valor.cep} onChange={set('cep')} placeholder="00000-000" /></div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Parceiro                                                            */
/* ------------------------------------------------------------------ */

export function FormParceiro({
  valor, set, slugErro,
}: {
  valor: ParceiroRow
  set: (patch: Partial<ParceiroRow>) => void
  slugErro: string
}) {
  const servicos = valor.servicos ?? []
  const redes = valor.redes ?? []

  return (
    <>
      <Card title="Identificação" icon={<Store className="w-4 h-4 text-primary" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Field label="Nome da empresa" value={valor.nome} onChange={(v) => set({ nome: v })} /></div>
          <div className="sm:col-span-2">
            <CampoSlug valor={valor.slug} nome={valor.nome} prefixo="/parceiros" erro={slugErro} onChange={(v) => set({ slug: v })} />
          </div>
          <CampoCategoria id="categorias-parceiro" valor={valor.categoria} onChange={(v) => set({ categoria: v })} opcoes={CATEGORIA_OPTIONS.map((c) => c.value)} />
          <div className="flex items-end pb-2">
            <Toggle label="Parceiro em destaque" checked={!!valor.destaque} onChange={(v) => set({ destaque: v })} hint="Aparece primeiro na lista de parceiros" />
          </div>
          <div className="sm:col-span-2">
            <TextArea label="Resumo" value={valor.resumo} onChange={(v) => set({ resumo: v })} rows={2} hint="Uma ou duas frases. Aparece no card da listagem e no topo da página." />
          </div>
          <div className="sm:col-span-2">
            <TextArea label="Descrição" value={valor.descricao} onChange={(v) => set({ descricao: v })} rows={8} hint="Separe os parágrafos com uma linha em branco." />
          </div>
        </div>
      </Card>

      <Card title="Serviços e benefício" icon={<ListChecks className="w-4 h-4 text-primary" />}>
        <div className="space-y-2">
          <span className="block text-sm font-medium text-gray-700">Serviços oferecidos</span>
          {servicos.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 text-xs text-gray-400 text-right shrink-0">{i + 1}.</span>
              <input
                value={s}
                onChange={(e) => set({ servicos: servicos.map((x, j) => (j === i ? e.target.value : x)) })}
                className={inputBase}
                placeholder="Descreva o serviço"
              />
              <button
                type="button"
                onClick={() => set({ servicos: servicos.filter((_, j) => j !== i) })}
                className="w-11 h-11 shrink-0 rounded-xl border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 flex items-center justify-center"
                aria-label="Remover serviço"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set({ servicos: [...servicos, ''] })}
            className="h-10 px-4 rounded-xl border border-dashed border-gray-300 text-sm text-gray-600 hover:border-primary hover:text-primary flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Adicionar serviço
          </button>
        </div>
        <div className="mt-5">
          <TextArea
            label="Desconto ou benefício para associados"
            value={valor.beneficio_associados}
            onChange={(v) => set({ beneficio_associados: v })}
            rows={2}
            placeholder="Ex.: 15% de desconto em todos os serviços para associados"
          />
        </div>
      </Card>

      <Card title="Contato" icon={<Phone className="w-4 h-4 text-primary" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="WhatsApp" value={valor.whatsapp} onChange={(v) => set({ whatsapp: v })} placeholder="(34) 99999-9999" hint="O site monta o link do WhatsApp com este número." />
          <Field label="WhatsApp como aparece na página" value={valor.whatsapp_display} onChange={(v) => set({ whatsapp_display: v })} placeholder="(34) 99999-9999" />
          <Field label="Telefone" value={valor.telefone} onChange={(v) => set({ telefone: v })} />
          <Field label="E-mail" value={valor.email} onChange={(v) => set({ email: v })} type="email" />
          <Field label="Site" value={valor.site_url} onChange={(v) => set({ site_url: v })} placeholder="https://..." />
          <Field label="Instagram" value={valor.instagram} onChange={(v) => set({ instagram: v })} placeholder="@empresa" />
        </div>

        <div className="mt-5 space-y-2">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5 text-gray-400" /> Redes sociais</span>
          {redes.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                value={r.tipo}
                onChange={(e) => set({ redes: redes.map((x, j) => (j === i ? { ...x, tipo: e.target.value } : x)) })}
                className={`${inputBase} w-40 shrink-0`}
              >
                {REDES_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                {!REDES_OPTIONS.some((o) => o.value === r.tipo) && <option value={r.tipo}>{r.tipo}</option>}
              </select>
              <input
                value={r.url}
                onChange={(e) => set({ redes: redes.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)) })}
                className={inputBase}
                placeholder="https://..."
              />
              {r.url && /^https?:\/\//.test(r.url) && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="w-11 h-11 shrink-0 rounded-xl border border-gray-200 text-gray-400 hover:text-primary flex items-center justify-center" aria-label="Abrir link">
                  <Link2 className="w-4 h-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => set({ redes: redes.filter((_, j) => j !== i) })}
                className="w-11 h-11 shrink-0 rounded-xl border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 flex items-center justify-center"
                aria-label="Remover rede"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const usadas = redes.map((r) => r.tipo)
              const prox = REDES_OPTIONS.find((o) => !usadas.includes(o.value))?.value ?? 'instagram'
              set({ redes: [...redes, { tipo: prox, url: '' }] })
            }}
            className="h-10 px-4 rounded-xl border border-dashed border-gray-300 text-sm text-gray-600 hover:border-primary hover:text-primary flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Adicionar rede social
          </button>
        </div>
      </Card>

      <Card title="Endereço" icon={<MapPin className="w-4 h-4 text-primary" />}>
        <CamposEndereco valor={valor.endereco ?? {}} onChange={(e) => set({ endereco: e })} />
      </Card>

      <Card title="Fotos" icon={<Images className="w-4 h-4 text-primary" />}>
        <EditorFotos
          registroId={valor.id}
          capa={valor.foto_capa_url}
          fotos={valor.fotos ?? []}
          onCapa={(u) => set({ foto_capa_url: u })}
          onFotos={(f) => set({ fotos: f })}
        />
      </Card>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Associado                                                           */
/* ------------------------------------------------------------------ */

export function FormAssociado({
  valor, set, slugErro,
}: {
  valor: AssociadoRow
  set: (patch: Partial<AssociadoRow>) => void
  slugErro: string
}) {
  // Bairro e cidade ficam no endereço completo e também nas colunas próprias
  // (usadas em filtros); a tela mostra um campo só e grava nos dois.
  const endereco: EnderecoCadastro = {
    ...(valor.endereco_detalhe ?? {}),
    bairro: valor.endereco_detalhe?.bairro ?? valor.bairro ?? '',
    cidade: valor.endereco_detalhe?.cidade ?? valor.cidade ?? '',
  }

  return (
    <>
      <Card title="Identificação" icon={<Store className="w-4 h-4 text-primary" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Field label="Nome do estabelecimento" value={valor.nome} onChange={(v) => set({ nome: v })} /></div>
          <div className="sm:col-span-2">
            <CampoSlug valor={valor.slug} nome={valor.nome} prefixo="/associados" erro={slugErro} onChange={(v) => set({ slug: v })} />
          </div>
          <CampoCategoria id="categorias-associado" valor={valor.categoria} onChange={(v) => set({ categoria: v })} opcoes={CATEGORIAS_ASSOCIADO} />
          <Field label="Horário de funcionamento" value={valor.horario} onChange={(v) => set({ horario: v })} placeholder="Ter a Sáb: 9h às 19h" />
          <div className="sm:col-span-2">
            <TextArea label="Descrição" value={valor.descricao} onChange={(v) => set({ descricao: v })} rows={6} />
          </div>
          <Toggle label="Associado em destaque" checked={!!valor.destaque} onChange={(v) => set({ destaque: v })} hint="Aparece primeiro na lista de associados" />
          <Toggle label="Selo de novo associado" checked={!!valor.novo} onChange={(v) => set({ novo: v })} hint="Mostra a etiqueta de novo na página" />
        </div>
      </Card>

      <Card title="Contato" icon={<Phone className="w-4 h-4 text-primary" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Telefone" value={valor.telefone} onChange={(v) => set({ telefone: v })} />
          <Field label="Telefone como aparece na página" value={valor.telefone_display} onChange={(v) => set({ telefone_display: v })} placeholder="(34) 3333-3333" />
          <Field label="WhatsApp" value={valor.whatsapp} onChange={(v) => set({ whatsapp: v })} placeholder="(34) 99999-9999" hint="Se ficar vazio, o site usa o telefone." />
          <Field label="E-mail" value={valor.email} onChange={(v) => set({ email: v })} type="email" />
          <Field label="Instagram" value={valor.instagram} onChange={(v) => set({ instagram: v })} placeholder="@estabelecimento" />
          <Field label="Site" value={valor.site_url} onChange={(v) => set({ site_url: v })} placeholder="https://..." />
        </div>
      </Card>

      <Card title="Endereço" icon={<MapPin className="w-4 h-4 text-primary" />}>
        <CamposEndereco
          valor={endereco}
          onChange={(e) => set({ endereco_detalhe: e, bairro: e.bairro ?? '', cidade: e.cidade ?? '' })}
        />
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> O endereço em uma linha e o mapa da página são montados a partir destes campos.
        </p>
      </Card>

      <Card title="Fotos" icon={<Images className="w-4 h-4 text-primary" />}>
        <EditorFotos
          registroId={valor.id}
          capa={valor.foto_capa_url}
          fotos={valor.fotos ?? []}
          onCapa={(u) => set({ foto_capa_url: u })}
          onFotos={(f) => set({ fotos: f })}
        />
      </Card>
    </>
  )
}
