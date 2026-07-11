'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { P, SITE } from '@/lib/constants'
import { LogOut, FileText, Users, Settings, Eye, Save, Trash2, Plus, GripVertical, ChevronDown, ChevronUp } from 'lucide-react'

function getSupabase() {
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
  const [activeTab, setActiveTab] = useState<'leads' | 'pages' | 'config'>('leads')
  const [leads, setLeads] = useState<any[]>([])
  const [pages, setPages] = useState<any[]>([])
  const [config, setConfig] = useState<any>(null)
  const [editingPage, setEditingPage] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

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

  const loadData = useCallback(async () => {
    if (activeTab === 'leads') {
      const { data } = await getSupabase().from(`${P}leads`).select('*').order('created_at', { ascending: false }).limit(100)
      setLeads(data || [])
    } else if (activeTab === 'pages') {
      const { data } = await getSupabase().from(`${P}paginas`).select('*').order('ordem_menu', { ascending: true })
      setPages(data || [])
    } else if (activeTab === 'config') {
      const { data } = await getSupabase().from(`${P}config`).select('*').limit(1).single()
      setConfig(data)
    }
  }, [activeTab])

  useEffect(() => {
    if (session) loadData()
  }, [session, activeTab, loadData])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
  }

  async function handleLogout() {
    await getSupabase().auth.signOut()
    setSession(null)
  }

  async function loadSections(pageId: string) {
    const { data } = await getSupabase().from(`${P}secoes`).select('*').eq('pagina_id', pageId).order('ordem', { ascending: true })
    setSections(data || [])
  }

  async function savePage() {
    if (!editingPage) return
    setSaving(true)
    const { id, ...rest } = editingPage
    rest.updated_at = new Date().toISOString()
    await getSupabase().from(`${P}paginas`).update(rest).eq('id', id)
    setMessage('Página salva!')
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
    loadData()
  }

  async function saveConfig() {
    if (!config) return
    setSaving(true)
    const { id, ...rest } = config
    rest.updated_at = new Date().toISOString()
    await getSupabase().from(`${P}config`).update(rest).eq('id', id)
    setMessage('Configurações salvas!')
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function saveSection(section: any) {
    setSaving(true)
    const { id, ...rest } = section
    await getSupabase().from(`${P}secoes`).update(rest).eq('id', id)
    setMessage('Seção salva!')
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function deleteSection(sectionId: string) {
    await getSupabase().from(`${P}secoes`).delete().eq('id', sectionId)
    setSections(sections.filter((s) => s.id !== sectionId))
  }

  async function addSection(pageId: string) {
    const ordem = sections.length > 0 ? Math.max(...sections.map((s) => s.ordem)) + 1 : 0
    const { data } = await getSupabase().from(`${P}secoes`).insert({
      pagina_id: pageId,
      tipo: 'texto',
      ordem,
      conteudo: { titulo: 'Nova seção', texto: '' },
      visivel: true,
    }).select().single()
    if (data) setSections([...sections, data])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-alt p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">S</div>
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-gray-500 mt-1">{SITE.name}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            {authError && <p className="text-sm text-red-500">{authError}</p>}
            <button type="submit" className="w-full h-12 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">Entrar</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-alt">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">S</div>
          <span className="font-bold text-sm">Admin Sindbes</span>
        </div>
        <div className="flex items-center gap-4">
          {message && <span className="text-sm text-green-600 font-medium">{message}</span>}
          <a href="/" target="_blank" className="text-sm text-gray-500 hover:text-primary flex items-center gap-1"><Eye className="w-4 h-4" /> Ver site</a>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"><LogOut className="w-4 h-4" /> Sair</button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          {[
            { key: 'leads' as const, icon: Users, label: 'Leads' },
            { key: 'pages' as const, icon: FileText, label: 'Páginas' },
            { key: 'config' as const, icon: Settings, label: 'Configurações' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setEditingPage(null) }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* LEADS */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">Leads capturados</h2>
                <p className="text-sm text-gray-500 mt-1">{leads.length} leads encontrados</p>
              </div>
            </div>
            <div className="overflow-x-auto">
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
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{lead.nome}</td>
                      <td className="px-6 py-4 text-sm">
                        <a href={`https://wa.me/55${lead.telefone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{lead.telefone}</a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{lead.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{lead.origem || lead.pagina_slug}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : ''}</td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Nenhum lead capturado ainda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAGES */}
        {activeTab === 'pages' && !editingPage && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg">Páginas do site</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {pages.map((page) => (
                <div key={page.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => { setEditingPage({ ...page }); loadSections(page.id) }}>
                  <div>
                    <p className="font-medium text-sm">{page.title || page.slug}</p>
                    <p className="text-xs text-gray-400">/{page.slug} · {page.tipo}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${page.publicada ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {page.publicada ? 'Publicada' : 'Rascunho'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
              {pages.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-400">Execute o seed.sql para popular as tabelas.</div>
              )}
            </div>
          </div>
        )}

        {/* EDIT PAGE */}
        {activeTab === 'pages' && editingPage && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setEditingPage(null)} className="text-sm text-gray-500 hover:text-primary">← Voltar</button>
              <h2 className="font-bold text-lg">Editando: {editingPage.title || editingPage.slug}</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Título (title)</label>
                  <input type="text" value={editingPage.title || ''} onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">H1</label>
                  <input type="text" value={editingPage.h1 || ''} onChange={(e) => setEditingPage({ ...editingPage, h1: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Meta Description</label>
                  <textarea value={editingPage.meta_description || ''} onChange={(e) => setEditingPage({ ...editingPage, meta_description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Palavra-chave</label>
                  <input type="text" value={editingPage.palavra_chave || ''} onChange={(e) => setEditingPage({ ...editingPage, palavra_chave: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={editingPage.publicada} onChange={(e) => setEditingPage({ ...editingPage, publicada: e.target.checked })} className="rounded" />
                    Publicada
                  </label>
                </div>
              </div>
              <button onClick={savePage} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar página'}
              </button>
            </div>

            {/* Sections */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">Seções ({sections.length})</h3>
                <button onClick={() => addSection(editingPage.id)} className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary-dark">
                  <Plus className="w-3 h-3" /> Adicionar seção
                </button>
              </div>

              <div className="space-y-3">
                {sections.map((section, i) => (
                  <SectionEditor key={section.id} section={section} index={i} onSave={saveSection} onDelete={deleteSection} />
                ))}
                {sections.length === 0 && <p className="text-sm text-gray-400">Nenhuma seção nesta página.</p>}
              </div>
            </div>
          </div>
        )}

        {/* CONFIG */}
        {activeTab === 'config' && config && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="font-bold text-lg mb-6">Configurações do site</h2>
            <div className="space-y-4 max-w-lg">
              {[
                { key: 'nome', label: 'Nome do site' },
                { key: 'whatsapp', label: 'WhatsApp (apenas números)' },
                { key: 'telefone', label: 'Telefone (formatado)' },
                { key: 'email', label: 'Email' },
                { key: 'endereco', label: 'Endereço' },
                { key: 'instagram', label: 'Instagram' },
                { key: 'cor_primaria', label: 'Cor primária (hex)' },
                { key: 'cor_secundaria', label: 'Cor secundária (hex)' },
                { key: 'logo_url', label: 'URL da logo' },
                { key: 'google_maps_url', label: 'Google Maps URL' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={config[field.key] || ''}
                    onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
                  />
                </div>
              ))}
            </div>
            <button onClick={saveConfig} disabled={saving} className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar configurações'}
            </button>
          </div>
        )}

        {activeTab === 'config' && !config && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400">
            Execute o seed.sql para criar as configurações iniciais.
          </div>
        )}
      </div>
    </div>
  )
}

function SectionEditor({ section, index, onSave, onDelete }: { section: any; index: number; onSave: (s: any) => void; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(section)
  const [content, setContent] = useState(JSON.stringify(section.conteudo, null, 2))

  function handleSave() {
    try {
      const parsed = JSON.parse(content)
      onSave({ ...data, conteudo: parsed })
    } catch {
      alert('JSON inválido no conteúdo')
    }
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4 text-gray-300" />
          <span className="text-sm font-medium">{data.tipo}</span>
          <span className="text-xs text-gray-400">ordem: {data.ordem}</span>
          {!data.visivel && <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">Oculta</span>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </div>

      {open && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
              <input type="text" value={data.tipo} onChange={(e) => setData({ ...data, tipo: e.target.value })} className="w-full h-8 px-2 rounded border border-gray-200 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Ordem</label>
              <input type="number" value={data.ordem} onChange={(e) => setData({ ...data, ordem: parseInt(e.target.value) || 0 })} className="w-full h-8 px-2 rounded border border-gray-200 text-xs" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={data.visivel} onChange={(e) => setData({ ...data, visivel: e.target.checked })} />
                Visível
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Conteúdo (JSON)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono focus:border-primary outline-none resize-y" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg">
              <Save className="w-3 h-3" /> Salvar
            </button>
            <button onClick={() => onDelete(section.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 text-xs font-medium rounded-lg hover:bg-red-100">
              <Trash2 className="w-3 h-3" /> Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
