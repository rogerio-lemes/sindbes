import {
  LayoutDashboard, Palette, Briefcase, Images, Users2, Calendar,
  Building2, Handshake, Megaphone, Inbox, GraduationCap, Users, ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

export interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
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
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, permissao: null },
    ],
  },
  {
    titulo: 'Conteúdo do site',
    itens: [
      { label: 'Marca e identidade', href: '/admin/marca', icon: Palette, permissao: 'marca.ver' },
      { label: 'Serviços', href: '/admin/servicos', icon: Briefcase, permissao: 'servicos.ver' },
      { label: 'Vitrine da home', href: '/admin/vitrine', icon: Images, permissao: 'vitrine.ver' },
      { label: 'Diretoria', href: '/admin/diretoria', icon: Users2, permissao: 'diretoria.ver' },
      { label: 'Eventos', href: '/admin/eventos', icon: Calendar, permissao: 'eventos.ver' },
    ],
  },
  {
    titulo: 'Rede',
    itens: [
      { label: 'Associados', href: '/admin/associados', icon: Building2, permissao: 'associados.ver' },
      { label: 'Parceiros', href: '/admin/parceiros', icon: Handshake, permissao: 'parceiros.ver' },
      { label: 'Afiliados', href: '/admin/afiliados', icon: Users, permissao: 'afiliados.ver' },
    ],
  },
  {
    titulo: 'Monetização',
    itens: [
      { label: 'Banners de anunciantes', href: '/admin/banners', icon: Megaphone, permissao: 'banners.ver' },
    ],
  },
  {
    titulo: 'Relacionamento',
    itens: [
      { label: 'Leads', href: '/admin/leads', icon: Inbox, permissao: 'leads.ver' },
      { label: 'Recrutamento', href: '/admin/recrutamento', icon: GraduationCap, permissao: 'recrutamento.ver' },
    ],
  },
  {
    titulo: 'Administração',
    itens: [
      { label: 'Usuários e departamentos', href: '/admin/usuarios', icon: Users, permissao: 'usuarios.ver' },
      { label: 'Permissões', href: '/admin/configuracoes/permissoes', icon: ShieldCheck, permissao: 'permissoes.editar' },
    ],
  },
]
