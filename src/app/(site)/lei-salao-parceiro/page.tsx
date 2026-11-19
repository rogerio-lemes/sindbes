/**
 * Página "Lei Salão-Parceiro" (Lei 13.352/2016).
 *
 * Conteúdo baseado no e-book "Perigo Oculto" do Sindibes (consultor Wagner
 * Luís Freitas). Estrutura pensada para SEO semântico e conversão:
 * dor → entendimento da lei → objeção dos parentes → riscos → solução
 * (contrato homologado + nota fiscal) → passo a passo → perguntas → contato.
 *
 * Dados estruturados: Article, FAQPage, HowTo e BreadcrumbList.
 *
 * As imagens ficam em /public/images/lei-salao-parceiro/ (geradas no ChatGPT).
 */
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  AlertTriangle, ShieldCheck, Scale, Users, FileSignature, Receipt, Gavel,
  Landmark, BadgeAlert, Store, MessageCircle, CheckCircle2, XCircle, ChevronDown,
  HandCoins, UserX, FileWarning, ClipboardList, Search, BadgeCheck, FolderCheck,
  Phone, ArrowRight, HeartHandshake,
} from 'lucide-react'

const URL_PAGINA = 'https://sindibes.com.br/lei-salao-parceiro'
const WAGNER_WHATS = '5534984274161'
const WAGNER_DISPLAY = '(34) 98427-4161'
const MSG_WHATS = 'Olá, Wagner! Vi a página da Lei Salão-Parceiro no site do Sindibes e quero regularizar meu salão.'
const LINK_WHATS = `https://wa.me/${WAGNER_WHATS}?text=${encodeURIComponent(MSG_WHATS)}`

/** Imagens da página (1 por seção visual). */
const IMG = {
  hero: '/images/lei-salao-parceiro/hero.jpg',
  dor: '/images/lei-salao-parceiro/dor.jpg',
  parentes: '/images/lei-salao-parceiro/parentes.jpg',
  contrato: '/images/lei-salao-parceiro/contrato.jpg',
  notaFiscal: '/images/lei-salao-parceiro/nota-fiscal.jpg',
  protegido: '/images/lei-salao-parceiro/protegido.jpg',
}

export const metadata: Metadata = {
  title: 'Lei Salão-Parceiro (Lei 13.352/2016) em Uberlândia',
  description:
    'Entenda a Lei Salão-Parceiro, os riscos de ação trabalhista e multa para salões sem contrato homologado e como regularizar com o Sindibes em Uberlândia, inclusive parentes.',
  alternates: { canonical: '/lei-salao-parceiro' },
  keywords: [
    'lei salão parceiro', 'lei 13.352/2016', 'contrato de parceria salão de beleza',
    'homologação contrato salão parceiro', 'profissional parceiro MEI', 'salão parceiro Uberlândia',
  ],
  openGraph: {
    title: 'Lei Salão-Parceiro: o perigo oculto do seu salão',
    description: 'Ação trabalhista, multa e autuação fiscal: saiba como proteger seu salão com o contrato de parceria homologado pelo Sindibes.',
    url: URL_PAGINA,
    type: 'article',
    images: [{ url: IMG.hero, width: 1536, height: 1024, alt: 'Dono de salão de beleza preocupado com a Lei Salão-Parceiro' }],
  },
}

// ── Conteúdo ────────────────────────────────────────────────────────────────

const DORES = [
  { icone: HandCoins, titulo: 'Tudo no “acerto de boca”', texto: 'Os profissionais dividem os serviços com você há anos, mas nunca houve um contrato escrito.' },
  { icone: Users, titulo: 'Parente trabalhando no salão', texto: 'Filha, esposa, irmão ou cunhada atendem todos os dias, e você acha que a família protege.' },
  { icone: Receipt, titulo: 'Parceiro que não emite nota', texto: 'Ficou combinado que “não precisa de nota”. Na fiscalização, isso pesa contra o salão.' },
  { icone: FileWarning, titulo: 'Contrato sem homologação', texto: 'Existe um papel assinado, mas ele nunca passou pelo sindicato. Na Justiça, vale muito pouco.' },
  { icone: UserX, titulo: 'Medo de quem sai brigado', texto: 'Um profissional que sai insatisfeito pode pedir vínculo de emprego e cobrar anos de direitos.' },
  { icone: BadgeAlert, titulo: 'Insegurança com fiscal', texto: 'Uma visita do Ministério do Trabalho hoje viraria uma multa por profissional irregular.' },
]

