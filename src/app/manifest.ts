import type { MetadataRoute } from 'next'

// Manifest dinâmico — usa defaults (Sindibes) como fallback
// Em multi-tenant real, o manifest seria por tenant via rota customizada,
// mas Next.js só suporta 1 manifest.ts. Para Fase 1, usamos defaults.
// Fase 2: criar rota /api/manifest?tenant=slug para servir por tenant.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sindicato - Plataforma de Sites',
    short_name: 'Sindicato',
    description: 'Plataforma de sites para sindicatos da beleza',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#2E9E8D',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
