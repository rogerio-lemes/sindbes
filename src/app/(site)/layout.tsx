import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import WhatsAppChat from '@/components/WhatsAppChat'
import MobileCaptureBar from '@/components/MobileCaptureBar'
import PwaInstallCard from '@/components/PwaInstallCard'
import ExitPopup from '@/components/ExitPopup'
import ScrollRevealProvider from '@/components/ScrollRevealProvider'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
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
    </>
  )
}
