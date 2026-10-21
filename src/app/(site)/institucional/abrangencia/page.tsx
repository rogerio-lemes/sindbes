import { Metadata } from 'next'
import Link from 'next/link'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  MapPinned, MapPin, Scissors, Sparkles, Hand, Footprints, Eye, Brush, Waves, HeartHandshake,
  Flower2, PenTool, Droplets, Gem, Store, Building2, User, Briefcase, HeartPulse, Scale,
  GraduationCap, CreditCard, ShieldCheck, ScrollText, Megaphone, ArrowRight, MessageCircle,
  ChevronDown, BadgeCheck, type LucideIcon,
} from 'lucide-react'

const CAMINHO = '/institucional/abrangencia'
const BASE = 'https://sindibes.com.br'

const CIDADES = [
  'Uberlândia', 'Abadia dos Dourados', 'Araguari', 'Araporã', 'Cascalho Rico', 'Centralina',
  'Coromandel', 'Douradoquara', 'Estrela do Sul', 'Grupiara', 'Indianópolis', 'Iraí de Minas',
  'Monte Alegre de Minas', 'Monte Carmelo', 'Prata', 'Tupaciguara',
]

const ancora = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')

const CATEGORIAS: { nome: string; icon: LucideIcon }[] = [
  { nome: 'Institutos de Beleza', icon: Sparkles },
  { nome: 'Salões de Cabeleireiros', icon: Scissors },
  { nome: 'Barbearias', icon: Scissors },
  { nome: 'Salões de Manicures e Pedicures (Esmalterias)', icon: Hand },
  { nome: 'Clínicas de Podologia', icon: Footprints },
  { nome: 'Estúdios de Design de Sobrancelhas', icon: Eye },
  { nome: 'Clínicas de Depilação', icon: Droplets },
  { nome: 'Estúdios de Maquiagem', icon: Brush },
  { nome: 'Casas de Massagem e Saunas', icon: Waves },
  { nome: 'Clínicas de Massoterapia', icon: HeartHandshake },
  { nome: 'Clínicas de Estética (Esteticistas)', icon: Flower2 },
  { nome: 'Estúdios de Micropigmentação', icon: PenTool },
  { nome: 'Estúdios de Tatuagem e Colocação de Piercing', icon: Gem },
]

const PERFIS: { nome: string; texto: string; icon: LucideIcon }[] = [
  { nome: 'Empresários', texto: 'Donos de salões, clínicas e estúdios com equipe.', icon: Building2 },
  { nome: 'Microempresários', texto: 'Negócios de pequeno porte, ME e EPP.', icon: Store },
  { nome: 'Microempreendedores Individuais', texto: 'Quem trabalha como MEI na área da beleza.', icon: Briefcase },
  { nome: 'Autônomos', texto: 'Profissionais que atendem por conta própria.', icon: User },
]

const BENEFICIOS: { titulo: string; texto: string; icon: LucideIcon }[] = [
  { titulo: 'Plano de saúde e odontológico', texto: 'Preços negociados em grupo para você, sua família e sua equipe.', icon: HeartPulse },
  { titulo: 'Assessoria jurídica e contábil', texto: 'Especialistas no setor da beleza para orientar contratos, parcerias e impostos.', icon: Scale },
  { titulo: 'Convenção coletiva negociada', texto: 'Pisos, regras e direitos definidos com segurança para empresas e empregados.', icon: ScrollText },
  { titulo: 'Treinamentos com certificado', texto: 'Qualificação em gestão, finanças, atendimento e técnicas para crescer.', icon: GraduationCap },
  { titulo: 'Acesso a crédito', texto: 'Linhas com condições especiais para investir no seu negócio.', icon: CreditCard },
  { titulo: 'Regularização e certificação', texto: 'Apoio para deixar o negócio em dia com as exigências legais.', icon: ShieldCheck },
  { titulo: 'Divulgação do seu negócio', texto: 'Página própria na vitrine de filiados do site, com fotos, mapa e WhatsApp.', icon: Megaphone },
  { titulo: 'Representação da categoria', texto: 'Uma entidade que defende os interesses da beleza junto ao poder público.', icon: BadgeCheck },
]

