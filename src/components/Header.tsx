'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Menu, X, ChevronDown,
  // Institucional
  BookOpen, MessageSquare, GalleryHorizontal, Landmark, ScrollText,
  // Associados
  Users, UserPlus, UserCheck,
  // Currículos
  FilePlus, Search, Briefcase, SearchCheck,
  // Serviços (keyword map)
  GraduationCap, Scale, Gift, HeartPulse, DollarSign,
  BarChart3, Smile, ShieldCheck, CreditCard, Sparkles, Scissors,
  // outros
  type LucideIcon,
} from 'lucide-react'
import { useTenant } from '@/components/TenantProvider'
import { INSTITUCIONAL, ASSOCIADOS_MENU, CURRICULOS_MENU } from '@/lib/constants'
import Logo from '@/components/Logo'

// ── ícones por slug exato ──────────────────────────────────────────────────
const INST_ICONS: Record<string, LucideIcon> = {
  'institucional/historia':                 BookOpen,
  'institucional/palavra-do-presidente':    MessageSquare,
  'institucional/galeria-de-presidentes':   GalleryHorizontal,
  'institucional/diretoria':                Landmark,
  'institucional/convencoes':               ScrollText,
}

const ASSOC_ICONS: Record<string, LucideIcon> = {
  'associados':          Users,
  'associados#novos':    UserPlus,
  'contato':             UserCheck,
}

const CURR_ICONS: Record<string, LucideIcon> = {
  'curriculos/cadastrar': FilePlus,
  'curriculos':           Search,
  'vagas/cadastrar':      Briefcase,
  'vagas':                SearchCheck,
}

// ── ícones de serviço por palavras-chave no slug ───────────────────────────
function servicoIcon(slug: string): LucideIcon {
  if (/treinamento|qualific|curso/.test(slug))  return GraduationCap
  if (/juridic|assessoria/.test(slug))           return Scale
  if (/beneficio/.test(slug))                    return Gift
  if (/saude/.test(slug))                        return HeartPulse
  if (/financeira/.test(slug))                   return DollarSign
  if (/pessoas/.test(slug))                      return Users
  if (/planejamento/.test(slug))                 return BarChart3
  if (/odontol/.test(slug))                      return Smile
  if (/regulariza|certific/.test(slug))          return ShieldCheck
  if (/credito/.test(slug))                      return CreditCard
  if (/corte|tesoura|beleza/.test(slug))         return Scissors
  return Sparkles
}

// ── item de dropdown reutilizável ──────────────────────────────────────────
function DropItem({
  href, label, icon: Icon, color = 'primary', onClick,
}: {
  href: string; label: string; icon: LucideIcon; color?: 'primary' | 'secondary'; onClick?: () => void
}) {
  return (
    <Link
      href={`/${href}`}
      onClick={onClick}
      className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm text-text
                 hover:bg-bg-alt hover:text-primary transition-colors group"
    >
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition
          ${color === 'secondary'
            ? 'bg-secondary/10 group-hover:bg-secondary/20'
            : 'bg-primary/10 group-hover:bg-primary/15'}`}
      >
        <Icon className={`w-4 h-4 ${color === 'secondary' ? 'text-secondary' : 'text-primary'}`} />
      </span>
      <span className="leading-snug">{label}</span>
    </Link>
  )
}

// ── item de menu mobile reutilizável ───────────────────────────────────────
function MobileItem({
  href, label, icon: Icon, color = 'primary', onClick,
}: {
  href: string; label: string; icon: LucideIcon; color?: 'primary' | 'secondary'; onClick?: () => void
}) {
  return (
    <Link
      href={`/${href}`}
      onClick={onClick}
      className="flex items-center gap-3 px-8 py-2.5 text-sm text-text hover:bg-bg-alt hover:text-primary transition-colors"
    >
      <span
        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0
          ${color === 'secondary' ? 'bg-secondary/10' : 'bg-primary/10'}`}
      >
        <Icon className={`w-3.5 h-3.5 ${color === 'secondary' ? 'text-secondary' : 'text-primary'}`} />
      </span>
      {label}
    </Link>
  )
}

