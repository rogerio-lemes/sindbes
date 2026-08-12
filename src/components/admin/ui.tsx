'use client'

import { ShieldAlert } from 'lucide-react'
import { useAdminAuth } from './AdminAuthProvider'

export function PageHeader({
  titulo, descricao, acoes,
}: { titulo: string; descricao?: string; acoes?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
        {descricao && <p className="text-sm text-gray-500 mt-1">{descricao}</p>}
      </div>
      {acoes && <div className="flex items-center gap-2">{acoes}</div>}
    </div>
  )
}

export function Card({
  title, icon, children, acoes,
}: { title?: string; icon?: React.ReactNode; children: React.ReactNode; acoes?: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 mb-6 overflow-hidden">
      {title && (
        <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <h2 className="font-bold text-sm flex items-center gap-2 text-gray-900">
            {icon} {title}
          </h2>
          {acoes}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

const inputBase =
  'w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary'

export function Field({
  label, value, onChange, type = 'text', placeholder, icon, hint, disabled,
}: {
  label: string
  value: string | number | null | undefined
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  icon?: React.ReactNode
  hint?: string
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <span className="relative block">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{icon}</span>
        )}
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputBase} ${icon ? 'pl-9' : ''} disabled:bg-gray-50 disabled:text-gray-400`}
        />
      </span>
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </label>
  )
}

export function TextArea({
  label, value, onChange, rows = 4, placeholder, hint,
}: {
  label: string
  value: string | null | undefined
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
  hint?: string
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </label>
  )
}

export function SelectField({
  label, value, onChange, options, hint,
}: {
  label: string
  value: string | null | undefined
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  hint?: string
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </label>
  )
}

export function ColorField({
  label, value, onChange,
}: { label: string; value: string | null | undefined; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-11 h-11 rounded-lg border border-gray-200 cursor-pointer shrink-0"
        />
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        />
      </span>
    </label>
  )
}

export function Toggle({
  label, checked, onChange, hint,
}: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <span>
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        {hint && <span className="block text-xs text-gray-400">{hint}</span>}
      </span>
    </label>
  )
}

type StatusTone = 'ativo' | 'inativo' | 'agendado' | 'expirado' | 'pendente' | 'neutro'

const tones: Record<StatusTone, string> = {
  ativo: 'bg-green-50 text-green-700 border-green-200',
  inativo: 'bg-gray-100 text-gray-500 border-gray-200',
  agendado: 'bg-blue-50 text-blue-700 border-blue-200',
  expirado: 'bg-red-50 text-red-600 border-red-200',
  pendente: 'bg-amber-50 text-amber-700 border-amber-200',
  neutro: 'bg-gray-50 text-gray-600 border-gray-200',
}

export function StatusBadge({ status, label }: { status: StatusTone; label?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${tones[status]}`}>
      {label ?? status}
    </span>
  )
}

export function SaveBar({
  onSave, saving, message, extra,
}: { onSave: () => void; saving: boolean; message?: string; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-gray-50/90 backdrop-blur py-3">
      {message && <span className="text-sm text-green-600 font-medium mr-auto">{message}</span>}
      {extra}
      <button
        onClick={onSave}
        disabled={saving}
        className="h-11 px-6 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {saving ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </div>
  )
}

export function EmptyState({ titulo, descricao, acao }: { titulo: string; descricao?: string; acao?: React.ReactNode }) {
  return (
    <div className="text-center py-12">
      <p className="font-medium text-gray-700">{titulo}</p>
      {descricao && <p className="text-sm text-gray-400 mt-1">{descricao}</p>}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  )
}

/** Bloqueia a página quando o usuário não tem a permissão exigida. */
export function PermissionGuard({
  permissao, children,
}: { permissao: string; children: React.ReactNode }) {
  const { canAccess } = useAdminAuth()
  if (!canAccess(permissao)) {
    return (
      <div className="text-center py-16">
        <ShieldAlert className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="font-bold text-gray-800">Acesso restrito</p>
        <p className="text-sm text-gray-500 mt-1">
          Seu departamento não tem permissão para acessar esta área.
        </p>
      </div>
    )
  }
  return <>{children}</>
}
