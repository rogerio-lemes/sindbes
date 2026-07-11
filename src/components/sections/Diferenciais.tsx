import Image from 'next/image'
import { IMAGES } from '@/lib/constants'
import { Users, BookOpen, Banknote } from 'lucide-react'

const items = [
  {
    icon: Users,
    image: IMAGES.diferencial1,
    title: 'Rede de profissionais',
    description: 'Conecte-se com outros empresários e profissionais da beleza de Uberlândia. Trocar experiências acelera resultados.',
  },
  {
    icon: BookOpen,
    image: IMAGES.diferencial2,
    title: 'Capacitação contínua',
    description: 'Treinamentos práticos em gestão, finanças, pessoas e técnicas. Sua equipe sempre atualizada e competitiva.',
  },
  {
    icon: Banknote,
    image: IMAGES.diferencial3,
    title: 'Economia real',
    description: 'Planos de saúde, odontológico, crédito e assessoria com condições exclusivas. Benefícios que fazem diferença no caixa.',
  },
]

export default function Diferenciais() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Por que o Sindbes</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 bicolor-title">
            Diferenciais que <span>transformam</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow scroll-reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
