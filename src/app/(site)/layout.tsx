import type { Metadata } from 'next'
import { getTenant, getServicos } from '@/lib/tenant'
import TenantTheme from '@/components/TenantTheme'
import { TenantProvider } from '@/components/TenantProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import WhatsAppChat from '@/components/WhatsAppChat'
import MobileCaptureBar from '@/components/MobileCaptureBar'
import PwaInstallCard from '@/components/PwaInstallCard'
import ExitPopup from '@/components/ExitPopup'
import ScrollRevealProvider from '@/components/ScrollRevealProvider'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

// Metadata dinâmica por tenant
export async function generateMetadata(): Promise<Metadata> {
  let title = 'Plataforma de Sites para Sindicatos'
  let description = 'Plataforma completa para sindicatos.'

  try {
    const tenant = await getTenant()
    const cfg = tenant.config
    title = (cfg.meta as Record<string, string>)?.seoTitle || `${cfg.nome} | ${cfg.cidade || ''}`
    description = (cfg.meta as Record<string, string>)?.seoDescription ||
      `${cfg.nome} — ${cfg.tagline || 'Sindicato'} de ${cfg.cidade || ''}`
  } catch {
    // Se não resolver tenant (ex: super-admin), usa defaults
  }

  return {
    title: { default: title, template: `%s | ${title.split('|')[0].trim()}` },
    description,
    openGraph: { type: 'website', locale: 'pt_BR', siteName: title },
    other: { 'geo.region': 'BR-MG' },
  }
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Resolver tenant (pode ser notFound se host inválido)
  const tenant = await getTenant()
  const servicos = await getServicos(tenant.id)

  const tenantData = {
    tenantId: tenant.id,
    slug: tenant.slug,
    config: tenant.config,
    servicos,
  }

  return (
    <>
      {/* Injeta cores do tenant sobre os defaults do @theme */}
      <TenantTheme config={tenant.config} />

      {/* Provê dados do tenant para client components */}
      <TenantProvider value={tenantData}>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
        <WhatsAppChat />
        <MobileCaptureBar />
        <PwaInstallCard />
        <ExitPopup />
        <ScrollRevealProvider />
        <ServiceWorkerRegister />
      </TenantProvider>
    </>
  )
}
