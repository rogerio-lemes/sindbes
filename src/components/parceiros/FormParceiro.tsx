'use client'

import { useState, useRef } from 'react'
import {
  CheckCircle2, Send, ChevronRight,
  User, Building2, Phone, Mail, Globe,
  Tag, AlignLeft, ListChecks, BadgePercent,
  Plus, Trash2, ImageIcon, Upload, X, MapPin, Share2,
} from 'lucide-react'
import CustomSelect from '@/components/ui/CustomSelect'
import { CATEGORIA_OPTIONS, UF_OPTIONS, REDES_OPTIONS } from '@/lib/select-options'

const BENEFICIOS = [
  'Visibilidade para centenas de associados ativos',
  'Presença no site, redes sociais e eventos do Sindibes',
  'Selo oficial "Parceiro Sindibes" para divulgar',
  'Página própria na vitrine de parceiros do site',
  'Divulgação preferencial em campanhas e newsletters',
  'Acesso à base de profissionais da beleza de Uberlândia',
]

const REDES_PLACEHOLDERS: Record<string, string> = {
  instagram: 'https://instagram.com/suaempresa',
  facebook:  'https://facebook.com/suaempresa',
  tiktok:    'https://tiktok.com/@suaempresa',
  youtube:   'https://youtube.com/@suaempresa',
  twitter:   'https://x.com/suaempresa',
  linkedin:  'https://linkedin.com/company/…',
  pinterest: 'https://pinterest.com/suaempresa',
  whatsapp:  'https://wa.me/5534900000000',
}

