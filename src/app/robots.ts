import type { MetadataRoute } from 'next'

/** Regras para os buscadores (/robots.txt): painel, rotas internas e material de apoio ficam fora. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/material'] }],
    sitemap: 'https://sindibes.com.br/sitemap.xml',
    host: 'https://sindibes.com.br',
  }
}
