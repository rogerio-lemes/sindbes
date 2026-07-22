import { Metadata } from 'next'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactSection from '@/components/sections/ContactSection'
import MapLocation from '@/components/sections/MapLocation'
import ContatoCanais from './ContatoCanais'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `Contato | Fale com o ${config.nome}`,
    description: `Entre em contato com o ${config.nome}. Agende uma visita, tire suas dúvidas ou solicite um orçamento pelo WhatsApp, telefone ou formulário.`,
    alternates: { canonical: '/contato' },
  }
}

export default function ContatoPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Contato' }]} />
      <ContatoCanais />
      <ContactSection />
      <MapLocation />
    </>
  )
}
