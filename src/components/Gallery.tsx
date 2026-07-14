'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'

interface Props {
  images: string[]
  alt?: string
}

export default function Gallery({ images, alt = 'Foto' }: Props) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, prev, next])

  function openAt(i: number) {
    setIdx(i)
    setOpen(true)
  }

  return (
    <>
      {/* Grid mosaico */}
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[130px] md:auto-rows-[150px] gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => openAt(i)}
            className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
            aria-label={`Abrir ${alt} ${i + 1}`}
          >
            <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
              <Expand className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-[galFade_0.2s_ease-out]"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
                aria-label="Próxima"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-5xl h-[72vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={images[idx]} alt={`${alt} ${idx + 1}`} fill className="object-contain" />
          </div>

          {/* Miniaturas + contador */}
          <div className="mt-4 flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden transition-all ${i === idx ? 'ring-2 ring-white scale-105' : 'opacity-50 hover:opacity-100'}`}
                >
                  <Image src={src} alt={`Miniatura ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            <span className="text-white/70 text-sm">{idx + 1} / {images.length}</span>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes galFade { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  )
}
