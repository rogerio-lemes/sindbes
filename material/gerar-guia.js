/**
 * Monta o guia de cadastro em HTML e converte para PDF pelo Chrome headless.
 * O conteudo vem do mesmo material ja usado no site (beneficios e campos dos formularios).
 */
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const LOGO = fs.readFileSync(path.join(__dirname, '.logo.b64'), 'utf8')

const SITE = 'https://sindibes.com.br'
const CONTATO = {
  whats: '(34) 98446-8553',
  horario: 'Segunda a sexta, das 8h30 às 16h',
  email: 'adm.sindibes@gmail.com',
}

const ASSOCIADO = {
  beneficios: [
    ['Plano de saúde e odontológico', 'preços negociados coletivamente, bem abaixo do valor individual.'],
    ['Assessoria jurídica e contábil', 'especialistas que conhecem a rotina e a legislação do setor da beleza.'],
    ['Treinamentos e qualificações', 'cursos com certificado reconhecido para o profissional e a equipe.'],
    ['Acesso a crédito facilitado', 'condições diferenciadas para investir no negócio.'],
    ['Regularização e certificação', 'apoio para deixar o estabelecimento em dia e certificado.'],
    ['Rede de parceiros com desconto', 'condições exclusivas em empresas parceiras da cidade.'],
    ['Representação sindical', 'defesa dos direitos da categoria e da convenção coletiva.'],
    ['Página própria no site', 'vitrine de filiados com fotos, contatos e mapa.'],
  ],
  ferramentas: [
    'Página exclusiva na vitrine de associados, encontrada pelo Google',
    'Mapa com a localização e botão direto de WhatsApp para o cliente',
    'Convenções coletivas sempre atualizadas para consulta',
    'Agenda de eventos, cursos e assembleias do sindicato',
    'Atendimento on-line no site, disponível a qualquer hora',
  ],
  campos: [
    ['Nome completo', ''],
    ['Estabelecimento', 'ou a profissão'],
    ['WhatsApp', 'e e-mail'],
    ['CNPJ ou CPF', ''],
    ['Endereço completo', ''],
    ['Instagram', 'do negócio'],
    ['Fotos do espaço', 'opcional'],
  ],
  link: SITE + '/faca-parte/associado',
}

const PARCEIRO = {
  beneficios: [
    ['Página própria na vitrine', 'espaço exclusivo no site do sindicato, com fotos, textos e contatos.'],
    ['Selo oficial Parceiro Sindibes', 'credibilidade para usar na comunicação da empresa.'],
    ['Divulgação contínua', 'site, redes sociais, newsletter e eventos do sindicato.'],
    ['Visibilidade no setor', 'centenas de salões, barbearias, clínicas e profissionais da beleza.'],
    ['Campanhas ao longo do ano', 'divulgação preferencial nas ações do sindicato.'],
    ['Acesso à base da categoria', 'contato com os profissionais da beleza de Uberlândia.'],
  ],
  ferramentas: [
    'Página da empresa indexada no Google, dentro do site do sindicato',
    'Card com o desconto oferecido em destaque na vitrine',
    'Selo de parceiro oficial exibido na própria página',
    'Botões de WhatsApp, site e redes sociais levando o cliente direto',
    'Espaço para listar todos os serviços e produtos da empresa',
  ],
  campos: [
    ['Responsável', 'nome, cargo, WhatsApp e e-mail'],
    ['Empresa', 'nome, categoria, site e WhatsApp'],
    ['Endereço', 'completo, mais as redes sociais'],
    ['Textos', 'um resumo curto e uma descrição'],
    ['Serviços', 'lista do que a empresa oferece'],
    ['O desconto', 'o benefício para os associados'],
    ['Foto de capa', 'até 1 MB'],
  ],
  link: SITE + '/faca-parte/parceiro',
}

