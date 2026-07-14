export interface Parceiro {
  slug: string
  nome: string
  categoria: string
  resumo: string
  descricao: string[]
  servicos: string[]
  desconto: string
  capa: string
  site?: string
  siteUrl?: string
  whatsapp?: string
  whatsappDisplay?: string
  destaque?: boolean
  exemplo?: boolean
}

export const PARCEIROS: Parceiro[] = [
  {
    slug: 'mercado-open',
    nome: 'Mercado Open',
    categoria: 'Agência de Marketing Digital',
    resumo: 'Agência parceira do Sindbes especializada em tráfego, sites e Google Meu Negócio — com desconto exclusivo para associados.',
    descricao: [
      'A Mercado Open é a agência de marketing digital parceira oficial do Sindbes, dedicada a fazer o seu negócio da beleza ser encontrado, escolhido e lembrado na internet.',
      'Com estratégias sob medida para salões, barbearias, esmalterias e clínicas de estética, a Mercado Open une tráfego, presença local e tecnologia para atrair mais clientes e aumentar o faturamento do seu negócio.',
      'Como parceira do Sindbes, a Mercado Open oferece condições e descontos exclusivos para todos os associados. Fale com a equipe e descubra como colocar o seu negócio na frente da concorrência.',
    ],
    servicos: [
      'Tráfego orgânico (SEO) — apareça no Google sem pagar por clique',
      'Tráfego pago (Google Ads e Meta Ads) — clientes prontos para agendar',
      'Desenvolvimento de sites profissionais e otimizados',
      'Gestão profissional do Google Meu Negócio',
    ],
    desconto: 'Desconto exclusivo para associados Sindbes',
    capa: '/images/parceiro-mercadoopen.jpg',
    site: 'mercadoopen.com.br',
    siteUrl: 'https://www.mercadoopen.com.br',
    whatsapp: '5534988634055',
    whatsappDisplay: '(34) 98863-4055',
    destaque: true,
  },
  // ⚠️ Exemplos demonstrativos — substituir/adicionar parceiros reais no painel.
  {
    slug: 'distribuidora-de-cosmeticos',
    nome: 'Distribuidora Parceira',
    categoria: 'Cosméticos e Produtos Profissionais',
    resumo: 'Produtos profissionais de beleza com preços especiais para associados do Sindbes.',
    descricao: [
      'Distribuidora de cosméticos e produtos profissionais parceira do Sindbes, com portfólio completo para salões, barbearias e clínicas de estética.',
      'Associados do Sindbes contam com condições comerciais diferenciadas na compra de produtos e materiais.',
    ],
    servicos: ['Cosméticos profissionais', 'Materiais e descartáveis', 'Condições especiais para associados'],
    desconto: 'Preços especiais para associados Sindbes',
    capa: '/images/parceiro-cosmeticos.jpg',
    exemplo: true,
  },
  {
    slug: 'escola-de-capacitacao',
    nome: 'Escola Parceira de Capacitação',
    categoria: 'Cursos e Formação Profissional',
    resumo: 'Cursos e formações para profissionais da beleza com desconto para associados do Sindbes.',
    descricao: [
      'Escola parceira do Sindbes oferecendo cursos e formações nas principais áreas da beleza e estética.',
      'Associados do Sindbes têm desconto nas matrículas e acesso a turmas exclusivas.',
    ],
    servicos: ['Cursos técnicos de beleza e estética', 'Workshops e capacitações', 'Certificados reconhecidos'],
    desconto: 'Desconto na matrícula para associados Sindbes',
    capa: '/images/parceiro-escola.jpg',
    exemplo: true,
  },
]

export function getParceiro(slug: string) {
  return PARCEIROS.find((p) => p.slug === slug)
}
