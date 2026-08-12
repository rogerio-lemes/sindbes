'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Settings } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import AuthCard from '@/components/auth/AuthCard'
import { useSupabaseAuth } from '@/components/auth/useSupabaseAuth'
import { AdminAuthProvider, type AdminPerfil } from './AdminAuthProvider'
import AdminShell from './AdminShell'

/** Rotas dentro de /admin que não usam o shell nem exigem perfil resolvido. */
const ROTAS_LIVRES = ['/admin/redefinir-senha']

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { session, loading, signIn, sendRecovery } = useSupabaseAuth()
  const [perfil, setPerfil] = useState<AdminPerfil | null>(null)
  const [tenantNome, setTenantNome] = useState('')
  const [resolvendo, setResolvendo] = useState(false)
  const [erroPerfil, setErroPerfil] = useState('')

  const rotaLivre = ROTAS_LIVRES.some((r) => pathname.startsWith(r))

  useEffect(() => {
    if (!session || rotaLivre) return
    setResolvendo(true)
    setErroPerfil('')
    const sb = getBrowserClient()
    sb.from('perfis')
      .select('user_id, tenant_id, papel, nome, email, departamento_id, ativo')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data || !data.tenant_id) {
          setErroPerfil('Sua conta não está vinculada a nenhum site. Contate o administrador.')
          setResolvendo(false)
          return
        }
        if (data.ativo === false) {
          setErroPerfil('Seu acesso foi desativado. Contate o administrador.')
          setResolvendo(false)
          return
        }
        setPerfil(data as AdminPerfil)
        const { data: cfg } = await sb
          .from('tenant_config').select('nome').eq('tenant_id', data.tenant_id).maybeSingle()
        setTenantNome(cfg?.nome ?? 'Painel')
        setResolvendo(false)
      })
  }, [session, rotaLivre])

  if (rotaLivre) return <>{children}</>

  if (loading) return <FullscreenSpinner />

  if (!session) {
    return (
      <AuthCard
        title="Painel Administrativo"
        subtitle="Acesso restrito"
        icon={<Settings className="w-7 h-7" />}
        recoveryRedirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/admin/redefinir-senha`}
        onSignIn={signIn}
        onSendRecovery={sendRecovery}
      />
    )
  }

  if (erroPerfil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-xl p-8">
          <p className="font-bold text-gray-800">Sem acesso ao painel</p>
          <p className="text-sm text-gray-500 mt-2">{erroPerfil}</p>
          <button
            onClick={() => getBrowserClient().auth.signOut()}
            className="mt-5 h-11 px-5 bg-primary text-white font-semibold rounded-xl hover:opacity-90"
          >
            Sair
          </button>
        </div>
      </div>
    )
  }

  if (resolvendo || !perfil) return <FullscreenSpinner />

  return (
    <AdminAuthProvider session={session} perfil={perfil} tenantNome={tenantNome}>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  )
}

function FullscreenSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  )
}
