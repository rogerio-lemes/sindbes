'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {
  LogOut, Eye, EyeOff, Save, Trash2, Plus, Users, Settings, Briefcase,
  FileText, Palette, Phone, Mail, MapPin, AtSign, Clock,
  ChevronDown, ChevronUp, Building2, GraduationCap,
} from 'lucide-react'

type Tab = 'marca' | 'servicos' | 'leads' | 'recrutamento'

function getSupabase(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

export default function AdminPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [tenantNome, setTenantNome] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('marca')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  // Dados
  const [config, setConfig] = useState<any>(null)
  const [servicos, setServicos] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [curriculos, setCurriculos] = useState<any[]>([])
  const [vagas, setVagas] = useState<any[]>([])

  useEffect(() => {
    let subscription: any
    try {
      getSupabase().auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setLoading(false)
      }).catch(() => setLoading(false))
      const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
      subscription = data.subscription
    } catch {
      setLoading(false)
    }
    return () => subscription?.unsubscribe()
  }, [])

  // Resolver tenant do usuário logado
  useEffect(() => {
    if (!session) return
    getSupabase()
      .from('perfis')
      .select('tenant_id, papel, nome')
      .eq('user_id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data?.tenant_id) {
          setTenantId(data.tenant_id)
          // Buscar nome do tenant
          getSupabase()
            .from('tenant_config')
            .select('nome')
            .eq('tenant_id', data.tenant_id)
            .single()
            .then(({ data: cfg }) => {
              if (cfg) setTenantNome(cfg.nome)
            })
        }
      })
  }, [session])

  function flash(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const loadData = useCallback(async () => {
    if (!tenantId) return
    const sb = getSupabase()

    if (activeTab === 'marca') {
      const { data } = await sb.from('tenant_config').select('*').eq('tenant_id', tenantId).single()
      setConfig(data)
    } else if (activeTab === 'servicos') {
      const { data } = await sb.from('servicos').select('*').eq('tenant_id', tenantId).order('ordem')
      setServicos(data || [])
    } else if (activeTab === 'leads') {
      const { data } = await sb.from('leads').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(200)
      setLeads(data || [])
    } else if (activeTab === 'recrutamento') {
      const [c, v] = await Promise.all([
        sb.from('curriculos').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(100),
        sb.from('vagas').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(100),
      ])
      setCurriculos(c.data || [])
      setVagas(v.data || [])
    }
  }, [tenantId, activeTab])

  useEffect(() => {
    if (tenantId) loadData()
  }, [tenantId, activeTab, loadData])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
  }

  async function handleRecovery(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/redefinir-senha`,
    })
    if (error) setAuthError(error.message)
    else setRecoverySent(true)
  }

  async function handleLogout() {
    await getSupabase().auth.signOut()
    setSession(null)
    setTenantId(null)
  }

  // ─── Config (marca) ───
  async function saveConfig() {
    if (!config || !tenantId) return
    setSaving(true)
    const { tenant_id, updated_at, ...rest } = config
    await getSupabase().from('tenant_config').update({ ...rest, updated_at: new Date().toISOString() }).eq('tenant_id', tenantId)
    flash('Configurações salvas!')
    setSaving(false)
  }

  // ─── Serviços ───
  async function saveServico(servico: any) {
    setSaving(true)
    const { id, created_at, ...rest } = servico
    if (id) {
      await getSupabase().from('servicos').update(rest).eq('id', id)
    } else {
      await getSupabase().from('servicos').insert({ ...rest, tenant_id: tenantId })
    }
    flash('Serviço salvo!')
    setSaving(false)
    loadData()
  }

  async function deleteServico(id: string) {
    await getSupabase().from('servicos').delete().eq('id', id)
    flash('Serviço excluído')
    loadData()
  }

  // ─── Vagas ───
  async function toggleVaga(id: string, ativa: boolean) {
    await getSupabase().from('vagas').update({ ativa }).eq('id', id)
    flash(ativa ? 'Vaga ativada' : 'Vaga desativada')
    loadData()
  }

  // ─── Loading / Login ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              <Settings className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-gray-500 mt-1">{recoveryMode ? 'Recuperar senha' : 'Acesso restrito'}</p>
          </div>

          {recoveryMode ? (
            recoverySent ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada (e o spam) e clique no link para definir uma nova senha.
                </p>
                <button
                  type="button"
                  onClick={() => { setRecoveryMode(false); setRecoverySent(false); setAuthError('') }}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Voltar para o login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecovery} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
                {authError && <p className="text-sm text-red-500">{authError}</p>}
                <button type="submit" className="w-full h-12 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                  Enviar link de recuperação
                </button>
                <button
                  type="button"
                  onClick={() => { setRecoveryMode(false); setAuthError('') }}
                  className="w-full text-center text-sm text-gray-500 hover:text-primary"
                >
                  Voltar para o login
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setRecoveryMode(true); setAuthError('') }}
                  className="text-sm text-primary hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              <button type="submit" className="w-full h-12 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                Entrar
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando perfil do tenant...</p>
      </div>
    )
  }

  const tabs: { key: Tab; icon: typeof Users; label: string }[] = [
    { key: 'marca', icon: Palette, label: 'Marca' },
    { key: 'servicos', icon: Briefcase, label: 'Serviços' },
    { key: 'leads', icon: Users, label: 'Leads' },
    { key: 'recrutamento', icon: GraduationCap, label: 'Recrutamento' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            {tenantNome?.charAt(0) || 'A'}
          </div>
          <div>
            <span className="font-bold text-sm block leading-tight">{tenantNome || 'Admin'}</span>
            <span className="text-xs text-gray-400">Painel administrativo</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {message && <span className="text-sm text-green-600 font-medium animate-pulse">{message}</span>}
          <a href="/" target="_blank" className="text-sm text-gray-500 hover:text-primary flex items-center gap-1">
            <Eye className="w-4 h-4" /> Ver site
          </a>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════ ABA MARCA ═══════ */}
        {activeTab === 'marca' && config && (
          <div className="space-y-6">
            {/* Identidade */}
            <Card title="Identidade" icon={<Building2 className="w-5 h-5 text-primary" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nome do site" value={config.nome} onChange={(v) => setConfig({ ...config, nome: v })} />
                <Field label="Tagline / Slogan" value={config.tagline} onChange={(v) => setConfig({ ...config, tagline: v })} />
                <Field label="CNPJ" value={config.cnpj} onChange={(v) => setConfig({ ...config, cnpj: v })} />
                <Field label="Horário de funcionamento" value={config.horario} onChange={(v) => setConfig({ ...config, horario: v })} icon={<Clock className="w-4 h-4" />} />
              </div>
            </Card>

            {/* Contato */}
            <Card title="Contato" icon={<Phone className="w-5 h-5 text-primary" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="WhatsApp (só números)" value={config.whatsapp} onChange={(v) => setConfig({ ...config, whatsapp: v })} placeholder="5534999999999" icon={<Phone className="w-4 h-4" />} />
                <Field label="WhatsApp (display)" value={config.whatsapp_display} onChange={(v) => setConfig({ ...config, whatsapp_display: v })} placeholder="(34) 99999-9999" />
                <Field label="Telefone" value={config.phone} onChange={(v) => setConfig({ ...config, phone: v })} />
                <Field label="E-mail" value={config.email} onChange={(v) => setConfig({ ...config, email: v })} icon={<Mail className="w-4 h-4" />} />
                <Field label="Instagram" value={config.instagram} onChange={(v) => setConfig({ ...config, instagram: v })} icon={<AtSign className="w-4 h-4" />} />
              </div>
            </Card>

            {/* Localização */}
            <Card title="Localização" icon={<MapPin className="w-5 h-5 text-primary" />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Endereço" value={config.endereco} onChange={(v) => setConfig({ ...config, endereco: v })} className="md:col-span-3" />
                <Field label="Cidade" value={config.cidade} onChange={(v) => setConfig({ ...config, cidade: v })} />
                <Field label="UF" value={config.uf} onChange={(v) => setConfig({ ...config, uf: v })} />
                <Field label="Google Maps URL" value={config.google_maps_url} onChange={(v) => setConfig({ ...config, google_maps_url: v })} />
              </div>
            </Card>

            {/* Cores */}
            <Card title="Paleta de cores" icon={<Palette className="w-5 h-5 text-primary" />}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorField label="Primária" value={config.cor_primaria} onChange={(v) => setConfig({ ...config, cor_primaria: v })} />
                <ColorField label="Primária escura" value={config.cor_primaria_dark} onChange={(v) => setConfig({ ...config, cor_primaria_dark: v })} />
                <ColorField label="Secundária" value={config.cor_secundaria} onChange={(v) => setConfig({ ...config, cor_secundaria: v })} />
                <ColorField label="Secundária escura" value={config.cor_secundaria_dark} onChange={(v) => setConfig({ ...config, cor_secundaria_dark: v })} />
                <ColorField label="Accent" value={config.cor_accent} onChange={(v) => setConfig({ ...config, cor_accent: v })} />
                <ColorField label="Texto" value={config.cor_text} onChange={(v) => setConfig({ ...config, cor_text: v })} />
                <ColorField label="BG alternativo" value={config.cor_bg_alt} onChange={(v) => setConfig({ ...config, cor_bg_alt: v })} />
              </div>
            </Card>

            {/* Marca visual */}
            <Card title="Marca visual" icon={<FileText className="w-5 h-5 text-primary" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="URL do logo" value={config.logo_url} onChange={(v) => setConfig({ ...config, logo_url: v })} placeholder="https://..." />
                <Field label="URL do favicon" value={config.favicon_url} onChange={(v) => setConfig({ ...config, favicon_url: v })} placeholder="https://..." />
                <Field label="Nome do atendente" value={config.atendente_nome} onChange={(v) => setConfig({ ...config, atendente_nome: v })} />
                <Field label="Foto do atendente (URL)" value={config.atendente_foto_url} onChange={(v) => setConfig({ ...config, atendente_foto_url: v })} />
              </div>
            </Card>

            <button onClick={saveConfig} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar configurações'}
            </button>
          </div>
        )}

        {activeTab === 'marca' && !config && (
          <Card><p className="text-gray-400 text-center py-8">Carregando configurações...</p></Card>
        )}

        {/* ═══════ ABA SERVIÇOS ═══════ */}
        {activeTab === 'servicos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg">Serviços ({servicos.length})</h2>
              <button
                onClick={() => setServicos([{ id: null, tenant_id: tenantId, nome: '', slug: '', seo_title: '', seo_description: '', descricao: '', imagem_url: '', ordem: servicos.length + 1, ativo: true }, ...servicos])}
                className="flex items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:opacity-90"
              >
                <Plus className="w-4 h-4" /> Novo serviço
              </button>
            </div>

            {servicos.map((s, i) => (
              <ServicoEditor key={s.id || `new-${i}`} servico={s} onSave={saveServico} onDelete={s.id ? () => deleteServico(s.id) : undefined} saving={saving} />
            ))}

            {servicos.length === 0 && (
              <Card><p className="text-gray-400 text-center py-8">Nenhum serviço cadastrado.</p></Card>
            )}
          </div>
        )}

        {/* ═══════ ABA LEADS ═══════ */}
        {activeTab === 'leads' && (
          <Card title={`Leads capturados (${leads.length})`} icon={<Users className="w-5 h-5 text-primary" />}>
            <div className="overflow-x-auto -mx-6 -mb-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Telefone</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Origem</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{l.nome || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        {l.telefone ? (
                          <a href={`https://wa.me/55${l.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{l.telefone}</a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{l.email || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{l.origem || l.pagina_slug || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{l.created_at ? new Date(l.created_at).toLocaleDateString('pt-BR') : ''}</td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Nenhum lead capturado ainda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ═══════ ABA RECRUTAMENTO ═══════ */}
        {activeTab === 'recrutamento' && (
          <div className="space-y-8">
            {/* Vagas */}
            <Card title={`Vagas (${vagas.length})`} icon={<Briefcase className="w-5 h-5 text-primary" />}>
              <div className="overflow-x-auto -mx-6 -mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Título</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Função</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Contato</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {vagas.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium">{v.titulo}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{v.funcao || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{v.tipo || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{v.contato || '-'}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => toggleVaga(v.id, !v.ativa)} className={`text-xs px-2.5 py-1 rounded-full font-medium ${v.ativa ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            {v.ativa ? 'Ativa' : 'Inativa'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{v.created_at ? new Date(v.created_at).toLocaleDateString('pt-BR') : ''}</td>
                      </tr>
                    ))}
                    {vagas.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Nenhuma vaga cadastrada.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Currículos */}
            <Card title={`Currículos (${curriculos.length})`} icon={<GraduationCap className="w-5 h-5 text-primary" />}>
              <div className="overflow-x-auto -mx-6 -mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Função</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cidade</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Telefone</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Experiência</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {curriculos.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium">{c.nome}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{c.funcao || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{c.cidade || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          {c.telefone ? (
                            <a href={`https://wa.me/55${c.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{c.telefone}</a>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{c.experiencia || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : ''}</td>
                      </tr>
                    ))}
                    {curriculos.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Nenhum currículo cadastrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════
// Componentes auxiliares
// ═══════════════════════════════════════

function Card({ title, icon, children }: { title?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          {icon}
          <h3 className="font-bold text-base">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, icon, className, type = 'text' }: {
  label: string; value: string | null | undefined; onChange: (v: string) => void
  placeholder?: string; icon?: React.ReactNode; className?: string; type?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${icon ? 'pl-9' : ''}`}
        />
      </div>
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string | null | undefined; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:border-primary outline-none"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

function ServicoEditor({ servico, onSave, onDelete, saving }: {
  servico: any; onSave: (s: any) => void; onDelete?: () => void; saving: boolean
}) {
  const [open, setOpen] = useState(!servico.id)
  const [data, setData] = useState(servico)

  function handleSave() {
    const slug = data.slug || data.nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50)
    onSave({ ...data, slug })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${data.ativo ? 'bg-green-400' : 'bg-gray-300'}`} />
          <span className="text-sm font-medium">{data.nome || 'Novo serviço'}</span>
          <span className="text-xs text-gray-400">ordem: {data.ordem}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </div>

      {open && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nome do serviço" value={data.nome} onChange={(v) => setData({ ...data, nome: v })} />
            <Field label="Slug (URL)" value={data.slug} onChange={(v) => setData({ ...data, slug: v })} placeholder="gerado-automaticamente" />
            <Field label="SEO Title" value={data.seo_title} onChange={(v) => setData({ ...data, seo_title: v })} className="md:col-span-2" />
            <Field label="SEO Description" value={data.seo_description} onChange={(v) => setData({ ...data, seo_description: v })} className="md:col-span-2" />
            <Field label="URL da imagem" value={data.imagem_url} onChange={(v) => setData({ ...data, imagem_url: v })} placeholder="https://..." />
            <Field label="Ordem" value={String(data.ordem || 0)} onChange={(v) => setData({ ...data, ordem: parseInt(v) || 0 })} type="number" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Descrição curta</label>
            <textarea
              value={data.descricao || ''}
              onChange={(e) => setData({ ...data, descricao: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none resize-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={data.ativo} onChange={(e) => setData({ ...data, ativo: e.target.checked })} className="rounded" />
              Ativo
            </label>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}
            </button>
            {onDelete && (
              <button onClick={onDelete}
                className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-500 text-sm font-medium rounded-lg hover:bg-red-100">
                <Trash2 className="w-4 h-4" /> Excluir
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
