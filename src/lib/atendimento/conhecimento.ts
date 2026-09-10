/**
 * Base de conhecimento do atendimento.
 *
 * Serve a dois consumidores:
 *  - as respostas prontas dos botões de sugestão (funcionam sem IA);
 *  - o contexto enviado à IA, para ela responder dentro do que o site oferece.
 */

export const BENEFICIOS_ASSOCIADO = [
  'Plano de saúde e odontológico com preços negociados coletivamente',
  'Assessoria jurídica e contábil especializada no setor da beleza',
  'Treinamentos e qualificações com certificado reconhecido',
  'Acesso a crédito com condições facilitadas',
  'Apoio na regularização e certificação profissional',
  'Rede de parceiros com descontos exclusivos',
  'Representação sindical e defesa dos seus direitos',
  'Página própria na vitrine de filiados do site, com fotos, contatos e mapa',
]

export const BENEFICIOS_PARCEIRO = [
  'Página própria na vitrine de parceiros do site',
  'Selo oficial "Parceiro Sindibes" para usar na sua comunicação',
  'Divulgação no site, nas redes sociais, na newsletter e nos eventos',
  'Visibilidade junto a centenas de profissionais e empresas da beleza',
  'Divulgação preferencial em campanhas ao longo do ano',
  'Acesso à base de profissionais da beleza de Uberlândia',
]

export const SERVICOS = [
  'Treinamentos e qualificações profissionais',
  'Assessoria jurídica e contábil para empresas da beleza',
  'Benefícios para associados',
  'Plano de Saúde',
  'Qualificação em gestão financeira',
  'Qualificação em gestão de pessoas',
  'Planejamento empresarial para empresas da beleza',
  'Plano Odontológico',
  'Regularização e Certificação Profissional',
  'Acesso de Crédito',
]

export const LINKS_UTEIS = {
  associar: '/faca-parte/associado',
  parceiro: '/faca-parte/parceiro',
  planoOdontologico: '/plano-odontologico',
  planoSaude: '/plano-de-saude',
  parceiros: '/parceiros',
  associados: '/associados',
  eventos: '/eventos',
  convencoes: '/institucional/convencoes',
  contato: '/contato',
}

export interface PerguntaSugerida {
  /** Rótulo curto exibido no botão */
  chip: string
  /** Pergunta completa registrada na conversa */
  pergunta: string
  /** Resposta pronta, usada mesmo sem IA configurada */
  resposta: string
  /** Link opcional oferecido junto da resposta */
  link?: { texto: string; href: string }
}