const FAQ = [
  {
    p: 'O Sindibes atende a minha cidade?',
    r: `O Sindibes representa a categoria da beleza em 16 municípios do Triângulo Mineiro e Alto Paranaíba: ${CIDADES.slice(0, -1).join(', ')} e ${CIDADES[CIDADES.length - 1]}, todos em Minas Gerais.`,
  },
  {
    p: 'Sou MEI ou autônomo. Posso me associar?',
    r: 'Sim. A categoria econômica representada inclui empresários, microempresários, microempreendedores individuais (MEI) e autônomos que atuam na área da beleza e estética.',
  },
  {
    p: 'Quais tipos de negócio fazem parte da categoria?',
    r: `Fazem parte: ${CATEGORIAS.map(c => c.nome).join(', ')}.`,
  },
  {
    p: 'A convenção coletiva vale para todas essas cidades?',
    r: 'Sim. A Convenção Coletiva de Trabalho 2026/2027 firmada entre SETH-TAP e Sindibes tem abrangência nos 16 municípios listados nesta página, com pisos salariais próprios para Uberlândia e para as demais cidades.',
  },
  {
    p: 'Como faço para me associar?',
    r: 'Preencha o cadastro de associado no site. Nossa equipe analisa e entra em contato pelo WhatsApp para finalizar a filiação e explicar como usar cada benefício.',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const descricao =
    'Sindicato da beleza em Uberlândia, Araguari, Monte Carmelo, Prata, Tupaciguara e mais 11 cidades de MG. Salões, barbearias, estética e autônomos.'
  return {
    title: { absolute: 'Sindicato da Beleza em Uberlândia e Região | Sindibes' },
    description: descricao,
    alternates: { canonical: CAMINHO },
    openGraph: {
      title: 'Sindicato da Beleza em Uberlândia e Região',
      description: descricao,
      url: CAMINHO,
      type: 'website',
    },
  }
}

export default async function AbrangenciaPage() {
  const { config } = await getTenant()
  const whatsapp = (cidade?: string) =>
    `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(
      cidade
        ? `Olá! Tenho um negócio da beleza em ${cidade}/MG e quero saber mais sobre os benefícios do Sindibes.`
        : 'Olá! Quero saber mais sobre os benefícios do Sindibes para o meu negócio.',
    )}`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.nome,
      url: BASE,
      ...(config.cnpj ? { taxID: config.cnpj } : {}),
      areaServed: CIDADES.map(c => ({
        '@type': 'City',
        name: c,
        containedInPlace: { '@type': 'State', name: 'Minas Gerais' },
      })),
      knowsAbout: CATEGORIAS.map(c => c.nome),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map(f => ({
        '@type': 'Question',
        name: f.p,
        acceptedAnswer: { '@type': 'Answer', text: f.r },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Institucional', item: `${BASE}/institucional` },
        { '@type': 'ListItem', position: 2, name: 'Cidades e Categorias', item: `${BASE}${CAMINHO}` },
      ],
    },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: 'Institucional', href: '/institucional' }, { label: 'Cidades e Categorias' }]} />

      {/* Abertura */}
      <section className="max-w-[1100px] mx-auto px-4 pt-14 pb-10 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
          <MapPinned className="w-4 h-4" /> Base territorial
        </span>
        <h1 className="text-3xl md:text-5xl font-bold mt-3 leading-tight bicolor-title">
          Sindicato da Beleza em Uberlândia <span>e mais 15 cidades</span> de Minas Gerais
        </h1>
        <p className="text-gray-500 mt-5 max-w-2xl mx-auto md:text-lg leading-relaxed">
          O Sindibes representa salões, barbearias, clínicas de estética, estúdios e profissionais autônomos da beleza
          em 16 municípios do Triângulo Mineiro e Alto Paranaíba. Veja se a sua cidade e o seu negócio fazem parte
          e conheça os benefícios de ser associado.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/faca-parte/associado" className="inline-flex items-center justify-center gap-2 gradient-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition">
            Quero me associar <ArrowRight className="w-4 h-4" />
          </Link>
          <a href={whatsapp()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-text font-semibold px-7 py-3.5 rounded-xl hover:border-primary hover:text-primary transition">
            <MessageCircle className="w-4 h-4" /> Tirar dúvidas no WhatsApp
          </a>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mt-10">
          {[
            { n: '16', t: 'cidades atendidas' },
            { n: '13', t: 'segmentos da beleza' },
            { n: '8', t: 'benefícios para associados' },
          ].map(x => (
            <div key={x.t} className="bg-bg-alt rounded-2xl py-4 px-2">
              <p className="text-2xl md:text-3xl font-bold text-primary">{x.n}</p>
              <p className="text-[11px] md:text-xs text-gray-500 mt-1 leading-tight">{x.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-bg-alt py-16 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Por que se associar</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2 bicolor-title">
              Benefícios para quem trabalha <span>com beleza</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Valem para associados de todas as cidades da nossa base. Negociados em grupo, saem mais baratos do que contratar sozinho.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFICIOS.map(({ titulo, texto, icon: Icon }, i) => (
              <div key={titulo} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${i % 2 ? 'bg-secondary/10' : 'bg-primary/10'}`}>
                  <Icon className={`w-5 h-5 ${i % 2 ? 'text-secondary' : 'text-primary'}`} />
                </div>
                <h3 className="font-bold text-text leading-snug">{titulo}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cidades */}
      <section className="max-w-[1100px] mx-auto px-4 py-16" id="cidades">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Abrangência</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 bicolor-title">
            Cidades atendidas pelo <span>Sindibes</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Tem um salão, barbearia, clínica ou estúdio em uma destas cidades? Você faz parte da categoria representada
            pelo Sindibes e pode aproveitar todos os benefícios de associado.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CIDADES.map((cidade, i) => (
            <article
              key={cidade}
              id={ancora(cidade)}
              className={`scroll-mt-28 rounded-2xl border p-5 flex flex-col ${i === 0 ? 'border-secondary ring-2 ring-secondary/15 bg-white sm:col-span-2 lg:col-span-2' : 'border-gray-100 bg-white shadow-sm'}`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${i === 0 ? 'gradient-primary' : 'bg-primary/10'}`}>
                  <MapPin className={`w-4 h-4 ${i === 0 ? 'text-white' : 'text-primary'}`} />
                </div>
                <h3 className="font-bold text-text leading-tight">
                  {cidade}<span className="text-gray-400 font-medium">/MG</span>
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed flex-1">
                {i === 0
                  ? 'Sede do Sindibes. Salões, barbearias, clínicas de estética e profissionais autônomos de Uberlândia contam com atendimento presencial, assessoria e todos os benefícios de associado.'
                  : `Sindicato da beleza em ${cidade}: salões, barbearias, estética e autônomos da cidade têm acesso aos mesmos benefícios e à convenção coletiva da categoria.`}
              </p>
              <a
                href={whatsapp(cidade)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-4 hover:gap-2 transition-all"
              >
                Falar sobre {cidade} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Categoria econômica */}
      <section className="bg-bg-alt py-16 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Categoria econômica</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2 bicolor-title">
              Quem o Sindibes <span>representa</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Do salão com equipe ao profissional que atende sozinho: todos fazem parte da categoria econômica da beleza.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {PERFIS.map(({ nome, texto, icon: Icon }) => (
              <div key={nome} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-text text-sm md:text-base leading-snug">{nome}</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>

          <h3 className="text-center font-bold text-text text-lg mb-5">Segmentos da beleza e estética</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CATEGORIAS.map(({ nome, icon: Icon }, i) => (
              <li key={nome} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${i % 2 ? 'bg-secondary/10' : 'bg-primary/10'}`}>
                  <Icon className={`w-4 h-4 ${i % 2 ? 'text-secondary' : 'text-primary'}`} />
                </span>
                <span className="text-sm font-medium text-text leading-snug">{nome}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Perguntas frequentes */}
      <section className="max-w-[820px] mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bicolor-title">
          Perguntas <span>frequentes</span>
        </h2>
        <div className="space-y-3">
          {FAQ.map(f => (
            <details key={f.p} className="group bg-white rounded-2xl border border-gray-100 shadow-sm">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-semibold text-text">
                {f.p}
                <ChevronDown className="w-5 h-5 text-primary shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{f.r}</p>
            </details>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Veja também a{' '}
          <Link href="/institucional/convencoes" className="text-primary font-semibold hover:underline">
            Convenção Coletiva de Trabalho 2026/2027
          </Link>
          .
        </p>
      </section>

      {/* Chamada final */}
      <section className="px-4 pb-20">
        <div className="max-w-[1100px] mx-auto gradient-primary rounded-3xl text-white text-center px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-bold">Seu negócio da beleza merece estar bem representado</h2>
          <p className="text-white/85 mt-3 max-w-xl mx-auto">
            Associe-se ao Sindibes e tenha plano de saúde, assessoria, treinamentos e divulgação, onde quer que você esteja na nossa região.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
            <Link href="/faca-parte/associado" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-7 py-3.5 rounded-xl hover:bg-white/90 transition">
              Fazer meu cadastro <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={whatsapp()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition">
              <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
