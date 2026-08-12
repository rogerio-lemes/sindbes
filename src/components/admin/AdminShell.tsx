'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Eye, Menu, X } from 'lucide-react'
import { useAdminAuth } from './AdminAuthProvider'
import { MENU } from './menu'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { tenantNome, perfil, canAccess, signOut } = useAdminAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const grupos = MENU
    .map((g) => ({ ...g, itens: g.itens.filter((i) => !i.permissao || canAccess(i.permissao)) }))
    .filter((g) => g.itens.length > 0)

  const nav = (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {grupos.map((grupo) => (
        <div key={grupo.titulo}>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {grupo.titulo}
          </p>
          <ul className="space-y-0.5">
            {grupo.itens.map((item) => {
              const ativo = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      ativo
                        ? 'bg-primary text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
              {tenantNome?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm block leading-tight truncate">{tenantNome}</span>
              <span className="text-xs text-gray-400">Painel administrativo</span>
            </div>
          </div>
        </div>
        {nav}
        <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
          <p className="px-3 pb-1 text-xs text-gray-400 truncate">{perfil.nome || perfil.email}</p>
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
            <Eye className="w-4 h-4" /> Ver site
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85%] bg-white flex flex-col h-full">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-sm truncate">{tenantNome}</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {nav}
            <div className="px-3 py-3 border-t border-gray-100">
              <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600">
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
          <button onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-bold text-sm truncate">{tenantNome}</span>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1200px]">{children}</main>
      </div>
    </div>
  )
}
