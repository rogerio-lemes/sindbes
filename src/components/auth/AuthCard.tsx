'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type Theme = 'light' | 'dark'

interface AuthCardProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  /** URL completa para onde o link de recuperação de senha deve levar */
  recoveryRedirectTo: string
  theme?: Theme
  onSignIn: (email: string, password: string) => Promise<string | null>
  onSendRecovery: (email: string, redirectTo: string) => Promise<string | null>
}

const styles = {
  light: {
    page: 'bg-gray-50',
    card: 'bg-white',
    title: 'text-[color:var(--color-text,#1B2444)]',
    subtitle: 'text-gray-500',
    label: 'text-gray-700',
    input: 'border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-primary',
    button: 'bg-primary text-white hover:opacity-90',
    link: 'text-primary',
    muted: 'text-gray-500 hover:text-primary',
    error: 'text-red-500',
    body: 'text-gray-600',
    toggle: 'text-gray-400 hover:text-gray-600',
    iconBg: 'bg-primary',
  },
  dark: {
    page: 'bg-gray-900',
    card: 'bg-gray-800',
    title: 'text-white',
    subtitle: 'text-gray-400',
    label: 'text-gray-300',
    input: 'border-gray-600 bg-gray-700 text-white focus:border-violet-500 focus:ring-violet-500',
    button: 'bg-violet-600 text-white hover:bg-violet-700',
    link: 'text-violet-400',
    muted: 'text-gray-400 hover:text-violet-400',
    error: 'text-red-400',
    body: 'text-gray-300',
    toggle: 'text-gray-400 hover:text-gray-200',
    iconBg: 'bg-violet-600',
  },
} as const

export default function AuthCard({
  title, subtitle, icon, recoveryRedirectTo, theme = 'light', onSignIn, onSendRecovery,
}: AuthCardProps) {
  const s = styles[theme]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const err = await onSignIn(email, password)
    setBusy(false)
    if (err) setError(err)
  }

  async function handleRecovery(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const err = await onSendRecovery(email, recoveryRedirectTo)
    setBusy(false)
    if (err) setError(err)
    else setRecoverySent(true)
  }

  const inputClass = `w-full h-12 px-4 rounded-xl border outline-none focus:ring-1 ${s.input}`

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${s.page}`}>
      <div className={`w-full max-w-md rounded-2xl shadow-xl p-8 ${s.card}`}>
        <div className="text-center mb-8">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white mx-auto mb-3 ${s.iconBg}`}>
            {icon}
          </div>
          <h1 className={`text-xl font-bold ${s.title}`}>{title}</h1>
          <p className={`text-sm mt-1 ${s.subtitle}`}>
            {recoveryMode ? 'Recuperar senha' : subtitle}
          </p>
        </div>

        {recoveryMode && recoverySent ? (
          <div className="text-center space-y-4">
            <p className={`text-sm ${s.body}`}>
              Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de
              entrada (e o spam) e clique no link para definir uma nova senha.
            </p>
            <button
              type="button"
              onClick={() => { setRecoveryMode(false); setRecoverySent(false); setError('') }}
              className={`text-sm font-medium hover:underline ${s.link}`}
            >
              Voltar para o login
            </button>
          </div>
        ) : recoveryMode ? (
          <form onSubmit={handleRecovery} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${s.label}`}>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>
            {error && <p className={`text-sm ${s.error}`}>{error}</p>}
            <button type="submit" disabled={busy} className={`w-full h-12 font-semibold rounded-xl transition-opacity disabled:opacity-60 ${s.button}`}>
              {busy ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
            <button
              type="button"
              onClick={() => { setRecoveryMode(false); setError('') }}
              className={`w-full text-center text-sm ${s.muted}`}
            >
              Voltar para o login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${s.label}`}>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${s.label}`}>Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={`absolute right-0 top-0 h-12 w-12 flex items-center justify-center ${s.toggle}`}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={() => { setRecoveryMode(true); setError('') }}
                className={`text-sm hover:underline ${s.link}`}
              >
                Esqueci minha senha
              </button>
            </div>
            {error && <p className={`text-sm ${s.error}`}>{error}</p>}
            <button type="submit" disabled={busy} className={`w-full h-12 font-semibold rounded-xl transition-opacity disabled:opacity-60 ${s.button}`}>
              {busy ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
