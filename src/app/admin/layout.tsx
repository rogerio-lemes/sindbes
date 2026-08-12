import type { Metadata } from 'next'
import AdminGate from '@/components/admin/AdminGate'

export const metadata: Metadata = {
  title: 'Painel Administrativo',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGate>{children}</AdminGate>
}