const PERMITE = [
  'O profissional (cabeleireiro, manicure, esteticista, barbeiro) atua como parceiro, sem vínculo de emprego.',
  'O salão oferece estrutura, equipamentos e espaço em troca de um percentual dos serviços.',
  'Cada parte tem autonomia sobre sua atuação, dentro do que está no contrato.',
]

const EXIGE = [
  'Contrato de parceria escrito e homologado pelo sindicato da categoria.',
  'Profissional parceiro inscrito como MEI ou com outra forma jurídica.',
  'Emissão de nota fiscal pelos serviços prestados.',
  'Percentuais de cada parte definidos claramente no contrato.',
]

const PARENTES = [
  { quem: 'Esposa ou companheira', texto: 'Mesmo sendo meeira da empresa, se atende como profissional de beleza precisa de contrato homologado.' },
  { quem: 'Filha que faz unhas', texto: 'Se há rotina e remuneração, mesmo informal, existe risco trabalhista.' },
  { quem: 'Irmão barbeiro', texto: 'A relação de irmãos não afasta a obrigação legal.' },
  { quem: 'Cunhada que divide receitas', texto: 'Sem contrato, a divisão informal pode ser lida como salário disfarçado.' },
]

const RISCOS = [
  { icone: Gavel, titulo: 'Ação trabalhista', texto: 'O parceiro ou ex-parceiro pede vínculo de emprego. Se ganhar, o salão paga férias, 13º, FGTS com multa de 40%, horas extras, aviso prévio e verbas rescisórias. O valor pode superar anos de faturamento.' },
  { icone: Landmark, titulo: 'Autuação fiscal e previdenciária', texto: 'Sem nota fiscal e sem regularização, Receita Federal e INSS podem autuar o salão por contribuições não recolhidas, com juros retroativos de anos.' },
  { icone: Scale, titulo: 'Multa trabalhista', texto: 'Na fiscalização do Ministério do Trabalho, cada profissional sem contrato homologado pode gerar uma multa individual.' },
  { icone: AlertTriangle, titulo: 'Dano à reputação', texto: 'Processos trabalhistas são públicos. A imagem do salão é afetada diante de clientes, fornecedores e profissionais.' },
  { icone: Store, titulo: 'Perda do negócio', texto: 'Somados, passivos trabalhistas e fiscais podem fechar a empresa e chegar à penhora de bens do dono.' },
]

const CLAUSULAS = [
  'Qualificação completa do salão e do profissional parceiro',
  'Descrição dos serviços que o parceiro vai prestar',
  'Percentual de cada parte sobre os serviços',
  'Forma de pagamento e periodicidade',
  'Responsabilidade sobre insumos e materiais',
  'Prazo de vigência do contrato',
  'Cláusulas de rescisão e prazo de aviso',
  'Obrigação do parceiro de emitir nota fiscal',
]

const RESPONSABILIDADES: { item: string; salao: string; parceiro: string }[] = [
  { item: 'Espaço físico e equipamentos', salao: 'sim', parceiro: '' },
  { item: 'Produtos e insumos', salao: 'Negociável', parceiro: 'Negociável' },
  { item: 'Captação de clientes', salao: 'Compartilhada', parceiro: 'Compartilhada' },
  { item: 'Emissão de nota fiscal', salao: '', parceiro: 'sim' },
  { item: 'Contribuição previdenciária', salao: '', parceiro: 'sim (MEI)' },
  { item: 'Gestão do negócio', salao: 'sim', parceiro: '' },
]

