import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import FormAssociado from '@/components/parceiros/FormAssociado'
import { SITE } from '@/lib/constants'
import { UserCheck, HeartPulse, Scale, GraduationCap, CreditCard, ShieldCheck, BadgeCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Seja Associado | Sindibes - Sindicato da Beleza',
  description: 'Associe-se ao Sindibes e tenha acesso a planos de saúde, assessoria jurídica, treinamentos e benefícios exclusivos para o setor da beleza de Uberlândia.',
  alternates: { canonical: '/faca-parte/associado' },
}

const DIFERENCIAIS = [
  { icon: HeartPulse,   titulo: 'Plano de saúde',        texto: 'Planos de saúde e odontológico com preços negociados coletivamente.' },
  { icon: Scale,        titulo: 'Assessoria jurídica',   texto: 'Advogados e contadores especializados no setor da beleza.' },
  { icon: GraduationCap,titulo: 'Treinamentos',          texto: 'Qualificações com certificado reconhecido para você e sua equipe.' },
  { icon: CreditCard,   titulo: 'Acesso a crédito',      texto: 'Linhas de crédito com condições exclusivas para o setor.' },
  { icon: ShieldCheck,  titulo: 'Regularização',         texto: 'Apoio na certificação e regularização do seu negócio.' },
  { icon: BadgeCheck,   titulo: 'Representação',         texto: 'Defesa dos seus direitos e interesses junto ao sindicato.' },
]

export default function AssociadoCadastroPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Faça Parte', href: '/faca-parte' }, { label: 'Associado' }]} />

      <div className="min-h-[calc(100vh-80px)]">
        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-14 px-4">
          <div className="max-w-[780px] mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 mb-5">
              <UserCheck className="w-7 h-7" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">Para profissionais</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Seja Associado do Sindibes
            </h1>
            <p className="text-white/85 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              Acesse planos de saúde, assessoria jurídica, treinamentos e muito mais —
              tudo negociado coletivamente para o setor da beleza de Uberlândia.
            </p>
          </div>
        </section>

        {/* ── Conteúdo ── */}
        <section className="max-w-[1100px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* Diferenciais */}
            <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-24 lg:self-start">
              <h2 className="text-lg font-bold text-text">O que você ganha sendo associado</h2>
              <div className="grid grid-cols-1 gap-4">
                {DIFERENCIAIS.map(({ icon: Icon, titulo, texto }) => (
                  <div key={titulo} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-text text-sm">{titulo}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{texto}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Prefere falar direto?</p>
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Olá! Vim pelo site e quero saber mais sobre como me associar ao Sindibes.')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-green-600 transition w-full justify-center"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Falar pelo WhatsApp
                </a>
                <p className="text-center text-xs text-gray-400 mt-2">{SITE.horario}</p>
              </div>

              <p className="text-center text-xs text-gray-400">
                É empresa e quer ser parceiro?{' '}
                <Link href="/faca-parte/parceiro" className="text-primary underline hover:text-primary/80">
                  Clique aqui
                </Link>
              </p>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-gray-100 px-8 py-8">
              <h2 className="text-lg font-bold text-text mb-1">Preencha seus dados</h2>
              <p className="text-xs text-gray-400 mb-6">Nossa equipe entrará em contato para finalizar sua filiação ao Sindibes.</p>
              <FormAssociado />
            </div>

          </div>
        </section>
      </div>
    </>
  )
}
