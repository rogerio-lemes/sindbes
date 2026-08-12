'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {
  LogOut, Plus, Save, Trash2, Eye, EyeOff, Globe, Users, Settings,
  Building2, ChevronDown, ChevronUp, Shield, ExternalLink, Palette, MapPin,
} from 'lucide-react'

function getSupabase(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

export default function SuperAdminPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  // Dados
  const [tenants, setTenants] = useState<any[]>([])
  const [editingTenant, setEditingTenant] = useState<any>(null)
  const [dominios, setDominios] = useState<any[]>([])
  const [newDominio, setNewDominio] = useState('')

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

  useEffect(() => {
    if (!session) return
    getSupabase()
      .from('perfis')
      .select('papel')
      .eq('user_id', session.user.id)
      .single()
      .then(({ data }) => {
        setIsSuperAdmin(data?.papel === 'super_admin')
      })
  }, [session])

  function flash(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const loadTenants = useCallback(async () => {
    const { data } = await getSupabase()
      .from('tenants')
      .select('*, tenant_config(*)')
      .order('created_at', { ascending: false })
    setTenants(data || [])
  }, [])

  useEffect(() => {
    if (isSuperAdmin) loadTenants()
  }, [isSuperAdmin, loadTenants])

  async function loadDominios(tenantId: string) {
    const { data } = await getSupabase()
      .from('dominios')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('is_primary', { ascending: false })
    setDominios(data || [])
  }

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
      redirectTo: `${window.location.origin}/painel/redefinir-senha`,
    })
    if (error) setAuthError(error.message)
    else setRecoverySent(true)
  }

  async function handleLogout() {
    await getSupabase().auth.signOut()
    setSession(null)
    setIsSuperAdmin(false)
  }

  // ─── Criar tenant ───
  async function createTenant() {
    setSaving(true)
    const slug = `novo-sindicato-${Date.now().toString(36)}`

    const { data: tenant, error } = await getSupabase()
      .from('tenants')
      .insert({ slug, nome: 'Novo Sindicato', status: 'ativo', plano: 'basico' })
      .select()
      .single()

    if (error || !tenant) {
      flash('Erro ao criar tenant')
      setSaving(false)
      return
    }

    await getSupabase().from('tenant_config').insert({
      tenant_id: tenant.id,
      nome: 'Novo Sindicato',
      cidade: '',
      uf: 'MG',
    })

    await getSupabase().from('dominios').insert({
      tenant_id: tenant.id,
      host: `${slug}.localhost:3000`,
      is_primary: true,
    })

    flash('Tenant criado!')
    setSaving(false)
    loadTenants()
  }

  // ─── Salvar tenant ───
  async function saveTenant() {
    if (!editingTenant) return
    setSaving(true)

    const { id, tenant_config, created_at, updated_at, ...tenantData } = editingTenant
    await getSupabase().from('tenants').update({
      ...tenantData,
      updated_at: new Date().toISOString(),
    }).eq('id', id)

    if (tenant_config?.[0]) {
      const { tenant_id, updated_at: _, ...cfgData } = tenant_config[0]
      await getSupabase().from('tenant_config').update({
        ...cfgData,
        updated_at: new Date().toISOString(),
      }).eq('tenant_id', id)
    }

    flash('Tenant salvo!')
    setSaving(false)
    loadTenants()
  }

  // ─── Domínios ───
  async function addDominio(tenantId: string) {
    if (!newDominio.trim()) return
    await getSupabase().from('dominios').insert({
      tenant_id: tenantId,
      host: newDominio.trim().toLowerCase(),
      is_primary: false,
    })
    setNewDominio('')
    loadDominios(tenantId)
    flash('Domínio adicionado')
  }

  async function deleteDominio(id: string, tenantId: string) {
    await getSupabase().from('dominios').delete().eq('id', id)
    loadDominios(tenantId)
    flash('Domínio removido')
  }

  // ─── Deletar tenant ───
  async function deleteTenant(id: string) {
    await getSupabase().from('tenants').delete().eq('id', id)
    setEditingTenant(null)
    flash('Tenant excluído')
    loadTenants()
  }

  // ─── Loading / Login ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white mx-auto mb-3">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-white">Super Admin</h1>
            <p className="text-sm text-gray-400 mt-1">{recoveryMode ? 'Recuperar senha' : 'Plataforma de Sites de Sindicatos'}</p>
          </div>

          {recoveryMode ? (
            recoverySent ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-300">
                  Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada (e o spam) e clique no link para definir uma nova senha.
                </p>
                <button
                  type="button"
                  onClick={() => { setRecoveryMode(false); setRecoverySent(false); setAuthError('') }}
                  className="text-sm text-violet-400 font-medium hover:underline"
                >
                  Voltar para o login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecovery} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full h-12 px-4 rounded-xl border border-gray-600 bg-gray-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none" />
                </div>
                {authError && <p className="text-sm text-red-400">{authError}</p>}
                <button type="submit" className="w-full h-12 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                  Enviar link de recuperação
                </button>
                <button
                  type="button"
                  onClick={() => { setRecoveryMode(false); setAuthError('') }}
                  className="w-full text-center text-sm text-gray-400 hover:text-violet-400"
                >
                  Voltar para o login
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full h-12 px-4 rounded-xl border border-gray-600 bg-gray-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-600 bg-gray-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-gray-400 hover:text-gray-200"
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
                  className="text-sm text-violet-400 hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              {authError && <p className="text-sm text-red-400">{authError}</p>}
              <button type="submit" className="w-full h-12 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                Entrar
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg font-bold">Acesso negado</p>
          <p className="text-gray-400 text-sm mt-2">Apenas super administradores podem acessar este painel.</p>
          <button onClick={handleLogout} className="mt-6 px-4 py-2 text-sm text-gray-400 hover:text-white">
            <LogOut className="w-4 h-4 inline mr-1" /> Sair
          </button>
        </div>
      </div>
    )
  }

  // ═══════ PAINEL PRINCIPAL ═══════
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm block leading-tight">Super Admin</span>
            <span className="text-xs text-gray-400">Plataforma Multi-tenant</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {message && <span className="text-sm text-green-400 font-medium animate-pulse">{message}</span>}
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-400 flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {!editingTenant ? (
          <>
            {/* Lista de tenants */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Sites da plataforma</h1>
                <p className="text-sm text-gray-400 mt-1">{tenants.length} site(s) cadastrado(s)</p>
              </div>
              <button onClick={createTenant} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 disabled:opacity-50">
                <Plus className="w-4 h-4" /> Novo site
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tenants.map((t) => {
                const cfg = t.tenant_config?.[0]
                return (
                  <div key={t.id}
                    onClick={() => { setEditingTenant(t); loadDominios(t.id) }}
                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 cursor-pointer hover:border-violet-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: cfg?.cor_primaria || '#6E5A97' }}>
                          {(cfg?.nome || t.nome)?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">{cfg?.nome || t.nome}</h3>
                          <p className="text-xs text-gray-400">{t.slug}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        t.status === 'ativo' ? 'bg-green-900/50 text-green-400' :
                        t.status === 'suspenso' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      {cfg?.cidade && <p><MapPin className="w-3 h-3 inline mr-1" />{cfg.cidade}, {cfg.uf}</p>}
                      {cfg?.email && <p>{cfg.email}</p>}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-700 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Plano: {t.plano}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                )
              })}
            </div>

            {tenants.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p>Nenhum site cadastrado na plataforma.</p>
                <p className="text-sm mt-1">Clique em &quot;Novo site&quot; para criar o primeiro.</p>
              </div>
            )}
          </>
        ) : (
          <TenantEditor
            tenant={editingTenant}
            setTenant={setEditingTenant}
            dominios={dominios}
            newDominio={newDominio}
            setNewDominio={setNewDominio}
            onSave={saveTenant}
            onDelete={() => deleteTenant(editingTenant.id)}
            onBack={() => setEditingTenant(null)}
            onAddDominio={() => addDominio(editingTenant.id)}
            onDeleteDominio={(id: string) => deleteDominio(id, editingTenant.id)}
            saving={saving}
          />
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════
// Editor de Tenant
// ═══════════════════════════════════════

function TenantEditor({ tenant, setTenant, dominios, newDominio, setNewDominio, onSave, onDelete, onBack, onAddDominio, onDeleteDominio, saving }: {
  tenant: any; setTenant: (t: any) => void
  dominios: any[]; newDominio: string; setNewDominio: (v: string) => void
  onSave: () => void; onDelete: () => void; onBack: () => void
  onAddDominio: () => void; onDeleteDominio: (id: string) => void
  saving: boolean
}) {
  const cfg = tenant.tenant_config?.[0] || {}

  function updateCfg(key: string, value: string) {
    const updated = { ...cfg, [key]: value }
    setTenant({ ...tenant, tenant_config: [updated] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-white">← Voltar</button>
        <h1 className="text-xl font-bold">{cfg.nome || tenant.nome}</h1>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{tenant.slug}</span>
      </div>

      {/* Dados do tenant */}
      <DarkCard title="Dados do site" icon={<Building2 className="w-5 h-5 text-violet-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DarkField label="Slug" value={tenant.slug} onChange={(v) => setTenant({ ...tenant, slug: v })} />
          <DarkField label="Nome" value={tenant.nome} onChange={(v) => setTenant({ ...tenant, nome: v })} />
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
            <select value={tenant.status} onChange={(e) => setTenant({ ...tenant, status: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-gray-600 bg-gray-700 text-white text-sm outline-none">
              <option value="ativo">Ativo</option>
              <option value="suspenso">Suspenso</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Plano</label>
            <select value={tenant.plano} onChange={(e) => setTenant({ ...tenant, plano: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-gray-600 bg-gray-700 text-white text-sm outline-none">
              <option value="basico">Básico</option>
              <option value="profissional">Profissional</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </DarkCard>

      {/* Configuração */}
      <DarkCard title="Identidade e contato" icon={<Settings className="w-5 h-5 text-violet-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DarkField label="Nome do site" value={cfg.nome} onChange={(v) => updateCfg('nome', v)} />
          <DarkField label="Tagline" value={cfg.tagline} onChange={(v) => updateCfg('tagline', v)} />
          <DarkField label="WhatsApp" value={cfg.whatsapp} onChange={(v) => updateCfg('whatsapp', v)} />
          <DarkField label="WhatsApp display" value={cfg.whatsapp_display} onChange={(v) => updateCfg('whatsapp_display', v)} />
          <DarkField label="Telefone" value={cfg.phone} onChange={(v) => updateCfg('phone', v)} />
          <DarkField label="E-mail" value={cfg.email} onChange={(v) => updateCfg('email', v)} />
          <DarkField label="Cidade" value={cfg.cidade} onChange={(v) => updateCfg('cidade', v)} />
          <DarkField label="UF" value={cfg.uf} onChange={(v) => updateCfg('uf', v)} />
          <DarkField label="Endereço" value={cfg.endereco} onChange={(v) => updateCfg('endereco', v)} className="md:col-span-2" />
          <DarkField label="Instagram" value={cfg.instagram} onChange={(v) => updateCfg('instagram', v)} />
          <DarkField label="CNPJ" value={cfg.cnpj} onChange={(v) => updateCfg('cnpj', v)} />
          <DarkField label="Horário" value={cfg.horario} onChange={(v) => updateCfg('horario', v)} className="md:col-span-2" />
        </div>
      </DarkCard>

      {/* Cores */}
      <DarkCard title="Paleta de cores" icon={<Palette className="w-5 h-5 text-violet-400" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'cor_primaria', label: 'Primária' },
            { key: 'cor_primaria_dark', label: 'Primária escura' },
            { key: 'cor_secundaria', label: 'Secundária' },
            { key: 'cor_secundaria_dark', label: 'Secundária escura' },
            { key: 'cor_accent', label: 'Accent' },
            { key: 'cor_text', label: 'Texto' },
            { key: 'cor_bg_alt', label: 'BG alt' },
          ].map((c) => (
            <div key={c.key}>
              <label className="block text-xs font-medium text-gray-400 mb-1">{c.label}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={cfg[c.key] || '#000000'} onChange={(e) => updateCfg(c.key, e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-600 cursor-pointer p-0.5 bg-gray-700" />
                <input type="text" value={cfg[c.key] || ''} onChange={(e) => updateCfg(c.key, e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border border-gray-600 bg-gray-700 text-white text-sm font-mono outline-none" />
              </div>
            </div>
          ))}
        </div>
      </DarkCard>

      {/* Marca visual */}
      <DarkCard title="Marca visual" icon={<Eye className="w-5 h-5 text-violet-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DarkField label="URL do logo" value={cfg.logo_url} onChange={(v) => updateCfg('logo_url', v)} />
          <DarkField label="URL do favicon" value={cfg.favicon_url} onChange={(v) => updateCfg('favicon_url', v)} />
          <DarkField label="Nome do atendente" value={cfg.atendente_nome} onChange={(v) => updateCfg('atendente_nome', v)} />
          <DarkField label="Foto atendente (URL)" value={cfg.atendente_foto_url} onChange={(v) => updateCfg('atendente_foto_url', v)} />
          <DarkField label="Google Maps URL" value={cfg.google_maps_url} onChange={(v) => updateCfg('google_maps_url', v)} className="md:col-span-2" />
        </div>
      </DarkCard>

      {/* Domínios */}
      <DarkCard title="Domínios" icon={<Globe className="w-5 h-5 text-violet-400" />}>
        <div className="space-y-2 mb-4">
          {dominios.map((d) => (
            <div key={d.id} className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-mono">{d.host}</span>
                {d.is_primary && <span className="text-xs bg-violet-900/50 text-violet-300 px-2 py-0.5 rounded-full">primário</span>}
              </div>
              <button onClick={() => onDeleteDominio(d.id)} className="text-gray-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {dominios.length === 0 && <p className="text-sm text-gray-500">Nenhum domínio configurado.</p>}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newDominio} onChange={(e) => setNewDominio(e.target.value)}
            placeholder="ex: meusite.com.br" onKeyDown={(e) => e.key === 'Enter' && onAddDominio()}
            className="flex-1 h-10 px-3 rounded-lg border border-gray-600 bg-gray-700 text-white text-sm outline-none" />
          <button onClick={onAddDominio} className="px-4 h-10 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </DarkCard>

      {/* Ações */}
      <div className="flex items-center gap-3">
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar tenant'}
        </button>
        <a href={`/admin`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-700 border border-gray-700">
          <ExternalLink className="w-4 h-4" /> Admin do site
        </a>
        <button onClick={onDelete}
          className="flex items-center gap-2 px-4 py-3 bg-red-900/30 text-red-400 text-sm font-medium rounded-xl hover:bg-red-900/50 ml-auto">
          <Trash2 className="w-4 h-4" /> Excluir tenant
        </button>
      </div>
    </div>
  )
}

// ═══════ Componentes dark theme ═══════

function DarkCard({ title, icon, children }: { title?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
          {icon}
          <h3 className="font-bold text-sm text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

function DarkField({ label, value, onChange, placeholder, className }: {
  label: string; value: string | null | undefined; onChange: (v: string) => void
  placeholder?: string; className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-gray-600 bg-gray-700 text-white text-sm focus:border-violet-500 outline-none"
      />
    </div>
  )
}
