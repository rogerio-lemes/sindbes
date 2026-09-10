import { NextResponse } from 'next/server'
import { montarContexto } from '@/lib/atendimento/conhecimento'
import { getServiceClient } from '@/lib/supabase/server'
import { getTenant } from '@/lib/tenant'

/**
 * Atendimento por IA.
 * A chave fica só aqui no servidor, nunca é enviada ao navegador.
 * Sem chave configurada, responde encaminhando ao atendente humano.
 */

const MODELO = 'claude-haiku-4-5-20251001'
const MAX_MENSAGENS = 12
const MAX_CARACTERES = 600

interface Mensagem {
  autor: 'visitante' | 'assistente'
  texto: string
}

/**
 * Busca a chave da IA. Primeiro no ambiente do servidor; se não houver,
 * na tabela de segredos, onde o painel a cadastra.
 */
async function obterChave(tenantId: string): Promise<string | null> {
  const doAmbiente = process.env.ANTHROPIC_API_KEY
  if (doAmbiente && !doAmbiente.includes('<')) return doAmbiente

  try {
    const { data } = await getServiceClient()
      .from('integracoes_secretas')
      .select('chave_ia')
      .eq('tenant_id', tenantId)
      .maybeSingle()
    return data?.chave_ia || null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const historico: Mensagem[] = Array.isArray(body?.historico) ? body.historico : []
    const pergunta = typeof body?.pergunta === 'string' ? body.pergunta.trim() : ''

    if (!pergunta) {
      return NextResponse.json({ error: 'Pergunta vazia' }, { status: 400 })
    }
    if (pergunta.length > MAX_CARACTERES) {
      return NextResponse.json({ error: 'Pergunta muito longa' }, { status: 400 })
    }

    const { id: tenantId, config } = await getTenant()

    const chave = await obterChave(tenantId)
    if (!chave) {
      // Sem IA disponível: encaminha para o atendente humano
      return NextResponse.json({
        resposta:
          'Essa eu prefiro que o Wagner responda pra você com precisão. ' +
          'Clique no botão abaixo e fale com ele agora mesmo no WhatsApp.',
        encaminhar: true,
      })
    }

    const contexto = montarContexto(
      config.nome,
      config.whatsapp_display || '',
      config.horario || '',
    )

    const mensagens = historico
      .slice(-MAX_MENSAGENS)
      .filter((m) => m?.texto)
      .map((m) => ({
        role: m.autor === 'visitante' ? ('user' as const) : ('assistant' as const),
        content: m.texto.slice(0, MAX_CARACTERES),
      }))

    mensagens.push({ role: 'user', content: pergunta })

    const resposta = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': chave,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 400,
        system: contexto,
        messages: mensagens,
      }),
    })

    if (!resposta.ok) {
      console.error('[atendimento] falha na IA:', resposta.status, await resposta.text())
      return NextResponse.json({
        resposta:
          'Tive um problema para responder agora. Fale direto com o Wagner que ele te ajuda na hora.',
        encaminhar: true,
      })
    }

    const dados = await resposta.json()
    const texto = dados?.content?.[0]?.text?.trim()

    if (!texto) {
      return NextResponse.json({
        resposta: 'Não consegui formular a resposta. O Wagner pode te ajudar melhor agora.',
        encaminhar: true,
      })
    }

    return NextResponse.json({ resposta: texto, encaminhar: false })
  } catch (err) {
    console.error('[atendimento] erro:', err)
    return NextResponse.json({
      resposta: 'Tive um problema técnico. Fale com o Wagner pelo WhatsApp que ele te atende agora.',
      encaminhar: true,
    })
  }
}
