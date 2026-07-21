// Tipos compartilhados da camada de tenant

export interface TenantConfig {
  tenant_id: string
  nome: string
  tagline: string | null
  whatsapp: string | null
  whatsapp_display: string | null
  phone: string | null
  email: string | null
  endereco: string | null
  cidade: string | null
  uf: string | null
  instagram: string | null
  cnpj: string | null
  horario: string | null
  google_maps_url: string | null
  lat: number | null
  lng: number | null
  // Cores
  cor_primaria: string
  cor_primaria_dark: string
  cor_secundaria: string
  cor_secundaria_dark: string
  cor_accent: string
  cor_text: string
  cor_bg_alt: string
  // Marca
  logo_url: string | null
  favicon_url: string | null
  // Meta SEO
  meta: Record<string, unknown>
  // Atendente
  atendente_nome: string
  atendente_foto_url: string | null
}

export interface Tenant {
  id: string
  slug: string
  nome: string
  status: string
  plano: string
}

export interface TenantWithConfig extends Tenant {
  config: TenantConfig
}

export interface Servico {
  id: string
  tenant_id: string
  nome: string
  slug: string
  seo_title: string | null
  seo_description: string | null
  descricao: string | null
  imagem_url: string | null
  ordem: number
  ativo: boolean
}

export interface Associado {
  id: string
  tenant_id: string
  nome: string
  slug: string
  categoria: string | null
  descricao: string | null
  endereco: string | null
  cidade: string | null
  bairro: string | null
  whatsapp: string | null
  telefone: string | null
  email: string | null
  instagram: string | null
  site_url: string | null
  horario: string | null
  google_maps_url: string | null
  foto_capa_url: string | null
  fotos: string[]
  destaque: boolean
  novo: boolean
  ativo: boolean
}

export interface Evento {
  id: string
  tenant_id: string
  titulo: string
  slug: string
  descricao: string | null
  data_inicio: string
  data_fim: string | null
  horario: string | null
  local_nome: string | null
  local_endereco: string | null
  tipo: string
  imagem_url: string | null
  galeria: string[]
  inscricao_aberta: boolean
  max_participantes: number | null
}

export interface Parceiro {
  id: string
  tenant_id: string
  nome: string
  slug: string
  descricao: string | null
  categoria: string | null
  logo_url: string | null
  foto_capa_url: string | null
  site_url: string | null
  whatsapp: string | null
  telefone: string | null
  email: string | null
  instagram: string | null
  beneficio_associados: string | null
  destaque: boolean
  ativo: boolean
}

export interface MembroDiretoria {
  id: string
  tenant_id: string
  nome: string
  cargo: string
  grupo: string
  foto_url: string | null
  ordem: number
  gestao: string
}

export interface Lead {
  id: string
  tenant_id: string
  nome: string | null
  telefone: string | null
  email: string | null
  mensagem: string | null
  origem: string | null
  pagina_slug: string | null
  created_at: string
}

export interface Curriculo {
  id: string
  tenant_id: string
  nome: string
  telefone: string | null
  email: string | null
  cidade: string | null
  funcao: string | null
  experiencia: string | null
  disponibilidade: string | null
  sobre: string | null
  portfolio: string | null
  ativo: boolean
  created_at: string
}

export interface Vaga {
  id: string
  tenant_id: string
  titulo: string
  funcao: string | null
  empresa: string | null
  tipo: string | null
  local_vaga: string | null
  salario: string | null
  contato: string | null
  descricao: string | null
  ativa: boolean
  created_at: string
}
