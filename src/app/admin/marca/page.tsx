'use client'

import { useEffect, useState } from 'react'
import { Building2, Phone, MapPin, Palette, FileText, Mail, AtSign, Clock } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { PageHeader, Card, Field, ColorField, SaveBar, PermissionGuard } from '@/components/admin/ui'

type Config = Record<string, string | number | null>

export default function MarcaPage() {
  const { tenantId, canAccess } = useAdminAuth()
  const [config, setConfig] = useState<Config | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const podeEditar = canAccess('marca.editar')

  useEffect(() => {
    getBrowserClient()
      .from('tenant_config').select('*').eq('tenant_id', tenantId).maybeSingle()
      .then(({ data }) => setConfig(data as Config))
  }, [tenantId])

  async function salvar() {
    if (!config) return
    setSaving(true)
    const { tenant_id: _t, updated_at: _u, ...rest } = config
    await getBrowserClient()
      .from('tenant_config')
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq('tenant_id', tenantId)
    setSaving(false)
    setMessage('Configurações salvas!')
    setTimeout(() => setMessage(''), 3000)
  }

  const set = (campo: string) => (v: string) => setConfig((c) => (c ? { ...c, [campo]: v } : c))

  return (
    <PermissionGuard permissao="marca.ver">
      <PageHeader titulo="Marca e identidade" descricao="Dados institucionais, contato e paleta de cores do site." />

      {!config ? (
        <Card><p className="text-gray-400 text-center py-8">Carregando configurações...</p></Card>
      ) : (
        <>
          <Card title="Identidade" icon={<Building2 className="w-4 h-4 text-primary" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nome do site" value={config.nome as string} onChange={set('nome')} disabled={!podeEditar} />
              <Field label="Tagline / Slogan" value={config.tagline as string} onChange={set('tagline')} disabled={!podeEditar} />
              <Field label="CNPJ" value={config.cnpj as string} onChange={set('cnpj')} disabled={!podeEditar} />
              <Field label="Horário de funcionamento" value={config.horario as string} onChange={set('horario')} icon={<Clock className="w-4 h-4" />} disabled={!podeEditar} />
            </div>
          </Card>

          <Card title="Contato" icon={<Phone className="w-4 h-4 text-primary" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="WhatsApp (só números)" value={config.whatsapp as string} onChange={set('whatsapp')} placeholder="5534999999999" icon={<Phone className="w-4 h-4" />} disabled={!podeEditar} />
              <Field label="WhatsApp (exibição)" value={config.whatsapp_display as string} onChange={set('whatsapp_display')} placeholder="(34) 99999-9999" disabled={!podeEditar} />
              <Field label="Telefone" value={config.phone as string} onChange={set('phone')} disabled={!podeEditar} />
              <Field label="E-mail" value={config.email as string} onChange={set('email')} icon={<Mail className="w-4 h-4" />} disabled={!podeEditar} />
              <Field label="Instagram" value={config.instagram as string} onChange={set('instagram')} icon={<AtSign className="w-4 h-4" />} disabled={!podeEditar} />
            </div>
          </Card>

          <Card title="Localização" icon={<MapPin className="w-4 h-4 text-primary" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <Field label="Endereço" value={config.endereco as string} onChange={set('endereco')} disabled={!podeEditar} />
              </div>
              <Field label="Cidade" value={config.cidade as string} onChange={set('cidade')} disabled={!podeEditar} />
              <Field label="UF" value={config.uf as string} onChange={set('uf')} disabled={!podeEditar} />
              <Field label="URL do Google Maps" value={config.google_maps_url as string} onChange={set('google_maps_url')} disabled={!podeEditar} />
            </div>
          </Card>

          <Card title="Paleta de cores" icon={<Palette className="w-4 h-4 text-primary" />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorField label="Primária" value={config.cor_primaria as string} onChange={set('cor_primaria')} />
              <ColorField label="Primária escura" value={config.cor_primaria_dark as string} onChange={set('cor_primaria_dark')} />
              <ColorField label="Secundária" value={config.cor_secundaria as string} onChange={set('cor_secundaria')} />
              <ColorField label="Secundária escura" value={config.cor_secundaria_dark as string} onChange={set('cor_secundaria_dark')} />
              <ColorField label="Destaque (accent)" value={config.cor_accent as string} onChange={set('cor_accent')} />
              <ColorField label="Texto" value={config.cor_text as string} onChange={set('cor_text')} />
              <ColorField label="Fundo alternativo" value={config.cor_bg_alt as string} onChange={set('cor_bg_alt')} />
            </div>
          </Card>

          <Card title="Marca visual e atendente" icon={<FileText className="w-4 h-4 text-primary" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="URL do logo" value={config.logo_url as string} onChange={set('logo_url')} placeholder="https://..." disabled={!podeEditar} />
              <Field label="URL do favicon" value={config.favicon_url as string} onChange={set('favicon_url')} placeholder="https://..." disabled={!podeEditar} />
              <Field label="Nome do atendente virtual" value={config.atendente_nome as string} onChange={set('atendente_nome')} disabled={!podeEditar} />
              <Field label="Foto do atendente (URL)" value={config.atendente_foto_url as string} onChange={set('atendente_foto_url')} disabled={!podeEditar} />
            </div>
          </Card>

          {podeEditar && <SaveBar onSave={salvar} saving={saving} message={message} />}
        </>
      )}
    </PermissionGuard>
  )
}
