import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  MapPinned, MapPin, Scissors, Sparkles, Hand, Footprints, Eye, Brush, Waves, HeartHandshake,
  Flower2, PenTool, Droplets, Gem, Store, Building2, User, Briefcase, HeartPulse, Scale,
  GraduationCap, CreditCard, ShieldCheck, ScrollText, Megaphone, ArrowRight, MessageCircle,
  ChevronDown, BadgeCheck, Check, type LucideIcon,
} from 'lucide-react'

const AMBIENTES = [
  { src: '/images/ambiente-barbearia.jpg', alt: 'Barbearia associada ao sindicato da beleza' },
  { src: '/images/ambiente-esmalteria.jpg', alt: 'Esmalteria e salão de manicure' },
  { src: '/images/ambiente-estetica.jpg', alt: 'Clínica de estética' },
  { src: '/images/ambiente-maquiagem.jpg', alt: 'Estúdio de maquiagem' },
]

const CAMINHO = '/institucional/abrangencia'
const BASE = 'https://sindibes.com.br'

const CIDADES = [
  'Uberlândia', 'Abadia dos Dourados', 'Araguari', 'Araporã', 'Cascalho Rico', 'Centralina',
  'Coromandel', 'Douradoquara', 'Estrela do Sul', 'Grupiara', 'Indianópolis', 'Iraí de Minas',
  'Monte Alegre de Minas', 'Monte Carmelo', 'Prata', 'Tupaciguara',
]