const NOTA_MOTIVOS = [
  { titulo: 'Segurança jurídica', texto: 'A nota comprova a parceria e afasta a presunção de vínculo de emprego.' },
  { titulo: 'Conformidade fiscal', texto: 'Sem nota, salão e parceiro podem ser autuados pela Receita Municipal e Federal.' },
  { titulo: 'Prova documental', texto: 'Numa ação trabalhista, as notas emitidas são a prova mais forte da parceria.' },
  { titulo: 'Transparência contábil', texto: 'Facilita o controle de receitas dos dois lados.' },
]

const PASSOS = [
  { icone: ClipboardList, titulo: 'Mapeie todos os profissionais', texto: 'Liste quem trabalha no salão com regularidade: empregados, parceiros e parentes.' },
  { icone: Search, titulo: 'Defina o modelo de cada um', texto: 'Decida quem é empregado com carteira e quem atua como parceiro. O modelo errado gera risco dos dois lados.' },
  { icone: BadgeCheck, titulo: 'Confira o MEI do parceiro', texto: 'O parceiro precisa de CNPJ ativo como MEI. Se não tiver, esse é o primeiro passo.' },
  { icone: FileSignature, titulo: 'Elabore o contrato de parceria', texto: 'Com cláusulas claras, cobrindo tudo o que a Lei 13.352/2016 exige.' },
  { icone: ShieldCheck, titulo: 'Homologue no Sindibes', texto: 'A homologação dá validade jurídica plena ao contrato.' },
  { icone: Receipt, titulo: 'Implante a emissão de notas', texto: 'Oriente os parceiros sobre a NFS-e e crie uma rotina mensal ou por serviço.' },
  { icone: FolderCheck, titulo: 'Guarde a documentação', texto: 'Contratos, notas e comprovantes organizados são o seu escudo na fiscalização ou na Justiça.' },
]

const FAQ = [
  { p: 'O que é a Lei Salão-Parceiro?', r: 'É a Lei Federal nº 13.352/2016, que permite que cabeleireiros, barbeiros, manicures, esteticistas e outros profissionais da beleza trabalhem no salão como parceiros, sem vínculo de emprego, desde que exista contrato de parceria escrito, homologado pelo sindicato, e emissão de nota fiscal.' },
  { p: 'Minha filha trabalha comigo há anos. Preciso mesmo de contrato?', r: 'Sim. O tempo de trabalho sem contrato aumenta o risco: quanto mais tempo sem regularização, maior pode ser o passivo em uma ação trabalhista. Parentes não estão automaticamente protegidos.' },
  { p: 'Posso ter um parceiro que não seja MEI?', r: 'A lei prevê que o parceiro tenha inscrição como MEI ou outra forma de registro. Sem isso, a relação não se enquadra como parceria e o risco de reconhecimento de vínculo aumenta.' },
  { p: 'E se o parceiro não quiser emitir nota fiscal?', r: 'A nota fiscal é obrigação legal do parceiro, não uma escolha. Se ele se recusa, a relação não está configurada corretamente, e o risco fica com o dono do salão.' },
  { p: 'Posso fazer o contrato sem homologação?', r: 'Tecnicamente sim, mas o contrato sem homologação tem validade jurídica muito reduzida. É a homologação pelo sindicato que dá eficácia legal ao documento.' },
  { p: 'Quanto tempo leva para regularizar o salão?', r: 'Com o apoio do Sindibes, o processo pode ser concluído em poucos dias. O mais importante é começar: cada dia sem regularização é um dia de risco.' },
  { p: 'Se eu regularizar agora, fico protegido do passado?', r: 'A regularização não apaga obrigações passadas, mas demonstra boa-fé e interrompe o acúmulo de passivo. Em muitos casos, ajuda o empresário em negociações ou acordos.' },
  { p: 'O que acontece se o fiscal do trabalho visitar meu salão?', r: 'Com contratos homologados, notas em dia e documentos organizados, a fiscalização tende a ser tranquila. Sem eles, cada profissional irregular pode gerar uma autuação e uma multa individual.' },
  { p: 'Qual é o percentual de divisão entre salão e parceiro?', r: 'A lei não fixa percentuais. A divisão é combinada entre as partes e precisa constar no contrato. No mercado, o mais comum fica entre 40/60 e 50/50.' },
]

