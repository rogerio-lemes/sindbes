import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { SITE } from '@/lib/constants'
import { getTenant } from '@/lib/tenant'
import { slugify } from '@/lib/slug'
import { PARCEIROS } from '@/lib/parceiros'
import { ASSOCIADOS } from '@/lib/associados'
import { normalizarWhatsapp, enderecoEmLinha, type EnderecoCadastro, type RedeCadastro } from '@/lib/cadastros'

const FALLBACK_TENANT_ID = '00000000-0000-0000-0000-000000000001'
const ORIGEM_PADRAO = 'https://sindibes.com.br'
const BUCKET = 'tenant-uploads'

/** Regras dos arquivos recebidos (o navegador já reduz as fotos antes). */
const TIPOS_IMAGEM: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
const MAX_ARQUIVO_BYTES = 2 * 1024 * 1024
const MAX_ARQUIVOS = 11

/**
 * Destinatários fixos dos cadastros. RESEND_TO_EMAIL (separado por vírgula)
 * soma endereços a esta lista, mas nunca remove os dois daqui.
 */
const DESTINOS_FIXOS = ['comercial@mercadoopen.com.br', 'adm.sindibes@gmail.com']

/** Menos que isso no formulário não é gente preenchendo. */
const TEMPO_MINIMO_MS = 4000

/** Robô: preencheu o campo armadilha ou enviou rápido demais. */
function pareceRobo(fd: FormData) {
  const armadilha = fd.get('_hp')
  const tempo = Number(fd.get('_t'))
  return (typeof armadilha === 'string' && armadilha.trim() !== '') || !Number.isFinite(tempo) || tempo < TEMPO_MINIMO_MS
}

/** IP de quem envia, guardado só como hash (não dá para voltar ao IP). */
function hashDoIp(request: Request, tenantId: string) {
  const h = request.headers
  const ip = (h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'desconhecido').trim()
  return createHash('sha256').update(`${tenantId}:${ip}:sindibes-cadastro`).digest('hex')
}

