import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getServiceClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { SITE } from '@/lib/constants'

const FALLBACK_TENANT_ID = '00000000-0000-0000-0000-000000000001'

async function resolveTenant() {
  if (!isSupabaseConfigured()) {
    return { tenant_id: FALLBACK_TENANT_ID, config: { nome: SITE.name, email: SITE.email } }
  }

  const headerStore = await headers()
  const host = headerStore.get('x-tenant-host')
  if (!host) return { tenant_id: FALLBACK_TENANT_ID, config: { nome: SITE.name, email: SITE.email } }

  try {
    const supabase = getServiceClient()

    const { data: dominio } = await supabase
      .from('dominios')
      .select('tenant_id')
      .eq('host', host)
      .single()

    if (!dominio) return { tenant_id: FALLBACK_TENANT_ID, config: { nome: SITE.name, email: SITE.email } }

    const { data: config } = await supabase
      .from('tenant_config')
      .select('nome, email')
      .eq('tenant_id', dominio.tenant_id)
      .single()

    return { tenant_id: dominio.tenant_id, config }
  } catch {
    return { tenant_id: FALLBACK_TENANT_ID, config: { nome: SITE.name, email: SITE.email } }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, telefone, email, mensagem, origem, pagina_slug } = body

    const tenant = await resolveTenant()
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 400 })
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = getServiceClient()
        const { error } = await supabase
          .from('leads')
          .insert({
            tenant_id: tenant.tenant_id,
            nome,
            telefone,
            email,
            mensagem: mensagem || null,
            origem: origem || null,
            pagina_slug: pagina_slug || null,
          })
        if (error) console.error('Lead insert error:', error)
      } catch (err) {
        console.error('Supabase indisponível para leads:', err)
      }
    }

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== '<RESEND_API_KEY>') {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const toEmail = process.env.RESEND_TO_EMAIL || tenant.config?.email || 'contato@sindibes.com.br'
        const siteName = tenant.config?.nome || 'Site'

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@sindibes.com.br',
          to: toEmail,
          subject: `Novo lead: ${nome} | ${origem || pagina_slug || 'Site'}`,
          html: `
            <h2>Novo lead capturado no site</h2>
            <table style="border-collapse:collapse;width:100%;max-width:500px;">
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Nome</td><td style="padding:8px;border:1px solid #ddd;">${nome || '-'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Telefone</td><td style="padding:8px;border:1px solid #ddd;">${telefone || '-'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${email || '-'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Mensagem</td><td style="padding:8px;border:1px solid #ddd;">${mensagem || '-'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Origem</td><td style="padding:8px;border:1px solid #ddd;">${origem || pagina_slug || '-'}</td></tr>
            </table>
            <br>
            <p style="color:#888;font-size:12px;">Enviado automaticamente pelo site ${siteName}</p>
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
