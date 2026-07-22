import { Metadata } from 'next'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import { User, Crown } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `Galeria de Presidentes | ${config.nome}`,
    description: `Conheça os presidentes que fizeram a história do ${config.nome}.`,
    alternates: { canonical: '/institucional/galeria-de-presidentes' },
  }
}

// Preencher com os dados reais no painel administrativo
const presidentes = [
  { nome: '[Nome do Presidente]', gestao: '2026 – 2028', atual: true },
  { nome: '[Nome do Presidente]', gestao: '[Gestão anterior]', atual: false },
  { nome: '[Nome do Presidente]', gestao: '[Gestão anterior]', atual: false },
  { nome: '[Nome do Presidente]', gestao: '[Gestão anterior]', atual: false },
  { nome: '[Nome do Presidente]', gestao: '[Gestão anterior]', atual: false },
  { nome: '[Nome do Presidente]', gestao: '[Gestão fundadora]', atual: false },
]

export default function GaleriaPresidentesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Institucional', href: '/institucional' }, { label: 'Galeria de Presidentes' }]} />

      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Institucional</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Galeria de <span>Presidentes</span>
          </h1>
          <p className="text-gray-500 mt-4">
            Homenagem às lideranças que dedicaram seu tempo e sua visão para construir e fortalecer o Sindicato da Beleza de Uberlândia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {presidentes.map((p, i) => (
            <div
              key={i}
              className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden text-center p-8 ${p.atual ? 'border-secondary ring-2 ring-secondary/20' : 'border-gray-100'}`}
            >
              {p.atual && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-bold text-white bg-secondary px-2.5 py-1 rounded-full">
                  <Crown className="w-3 h-3" /> Atual
                </span>
              )}
              <div className="w-28 h-28 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {/* Substituir por <Image> com a foto real */}
                <User className="w-12 h-12 text-white/70" />
              </div>
              <h2 className="font-bold text-text">{p.nome}</h2>
              <p className="text-sm text-secondary font-semibold mt-1">Gestão {p.gestao}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-10 text-center">
          Adicione as fotos, nomes e gestões oficiais dos presidentes no painel administrativo.
        </p>
      </section>
    </>
  )
}
