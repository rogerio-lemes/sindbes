import Link from 'next/link'
import { whatsappUrl, SITE } from '@/lib/constants'

interface Props {
  title?: string
  highlight?: string
  description?: string
}

export default function CtaBanner({
  title = 'Pronto para fortalecer',
  highlight = 'seu negócio?',
  description = 'Converse com nossa equipe e descubra como o Sindbes pode ajudar sua empresa da beleza a crescer com segurança e economia.',
}: Props) {
  return (
    <section className="py-16 gradient-primary">
      <div className="max-w-[1200px] mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title} <span className="text-[#BFEDE6]">{highlight}</span>
        </h2>
        <p className="text-white/80 max-w-xl mx-auto mb-8">{description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={whatsappUrl(`Olá! Quero saber mais sobre o ${SITE.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 gradient-cta text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Falar no WhatsApp
          </a>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-colors"
          >
            Preencher formulário
          </Link>
        </div>
      </div>
    </section>
  )
}