const ROTEIRO = [
  ['Abertura', 'Falo em nome do Sindibes, o Sindicato da Beleza de Uberlândia. Tem um minuto para eu te mostrar um benefício que já está liberado para você?'],
  ['O gancho', 'Colocamos a vitrine do site no ar. Cada associado tem uma página só dele, com foto, telefone e mapa, e aparece quando o cliente procura no Google.'],
  ['A prova', 'Entre em sindibes.com.br e clique em Associados. Você vê as páginas que já estão publicadas.'],
  ['O fechamento', 'Para publicar a sua, preciso de alguns dados. Você preenche em cinco minutos. Posso te mandar o link agora no WhatsApp?'],
  ['Depois da ligação', 'Mande o link na hora, ainda com a pessoa na linha, e confirme se chegou.'],
]

const li = (itens) => itens.map(([t, d]) =>
  `<li><span class="mk"></span><div><b>${t}</b>${d ? ` <span class="desc">${d}</span>` : ''}</div></li>`).join('')

const liSimples = (itens) => itens.map((t) => `<li><span class="mk"></span><div>${t}</div></li>`).join('')

const chips = (itens) => itens.map(([c, d]) =>
  `<div class="chip"><b>${c}</b>${d ? `<span>${d}</span>` : ''}</div>`).join('')

