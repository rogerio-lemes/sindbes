import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { P, SITE } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, telefone, email, mensagem, origem, pagina_slug } = body

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from(`${P}leads`)
      .insert({
        nome,
        telefone,
        email,
        mensagem: mensagem || null,
        origem: origem || null,
        pagina_slug: pagina_slug || null,
      })

    if (error) {
      console.error('Lead insert error:', error)
    }

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== '<RESEND_API_KEY>') {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || `noreply@sindbes.com.br`,
          to: process.env.RESEND_TO_EMAIL || SITE.email,
          subject: `Novo lead: ${nome} | ${origem || pagina_slug || 'Site'}`,
          html: `
            <h2>Novo lead capturado no site</h2>
            <table style="border-collapse:collapse;width:100%;max-width:500px;">
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Nome</td><td style="padding:8px;border:1px solid #ddd;">${nome || '-'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Telefone</td><td style="padding:8px;border:1px solid #ddd;">${telefone || '-'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${email || '-'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Mensagem</td><td style="padding:8px;border:1px solid #ddd;">${mensagem || '-'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Origem</td><td style="padding:8px;border:1px solid #ddd;">📍 ${origem || pagina_slug || '-'}</td></tr>
            </table>
            <br>
            <p style="color:#888;font-size:12px;">Enviado automaticamente pelo site ${SITE.name}</p>
          `,
        })
      } catch (emailErr) {
        console.error('Resend email error:', emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
