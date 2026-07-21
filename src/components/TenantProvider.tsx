'use client'

import { createContext, useContext } from 'react'
import type { TenantConfig, Servico } from '@/lib/tenant/types'

// Dados do tenant disponíveis para client components via Context
export interface TenantContextData {
  tenantId: string
  slug: string
  config: TenantConfig
  servicos: Servico[]
}

const TenantContext = createContext<TenantContextData | null>(null)

export function TenantProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: TenantContextData
}) {
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

// Hook para acessar dados do tenant em client components
export function useTenant(): TenantContextData {
  const ctx = useContext(TenantContext)
  if (!ctx) {
    throw new Error('useTenant deve ser usado dentro de <TenantProvider>')
  }
  return ctx
}

// Helpers derivados
export function useConfig(): TenantConfig {
  return useTenant().config
}

export function useWhatsappUrl(message: string): string {
  const { config } = useTenant()
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`
}
