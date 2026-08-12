'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getBrowserClient } from '@/lib/supabase/browser'

export interface AdminPerfil {
  user_id: string
  tenant_id: string | null
  papel: string
  nome: string | null
  email: string | null
  departamento_id: string | null
  ativo: boolean | null
}

interface AdminAuthValue {
  session: Session
  perfil: AdminPerfil
  tenantId: string
  tenantNome: string
  /** Chaves de permissão do departamento. Vazio quando o perfil tem acesso total. */
  permissoes: Set<string>
  /** true quando o perfil ignora o filtro de permissões (super admin ou sem departamento) */
  acessoTotal: boolean
  canAccess: (chave: string) => boolean
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider')
  return ctx
}

/** Atalho para checar permissão sem desestruturar o contexto inteiro. */
export function usePermissions() {
  const { canAccess, permissoes, acessoTotal } = useAdminAuth()
  return { canAccess, permissoes, acessoTotal }
}

export function AdminAuthProvider({
  session, perfil, tenantNome, children,
}: {
  session: Session
  perfil: AdminPerfil
  tenantNome: string
  children: React.ReactNode
}) {
  const [permissoes, setPermissoes] = useState<Set<string>>(new Set())
  const acessoTotal = perfil.papel === 'super_admin' || !perfil.departamento_id

  useEffect(() => {
    if (acessoTotal || !perfil.departamento_id) return
    getBrowserClient()
      .from('departamento_permissoes')
      .select('permissao_chave')
      .eq('departamento_id', perfil.departamento_id)
      .then(({ data }) => setPermissoes(new Set((data ?? []).map((d) => d.permissao_chave as string))))
  }, [perfil.departamento_id, acessoTotal])

  const value: AdminAuthValue = {
    session,
    perfil,
    tenantId: perfil.tenant_id!,
    tenantNome,
    permissoes,
    acessoTotal,
    canAccess: (chave) => acessoTotal || permissoes.has(chave),
    signOut: async () => { await getBrowserClient().auth.signOut() },
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
