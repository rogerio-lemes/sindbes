import { Metadata } from 'next'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import { FileText, Download, Calendar, Shield, BadgeCheck } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `Convenções Coletivas | ${config.nome}`,
    description: `Acesse as convenções coletivas de trabalho e patrocínio vigentes do ${config.nome}.`,
    alternates: { canonical: '/institucional/convencoes' },
  }
}

const convencoes = [
  {
    titulo: 'CCT Trabalhista 2025–2026',
    subtitulo: 'SETH-TAP × Sindibes · Salões de Uberlândia',
    descricao: 'Convenção Coletiva de Trabalho entre o Sindicato dos Empregados em Turismo e Hospitalidade (SETH-TAP) e o Sindibes, vigência 2025–2026, aplicável a salões de beleza de Uberlândia e região.',
    vigencia: '2025 – 2026',
    tipo: 'Trabalhista',
    arquivo: '/docs/cct-trabalhista-2025-2026.pdf',
    destaque: true,
  },
  {
    titulo: 'CCT Patrocínio 2026',
    subtitulo: 'Sindibes × FETHEN-MG',
    descricao: 'Convenção Coletiva de Patrocínio firmada entre o Sindibes e a Federação dos Trabalhadores em Turismo, Hospitalidade e Entretenimento de Minas Gerais (FETHEN-MG).',
    vigencia: '2026',
    tipo: 'Patrocínio',
    arquivo: '/docs/cct-patrocinio-2026.pdf',
    destaque: false,
  },
  {
    titulo: 'Guia de Benefícios PAF',
    subtitulo: 'SETH × Sindibes · Salões',
    descricao: 'Guia completo dos benefícios do Plano de Assistência ao Funcionário (PAF) negociados entre o SETH e o Sindibes para trabalhadores de salões de beleza associados.',
    vigencia: '2025 – 2026',
    tipo: 'Benefícios',
    arquivo: '/docs/guia-beneficios-paf.pdf',
    destaque: false,
  },
]

const tipoColor: Record<string, string> = {
  'Trabalhista': 'bg-primary/10 text-primary',
  'Patrocínio':  'bg-secondary/10 text-secondary',
  'Benefícios':  'bg-green-50 text-green-700',
}

export default function ConvencoesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Institucional', href: '/institucional' }, { label: 'Convenções Coletivas' }]} />

      <section className="max-w-[900px] mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Documentos Oficiais</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Convenções <span>Coletivas</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Acesse os instrumentos normativos vigentes negociados pelo Sindibes em nome dos trabalhadores e empresas da beleza de Uberlândia.
          </p>
        </div>

        {/* Aviso legal */}
        <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-10">
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Os documentos disponibilizados abaixo são instrumentos coletivos devidamente registrados no Ministério do Trabalho e Emprego. Dúvidas sobre a aplicação das cláusulas devem ser encaminhadas à secretaria do Sindibes.
          </p>
        </div>

        <div className="space-y-6">
          {convencoes.map((c, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                c.destaque ? 'border-secondary ring-2 ring-secondary/15' : 'border-gray-100'
              }`}
            >
              <div className="p-6 flex flex-col sm:flex-row gap-5 items-start">
                {/* ícone */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  c.destaque ? 'gradient-primary' : 'bg-bg-alt'
                }`}>
                  <FileText className={`w-7 h-7 ${c.destaque ? 'text-white' : 'text-primary'}`} />
                </div>

                {/* texto */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${tipoColor[c.tipo]}`}>
                      {c.tipo}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" /> {c.vigencia}
                    </span>
                    {c.destaque && (
                      <span className="flex items-center gap-1 text-xs text-secondary font-semibold">
                        <BadgeCheck className="w-3.5 h-3.5" /> Vigente
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-lg text-text leading-snug">{c.titulo}</h2>
                  <p className="text-sm text-gray-500 mt-0.5 mb-3">{c.subtitulo}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.descricao}</p>
                </div>

                {/* botão download */}
                <a
                  href={c.arquivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition ${
                    c.destaque
                      ? 'gradient-primary text-white hover:opacity-90'
                      : 'bg-bg-alt text-primary hover:bg-primary/10'
                  }`}
                >
                  <Download className="w-4 h-4" /> Baixar PDF
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-12 text-center">
          Documentos atualizados em agosto de 2026. Para versões anteriores, entre em contato com a secretaria do Sindibes.
        </p>
      </section>
    </>
  )
}
