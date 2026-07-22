import { Metadata } from 'next'
import { getTenant } from '@/lib/tenant'
import HeroCarousel from '@/components/sections/HeroCarousel'
import ServicesGrid from '@/components/sections/ServicesGrid'
import Diferenciais from '@/components/sections/Diferenciais'
import About from '@/components/sections/About'
import Testimonials from '@/components/sections/Testimonials'
import BlogPreview from '@/components/sections/BlogPreview'
import Faq from '@/components/sections/Faq'
import CtaBanner from '@/components/sections/CtaBanner'
import ParceirosSlider from '@/components/sections/ParceirosSlider'
import ContactSection from '@/components/sections/ContactSection'
import MapLocation from '@/components/sections/MapLocation'
import EeatBio from '@/components/sections/EeatBio'
import HomeStructuredData from './HomeStructuredData'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `${config.nome} | ${config.tagline || 'Sindicato da Beleza'}`,
    description: `${config.nome}. Treinamentos, assessoria jurídica e contábil, planos de saúde, crédito e benefícios para o setor da beleza${config.cidade ? ` em ${config.cidade}` : ''}.`,
    alternates: { canonical: '/' },
  }
}

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <ServicesGrid />
      <Diferenciais />
      <About />
      <Testimonials />
      <CtaBanner />
      <ParceirosSlider />
      <BlogPreview />
      <Faq />
      <EeatBio />
      <ContactSection />
      <MapLocation />
      <HomeStructuredData />
    </>
  )
}
