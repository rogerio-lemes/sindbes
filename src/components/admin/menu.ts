import {
  LayoutDashboard, Palette, Briefcase, Images, Users2, Calendar,
  Building2, Handshake, Megaphone, Inbox, GraduationCap, Users, ShieldCheck, Bot,
  type LucideIcon,
} from 'lucide-react'

export interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
  /** Cor do ícone quando o item não está selecionado */
  cor: string
  /** null = visível para qualquer usuário autenticado do painel */
  permissao: string | null
}

export interface MenuGroup {
  titulo: string
  itens: MenuItem[]
}

export const MENU: MenuGroup[] = [
  {
    titulo: 'Visão geral',
    itens: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, cor: 'text-primary', permissao: null },
    ],
  },
  {
    titulo: 'Conteúdo do site',
    itens: [
      { label: 'Marca e identidade', href: '/admin/marca', icon: Palette, cor: 'text-pink-500', permissao: 'marca.ver' },
      { label: 'Serviços', href: '/admin/servicos', icon: Briefcase, cor: 'text-blue-500', permissao: 'servicos.ver' },
      { label: 'Vitrine da home', href: '/admin/vitrine', icon: Images, cor: 'text-amber-500', permissao: 'vitrine.ver' },
      { label: 'Diretoria', href: '/admin/diretoria', icon: Users2, cor: 'text-indigo-500', permissao: 'diretoria.ver' },
      { label: 'Eventos', href: '/admin/eventos', icon: Calendar, cor: 'text-orange-500', permissao: 'eventos.ver' },
    ],
  },
  {
    titulo: 'Rede',
    itens: [
      { label: 'Associados', href: '/admin/associados', icon: Building2, cor: 'text-emerald-500', permissao: 'associados.ver' },
      { label: 'Parceiros', href: '/admin/parceiros', icon: Handshake, cor: 'text-teal-500', permissao: 'parceiros.ver' },
      { label: 'Afiliados', href: '/admin/afiliados', icon: Users, cor: 'text-secondary', permissao: 'afiliados.ver' },
    ],
  },
  {
    titulo: 'Monetização',
    itens: [
      { label: 'Banners de anunciantes', href: '/admin/banners', icon: Megaphone, cor: 'text-yellow-600', permissao: 'banners.ver' },
    ],
  },
  {
    titulo: 'Relacionamento',
    itens: [
      { label: 'Leads', href: '/admin/leads', icon: Inbox, cor: 'text-sky-500', permissao: 'leads.ver' },
      { label: 'Recrutamento', href: '/admin/recrutamento', icon: GraduationCap, cor: 'text-violet-500', permissao: 'recrutamento.ver' },
      { label: 'Atendimento por IA', href: '/admin/atendimento', icon: Bot, cor: 'text-cyan-500', permissao: 'marca.ver' },
    ],
  },
  {
    titulo: 'Administração',
    itens: [
      { label: 'Usuários e departamentos', href: '/admin/usuarios', icon: Users, cor: 'text-slate-500', permissao: 'usuarios.ver' },
      { label: 'Permissões', href: '/admin/configuracoes/permissoes', icon: ShieldCheck, cor: 'text-rose-500', permissao: 'permissoes.editar' },
    ],
  },
]
