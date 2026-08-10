'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Handshake, UserCheck, CheckCircle2, Upload, X, ImageIcon,
  Phone, Mail, User, Building2, FileText, Send, ChevronRight,
} from 'lucide-react'

type Aba = 'parceiro' | 'associado'

const BENEFICIOS_PARCEIRO = [
  'Visibilidade para centenas de associados ativos',
  'Presença no site, redes sociais e eventos do Sindibes',
  'Selo oficial "Parceiro Sindibes" para divulgar',
  'Acesso à base de profissionais e empresas da beleza',
  'Divulgação preferencial em campanhas e newsletters',
  'Fortalecimento da marca junto ao setor',
]

const BENEFICIOS_ASSOCIADO = [
  'Planos de saúde e odontológico com preços negociados',
  'Assessoria jurídica e contábil especializada',
  'Treinamentos e qualificações com certificado',
  'Acesso a crédito com condições facilitadas',
  'Regularização e certificação profissional',
  'Rede de parceiros com descontos exclusivos',
  'Representação sindical e defesa dos seus direitos',
]

const MAX_FOTOS = 10
const MAX_TAMANHO_MB = 1

interface FotoPreview {
  file: File
  url: string
  nome: string
  tamanho: string
}

function fmtSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function CadastroForm() {
  const [aba, setAba] = useState<Aba>('parceiro')
  const [fotos, setFotos] = useState<FotoPreview[]>([])
  const [erroFoto, setErroFoto] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    nome: '', empresa: '', telefone: '', email: '', cidade: '', mensagem: '',
    segmento: '', cnpj: '',
  })

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const adicionarFotos = useCallback((files: FileList | null) => {
    if (!files) return
    setErroFoto(null)
    const novas: FotoPreview[] = []
    const erros: string[] = []

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) { erros.push(`"${file.name}" não é uma imagem.`); return }
      if (file.size > MAX_TAMANHO_MB * 1024 * 1024) { erros.push(`"${file.name}" excede 1 MB.`); return }
      if (fotos.length + novas.length >= MAX_FOTOS) { erros.push('Limite de 10 imagens atingido.'); return }
      novas.push({ file, url: URL.createObjectURL(file), nome: file.name, tamanho: fmtSize(file.size) })
    })

    if (erros.length) setErroFoto(erros[0])
    setFotos(prev => [...prev, ...novas].slice(0, MAX_FOTOS))
  }, [fotos.length])

  const removerFoto = (idx: number) => {
    setFotos(prev => {
      URL.revokeObjectURL(prev[idx].url)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false)
    adicionarFotos(e.dataTransfer.files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true); setErroEnvio(null)

    try {
      const fd = new FormData()
      fd.append('tipo', aba)
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fotos.forEach((f, i) => fd.append(`foto_${i}`, f.file, f.nome))

      const res = await fetch('/api/cadastro-parceiro', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Erro no servidor')
      setSucesso(true)
    } catch {
      setErroEnvio('Não foi possível enviar. Tente novamente ou entre em contato pelo WhatsApp.')
    } finally {
      setEnviando(false)
    }
  }

  if (sucesso) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-text mb-2">Cadastro recebido!</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {aba === 'parceiro'
            ? 'Obrigado pelo interesse em ser parceiro do Sindibes. Nossa equipe entrará em contato em breve.'
            : 'Obrigado pelo interesse em se associar ao Sindibes. Nossa equipe entrará em contato para finalizar sua filiação.'}
        </p>
        <button
          onClick={() => { setSucesso(false); setFotos([]); setForm({ nome: '', empresa: '', telefone: '', email: '', cidade: '', mensagem: '', segmento: '', cnpj: '' }) }}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition"
        >
          Novo cadastro
        </button>
      </div>
    )
  }

  const beneficios = aba === 'parceiro' ? BENEFICIOS_PARCEIRO : BENEFICIOS_ASSOCIADO

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          type="button"
          onClick={() => setAba('parceiro')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all ${
            aba === 'parceiro'
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <Handshake className="w-4 h-4" /> Quero ser Parceiro
        </button>
        <button
          type="button"
          onClick={() => setAba('associado')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all ${
            aba === 'associado'
              ? 'bg-secondary text-white shadow-lg shadow-secondary/25'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Quero ser Associado
        </button>
      </div>

      {/* Benefícios */}
      <div className={`rounded-2xl p-5 mb-7 ${aba === 'parceiro' ? 'bg-primary/5 border border-primary/20' : 'bg-secondary/5 border border-secondary/20'}`}>
        <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${aba === 'parceiro' ? 'text-primary' : 'text-secondary'}`}>
          {aba === 'parceiro' ? '✦ Vantagens de ser parceiro' : '✦ Vantagens de ser associado'}
        </p>
        <ul className="space-y-2">
          {beneficios.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <ChevronRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${aba === 'parceiro' ? 'text-primary' : 'text-secondary'}`} />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="nome" value={form.nome} onChange={handleField} required
                placeholder="Seu nome"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              {aba === 'parceiro' ? 'Nome da empresa *' : 'Estabelecimento / Profissão *'}
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="empresa" value={form.empresa} onChange={handleField} required
                placeholder={aba === 'parceiro' ? 'Nome da empresa' : 'Ex: Salão, Barbearia…'}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">WhatsApp / Telefone *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="telefone" value={form.telefone} onChange={handleField} required
                placeholder="(34) 9 0000-0000"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="email" value={form.email} onChange={handleField} type="email"
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cidade *</label>
            <input name="cidade" value={form.cidade} onChange={handleField} required
              placeholder="Ex: Uberlândia"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              {aba === 'parceiro' ? 'Segmento / Produto' : 'CNPJ / CPF'}
            </label>
            {aba === 'parceiro' ? (
              <select name="segmento" value={form.segmento} onChange={handleField}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              >
                <option value="">Selecione…</option>
                <option>Produtos de Beleza</option>
                <option>Educação / Cursos</option>
                <option>Saúde / Odontologia</option>
                <option>Financeiro / Crédito</option>
                <option>Tecnologia / Software</option>
                <option>Equipamentos</option>
                <option>Marketing / Comunicação</option>
                <option>Outros</option>
              </select>
            ) : (
              <input name="cnpj" value={form.cnpj} onChange={handleField}
                placeholder="00.000.000/0001-00 ou 000.000.000-00"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            {aba === 'parceiro' ? 'Proposta / Como quer colaborar' : 'Mensagem (opcional)'}
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <textarea name="mensagem" value={form.mensagem} onChange={handleField}
              rows={3}
              placeholder={aba === 'parceiro'
                ? 'Descreva o benefício que ofereceria aos associados…'
                : 'Alguma dúvida ou informação adicional?'}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
            />
          </div>
        </div>

        {/* Upload de fotos */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Fotos{aba === 'parceiro' ? ' do estabelecimento / produtos' : ' do seu negócio'}{' '}
            <span className="text-gray-400 font-normal">(máx. 10 imagens · 1 MB cada)</span>
          </label>

          {/* Área drag-and-drop */}
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              drag
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : fotos.length >= MAX_FOTOS
                  ? 'border-gray-200 bg-gray-50 opacity-60 pointer-events-none'
                  : 'border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {fotos.length >= MAX_FOTOS
                ? 'Limite de 10 imagens atingido'
                : 'Arraste as imagens ou clique para selecionar'}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — máx. 1 MB por imagem</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => adicionarFotos(e.target.files)}
            />
          </div>

          {erroFoto && (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> {erroFoto}
            </p>
          )}

          {/* Grade de preview */}
          {fotos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
              {fotos.map((f, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={f.nome} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); removerFoto(i) }}
                      className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] text-white bg-black/60 rounded px-1 text-center truncate">
                    {f.tamanho}
                  </span>
                </div>
              ))}
              {fotos.length < MAX_FOTOS && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary/5 transition flex flex-col items-center justify-center gap-1"
                >
                  <ImageIcon className="w-5 h-5 text-gray-300" />
                  <span className="text-[10px] text-gray-400">{fotos.length}/{MAX_FOTOS}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {erroEnvio && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {erroEnvio}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all ${
            aba === 'parceiro'
              ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25'
              : 'bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/25'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {enviando ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Enviando…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {aba === 'parceiro' ? 'Enviar proposta de parceria' : 'Solicitar associação'}
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400">
          Suas informações são tratadas com sigilo e usadas apenas para contato.
        </p>
      </form>
    </div>
  )
}
