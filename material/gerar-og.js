/**
 * Gera as imagens de prévia de link (WhatsApp, Facebook, LinkedIn) em 1200x630.
 * Saída em PNG intermediário; a conversão para JPEG leve é feita depois.
 *
 * Uso: node material/gerar-og.js <pasta-de-saida>
 */
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const RAIZ = path.join(__dirname, '..')
const SAIDA = process.argv[2] || path.join(__dirname, 'og')
fs.mkdirSync(SAIDA, { recursive: true })

const b64 = (arq) => `data:image/jpeg;base64,${fs.readFileSync(path.join(RAIZ, 'public/images', arq)).toString('base64')}`
const LOGO = b64('logo.jpg')

const PECAS = {
  associado: {
    cor: '#2E9E8D', escura: '#1d6f63',
    foto: 'ambiente-cabeleireiro.jpg',
    selo: 'Associado Sindibes',
    titulo: 'Seu negócio com<br><em>página própria</em><br>no site do sindicato',
    sub: 'Cadastre-se e tenha os benefícios do Sindibes',
  },
  parceiro: {
    cor: '#6E5A97', escura: '#4c3d6e',
    foto: 'servico-beneficios.jpg',
    selo: 'Parceiro Sindibes',
    titulo: 'Sua empresa em<br><em>destaque</em> para o<br>setor da beleza',
    sub: 'Cadastre-se e ganhe uma página no site do sindicato',
  },
  site: {
    cor: '#2E9E8D', escura: '#1d6f63',
    foto: 'hero1.jpg',
    selo: 'Sindicato da Beleza de Uberlândia',
    titulo: 'Apoio, benefícios e<br><em>qualificação</em> para<br>a beleza',
    sub: 'Saúde, assessoria jurídica e contábil, cursos e mais',
  },
}

function html(p) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; overflow:hidden; font-family:"Segoe UI",system-ui,sans-serif; }
  .tela { position:relative; width:1200px; height:630px; display:grid; grid-template-columns:690px 510px;
          background:linear-gradient(140deg, ${p.escura} 0%, ${p.cor} 70%); }
  .txt { padding:58px 0 0 64px; color:#fff; position:relative; z-index:2; }
  .marca { background:#fff; border-radius:18px; padding:10px 16px; display:inline-block; box-shadow:0 12px 30px rgba(0,0,0,.25); }
  .marca img { height:58px; display:block; }
  .selo { margin-top:40px; display:inline-block; font-size:19px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
          border:2px solid rgba(255,255,255,.55); border-radius:40px; padding:8px 20px; }
  h1 { margin-top:20px; font-size:58px; line-height:1.06; font-weight:800; letter-spacing:-1.2px; }
  h1 em { font-style:normal; color:#ffe9a8; }
  .sub { margin-top:22px; font-size:25px; color:rgba(255,255,255,.92); }
  .foto { position:relative; overflow:hidden; }
  .foto img { width:100%; height:100%; object-fit:cover; }
  .foto::before { content:""; position:absolute; inset:0; background:linear-gradient(90deg, ${p.cor} 0%, rgba(0,0,0,0) 38%); z-index:1; }
  .url { position:absolute; right:28px; bottom:26px; z-index:2; background:#fff; color:#1f2a37; font-size:22px; font-weight:700;
         border-radius:14px; padding:12px 20px; box-shadow:0 10px 26px rgba(0,0,0,.25); }
  .url b { color:${p.cor}; }
</style></head><body>
<div class="tela">
  <div class="txt">
    <div class="marca"><img src="${LOGO}"></div><br>
    <div class="selo">${p.selo}</div>
    <h1>${p.titulo}</h1>
    <div class="sub">${p.sub}</div>
  </div>
  <div class="foto"><img src="${b64(p.foto)}"><div class="url"><b>sindibes</b>.com.br</div></div>
</div></body></html>`
}

for (const [nome, p] of Object.entries(PECAS)) {
  const h = path.join(SAIDA, `.${nome}.html`)
  const png = path.join(SAIDA, `${nome}.png`)
  fs.writeFileSync(h, html(p), 'utf8')
  execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--window-size=1200,630', '--screenshot=' + png, 'file:///' + h.replace(/\\/g, '/'),
  ], { stdio: 'ignore' })
  fs.unlinkSync(h)
  console.log(`${nome}.png: ${(fs.statSync(png).size / 1024).toFixed(0)} KB`)
}
