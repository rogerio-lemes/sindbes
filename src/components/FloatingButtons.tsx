'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Phone, ArrowUp } from 'lucide-react'
import Image from 'next/image'
import { SITE, IMAGES, whatsappUrl } from '@/lib/constants'

export default function FloatingButtons() {
  const [showBackTop, setShowBackTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Floating stack: bottom-right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        {/* IA de atendimento (Wagner) — primeiro */}
        <a
          href={whatsappUrl(`Olá! Vim pelo site da ${SITE.name} e quero falar com o atendimento.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary shadow-lg hover:scale-110 transition-transform"
          aria-label="Atendimento Sindbes"
        >
          <Image
            src={IMAGES.atendente}
            alt="Atendimento Sindbes"
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />
        </a>

        <a
          href={whatsappUrl(`Olá! Vim pelo site da ${SITE.name} e gostaria de mais informações.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </a>

        <a
          href={`tel:${SITE.phone}`}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Ligar"
        >
          <Phone className="w-6 h-6 text-white" />
        </a>
      </div>

      {/* Back to top: bottom-left */}
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg hover:bg-primary transition-colors"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  )
}
