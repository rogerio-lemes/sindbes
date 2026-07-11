import Link from 'next/link'
import Image from 'next/image'
import { BLOG_ARTICLES, IMAGES } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'

const blogImages: Record<string, string> = {
  'assessoria-juridica-para-salao-de-beleza-como-esco': IMAGES.blog1,
  'cursos-area-da-beleza-quais-sinais-de-que-sua-equi': IMAGES.blog2,
  'assessoria-contabil-salao-de-beleza-quanto-custa-e': IMAGES.blog3,
  'o-que-e-o-sindicato-da-area-da-beleza-e-por-que-do': IMAGES.blog4,
}

export default function BlogPreview() {
  const articles = BLOG_ARTICLES.slice(0, 4)

  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Blog</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Conteúdo para <span>seu negócio</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Artigos práticos sobre gestão, qualificação, assessoria e tudo que você precisa para fazer seu salão crescer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((a, i) => (
            <Link
              key={a.slug}
              href={`/${a.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow scroll-reveal"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
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
              <div className="p-5">
                <h3 className="font-semibold text-text group-hover:text-primary transition-colors text-sm leading-snug line-clamp-3">
                  {a.titulo}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs text-secondary font-medium mt-3">
                  Ler artigo <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors"
          >
            Ver todos os artigos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
