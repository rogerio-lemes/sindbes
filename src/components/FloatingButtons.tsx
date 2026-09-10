'use client'

import { useState, useEffect } from 'react'
import { Phone, ArrowUp } from 'lucide-react'
import Image from 'next/image'
import { useTenant } from '@/components/TenantProvider'
import { useDeveSumir } from '@/components/OverlayProvider'

export default function FloatingButtons() {
  const { config } = useTenant()
  const [showBackTop, setShowBackTop] = useState(false)

  // No modal saem sempre; com o chat aberto saem só no celular,
  // onde o chat ocupa quase toda a tela.
  const noModal = useDeveSumir({ modal: true })
  const noChat = useDeveSumir({ chat: true })
  const [ehCelular, setEhCelular] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const aplicar = () => setEhCelular(mq.matches)
    aplicar()
    mq.addEventListener('change', aplicar)
    return () => mq.removeEventListener('change', aplicar)
  }, [])

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (noModal || (noChat && ehCelular)) return null

  return (
    <>
      {/* bottom-28 no celular: acima da barra de captura, que fica no rodapé.
          Altura da coluna: 2 botões de 56px + 12px de espaço = 124px.
          Os balões do atendimento começam acima disso (ver AtendimentoChat). */}
      <div className="fixed bottom-28 md:bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        {/* Foto do atendente: abre o chat de atendimento */}
        <button
          onClick={() => window.dispatchEvent(new Event('abrir-atendimento'))}
          className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-secondary shadow-lg hover:scale-110 transition-transform"
          aria-label={`Falar com o atendimento do ${config.nome}`}
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
          {/* Indicador de disponibilidade */}
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-white" />
        </button>

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
          className="fixed bottom-28 md:bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg hover:bg-primary transition-colors"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  )
}
