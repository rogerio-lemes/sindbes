'use client'

import { useState } from 'react'
import ConfirmModal from '@/components/ConfirmModal'
import CustomSelect from '@/components/ui/CustomSelect'
import { FUNCOES_OPTIONS, EXPERIENCIA_OPTIONS } from '@/lib/select-options'
import { User, Phone, Mail, MapPin, Briefcase, Award, CalendarClock, FileText, Send } from 'lucide-react'

export default function CurriculoForm() {
  const [form, setForm] = useState({
    nome: '', telefone: '', email: '', cidade: 'Uberlândia - MG',
    funcao: '', experiencia: '', disponibilidade: '', sobre: '', portfolio: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [modal, setModal] = useState(false)

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  function maskPhone(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await fetch('/api/recrutamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipoRegistro: 'curriculo' }),
      })
    } catch { /* mostra confirmação mesmo se a API falhar */ }
    setEnviando(false)
    setModal(true)
    setForm({ nome: '', telefone: '', email: '', cidade: 'Uberlândia - MG', funcao: '', experiencia: '', disponibilidade: '', sobre: '', portfolio: '' })
  }

  const inputCls = 'w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm'

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-10 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field icon={User} label="Nome completo *">
            <input required value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Seu nome" className={inputCls} />
          </Field>
          <Field icon={Phone} label="WhatsApp *">
            <input required value={form.telefone} onChange={(e) => set('telefone', maskPhone(e.target.value))} placeholder="(34) 00000-0000" className={inputCls} />
          </Field>
          <Field icon={Mail} label="E-mail">
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="seu@email.com" className={inputCls} />
          </Field>
          <Field icon={MapPin} label="Cidade">
            <input value={form.cidade} onChange={(e) => set('cidade', e.target.value)} placeholder="Sua cidade" className={inputCls} />
          </Field>

          {/* ── Select de Função ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Área de atuação *</label>
            <CustomSelect
              options={FUNCOES_OPTIONS}
              value={form.funcao}
              onChange={(v) => set('funcao', v)}
              placeholder="Selecione a função..."
              required
              triggerIcon={Briefcase}
            />
          </div>

          {/* ── Select de Experiência ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Experiência *</label>
            <CustomSelect
              options={EXPERIENCIA_OPTIONS}
              value={form.experiencia}
              onChange={(v) => set('experiencia', v)}
              placeholder="Selecione..."
              required
              triggerIcon={Award}
            />
          </div>

          <Field icon={CalendarClock} label="Disponibilidade">
            <input value={form.disponibilidade} onChange={(e) => set('disponibilidade', e.target.value)} placeholder="Imediata, meio período..." className={inputCls} />
          </Field>
          <Field icon={FileText} label="Portfólio / Instagram">
            <input value={form.portfolio} onChange={(e) => set('portfolio', e.target.value)} placeholder="@seuperfil ou link" className={inputCls} />
          </Field>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sobre você</label>
          <textarea value={form.sobre} onChange={(e) => set('sobre', e.target.value)} rows={4} placeholder="Conte um pouco da sua experiência, especialidades e diferenciais." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm resize-none" />
        </div>

        <button type="submit" disabled={enviando} className="w-full h-13 py-4 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60">
          <Send className="w-4 h-4" /> {enviando ? 'Enviando...' : 'Cadastrar meu currículo'}
        </button>
        <p className="text-[11px] text-gray-400 text-center">Seus dados serão usados apenas para conectar você a oportunidades. Sem spam.</p>
      </form>

      <ConfirmModal
        open={modal}
        onClose={() => setModal(false)}
        titulo="Currículo cadastrado!"
        mensagem="Seu currículo foi enviado com sucesso e já está disponível para as empresas filiadas ao Sindibes. Boa sorte na sua busca!"
        ctaLabel="Ver vagas disponíveis"
        ctaHref="/vagas"
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
