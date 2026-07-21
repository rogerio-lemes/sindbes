import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
})

// Metadata default — será sobrescrita por páginas que chamam getTenant()
export const metadata: Metadata = {
  title: 'Plataforma de Sites para Sindicatos',
  description: 'Plataforma completa para sindicatos criarem e gerenciarem seus sites.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-montserrat antialiased">
        {children}
      </body>
    </html>
  )
}
