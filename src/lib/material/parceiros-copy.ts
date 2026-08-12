/**
 * Textos de apoio para captação de parceiros e associados.
 * Material interno — a página que consome isto é noindex.
 *
 * Se o site passar a usar domínio próprio, basta trocar SITE_URL.
 */
export const SITE_URL = 'https://sindbes2.vercel.app'

export const LINKS = {
  parceiros: `${SITE_URL}/parceiros`,
  formParceiro: `${SITE_URL}/faca-parte/parceiro`,
  formAssociado: `${SITE_URL}/faca-parte/associado`,
}

/** Blocos da página /parceiros, na ordem em que aparecem na rolagem. */
export const ANATOMIA = [
  {
    titulo: 'Chamada de abertura',
    texto: '“Parceiros que valorizam você”, com os dois botões lado a lado: Quero ser Parceiro e Quero ser Associado.',
  },
  {
    titulo: 'Mapa e dados de contato',
    texto: 'Mapa do Google com a localização, mais endereço, WhatsApp, e-mail e horário de atendimento — tudo clicável.',
  },
  {
    titulo: 'Vitrine de parceiros',
    texto: 'Cards com foto, categoria, resumo e o desconto oferecido. Parceiros oficiais recebem selo destacado. Cada card abre a página completa do parceiro.',
  },
  {
    titulo: 'Convite final',
    texto: 'Faixa de encerramento repetindo os dois caminhos de cadastro, para quem rolou a página inteira.',
  },
]

export const PARCEIRO_GANHA = [
  'Página própria na vitrine de parceiros',
  'Selo oficial “Parceiro Sindibes”',
  'Divulgação no site, redes, newsletter e eventos',
  'Acesso a centenas de profissionais do setor',
]

export const PARCEIRO_CAMPOS = [
  { campo: 'Responsável', detalhe: 'nome, cargo, WhatsApp, e-mail' },
  { campo: 'Empresa', detalhe: 'nome, categoria, site, WhatsApp' },
  { campo: 'Endereço', detalhe: 'completo, e redes sociais' },
  { campo: 'Textos', detalhe: 'resumo curto e descrição' },
  { campo: 'Serviços', detalhe: 'lista do que oferece' },
  { campo: 'O desconto', detalhe: 'benefício para associados' },
  { campo: 'Foto de capa', detalhe: 'até 1 MB' },
]

export const ASSOCIADO_GANHA = [
  'Plano de saúde e odontológico negociados',
  'Assessoria jurídica e contábil especializada',
  'Treinamentos com certificado reconhecido',
  'Acesso a crédito com condições exclusivas',
  'Apoio na regularização e certificação',
  'Representação e defesa dos seus direitos',
]

export const ASSOCIADO_CAMPOS = [
  { campo: 'Nome', detalhe: 'completo' },
  { campo: 'Estabelecimento', detalhe: 'ou profissão' },
  { campo: 'WhatsApp', detalhe: 'e e-mail' },
  { campo: 'CNPJ ou CPF', detalhe: '' },
  { campo: 'Endereço', detalhe: 'completo' },
  { campo: 'Instagram', detalhe: 'do negócio' },
  { campo: 'Fotos', detalhe: 'do espaço (opcional)' },
]

export const MSG_PARCEIRO_WHATSAPP = `Olá! Tudo bem?

Somos o Sindibes, o Sindicato da Beleza de Uberlândia, e queremos convidar sua empresa para fazer parte da nossa rede de parceiros.

Como parceiro, sua empresa:
• Ganha uma página própria na vitrine de parceiros do nosso site
• Recebe o selo oficial "Parceiro Sindibes"
• É divulgada no site, nas redes sociais, na newsletter e nos nossos eventos
• Passa a ser vista por centenas de profissionais e empresas da beleza da cidade

Em troca, você oferece uma condição especial (desconto ou benefício) para os nossos associados.

O cadastro é rápido e é feito direto neste link:
${LINKS.formParceiro}

Separe uma foto de capa e os dados da empresa (endereço, redes sociais e os serviços que vocês oferecem). Depois de enviar, nossa equipe analisa e entra em contato.

Qualquer dúvida, é só responder aqui. Será um prazer ter vocês com a gente!`

