// Funções de todas as categorias representadas pelo sindicato.
// Usadas tanto no cadastro de currículo quanto no cadastro de vagas.
export const FUNCOES = [
  'Cabeleireiro(a)',
  'Barbeiro(a)',
  'Colorista',
  'Terapeuta Capilar',
  'Manicure e Pedicure',
  'Nail Designer (alongamento)',
  'Esteticista Facial',
  'Esteticista Corporal',
  'Maquiador(a)',
  'Designer de Sobrancelhas',
  'Lash Designer (extensão de cílios)',
  'Micropigmentador(a)',
  'Depilador(a)',
  'Massoterapeuta',
  'Podólogo(a)',
  'Cosmetólogo(a)',
  'Visagista',
  'Recepcionista de Salão',
  'Gerente de Salão',
  'Auxiliar / Assistente de Beleza',
]

export const TIPOS_CONTRATO = ['CLT', 'Autônomo(a)', 'Freelancer', 'Diarista', 'Comissionado(a)', 'Estágio']

export const NIVEIS_EXPERIENCIA = ['Iniciante', 'De 1 a 3 anos', 'De 3 a 5 anos', 'Mais de 5 anos']

// ⚠️ DADOS DEMONSTRATIVOS — currículos reais serão cadastrados pelos candidatos e aparecerão aqui.
export interface Curriculo {
  id: string
  nome: string
  funcao: string
  experiencia: string
  cidade: string
  disponibilidade: string
  sobre: string
}

export const CURRICULOS_EXEMPLO: Curriculo[] = [
  { id: 'c1', nome: 'Ana Paula S.', funcao: 'Cabeleireiro(a)', experiencia: 'Mais de 5 anos', cidade: 'Uberlândia - MG', disponibilidade: 'Imediata', sobre: 'Especialista em cortes femininos, coloração e tratamentos capilares. Experiência em salões de grande movimento.' },
  { id: 'c2', nome: 'Carlos M.', funcao: 'Barbeiro(a)', experiencia: 'De 3 a 5 anos', cidade: 'Uberlândia - MG', disponibilidade: 'A combinar', sobre: 'Barbeiro com domínio de cortes modernos, barba e navalhado. Atendimento ágil e fidelização de clientes.' },
  { id: 'c3', nome: 'Juliana R.', funcao: 'Manicure e Pedicure', experiencia: 'De 1 a 3 anos', cidade: 'Uberlândia - MG', disponibilidade: 'Imediata', sobre: 'Manicure e pedicure com foco em higiene, esmaltação perfeita e nail art. Pontualidade e organização.' },
  { id: 'c4', nome: 'Fernanda L.', funcao: 'Esteticista Facial', experiencia: 'De 3 a 5 anos', cidade: 'Uberlândia - MG', disponibilidade: 'Meio período', sobre: 'Esteticista com formação em limpeza de pele, protocolos faciais e aparelhologia. Foco em resultado e acolhimento.' },
  { id: 'c5', nome: 'Beatriz A.', funcao: 'Designer de Sobrancelhas', experiencia: 'De 1 a 3 anos', cidade: 'Uberlândia - MG', disponibilidade: 'Imediata', sobre: 'Design de sobrancelhas, henna e brow lamination. Atenção ao formato do rosto de cada cliente.' },
  { id: 'c6', nome: 'Rafael T.', funcao: 'Gerente de Salão', experiencia: 'Mais de 5 anos', cidade: 'Uberlândia - MG', disponibilidade: 'A combinar', sobre: 'Gestão de equipes, controle financeiro, agenda e experiência do cliente em salões e clínicas de estética.' },
  { id: 'c7', nome: 'Mariana C.', funcao: 'Lash Designer (extensão de cílios)', experiencia: 'De 1 a 3 anos', cidade: 'Uberlândia - MG', disponibilidade: 'Imediata', sobre: 'Extensão de cílios fio a fio e volume russo. Técnica precisa, ambiente higienizado e durabilidade.' },
  { id: 'c8', nome: 'Patrícia N.', funcao: 'Maquiador(a)', experiencia: 'De 3 a 5 anos', cidade: 'Uberlândia - MG', disponibilidade: 'Freelancer', sobre: 'Maquiagem para noivas, festas e eventos. Portfólio consolidado e pontualidade em produções.' },
]

// ⚠️ DADOS DEMONSTRATIVOS — vagas reais serão cadastradas pelas empresas filiadas.
export interface Vaga {
  id: string
  titulo: string
  funcao: string
  empresa: string
  tipo: string
  local: string
  salario: string
  descricao: string
  publicada: string
}

export const VAGAS_EXEMPLO: Vaga[] = [
  { id: 'v1', titulo: 'Cabeleireiro(a) com experiência', funcao: 'Cabeleireiro(a)', empresa: 'Studio Bella Hair', tipo: 'Comissionado(a)', local: 'Centro, Uberlândia - MG', salario: 'Comissão + fixo', descricao: 'Vaga para profissional com experiência em corte, coloração e escova. Carteira de clientes é um diferencial.', publicada: 'Jul 2026' },
  { id: 'v2', titulo: 'Barbeiro(a)', funcao: 'Barbeiro(a)', empresa: 'Barbearia Dom Corte', tipo: 'Comissionado(a)', local: 'Santa Mônica, Uberlândia - MG', salario: 'A combinar', descricao: 'Barbearia consolidada busca barbeiro para cortes masculinos e barba. Ambiente descontraído e bom fluxo.', publicada: 'Jul 2026' },
  { id: 'v3', titulo: 'Manicure e Pedicure', funcao: 'Manicure e Pedicure', empresa: 'Charme Nail Studio', tipo: 'CLT', local: 'Centro, Uberlândia - MG', salario: 'R$ 1.600 + comissão', descricao: 'Esmalteria contrata manicure com foco em qualidade e atendimento. Domínio de alongamento é diferencial.', publicada: 'Jun 2026' },
  { id: 'v4', titulo: 'Esteticista', funcao: 'Esteticista Facial', empresa: 'Renovar Estética', tipo: 'CLT', local: 'Osvaldo Rezende, Uberlândia - MG', salario: 'R$ 2.000 + comissão', descricao: 'Clínica de estética busca esteticista para procedimentos faciais e corporais. Formação comprovada.', publicada: 'Jun 2026' },
  { id: 'v5', titulo: 'Recepcionista de Salão', funcao: 'Recepcionista de Salão', empresa: 'Studio Bella Hair', tipo: 'CLT', local: 'Centro, Uberlândia - MG', salario: 'R$ 1.500', descricao: 'Atendimento ao cliente, agenda, telefone e organização. Boa comunicação e simpatia.', publicada: 'Jul 2026' },
  { id: 'v6', titulo: 'Designer de Sobrancelhas', funcao: 'Designer de Sobrancelhas', empresa: 'Glamour Makeup', tipo: 'Autônomo(a)', local: 'Bairro Brasil, Uberlândia - MG', salario: 'Aluguel de espaço', descricao: 'Espaço para profissional de sobrancelhas atuar de forma autônoma em ambiente de alto padrão.', publicada: 'Mai 2026' },
]
