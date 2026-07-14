import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BLOG_ARTICLES, IMAGES } from '@/lib/constants'
import Breadcrumbs from '@/components/Breadcrumbs'
import { ArrowRight } from 'lucide-react'

const blogImages: Record<string, string> = {
  'assessoria-juridica-para-salao-de-beleza-como-esco': IMAGES.blog1,
  'cursos-area-da-beleza-quais-sinais-de-que-sua-equi': IMAGES.blog2,
  'assessoria-contabil-salao-de-beleza-quanto-custa-e': IMAGES.blog3,
  'o-que-e-o-sindicato-da-area-da-beleza-e-por-que-do': IMAGES.blog4,
  'qualificacao-beleza-e-estetica-vale-a-pena-o-que-a': IMAGES.blog5,
  'beneficios-para-associados-sindibes-passo-a-passo-': IMAGES.blog6,
}

export const metadata: Metadata = {
  title: 'Blog | Dicas de Gestão e Beleza | Sindbes Uberlândia',
  description: 'Artigos sobre gestão, qualificação, assessoria jurídica e contábil e dicas para profissionais e empresas da beleza em Uberlândia. Blog do Sindbes.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Blog' }]} />

      <section className="max-w-[1200px] mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Blog</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Conteúdo para profissionais da <span>beleza</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Artigos práticos sobre gestão, qualificação, assessoria jurídica e contábil, e tudo para seu salão crescer em Uberlândia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_ARTICLES.map((a) => (
            <Link
              key={a.slug}
              href={`/${a.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={blogImages[a.slug] || IMAGES.blog1}
                  alt={a.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Blog
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-400 mb-2">Jul 2026 · 8 min de leitura</p>
                <h2 className="font-bold text-text group-hover:text-primary transition-colors leading-snug line-clamp-3 mb-3">
                  {a.titulo}
                </h2>
                <span className="inline-flex items-center gap-1 text-sm text-secondary font-medium">
                  Ler artigo <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sindbes.vercel.app/' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://sindbes.vercel.app/blog' },
            ],
          }),
        }}
      />
    </>
  )
}
