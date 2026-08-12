'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

interface Props {
  fotos: string[]
  nome: string
}

export default function ImageCarousel({ fotos, nome }: Props) {
  const [idx, setIdx] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const prev = useCallback(() => setIdx(i => (i === 0 ? fotos.length - 1 : i - 1)), [fotos.length])
  const next = useCallback(() => setIdx(i => (i === fotos.length - 1 ? 0 : i + 1)), [fotos.length])

  const prevLb = useCallback(() => setLightbox(i => i === null ? null : (i === 0 ? fotos.length - 1 : i - 1)), [fotos.length])
  const nextLb = useCallback(() => setLightbox(i => i === null ? null : (i === fotos.length - 1 ? 0 : i + 1)), [fotos.length])

  if (fotos.length === 0) return null

  return (
    <>
      <div className="mt-10">
        <h2 className="text-xl font-bold bicolor-title mb-5">
          Galeria de <span>imagens</span>
        </h2>

        {/* ── Imagem principal ── */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video group cursor-zoom-in"
          onClick={() => setLightbox(idx)}>
          <Image
            src={fotos[idx]}
            alt={`${nome} — imagem ${idx + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {/* overlay zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 drop-shadow transition" />
          </div>
          {/* controles */}
          {fotos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* contador */}
              <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {idx + 1} / {fotos.length}
              </span>
            </>
          )}
        </div>

        {/* ── Thumbnails ── */}
        {fotos.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-thin">
            {fotos.map((f, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                  i === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'
                }`}>
                <Image src={f} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition">
            <X className="w-5 h-5" />
          </button>

          {fotos.length > 1 && (
            <button onClick={e => { e.stopPropagation(); prevLb() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="relative max-w-4xl max-h-[80vh] w-full h-full" onClick={e => e.stopPropagation()}>
            <Image
              src={fotos[lightbox]}
              alt={`${nome} — imagem ${lightbox + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>

          {fotos.length > 1 && (
            <button onClick={e => { e.stopPropagation(); nextLb() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition">
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightbox + 1} / {fotos.length}
          </span>
        </div>
      )}
    </>
  )
}
