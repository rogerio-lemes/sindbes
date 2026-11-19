/**
 * Gera a imagem de prévia do link da página Lei Salão-Parceiro (1200x630),
 * a que aparece no WhatsApp, Facebook e LinkedIn ao compartilhar
 * sindibes.com.br/lei-salao-parceiro.
 *
 * Visual de alerta + chamada para responder no WhatsApp e falar com o Wagner.
 *
 * Uso: node material/gerar-og-lei.js
 * Saída: public/images/og/lei-salao-parceiro.jpg
 */
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const sharp = require('sharp')

const RAIZ = path.join(__dirname, '..')
const b64 = (arq) => `data:image/jpeg;base64,${fs.readFileSync(path.join(RAIZ, 'public/images', arq)).toString('base64')}`

const ICONE_ALERTA = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
const ICONE_WHATS = `<svg viewBox="0 0 32 32" width="40" height="40" fill="#fff"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.4 9.8 10.2 5.1 16 5.1s10.6 4.7 10.6 10.5S21.8 26 16 26zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.7 5.8 5.1 2.9 1.1 3.4.9 4 .8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1200px; height:630px; overflow:hidden; font-family:"Segoe UI",system-ui,sans-serif; background:#1B2444; }
.tela { position:relative; width:1200px; height:630px; overflow:hidden; background:#1B2444; }
.foto { position:absolute; right:0; top:0; width:560px; height:630px; }
.foto img { width:100%; height:100%; object-fit:cover; object-position:40% 30%; filter:saturate(.85) contrast(1.05); }
.foto::before { content:""; position:absolute; inset:0; z-index:1;
  background:linear-gradient(90deg,#1B2444 0%,rgba(27,36,68,.75) 30%,rgba(27,36,68,.15) 70%,rgba(27,36,68,.35) 100%); }
.brilho { position:absolute; inset:0; background:radial-gradient(ellipse 70% 80% at 0% 0%,rgba(220,38,38,.42),transparent 60%); }
.faixa { position:absolute; left:0; right:0; top:0; height:12px; background:linear-gradient(90deg,#dc2626,#FFC94D 50%,#dc2626); z-index:3; }
.txt { position:absolute; left:60px; top:52px; width:690px; color:#fff; z-index:2; }
.topo { display:flex; align-items:center; gap:18px; }
.marca { background:#fff; border-radius:14px; padding:8px 14px; box-shadow:0 10px 26px rgba(0,0,0,.35); }
.marca img { height:46px; display:block; }
.selo { display:inline-flex; align-items:center; gap:12px; background:#dc2626; color:#fff; font-size:20px; font-weight:800;
  letter-spacing:.12em; text-transform:uppercase; border-radius:40px; padding:10px 22px 10px 12px; box-shadow:0 10px 30px rgba(220,38,38,.55); }
.selo i { width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,.22); display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 0 6px rgba(255,255,255,.12); }
h1 { margin-top:30px; font-size:62px; line-height:1.03; font-weight:800; letter-spacing:-1.5px; }
h1 em { font-style:normal; color:#FFC94D; }
.sub { margin-top:16px; font-size:25px; line-height:1.35; color:rgba(255,255,255,.88); }
.sub b { color:#fff; }
.cta { position:absolute; left:60px; bottom:44px; z-index:3; display:flex; align-items:center; gap:18px;
  background:#25D366; color:#fff; border-radius:22px; padding:16px 30px 16px 20px;
  box-shadow:0 18px 40px rgba(0,0,0,.45), 0 0 0 6px rgba(37,211,102,.25); }
.cta .t1 { font-size:29px; font-weight:800; line-height:1.05; }
.cta .t2 { font-size:19px; font-weight:600; opacity:.95; margin-top:4px; }
.wagner { position:absolute; right:40px; bottom:40px; z-index:3; display:flex; align-items:center; gap:14px;
  background:rgba(255,255,255,.96); border-radius:20px; padding:12px 20px 12px 12px; box-shadow:0 16px 36px rgba(0,0,0,.4); }
.wagner .av { width:74px; height:74px; border-radius:50%; overflow:hidden; border:3px solid #25D366; position:relative; }
.wagner .av img { width:100%; height:100%; object-fit:cover; object-position:50% 12%; transform:scale(1.5); transform-origin:50% 18%; }
.wagner .n { font-size:24px; font-weight:800; color:#1B2444; }
.wagner .c { font-size:16px; font-weight:600; color:#2E9E8D; margin-top:2px; }
.wagner .on { font-size:15px; color:#16a34a; font-weight:700; margin-top:3px; }
.lei { position:absolute; right:40px; top:44px; z-index:3; font-size:17px; font-weight:700; color:#fff; letter-spacing:.1em;
  border:2px solid rgba(255,255,255,.5); border-radius:30px; padding:8px 18px; background:rgba(27,36,68,.45); }
</style></head><body>
<div class="tela">
  <div class="foto"><img src="${b64('lei-salao-parceiro/hero.jpg')}"></div>
  <div class="brilho"></div>
  <div class="faixa"></div>
  <div class="lei">LEI 13.352/2016</div>
  <div class="txt">
    <div class="topo">
      <div class="marca"><img src="${b64('logo.jpg')}"></div>
      <div class="selo"><i>${ICONE_ALERTA}</i>Alerta ao dono de salão</div>
    </div>
    <h1>Seu salão pode estar<br>em <em>risco</em> sem a<br>Lei Salão-Parceiro</h1>
    <div class="sub">Profissional sem contrato homologado, até parente,<br>pode virar <b>ação trabalhista e multa</b>.</div>
  </div>
  <div class="cta">${ICONE_WHATS}<div><div class="t1">Responda esta mensagem</div><div class="t2">e seja atendido agora pelo Wagner</div></div></div>
  <div class="wagner">
    <div class="av"><img src="${b64('atendente-wagner.jpg')}"></div>
    <div><div class="n">Wagner</div><div class="c">Consultor do Sindibes</div><div class="on">● online no WhatsApp</div></div>
  </div>
</div></body></html>`

async function main() {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'og-lei-'))
  const h = path.join(tmp, 'og.html')
  const png = path.join(tmp, 'og.png')
  fs.writeFileSync(h, HTML, 'utf8')
  execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--window-size=1200,630', '--screenshot=' + png, 'file:///' + h.replace(/\\/g, '/'),
  ], { stdio: 'ignore' })
  const saida = path.join(RAIZ, 'public/images/og/lei-salao-parceiro.jpg')
  const info = await sharp(png).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile(saida)
  fs.rmSync(tmp, { recursive: true, force: true })
  console.log(`lei-salao-parceiro.jpg: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`)
}
main()
