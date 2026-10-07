import { NextResponse } from 'next/server'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { SITE } from '@/lib/constants'

const FALLBACK_TENANT_ID = '00000000-0000-0000-0000-000000000001'

/**
 * Destinatários fixos dos cadastros. RESEND_TO_EMAIL (separado por vírgula)
 * soma endereços a esta lista, mas nunca remove os dois daqui.
 */
const DESTINOS_FIXOS = ['comercial@mercadoopen.com.br', 'adm.sindibes@gmail.com']

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

function redes(fd: FormData) {
  const r: string[] = []
  for (let i = 0; i < 20; i++) {
    const url = txt(fd, `rede_${i}_url`)
    if (url) r.push(`${txt(fd, `rede_${i}_tipo`) || 'rede'}: ${url}`)
  }
  return r
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

type Linha = [string, string]

/** Monta o cadastro no formato de cada formulário. */
function lerCadastro(fd: FormData) {
  const tipo = txt(fd, 'tipo') === 'parceiro' ? 'parceiro' : 'associado'

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

/** Capa e fotos chegam como arquivo; vão anexadas ao e-mail. */
async function anexos(fd: FormData) {
  const arquivos: { filename: string; content: Buffer }[] = []
  for (const [k, v] of fd.entries()) {
    if ((k === 'capa' || k.startsWith('foto_')) && v instanceof File && v.size > 0) {
      const nome = k === 'capa' ? `capa-${v.name}` : v.name
      arquivos.push({ filename: nome, content: Buffer.from(await v.arrayBuffer()) })
    }
  }
  return arquivos
}

export async function POST(request: Request) {
  try {
    const fd = await request.formData()
    const c = lerCadastro(fd)

    if (!c.nome || !c.telefone) {
      return NextResponse.json({ error: 'Nome e telefone são obrigatórios' }, { status: 400 })
    }

    const preenchidas = c.linhas.filter(([, v]) => v)
    const fotos = await anexos(fd)
    const textoCompleto = [
      ...preenchidas.map(([k, v]) => `${k}: ${v}`),
      fotos.length ? `Fotos recebidas por e-mail: ${fotos.map(f => f.filename).join(', ')}` : null,
    ].filter(Boolean).join('\n')

    // 1) Guarda no banco: aparece no painel em Leads
    let gravou = false
    if (isSupabaseConfigured()) {
      const { error } = await getPublicClient().from('leads').insert({
        tenant_id: FALLBACK_TENANT_ID,
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

    // 2) Avisa por e-mail, com todos os campos e as fotos anexadas
    let enviou = false
    const chave = process.env.RESEND_API_KEY
    if (chave && !chave.startsWith('<')) {
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:620px;">
          <h2 style="color:#2E9E8D;margin:0 0 4px;">${esc(c.rotulo)}</h2>
          <p style="color:#6b7280;margin:0 0 16px;">Recebido pelo site ${esc(SITE.name)}</p>
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
    if (!gravou && !enviou) {
      return NextResponse.json({ error: 'Cadastro não registrado' }, { status: 500 })
    }
    return NextResponse.json({ success: true, gravou, enviou })
  } catch (err) {
    console.error('[cadastro] erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
