/**
 * Mensagens de WhatsApp do Wagner para enviar os folders, prontas para
 * copiar e colar (sem links de envio). Gera material/Copias-WhatsApp-Wagner.txt.
 *
 * Uso: node material/gerar-copias.js
 */
const fs = require('fs')
const path = require('path')

const WHATS_DISPLAY = '(34) 98427-4161'

const ASSOCIADO = `Olá, tudo bem? Aqui é o Wagner, do *Sindibes, o Sindicato da Beleza de Uberlândia*. 😊

Estou te enviando o nosso material e um convite: fazer o cadastro do seu negócio no site do Sindibes e ganhar uma *página exclusiva da sua empresa* dentro do portal do sindicato.

*O que a página da sua empresa no site traz para você:*
🌐 Seu negócio na vitrine de associados do Sindibes, vista por quem procura serviços de beleza em Uberlândia
🔎 Mais uma porta para clientes te acharem no Google, dentro de um site oficial do setor
📸 Fotos do seu espaço, para o cliente conhecer o ambiente antes de ir
💬 Botão de WhatsApp para o cliente falar direto com você
📍 Endereço com mapa e horário de atendimento
🤝 A credibilidade de aparecer como associado do sindicato da categoria

*E ainda os benefícios de ser associado:*
✅ Plano de saúde e odontológico com preços negociados
✅ Assessoria jurídica e contábil para o setor da beleza
✅ Treinamentos com certificado
✅ Descontos exclusivos na rede de parceiros

O cadastro leva uns 5 minutos. Depois de enviado, nossa equipe revisa os dados e coloca a sua página no ar:

👉 https://sindibes.com.br/faca-parte/associado

Ficou com alguma dúvida ou prefere fazer o cadastro comigo? É só me chamar aqui ou no *${WHATS_DISPLAY}*. Vou te ajudar com prazer!

Wagner
Atendimento Sindibes`

const PARCEIRO = `Olá, tudo bem? Aqui é o Wagner, do *Sindibes, o Sindicato da Beleza de Uberlândia*. 😊

Estou te enviando o nosso material e um convite: fazer o cadastro da sua empresa como *Parceira do Sindibes* e ganhar uma *página exclusiva da sua empresa* dentro do portal do sindicato.

*O que a página da sua empresa no site traz para você:*
🌐 Sua empresa na vitrine de parceiros do Sindibes, vista pelos profissionais e negócios da beleza de Uberlândia
🔎 Mais uma porta para clientes te acharem no Google, dentro de um site oficial do setor
🛍️ Espaço para apresentar a empresa e listar seus serviços e produtos
🏷️ O seu desconto para associados em destaque na página
💬 Botões de WhatsApp, site e redes sociais levando o cliente direto até você
📍 Endereço completo para o cliente chegar até você

*E ainda os benefícios de ser parceiro:*
🏅 Selo oficial *Parceiro Sindibes* para usar na divulgação da sua empresa
✅ Divulgação no site, nas redes sociais, na newsletter e nos eventos do sindicato
✅ Divulgação preferencial nas campanhas ao longo do ano
✅ Contato com salões, barbearias, clínicas e profissionais da beleza

*Como funciona:* sua empresa oferece um desconto ou condição especial para os associados do Sindibes e, em troca, ganha a página e toda essa divulgação.

O cadastro leva uns 5 minutos. Depois de enviado, nossa equipe revisa os dados e coloca a sua página no ar:

👉 https://sindibes.com.br/faca-parte/parceiro

Ficou com alguma dúvida ou prefere fazer o cadastro comigo? É só me chamar aqui ou no *${WHATS_DISPLAY}*. Vou te ajudar com prazer!

Wagner
Atendimento Sindibes`

const blocos = [
  ['ASSOCIADO', ASSOCIADO, 'Sindibes-Seja-Associado.pdf'],
  ['PARCEIRO', PARCEIRO, 'Sindibes-Seja-Parceiro.pdf'],
]

const saida = blocos.map(([titulo, msg, pdf]) => [
  `==================== MENSAGEM PARA ${titulo} ====================`,
  `Enviar junto com o PDF: ${pdf}`,
  '',
  msg,
  '',
].join('\n')).join('\n')

fs.writeFileSync(path.join(__dirname, 'Copias-WhatsApp-Wagner.txt'), saida, 'utf8')
module.exports = { ASSOCIADO, PARCEIRO }
console.log('Copias-WhatsApp-Wagner.txt gerado')
