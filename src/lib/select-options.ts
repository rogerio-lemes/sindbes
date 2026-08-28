// Opções para os selects customizados — cada item tem label, value e ícone Lucide
// Usadas em CurriculoForm, VagaForm, FormParceiro, FormAssociado e ExitPopup
import {
  Scissors, Palette, Leaf, Gem, Sparkles, Heart, Paintbrush, Eye, Pen,
  Feather, FlaskConical, Camera, Headphones, BarChart2, UserPlus,
  TrendingUp, Zap, Award, Trophy,
  Briefcase, UserCheck, Globe, CalendarDays, BadgePercent, GraduationCap,
  Megaphone, Package, Stethoscope, CreditCard, Monitor, Scale,
  Settings2, MapPin,
  // Redes sociais — lucide não tem ícones de marcas; usamos os mais representativos
  Image, Users, Music2, Play, Bird, Link2, Bookmark, MessageCircle,
} from 'lucide-react'
import type { SelectOption } from '@/components/ui/CustomSelect'

// ── Funções / Área de atuação ────────────────────────────────────────────────
export const FUNCOES_OPTIONS: SelectOption[] = [
  { value: 'Cabeleireiro(a)',                    label: 'Cabeleireiro(a)',                    icon: Scissors },
  { value: 'Barbeiro(a)',                        label: 'Barbeiro(a)',                        icon: Scissors,    color: 'secondary' },
  { value: 'Colorista',                          label: 'Colorista',                          icon: Palette },
  { value: 'Terapeuta Capilar',                  label: 'Terapeuta Capilar',                  icon: Leaf },
  { value: 'Manicure e Pedicure',                label: 'Manicure e Pedicure',                icon: Gem,         color: 'secondary' },
  { value: 'Nail Designer (alongamento)',         label: 'Nail Designer (alongamento)',         icon: Gem },
  { value: 'Esteticista Facial',                 label: 'Esteticista Facial',                 icon: Sparkles,    color: 'secondary' },
  { value: 'Esteticista Corporal',               label: 'Esteticista Corporal',               icon: Heart },
  { value: 'Maquiador(a)',                       label: 'Maquiador(a)',                       icon: Paintbrush,  color: 'secondary' },
  { value: 'Designer de Sobrancelhas',           label: 'Designer de Sobrancelhas',           icon: Eye },
  { value: 'Lash Designer (extensão de cílios)', label: 'Lash Designer (extensão de cílios)', icon: Eye,         color: 'secondary' },
  { value: 'Micropigmentador(a)',                label: 'Micropigmentador(a)',                icon: Pen },
  { value: 'Depilador(a)',                       label: 'Depilador(a)',                       icon: Feather,     color: 'secondary' },
  { value: 'Massoterapeuta',                     label: 'Massoterapeuta',                     icon: Heart,       color: 'secondary' },
  { value: 'Podólogo(a)',                        label: 'Podólogo(a)',                        icon: FlaskConical },
  { value: 'Cosmetólogo(a)',                     label: 'Cosmetólogo(a)',                     icon: FlaskConical, color: 'secondary' },
  { value: 'Visagista',                          label: 'Visagista',                          icon: Camera },
  { value: 'Recepcionista de Salão',             label: 'Recepcionista de Salão',             icon: Headphones,  color: 'secondary' },
  { value: 'Gerente de Salão',                   label: 'Gerente de Salão',                   icon: BarChart2 },
  { value: 'Auxiliar / Assistente de Beleza',    label: 'Auxiliar / Assistente de Beleza',    icon: UserPlus,    color: 'secondary' },
]

// ── Níveis de experiência ────────────────────────────────────────────────────
export const EXPERIENCIA_OPTIONS: SelectOption[] = [
  { value: 'Iniciante',       label: 'Iniciante',       icon: TrendingUp },
  { value: 'De 1 a 3 anos',  label: 'De 1 a 3 anos',  icon: Zap,    color: 'secondary' },
  { value: 'De 3 a 5 anos',  label: 'De 3 a 5 anos',  icon: Award },
  { value: 'Mais de 5 anos', label: 'Mais de 5 anos', icon: Trophy, color: 'secondary' },
]

// ── Tipos de contrato ────────────────────────────────────────────────────────
export const CONTRATO_OPTIONS: SelectOption[] = [
  { value: 'CLT',             label: 'CLT',             icon: Briefcase },
  { value: 'Autônomo(a)',     label: 'Autônomo(a)',     icon: UserCheck,     color: 'secondary' },
  { value: 'Freelancer',      label: 'Freelancer',      icon: Globe },
  { value: 'Diarista',        label: 'Diarista',        icon: CalendarDays,  color: 'secondary' },
  { value: 'Comissionado(a)', label: 'Comissionado(a)', icon: BadgePercent },
  { value: 'Estágio',         label: 'Estágio',         icon: GraduationCap, color: 'secondary' },
]

// ── Categorias de parceiros ──────────────────────────────────────────────────
export const CATEGORIA_OPTIONS: SelectOption[] = [
  { value: 'Agência de Marketing Digital',        label: 'Agência de Marketing Digital',        icon: Megaphone },
  { value: 'Cosméticos e Produtos Profissionais', label: 'Cosméticos e Produtos Profissionais', icon: Package,      color: 'secondary' },
  { value: 'Cursos e Formação Profissional',      label: 'Cursos e Formação Profissional',      icon: GraduationCap },
  { value: 'Saúde / Odontologia',                 label: 'Saúde / Odontologia',                 icon: Stethoscope,  color: 'secondary' },
  { value: 'Financeiro / Crédito',                label: 'Financeiro / Crédito',                icon: CreditCard },
  { value: 'Equipamentos e Mobiliário',           label: 'Equipamentos e Mobiliário',           icon: Monitor,      color: 'secondary' },
  { value: 'Tecnologia / Software',               label: 'Tecnologia / Software',               icon: Monitor },
  { value: 'Contabilidade / Jurídico',            label: 'Contabilidade / Jurídico',            icon: Scale,        color: 'secondary' },
  { value: 'Outros',                              label: 'Outros',                              icon: Settings2 },
]

// ── Estados do Brasil ────────────────────────────────────────────────────────
const ESTADOS_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]
export const UF_OPTIONS: SelectOption[] = ESTADOS_LIST.map((uf, i) => ({
  value: uf,
  label: uf,
  icon: MapPin,
  color: (i % 2 === 0 ? 'primary' : 'secondary') as 'primary' | 'secondary',
}))

// ── Redes sociais ────────────────────────────────────────────────────────────
export const REDES_OPTIONS: SelectOption[] = [
  { value: 'instagram', label: 'Instagram',   icon: Image,          color: 'secondary' },
  { value: 'facebook',  label: 'Facebook',    icon: Users },
  { value: 'tiktok',    label: 'TikTok',      icon: Music2,         color: 'secondary' },
  { value: 'youtube',   label: 'YouTube',     icon: Play },
  { value: 'twitter',   label: 'X / Twitter', icon: Bird,           color: 'secondary' },
  { value: 'linkedin',  label: 'LinkedIn',    icon: Link2 },
  { value: 'pinterest', label: 'Pinterest',   icon: Bookmark,       color: 'secondary' },
  { value: 'whatsapp',  label: 'WhatsApp',    icon: MessageCircle },
]
