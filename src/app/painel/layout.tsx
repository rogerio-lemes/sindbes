import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Super Admin — Plataforma',
  robots: 'noindex, nofollow',
}

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
