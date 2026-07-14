// ⚠️ DADOS DEMONSTRATIVOS — eventos reais serão cadastrados no painel administrativo.
export interface Evento {
  slug: string
  titulo: string
  data: string // 'YYYY-MM-DD'
  horario: string
  local: string
  endereco: string
  categoria: string
  resumo: string
  descricao: string[]
  capa: string
  galeria: string[]
  futuro: boolean
  destaque?: boolean
}

export const EVENTOS: Evento[] = [
  // ===== FUTUROS =====
  {
    slug: 'workshop-colorimetria-avancada',
    titulo: 'Workshop de Colorimetria Avançada',
    data: '2026-08-15',
    horario: '9h às 17h',
    local: 'Sede do Sindbes',
    endereco: 'Av. Sacramento, 1472 - Martins, Uberlândia - MG',
    categoria: 'Workshop',
    resumo: 'Um dia inteiro dominando técnicas de coloração, correção de cor e tendências para elevar o padrão do seu salão.',
    descricao: [
      'O Workshop de Colorimetria Avançada é voltado para cabeleireiros e coloristas que querem se destacar no mercado com técnicas modernas de coloração e correção de cor.',
      'Durante o dia, os participantes terão aulas teóricas e práticas com profissionais experientes, aprendendo desde a leitura de fundo de clareamento até as tendências mais buscadas pelas clientes.',
      'Vagas limitadas. Associados do Sindbes têm condições especiais. Certificado incluso.',
    ],
    capa: '/images/evento5.jpg',
    galeria: ['/images/evento5.jpg', '/images/evento8.jpg', '/images/evento4.jpg'],
    futuro: true,
    destaque: true,
  },
  {
    slug: 'palestra-gestao-financeira-saloes',
    titulo: 'Palestra: Gestão Financeira para Salões',
    data: '2026-09-05',
    horario: '19h às 21h',
    local: 'Auditório do Sindbes',
    endereco: 'Av. Sacramento, 1472 - Martins, Uberlândia - MG',
    categoria: 'Palestra',
    resumo: 'Aprenda a organizar o caixa, precificar serviços e aumentar a lucratividade do seu negócio da beleza.',
    descricao: [
      'Uma palestra prática e direta sobre os principais erros financeiros que quebram salões e barbearias, e como evitá-los.',
      'O conteúdo aborda precificação, controle de caixa, separação entre pessoa física e jurídica e planejamento de investimentos.',
      'Entrada gratuita para associados. Confirme sua presença.',
    ],
    capa: '/images/evento2.jpg',
    galeria: ['/images/evento2.jpg', '/images/evento1.jpg', '/images/evento3.jpg'],
    futuro: true,
  },
  {
    slug: 'encontro-networking-beleza',
    titulo: 'Encontro de Networking da Beleza',
    data: '2026-09-27',
    horario: '18h30 às 22h',
    local: 'Espaço de Eventos Sindbes',
    endereco: 'Av. Sacramento, 1472 - Martins, Uberlândia - MG',
    categoria: 'Networking',
    resumo: 'Uma noite para conectar profissionais e empresários da beleza de Uberlândia, trocar experiências e fazer negócios.',
    descricao: [
      'O Encontro de Networking da Beleza reúne donos de salões, barbearias, esmalterias e clínicas de estética para uma noite de troca de experiências e novas parcerias.',
      'O evento conta com coffee break, rodadas de apresentação e um bate-papo com convidados de destaque do setor.',
      'Vagas limitadas aos associados e convidados.',
    ],
    capa: '/images/evento7.jpg',
    galeria: ['/images/evento7.jpg', '/images/evento6.jpg'],
    futuro: true,
  },
  {
    slug: 'curso-design-sobrancelhas-lash',
    titulo: 'Curso de Design de Sobrancelhas & Lash',
    data: '2026-10-18',
    horario: '9h às 16h',
    local: 'Sede do Sindbes',
    endereco: 'Av. Sacramento, 1472 - Martins, Uberlândia - MG',
    categoria: 'Curso',
    resumo: 'Formação completa em design de sobrancelhas e extensão de cílios, com prática supervisionada e certificado.',
    descricao: [
      'Curso intensivo para quem deseja iniciar ou aperfeiçoar-se em design de sobrancelhas e extensão de cílios.',
      'Inclui teoria de visagismo, higienização, técnicas de aplicação e prática supervisionada com modelos.',
      'Material e certificado inclusos. Condições especiais para associados.',
    ],
    capa: '/images/evento8.jpg',
    galeria: ['/images/evento8.jpg', '/images/evento5.jpg'],
    futuro: true,
  },

  // ===== PASSADOS =====
  {
    slug: 'feira-da-beleza-uberlandia-2026',
    titulo: 'Feira da Beleza Uberlândia 2026',
    data: '2026-05-10',
    horario: '10h às 20h',
    local: 'Center Convention',
    endereco: 'Uberlândia - MG',
    categoria: 'Feira',
    resumo: 'A maior feira do setor da beleza da região reuniu marcas, profissionais e workshops em um só lugar.',
    descricao: [
      'A Feira da Beleza Uberlândia 2026 foi um sucesso, reunindo centenas de profissionais, expositores e marcas do setor.',
      'Durante o evento, aconteceram workshops, demonstrações ao vivo e o Sindbes marcou presença apoiando os associados e captando novos filiados.',
      'Confira os melhores momentos na galeria de fotos abaixo.',
    ],
    capa: '/images/evento4.jpg',
    galeria: ['/images/evento4.jpg', '/images/evento3.jpg', '/images/evento1.jpg'],
    futuro: false,
  },
  {
    slug: 'workshop-barbearia-moderna',
    titulo: 'Workshop de Barbearia Moderna',
    data: '2026-04-18',
    horario: '9h às 17h',
    local: 'Sede do Sindbes',
    endereco: 'Av. Sacramento, 1472 - Martins, Uberlândia - MG',
    categoria: 'Workshop',
    resumo: 'Barbeiros da região aprenderam as técnicas mais atuais de cortes, barba e atendimento premium.',
    descricao: [
      'O Workshop de Barbearia Moderna capacitou dezenas de barbeiros nas técnicas mais procuradas pelos clientes.',
      'Foram abordados cortes na tesoura e máquina, desenho e finalização de barba, além de atendimento e fidelização.',
      'Veja como foi na galeria de imagens.',
    ],
    capa: '/images/evento1.jpg',
    galeria: ['/images/evento1.jpg', '/images/evento5.jpg', '/images/evento8.jpg'],
    futuro: false,
  },
  {
    slug: 'confraternizacao-associados-2026',
    titulo: 'Confraternização dos Associados',
    data: '2026-03-22',
    horario: '20h',
    local: 'Salão de Festas Sindbes',
    endereco: 'Uberlândia - MG',
    categoria: 'Confraternização',
    resumo: 'Uma noite de celebração e agradecimento a todos os profissionais que fazem parte da nossa rede.',
    descricao: [
      'A Confraternização dos Associados reuniu a família Sindbes para celebrar as conquistas do ano.',
      'Foi uma noite de música, homenagens e muita integração entre os profissionais da beleza de Uberlândia.',
      'Reveja os melhores momentos na galeria.',
    ],
    capa: '/images/evento6.jpg',
    galeria: ['/images/evento6.jpg', '/images/evento7.jpg'],
    futuro: false,
  },
]

export function getEvento(slug: string) {
  return EVENTOS.find((e) => e.slug === slug)
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export function formatarData(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return { dia: d, mes: MESES[m - 1], ano: y, mesNum: m }
}
