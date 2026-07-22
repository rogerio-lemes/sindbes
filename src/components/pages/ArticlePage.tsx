'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BLOG_ARTICLES, IMAGES } from '@/lib/constants'
import { ARTICLE_CONTENT } from '@/lib/article-content'
import { useTenant, useWhatsappUrl } from '@/components/TenantProvider'
import ScrollSpyNav from '@/components/ScrollSpyNav'
import Breadcrumbs from '@/components/Breadcrumbs'
import ArticleAudioPlayer from '@/components/ArticleAudioPlayer'
import { ArrowRight, Calendar, Clock, Share2, User } from 'lucide-react'

interface Props {
  article: { titulo: string; slug: string }
  image: string
}

const blogImages: Record<string, string> = {
  'assessoria-juridica-para-salao-de-beleza-como-esco': IMAGES.blog1,
  'cursos-area-da-beleza-quais-sinais-de-que-sua-equi': IMAGES.blog2,
  'assessoria-contabil-salao-de-beleza-quanto-custa-e': IMAGES.blog3,
  'o-que-e-o-sindicato-da-area-da-beleza-e-por-que-do': IMAGES.blog4,
  'qualificacao-beleza-e-estetica-vale-a-pena-o-que-a': IMAGES.blog5,
  'beneficios-para-associados-sindibes-passo-a-passo-': IMAGES.blog6,
}

