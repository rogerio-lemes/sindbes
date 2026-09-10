import { NextResponse } from 'next/server'
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { SITE } from '@/lib/constants'

const FALLBACK_TENANT_ID = '00000000-0000-0000-0000-000000000001'

export async function POST(request: Request) {
  try {
    const fd = await request.formData()

    const tipo     = fd.get('tipo')     as string
    const nome     = fd.get('nome')     as string
    const empresa  = fd.get('empresa')  as string
    const telefone = fd.get('telefone') as string
    const email    = fd.get('email')    as string
    const cidade   = fd.get('cidade')   as string
    const mensagem = fd.get('mensagem') as string
    const segmento = fd.get('segmento') as string
    const cnpj     = fd.get('cnpj')     as string

    // Coletar arquivos de foto
    const fotosNomes: string[] = []
    for (const [key, value] of fd.entries()) {
      if (key.startsWith('foto_') && value instanceof File) {
        fotosNomes.push(value.name)
      }
    }

    const origemLabel = tipo === 'parceiro' ? 'Proposta de Parceria' : 'Solicitação de Associação'
    const mensagemCompleta = [
      empresa   ? `Empresa/Negócio: ${empresa}` : null,
      cidade    ? `Cidade: ${cidade}` : null,
      segmento  ? `Segmento: ${segmento}` : null,
      cnpj      ? `CNPJ/CPF: ${cnpj}` : null,
      mensagem  ? `Mensagem: ${mensagem}` : null,
      fotosNomes.length ? `Fotos enviadas: ${fotosNomes.join(', ')}` : null,
    ].filter(Boolean).join('\n')

    // Salvar no Supabase como lead
    if (isSupabaseConfigured()) {
      try {
        const supabase = getPublicClient()
        await supabase.from('leads').insert({
          tenant_id: FALLBACK_TENANT_ID,
          nome,
          telefone,
          email,
          mensagem: mensagemCompleta,
          origem: origemLabel,
          pagina_slug: 'parceiros',
        })
      } catch (err) {
        console.error('Supabase insert error:', err)
      }
    }

    // Enviar e-mail de notificação
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== '<RESEND_API_KEY>') {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const toEmail = process.env.RESEND_TO_EMAIL || SITE.email

        const rows = [
          ['Tipo', origemLabel],
          ['Nome', nome],
          ['Empresa / Negócio', empresa],
          ['Telefone', telefone],
          ['E-mail', email || '-'],
          ['Cidade', cidade],
          segmento ? ['Segmento', segmento] : null,
          cnpj     ? ['CNPJ/CPF', cnpj]    : null,
          mensagem ? ['Mensagem', mensagem] : null,
          fotosNomes.length ? ['Fotos', fotosNomes.join(', ')] : null,
        ].filter(Boolean) as [string, string][]

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@sindibes.com.br',
          to: toEmail,
          subject: `[${origemLabel}] ${nome} — ${empresa}`,
          html: `
            <h2 style="color:#2E9E8D;">${origemLabel}</h2>
            <table style="border-collapse:collapse;width:100%;max-width:560px;">
              ${rows.map(([k, v]) => `
                <tr>
                  <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:160px;">${k}</td>
                  <td style="padding:8px 12px;border:1px solid #e5e7eb;">${v || '-'}</td>
                </tr>`).join('')}
            </table>
            <p style="margin-top:20px;color:#6b7280;font-size:12px;">
              Enviado pelo formulário de ${origemLabel.toLowerCase()} — ${SITE.name}
            </p>
          `,
        })
      } catch (err) {
        console.error('Resend error:', err)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('cadastro-parceiro error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
