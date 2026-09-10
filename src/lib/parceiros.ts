export interface Parceiro {
  slug: string
  nome: string
  categoria: string
  resumo: string
  descricao: string[]
  servicos: string[]
  /** Diferenciais exibidos em bloco de destaque no topo da página do parceiro */
  destaques?: { titulo: string; texto: string }[]
  desconto: string
  capa: string
  fotos?: string[]          // imagens adicionais do negócio (carrossel)
  redes?: { tipo: string; url: string }[]  // redes sociais
  endereco?: {
    rua?: string; numero?: string; complemento?: string
    bairro?: string; cidade?: string; uf?: string; cep?: string
  }
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
    resumo: 'Agência parceira do Sindibes especializada em tráfego, sites e Google Meu Negócio, com desconto exclusivo para associados.',
    descricao: [
      'A Mercado Open é a agência de marketing digital parceira oficial do Sindibes, dedicada a fazer o seu negócio da beleza ser encontrado, escolhido e lembrado na internet.',
      'Com estratégias sob medida para salões, barbearias, esmalterias e clínicas de estética, a Mercado Open une tráfego, presença local e tecnologia para atrair mais clientes e aumentar o faturamento do seu negócio.',
      'Especialistas em posicionamento orgânico local, a Mercado Open coloca o seu negócio na 1ª página do Google dentro da sua cidade, sem depender de anúncios pagos. Clientes que buscam "salão de beleza em Uberlândia" encontram você primeiro.',
      'Como parceira do Sindibes, a Mercado Open oferece condições e descontos exclusivos para todos os associados. Fale com a equipe e descubra como colocar o seu negócio na frente da concorrência.',
    ],
    destaques: [
      {
        titulo: '1ª página do Google em Uberlândia',
        texto: 'Seu salão posicionado no topo das buscas de quem procura pelo seu serviço aqui na cidade.',
      },
      {
        titulo: 'SEO em várias palavras-chave',
        texto: 'Não é uma busca só: seu negócio aparece em dezenas de termos que o cliente realmente digita.',
      },
      {
        titulo: 'SEO em todas as páginas do site',
        texto: 'Cada página otimizada, não apenas a inicial. Mais portas de entrada para o cliente chegar até você.',
      },
      {
        titulo: 'Clientes 24 horas por dia, sem tráfego pago',
        texto: 'Resultado orgânico: você não paga por clique e continua sendo encontrado mesmo sem anúncio no ar.',
      },
      {
        titulo: 'Google Meu Negócio 100% otimizado',
        texto: 'Perfil completo, gerenciado e sempre atualizado, para aparecer no mapa e nas buscas locais.',
      },
    ],
    servicos: [
      'Posicionamento orgânico na 1ª página do Google na sua cidade',
      'SEO local: apareça quando o cliente busca pelo seu serviço perto de você',
      'Desenvolvimento de sites profissionais e otimizados',
      'Gestão profissional do Google Meu Negócio',
    ],
    desconto: 'Desconto exclusivo para associados Sindibes',
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
    resumo: 'Produtos profissionais de beleza com preços especiais para associados do Sindibes.',
    descricao: [
      'Distribuidora de cosméticos e produtos profissionais parceira do Sindibes, com portfólio completo para salões, barbearias e clínicas de estética.',
      'Associados do Sindibes contam com condições comerciais diferenciadas na compra de produtos e materiais.',
    ],
    servicos: ['Cosméticos profissionais', 'Materiais e descartáveis', 'Condições especiais para associados'],
    desconto: 'Preços especiais para associados Sindibes',
    capa: '/images/parceiro-cosmeticos.jpg',
    exemplo: true,
  },
  {
    slug: 'escola-de-capacitacao',
    nome: 'Escola Parceira de Capacitação',
    categoria: 'Cursos e Formação Profissional',
    resumo: 'Cursos e formações para profissionais da beleza com desconto para associados do Sindibes.',
    descricao: [
      'Escola parceira do Sindibes oferecendo cursos e formações nas principais áreas da beleza e estética.',
      'Associados do Sindibes têm desconto nas matrículas e acesso a turmas exclusivas.',
    ],
    servicos: ['Cursos técnicos de beleza e estética', 'Workshops e capacitações', 'Certificados reconhecidos'],
    desconto: 'Desconto na matrícula para associados Sindibes',
    capa: '/images/parceiro-escola.jpg',
    exemplo: true,
  },
]

export function getParceiro(slug: string) {
  return PARCEIROS.find((p) => p.slug === slug)
}