export default function Header() {
  const { config, servicos } = useTenant()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [instOpen, setInstOpen] = useState(false)
  const [assocOpen, setAssocOpen] = useState(false)
  const [curriculosOpen, setCurriculosOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-[70] bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center">
          <Logo
            className="h-14 md:h-16 w-auto"
            logoUrl={config.logo_url}
            nome={config.nome}
            tagline={config.tagline}
          />
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/" className="px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
            Home
          </Link>

          {/* Serviços */}
          <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
              Serviços <ChevronDown className="w-4 h-4" />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 w-88 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                <p className="px-5 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Nossos serviços</p>
                {servicos.map((s) => (
                  <DropItem
                    key={s.slug}
                    href={s.slug}
                    label={s.nome}
                    icon={servicoIcon(s.slug)}
                    onClick={() => setServicesOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Institucional */}
          <div className="relative" onMouseEnter={() => setInstOpen(true)} onMouseLeave={() => setInstOpen(false)}>
            <Link href="/institucional" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
              Institucional <ChevronDown className="w-4 h-4" />
            </Link>
            {instOpen && (
              <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                <p className="px-5 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Sobre o Sindibes</p>
                {INSTITUCIONAL.map((s) => (
                  <DropItem
                    key={s.slug}
                    href={s.slug}
                    label={s.nome}
                    icon={INST_ICONS[s.slug] ?? BookOpen}
                    onClick={() => setInstOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Associados */}
          <div className="relative" onMouseEnter={() => setAssocOpen(true)} onMouseLeave={() => setAssocOpen(false)}>
            <Link href="/associados" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
              Associados <ChevronDown className="w-4 h-4" />
            </Link>
            {assocOpen && (
              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                <p className="px-5 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Área do associado</p>
                {ASSOCIADOS_MENU.map((s) => (
                  <DropItem
                    key={s.slug}
                    href={s.slug}
                    label={s.nome}
                    icon={ASSOC_ICONS[s.slug] ?? Users}
                    color="secondary"
                    onClick={() => setAssocOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Currículos */}
          <div className="relative" onMouseEnter={() => setCurriculosOpen(true)} onMouseLeave={() => setCurriculosOpen(false)}>
            <Link href="/curriculos" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">
              Currículos <ChevronDown className="w-4 h-4" />
            </Link>
            {curriculosOpen && (
              <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                <p className="px-5 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Talentos e vagas</p>
                {CURRICULOS_MENU.map((s) => (
                  <DropItem
                    key={s.slug}
                    href={s.slug}
                    label={s.nome}
                    icon={CURR_ICONS[s.slug] ?? Search}
                    onClick={() => setCurriculosOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>

          <Link href="/eventos"   className="px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">Eventos</Link>
          <Link href="/parceiros" className="px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">Parceiros</Link>
          <Link href="/blog"      className="px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">Blog</Link>
          <Link href="/contato"   className="px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors">Contato</Link>
          <Link href="/contato"
            className="ml-3 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors">
            Fale Conosco
          </Link>
        </nav>

        {/* ── Hamburguer ── */}
        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 pb-4 max-h-[80vh] overflow-y-auto">
          <Link href="/" className="block px-6 py-3 text-sm font-medium hover:bg-bg-alt" onClick={closeMobile}>Home</Link>

          <div className="px-6 py-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Serviços</span>
          </div>
          {servicos.map((s) => (
            <MobileItem key={s.slug} href={s.slug} label={s.nome} icon={servicoIcon(s.slug)} onClick={closeMobile} />
          ))}

          <div className="px-6 py-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Institucional</span>
          </div>
          {INSTITUCIONAL.map((s) => (
            <MobileItem key={s.slug} href={s.slug} label={s.nome} icon={INST_ICONS[s.slug] ?? BookOpen} onClick={closeMobile} />
          ))}

          <div className="px-6 py-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Associados</span>
          </div>
          {ASSOCIADOS_MENU.map((s) => (
            <MobileItem key={s.slug} href={s.slug} label={s.nome} icon={ASSOC_ICONS[s.slug] ?? Users} color="secondary" onClick={closeMobile} />
          ))}

          <div className="px-6 py-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Currículos</span>
          </div>
          {CURRICULOS_MENU.map((s) => (
            <MobileItem key={s.slug} href={s.slug} label={s.nome} icon={CURR_ICONS[s.slug] ?? Search} onClick={closeMobile} />
          ))}

          <Link href="/eventos"   className="block px-6 py-3 text-sm font-medium hover:bg-bg-alt" onClick={closeMobile}>Eventos</Link>
          <Link href="/parceiros" className="block px-6 py-3 text-sm font-medium hover:bg-bg-alt" onClick={closeMobile}>Parceiros</Link>
          <Link href="/blog"      className="block px-6 py-3 text-sm font-medium hover:bg-bg-alt" onClick={closeMobile}>Blog</Link>
          <Link href="/contato"   className="block px-6 py-3 text-sm font-medium hover:bg-bg-alt" onClick={closeMobile}>Contato</Link>
          <div className="px-6 pt-2">
            <Link href="/contato" onClick={closeMobile}
              className="block text-center py-3 text-sm font-semibold text-white bg-primary rounded-xl">
              Fale Conosco
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