function destinatarios() {
  const extras = (process.env.RESEND_TO_EMAIL || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
  return [...new Set([...DESTINOS_FIXOS, ...extras])]
}

const txt = (fd: FormData, k: string) => {
  const v = fd.get(k)
  return typeof v === 'string' ? v.trim() : ''
}

/** Lê campos numerados (descricao_0, descricao_1...) na ordem. */
function lista(fd: FormData, prefixo: string) {
  const itens: string[] = []
  for (let i = 0; i < 50; i++) {
    const v = txt(fd, `${prefixo}_${i}`)
    if (v) itens.push(v)
  }
  return itens
}

/** Redes sociais como lista estruturada {tipo, url}. */
function redesLista(fd: FormData): RedeCadastro[] {
  const r: RedeCadastro[] = []
  for (let i = 0; i < 20; i++) {
    const url = txt(fd, `rede_${i}_url`)
    if (url) r.push({ tipo: txt(fd, `rede_${i}_tipo`) || 'rede', url })
  }
  return r
}

function redes(fd: FormData) {
  return redesLista(fd).map(r => `${r.tipo}: ${r.url}`)
}

/** Endereço estruturado, só com os campos preenchidos. */
function enderecoObj(fd: FormData): EnderecoCadastro {
  const e: EnderecoCadastro = {
    rua: txt(fd, 'end_rua'), numero: txt(fd, 'end_numero'), complemento: txt(fd, 'end_complemento'),
    bairro: txt(fd, 'end_bairro'), cidade: txt(fd, 'end_cidade'), uf: txt(fd, 'end_uf'), cep: txt(fd, 'end_cep'),
  }
  return Object.fromEntries(Object.entries(e).filter(([, v]) => v)) as EnderecoCadastro
}

function endereco(fd: FormData) {
  const rua = [txt(fd, 'end_rua'), txt(fd, 'end_numero')].filter(Boolean).join(', ')
  const cidade = [txt(fd, 'end_cidade'), txt(fd, 'end_uf')].filter(Boolean).join('/')
  return [rua, txt(fd, 'end_complemento'), txt(fd, 'end_bairro'), cidade, txt(fd, 'end_cep') && `CEP ${txt(fd, 'end_cep')}`]
    .filter(Boolean)
    .join(' - ')
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Garante http(s) no endereço do site. */
const comProtocolo = (s: string) => (!s ? '' : /^https?:\/\//i.test(s) ? s : `https://${s}`)

type Linha = [string, string]
type Tipo = 'parceiro' | 'associado'

/** Monta o cadastro no formato de cada formulário. */
function lerCadastro(fd: FormData) {
  const tipo: Tipo = txt(fd, 'tipo') === 'parceiro' ? 'parceiro' : 'associado'

  if (tipo === 'parceiro') {
    const linhas: Linha[] = [
      ['Responsável', txt(fd, 'contato_nome')],
      ['Cargo', txt(fd, 'contato_cargo')],
      ['Telefone do responsável', txt(fd, 'contato_telefone')],
      ['E-mail do responsável', txt(fd, 'contato_email')],
      ['Empresa', txt(fd, 'nome')],
      ['Categoria', txt(fd, 'categoria')],
      ['WhatsApp da empresa', txt(fd, 'whatsappDisplay') || txt(fd, 'whatsapp')],
      ['Site', txt(fd, 'siteUrl') || txt(fd, 'site')],
      ['Endereço', endereco(fd)],
      ['Redes sociais', redes(fd).join('\n')],
      ['Resumo', txt(fd, 'resumo')],
      ['Descrição', lista(fd, 'descricao').join('\n\n')],
      ['Serviços', lista(fd, 'servico').map(s => `• ${s}`).join('\n')],
      ['Desconto para associados', txt(fd, 'desconto')],
    ]
    return {
      tipo,
      rotulo: 'Proposta de Parceria',
      nome: txt(fd, 'contato_nome'),
      negocio: txt(fd, 'nome'),
      telefone: txt(fd, 'contato_telefone'),
      email: txt(fd, 'contato_email'),
      linhas,
    }
  }

  const linhas: Linha[] = [
    ['Nome', txt(fd, 'nome')],
    ['Estabelecimento / profissão', txt(fd, 'empresa')],
    ['Telefone / WhatsApp', txt(fd, 'telefone')],
    ['E-mail', txt(fd, 'email')],
    ['CNPJ / CPF', txt(fd, 'cnpj')],
    ['Endereço', endereco(fd)],
    ['Redes sociais', redes(fd).join('\n')],
    ['Mensagem', txt(fd, 'mensagem')],
  ]
  return {
    tipo,
    rotulo: 'Solicitação de Associação',
    nome: txt(fd, 'nome'),
    negocio: txt(fd, 'empresa'),
    telefone: txt(fd, 'telefone'),
    email: txt(fd, 'email'),
    linhas,
  }
}

interface Arquivo { campo: string; file: File; buffer: Buffer; ext: string }

/** Capa e fotos chegam como arquivo. Valida tipo, tamanho e quantidade. */
async function lerArquivos(fd: FormData): Promise<{ arquivos: Arquivo[]; erro?: string }> {
  const arquivos: Arquivo[] = []
  for (const [k, v] of fd.entries()) {
    if ((k === 'capa' || k.startsWith('foto_')) && v instanceof File && v.size > 0) {
      const ext = TIPOS_IMAGEM[v.type]
      if (!ext) return { arquivos, erro: 'Envie apenas imagens JPG, PNG ou WEBP.' }
      if (v.size > MAX_ARQUIVO_BYTES) return { arquivos, erro: 'Cada imagem deve ter no máximo 2 MB.' }
      if (arquivos.length >= MAX_ARQUIVOS) return { arquivos, erro: `Envie no máximo ${MAX_ARQUIVOS} imagens.` }
      arquivos.push({ campo: k, file: v, buffer: Buffer.from(await v.arrayBuffer()), ext })
    }
  }
  // Capa primeiro, depois as fotos na ordem do formulário
  arquivos.sort((a, b) => (a.campo === 'capa' ? -1 : b.campo === 'capa' ? 1 : 0))
  return { arquivos }
}

/** Sugere um slug que não colida com as páginas fixas do site. O banco garante o resto. */
function slugLivre(nome: string, tipo: Tipo) {
  const base = slugify(nome, 60) || tipo
  const fixos = new Set((tipo === 'parceiro' ? PARCEIROS : ASSOCIADOS).map(p => p.slug))
  if (!fixos.has(base)) return base
  let n = 2
  while (fixos.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}

/** Endereço do site para o link do painel no e-mail. */
function origemDaRequisicao(request: Request) {
  const h = request.headers
  const host = (h.get('x-forwarded-host') || h.get('host') || '').split(',')[0].trim()
  if (!/^[a-z0-9.-]+(:\d+)?$/i.test(host)) return ORIGEM_PADRAO
  // Só confia no header origin se ele aponta para o mesmo host da requisição
  const origin = h.get('origin')
  if (origin) {
    try {
      const u = new URL(origin)
      if (u.host === host && /^https?:$/.test(u.protocol)) return `${u.protocol}//${u.host}`
    } catch { /* ignora origin inválido */ }
  }
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)
  const proto = (h.get('x-forwarded-proto') || (local ? 'http' : 'https')).split(',')[0].trim()
  return `${proto === 'http' ? 'http' : 'https'}://${host}`
}

/** Sobe capa e fotos para o storage público e devolve as URLs. */
async function subirImagens(tenantId: string, arquivos: Arquivo[]) {
  const supabase = getPublicClient()
  const pasta = `${tenantId}/cadastros/${crypto.randomUUID()}`
  let capa = ''
  const fotos: string[] = []
  let n = 0
  for (const a of arquivos) {
    const nome = a.campo === 'capa' ? `capa.${a.ext}` : `foto-${++n}.${a.ext}`
    const caminho = `${pasta}/${nome}`
    const { error } = await supabase.storage.from(BUCKET).upload(caminho, a.buffer, {
      contentType: a.file.type,
      upsert: false,
    })
    if (error) {
      console.error(`[cadastro] falha ao subir ${nome}:`, error.message)
      continue
    }
    const url = supabase.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl
    if (a.campo === 'capa') capa = url
    else fotos.push(url)
  }
  return { capa, fotos }
}

/** Remove campos vazios para não sobrescrever os padrões do banco. */
const limpar = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => {
    if (v === '' || v === undefined || v === null) return false
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'object') return Object.keys(v as object).length > 0
    return true
  }))

