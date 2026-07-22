import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BLOG_ARTICLES, IMAGES } from '@/lib/constants'
import { getTenant, getServicos, getServicoPorSlug } from '@/lib/tenant'
import ServicePage from '@/components/pages/ServicePage'
import ArticlePage from '@/components/pages/ArticlePage'

const fallbackServiceImages: Record<string, string> = {
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { id: tenantId, config } = await getTenant()

  const servico = await getServicoPorSlug(tenantId, slug)
  if (servico) {
    return {
      title: servico.seo_title || `${servico.nome} | ${config.nome}`,
      description: servico.seo_description || `${servico.nome} - ${config.nome}`,
      alternates: { canonical: `/${slug}` },
    }
  }

  const article = BLOG_ARTICLES.find((a) => a.slug === slug)
  if (article) {
    return {
      title: article.seoTitle,
      description: article.seoDescription,
      alternates: { canonical: `/${slug}` },
    }
  }

  return { title: config.nome }
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params
  const { id: tenantId } = await getTenant()

  const servico = await getServicoPorSlug(tenantId, slug)
  if (servico) {
    const image = servico.imagem_url || fallbackServiceImages[slug] || IMAGES.vitrine1
    return <ServicePage service={servico} image={image} />
  }

  const article = BLOG_ARTICLES.find((a) => a.slug === slug)
  if (article) {
    return <ArticlePage article={article} image={blogImages[slug] || IMAGES.blog1} />
  }

  notFound()
}
