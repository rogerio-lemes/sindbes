'use client'

/**
 * Imagem principal de parceiro/associado.
 *
 * Os formulários passaram a pedir a LOGOMARCA no lugar da foto de capa, mas os
 * cadastros antigos e os fixos do código ainda têm fotos largas. Este
 * componente decide pelo formato da imagem, depois que ela carrega:
 *
 *  - foto (proporção de paisagem, ~4:3 a ~2,4:1): preenche a área, como antes;
 *  - logomarca (quadrada, em pé ou muito larga): aparece inteira, sem corte.
 *
 * Modos:
 *  - "cartao": a logo fica inteira sobre fundo branco dentro do cartão;
 *  - "hero": no topo da página a própria logo desfocada vira o fundo e a logo
 *    nítida aparece em um cartão branco à direita, sem cobrir o título.
 */
import { useState } from 'react'
import Image from 'next/image'

const PROPORCAO_MIN_FOTO = 1.25
const PROPORCAO_MAX_FOTO = 2.4

export default function ImagemCapa({
  src, alt, modo = 'cartao', className = '', priority, sizes,
}: {
  src: string
  alt: string
  modo?: 'cartao' | 'hero'
  /** Classes extras da imagem (ex.: efeito de zoom ao passar o mouse). */
  className?: string
  priority?: boolean
  sizes?: string
}) {
  const [ehLogo, setEhLogo] = useState<boolean | null>(null)

  const aoCarregar = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget
    if (!w || !h) { setEhLogo(false); return }
    const proporcao = w / h
    setEhLogo(proporcao < PROPORCAO_MIN_FOTO || proporcao > PROPORCAO_MAX_FOTO)
  }

  // Até saber o formato, a imagem fica invisível para não piscar cortada.
  const visivel = ehLogo === null ? 'opacity-0' : 'opacity-100'

  if (ehLogo && modo === 'hero') {
    return (
      <>
        <Image src={src} alt="" aria-hidden fill sizes="100vw" className="object-cover blur-2xl scale-125 opacity-70" />
        <div className="absolute z-[5] right-4 top-4 md:right-[max(1rem,calc((100vw-1200px)/2+1rem))] md:top-1/2 md:-translate-y-1/2 w-24 h-24 md:w-56 md:h-56 rounded-2xl bg-white shadow-2xl p-2.5 md:p-5">
          <span className="relative block w-full h-full">
            <Image src={src} alt={alt} fill sizes="(min-width: 768px) 224px, 96px" className="object-contain" priority={priority} />
          </span>
        </div>
      </>
    )
  }

  if (ehLogo) {
    return (
      <span className="absolute inset-0 bg-white">
        <Image src={src} alt={alt} fill sizes={sizes} className={`object-contain p-4 ${className}`} priority={priority} />
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onLoad={aoCarregar}
      className={`object-cover transition-opacity duration-300 ${visivel} ${className}`}
    />
  )
}
