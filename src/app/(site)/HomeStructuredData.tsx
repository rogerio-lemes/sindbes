'use client'

import { useTenant } from '@/components/TenantProvider'

export default function HomeStructuredData() {
  const { config } = useTenant()

  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: config.nome,
    description: config.tagline || config.nome,
    telephone: config.phone || config.whatsapp || '',
    email: config.email || '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: config.cidade || '',
      addressRegion: config.uf || '',
      addressCountry: 'BR',
    },
    ...(config.lat && config.lng ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: String(config.lat),
        longitude: String(config.lng),
      },
    } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
