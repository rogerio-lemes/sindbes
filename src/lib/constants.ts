export const P = process.env.NEXT_PUBLIC_TABLE_PREFIX || 'sindbes_sindicato_da_bel_'

export const SITE = {
  name: 'Sindbes - Sindicato da Beleza',
  shortName: 'Sindbes',
  tagline: 'Sindicato da Beleza de Uberlândia',
  whatsapp: '5534984468553',
  whatsappDisplay: '(34) 98446-8553',
  phone: '5534984468553',
  email: 'adm.sindibes@gmail.com',
  address: 'Uberlândia, MG',
  instagram: '@sindbes',
  cnpj: '[CNPJ será inserido]',
  googleMapsUrl: 'https://maps.google.com/?q=Sindbes+Uberlândia',
  horario: 'Seg a Sex: 8h às 18h | Sáb: 8h às 12h',
}

export const COLORS = {
  primary: '#8B1A4A',
  secondary: '#D4A853',
  accent: '#F5E6D3',
  text: '#1A1A1A',
  white: '#FFFFFF',
  bgAlt: '#FAF7F4',
}

export const SERVICES = [
  { nome: 'Treinamentos e qualificações profissionais', slug: 'treinamentos-e-qualificacoes-profissionais' },
  { nome: 'Assessoria jurídica e contábil para empresas da beleza', slug: 'assessoria-juridica-e-contabil-para-empresas-da-be' },
  { nome: 'Benefícios para associados', slug: 'beneficios-para-associados' },
  { nome: 'Plano de Saúde', slug: 'plano-de-saude' },
  { nome: 'Qualificação em gestão financeira', slug: 'qualificacao-em-gestao-financeira' },
  { nome: 'Qualificação em gestão de pessoas', slug: 'qualificacao-em-gestao-de-pessoas' },
  { nome: 'Planejamento empresarial para empresas da beleza', slug: 'planejamento-empresarial-para-empresas-da-beleza' },
  { nome: 'Plano Odontológico', slug: 'plano-odontologico' },
  { nome: 'Regularização e Certificação Profissional', slug: 'regularizacao-e-certificacao-profissional' },
  { nome: 'Acesso de Crédito', slug: 'acesso-de-credito' },
]

export const BLOG_ARTICLES = [
  { titulo: 'Assessoria jurídica para salão de beleza: como escolher sem errar e evitar processos trabalhistas', slug: 'assessoria-juridica-para-salao-de-beleza-como-esco' },
  { titulo: 'Cursos área da beleza: quais sinais de que sua equipe precisa de qualificação agora', slug: 'cursos-area-da-beleza-quais-sinais-de-que-sua-equi' },
  { titulo: 'Assessoria contábil salão de beleza: quanto custa e como contratar com segurança em Uberlândia', slug: 'assessoria-contabil-salao-de-beleza-quanto-custa-e' },
  { titulo: 'O que é o Sindicato da área da beleza e por que donos de salão em Uberlândia estão se filiando', slug: 'o-que-e-o-sindicato-da-area-da-beleza-e-por-que-do' },
  { titulo: 'Qualificação beleza e estética vale a pena? O que avaliar antes de investir no seu salão', slug: 'qualificacao-beleza-e-estetica-vale-a-pena-o-que-a' },
  { titulo: 'Benefícios para associados Sindibes: passo a passo para contratar e aproveitar planos, assessoria e treinamentos', slug: 'beneficios-para-associados-sindibes-passo-a-passo-' },
]

export const INSTITUCIONAL = [
  { nome: 'História do Sindicato', slug: 'institucional/historia' },
  { nome: 'Palavra do Presidente', slug: 'institucional/palavra-do-presidente' },
  { nome: 'Galeria de Presidentes', slug: 'institucional/galeria-de-presidentes' },
  { nome: 'Diretoria 2026–2028', slug: 'institucional/diretoria' },
]

export const ASSOCIADOS_MENU = [
  { nome: 'Filiados', slug: 'associados' },
  { nome: 'Novos Associados', slug: 'associados#novos' },
  { nome: 'Seja um Filiado', slug: 'contato' },
]

export const CURRICULOS_MENU = [
  { nome: 'Cadastrar novo Currículo', slug: 'curriculos/cadastrar' },
  { nome: 'Buscar Currículos', slug: 'curriculos' },
  { nome: 'Cadastrar nova Vaga', slug: 'vagas/cadastrar' },
  { nome: 'Buscar por Vagas', slug: 'vagas' },
]

export const IMAGES = {
  hero1: '/images/hero1.jpg',
  hero2: '/images/hero2.jpg',
  hero3: '/images/hero3.jpg',
  vitrine1: '/images/vitrine1.jpg',
  vitrine2: '/images/vitrine2.jpg',
  vitrine3: '/images/vitrine3.jpg',
  atendente: '/images/atendente.jpg',
  sobre: '/images/sobre.jpg',
  contato: '/images/contato.jpg',
  diferencial1: '/images/diferencial1.jpg',
  diferencial2: '/images/diferencial2.jpg',
  diferencial3: '/images/diferencial3.jpg',
  servTreinamentos: '/images/servico-treinamentos.jpg',
  servAssessoria: '/images/servico-assessoria.jpg',
  servBeneficios: '/images/servico-beneficios.jpg',
  servPlanoSaude: '/images/servico-plano-saude.jpg',
  servGestaoFinanceira: '/images/servico-gestao-financeira.jpg',
  servGestaoPessoas: '/images/servico-gestao-pessoas.jpg',
  servPlanejamento: '/images/servico-planejamento.jpg',
  servPlanoOdonto: '/images/servico-plano-odonto.jpg',
  servRegularizacao: '/images/servico-regularizacao.jpg',
  servCredito: '/images/servico-credito.jpg',
  blog1: '/images/blog1.jpg',
  blog2: '/images/blog2.jpg',
  blog3: '/images/blog3.jpg',
  blog4: '/images/blog4.jpg',
  blog5: '/images/blog5.jpg',
  blog6: '/images/blog6.jpg',
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}
