// ⚠️ DADOS DEMONSTRATIVOS — substituir pelos filiados reais no painel administrativo.
// Cada associado exibe: capa, galeria de fotos, contatos, mapa e formulário na página individual.

export interface Associado {
  slug: string
  nome: string
  categoria: string
  descricao: string
  capa: string
  fotos: string[]
  endereco: string
  telefoneDisplay: string
  whatsapp: string // apenas números, formato 55DDDNUMERO
  instagram?: string
  email?: string
  horario: string
  mapsQuery: string
  novo?: boolean
  desde: string
}

export const ASSOCIADOS: Associado[] = [
  {
    slug: 'studio-bella-hair',
    nome: 'Studio Bella Hair',
    categoria: 'Salão de Cabeleireiro',
    descricao:
      'Salão especializado em cortes, coloração e tratamentos capilares. Uma equipe apaixonada por realçar a beleza natural de cada cliente, com produtos de alta qualidade e atendimento personalizado.',
    capa: '/images/ambiente-cabeleireiro.jpg',
    fotos: ['/images/ambiente-cabeleireiro.jpg', '/images/ambiente-corte.jpg', '/images/servico-treinamentos.jpg'],
    endereco: 'Av. Rondon Pacheco, 000 - Centro, Uberlândia - MG',
    telefoneDisplay: '(34) 0000-0000',
    whatsapp: '5534000000000',
    instagram: '@studiobellahair',
    email: 'contato@studiobellahair.com.br',
    horario: 'Ter a Sáb: 9h às 19h',
    mapsQuery: 'Centro, Uberlândia - MG',
    novo: true,
    desde: '2026',
  },
  {
    slug: 'barbearia-dom-corte',
    nome: 'Barbearia Dom Corte',
    categoria: 'Barbearia',
    descricao:
      'Barbearia clássica com ambiente acolhedor e barbeiros experientes. Cortes masculinos, barba, cuidados e aquele bate-papo que faz o cliente voltar sempre.',
    capa: '/images/ambiente-barbearia.jpg',
    fotos: ['/images/ambiente-barbearia.jpg', '/images/diferencial1.jpg'],
    endereco: 'Av. João Naves de Ávila, 000 - Santa Mônica, Uberlândia - MG',
    telefoneDisplay: '(34) 0000-0000',
    whatsapp: '5534000000000',
    instagram: '@barbeariadomcorte',
    email: 'contato@domcorte.com.br',
    horario: 'Seg a Sáb: 9h às 20h',
    mapsQuery: 'Santa Mônica, Uberlândia - MG',
    novo: true,
    desde: '2026',
  },
  {
    slug: 'charme-nail-studio',
    nome: 'Charme Nail Studio',
    categoria: 'Esmalteria',
    descricao:
      'Esmalteria completa com manicure, pedicure, alongamento e nail art. Ambiente higienizado, produtos de primeira linha e resultado impecável em cada atendimento.',
    capa: '/images/ambiente-esmalteria.jpg',
    fotos: ['/images/ambiente-esmalteria.jpg'],
    endereco: 'R. Coronel Antônio Alves, 000 - Centro, Uberlândia - MG',
    telefoneDisplay: '(34) 0000-0000',
    whatsapp: '5534000000000',
    instagram: '@charmenailstudio',
    email: 'contato@charmenail.com.br',
    horario: 'Seg a Sáb: 9h às 18h',
    mapsQuery: 'Centro, Uberlândia - MG',
    desde: '2025',
  },
  {
    slug: 'renovar-estetica',
    nome: 'Renovar Estética',
    categoria: 'Clínica de Estética',
    descricao:
      'Clínica de estética facial e corporal com tecnologia de ponta. Limpeza de pele, tratamentos faciais, procedimentos corporais e um cuidado que renova a autoestima.',
    capa: '/images/ambiente-estetica.jpg',
    fotos: ['/images/ambiente-estetica.jpg', '/images/ambiente-facial.jpg'],
    endereco: 'Av. Getúlio Vargas, 000 - Osvaldo Rezende, Uberlândia - MG',
    telefoneDisplay: '(34) 0000-0000',
    whatsapp: '5534000000000',
    instagram: '@renovarestetica',
    email: 'contato@renovarestetica.com.br',
    horario: 'Seg a Sex: 8h às 19h | Sáb: 8h às 13h',
    mapsQuery: 'Osvaldo Rezende, Uberlândia - MG',
    desde: '2024',
  },
  {
    slug: 'glamour-makeup',
    nome: 'Glamour Makeup',
    categoria: 'Maquiagem',
    descricao:
      'Espaço dedicado à maquiagem profissional para noivas, formandas e eventos. Também oferece cursos e workshops para quem deseja se aperfeiçoar na arte da maquiagem.',
    capa: '/images/ambiente-maquiagem.jpg',
    fotos: ['/images/ambiente-maquiagem.jpg'],
    endereco: 'Av. Cesário Alvim, 000 - Brasil, Uberlândia - MG',
    telefoneDisplay: '(34) 0000-0000',
    whatsapp: '5534000000000',
    instagram: '@glamourmakeup',
    email: 'contato@glamourmakeup.com.br',
    horario: 'Ter a Sáb: 10h às 19h',
    mapsQuery: 'Bairro Brasil, Uberlândia - MG',
    novo: true,
    desde: '2026',
  },
  {
    slug: 'zen-spa-bem-estar',
    nome: 'Zen Spa & Bem-Estar',
    categoria: 'Spa',
    descricao:
      'Um refúgio de relaxamento no coração de Uberlândia. Massagens, terapias corporais e rituais de bem-estar em um ambiente pensado para o seu descanso e cuidado.',
    capa: '/images/ambiente-spa.jpg',
    fotos: ['/images/ambiente-spa.jpg'],
    endereco: 'Av. Nicomedes Alves dos Santos, 000 - Lídice, Uberlândia - MG',
    telefoneDisplay: '(34) 0000-0000',
    whatsapp: '5534000000000',
    instagram: '@zenspaudi',
    email: 'contato@zenspa.com.br',
    horario: 'Seg a Sáb: 9h às 21h',
    mapsQuery: 'Lídice, Uberlândia - MG',
    desde: '2025',
  },
]

export function getAssociado(slug: string) {
  return ASSOCIADOS.find((a) => a.slug === slug)
}
