/**
 * Gera os dois folders de captação (Associado e Parceiro) em PDF.
 * Cada um: logo, benefícios, ferramentas, passo a passo e CTA para falar
 * com o Wagner no WhatsApp dele.
 *
 * Uso: node material/gerar-folders.js
 */
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const RAIZ = path.join(__dirname, '..')
const QR_DIR = process.env.QR_DIR || path.join(__dirname, 'qr')

const b64 = (arq, tipo) => `data:${tipo};base64,${fs.readFileSync(arq).toString('base64')}`
const LOGO = b64(path.join(RAIZ, 'public/images/logo.jpg'), 'image/jpeg')
const WAGNER = b64(path.join(RAIZ, 'public/images/atendente-wagner.jpg'), 'image/jpeg')

// WhatsApp do Wagner usado nos folders (pedido do Rogério em 08/10/2026)
const WHATS = '5534984430840'
const WHATS_DISPLAY = '(34) 98443-0840'
const HORARIO = 'Segunda a sexta, das 8h30 às 16h'
const SITE = 'https://sindibes.com.br'

const waLink = (msg) => `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`

/* Ícones no traço do Lucide (24x24) */
const ICONES = {
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  graduation: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  card: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
  badge: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
}
const icone = (nome, cls = 'ic') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONES[nome]}</svg>`

const WHATS_SVG = `<svg viewBox="0 0 24 24" class="wa" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`

/* ─────────────── Conteúdo ─────────────── */

const DOCS = {
  associado: {
    arquivo: 'Sindibes-Seja-Associado.pdf',
    cor: '#2E9E8D',
    corEscura: '#1d6f63',
    selo: 'Para profissionais e negócios da beleza',
    titulo: 'Seja <em>Associado</em><br>Sindibes',
    sub: 'Apoio jurídico, contábil e de saúde, qualificação profissional e uma página do seu negócio no site do sindicato. Tudo isso com o Sindicato da Beleza de Uberlândia ao seu lado.',
    publico: 'Salões, barbearias, esmalterias, clínicas de estética e profissionais autônomos',
    beneficios: [
      ['heart', 'Plano de saúde e odontológico', 'Preços negociados coletivamente pelo sindicato, bem abaixo do valor individual.'],
      ['briefcase', 'Assessoria jurídica e contábil', 'Especialistas que conhecem a rotina e a legislação do setor da beleza.'],
      ['graduation', 'Treinamentos com certificado', 'Cursos e qualificações reconhecidos para você e sua equipe.'],
      ['card', 'Crédito facilitado', 'Condições diferenciadas para investir e crescer o seu negócio.'],
      ['badge', 'Regularização e certificação', 'Apoio para deixar o estabelecimento em dia e certificado.'],
      ['tag', 'Descontos em parceiros', 'Condições exclusivas em empresas parceiras da cidade.'],
      ['shield', 'Representação sindical', 'Defesa dos seus direitos e da convenção coletiva da categoria.'],
      ['globe', 'Página própria no site', 'Seu negócio na vitrine de associados, com fotos, contatos e mapa.'],
    ],
    ferramentasTitulo: 'Ferramentas da área do associado',
    ferramentas: [
      'Página exclusiva do seu negócio na vitrine de associados',
      'Fotos do espaço, horário de atendimento e mapa com a localização',
      'Botão de WhatsApp para o cliente falar direto com você',
      'Sua página encontrada no Google, dentro do site do sindicato',
      'Convenções coletivas sempre atualizadas para consulta',
      'Agenda de eventos, cursos e assembleias do sindicato',
    ],
    mock: { categoria: 'Salão de Beleza', nome: 'Seu Negócio Aqui', linha: 'Associado Sindibes' },
    passos: [
      ['Fale com o Wagner', 'Chame no WhatsApp e tire todas as suas dúvidas sobre a associação.'],
      ['Faça o cadastro', 'Leva cerca de 5 minutos. Se preferir, o Wagner preenche com você.'],
      ['Página no ar', 'Nossa equipe revisa os dados e publica a página do seu negócio.'],
    ],
    ctaTitulo: 'Quer fazer parte?<br>Fale com o Wagner.',
    ctaTexto: 'Ele explica cada benefício, tira suas dúvidas e te acompanha no cadastro até a sua página entrar no ar.',
    msg: 'Olá, Wagner! Recebi o material do Sindibes e quero saber mais sobre ser associado.',
    qr: 'qr-associado.svg',
    form: SITE + '/faca-parte/associado',
  },

  parceiro: {
    arquivo: 'Sindibes-Seja-Parceiro.pdf',
    cor: '#6E5A97',
    corEscura: '#4c3d6e',
    selo: 'Para empresas que querem crescer no setor da beleza',
    titulo: 'Seja <em>Parceiro</em><br>Sindibes',
    sub: 'Coloque a sua marca na frente dos profissionais e negócios da beleza de Uberlândia, com o selo oficial e a divulgação do sindicato.',
    publico: 'Distribuidoras, escolas, clínicas, fornecedores e prestadores de serviço',
    beneficios: [
      ['globe', 'Página própria na vitrine', 'Espaço exclusivo no site do sindicato, com fotos, textos e contatos.'],
      ['award', 'Selo oficial Parceiro Sindibes', 'Credibilidade para usar na comunicação da sua empresa.'],
      ['megaphone', 'Divulgação contínua', 'No site, nas redes sociais, na newsletter e nos eventos do sindicato.'],
      ['users', 'Visibilidade no setor', 'Sua marca vista por salões, barbearias, clínicas e profissionais.'],
      ['calendar', 'Campanhas ao longo do ano', 'Divulgação preferencial nas ações e campanhas do sindicato.'],
      ['tag', 'Acesso à base da categoria', 'Contato com os profissionais da beleza de Uberlândia.'],
    ],
    ferramentasTitulo: 'Ferramentas da área do parceiro',
    ferramentas: [
      'Página da sua empresa na vitrine de parceiros do site',
      'O seu desconto em destaque para todos os associados',
      'Selo de Parceiro Oficial exibido na sua página',
      'Botões de WhatsApp, site e redes sociais levando o cliente até você',
      'Lista completa dos seus serviços e produtos',
      'Sua página encontrada no Google, dentro do site do sindicato',
    ],
    mock: { categoria: 'Parceiro Oficial', nome: 'Sua Empresa Aqui', linha: 'Desconto exclusivo para associados' },
    comoFunciona: 'Você oferece um desconto ou condição especial aos associados do Sindibes. Em troca, sua empresa ganha página própria, selo oficial e divulgação para toda a base do sindicato.',
    passos: [
      ['Fale com o Wagner', 'Chame no WhatsApp e conte o que sua empresa pode oferecer.'],
      ['Faça o cadastro', 'Leva cerca de 5 minutos. Se preferir, o Wagner preenche com você.'],
      ['Página no ar', 'Nossa equipe revisa os dados e publica a página da sua empresa.'],
    ],
    ctaTitulo: 'Vamos crescer juntos?<br>Fale com o Wagner.',
    ctaTexto: 'Ele apresenta a parceria, ajuda a definir o benefício para os associados e te acompanha até a sua página entrar no ar.',
    msg: 'Olá, Wagner! Recebi o material do Sindibes e quero saber mais sobre ser parceiro.',
    qr: 'qr-parceiro.svg',
    form: SITE + '/faca-parte/parceiro',
  },
}

/* ─────────────── Montagem ─────────────── */

function html(d) {
  const qr = fs.readFileSync(path.join(QR_DIR, d.qr), 'utf8')
  const wa = waLink(d.msg)
  const grade = d.beneficios.length > 6 ? 'g4' : 'g3'

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${d.arquivo}</title>
<style>
  @page { size: A4; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:"Segoe UI",system-ui,sans-serif; color:#1f2a37; --cor:${d.cor}; --escura:${d.corEscura};
         -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  a { color:inherit; text-decoration:none; }
  .pg { width:210mm; height:297mm; position:relative; overflow:hidden; page-break-after:always; }
  .pg:last-child { page-break-after:auto; }
  .ic { width:20px; height:20px; }

  /* ── Página 1 ── */
  .hero { height:118mm; background:linear-gradient(140deg,var(--escura) 0%,var(--cor) 55%,${d.cor === '#2E9E8D' ? '#6E5A97' : '#2E9E8D'} 130%);
          color:#fff; padding:15mm 16mm 0; position:relative; }
  .hero::after { content:""; position:absolute; right:-40mm; top:-30mm; width:120mm; height:120mm; border-radius:50%;
                 background:radial-gradient(circle, rgba(255,255,255,.16), rgba(255,255,255,0) 70%); }
  .topo { display:flex; align-items:center; justify-content:space-between; position:relative; z-index:1; }
  .marca { background:#fff; border-radius:14px; padding:8px 13px; box-shadow:0 10px 26px rgba(0,0,0,.22); }
  .marca img { height:44px; display:block; }
  .selo { font-size:8.5pt; letter-spacing:.16em; text-transform:uppercase; font-weight:600; color:rgba(255,255,255,.9);
          border:1px solid rgba(255,255,255,.35); border-radius:30px; padding:6px 13px; }
  h1 { font-size:42pt; line-height:1.02; font-weight:800; letter-spacing:-1px; margin-top:15mm; position:relative; z-index:1; }
  h1 em { font-style:normal; color:#ffe9a8; }
  .sub { font-size:12pt; line-height:1.55; color:rgba(255,255,255,.92); max-width:150mm; margin-top:6mm; position:relative; z-index:1; }
  .publico { position:absolute; left:16mm; bottom:-6mm; z-index:2; background:#fff; color:#1f2a37; border-radius:12px;
             padding:9px 16px; font-size:9.5pt; box-shadow:0 10px 30px rgba(31,42,55,.16); display:flex; gap:8px; align-items:center; }
  .publico b { color:var(--cor); }

  .corpo { padding:15mm 16mm 0; }
  .eyebrow { font-size:8.5pt; letter-spacing:.2em; text-transform:uppercase; font-weight:700; color:var(--cor); }
  h2 { font-size:21pt; letter-spacing:-.4px; margin:4px 0 6mm; }
  .grid { display:grid; gap:4mm; }
  .grid.g4 { grid-template-columns:1fr 1fr; }
  .grid.g3 { grid-template-columns:1fr 1fr; }
  .card { display:flex; gap:11px; padding:12px 13px; border:1px solid #e8ecf0; border-radius:14px; background:#fff;
          box-shadow:0 4px 14px rgba(31,42,55,.05); }
  .card .bola { flex:none; width:38px; height:38px; border-radius:11px; background:color-mix(in srgb, var(--cor) 13%, white);
                color:var(--cor); display:flex; align-items:center; justify-content:center; }
  .card b { display:block; font-size:10.5pt; margin-bottom:2px; }
  .card span { font-size:9pt; color:#5f6b78; line-height:1.42; }

  .como { margin-top:6mm; background:color-mix(in srgb, var(--cor) 8%, white); border-left:4px solid var(--cor);
          border-radius:0 12px 12px 0; padding:11px 15px; font-size:10pt; line-height:1.5; color:#334155; }
  .como b { color:var(--escura); }

  .faixa { position:absolute; left:0; right:0; bottom:0; height:17mm; background:#1f2a37; color:#fff;
           display:flex; align-items:center; justify-content:space-between; padding:0 16mm; font-size:9.5pt; }
  .faixa .chama { display:flex; align-items:center; gap:9px; font-weight:600; }
  .faixa .wa { width:20px; height:20px; color:#25D366; }
  .faixa .dir { color:#a9b6c4; }

  /* ── Página 2 ── */
  .p2 { padding:15mm 16mm 0; }
  .cab2 { display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #eef1f4; padding-bottom:8px; margin-bottom:8mm; }
  .cab2 img { height:28px; border-radius:6px; }
  .cab2 span { font-size:8.5pt; color:#94a0ad; letter-spacing:.12em; text-transform:uppercase; font-weight:600; }

  .ferr { display:grid; grid-template-columns:1fr 66mm; gap:9mm; align-items:start; }
  .lista { list-style:none; display:grid; gap:3.3mm; }
  .lista li { display:flex; gap:10px; font-size:10.3pt; line-height:1.4; align-items:flex-start; }
  .lista .ok { flex:none; width:20px; height:20px; border-radius:50%; background:var(--cor); color:#fff;
               display:flex; align-items:center; justify-content:center; margin-top:1px; }
  .lista .ok svg { width:12px; height:12px; stroke-width:3; }

  .mock { border-radius:16px; overflow:hidden; border:1px solid #e3e8ed; box-shadow:0 16px 36px rgba(31,42,55,.13); background:#fff; }
  .mock .barra { height:16px; background:#f1f4f7; display:flex; gap:4px; align-items:center; padding:0 8px; }
  .mock .barra i { width:6px; height:6px; border-radius:50%; background:#cfd6dd; display:block; }
  .mock .capa { height:30mm; background:linear-gradient(135deg,var(--escura),var(--cor)); position:relative; padding:9px; display:flex; flex-direction:column; justify-content:flex-end; color:#fff; }
  .mock .capa small { background:rgba(255,255,255,.95); color:var(--cor); font-size:6.5pt; font-weight:700; border-radius:20px; padding:2px 7px; width:max-content; margin-bottom:4px; }
  .mock .capa b { font-size:12pt; }
  .mock .info { padding:9px 10px 11px; }
  .mock .info p { font-size:7.5pt; color:#64748b; margin-bottom:7px; }
  .mock .linha { height:5px; border-radius:3px; background:#eef1f4; margin-bottom:4px; }
  .mock .botoes { display:flex; gap:5px; margin-top:8px; }
  .mock .botoes span { flex:1; text-align:center; font-size:6.5pt; font-weight:700; border-radius:7px; padding:5px 0; }
  .mock .botoes .v { background:#25D366; color:#fff; }
  .mock .botoes .c { background:#f1f4f7; color:#475569; }
  .mock-leg { text-align:center; font-size:8pt; color:#94a0ad; margin-top:7px; }

  .passos { display:grid; grid-template-columns:repeat(3,1fr); gap:5mm; margin-top:4mm; }
  .passo { position:relative; padding:13px 13px 12px; border-radius:14px; background:#f7f9fb; border:1px solid #edf1f4; }
  .passo .n { width:28px; height:28px; border-radius:50%; background:var(--cor); color:#fff; font-weight:800; font-size:11pt;
              display:flex; align-items:center; justify-content:center; margin-bottom:8px; }
  .passo b { display:block; font-size:10.5pt; margin-bottom:3px; }
  .passo span { font-size:9pt; color:#5f6b78; line-height:1.45; }

  .cta { position:absolute; left:16mm; right:16mm; bottom:22mm; border-radius:20px; overflow:hidden; color:#fff;
         background:linear-gradient(135deg,#1f2a37 0%,#24323f 55%,var(--escura) 140%);
         display:grid; grid-template-columns:38mm 1fr 36mm; gap:7mm; align-items:center; padding:9mm 9mm; }
  .foto { width:38mm; height:38mm; border-radius:50%; overflow:hidden; border:3px solid var(--cor); box-shadow:0 0 0 6px rgba(255,255,255,.08); }
  .foto img { width:100%; height:100%; object-fit:cover; object-position:center 20%; }
  .cta .eyebrow { color:#7fe0cf; }
  .cta h3 { font-size:17pt; line-height:1.15; margin:3px 0 7px; letter-spacing:-.3px; }
  .cta p { font-size:9.5pt; color:#c9d3dd; line-height:1.5; }
  .botao { display:inline-flex; align-items:center; gap:9px; background:#25D366; color:#fff; font-weight:700; font-size:11.5pt;
           border-radius:12px; padding:10px 16px; margin-top:10px; box-shadow:0 8px 20px rgba(37,211,102,.32); }
  .botao .wa { width:20px; height:20px; }
  .meta { display:flex; gap:14px; margin-top:9px; font-size:8.5pt; color:#a9b6c4; }
  .meta span { display:flex; align-items:center; gap:5px; }
  .meta svg { width:13px; height:13px; }
  .qr { background:#fff; border-radius:14px; padding:9px; text-align:center; }
  .qr svg { width:100%; height:auto; display:block; }
  .qr small { display:block; color:#1f2a37; font-size:7pt; font-weight:700; margin-top:5px; letter-spacing:.04em; }

  .rodape { position:absolute; left:16mm; right:16mm; bottom:8mm; display:flex; justify-content:space-between; font-size:8.5pt; color:#94a0ad; }
  .rodape a { color:var(--cor); font-weight:600; }
</style></head><body>

<!-- Página 1 -->
<section class="pg">
  <div class="hero">
    <div class="topo">
      <div class="marca"><img src="${LOGO}" alt="Sindibes"></div>
      <div class="selo">${d.selo}</div>
    </div>
    <h1>${d.titulo}</h1>
    <p class="sub">${d.sub}</p>
    <div class="publico">${icone('users')}<span><b>Para quem é:</b> ${d.publico}</span></div>
  </div>

  <div class="corpo">
    <div class="eyebrow">Benefícios</div>
    <h2>O que você ganha</h2>
    <div class="grid ${grade}">
      ${d.beneficios.map(([ic, t, s]) => `
        <div class="card"><div class="bola">${icone(ic)}</div><div><b>${t}</b><span>${s}</span></div></div>`).join('')}
    </div>
    ${d.comoFunciona ? `<div class="como"><b>Como funciona a parceria:</b> ${d.comoFunciona}</div>` : ''}
  </div>

  <a class="faixa" href="${wa}">
    <div class="chama">${WHATS_SVG} Fale com o Wagner no WhatsApp: ${WHATS_DISPLAY}</div>
    <div class="dir">Continue na próxima página</div>
  </a>
</section>

<!-- Página 2 -->
<section class="pg">
  <div class="p2">
    <div class="cab2"><img src="${LOGO}" alt="Sindibes"><span>Sindicato da Beleza de Uberlândia</span></div>

    <div class="eyebrow">Ferramentas</div>
    <h2>${d.ferramentasTitulo}</h2>
    <div class="ferr">
      <ul class="lista">
        ${d.ferramentas.map(f => `<li><span class="ok">${icone('check')}</span><span>${f}</span></li>`).join('')}
      </ul>
      <div>
        <div class="mock">
          <div class="barra"><i></i><i></i><i></i></div>
          <div class="capa"><small>${d.mock.categoria}</small><b>${d.mock.nome}</b></div>
          <div class="info">
            <p>${d.mock.linha}</p>
            <div class="linha" style="width:92%"></div><div class="linha" style="width:78%"></div><div class="linha" style="width:85%"></div>
            <div class="botoes"><span class="v">WhatsApp</span><span class="c">Como chegar</span></div>
          </div>
        </div>
        <div class="mock-leg">Exemplo da sua página no site</div>
      </div>
    </div>

    <div class="eyebrow" style="margin-top:9mm">Passo a passo</div>
    <h2>Como entrar</h2>
    <div class="passos">
      ${d.passos.map(([t, s], i) => `<div class="passo"><div class="n">${i + 1}</div><b>${t}</b><span>${s}</span></div>`).join('')}
    </div>
  </div>

  <div class="cta">
    <div class="foto"><img src="${WAGNER}" alt="Wagner"></div>
    <div>
      <div class="eyebrow">Atendimento Sindibes</div>
      <h3>${d.ctaTitulo}</h3>
      <p>${d.ctaTexto}</p>
      <a class="botao" href="${wa}">${WHATS_SVG} ${WHATS_DISPLAY}</a>
      <div class="meta"><span>${icone('clock')} ${HORARIO}</span></div>
    </div>
    <a class="qr" href="${wa}">${qr}<small>APONTE A CÂMERA</small></a>
  </div>

  <div class="rodape">
    <span>Prefere se cadastrar sozinho? <a href="${d.form}">${d.form.replace('https://', '')}</a></span>
    <span>sindibes.com.br</span>
  </div>
</section>
</body></html>`
}

for (const [chave, d] of Object.entries(DOCS)) {
  const htmlPath = path.join(__dirname, `.folder-${chave}.html`)
  const pdfPath = path.join(__dirname, d.arquivo)
  fs.writeFileSync(htmlPath, html(d), 'utf8')
  execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless', '--disable-gpu', '--no-sandbox',
    '--print-to-pdf=' + pdfPath, '--no-pdf-header-footer',
    'file:///' + htmlPath.replace(/\\/g, '/'),
  ], { stdio: 'ignore' })
  console.log(`${d.arquivo}: ${(fs.statSync(pdfPath).size / 1024).toFixed(0)} KB`)
}
