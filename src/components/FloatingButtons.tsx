'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Phone, ArrowUp } from 'lucide-react'
import Image from 'next/image'
import { useTenant, useWhatsappUrl } from '@/components/TenantProvider'

export default function FloatingButtons() {
  const { config } = useTenant()
  const [showBackTop, setShowBackTop] = useState(false)

  const whatsUrl1 = useWhatsappUrl(`Olá! Vim pelo site da ${config.nome} e quero falar com o atendimento.`)
  const whatsUrl2 = useWhatsappUrl(`Olá! Vim pelo site da ${config.nome} e gostaria de mais informações.`)

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        {/* Atendente IA */}
        <a
          href={whatsUrl1}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary shadow-lg hover:scale-110 transition-transform"
          aria-label={`Atendimento ${config.nome}`}
        >
          {config.atendente_foto_url ? (
            <Image
              src={config.atendente_foto_url}
              alt={`Atendimento ${config.nome}`}
              width={56}
              height={56}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center text-white font-bold text-lg">
              {(config.atendente_nome || 'A')[0]}
            </div>
          )}
        </a>

        <a
          href={whatsUrl2}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </a>

        <a
          href={`tel:${config.phone || config.whatsapp}`}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Ligar"
        >
          <Phone className="w-6 h-6 text-white" />
        </a>
      </div>

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
