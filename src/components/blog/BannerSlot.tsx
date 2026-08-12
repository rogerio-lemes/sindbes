'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { Banner } from '@/lib/banners'

function registrar(bannerId: string, tipo: 'impressao' | 'clique') {
  try {
    const body = JSON.stringify({ banner_id: bannerId, tipo })
    // sendBeacon sobrevive à navegação ao clicar no banner
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/banner-evento', new Blob([body], { type: 'application/json' }))
      return
    }
    fetch('/api/banner-evento', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true,
    }).catch(() => {})
  } catch {}
}

/**
 * Renderiza um banner de anunciante e registra impressão quando ele
 * realmente entra na viewport (IntersectionObserver), não no mount.
 */
export default function BannerSlot({
  banner, formato,
}: {
  banner: Banner
  formato: 'faixa' | 'card'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const jaContou = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !jaContou.current) {
          jaContou.current = true
          registrar(banner.id, 'impressao')
          obs.disconnect()
        }
      })
    }, { threshold: 0.5 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [banner.id])

  const conteudo = (
    <div
      ref={ref}
      className={
        formato === 'faixa'
          ? 'relative w-full h-[120px] sm:h-[160px] rounded-2xl overflow-hidden bg-gray-100'
          : 'relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100'
      }
    >
      <Image
        src={banner.imagem_url}
        alt={banner.titulo || `Anúncio de ${banner.anunciante_nome}`}
        fill
        className="object-cover"
        unoptimized
      />
      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium tracking-wide uppercase backdrop-blur-sm">
        Publicidade
      </span>
    </div>
  )

  if (!banner.link_destino) return conteudo

  return (
    <a
      href={banner.link_destino}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => registrar(banner.id, 'clique')}
      className="block hover:opacity-95 transition-opacity"
    >
      {conteudo}
    </a>
  )
}