// Fotos de fundo como CSS: extensões e scripts que mexem em <img> não conseguem cobri-las sobre o texto
const fundo = (src: string) => `url(${src})`

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

      {/* Abertura com foto de fundo */}
      <section className="relative isolate overflow-hidden text-white">
        <div role="img" aria-label="Salão de beleza em Uberlândia" className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: fundo('/images/sobre.jpg') }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-dark/95 via-primary/85 to-secondary/90" />
        <div className="absolute -z-10 -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -z-10 -bottom-32 -left-20 w-96 h-96 rounded-full bg-secondary/40 blur-3xl" />

        <div className="relative z-10 max-w-[1100px] mx-auto px-4 pt-16 pb-24 md:pt-20 md:pb-28 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full">
            <MapPinned className="w-4 h-4" /> Base territorial
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mt-5 leading-tight max-w-4xl mx-auto">
            Sindicato da Beleza em Uberlândia <span className="text-accent">e mais 15 cidades</span> de Minas Gerais
          </h1>
          <p className="text-white/85 mt-5 max-w-2xl mx-auto md:text-lg leading-relaxed">
            O Sindibes representa salões, barbearias, clínicas de estética, estúdios e profissionais autônomos da beleza
            em 16 municípios do Triângulo Mineiro e Alto Paranaíba. Veja se a sua cidade e o seu negócio fazem parte
            e conheça os benefícios de ser associado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/faca-parte/associado" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:bg-accent transition">
              Quero me associar <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={whatsapp()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition">
              <MessageCircle className="w-4 h-4" /> Tirar dúvidas no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Números sobrepostos à abertura */}
      <div className="relative z-10 max-w-[900px] mx-auto px-4 -mt-14">
        <div className="grid grid-cols-3 bg-white rounded-2xl shadow-xl border border-gray-100 divide-x divide-gray-100">
          {[
            { n: '16', t: 'cidades atendidas', icon: MapPin },
            { n: '13', t: 'segmentos da beleza', icon: Sparkles },
            { n: '8', t: 'benefícios para associados', icon: BadgeCheck },
          ].map(({ n, t, icon: Icon }) => (
            <div key={t} className="py-5 md:py-6 px-2 text-center">
              <Icon className="w-5 h-5 text-secondary mx-auto mb-1.5" />
              <p className="text-2xl md:text-4xl font-bold text-primary leading-none">{n}</p>
              <p className="text-[11px] md:text-sm text-gray-500 mt-1.5 leading-tight">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefícios */}
      <section className="max-w-[1100px] mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Por que se associar</span>
          <h2 className="text-2xl md:text-4xl font-bold mt-2 bicolor-title">
            Benefícios para quem trabalha <span>com beleza</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Valem para associados de todas as cidades da nossa base. Negociados em grupo, saem mais baratos do que contratar sozinho.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFICIOS.map(({ titulo, texto, icon: Icon }, i) => (
            <div
              key={titulo}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${i % 2 ? 'bg-secondary' : 'bg-primary'} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300`} />
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${i % 2 ? 'bg-secondary/10 group-hover:bg-secondary' : 'bg-primary/10 group-hover:bg-primary'}`}>
                <Icon className={`w-6 h-6 transition-colors group-hover:text-white ${i % 2 ? 'text-secondary' : 'text-primary'}`} />
              </div>
              <h3 className="font-bold text-text leading-snug">{titulo}</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cidades */}
      <section id="cidades" className="relative bg-gradient-to-b from-accent/60 to-bg-alt py-16 px-4 scroll-mt-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Abrangência</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-2 bicolor-title">
              Cidades atendidas pelo <span>Sindibes</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Tem um salão, barbearia, clínica ou estúdio em uma destas cidades? Você faz parte da categoria representada
              pelo Sindibes e pode aproveitar todos os benefícios de associado.
            </p>
          </div>

          {/* Sede em destaque */}
          <article id={ancora(CIDADES[0])} className="scroll-mt-28 grid md:grid-cols-2 bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
            <div className="relative h-56 md:h-auto min-h-[240px]">
              <Image src="/images/ambiente-cabeleireiro.jpg" alt="Salão de cabeleireiro em Uberlândia" fill className="object-cover" sizes="(min-width: 768px) 550px, 100vw" />
              <span className="absolute z-10 top-4 left-4 inline-flex items-center gap-1.5 bg-white/95 text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow">
                <BadgeCheck className="w-3.5 h-3.5" /> Sede do Sindibes
              </span>
            </div>
            <div className="p-7 md:p-9 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-text">
                  {CIDADES[0]}<span className="text-gray-400 font-medium">/MG</span>
                </h3>
              </div>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Salões, barbearias, clínicas de estética e profissionais autônomos de Uberlândia contam com atendimento
                presencial na sede, assessoria e todos os benefícios de associado.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {['Atendimento presencial na sede', 'Piso salarial próprio na convenção coletiva', 'Eventos e treinamentos na cidade'].map(t => (
                  <li key={t} className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> {t}</li>
                ))}
              </ul>
              <a href={whatsapp(CIDADES[0])} target="_blank" rel="noopener noreferrer" className="self-start inline-flex items-center gap-2 gradient-primary text-white text-sm font-semibold px-5 py-3 rounded-xl mt-6 hover:opacity-90 transition">
                <MessageCircle className="w-4 h-4" /> Falar sobre {CIDADES[0]}
              </a>
            </div>
          </article>

          {/* Demais cidades */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CIDADES.slice(1).map(cidade => (
              <article
                key={cidade}
                id={ancora(cidade)}
                className="group scroll-mt-28 bg-white rounded-2xl border border-white shadow-sm hover:shadow-lg hover:border-primary/30 transition-all p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center shrink-0 transition-colors">
                    <MapPin className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-text leading-tight">
                    {cidade}<span className="text-gray-400 font-medium">/MG</span>
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Sindicato da beleza em {cidade}: salões, barbearias, estética e autônomos da cidade têm os mesmos
                  benefícios e a convenção coletiva da categoria.
                </p>
                <a
                  href={whatsapp(cidade)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3 hover:gap-2 transition-all"
                >
                  Falar sobre {cidade} <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categoria econômica */}
      <section className="max-w-[1100px] mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Categoria econômica</span>
          <h2 className="text-2xl md:text-4xl font-bold mt-2 bicolor-title">
            Quem o Sindibes <span>representa</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Do salão com equipe ao profissional que atende sozinho: todos fazem parte da categoria econômica da beleza.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {PERFIS.map(({ nome, texto, icon: Icon }, i) => (
            <div key={nome} className={`rounded-2xl p-6 text-center text-white shadow-md ${i % 2 ? 'bg-gradient-to-br from-secondary to-secondary-dark' : 'bg-gradient-to-br from-primary to-primary-dark'}`}>
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm md:text-base leading-snug">{nome}</h3>
              <p className="text-xs text-white/80 mt-1.5 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>

        {/* Faixa de fotos dos ambientes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {AMBIENTES.map(a => (
            <div key={a.src} className="relative h-32 md:h-40 rounded-2xl overflow-hidden">
              <Image src={a.src} alt={a.alt} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(min-width: 768px) 270px, 50vw" />
            </div>
          ))}
        </div>

        <h3 className="text-center font-bold text-text text-xl mb-6">Segmentos da beleza e estética</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIAS.map(({ nome, icon: Icon }, i) => (
            <li key={nome} className="group flex items-center gap-3 bg-bg-alt hover:bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md px-4 py-3.5 transition-all">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white group-hover:shadow-sm ${i % 2 ? 'text-secondary' : 'text-primary'}`}>
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-sm font-medium text-text leading-snug">{nome}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Perguntas frequentes */}
      <section className="bg-bg-alt py-16 px-4">
        <div className="max-w-[820px] mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Tire suas dúvidas</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-2 bicolor-title">
              Perguntas <span>frequentes</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map(f => (
              <details key={f.p} className="group bg-white rounded-2xl border border-gray-100 shadow-sm open:shadow-md open:border-primary/30 transition">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-semibold text-text">
                  {f.p}
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <ChevronDown className="w-4 h-4 text-primary transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">{f.r}</p>
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
        </div>
      </section>

      {/* Chamada final com foto */}
      <section className="px-4 py-16">
        <div className="relative isolate max-w-[1100px] mx-auto rounded-3xl overflow-hidden text-white text-center">
          <div role="img" aria-label="Espaço de estética e bem-estar" className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: fundo('/images/ambiente-spa.jpg') }} />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/95 to-primary/90" />
          <div className="relative z-10 px-6 py-14 md:py-16">
            <h2 className="text-2xl md:text-4xl font-bold max-w-2xl mx-auto">Seu negócio da beleza merece estar bem representado</h2>
            <p className="text-white/85 mt-3 max-w-xl mx-auto">
              Associe-se ao Sindibes e tenha plano de saúde, assessoria, treinamentos e divulgação, onde quer que você esteja na nossa região.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
              <Link href="/faca-parte/associado" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:bg-accent transition">
                Fazer meu cadastro <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={whatsapp()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition">
                <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
