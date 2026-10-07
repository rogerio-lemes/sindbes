'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Inbox, Building2, Briefcase, GraduationCap, Megaphone, ArrowRight, Handshake, ClipboardCheck, CheckCircle2 } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { PageHeader, Card, EmptyState } from '@/components/admin/ui'
import { usePendentes } from '@/components/admin/cadastros/comum'

interface Contagens {
  leads: number
  associados: number
  servicos: number
  curriculos: number
  banners: number
}

export default function AdminDashboard() {
  const { tenantId, tenantNome, perfil, canAccess } = useAdminAuth()
  const [c, setC] = useState<Contagens | null>(null)
  const [leadsRecentes, setLeadsRecentes] = useState<Record<string, unknown>[]>([])
  const pendentes = usePendentes()

  useEffect(() => {
    const sb = getBrowserClient()
    const contar = (tabela: string) =>
      sb.from(tabela).select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId)

    Promise.all([
      contar('leads'), contar('associados'), contar('servicos'),
      contar('curriculos'), contar('banners'),
    ]).then(([leads, associados, servicos, curriculos, banners]) => {
      setC({
        leads: leads.count ?? 0,
        associados: associados.count ?? 0,
        servicos: servicos.count ?? 0,
        curriculos: curriculos.count ?? 0,
        banners: banners.count ?? 0,
      })
    })

    if (canAccess('leads.ver')) {
      sb.from('leads').select('id, nome, telefone, origem, created_at')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data }) => setLeadsRecentes(data ?? []))
    }
  }, [tenantId, canAccess])

  const cards = [
    { label: 'Leads', valor: c?.leads, icon: Inbox, href: '/admin/leads', perm: 'leads.ver' },
    { label: 'Associados', valor: c?.associados, icon: Building2, href: '/admin/associados', perm: 'associados.ver' },
    { label: 'Serviços', valor: c?.servicos, icon: Briefcase, href: '/admin/servicos', perm: 'servicos.ver' },
    { label: 'Currículos', valor: c?.curriculos, icon: GraduationCap, href: '/admin/recrutamento', perm: 'recrutamento.ver' },
    { label: 'Banners', valor: c?.banners, icon: Megaphone, href: '/admin/banners', perm: 'banners.ver' },
  ].filter((card) => canAccess(card.perm))

  return (
    <>
      <PageHeader
        titulo={`Olá, ${(perfil.nome || perfil.email || '').split(' ')[0] || 'bem-vindo'}`}
        descricao={`Painel administrativo de ${tenantNome}`}
      />

      {cards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-primary/40 transition-colors"
            >
              <card.icon className="w-5 h-5 text-primary mb-3" />
              <p className="text-2xl font-bold text-gray-900">{card.valor ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      {(canAccess('parceiros.ver') || canAccess('associados.ver')) && (
        <CardPendentes
          parceiros={canAccess('parceiros.ver') ? pendentes?.parceiros : undefined}
          associados={canAccess('associados.ver') ? pendentes?.associados : undefined}
          carregando={pendentes === null}
        />
      )}

      {canAccess('leads.ver') && (
        <Card
          title="Últimos leads"
          icon={<Inbox className="w-4 h-4 text-primary" />}
          acoes={
            <Link href="/admin/leads" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {leadsRecentes.length === 0 ? (
            <EmptyState titulo="Nenhum lead ainda" descricao="Os contatos recebidos pelo site aparecem aqui." />
          ) : (
            <ul className="divide-y divide-gray-50 -my-2">
              {leadsRecentes.map((l) => (
                <li key={String(l.id)} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{String(l.nome ?? '—')}</p>
                    <p className="text-xs text-gray-400 truncate">{String(l.origem ?? '')}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {l.created_at ? new Date(String(l.created_at)).toLocaleDateString('pt-BR') : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </>
  )
}

/** Card com o total de parceiros + associados aguardando análise. */
function CardPendentes({ parceiros, associados, carregando }: { parceiros?: number; associados?: number; carregando: boolean }) {
  const total = (parceiros ?? 0) + (associados ?? 0)
  const itens = [
    { label: 'Parceiros', valor: parceiros, href: '/admin/parceiros', icon: Handshake },
    { label: 'Associados', valor: associados, href: '/admin/associados', icon: Building2 },
  ].filter((i) => i.valor !== undefined)

  return (
    <section
      className={`rounded-2xl border mb-6 overflow-hidden ${
        total > 0 ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-gray-100'
      }`}
    >
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              total > 0 ? 'bg-amber-500 text-white' : 'bg-primary/10 text-primary'
            }`}
          >
            {total > 0 ? <ClipboardCheck className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900">Cadastros aguardando análise</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {carregando
                ? 'Carregando...'
                : total > 0
                  ? 'Revise os dados e publique as páginas que chegaram pelo site.'
                  : 'Tudo em dia. Nenhum cadastro esperando revisão.'}
            </p>
          </div>
          <p className={`ml-auto text-3xl font-bold ${total > 0 ? 'text-amber-600' : 'text-gray-300'}`}>{carregando ? '·' : total}</p>
        </div>
        <div className="flex gap-2 sm:border-l sm:border-amber-200/70 sm:pl-5">
          {itens.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="flex-1 sm:flex-none flex items-center gap-2 h-11 px-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:border-primary hover:text-primary"
            >
              <i.icon className="w-4 h-4" />
              {i.label}
              <span
                className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  (i.valor ?? 0) > 0 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {carregando ? '·' : i.valor ?? 0}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
