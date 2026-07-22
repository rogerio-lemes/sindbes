import { Metadata } from 'next'
import Link from 'next/link'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Quote, User } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `Palavra do Presidente | ${config.nome}`,
    description: `Mensagem da presidência do ${config.nome} sobre o compromisso com os profissionais e empresas da beleza.`,
    alternates: { canonical: '/institucional/palavra-do-presidente' },
  }
}

export default function PalavraPresidentePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Institucional', href: '/institucional' }, { label: 'Palavra do Presidente' }]} />

      <section className="max-w-[900px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Institucional</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Palavra do <span>Presidente</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 items-start">
          {/* Foto do presidente (placeholder) */}
          <div className="mx-auto md:mx-0">
            <div className="w-48 h-48 rounded-2xl gradient-primary flex items-center justify-center shadow-lg overflow-hidden">
              {/* Substituir por <Image> com a foto real do presidente */}
              <User className="w-20 h-20 text-white/70" />
            </div>
            <div className="text-center md:text-left mt-4">
              <p className="font-bold text-text">[Nome do Presidente]</p>
              <p className="text-sm text-gray-500">Presidente · Gestão 2026–2028</p>
            </div>
          </div>

          {/* Mensagem */}
          <div>
            <Quote className="w-10 h-10 text-secondary/40 mb-4" />
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                É com grande satisfação que dou as boas-vindas a você que faz parte, ou deseja fazer parte, do <strong>Sindicato da Beleza</strong>. O setor da beleza é movido por talento, dedicação e amor pela profissão, e o nosso papel é garantir que cada profissional e cada empresa tenham o apoio que merecem para crescer.
              </p>
              <p>
                Ao longo de nossa trajetória, construímos uma entidade sólida, comprometida em representar a categoria com seriedade, oferecer qualificação de qualidade e criar benefícios reais que impactam positivamente o dia a dia de quem vive da beleza em Uberlândia.
              </p>
              <p>
                Acreditamos na força da união. Juntos, temos mais voz para negociar melhores condições, mais estrutura para nos qualificarmos e mais segurança para empreender. Este sindicato é seu, e a nossa gestão está de portas abertas para ouvir, apoiar e caminhar ao seu lado.
              </p>
              <p>
                Convido você a conhecer tudo o que o Sindbes tem a oferecer e a fazer parte dessa história de valorização da nossa categoria.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="font-bold text-primary text-lg" style={{ fontFamily: 'cursive' }}>[Nome do Presidente]</p>
              <p className="text-sm text-gray-500">Presidente do Sindicato da Beleza</p>
            </div>

            <Link
              href="/contato"
              className="inline-flex mt-8 px-8 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Fale com o sindicato
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-12 text-center">
          Substitua a foto e o nome do presidente pelos dados oficiais no painel administrativo.
        </p>
      </section>
    </>
  )
}
