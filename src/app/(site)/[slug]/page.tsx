import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SERVICES, BLOG_ARTICLES, IMAGES, SITE, whatsappUrl } from '@/lib/constants'
import ServicePage from '@/components/pages/ServicePage'
import ArticlePage from '@/components/pages/ArticlePage'

const serviceImages: Record<string, string> = {
  'treinamentos-e-qualificacoes-profissionais': IMAGES.servTreinamentos,
  'assessoria-juridica-e-contabil-para-empresas-da-be': IMAGES.servAssessoria,
  'beneficios-para-associados': IMAGES.servBeneficios,
  'plano-de-saude': IMAGES.servPlanoSaude,
  'qualificacao-em-gestao-financeira': IMAGES.servGestaoFinanceira,
  'qualificacao-em-gestao-de-pessoas': IMAGES.servGestaoPessoas,
  'planejamento-empresarial-para-empresas-da-beleza': IMAGES.servPlanejamento,
  'plano-odontologico': IMAGES.servPlanoOdonto,
  'regularizacao-e-certificacao-profissional': IMAGES.servRegularizacao,
  'acesso-de-credito': IMAGES.servCredito,
}

const blogImages: Record<string, string> = {
  'assessoria-juridica-para-salao-de-beleza-como-esco': IMAGES.blog1,
  'cursos-area-da-beleza-quais-sinais-de-que-sua-equi': IMAGES.blog2,
  'assessoria-contabil-salao-de-beleza-quanto-custa-e': IMAGES.blog3,
  'o-que-e-o-sindicato-da-area-da-beleza-e-por-que-do': IMAGES.blog4,
  'qualificacao-beleza-e-estetica-vale-a-pena-o-que-a': IMAGES.blog5,
  'beneficios-para-associados-sindibes-passo-a-passo-': IMAGES.blog6,
}

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return [
    ...SERVICES.map((s) => ({ slug: s.slug })),
    ...BLOG_ARTICLES.map((a) => ({ slug: a.slug })),
  ]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = SERVICES.find((s) => s.slug === slug)
  if (service) {
    return {
      title: `${service.nome} | ${SITE.name}`,
      description: `${service.nome} em Uberlândia. Conheça os serviços do Sindbes para profissionais e empresas da beleza.`,
      alternates: { canonical: `/${slug}` },
    }
  }

  const article = BLOG_ARTICLES.find((a) => a.slug === slug)
  if (article) {
    return {
      title: `${article.titulo} | ${SITE.name}`,
      description: `${article.titulo}. Artigo do blog do Sindbes sobre o setor da beleza em Uberlândia.`,
      alternates: { canonical: `/${slug}` },
    }
  }

  return { title: SITE.name }
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params

  const service = SERVICES.find((s) => s.slug === slug)
  if (service) {
    return <ServicePage service={service} image={serviceImages[slug] || IMAGES.vitrine1} />
  }

  const article = BLOG_ARTICLES.find((a) => a.slug === slug)
  if (article) {
    return <ArticlePage article={article} image={blogImages[slug] || IMAGES.blog1} />
  }

  notFound()
}
