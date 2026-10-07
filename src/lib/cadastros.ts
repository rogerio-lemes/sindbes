/**
 * Cadastros de parceiros e associados guardados no banco.
 *
 * Fluxo: o formulário do site cria o registro como "pendente" (invisível ao
 * público). No painel o admin revisa, edita e muda o status para "publicado";
 * só então a página entra no ar. O banco mantém `ativo = (status = 'publicado')`
 * por gatilho, e a leitura pública só enxerga linhas com ativo = true.
 *
 * Dados sensíveis (CPF/CNPJ, responsável, mensagem) ficam em
 * `cadastros_privados`, que só o admin do tenant lê.
 */
import type { Parceiro } from '@/lib/parceiros'
import type { Associado } from '@/lib/associados'

export type StatusCadastro = 'pendente' | 'publicado' | 'oculto' | 'reprovado'

export const STATUS_ROTULO: Record<StatusCadastro, string> = {
  pendente: 'Aguardando análise',
  publicado: 'Publicado',
  oculto: 'Fora do ar',
  reprovado: 'Reprovado',
}

export interface RedeCadastro { tipo: string; url: string }

export interface EnderecoCadastro {
  rua?: string; numero?: string; complemento?: string
  bairro?: string; cidade?: string; uf?: string; cep?: string
}

/** Linha da tabela `parceiros`. */
export interface ParceiroRow {
  id: string
  tenant_id: string
  nome: string
  slug: string
  categoria: string | null
  resumo: string | null
  /** Parágrafos separados por linha em branco */
  descricao: string | null
  servicos: string[]
  beneficio_associados: string | null
  foto_capa_url: string | null
  logo_url: string | null
  fotos: string[]
  site_url: string | null
  whatsapp: string | null
  whatsapp_display: string | null
  telefone: string | null
  email: string | null
  instagram: string | null
  redes: RedeCadastro[]
  endereco: EnderecoCadastro
  destaque: boolean
  ativo: boolean
  status: StatusCadastro
  origem: string
  analisado_em: string | null
  created_at: string
  updated_at: string
}

/** Linha da tabela `associados`. */
export interface AssociadoRow {
  id: string
  tenant_id: string
  nome: string
  slug: string
  categoria: string | null
  descricao: string | null
  /** Endereço em uma linha, pronto para exibir */
  endereco: string | null
  endereco_detalhe: EnderecoCadastro
  cidade: string | null
  bairro: string | null
  whatsapp: string | null
  telefone: string | null
  telefone_display: string | null
  email: string | null
  instagram: string | null
  site_url: string | null
  horario: string | null
  google_maps_url: string | null
  foto_capa_url: string | null
  fotos: string[]
  redes: RedeCadastro[]
  destaque: boolean
  novo: boolean
  ativo: boolean
  status: StatusCadastro
  origem: string
  analisado_em: string | null
  created_at: string
  updated_at: string
}

/** Linha da tabela `cadastros_privados` (somente admin). */
export interface CadastroPrivadoRow {
  id: string
  tenant_id: string
  tipo: 'parceiro' | 'associado'
  registro_id: string
  responsavel: { nome?: string; cargo?: string; telefone?: string; email?: string }
  documento: string | null
  mensagem: string | null
  created_at: string
}

/** Imagem usada quando o cadastro chega sem foto de capa. */
export const CAPA_PADRAO = '/images/equipe.jpg'

const soDigitos = (s?: string | null) => (s || '').replace(/\D/g, '')

/** WhatsApp no formato 55DDDNUMERO, como as páginas esperam. */
export function normalizarWhatsapp(s?: string | null) {
  const d = soDigitos(s)
  if (!d) return ''
  return d.startsWith('55') ? d : `55${d}`
}

export function enderecoEmLinha(e?: EnderecoCadastro | null) {
  if (!e) return ''
  const rua = [e.rua, e.numero].filter(Boolean).join(', ')
  const cidade = [e.cidade, e.uf].filter(Boolean).join(' - ')
  return [rua, e.complemento, e.bairro, cidade].filter(Boolean).join(' - ')
}

const paragrafos = (s?: string | null) =>
  (s || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

/** Converte a linha do banco no formato que a página pública de parceiro usa. */
export function parceiroDaLinha(r: ParceiroRow): Parceiro {
  return {
    slug: r.slug,
    nome: r.nome,
    categoria: r.categoria || 'Parceiro',
    resumo: r.resumo || '',
    descricao: paragrafos(r.descricao),
    servicos: Array.isArray(r.servicos) ? r.servicos : [],
    desconto: r.beneficio_associados || '',
    capa: r.foto_capa_url || CAPA_PADRAO,
    fotos: Array.isArray(r.fotos) ? r.fotos : [],
    redes: Array.isArray(r.redes) ? r.redes : [],
    endereco: r.endereco || {},
    site: r.site_url ? r.site_url.replace(/^https?:\/\//, '').replace(/\/$/, '') : undefined,
    siteUrl: r.site_url || undefined,
    whatsapp: normalizarWhatsapp(r.whatsapp) || undefined,
    whatsappDisplay: r.whatsapp_display || r.telefone || undefined,
    destaque: r.destaque,
  }
}

/** Converte a linha do banco no formato que a página pública de associado usa. */
export function associadoDaLinha(r: AssociadoRow): Associado {
  const endereco = r.endereco || enderecoEmLinha(r.endereco_detalhe)
  return {
    slug: r.slug,
    nome: r.nome,
    categoria: r.categoria || 'Associado',
    descricao: r.descricao || '',
    capa: r.foto_capa_url || CAPA_PADRAO,
    fotos: Array.isArray(r.fotos) ? r.fotos : [],
    endereco,
    telefoneDisplay: r.telefone_display || r.telefone || '',
    whatsapp: normalizarWhatsapp(r.whatsapp || r.telefone),
    instagram: r.instagram || undefined,
    email: r.email || undefined,
    horario: r.horario || '',
    mapsQuery: endereco || [r.bairro, r.cidade].filter(Boolean).join(', '),
    novo: r.novo,
    desde: new Date(r.created_at).getFullYear().toString(),
  }
}
