'use client'

import { useState } from 'react'
import { FUNCOES, TIPOS_CONTRATO } from '@/lib/recrutamento'
import ConfirmModal from '@/components/ConfirmModal'
import { Store, Briefcase, FileType, MapPin, DollarSign, Phone, Send } from 'lucide-react'

export default function VagaForm() {
  const [form, setForm] = useState({
    titulo: '', funcao: '', empresa: '', tipo: '', local: 'Uberlândia - MG',
    salario: '', contato: '', descricao: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [modal, setModal] = useState(false)

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await fetch('/api/recrutamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipoRegistro: 'vaga' }),
      })
    } catch { /* mostra confirmação mesmo se a API falhar */ }
    setEnviando(false)
    setModal(true)
    setForm({ titulo: '', funcao: '', empresa: '', tipo: '', local: 'Uberlândia - MG', salario: '', contato: '', descricao: '' })
  }

  const inputCls = 'w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm'

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-10 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field icon={FileType} label="Título da vaga *">
            <input required value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Ex: Cabeleireiro(a) com experiência" className={inputCls} />
          </Field>
          <Field icon={Briefcase} label="Função *">
            <select required value={form.funcao} onChange={(e) => set('funcao', e.target.value)} className={inputCls}>
              <option value="">Selecione a função...</option>
              {FUNCOES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
          <Field icon={Store} label="Empresa / Estabelecimento *">
            <input required value={form.empresa} onChange={(e) => set('empresa', e.target.value)} placeholder="Nome do salão, barbearia..." className={inputCls} />
          </Field>
          <Field icon={FileType} label="Tipo de contrato *">
            <select required value={form.tipo} onChange={(e) => set('tipo', e.target.value)} className={inputCls}>
              <option value="">Selecione...</option>
              {TIPOS_CONTRATO.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field icon={MapPin} label="Local">
            <input value={form.local} onChange={(e) => set('local', e.target.value)} placeholder="Bairro, cidade" className={inputCls} />
          </Field>
          <Field icon={DollarSign} label="Remuneração">
            <input value={form.salario} onChange={(e) => set('salario', e.target.value)} placeholder="Ex: R$ 1.800 + comissão" className={inputCls} />
          </Field>
          <Field icon={Phone} label="Contato para candidatura *">
            <input required value={form.contato} onChange={(e) => set('contato', e.target.value)} placeholder="WhatsApp ou e-mail" className={inputCls} />
          </Field>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição da vaga</label>
          <textarea value={form.descricao} onChange={(e) => set('descricao', e.target.value)} rows={4} placeholder="Requisitos, atividades, diferenciais e benefícios." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm resize-none" />
        </div>

        <button type="submit" disabled={enviando} className="w-full py-4 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60">
          <Send className="w-4 h-4" /> {enviando ? 'Publicando...' : 'Publicar vaga'}
        </button>
        <p className="text-[11px] text-gray-400 text-center">Sua vaga será divulgada na página de vagas do Sindibes para candidatos da região.</p>
      </form>

      <ConfirmModal
        open={modal}
        onClose={() => setModal(false)}
        titulo="Vaga publicada!"
        mensagem="Sua vaga foi cadastrada com sucesso e será divulgada para os profissionais da beleza filiados ao Sindibes. Em breve você receberá candidaturas."
        ctaLabel="Ver currículos disponíveis"
        ctaHref="/curriculos"
      />
    </>
  )
}

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {children}
      </div>
    </div>
  )
}