// ── Dados estruturados ──────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Lei Salão-Parceiro (Lei 13.352/2016): o perigo oculto do seu salão',
      description: metadata.description,
      image: `https://sindibes.com.br${IMG.hero}`,
      inLanguage: 'pt-BR',
      mainEntityOfPage: URL_PAGINA,
      author: { '@type': 'Person', name: 'Wagner Luís Freitas', jobTitle: 'Consultor do Sindibes' },
      publisher: { '@type': 'Organization', name: 'Sindibes - Sindicato da Beleza', url: 'https://sindibes.com.br' },
      about: { '@type': 'Legislation', name: 'Lei nº 13.352, de 27 de outubro de 2016', legislationIdentifier: 'Lei 13.352/2016' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
    },
    {
      '@type': 'HowTo',
      name: 'Como regularizar o salão de beleza na Lei Salão-Parceiro',
      step: PASSOS.map((p, i) => ({ '@type': 'HowToStep', position: i + 1, name: p.titulo, text: p.texto })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://sindibes.com.br' },
        { '@type': 'ListItem', position: 2, name: 'Lei Salão-Parceiro', item: URL_PAGINA },
      ],
    },
  ],
}

// ── Peças visuais ───────────────────────────────────────────────────────────

function Selo({ children, claro = false }: { children: React.ReactNode; claro?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${claro ? 'text-accent' : 'text-secondary'}`}>
      {children}
    </span>
  )
}

function BotaoWhats({ texto = 'Falar com o Wagner no WhatsApp', claro = false }: { texto?: string; claro?: boolean }) {
  return (
    <a
      href={LINK_WHATS}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold transition shadow-lg ${
        claro ? 'bg-white text-primary hover:bg-accent' : 'gradient-primary text-white hover:opacity-90'
      }`}
    >
      <MessageCircle className="w-5 h-5" /> {texto}
    </a>
  )
}