export const PERGUNTAS_SUGERIDAS: PerguntaSugerida[] = [
  {
    chip: 'Quero me associar',
    pergunta: 'Como faço para me associar ao Sindibes?',
    resposta:
      'É simples: você preenche o cadastro no site e nossa equipe entra em contato para finalizar a filiação.\n\n' +
      'Como associado você tem plano de saúde e odontológico negociados, assessoria jurídica e contábil, treinamentos com certificado, acesso a crédito, apoio na regularização e ainda ganha uma página própria na vitrine de filiados.',
    link: { texto: 'Fazer meu cadastro', href: LINKS_UTEIS.associar },
  },
  {
    chip: 'Benefícios do associado',
    pergunta: 'Quais são os benefícios de ser associado?',
    resposta:
      'São estes:\n\n' + BENEFICIOS_ASSOCIADO.map((b) => `• ${b}`).join('\n') +
      '\n\nTudo negociado em grupo, então sai bem mais barato do que contratar por conta própria.',
    link: { texto: 'Quero me associar', href: LINKS_UTEIS.associar },
  },
  {
    chip: 'Quero ser parceiro',
    pergunta: 'Como minha empresa vira parceira do Sindibes?',
    resposta:
      'Sua empresa oferece uma condição especial aos nossos associados e, em troca, ganha divulgação para toda a nossa base.\n\n' +
      BENEFICIOS_PARCEIRO.map((b) => `• ${b}`).join('\n'),
    link: { texto: 'Enviar proposta de parceria', href: LINKS_UTEIS.parceiro },
  },
  {
    chip: 'Plano odontológico',
    pergunta: 'Como funciona o plano odontológico?',
    resposta:
      'Cobre consultas, limpezas, restaurações e tratamento de canal, com rede credenciada em Uberlândia e região. Pode incluir seus dependentes.\n\n' +
      'Por ser negociado em grupo, sai até 50% mais barato que um plano individual: a mensalidade custa menos que uma única consulta particular.',
    link: { texto: 'Ver detalhes', href: LINKS_UTEIS.planoOdontologico },
  },
  {
    chip: 'Plano de saúde',
    pergunta: 'Como funciona o plano de saúde?',
    resposta:
      'O Sindibes negocia com as operadoras em nome de toda a categoria, o que garante cobertura ampla por um valor bem menor do que você conseguiria sozinho. Também pode ser estendido a dependentes.',
    link: { texto: 'Ver detalhes', href: LINKS_UTEIS.planoSaude },
  },
  {
    chip: 'Convenção coletiva',
    pergunta: 'Onde encontro a convenção coletiva?',
    resposta:
      'As convenções coletivas ficam disponíveis para download na área institucional do site, incluindo a CCT Trabalhista 2026/2027.',
    link: { texto: 'Ver convenções', href: LINKS_UTEIS.convencoes },
  },
]

/** Contexto entregue à IA para que ela responda apenas dentro do escopo do site. */
export function montarContexto(nomeSite: string, whatsappDisplay: string, horario: string) {
  return `Você é o assistente virtual do ${nomeSite}, o sindicato das empresas de beleza e estética de Uberlândia e região.

REGRAS DE RESPOSTA:
- Responda SEMPRE em português do Brasil.
- Seja SUCINTO: no máximo 3 frases curtas ou uma lista de até 5 itens.
- Tom cordial e simples, como um atendente de WhatsApp. Nada de linguagem técnica.
- Seu objetivo final é levar a pessoa a falar com o Wagner, nosso atendente humano. Sempre que a conversa avançar (a pessoa demonstrar interesse, pedir preço, condição, prazo ou algo específico), convide-a a falar com o Wagner.
- NUNCA invente valores, mensalidades, percentuais de desconto, nomes de operadoras ou prazos. Se perguntarem, diga que o Wagner passa essas condições.
- Se a pergunta fugir do assunto do sindicato, redirecione educadamente.

BENEFÍCIOS PARA ASSOCIADOS (profissionais e estabelecimentos da beleza):
${BENEFICIOS_ASSOCIADO.map((b) => `- ${b}`).join('\n')}

BENEFÍCIOS PARA PARCEIROS (empresas que oferecem vantagens aos associados):
${BENEFICIOS_PARCEIRO.map((b) => `- ${b}`).join('\n')}

SERVIÇOS DO SINDICATO:
${SERVICOS.map((s) => `- ${s}`).join('\n')}

INFORMAÇÕES ÚTEIS:
- Cadastro de associado: ${LINKS_UTEIS.associar}
- Cadastro de parceiro: ${LINKS_UTEIS.parceiro}
- Plano odontológico: ${LINKS_UTEIS.planoOdontologico} (até 50% menor que plano individual, cobre consultas, limpezas, restaurações e canal, aceita dependentes)
- Convenções coletivas: ${LINKS_UTEIS.convencoes}
- Atendimento: ${whatsappDisplay}, ${horario}

OFEREÇA OS BENEFÍCIOS: sempre que fizer sentido, apresente o que a pessoa ganha. Se for profissional ou dono de salão, ofereça os benefícios de associado. Se for empresa ou fornecedor, ofereça os benefícios de parceiro. Na dúvida sobre o perfil, pergunte antes de oferecer.`
}