export default function ArticlePage({ article, image }: Props) {
  const { config, servicos } = useTenant()
  const content = ARTICLE_CONTENT[article.slug]
  const otherArticles = BLOG_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3)
  const relatedService = content?.relatedService
    ? servicos.find((s) => s.slug === content.relatedService)
    : null

  const sidebarWhatsUrl = useWhatsappUrl(`Olá! Li o artigo "${article.titulo}" e gostaria de mais informações. 📍 Origem: Blog - ${article.titulo}`)

  const audioText = [
    article.titulo,
    content?.intro || '',
    ...(content?.sections?.flatMap((s) => [`${s.title} ${s.highlightWord || ''}`, ...s.paragraphs]) || []),
    content?.conclusion || '',
  ].filter(Boolean).join('. ')

  function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: article.titulo, url: window.location.href })
    }
  }

  return (
    <>
      {content?.tocItems && <ScrollSpyNav sections={content.tocItems} />}

      <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: article.titulo }]} />

      <article className="max-w-[1200px] mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-bg-alt rounded-xl p-5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">Neste artigo</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {(content?.tocItems || [
                    { id: 'intro', label: 'Introdução' },
                    { id: 'conteudo', label: 'Conteúdo' },
                    { id: 'conclusao', label: 'Conclusão' },
                  ]).map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="hover:text-primary transition-colors">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={sidebarWhatsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 gradient-primary text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
              >
                Falar no WhatsApp
              </a>

              {relatedService && (
                <div className="bg-primary/5 rounded-xl p-5">
                  <p className="text-xs font-semibold text-primary mb-2">Serviço relacionado</p>
                  <p className="text-xs text-gray-600 mb-3">{relatedService.nome}</p>
                  <Link href={`/${relatedService.slug}`} className="text-xs font-semibold text-secondary hover:text-secondary-dark">
                    Saiba mais →
                  </Link>
                </div>
              )}

              <div className="bg-bg-alt rounded-xl p-5">
                <p className="text-xs font-semibold text-primary mb-2">Precisa de ajuda?</p>
                <p className="text-xs text-gray-500 mb-3">Nossa equipe está pronta para orientar você.</p>
                <Link href="/contato" className="text-xs font-semibold text-secondary hover:text-secondary-dark">
                  Fale conosco →
                </Link>
              </div>
            </div>
          </aside>

          <div>
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-4">
              Blog
            </span>

            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
              {article.titulo}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> Equipe {config.nome}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Jul 2026</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 8 min de leitura</span>
              <button onClick={handleShare} className="flex items-center gap-1 hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" /> Compartilhar
              </button>
            </div>

            <ArticleAudioPlayer text={audioText} />

            <div className="relative h-[300px] md:h-[450px] rounded-2xl overflow-hidden mb-8">
              <Image src={image} alt={article.titulo} fill className="object-cover" priority />
            </div>

            <div className="bg-bg-alt rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-sm">Quer resolver isso agora?</p>
                <p className="text-xs text-gray-500">Fale com nossa equipe pelo WhatsApp.</p>
              </div>
              <a
                href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Olá! Li o artigo "${article.titulo}" e preciso de ajuda. 📍 Origem: Blog`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 gradient-cta text-white font-semibold rounded-xl text-sm whitespace-nowrap"
              >
                Falar agora
              </a>
            </div>

            <div id="intro" className="mb-8">
              <p className="text-gray-600 leading-relaxed text-lg">
                {content?.intro || `Se você chegou até aqui, provavelmente está buscando respostas concretas sobre como fortalecer seu negócio no setor da beleza. Este artigo foi preparado pela equipe do ${config.nome} para ajudar profissionais e empresários como você.`}
              </p>
            </div>

            {content?.sections ? (
              content.sections.map((section, i) => (
                <div key={i} id={`section-${i}`} className="mb-8 space-y-4">
                  <h2 className="text-xl font-bold bicolor-title">
                    {section.title} <span>{section.highlightWord}</span>
                  </h2>
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="text-gray-600 leading-relaxed">{p}</p>
                  ))}

                  {i === 1 && (
                    <a
                      href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Quero saber mais sobre o assunto do artigo "${article.titulo}". 📍 Origem: Blog`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity mt-4"
                    >
                      Tire suas dúvidas pelo WhatsApp <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div id="conteudo" className="mb-8 space-y-4">
                <h2 className="text-xl font-bold bicolor-title">O que você precisa <span>saber</span></h2>
                <p className="text-gray-600 leading-relaxed">
                  O mercado da beleza cresce a cada ano, mas com ele crescem também os desafios. O {config.nome} existe para ser seu parceiro nessa jornada.
                </p>
              </div>
            )}

            <div id="conclusao" className="mb-8">
              <h2 className="text-xl font-bold bicolor-title">Próximos <span>passos</span></h2>
              <p className="text-gray-600 leading-relaxed mt-4">
                {content?.conclusion || 'Agora que você tem essas informações, o próximo passo é conversar com nossa equipe. Vamos entender sua situação e indicar a melhor solução para seu negócio.'}
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white mb-12">
              <h3 className="text-xl font-bold mb-2">Gostou do conteúdo?</h3>
              <p className="text-white/80 text-sm mb-4">
                Fale com o {config.nome} e descubra como aplicar essas informações no seu negócio.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Olá! Li o artigo "${article.titulo}" e quero conversar. 📍 Origem: Blog`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-white font-semibold rounded-xl text-sm"
                >
                  Falar no WhatsApp
                </a>
                {relatedService && (
                  <Link
                    href={`/${relatedService.slug}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-semibold rounded-xl text-sm border border-white/30"
                  >
                    Ver {relatedService.nome}
                  </Link>
                )}
              </div>
            </div>

            <div className="bg-bg-alt rounded-2xl p-6 flex flex-col sm:flex-row gap-4 mb-12">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-secondary/20">
                <Image src={IMAGES.sobre} alt={`Equipe ${config.nome}`} width={64} height={64} className="object-cover w-full h-full" />
              </div>
              <div>
                <p className="font-bold text-sm">Equipe {config.nome}</p>
                <p className="text-xs text-gray-500 mb-2">{config.tagline || config.nome}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Conteúdo produzido pela equipe de especialistas do {config.nome}, com base na experiência real de atender centenas de profissionais e empresas da beleza{config.cidade ? ` em ${config.cidade}` : ''}. Cada artigo é revisado por profissionais do setor jurídico, contábil e de gestão.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 bicolor-title">Veja <span>também</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {otherArticles.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/${a.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={blogImages[a.slug] || IMAGES.blog1}
                        alt={a.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-xs text-text group-hover:text-primary transition-colors line-clamp-2">
                        {a.titulo}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.titulo,
            author: { '@type': 'Person', name: `Equipe ${config.nome}` },
            publisher: { '@type': 'Organization', name: config.nome },
          }),
        }}
      />
    </>
  )
}