function Foto({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${className}`}>
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
    </div>
  )
}

// ── Página ──────────────────────────────────────────────────────────────────

export default function LeiSalaoParceiroPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Lei Salão-Parceiro' }]} />

      {/* 1. Abertura: a dor */}
      <section className="relative overflow-hidden bg-text text-white">
        <Image src={IMG.hero} alt="Dono de salão de beleza olhando com preocupação para documentos no balcão" fill priority sizes="100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-text via-text/80 to-text/20" />
        <div className="relative max-w-[1200px] mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <Selo claro><AlertTriangle className="w-4 h-4" /> Lei Federal nº 13.352/2016</Selo>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mt-4">
              Lei Salão-Parceiro: o <span className="text-accent">perigo oculto</span> que pode custar o seu salão
            </h1>
            <p className="text-lg text-white/80 mt-6 leading-relaxed">
              Muitos donos de salão, barbearia e clínica de estética passam anos construindo um negócio bonito e lucrativo
              sem saber que estão sentados sobre um <strong className="text-white">passivo trabalhista</strong>. Um profissional
              sem contrato homologado, inclusive um parente, pode transformar anos de trabalho em uma ação na Justiça.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <BotaoWhats texto="Quero regularizar meu salão" />
              <a href="#riscos" className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold border border-white/30 hover:bg-white/10 transition">
                Ver os riscos <ChevronDown className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-white/60 mt-5">Orientação do Sindibes para salões de Uberlândia e região.</p>
          </div>
        </div>
      </section>

      {/* 2. Identificação com a dor */}
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Selo><Search className="w-4 h-4" /> Diagnóstico rápido</Selo>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 bicolor-title">
              Você se reconhece em <span>alguma dessas situações?</span>
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              O maior risco do seu salão não é a concorrência nem a crise. É a estrutura de trabalho que você montou,
              muitas vezes sem perceber. Se marcou pelo menos uma situação abaixo, o seu salão está exposto.
            </p>
            <Foto src={IMG.dor} alt="Profissionais atendendo em salão de beleza sem contrato de parceria" className="aspect-[4/3] mt-8 hidden lg:block" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {DORES.map((d) => (
              <div key={d.titulo} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-red-100 transition">
                <span className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                  <d.icone className="w-5 h-5 text-red-500" />
                </span>
                <h3 className="font-bold text-text mt-4">{d.titulo}</h3>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{d.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. O que é a lei */}
      <section className="bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <Selo><Scale className="w-4 h-4" /> Entenda a lei</Selo>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 bicolor-title">
              O que é a <span>Lei Salão-Parceiro?</span>
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              A Lei 13.352/2016 regulamentou uma realidade antiga: profissionais que trabalham dentro do salão não como
              empregados, mas como <strong>parceiros</strong>, com clientela, produtos e agenda próprios. Antes dela, qualquer
              profissional podia ser enquadrado como empregado. A lei criou uma alternativa segura, desde que as regras sejam seguidas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-3 text-lg font-bold text-text">
                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-primary" /></span>
                O que a lei permite
              </h3>
              <ul className="mt-5 space-y-3">
                {PERMITE.map((t) => (
                  <li key={t} className="flex gap-3 text-gray-600 leading-relaxed"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-3 text-lg font-bold text-text">
                <span className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-secondary" /></span>
                O que a lei exige
              </h3>
              <ul className="mt-5 space-y-3">
                {EXIGE.map((t) => (
                  <li key={t} className="flex gap-3 text-gray-600 leading-relaxed"><BadgeCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-5 mt-8">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-900 leading-relaxed">
              <strong>A Lei Salão-Parceiro não é opcional.</strong> Se um profissional trabalha no seu salão com regularidade
              e não existe contrato homologado, o risco de reconhecimento de vínculo de emprego é real e imediato.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Parentes */}
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Foto src={IMG.parentes} alt="Mãe e filha trabalhando juntas no salão de beleza da família" className="aspect-[4/3] order-last lg:order-first" />
          <div>
            <Selo><Users className="w-4 h-4" /> O maior equívoco dos salões</Selo>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 bicolor-title">
              “É da família, não precisa de contrato.” <span>Precisa sim.</span>
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              A Justiça do Trabalho não olha o grau de parentesco. Ela olha os fatos: <strong>rotina, subordinação,
              pessoalidade e pagamento</strong>. Se houver uma briga pessoal ou profissional, o parente pode pedir vínculo
              de emprego, e a prova costuma ficar nas mãos do dono do salão. Sem contrato homologado e notas fiscais, a
              chance de perder é altíssima.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-7">
              {PARENTES.map((p) => (
                <div key={p.quem} className="rounded-2xl bg-bg-alt p-4">
                  <p className="flex items-center gap-2 font-semibold text-text"><HeartHandshake className="w-4 h-4 text-secondary" />{p.quem}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{p.texto}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 font-semibold text-text">
              A regra é simples: trabalhou com regularidade e recebeu por isso, parente ou não, precisa de contrato de parceria homologado.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Riscos */}
      <section id="riscos" className="bg-text text-white scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <Selo claro><AlertTriangle className="w-4 h-4" /> O que está em jogo</Selo>
            <h2 className="text-2xl md:text-4xl font-bold mt-3">
              Os 5 perigos de não estar <span className="text-accent">regularizado</span>
            </h2>
            <p className="text-white/70 mt-4 leading-relaxed">
              Não regularizar é como construir um prédio sem fundação: por anos parece tudo bem, até o dia em que desmorona.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {RISCOS.map((r, i) => (
              <div key={r.titulo} className="relative rounded-3xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition">
                <span className="absolute top-5 right-6 text-5xl font-bold text-white/10">{i + 1}</span>
                <span className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center">
                  <r.icone className="w-6 h-6 text-red-400" />
                </span>
                <h3 className="text-lg font-bold mt-4">{r.titulo}</h3>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">{r.texto}</p>
              </div>
            ))}
            <div className="rounded-3xl gradient-primary p-6 flex flex-col justify-between">
              <div>
                <ShieldCheck className="w-10 h-10 text-white" />
                <p className="text-lg font-bold mt-4">Prevenir custa muito menos</p>
                <p className="text-sm text-white/85 mt-2 leading-relaxed">
                  Não espere a notificação judicial ou a visita do fiscal. Regularizar antes é infinitamente mais barato do que qualquer processo ou multa.
                </p>
              </div>
              <a href={LINK_WHATS} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-5 font-semibold text-white hover:underline">
                Falar com o Sindibes <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contrato homologado */}
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <Selo><FileSignature className="w-4 h-4" /> A solução</Selo>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 bicolor-title">
              Como funciona o <span>contrato de parceria homologado</span>
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              O contrato é o centro da Lei Salão-Parceiro. A <strong>homologação</strong> é o reconhecimento formal desse
              contrato pelo sindicato da categoria. Em Uberlândia e região, quem homologa é o <strong>Sindibes</strong>.
              É ela que transforma um “acordo informal” em um documento com validade jurídica. Sem homologação, o vínculo de
              emprego pode ser reconhecido mesmo com o contrato em mãos.
            </p>
            <h3 className="font-bold text-text mt-8 mb-4">O que precisa constar no contrato</h3>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {CLAUSULAS.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <Foto src={IMG.contrato} alt="Dono de salão e profissional parceira assinando contrato de parceria homologado" className="aspect-[4/3]" />
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <p className="px-5 py-4 font-bold text-text border-b border-gray-100">Quem é responsável pelo quê</p>
              <table className="w-full text-sm">
                <thead className="bg-bg-alt text-left text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Responsabilidade</th>
                    <th className="px-3 py-3 font-semibold text-center">Salão</th>
                    <th className="px-3 py-3 font-semibold text-center">Parceiro</th>
                  </tr>
                </thead>
                <tbody>
                  {RESPONSABILIDADES.map((r) => (
                    <tr key={r.item} className="border-t border-gray-100">
                      <td className="px-5 py-3 text-gray-700">{r.item}</td>
                      {[r.salao, r.parceiro].map((v, i) => (
                        <td key={i} className="px-3 py-3 text-center">
                          {v === 'sim' ? <CheckCircle2 className="w-5 h-5 text-primary inline" />
                            : v.startsWith('sim') ? <span className="inline-flex items-center gap-1 text-primary font-medium"><CheckCircle2 className="w-4 h-4" />MEI</span>
                            : v ? <span className="text-gray-600">{v}</span>
                            : <XCircle className="w-4 h-4 text-gray-300 inline" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-5 py-4 text-xs text-gray-500 border-t border-gray-100">
                A lei não fixa percentuais: a divisão é combinada e escrita no contrato. O mais comum no mercado fica entre 40/60 e 50/50.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Nota fiscal */}
      <section className="bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Selo><Receipt className="w-4 h-4" /> Obrigação real</Selo>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 bicolor-title">
              Nota fiscal: <span>não é favor, é lei</span>
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              O parceiro MEI emite nota fiscal de serviço para o salão pelo valor da parte dele. O salão emite nota para o
              cliente pelo valor total do serviço. Em Uberlândia, o serviço paga ISS e a nota é a <strong>NFS-e da Prefeitura
              de Uberlândia</strong>; o parceiro precisa se cadastrar no sistema do município onde atende.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-7">
              {NOTA_MOTIVOS.map((m) => (
                <div key={m.titulo} className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="font-bold text-text">{m.titulo}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{m.texto}</p>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4 mt-6">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 leading-relaxed">
                Combinar que “não precisa de nota” pode resultar em autuação fiscal para os dois lados. O Sindibes orienta o cadastro e a emissão.
              </p>
            </div>
          </div>
          <Foto src={IMG.notaFiscal} alt="Profissional de beleza emitindo nota fiscal de serviço pelo celular" className="aspect-[4/3]" />
        </div>
      </section>

      {/* 8. Passo a passo */}
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <Selo><ClipboardList className="w-4 h-4" /> Passo a passo</Selo>
          <h2 className="text-2xl md:text-4xl font-bold mt-3 bicolor-title">
            Como regularizar seu salão <span>em 7 passos</span>
          </h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Regularizar é mais simples do que parece. Com o apoio do Sindibes, o processo pode ser concluído em poucos dias.
          </p>
        </div>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <span className="absolute -top-3 left-6 w-8 h-8 rounded-full gradient-primary text-white text-sm font-bold flex items-center justify-center shadow">{i + 1}</span>
              <p.icone className="w-7 h-7 text-primary mt-2" />
              <h3 className="font-bold text-text mt-3">{p.titulo}</h3>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{p.texto}</p>
            </li>
          ))}
          <li className="rounded-3xl gradient-primary p-6 text-white flex flex-col justify-between">
            <p className="font-bold text-lg">O Sindibes faz junto com você</p>
            <p className="text-sm text-white/85 mt-2">Consultoria para todas as etapas, do mapeamento à homologação.</p>
            <a href={LINK_WHATS} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 font-semibold hover:underline">
              Agendar orientação <ArrowRight className="w-4 h-4" />
            </a>
          </li>
        </ol>
      </section>

      {/* 9. Perguntas frequentes */}
      <section className="bg-bg-alt">
        <div className="max-w-[860px] mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <Selo><MessageCircle className="w-4 h-4" /> Dúvidas dos empresários</Selo>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 bicolor-title">
              Perguntas frequentes sobre a <span>Lei Salão-Parceiro</span>
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {FAQ.map((f, i) => (
              <details key={f.p} className="group bg-white rounded-2xl border border-gray-100 shadow-sm" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-semibold text-text">
                  <h3 className="text-base">{f.p}</h3>
                  <ChevronDown className="w-5 h-5 text-primary shrink-0 transition group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-5 -mt-1 text-gray-600 leading-relaxed">{f.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Chamada final */}
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-[2rem] gradient-primary text-white">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="p-8 md:p-14">
              <Selo claro><ShieldCheck className="w-4 h-4" /> A proteção começa com uma decisão</Selo>
              <h2 className="text-2xl md:text-4xl font-bold mt-3 leading-tight">
                Regularize seu salão agora, antes que alguém decida por você.
              </h2>
              <p className="text-white/85 mt-4 leading-relaxed">
                Não espere a notificação da Justiça, a visita do fiscal ou o profissional que sai brigado. Fale com o
                Wagner, consultor do Sindibes, e saia com o caminho completo para o contrato homologado.
              </p>
              <div className="flex flex-col xl:flex-row gap-3 mt-8">
                <BotaoWhats claro texto="Chamar o Wagner no WhatsApp" />
                <a href={`tel:+${WAGNER_WHATS}`} className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold whitespace-nowrap border border-white/40 hover:bg-white/10 transition">
                  <Phone className="w-5 h-5" /> {WAGNER_DISPLAY}
                </a>
              </div>
              <p className="text-sm text-white/70 mt-5">
                Ainda não é associado? <Link href="/faca-parte/associado" className="underline font-semibold text-white">Seja associado do Sindibes</Link>.
              </p>
            </div>
            <div className="relative h-72 lg:h-full min-h-[22rem]">
              <Image src={IMG.protegido} alt="Dona de salão de beleza tranquila com o salão regularizado" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-8 text-center max-w-2xl mx-auto">
          Conteúdo educativo e informativo, baseado no e-book “Perigo Oculto” do Sindibes. Para orientação jurídica sobre o
          seu caso, consulte um advogado trabalhista de sua confiança ou o departamento jurídico do Sindibes.
        </p>
      </section>
    </>
  )
}