/** Monta os dados públicos e privados no formato da função do banco. */
function montarDados(fd: FormData, tipo: Tipo, imagens: { capa: string; fotos: string[] }) {
  const listaRedes = redesLista(fd)
  const instagram = listaRedes.find(r => r.tipo === 'instagram')?.url || ''
  const end = enderecoObj(fd)

  if (tipo === 'parceiro') {
    const nome = txt(fd, 'nome')
    const dados = limpar({
      nome,
      slug: slugLivre(nome, tipo),
      categoria: txt(fd, 'categoria'),
      resumo: txt(fd, 'resumo'),
      descricao: lista(fd, 'descricao').join('\n\n'),
      servicos: lista(fd, 'servico'),
      desconto: txt(fd, 'desconto'),
      capa: imagens.capa,
      fotos: imagens.fotos,
      site_url: comProtocolo(txt(fd, 'siteUrl') || txt(fd, 'site')),
      whatsapp: normalizarWhatsapp(txt(fd, 'whatsapp') || txt(fd, 'whatsappDisplay')),
      whatsapp_display: txt(fd, 'whatsappDisplay'),
      instagram,
      redes: listaRedes,
      endereco: end,
    })
    const privado = {
      responsavel: {
        nome: txt(fd, 'contato_nome'), cargo: txt(fd, 'contato_cargo'),
        telefone: txt(fd, 'contato_telefone'), email: txt(fd, 'contato_email'),
      },
      documento: '',
      mensagem: '',
    }
    return { dados, privado }
  }

  // Associado: o título da página é o nome do estabelecimento
  const nome = txt(fd, 'empresa') || txt(fd, 'nome')
  const telefone = txt(fd, 'telefone')
  const dados = limpar({
    nome,
    slug: slugLivre(nome, tipo),
    descricao: txt(fd, 'mensagem'),
    endereco: enderecoEmLinha(end),
    endereco_detalhe: end,
    cidade: end.cidade,
    bairro: end.bairro,
    whatsapp: normalizarWhatsapp(telefone),
    telefone,
    telefone_display: telefone,
    email: txt(fd, 'email'),
    instagram,
    capa: imagens.capa,
    fotos: imagens.fotos,
    redes: listaRedes,
  })
  const privado = {
    responsavel: { nome: txt(fd, 'nome'), cargo: '', telefone, email: txt(fd, 'email') },
    documento: txt(fd, 'cnpj'),
    mensagem: txt(fd, 'mensagem'),
  }
  return { dados, privado }
}

