import { Metadata } from 'next'
import Image from 'next/image'
import { getTenant } from '@/lib/tenant'
import Breadcrumbs from '@/components/Breadcrumbs'
import { User, Crown } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getTenant()
  return {
    title: `Diretoria 2023–2027 | ${config.nome}`,
    description: `Conheça a diretoria e o conselho fiscal do ${config.nome} para a gestão 2023–2027.`,
    alternates: { canonical: '/institucional/diretoria' },
  }
}

const diretoriaExecutiva = [
  { cargo: 'Presidente', nome: 'Romer Sousa da Costa' },
  { cargo: 'Vice-Presidente', nome: '[Nome]' },
  { cargo: '1º Secretário(a)', nome: '[Nome]' },
  { cargo: '2º Secretário(a)', nome: '[Nome]' },
  { cargo: '1º Tesoureiro(a)', nome: '[Nome]' },
  { cargo: '2º Tesoureiro(a)', nome: '[Nome]' },
]

const conselhoFiscal = [
  { cargo: 'Membro Efetivo', nome: '[Nome]' },
  { cargo: 'Membro Efetivo', nome: '[Nome]' },
  { cargo: 'Membro Efetivo', nome: '[Nome]' },
]

const suplentes = [
  { cargo: 'Suplente', nome: '[Nome]' },
  { cargo: 'Suplente', nome: '[Nome]' },
  { cargo: 'Suplente', nome: '[Nome]' },
]

function MemberCard({ cargo, nome, destaque }: { cargo: string; nome: string; destaque?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm text-center p-6 ${destaque ? 'border-secondary ring-2 ring-secondary/20' : 'border-gray-100'}`}>
      <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 overflow-hidden">
        {/* Substituir por <Image> com a foto real */}
        <User className="w-10 h-10 text-white/70" />
      </div>
      <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 ${destaque ? 'bg-secondary text-white' : 'bg-primary/10 text-primary'}`}>
        {cargo}
      </span>
      <p className="font-bold text-text">{nome}</p>
    </div>
  )
}

export default function DiretoriaPage() {
  const presidente = diretoriaExecutiva[0]
  const restoExecutiva = diretoriaExecutiva.slice(1)

  return (
    <>
      <Breadcrumbs items={[{ label: 'Institucional', href: '/institucional' }, { label: 'Diretoria 2023–2027' }]} />

      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Institucional</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Diretoria vigente <span>2023 – 2027</span>
          </h1>
          <p className="text-gray-500 mt-4">
            Conheça os profissionais eleitos para representar e conduzir o sindicato durante a gestão 2023–2027.
          </p>
        </div>

        {/* Presidente em destaque */}
        <div className="mb-16">
          <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-secondary shadow-xl overflow-hidden text-center relative">
            <div className="h-20 gradient-primary" />
            <div className="px-8 pb-8 -mt-14">
              <div className="w-28 h-28 rounded-full ring-4 ring-white mx-auto mb-4 overflow-hidden shadow-lg">
                <Image
                  src="/images/presidente.jpg"
                  alt="Romer Sousa da Costa"
                  width={112} height={112}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-secondary text-white px-4 py-1.5 rounded-full mb-3">
                <Crown className="w-3.5 h-3.5" /> Presidente
              </span>
              <p className="font-bold text-xl text-text">{presidente.nome}</p>
              <p className="text-sm text-gray-500 mt-1">Gestão 2023–2027</p>
            </div>
          </div>
        </div>

        {/* Diretoria Executiva */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold mb-6 bicolor-title text-center">Diretoria <span>Executiva</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {restoExecutiva.map((m, i) => (
              <MemberCard key={i} cargo={m.cargo} nome={m.nome} />
            ))}
          </div>
        </div>

        {/* Conselho Fiscal */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold mb-6 bicolor-title text-center">Conselho <span>Fiscal</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {conselhoFiscal.map((m, i) => (
              <MemberCard key={i} cargo={m.cargo} nome={m.nome} />
            ))}
          </div>
        </div>

        {/* Suplentes */}
        <div>
          <h2 className="text-2xl font-bold mb-6 bicolor-title text-center">Suplentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {suplentes.map((m, i) => (
              <MemberCard key={i} cargo={m.cargo} nome={m.nome} />
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-12 text-center">
          Os demais membros da diretoria serão adicionados quando as fotos forem disponibilizadas.
        </p>
      </section>
    </>
  )
}