export const MSG_PARCEIRO_EMAIL = `Assunto: Convite para ser Parceiro do Sindibes

Olá, tudo bem?

Meu nome é [SEU NOME] e falo em nome do Sindibes — Sindicato da Beleza de Uberlândia. Estamos ampliando nossa rede de parceiros e gostaríamos de convidar a [NOME DA EMPRESA] para participar.

Como funciona: sua empresa oferece uma condição especial para os associados do Sindibes (um desconto ou benefício) e, em contrapartida, passa a ser divulgada para toda a nossa base.

O que sua empresa recebe:
- Uma página própria na vitrine de parceiros do nosso site, com fotos, descrição e seus contatos
- O selo oficial "Parceiro Sindibes", que reforça a credibilidade da marca
- Divulgação contínua no site, nas redes sociais, na newsletter e nos eventos do sindicato
- Visibilidade junto a centenas de salões, barbearias, clínicas de estética e profissionais da beleza da cidade

Para se cadastrar, basta preencher o formulário neste link:
${LINKS.formParceiro}

Antes de começar, tenha em mãos:
- Dados do responsável pelo cadastro (nome, cargo, WhatsApp e e-mail)
- Dados da empresa (nome, categoria, site, WhatsApp e endereço completo)
- Links das redes sociais
- Um resumo curto e uma descrição da empresa
- A lista de serviços ou produtos oferecidos
- O desconto ou benefício que será oferecido aos associados
- Uma foto de capa (até 1 MB)

Assim que recebermos, nossa equipe analisa a proposta e entra em contato para dar continuidade.

Fico à disposição para qualquer dúvida.

Atenciosamente,
[SEU NOME]
Sindibes — Sindicato da Beleza de Uberlândia`

export const MSG_ASSOCIADO_WHATSAPP = `Olá! Tudo bem?

Somos o Sindibes, o Sindicato da Beleza de Uberlândia. Se você trabalha com beleza — salão, barbearia, esmalteria, estética ou como profissional autônomo — vale conhecer o que a filiação oferece:

• Plano de saúde e odontológico com preços negociados em grupo
• Assessoria jurídica e contábil com especialistas no setor da beleza
• Treinamentos e qualificações com certificado reconhecido
• Acesso a crédito com condições exclusivas
• Apoio na regularização e certificação do seu negócio
• Representação dos seus direitos e interesses

Tudo isso é negociado coletivamente, então você paga menos do que pagaria sozinho.

Para se associar, preencha o formulário neste link:
${LINKS.formAssociado}

É rápido. Depois de enviar, nossa equipe entra em contato para finalizar sua filiação.

Qualquer dúvida, é só responder aqui!`

export const MSG_ASSOCIADO_EMAIL = `Assunto: Convite para se associar ao Sindibes

Olá, tudo bem?

Meu nome é [SEU NOME] e falo em nome do Sindibes — Sindicato da Beleza de Uberlândia. Estou entrando em contato para convidar você a se associar ao sindicato.

Nosso trabalho é negociar coletivamente aquilo que sai caro quando cada profissional busca sozinho. Como associado, você tem acesso a:

- Plano de saúde e plano odontológico com preços negociados em grupo
- Assessoria jurídica e contábil com profissionais especializados no setor da beleza
- Treinamentos e qualificações com certificado reconhecido, para você e sua equipe
- Linhas de crédito com condições exclusivas para o setor
- Apoio na regularização e certificação do seu negócio
- Representação e defesa dos seus direitos junto ao sindicato

Para se associar, basta preencher o formulário neste link:
${LINKS.formAssociado}

Tenha em mãos:
- Nome completo
- Nome do estabelecimento ou sua profissão
- WhatsApp e e-mail
- CNPJ ou CPF
- Endereço completo
- Instagram do negócio (se tiver)
- Fotos do seu espaço (opcional, até 1 MB cada)

Assim que recebermos seus dados, nossa equipe entra em contato para finalizar a filiação e explicar como acessar cada benefício.

Fico à disposição para esclarecer qualquer dúvida.

Atenciosamente,
[SEU NOME]
Sindibes — Sindicato da Beleza de Uberlândia`
