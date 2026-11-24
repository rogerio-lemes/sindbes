import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BLOG_ARTICLES, IMAGES } from '@/lib/constants'
import { getTenant, getServicos, getServicoPorSlug } from '@/lib/tenant'
import ServicePage from '@/components/pages/ServicePage'
import ArticlePage from '@/components/pages/ArticlePage'
import { listarParceiros } from '@/lib/cadastros-publicos'

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

/**
 * Prévia do link (WhatsApp/Facebook) com arte própria por serviço.
 * A arte é gerada por material/gerar-og-*.js e tem chamada para o Wagner.
 */
const OG_SERVICOS: Record<string, { imagem: string; titulo: string; descricao: string; alt: string }> = {
  'plano-odontologico': {
    imagem: '/images/og/plano-odontologico.jpg',
    titulo: 'Plano Odontológico Sindibes: seu sorriso em dia, pagando menos',
    descricao: 'Consultas, limpeza, canal e dependentes com valores até 50% menores. Responda e cote seu plano com o Wagner.',
    alt: 'Plano Odontológico Sindibes até 50% mais barato. Responda e cote com o Wagner no WhatsApp',
  },
}

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { id: tenantId, config } = await getTenant()

  const servico = await getServicoPorSlug(tenantId, slug)
  if (servico) {
    const og = OG_SERVICOS[slug]
    return {
      title: servico.seo_title || `${servico.nome} | ${config.nome}`,
      description: servico.seo_description || `${servico.nome} - ${config.nome}`,
      alternates: { canonical: `/${slug}` },
      ...(og && {
        openGraph: {
          title: og.titulo,
          description: og.descricao,
          url: `https://sindibes.com.br/${slug}`,
          type: 'website',
          locale: 'pt_BR',
          images: [{ url: `https://sindibes.com.br${og.imagem}`, width: 1200, height: 630, alt: og.alt }],
        },
        twitter: {
          card: 'summary_large_image',
          title: og.titulo,
          images: [`https://sindibes.com.br${og.imagem}`],
        },
      }),
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
    // Banners de parceiro do artigo: fixos + aprovados no painel
    const parceiros = await listarParceiros()
    return <ArticlePage article={article} image={blogImages[slug] || IMAGES.blog1} parceiros={parceiros} />
  }

  notFound()
}
