'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Save, Bot, MessageSquare, Info, CheckCircle2, AlertTriangle, KeyRound, Eye, EyeOff,
} from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { PageHeader, Card, Field, TextArea, Toggle, PermissionGuard } from '@/components/admin/ui'
import { PERGUNTAS_SUGERIDAS } from '@/lib/atendimento/conhecimento'

interface Config {
  ativo: boolean
  saudacao: string
  segundos_para_abrir: number
  texto_convite: string
  texto_minimizado: string
}

const PADRAO: Config = {
  ativo: true,
  saudacao: '',
  segundos_para_abrir: 3,
  texto_convite: 'Está com alguma dúvida? Fale comigo agora!',
  texto_minimizado: 'Ainda estou aqui, qualquer dúvida me chame!',
}

export default function AtendimentoPage() {
  const { tenantId, canAccess } = useAdminAuth()
  const [dados, setDados] = useState<Config>(PADRAO)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [iaLigada, setIaLigada] = useState<boolean | null>(null)

  // Chave da IA: digitada aqui, guardada no servidor, nunca devolvida ao navegador
  const [novaChave, setNovaChave] = useState('')
  const [mostrarChave, setMostrarChave] = useState(false)
  const [salvandoChave, setSalvandoChave] = useState(false)
  const [erroChave, setErroChave] = useState('')
  const [chaveInfo, setChaveInfo] = useState<{
    configurada?: boolean
    origem?: string
    final?: string
    atualizado_por?: string
    motivo?: string
  }>({})

  const podeEditar = canAccess('marca.editar')
  const set = <K extends keyof Config>(campo: K) => (v: Config[K]) => setDados({ ...dados, [campo]: v })

  const carregar = useCallback(async () => {
    const { data } = await getBrowserClient()
      .from('atendimento_config').select('*').eq('tenant_id', tenantId).maybeSingle()
    if (data) {
      setDados({
        ativo: data.ativo ?? true,
        saudacao: data.saudacao ?? '',
        segundos_para_abrir: data.segundos_para_abrir ?? 3,
        texto_convite: data.texto_convite ?? PADRAO.texto_convite,
        texto_minimizado: data.texto_minimizado ?? PADRAO.texto_minimizado,
      })
    }
  }, [tenantId])

  useEffect(() => { carregar() }, [carregar])

  /** Consulta a situação da chave. O valor nunca vem para cá, só o final dela. */
  const verificarChave = useCallback(async () => {
    try {
      const sb = getBrowserClient()
      const { data: { session } } = await sb.auth.getSession()
      const r = await fetch(`/api/admin/chave-ia?tenant_id=${tenantId}`, {
        headers: { Authorization: `Bearer ${session?.access_token ?? ''}` },
      })
      const d = await r.json()
      setChaveInfo(d)
      setIaLigada(!!d.configurada)
    } catch {
      setIaLigada(false)
    }
  }, [tenantId])

  useEffect(() => { verificarChave() }, [verificarChave])

  async function salvarChave(remover = false) {
    setSalvandoChave(true)
    setErroChave('')
    try {
      const sb = getBrowserClient()
      const { data: { session } } = await sb.auth.getSession()
      const r = await fetch('/api/admin/chave-ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ tenant_id: tenantId, chave: remover ? '' : novaChave.trim() }),
      })
      const d = await r.json()
      if (!r.ok) {
        setErroChave(d.error || 'Não foi possível salvar.')
      } else {
        setNovaChave('')
        setMensagem(remover ? 'Chave removida.' : 'Chave validada e salva! A IA já está respondendo.')
        setTimeout(() => setMensagem(''), 4000)
        await verificarChave()
      }
    } catch {
      setErroChave('Falha de conexão ao salvar.')
    }
    setSalvandoChave(false)
  }

  async function salvar() {
    setSalvando(true)
    await getBrowserClient().from('atendimento_config').upsert({
      tenant_id: tenantId,
      ativo: dados.ativo,
      saudacao: dados.saudacao || null,
      segundos_para_abrir: dados.segundos_para_abrir,
      texto_convite: dados.texto_convite,
      texto_minimizado: dados.texto_minimizado,
      updated_at: new Date().toISOString(),
    })
    setSalvando(false)
    setMensagem('Configurações salvas!')
    setTimeout(() => setMensagem(''), 3000)
  }

  return (
    <PermissionGuard permissao="marca.ver">
      <PageHeader
        titulo="Atendimento por IA"
        descricao="Controle o assistente que aparece no canto do site."
        acoes={
          podeEditar && (
            <button
              onClick={salvar}
              disabled={salvando}
              className="flex items-center gap-1.5 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          )
        }
      />

      {mensagem && <p className="text-sm text-green-600 font-medium mb-4">{mensagem}</p>}

      <div className="space-y-6">
        {/* ── Chave da IA ── */}
        <Card title="Chave da IA" icon={<KeyRound className="w-5 h-5 text-primary" />}>
          {iaLigada === true ? (
            <div className="flex flex-wrap items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="flex-1 min-w-[12rem]">
                <strong>IA ativa</strong>, respondendo perguntas livres.
                {chaveInfo.final && (
                  <span className="text-green-700">
                    {' '}Chave terminada em <code className="font-mono">{chaveInfo.final}</code>
                    {chaveInfo.origem === 'servidor' && ' (cadastrada direto no servidor)'}
                    {chaveInfo.atualizado_por && ` · por ${chaveInfo.atualizado_por}`}
                  </span>
                )}
              </span>
              {podeEditar && chaveInfo.origem === 'painel' && (
                <button
                  onClick={() => salvarChave(true)}
                  disabled={salvandoChave}
                  className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                >
                  Remover chave
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm mb-4">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>
                <strong>A IA ainda não está respondendo.</strong> As perguntas prontas funcionam
                normalmente, mas quem digitar uma dúvida livre será encaminhado ao WhatsApp.
              </p>
            </div>
          )}

          {podeEditar && chaveInfo.origem !== 'servidor' && (
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {iaLigada ? 'Substituir a chave' : 'Colar a chave da Anthropic'}
              </label>
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[16rem]">
                  <input
                    type={mostrarChave ? 'text' : 'password'}
                    value={novaChave}
                    onChange={(e) => setNovaChave(e.target.value)}
                    placeholder="sk-ant-api03-..."
                    autoComplete="off"
                    className="w-full h-11 px-3.5 pr-11 rounded-xl border border-gray-200 font-mono text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarChave((v) => !v)}
                    className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    aria-label={mostrarChave ? 'Ocultar chave' : 'Mostrar chave'}
                    tabIndex={-1}
                  >
                    {mostrarChave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => salvarChave()}
                  disabled={salvandoChave || !novaChave.trim()}
                  className="h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-40"
                >
                  {salvandoChave ? 'Validando...' : 'Salvar chave'}
                </button>
              </div>

              {erroChave && <p className="text-sm text-red-500">{erroChave}</p>}

              <p className="text-xs text-gray-400 leading-relaxed">
                Gere em{' '}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:opacity-80"
                >
                  console.anthropic.com
                </a>{' '}
                (API Keys → Create Key). A chave é testada antes de salvar e fica guardada apenas no
                servidor: ela nunca volta para esta tela nem aparece para quem visita o site.
              </p>
            </div>
          )}
        </Card>

        <Card title="Funcionamento" icon={<Bot className="w-5 h-5 text-primary" />}>
          <Toggle
            label="Exibir o atendimento no site"
            checked={dados.ativo}
            onChange={set('ativo')}
            hint="Desligado, o site não mostra o assistente. Os botões de WhatsApp e telefone continuam."
          />
          <div className="mt-4 max-w-[220px]">
            <Field
              label="Aparecer depois de (segundos)"
              value={dados.segundos_para_abrir}
              onChange={(v) => set('segundos_para_abrir')(Math.max(0, parseInt(v) || 0))}
              type="number"
              hint="Tempo até o convite surgir"
              disabled={!podeEditar}
            />
          </div>
        </Card>

        <Card title="Textos" icon={<MessageSquare className="w-5 h-5 text-primary" />}>
          <div className="space-y-4">
            <Field
              label="Convite (balão fechado)"
              value={dados.texto_convite}
              onChange={set('texto_convite')}
              hint="Primeira coisa que o visitante vê"
              disabled={!podeEditar}
            />
            <Field
              label="Lembrete (depois de fechar)"
              value={dados.texto_minimizado}
              onChange={set('texto_minimizado')}
              hint="Balão menor que fica após o visitante fechar o chat"
              disabled={!podeEditar}
            />
            <TextArea
              label="Saudação dentro do chat"
              value={dados.saudacao}
              onChange={set('saudacao')}
              rows={3}
            />
            <p className="text-xs text-gray-400 -mt-2">
              Deixe em branco para usar a saudação automática com o nome do atendente.
            </p>
          </div>
        </Card>

        <Card title="Perguntas prontas" icon={<Info className="w-5 h-5 text-primary" />}>
          <p className="text-sm text-gray-500 mb-3">
            Estas {PERGUNTAS_SUGERIDAS.length} perguntas aparecem como botões no chat e respondem na
            hora, sem consultar a IA e sem custo.
          </p>
          <div className="flex flex-wrap gap-2">
            {PERGUNTAS_SUGERIDAS.map((p) => (
              <span
                key={p.chip}
                className="px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold"
              >
                {p.chip}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </PermissionGuard>
  )
}
