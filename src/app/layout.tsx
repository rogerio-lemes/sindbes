import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Sindbes - Sindicato da Beleza | Uberlândia MG',
  description: 'Sindbes, o Sindicato da Beleza de Uberlândia. Treinamentos, assessoria jurídica e contábil, benefícios, planos de saúde e odontológico para profissionais e empresas da beleza.',
  metadataBase: new URL('https://sindbes.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Sindbes - Sindicato da Beleza',
  },
  other: {
    'geo.region': 'BR-MG',
    'geo.placename': 'Uberlândia',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B1A4A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-montserrat antialiased">
        {children}
      </body>
    </html>
  )
}
