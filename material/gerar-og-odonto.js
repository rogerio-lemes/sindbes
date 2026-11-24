/**
 * Gera a imagem de prévia do link da página Plano Odontológico (1200x630),
 * a que aparece no WhatsApp, Facebook e LinkedIn ao compartilhar
 * sindibes.com.br/plano-odontologico.
 *
 * Mesmo padrão da prévia da Lei Salão-Parceiro (3 colunas, mensagem no
 * quadrado central), mas em tom de benefício (verde-água) em vez de alerta,
 * com chamada para responder e cotar o plano com o Wagner.
 *
 * Uso: node material/gerar-og-odonto.js
 * Saída: public/images/og/plano-odontologico.jpg
 */
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const sharp = require('sharp')

const RAIZ = path.join(__dirname, '..')
const b64 = (arq) => `data:image/jpeg;base64,${fs.readFileSync(path.join(RAIZ, 'public/images', arq)).toString('base64')}`

// Ícone de dente (traço branco)
const ICONE_DENTE = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 3C5 3 3.5 5 3.5 7.6c0 2 .8 3.4 1.4 5 .6 1.7.7 3.6 1.1 5.4.4 1.8 1 3 2 3 1.3 0 1.4-1.8 1.8-3.6.3-1.4.9-2.4 2.2-2.4s1.9 1 2.2 2.4c.4 1.8.5 3.6 1.8 3.6 1 0 1.6-1.2 2-3 .4-1.8.5-3.7 1.1-5.4.6-1.6 1.4-3 1.4-5C20.5 5 19 3 16.5 3c-1.9 0-2.9 1-4.5 1S9.4 3 7.5 3z"/></svg>`
const ICONE_WHATS = `<svg viewBox="0 0 32 32" width="40" height="40" fill="#fff"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.4 9.8 10.2 5.1 16 5.1s10.6 4.7 10.6 10.5S21.8 26 16 26zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.300-.5-2.5-1.6-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.7 5.8 5.1 2.9 1.1 3.4.9 4 .8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`
const CHECK = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8FD9CE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1200px; height:630px; overflow:hidden; font-family:"Segoe UI",system-ui,sans-serif; background:#13213F; }
/* Composição em 3 colunas: o quadrado central (630x630) tem a mensagem inteira,
   porque o WhatsApp às vezes mostra só um recorte quadrado do meio. */
.tela { position:relative; width:1200px; height:630px; overflow:hidden; background:#13213F; }
.lado { position:absolute; top:0; width:330px; height:630px; overflow:hidden; }
.lado img { width:100%; height:100%; object-fit:cover; }
.esq { left:0; } .esq img { object-position:38% 50%; }
.dir { right:0; } .dir img { object-position:50% 15%; }
.esq::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(19,33,63,.15),#13213F 96%); }
.dir::after { content:""; position:absolute; inset:0; background:linear-gradient(270deg,rgba(19,33,63,.05),#13213F 96%); }
.brilho { position:absolute; inset:0; background:radial-gradient(ellipse 45% 70% at 50% 0%,rgba(42,175,160,.5),transparent 70%); }
.faixa { position:absolute; left:0; right:0; top:0; height:12px; background:linear-gradient(90deg,#2AAFA0,#FFC94D 50%,#2AAFA0); z-index:3; }
.centro { position:absolute; left:285px; width:630px; top:0; height:630px; z-index:2; display:flex; flex-direction:column;
  align-items:center; justify-content:center; text-align:center; color:#fff; padding:0 24px; }
.selo { display:inline-flex; align-items:center; gap:12px; background:#2AAFA0; color:#fff; font-size:22px; font-weight:800;
  letter-spacing:.1em; text-transform:uppercase; border-radius:40px; padding:10px 24px 10px 12px; box-shadow:0 10px 30px rgba(42,175,160,.55); }
.selo i { width:42px; height:42px; border-radius:50%; background:rgba(255,255,255,.22); display:flex; align-items:center; justify-content:center; }
h1 { margin-top:24px; font-size:70px; line-height:1; font-weight:900; letter-spacing:-2px; text-shadow:0 6px 24px rgba(0,0,0,.5); }
h1 em { font-style:normal; color:#FFC94D; }
.sub { margin-top:16px; font-size:27px; font-weight:700; color:#fff; }
.sub span { color:#8FD9CE; }
.itens { margin-top:14px; display:flex; gap:22px; font-size:19px; font-weight:600; color:#fff; }
.itens b { display:inline-flex; align-items:center; gap:6px; font-weight:600; }
.cta { margin-top:26px; display:flex; align-items:center; gap:14px; background:#25D366; color:#fff; border-radius:20px;
  padding:16px 28px 16px 18px; box-shadow:0 16px 36px rgba(0,0,0,.45), 0 0 0 6px rgba(37,211,102,.28); text-align:left; }
.cta .t1 { font-size:30px; font-weight:800; line-height:1.05; }
.cta .t2 { font-size:19px; font-weight:600; margin-top:3px; }
.marca { position:absolute; left:34px; top:40px; z-index:3; background:#fff; border-radius:14px; padding:8px 14px; box-shadow:0 10px 26px rgba(0,0,0,.35); }
.marca img { height:44px; display:block; }
.nome { position:absolute; right:30px; bottom:34px; z-index:3; text-align:right; color:#fff; }
.nome b { display:block; font-size:28px; font-weight:800; }
.nome span { display:block; font-size:17px; color:#8FD9CE; font-weight:600; }
.nome em { display:inline-block; margin-top:6px; font-style:normal; font-size:15px; font-weight:700; background:#25D366; border-radius:20px; padding:4px 12px; }
</style></head><body>
<div class="tela">
  <div class="lado esq"><img src="${b64('servico-plano-odonto.jpg')}"></div>
  <div class="lado dir"><img src="${b64('atendente-wagner.jpg')}"></div>
  <div class="brilho"></div>
  <div class="faixa"></div>
  <div class="marca"><img src="${b64('logo.jpg')}"></div>
  <div class="centro">
    <div class="selo"><i>${ICONE_DENTE}</i>Benefício Sindibes</div>
    <h1>Seu sorriso<br>em dia, pagando <em>menos</em></h1>
    <div class="sub">Plano Odontológico · <span>até 50% mais barato</span></div>
    <div class="itens"><b>${CHECK}Consultas e limpeza</b><b>${CHECK}Canal</b><b>${CHECK}Dependentes</b></div>
    <div class="cta">${ICONE_WHATS}<div><div class="t1">Responda esta mensagem</div><div class="t2">e cote seu plano agora com o Wagner</div></div></div>
  </div>
  <div class="nome"><b>Wagner</b><span>Consultor do Sindibes</span><em>● online no WhatsApp</em></div>
</div></body></html>`

async function main() {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'og-odonto-'))
  const h = path.join(tmp, 'og.html')
  const png = path.join(tmp, 'og.png')
  fs.writeFileSync(h, HTML, 'utf8')
  execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--window-size=1200,630', '--screenshot=' + png, 'file:///' + h.replace(/\\/g, '/'),
  ], { stdio: 'ignore' })
  const saida = path.join(RAIZ, 'public/images/og/plano-odontologico.jpg')
  const info = await sharp(png).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile(saida)
  fs.rmSync(tmp, { recursive: true, force: true })
  console.log(`plano-odontologico.jpg: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`)
}
main()
