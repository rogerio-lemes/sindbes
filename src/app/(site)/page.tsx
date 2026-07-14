import { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'Sindbes | Sindicato da Beleza de Uberlândia MG',
  description: 'Sindbes, o Sindicato da Beleza de Uberlândia. Treinamentos, assessoria jurídica e contábil, planos de saúde, crédito e benefícios para o setor da beleza.',
  alternates: { canonical: '/' },
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Sindbes - Sindicato da Beleza',
            description: 'Sindicato representando profissionais e empresas da beleza em Uberlândia, MG.',
            url: 'https://sindbes.vercel.app',
            telephone: '+5534984468553',
            email: 'adm.sindibes@gmail.com',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Uberlândia',
              addressRegion: 'MG',
              addressCountry: 'BR',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '-18.9186',
              longitude: '-48.2772',
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '18:00',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '08:00',
                closes: '12:00',
              },
            ],
          }),
        }}
      />
    </>
  )
}
