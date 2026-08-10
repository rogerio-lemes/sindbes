'use client'

import { useState, useRef, useCallback } from 'react'
import {
  CheckCircle2, Upload, X, ImageIcon,
  Phone, Mail, User, Building2, FileText, Send, ChevronRight,
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

const MAX_FOTOS = 10
const MAX_MB = 1

interface Foto { file: File; url: string; tamanho: string }
const fmtSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`

export default function FormAssociado() {
  const [form, setForm] = useState({ nome: '', empresa: '', telefone: '', email: '', cidade: '', cnpj: '', mensagem: '' })
  const [fotos, setFotos] = useState<Foto[]>([])
  const [erroFoto, setErroFoto] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

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

  const removeFoto = (i: number) => setFotos(prev => { URL.revokeObjectURL(prev[i].url); return prev.filter((_, j) => j !== i) })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true); setErroEnvio(null)
    try {
      const fd = new FormData()
      fd.append('tipo', 'associado')
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fotos.forEach((f, i) => fd.append(`foto_${i}`, f.file, f.file.name))
      const res = await fetch('/api/cadastro-parceiro', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      setSucesso(true)
    } catch { setErroEnvio('Não foi possível enviar. Tente pelo WhatsApp.') }
    finally { setEnviando(false) }
  }

  if (sucesso) return (
    <div className="text-center py-14">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-text mb-2">Solicitação recebida!</h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto">Nossa equipe entrará em contato para finalizar sua filiação ao Sindibes.</p>
      <button onClick={() => { setSucesso(false); setFotos([]); setForm({ nome: '', empresa: '', telefone: '', email: '', cidade: '', cnpj: '', mensagem: '' }) }}
        className="mt-6 px-6 py-2.5 bg-secondary text-white text-sm font-semibold rounded-xl hover:bg-secondary/90 transition">
        Nova solicitação
      </button>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Benefícios */}
      <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-2.5">Vantagens de ser associado</p>
        <ul className="space-y-1.5">
          {BENEFICIOS.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
              <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-secondary" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome completo *</label>
          <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input name="nome" value={form.nome} onChange={set} required placeholder="Seu nome"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estabelecimento / Profissão *</label>
          <div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input name="empresa" value={form.empresa} onChange={set} required placeholder="Ex: Salão, Barbearia…"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">WhatsApp *</label>
          <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input name="telefone" value={form.telefone} onChange={set} required placeholder="(34) 9 0000-0000"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-mail</label>
          <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input name="email" value={form.email} onChange={set} type="email" placeholder="seu@email.com"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cidade *</label>
          <input name="cidade" value={form.cidade} onChange={set} required placeholder="Ex: Uberlândia"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">CNPJ / CPF</label>
          <input name="cnpj" value={form.cnpj} onChange={set} placeholder="00.000.000/0001-00"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mensagem (opcional)</label>
        <div className="relative"><FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <textarea name="mensagem" value={form.mensagem} onChange={set} rows={3}
            placeholder="Alguma dúvida ou informação adicional?"
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition resize-none" />
        </div>
      </div>

      {/* Upload */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Fotos do seu negócio <span className="font-normal text-gray-400">(máx. 10 · 1 MB cada)</span>
        </label>
        <div onDrop={e => { e.preventDefault(); setDrag(false); addFotos(e.dataTransfer.files) }}
          onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
          onClick={() => fotos.length < MAX_FOTOS && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl px-4 py-5 text-center transition-all ${drag ? 'border-secondary bg-secondary/5' : fotos.length >= MAX_FOTOS ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' : 'border-gray-200 bg-gray-50 hover:border-secondary hover:bg-secondary/5 cursor-pointer'}`}>
          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
          <p className="text-xs text-gray-500">{fotos.length >= MAX_FOTOS ? 'Limite atingido' : 'Arraste ou clique para selecionar'}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WEBP</p>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addFotos(e.target.files)} />
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
              <button type="button" onClick={() => inputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-secondary transition flex flex-col items-center justify-center">
                <ImageIcon className="w-4 h-4 text-gray-300" />
                <span className="text-[10px] text-gray-400 mt-0.5">{fotos.length}/{MAX_FOTOS}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {erroEnvio && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{erroEnvio}</p>}

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
