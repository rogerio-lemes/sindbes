'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { SITE, SERVICES, INSTITUCIONAL, ASSOCIADOS_MENU, CURRICULOS_MENU } from '@/lib/constants'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [instOpen, setInstOpen] = useState(false)
  const [assocOpen, setAssocOpen] = useState(false)
  const [curriculosOpen, setCurriculosOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div>
            <span className="font-bold text-primary text-lg leading-tight block">{SITE.shortName}</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-500 leading-tight">Sindicato da Beleza</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/" className="px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
            Home
          </Link>

          <div
            className="relative group"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
              Serviços <ChevronDown className="w-4 h-4" />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="block px-4 py-2.5 text-sm text-text hover:bg-bg-alt hover:text-primary transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    {s.nome}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative group"
            onMouseEnter={() => setInstOpen(true)}
            onMouseLeave={() => setInstOpen(false)}
          >
            <Link href="/institucional" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
              Institucional <ChevronDown className="w-4 h-4" />
            </Link>
            {instOpen && (
              <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                {INSTITUCIONAL.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="block px-4 py-2.5 text-sm text-text hover:bg-bg-alt hover:text-primary transition-colors"
                    onClick={() => setInstOpen(false)}
                  >
                    {s.nome}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative group"
            onMouseEnter={() => setAssocOpen(true)}
            onMouseLeave={() => setAssocOpen(false)}
          >
            <Link href="/associados" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
              Associados <ChevronDown className="w-4 h-4" />
            </Link>
            {assocOpen && (
              <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                {ASSOCIADOS_MENU.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="block px-4 py-2.5 text-sm text-text hover:bg-bg-alt hover:text-primary transition-colors"
                    onClick={() => setAssocOpen(false)}
                  >
                    {s.nome}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative group"
            onMouseEnter={() => setCurriculosOpen(true)}
            onMouseLeave={() => setCurriculosOpen(false)}
          >
            <Link href="/curriculos" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
              Currículos <ChevronDown className="w-4 h-4" />
            </Link>
            {curriculosOpen && (
              <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                {CURRICULOS_MENU.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="block px-4 py-2.5 text-sm text-text hover:bg-bg-alt hover:text-primary transition-colors"
                    onClick={() => setCurriculosOpen(false)}
                  >
                    {s.nome}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" className="px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/contato" className="px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
            Contato
          </Link>
          <Link
            href="/contato"
            className="ml-3 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors"
          >
            Fale Conosco
          </Link>
        </nav>

        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 pb-4">
          <Link
            href="/"
            className="block px-6 py-3 text-sm font-medium hover:bg-bg-alt"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <div className="px-6 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Serviços</span>
          </div>
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="block px-8 py-2.5 text-sm hover:bg-bg-alt hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {s.nome}
            </Link>
          ))}
          <div className="px-6 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Institucional</span>
          </div>
          {INSTITUCIONAL.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="block px-8 py-2.5 text-sm hover:bg-bg-alt hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {s.nome}
            </Link>
          ))}
          <div className="px-6 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Associados</span>
          </div>
          {ASSOCIADOS_MENU.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="block px-8 py-2.5 text-sm hover:bg-bg-alt hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {s.nome}
            </Link>
          ))}
          <div className="px-6 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Currículos</span>
          </div>
          {CURRICULOS_MENU.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="block px-8 py-2.5 text-sm hover:bg-bg-alt hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {s.nome}
            </Link>
          ))}
          <Link
            href="/blog"
            className="block px-6 py-3 text-sm font-medium hover:bg-bg-alt"
            onClick={() => setMobileOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/contato"
            className="block px-6 py-3 text-sm font-medium hover:bg-bg-alt"
            onClick={() => setMobileOpen(false)}
          >
            Contato
          </Link>
          <div className="px-6 pt-2">
            <Link
              href="/contato"
              className="block text-center py-3 text-sm font-semibold text-white bg-primary rounded-xl"
              onClick={() => setMobileOpen(false)}
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