export async function POST(request: Request) {
  try {
    const fd = await request.formData()

    // Robô recebe "sucesso" para não insistir, mas nada é gravado nem enviado
    if (pareceRobo(fd)) {
      console.warn('[cadastro] envio descartado pela proteção contra robôs')
      return NextResponse.json({ success: true })
    }

    const c = lerCadastro(fd)

    if (!c.nome || !c.telefone) {
      return NextResponse.json({ error: 'Nome e telefone são obrigatórios' }, { status: 400 })
    }

    const { arquivos, erro } = await lerArquivos(fd)
    if (erro) return NextResponse.json({ error: erro }, { status: 400 })

    let tenantId = FALLBACK_TENANT_ID
    try {
      tenantId = (await getTenant()).id || FALLBACK_TENANT_ID
    } catch (err) {
      console.error('[cadastro] falha ao resolver o tenant, usando o padrão:', err)
    }

    // Limite de envios: 3 por hora e 10 por dia por pessoa, 30 por hora no site
    if (isSupabaseConfigured()) {
      const { data: liberado, error } = await getPublicClient().rpc('sindibes_pode_enviar_cadastro', {
        p_tenant_id: tenantId,
        p_ip_hash: hashDoIp(request, tenantId),
      })
      if (error) console.error('[cadastro] falha ao checar o limite de envios:', error.message)
      else if (liberado === false) {
        return NextResponse.json(
          { error: 'Muitos envios em pouco tempo. Tente de novo mais tarde ou fale com a gente pelo WhatsApp.' },
          { status: 429 },
        )
      }
    }

    const origem = origemDaRequisicao(request)
    const caminhoPainel = c.tipo === 'parceiro' ? 'parceiros' : 'associados'

    // 1) Cria a página como "pendente" (invisível ao público até a aprovação)
    let registroId: string | null = null
    let registroSlug: string | null = null
    if (isSupabaseConfigured()) {
      try {
        const imagens = arquivos.length ? await subirImagens(tenantId, arquivos) : { capa: '', fotos: [] }
        const { dados, privado } = montarDados(fd, c.tipo, imagens)
        const { data, error } = await getPublicClient().rpc('sindibes_enviar_cadastro', {
          p_tenant_id: tenantId,
          p_tipo: c.tipo,
          p_dados: dados,
          p_privado: privado,
        })
        const ret = data as { id?: unknown; slug?: unknown } | null
        if (error) console.error('[cadastro] falha ao criar o registro pendente:', error.message)
        else if (ret?.id) {
          registroId = String(ret.id)
          registroSlug = ret.slug ? String(ret.slug) : null
        } else console.error('[cadastro] resposta inesperada da função do banco:', data)
      } catch (err) {
        console.error('[cadastro] erro ao criar o registro pendente:', err)
      }
    }
    const linkPainel = registroId ? `${origem}/admin/${caminhoPainel}/${registroId}` : null

    const preenchidas = c.linhas.filter(([, v]) => v)
    const fotos = arquivos.map(a => ({
      filename: a.campo === 'capa' ? `capa-${a.file.name}` : a.file.name,
      content: a.buffer,
    }))
    const textoCompleto = [
      ...preenchidas.map(([k, v]) => `${k}: ${v}`),
      fotos.length ? `Fotos recebidas por e-mail: ${fotos.map(f => f.filename).join(', ')}` : null,
      linkPainel ? `Página criada aguardando análise: ${linkPainel}` : null,
    ].filter(Boolean).join('\n')

    // 2) Cópia de segurança em Leads
    let gravou = false
    if (isSupabaseConfigured()) {
      const { error } = await getPublicClient().from('leads').insert({
        tenant_id: tenantId,
        nome: c.negocio ? `${c.nome} (${c.negocio})` : c.nome,
        telefone: c.telefone,
        email: c.email || null,
        mensagem: textoCompleto,
        origem: c.rotulo,
        pagina_slug: c.tipo === 'parceiro' ? 'faca-parte/parceiro' : 'faca-parte/associado',
      })
      if (error) console.error('[cadastro] falha ao gravar no banco:', error.message)
      else gravou = true
    }

    // 3) Avisa por e-mail, com o link do painel, todos os campos e as fotos anexadas
    let enviou = false
    const chave = process.env.RESEND_API_KEY
    if (chave && !chave.startsWith('<')) {
      const aviso = linkPainel
        ? `
          <div style="background:#f0faf8;border:1px solid #bfe5de;border-radius:10px;padding:16px;margin:0 0 20px;">
            <p style="margin:0 0 12px;color:#374151;">
              A página foi criada e está <strong>aguardando análise</strong>. Ela só vai ao ar depois de aprovada no painel.
            </p>
            <a href="${esc(linkPainel)}" style="display:inline-block;background:#2E9E8D;color:#ffffff;text-decoration:none;font-weight:600;padding:10px 18px;border-radius:8px;">Revisar e publicar no painel</a>
          </div>`
        : `
          <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px;margin:0 0 20px;color:#9a3412;">
            Não foi possível criar a página automaticamente. Use os dados abaixo para cadastrar pelo painel.
          </div>`

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:620px;">
          <h2 style="color:#2E9E8D;margin:0 0 4px;">${esc(c.rotulo)}</h2>
          <p style="color:#6b7280;margin:0 0 16px;">Recebido pelo site ${esc(SITE.name)}</p>
          ${aviso}
          <table style="border-collapse:collapse;width:100%;">
            ${preenchidas.map(([k, v]) => `
              <tr>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:190px;vertical-align:top;">${esc(k)}</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;white-space:pre-line;">${esc(v)}</td>
              </tr>`).join('')}
          </table>
          <p style="margin-top:16px;color:#374151;">
            ${fotos.length ? `📎 ${fotos.length} foto(s) anexada(s) a este e-mail.` : 'Nenhuma foto enviada.'}
          </p>
        </div>`

      const { error } = await new Resend(chave).emails.send({
        from: process.env.RESEND_FROM_EMAIL || `${SITE.name} <noreply@sindibes.com.br>`,
        to: destinatarios(),
        replyTo: c.email || undefined,
        subject: `[${c.rotulo}] ${c.nome}${c.negocio ? ` - ${c.negocio}` : ''}`,
        html,
        attachments: fotos,
      })
      if (error) console.error('[cadastro] falha ao enviar e-mail:', error.message)
      else enviou = true
    } else {
      console.error('[cadastro] RESEND_API_KEY ausente: e-mail não enviado')
    }

    // Se não guardou em lugar nenhum, avisa a pessoa para ela usar o WhatsApp
    if (!registroId && !gravou && !enviou) {
      return NextResponse.json({ error: 'Cadastro não registrado' }, { status: 500 })
    }
    return NextResponse.json({ success: true, id: registroId, slug: registroSlug, gravou, enviou })
  } catch (err) {
    console.error('[cadastro] erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
