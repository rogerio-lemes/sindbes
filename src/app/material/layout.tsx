import type { Metadata } from 'next'

export const metadata: Metadata = {
  // Material interno de apoio: não deve ser indexado nem aparecer em busca
  robots: 'noindex, nofollow',
}

export default function MaterialLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-bg-alt">{children}</div>
}
