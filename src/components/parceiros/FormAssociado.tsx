'use client'

import { useState, useRef, useCallback } from 'react'
import {
  CheckCircle2, Upload, X, ImageIcon,
  Phone, Mail, User, Building2, FileText, Send, ChevronRight,
  MapPin, Share2, Plus, Trash2,
} from 'lucide-react'

const BENEFICIOS = [
  'Planos de saúde e odontológico com preços negociados',
  'Assessoria jurídica e contábil especializada no setor',
  'Treinamentos e qualificações com certificado reconhecido',
  'Acesso a crédito com condições facilitadas',
  'Regularização e certificação profissional',
  'Rede de parceiros com descontos exclusivos',
  'Representação sindical e defesa dos seus direitos',
]

const REDES_SOCIAIS = [
  { id: 'instagram',  label: 'Instagram',   placeholder: 'https://instagram.com/seunegocio',  emoji: '📸' },
  { id: 'facebook',   label: 'Facebook',    placeholder: 'https://facebook.com/seunegocio',   emoji: '👥' },
  { id: 'tiktok',     label: 'TikTok',      placeholder: 'https://tiktok.com/@seunegocio',    emoji: '🎵' },
  { id: 'youtube',    label: 'YouTube',     placeholder: 'https://youtube.com/@seunegocio',   emoji: '▶️' },
  { id: 'twitter',    label: 'X / Twitter', placeholder: 'https://x.com/seunegocio',          emoji: '🐦' },
  { id: 'linkedin',   label: 'LinkedIn',    placeholder: 'https://linkedin.com/in/…',         emoji: '💼' },
  { id: 'pinterest',  label: 'Pinterest',   placeholder: 'https://pinterest.com/seunegocio',  emoji: '📌' },
  { id: 'whatsapp',   label: 'WhatsApp',    placeholder: 'https://wa.me/5534900000000',       emoji: '💬' },
]

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

const MAX_FOTOS = 10
const MAX_MB = 1

interface Foto { file: File; url: string; tamanho: string }
interface CapaPreview { file: File; url: string; tamanho: string }
interface RedeSocial { rede: string; url: string }

const fmtSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`

export default function FormAssociado() {
  const [form, setForm] = useState({
    nome: '', empresa: '', telefone: '', email: '', cnpj: '', mensagem: '',
  })
  const [endereco, setEndereco] = useState({
    rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: 'MG', cep: '',
  })
  const [redes, setRedes] = useState<RedeSocial[]>([{ rede: 'instagram', url: '' }])

  const [capa, setCapa] = useState<CapaPreview | null>(null)
  const [erroCapa, setErroCapa] = useState<string | null>(null)
  const [dragCapa, setDragCapa] = useState(false)
  const capaRef = useRef<HTMLInputElement>(null)

  const [fotos, setFotos] = useState<Foto[]>([])
  const [erroFoto, setErroFoto] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const fotosRef = useRef<HTMLInputElement>(null)

  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)

  const setF = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const setEnd = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEndereco(p => ({ ...p, [e.target.name]: e.target.value }))

  // Redes sociais
  const setRede    = (i: number, field: keyof RedeSocial, v: string) =>
    setRedes(r => r.map((x, j) => j === i ? { ...x, [field]: v } : x))
  const addRede    = () => {
    const usadas = redes.map(r => r.rede)
    const prox = REDES_SOCIAIS.find(r => !usadas.includes(r.id))
    setRedes(r => [...r, { rede: prox?.id ?? REDES_SOCIAIS[0].id, url: '' }])
  }
  const removeRede = (i: number) => setRedes(r => r.filter((_, j) => j !== i))

  // Capa
  const handleCapa = (file: File | null) => {
    setErroCapa(null)
    if (!file) return
    if (!file.type.startsWith('image/')) { setErroCapa('Selecione uma imagem (JPG, PNG, WEBP).'); return }
    if (file.size > MAX_MB * 1024 * 1024) { setErroCapa('A imagem deve ter no máximo 1 MB.'); return }
    if (capa) URL.revokeObjectURL(capa.url)
    setCapa({ file, url: URL.createObjectURL(file), tamanho: fmtSize(file.size) })
  }

  // Fotos adicionais
  const addFotos = useCallback((files: FileList | null) => {
    if (!files) return
    setErroFoto(null)
    const add: Foto[] = []
    const errs: string[] = []
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) { errs.push(`"${file.name}" não é imagem.`); return }
      if (file.size > MAX_MB * 1024 * 1024) { errs.push(`"${file.name}" excede 1 MB.`); return }
      if (fotos.length + add.length >= MAX_FOTOS) { errs.push('Limite de 10 imagens atingido.'); return }
      add.push({ file, url: URL.createObjectURL(file), tamanho: fmtSize(file.size) })
    })
    if (errs.length) setErroFoto(errs[0])
    setFotos(prev => [...prev, ...add].slice(0, MAX_FOTOS))
  }, [fotos.length])

  const removeFoto = (i: number) => setFotos(prev => {
    URL.revokeObjectURL(prev[i].url); return prev.filter((_, j) => j !== i)
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!capa) { setErroEnvio('A foto de capa do negócio é obrigatória.'); return }
    setEnviando(true); setErroEnvio(null)
    try {
      const fd = new FormData()
      fd.append('tipo', 'associado')
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      Object.entries(endereco).forEach(([k, v]) => fd.append(`end_${k}`, v))
      redes.filter(r => r.url).forEach((r, i) => {
        fd.append(`rede_${i}_tipo`, r.rede)
        fd.append(`rede_${i}_url`, r.url)
      })
      fd.append('capa', capa.file, capa.file.name)
      fotos.forEach((f, i) => fd.append(`foto_${i}`, f.file, f.file.name))
      const res = await fetch('/api/cadastro-parceiro', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      setSucesso(true)
    } catch { setErroEnvio('Não foi possível enviar. Tente pelo WhatsApp.') }
    finally { setEnviando(false) }
  }

  const reset = () => {
    setForm({ nome: '', empresa: '', telefone: '', email: '', cnpj: '', mensagem: '' })
    setEndereco({ rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: 'MG', cep: '' })
    setRedes([{ rede: 'instagram', url: '' }])
    if (capa) URL.revokeObjectURL(capa.url); setCapa(null)
    fotos.forEach(f => URL.revokeObjectURL(f.url)); setFotos([])
    setSucesso(false)
  }

  if (sucesso) return (
    <div className="text-center py-14">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-text mb-2">Solicitação recebida!</h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto">Nossa equipe entrará em contato para finalizar sua filiação ao Sindibes.</p>
      <button onClick={reset}
        className="mt-6 px-6 py-2.5 bg-secondary text-white text-sm font-semibold rounded-xl hover:bg-secondary/90 transition">
        Nova solicitação
      </button>
    </div>
  )

  const inputSec  = 'w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition'
  const inputBase = 'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition'

  return (
    <form onSubmit={submit} className="space-y-6">

      {/* Benefícios */}
      <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-2.5">Vantagens de ser associado</p>
        <ul className="space-y-1.5">
          {BENEFICIOS.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
              <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-secondary" />{b}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Dados pessoais ── */}
      <fieldset className="space-y-4">
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-1">
          <User className="w-4 h-4 text-secondary" /> Seus dados
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome completo *</label>
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="nome" value={form.nome} onChange={setF} required placeholder="Seu nome" className={inputSec} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estabelecimento / Profissão *</label>
            <div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="empresa" value={form.empresa} onChange={setF} required placeholder="Ex: Salão Ana, Barbearia…" className={inputSec} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">WhatsApp *</label>
            <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="telefone" value={form.telefone} onChange={setF} required placeholder="(34) 9 0000-0000" className={inputSec} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-mail</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="email" value={form.email} onChange={setF} type="email" placeholder="seu@email.com" className={inputSec} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">CNPJ / CPF</label>
            <input name="cnpj" value={form.cnpj} onChange={setF} placeholder="00.000.000/0001-00 ou 000.000.000-00" className={inputBase} />
          </div>
        </div>
      </fieldset>

      <hr className="border-gray-100" />

      {/* ── Endereço ── */}
      <fieldset className="space-y-4">
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-1">
          <MapPin className="w-4 h-4 text-secondary" /> Endereço do negócio
          <span className="font-normal text-gray-400 text-xs">(usado para exibir no mapa)</span>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rua / Avenida *</label>
            <input name="rua" value={endereco.rua} onChange={setEnd} required placeholder="Ex: Av. Rondon Pacheco" className={inputBase} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Número *</label>
            <input name="numero" value={endereco.numero} onChange={setEnd} required placeholder="Ex: 1234" className={inputBase} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Complemento</label>
            <input name="complemento" value={endereco.complemento} onChange={setEnd} placeholder="Sala, apto, andar…" className={inputBase} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bairro *</label>
            <input name="bairro" value={endereco.bairro} onChange={setEnd} required placeholder="Ex: Centro" className={inputBase} />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cidade *</label>
            <input name="cidade" value={endereco.cidade} onChange={setEnd} required placeholder="Ex: Uberlândia" className={inputBase} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estado *</label>
            <select name="uf" value={endereco.uf} onChange={setEnd} required className={inputBase}>
              {ESTADOS_BR.map(uf => <option key={uf}>{uf}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">CEP</label>
            <input name="cep" value={endereco.cep} onChange={setEnd} placeholder="38400-000" className={inputBase} />
          </div>
        </div>
      </fieldset>

      <hr className="border-gray-100" />

      {/* ── Redes sociais ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-3">
          <Share2 className="w-4 h-4 text-secondary" /> Redes sociais
          <span className="font-normal text-gray-400 text-xs">(exibidas no perfil)</span>
        </legend>
        <div className="space-y-2.5">
          {redes.map((r, i) => {
            const info = REDES_SOCIAIS.find(rs => rs.id === r.rede)
            return (
              <div key={i} className="flex items-center gap-2">
                <select value={r.rede} onChange={e => setRede(i, 'rede', e.target.value)}
                  className={`${inputBase} w-44 flex-shrink-0 appearance-none`}>
                  {REDES_SOCIAIS.map(rs => (
                    <option key={rs.id} value={rs.id}>{rs.emoji} {rs.label}</option>
                  ))}
                </select>
                <input value={r.url} onChange={e => setRede(i, 'url', e.target.value)}
                  placeholder={info?.placeholder ?? 'https://…'}
                  className={`${inputBase} flex-1 min-w-0`} />
                {redes.length > 1 && (
                  <button type="button" onClick={() => removeRede(i)}
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
        {redes.length < REDES_SOCIAIS.length && (
          <button type="button" onClick={addRede}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-secondary hover:text-secondary/80 font-semibold transition">
            <Plus className="w-3.5 h-3.5" /> Adicionar outra rede
          </button>
        )}
      </fieldset>

      <hr className="border-gray-100" />

      {/* ── Mensagem ── */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mensagem (opcional)</label>
        <div className="relative"><FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <textarea name="mensagem" value={form.mensagem} onChange={setF} rows={3}
            placeholder="Alguma dúvida ou informação adicional?"
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition resize-none" />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* ── Foto de capa (obrigatória) ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-2">
          <ImageIcon className="w-4 h-4 text-secondary" />
          Foto de capa do negócio *
          <span className="font-normal text-gray-400 text-xs">(fachada ou ambiente — máx. 1 MB)</span>
        </legend>
        <p className="text-xs text-gray-400 mb-3">Aparecerá no topo da sua página. Proporção 16:9 recomendada.</p>

        {capa ? (
          <div className="relative rounded-2xl overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capa.url} alt="Capa" className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => { URL.revokeObjectURL(capa.url); setCapa(null) }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl">
                <X className="w-4 h-4" /> Remover
              </button>
              <button type="button" onClick={() => capaRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl">
                <Upload className="w-4 h-4" /> Trocar foto
              </button>
            </div>
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">{capa.tamanho}</span>
          </div>
        ) : (
          <div
            onDrop={e => { e.preventDefault(); setDragCapa(false); handleCapa(e.dataTransfer.files?.[0] ?? null) }}
            onDragOver={e => { e.preventDefault(); setDragCapa(true) }}
            onDragLeave={() => setDragCapa(false)}
            onClick={() => capaRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragCapa ? 'border-secondary bg-secondary/5 scale-[1.01]' : 'border-gray-200 bg-gray-50 hover:border-secondary hover:bg-secondary/5'}`}
          >
            <Upload className="w-7 h-7 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Arraste a foto ou clique para selecionar</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WEBP · máx. 1 MB</p>
          </div>
        )}
        <input ref={capaRef} type="file" accept="image/*" className="hidden"
          onChange={e => handleCapa(e.target.files?.[0] ?? null)} />
        {erroCapa && <p className="mt-2 text-xs text-red-500 flex items-center gap-1"><X className="w-3.5 h-3.5" />{erroCapa}</p>}
      </fieldset>

      {/* ── Fotos do local ── */}
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-bold text-text mb-2">
          <ImageIcon className="w-4 h-4 text-secondary" />
          Fotos do local / negócio
          <span className="font-normal text-gray-400 text-xs">(máx. 10 · 1 MB cada)</span>
        </legend>
        <p className="text-xs text-gray-400 mb-3">Ambiente interno, equipe, produtos — aparecerão num carrossel na sua página.</p>

        <div
          onDrop={e => { e.preventDefault(); setDrag(false); addFotos(e.dataTransfer.files) }}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onClick={() => fotos.length < MAX_FOTOS && fotosRef.current?.click()}
          className={`border-2 border-dashed rounded-xl px-4 py-5 text-center transition-all ${drag ? 'border-secondary bg-secondary/5' : fotos.length >= MAX_FOTOS ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' : 'border-gray-200 bg-gray-50 hover:border-secondary hover:bg-secondary/5 cursor-pointer'}`}
        >
          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
          <p className="text-xs text-gray-500">{fotos.length >= MAX_FOTOS ? 'Limite atingido' : 'Arraste ou clique para selecionar'}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WEBP</p>
          <input ref={fotosRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => addFotos(e.target.files)} />
        </div>
        {erroFoto && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><X className="w-3 h-3" />{erroFoto}</p>}
        {fotos.length > 0 && (
          <div className="mt-2.5 grid grid-cols-4 sm:grid-cols-6 gap-2">
            {fotos.map((f, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={e => { e.stopPropagation(); removeFoto(i) }}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </button>
                <span className="absolute bottom-0.5 left-0.5 right-0.5 text-[9px] text-white bg-black/60 rounded text-center">{f.tamanho}</span>
              </div>
            ))}
            {fotos.length < MAX_FOTOS && (
              <button type="button" onClick={() => fotosRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-secondary transition flex flex-col items-center justify-center">
                <ImageIcon className="w-4 h-4 text-gray-300" />
                <span className="text-[10px] text-gray-400 mt-0.5">{fotos.length}/{MAX_FOTOS}</span>
              </button>
            )}
          </div>
        )}
      </fieldset>

      {erroEnvio && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{erroEnvio}</p>
      )}

      <button type="submit" disabled={enviando}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-secondary hover:bg-secondary/90 shadow-md shadow-secondary/20 disabled:opacity-60 transition">
        {enviando
          ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Enviando…</>
          : <><Send className="w-4 h-4" />Solicitar associação</>}
      </button>
      <p className="text-center text-xs text-gray-400">Suas informações são tratadas com sigilo.</p>
    </form>
  )
}