function trilha({ etiqueta, titulo, linha, dados, cor, numero }) {
  return `
  <section class="pagina" style="--cor:${cor}">
    <header class="topo">
      <img src="${LOGO}" alt="">
      <div><b>Sindibes</b><span>Sindicato da Beleza de Uberlândia</span></div>
      <span class="num">${numero}</span>
    </header>

    <div class="selo">${etiqueta}</div>
    <h2>${titulo}</h2>
    <p class="linha-fina">${linha}</p>

    <h3>O que ele ganha</h3>
    <ul class="lista">${li(dados.beneficios)}</ul>

    <h3>Ferramentas que passam a ser dele</h3>
    <ul class="lista compacta">${liSimples(dados.ferramentas)}</ul>

    <h3>O que ter em mãos antes de preencher</h3>
    <div class="chips">${chips(dados.campos)}</div>

    <div class="cta">
      <div>
        <span>Link do formulário de cadastro</span>
        <b>${dados.link}</b>
      </div>
      <div class="tempo">5 min</div>
    </div>
  </section>`
}

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Guia de Cadastro Sindibes</title>
<style>
  @page { size: A4; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:"Segoe UI",system-ui,sans-serif; color:#1f2a37; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .pagina { width:210mm; height:297mm; padding:16mm 15mm 14mm; position:relative; page-break-after:always; overflow:hidden; }
  .pagina:last-child { page-break-after:auto; }

  /* ---------- Capa ---------- */
  .capa { background:linear-gradient(145deg,#1d6f63 0%,#2E9E8D 45%,#6E5A97 100%); color:#fff; display:flex; flex-direction:column; justify-content:center; padding:22mm 18mm; }
  .capa .marca { background:#fff; border-radius:18px; padding:10px 16px; display:inline-flex; width:max-content; box-shadow:0 14px 34px rgba(0,0,0,.28); }
  .capa .marca img { height:62px; display:block; }
  .capa .tag { margin-top:26mm; font-size:11pt; letter-spacing:.32em; text-transform:uppercase; color:rgba(255,255,255,.78); }
  .capa h1 { font-size:40pt; line-height:1.06; font-weight:700; margin-top:8px; letter-spacing:-.5px; }
  .capa h1 em { font-style:normal; color:#ffe9a8; }
  .capa .sub { margin-top:16px; font-size:13.5pt; line-height:1.55; color:rgba(255,255,255,.9); max-width:135mm; }
  .capa .barra { width:70mm; height:5px; background:rgba(255,255,255,.55); border-radius:4px; margin-top:22px; }
  .capa .caixas { display:flex; gap:10px; margin-top:26mm; }
  .capa .caixa { flex:1; background:rgba(255,255,255,.13); border:1px solid rgba(255,255,255,.26); border-radius:14px; padding:14px 16px; }
  .capa .caixa b { display:block; font-size:10.5pt; margin-bottom:5px; }
  .capa .caixa span { font-size:9pt; color:rgba(255,255,255,.82); line-height:1.45; }
  .capa .rodape { position:absolute; left:18mm; right:18mm; bottom:14mm; display:flex; justify-content:space-between; font-size:9pt; color:rgba(255,255,255,.75); border-top:1px solid rgba(255,255,255,.25); padding-top:10px; }

  /* ---------- Paginas internas ---------- */
  .topo { display:flex; align-items:center; gap:11px; border-bottom:2px solid #eef1f4; padding-bottom:9px; margin-bottom:9mm; }
  .topo img { height:30px; border-radius:6px; }
  .topo > div { display:flex; flex-direction:column; line-height:1.25; }
  .topo b { font-size:10.5pt; }
  .topo span { font-size:8pt; color:#8995a4; }
  .topo .num { margin-left:auto; font-size:9pt; color:#b4bdc8; font-weight:600; }

  .selo { display:inline-block; background:var(--cor); color:#fff; font-size:8.5pt; font-weight:700; letter-spacing:.18em; text-transform:uppercase; padding:6px 13px; border-radius:30px; }
  h2 { font-size:26pt; margin:11px 0 6px; letter-spacing:-.4px; line-height:1.12; }
  .linha-fina { font-size:11pt; color:#5c6875; line-height:1.5; max-width:152mm; }
  h3 { font-size:12pt; margin:9mm 0 4mm; padding-left:11px; border-left:4px solid var(--cor); line-height:1.2; }

  .lista { list-style:none; display:grid; grid-template-columns:1fr 1fr; gap:3.6mm 7mm; }
  .lista.compacta { grid-template-columns:1fr; gap:2.6mm; }
  .lista li { display:flex; gap:8px; font-size:9.8pt; line-height:1.42; }
  .lista .mk { flex:none; width:14px; height:14px; margin-top:2px; border-radius:50%; background:var(--cor); position:relative; }
  .lista .mk::after { content:""; position:absolute; left:4.5px; top:2.5px; width:4px; height:7px; border:solid #fff; border-width:0 2px 2px 0; transform:rotate(42deg); }
  .lista b { font-weight:600; }
  .lista .desc { color:#6b7684; font-weight:400; }

  .chips { display:flex; flex-wrap:wrap; gap:6px; }
  .chip { background:#f5f7f9; border:1px solid #e6eaee; border-radius:10px; padding:7px 11px; font-size:9pt; }
  .chip b { font-weight:600; }
  .chip span { color:#7b8694; margin-left:5px; }

  .cta { position:absolute; left:15mm; right:15mm; bottom:14mm; background:var(--cor); color:#fff; border-radius:16px; padding:15px 20px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .cta span { font-size:8.5pt; letter-spacing:.16em; text-transform:uppercase; opacity:.85; display:block; margin-bottom:5px; }
  .cta b { font-size:13pt; word-break:break-all; }
  .cta .tempo { flex:none; background:rgba(255,255,255,.2); border:1px solid rgba(255,255,255,.4); border-radius:11px; padding:9px 14px; font-size:11pt; font-weight:700; }

  /* ---------- Roteiro ---------- */
  .passo { display:flex; gap:13px; margin-bottom:5.2mm; }
  .passo .n { flex:none; width:27px; height:27px; border-radius:50%; background:#2E9E8D; color:#fff; font-size:11pt; font-weight:700; display:flex; align-items:center; justify-content:center; }
  .passo h4 { font-size:10.5pt; margin-bottom:3px; }
  .passo p { font-size:9.8pt; color:#4b5663; line-height:1.5; }
  .passo p.fala { background:#f5f7f9; border-left:3px solid #d6dde3; border-radius:0 8px 8px 0; padding:8px 12px; font-style:italic; }

  .links { border:1px solid #e6eaee; border-radius:14px; overflow:hidden; margin-top:3mm; }
  .links div { display:flex; justify-content:space-between; gap:12px; padding:8.5px 14px; font-size:9.5pt; border-bottom:1px solid #eef1f4; }
  .links div:last-child { border-bottom:0; }
  .links div:nth-child(odd) { background:#fafbfc; }
  .links b { font-weight:600; }
  .links span { color:#2E9E8D; }

  .contato { margin-top:6mm; background:#1f2a37; color:#fff; border-radius:14px; padding:15px 20px; display:flex; justify-content:space-between; font-size:9.5pt; }
  .contato b { display:block; font-size:8pt; letter-spacing:.14em; text-transform:uppercase; color:#8fa0b0; margin-bottom:4px; font-weight:600; }
</style></head><body>

<!-- Capa -->
<section class="pagina capa">
  <div class="marca"><img src="${LOGO}" alt="Sindibes"></div>
  <div class="tag">Guia de cadastro</div>
  <h1>Benefícios e ferramentas<br>para <em>associados</em> e <em>parceiros</em></h1>
  <p class="sub">Tudo o que o Sindibes entrega, o que falar ao telefone e os links dos formulários de cadastro no site.</p>
  <div class="barra"></div>
  <div class="caixas">
    <div class="caixa"><b>Associado</b><span>8 benefícios, 5 ferramentas e o link do cadastro</span></div>
    <div class="caixa"><b>Parceiro</b><span>6 benefícios, 5 ferramentas e o link do cadastro</span></div>
    <div class="caixa"><b>Roteiro</b><span>O passo a passo da ligação, pronto para usar</span></div>
  </div>
  <div class="rodape"><span>sindibes.com.br</span><span>Material de apoio ao atendimento</span></div>
</section>

${trilha({ etiqueta: 'Trilha 1 • Associado', titulo: 'Para o profissional da beleza', linha: 'Salões, barbearias, clínicas de estética e profissionais autônomos de Uberlândia. O associado passa a ter o apoio do sindicato e uma página própria no site.', dados: ASSOCIADO, cor: '#2E9E8D', numero: '02' })}

${trilha({ etiqueta: 'Trilha 2 • Parceiro', titulo: 'Para a empresa parceira', linha: 'Empresas que oferecem um desconto ou condição especial aos associados e, em troca, são divulgadas para toda a base do sindicato.', dados: PARCEIRO, cor: '#6E5A97', numero: '03' })}

<!-- Roteiro -->
<section class="pagina" style="--cor:#2E9E8D">
  <header class="topo">
    <img src="${LOGO}" alt="">
    <div><b>Sindibes</b><span>Sindicato da Beleza de Uberlândia</span></div>
    <span class="num">04</span>
  </header>

  <div class="selo">Roteiro da ligação</div>
  <h2>Como conduzir a conversa</h2>
  <p class="linha-fina">Sequência curta para usar no telefone. O objetivo de toda ligação é o mesmo: mandar o link e ver o cadastro preenchido.</p>

  <div style="margin-top:8mm">
    ${ROTEIRO.map(([t, f], i) => `
      <div class="passo">
        <div class="n">${i + 1}</div>
        <div><h4>${t}</h4><p class="fala">${f}</p></div>
      </div>`).join('')}
  </div>

  <h3>Links para ter sempre à mão</h3>
  <div class="links">
    <div><b>Cadastro de associado</b><span>${SITE}/faca-parte/associado</span></div>
    <div><b>Cadastro de parceiro</b><span>${SITE}/faca-parte/parceiro</span></div>
    <div><b>Vitrine de associados</b><span>${SITE}/associados</span></div>
    <div><b>Vitrine de parceiros</b><span>${SITE}/parceiros</span></div>
    <div><b>Plano odontológico</b><span>${SITE}/plano-odontologico</span></div>
    <div><b>Convenções coletivas</b><span>${SITE}/institucional/convencoes</span></div>
  </div>

  <div class="contato">
    <div><b>WhatsApp</b>${CONTATO.whats}</div>
    <div><b>Atendimento</b>${CONTATO.horario}</div>
    <div><b>E-mail</b>${CONTATO.email}</div>
  </div>
</section>

</body></html>`

const htmlPath = path.join(__dirname, 'guia-cadastro-sindibes.html')
const pdfPath = path.join(__dirname, 'Guia-Cadastro-Sindibes.pdf')
fs.writeFileSync(htmlPath, html, 'utf8')

execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--print-to-pdf=' + pdfPath,
  '--no-pdf-header-footer',
  'file:///' + htmlPath.replace(/\\/g, '/'),
], { stdio: 'inherit' })

const kb = (fs.statSync(pdfPath).size / 1024).toFixed(0)
console.log('PDF gerado: ' + pdfPath + ' (' + kb + ' KB)')