const MAX_MB = 1
const fmtSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`

interface CapaPreview { file: File; url: string; tamanho: string }
interface RedeSocial   { rede: string; url: string }

export default function FormParceiro() {
  // Contato responsável
  const [contato, setContato] = useState({ nome: '', cargo: '', telefone: '', email: '' })
  // Dados da empresa
  const [empresa, setEmpresa] = useState({
    nome: '', categoria: '', site: '', siteUrl: '', whatsapp: '', whatsappDisplay: '',
  })
  // Endereço
  const [endereco, setEndereco] = useState({
    rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: 'MG', cep: '',
  })
  // Redes sociais
  const [redes, setRedes] = useState<RedeSocial[]>([{ rede: 'instagram', url: '' }])
  // Conteúdo da página
  const [resumo, setResumo] = useState('')
  const [descricao, setDescricao] = useState(['', ''])
  const [servicos, setServicos] = useState(['', '', ''])
  const [desconto, setDesconto] = useState('')
  // Foto de capa
  const [capa, setCapa] = useState<CapaPreview | null>(null)
  const [erroCapa, setErroCapa] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  // Envio
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)

  const setC  = (e: React.ChangeEvent<HTMLInputElement>) =>
    setContato(p => ({ ...p, [e.target.name]: e.target.value }))
  const setEmp = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEmpresa(p => ({ ...p, [e.target.name]: e.target.value }))
  const setEnd = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEndereco(p => ({ ...p, [e.target.name]: e.target.value }))

  // Parágrafos de descrição
  const setDesc    = (i: number, v: string) => setDescricao(d => d.map((x, j) => j === i ? v : x))
  const addDesc    = () => setDescricao(d => [...d, ''])
  const removeDesc = (i: number) => setDescricao(d => d.filter((_, j) => j !== i))

  // Serviços
  const setServ    = (i: number, v: string) => setServicos(s => s.map((x, j) => j === i ? v : x))
  const addServ    = () => setServicos(s => [...s, ''])
  const removeServ = (i: number) => setServicos(s => s.filter((_, j) => j !== i))

  // Redes sociais
  const setRede    = (i: number, field: keyof RedeSocial, v: string) =>
    setRedes(r => r.map((x, j) => j === i ? { ...x, [field]: v } : x))
  const addRede    = () => {
    const usadas = redes.map(r => r.rede)
    const prox = REDES_OPTIONS.find(r => !usadas.includes(r.value))
    setRedes(r => [...r, { rede: prox?.value ?? REDES_OPTIONS[0].value, url: '' }])
  }
  const removeRede = (i: number) => setRedes(r => r.filter((_, j) => j !== i))

  // Upload capa
  const handleCapa = (file: File | null) => {
    setErroCapa(null)
    if (!file) return
    if (!file.type.startsWith('image/')) { setErroCapa('Selecione uma imagem (JPG, PNG, WEBP).'); return }
    if (file.size > MAX_MB * 1024 * 1024) { setErroCapa('A imagem deve ter no máximo 1 MB.'); return }
    if (capa) URL.revokeObjectURL(capa.url)
    setCapa({ file, url: URL.createObjectURL(file), tamanho: fmtSize(file.size) })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!capa) { setErroEnvio('A foto de capa é obrigatória.'); return }
    setEnviando(true); setErroEnvio(null)
    try {
      const fd = new FormData()
      fd.append('tipo', 'parceiro')
      Object.entries(contato).forEach(([k, v]) => fd.append(`contato_${k}`, v))
      Object.entries(empresa).forEach(([k, v]) => fd.append(k, v))
      Object.entries(endereco).forEach(([k, v]) => fd.append(`end_${k}`, v))
      redes.filter(r => r.url).forEach((r, i) => {
        fd.append(`rede_${i}_tipo`, r.rede)
        fd.append(`rede_${i}_url`, r.url)
      })
      fd.append('resumo', resumo)
      descricao.filter(Boolean).forEach((p, i) => fd.append(`descricao_${i}`, p))
      servicos.filter(Boolean).forEach((s, i) => fd.append(`servico_${i}`, s))
      fd.append('desconto', desconto)
      fd.append('capa', capa.file, capa.file.name)

      const res = await fetch('/api/cadastro-parceiro', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      setSucesso(true)
    } catch { setErroEnvio('Não foi possível enviar. Tente pelo WhatsApp.') }
    finally { setEnviando(false) }
  }

  const reset = () => {
    setContato({ nome: '', cargo: '', telefone: '', email: '' })
    setEmpresa({ nome: '', categoria: '', site: '', siteUrl: '', whatsapp: '', whatsappDisplay: '' })
    setEndereco({ rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: 'MG', cep: '' })
    setRedes([{ rede: 'instagram', url: '' }])
    setResumo(''); setDescricao(['', '']); setServicos(['', '', '']); setDesconto('')
    if (capa) URL.revokeObjectURL(capa.url); setCapa(null); setSucesso(false)
  }

  if (sucesso) return (
    <div className="text-center py-14">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-text mb-2">Proposta recebida!</h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto">
        Nossa equipe analisará os dados e entrará em contato para finalizar sua parceria.
      </p>
      <button onClick={reset}
        className="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition">
        Nova proposta
      </button>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-8">

      {/* Benefícios resumidos */}
      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2.5">Vantagens de ser parceiro</p>
        <ul className="space-y-1.5">
          {BENEFICIOS.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
              <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />{b}
            </li>
          ))}
        </ul>
      </div>

      {/* ── 1. Contato responsável ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-4">
          <User className="w-4 h-4 text-primary" /> Responsável pelo cadastro
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome *</label>
            <input name="nome" value={contato.nome} onChange={setC} required placeholder="Seu nome completo"
              className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cargo / Função</label>
            <input name="cargo" value={contato.cargo} onChange={setC} placeholder="Ex: Diretor, Gerente…"
              className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">WhatsApp *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="telefone" value={contato.telefone} onChange={setC} required placeholder="(34) 9 0000-0000"
                className="input-field pl-9" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-mail *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="email" value={contato.email} onChange={setC} required type="email" placeholder="seu@email.com"
                className="input-field pl-9" />
            </div>
          </div>
        </div>
      </fieldset>

      <hr className="border-gray-100" />

      {/* ── 2. Dados da empresa ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-4">
          <Building2 className="w-4 h-4 text-primary" /> Dados da empresa
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome da empresa *</label>
            <input name="nome" value={empresa.nome} onChange={setEmp} required placeholder="Nome completo da empresa"
              className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Categoria *</label>
            <CustomSelect
              options={CATEGORIA_OPTIONS}
              value={empresa.categoria}
              onChange={(v) => setEmpresa(p => ({ ...p, categoria: v }))}
              placeholder="Selecione a categoria…"
              required
              triggerIcon={Tag}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">WhatsApp (exibição)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="whatsappDisplay" value={empresa.whatsappDisplay} onChange={setEmp}
                placeholder="(34) 9 0000-0000" className="input-field pl-9" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">WhatsApp (só números)</label>
            <input name="whatsapp" value={empresa.whatsapp} onChange={setEmp}
              placeholder="5534900000000" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Site (exibição)</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="site" value={empresa.site} onChange={setEmp}
                placeholder="www.suaempresa.com.br" className="input-field pl-9" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL completa do site</label>
            <input name="siteUrl" value={empresa.siteUrl} onChange={setEmp}
              placeholder="https://www.suaempresa.com.br" className="input-field" />
          </div>
        </div>
      </fieldset>

      <hr className="border-gray-100" />

      {/* ── 3. Endereço ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-4">
          <MapPin className="w-4 h-4 text-primary" /> Endereço da empresa
          <span className="font-normal text-gray-400 text-xs">(usado no mapa da página)</span>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rua / Avenida *</label>
            <input name="rua" value={endereco.rua} onChange={setEnd} required
              placeholder="Ex: Av. Rondon Pacheco" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Número *</label>
            <input name="numero" value={endereco.numero} onChange={setEnd} required
              placeholder="Ex: 1234" className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Complemento</label>
            <input name="complemento" value={endereco.complemento} onChange={setEnd}
              placeholder="Sala, andar, loja…" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bairro *</label>
            <input name="bairro" value={endereco.bairro} onChange={setEnd} required
              placeholder="Ex: Centro" className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cidade *</label>
            <input name="cidade" value={endereco.cidade} onChange={setEnd} required
              placeholder="Ex: Uberlândia" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estado *</label>
            <CustomSelect
              options={UF_OPTIONS}
              value={endereco.uf}
              onChange={(v) => setEndereco(p => ({ ...p, uf: v }))}
              placeholder="UF"
              required
              triggerIcon={MapPin}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">CEP</label>
            <input name="cep" value={endereco.cep} onChange={setEnd}
              placeholder="38400-000" className="input-field" />
          </div>
        </div>
      </fieldset>

      <hr className="border-gray-100" />

      {/* ── 4. Redes sociais ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-4">
          <Share2 className="w-4 h-4 text-primary" /> Redes sociais
          <span className="font-normal text-gray-400 text-xs">(links exibidos na página)</span>
        </legend>
        <div className="space-y-2.5">
          {redes.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <CustomSelect
                options={REDES_OPTIONS}
                value={r.rede}
                onChange={(v) => setRede(i, 'rede', v)}
                size="sm"
                className="w-44 flex-shrink-0"
              />
              <input
                value={r.url}
                onChange={e => setRede(i, 'url', e.target.value)}
                placeholder={REDES_PLACEHOLDERS[r.rede] ?? 'https://…'}
                className="input-field flex-1 min-w-0"
              />
              {redes.length > 1 && (
                <button type="button" onClick={() => removeRede(i)}
                  className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-400 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {redes.length < REDES_OPTIONS.length && (
          <button type="button" onClick={addRede}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-semibold transition">
            <Plus className="w-3.5 h-3.5" /> Adicionar outra rede
          </button>
        )}
      </fieldset>

      <hr className="border-gray-100" />

      {/* ── 5. Conteúdo da página ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-4">
          <AlignLeft className="w-4 h-4 text-primary" /> Conteúdo da página do parceiro
        </legend>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Resumo <span className="font-normal text-gray-400">(aparece nos cards — até 160 caracteres)</span>
          </label>
          <textarea value={resumo} onChange={e => setResumo(e.target.value)} rows={2} maxLength={160}
            placeholder="Descrição curta que aparece nos cards de parceiro…"
            className="input-field resize-none" />
          <p className="text-right text-[11px] text-gray-400 mt-1">{resumo.length}/160</p>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Descrição completa <span className="font-normal text-gray-400">(parágrafos da página)</span>
          </label>
          <div className="space-y-2">
            {descricao.map((p, i) => (
              <div key={i} className="flex gap-2">
                <textarea value={p} onChange={e => setDesc(i, e.target.value)} rows={3}
                  placeholder={`Parágrafo ${i + 1}…`}
                  className="input-field resize-none flex-1" />
                {descricao.length > 1 && (
                  <button type="button" onClick={() => removeDesc(i)}
                    className="self-start mt-1 p-1.5 text-gray-400 hover:text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addDesc}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-semibold transition">
            <Plus className="w-3.5 h-3.5" /> Adicionar parágrafo
          </button>
        </div>
      </fieldset>

      <hr className="border-gray-100" />

      {/* ── 6. Serviços ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-4">
          <ListChecks className="w-4 h-4 text-primary" /> O que a empresa oferece
          <span className="font-normal text-gray-400 text-xs">(itens da grade na página)</span>
        </legend>
        <div className="space-y-2">
          {servicos.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <input value={s} onChange={e => setServ(i, e.target.value)}
                placeholder={`Serviço / produto ${i + 1}…`}
                className="input-field flex-1" />
              {servicos.length > 1 && (
                <button type="button" onClick={() => removeServ(i)}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addServ}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-semibold transition">
          <Plus className="w-3.5 h-3.5" /> Adicionar item
        </button>
      </fieldset>

      <hr className="border-gray-100" />

      {/* ── 7. Desconto / Benefício ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-4">
          <BadgePercent className="w-4 h-4 text-primary" /> Benefício para associados
        </legend>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Desconto / condição especial *
            <span className="font-normal text-gray-400 ml-1">(aparece na faixa de destaque da página)</span>
          </label>
          <input value={desconto} onChange={e => setDesconto(e.target.value)} required
            placeholder="Ex: 15% de desconto para associados Sindibes"
            className="input-field" />
        </div>
      </fieldset>

      <hr className="border-gray-100" />

      {/* ── 8. Foto de capa (obrigatória) ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-2">
          <ImageIcon className="w-4 h-4 text-primary" /> Foto de capa *
          <span className="font-normal text-gray-400 text-xs">(aparece no topo da página e nos cards)</span>
        </legend>
        <p className="text-xs text-gray-400 mb-3">Proporção 16:9 recomendada · máx. 1 MB · JPG, PNG ou WEBP</p>

        {capa ? (
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capa.url} alt="Capa" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => { URL.revokeObjectURL(capa.url); setCapa(null) }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl">
                <X className="w-4 h-4" /> Remover
              </button>
              <button type="button" onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl">
                <Upload className="w-4 h-4" /> Trocar foto
              </button>
            </div>
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
              {capa.tamanho}
            </span>
          </div>
        ) : (
          <div
            onDrop={e => { e.preventDefault(); setDrag(false); handleCapa(e.dataTransfer.files?.[0] ?? null) }}
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              drag ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Arraste a foto ou clique para selecionar</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WEBP · máx. 1 MB · proporção 16:9 recomendada</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => handleCapa(e.target.files?.[0] ?? null)} />
        {erroCapa && (
          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> {erroCapa}
          </p>
        )}
      </fieldset>

      {erroEnvio && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{erroEnvio}</p>
      )}

      <button type="submit" disabled={enviando}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-60 transition">
        {enviando
          ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>Enviando…</>
          : <><Send className="w-4 h-4" />Enviar proposta de parceria</>}
      </button>
      <p className="text-center text-xs text-gray-400">Suas informações são tratadas com sigilo.</p>
    </form>
  )
}
