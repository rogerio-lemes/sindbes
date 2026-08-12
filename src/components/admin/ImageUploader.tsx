'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon, Link2 } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { useAdminAuth } from './AdminAuthProvider'
import { slugify } from '@/lib/slug'

const BUCKET = 'tenant-uploads'
const MAX_BYTES = 5 * 1024 * 1024

/**
 * Upload real para o Supabase Storage.
 * O caminho sempre começa com o tenant_id — a policy de Storage exige isso.
 */
export default function ImageUploader({
  label, value, onChange, pasta, hint, alturaPreview = 'h-40',
}: {
  label: string
  value: string | null | undefined
  onChange: (url: string | null) => void
  /** Subpasta dentro do tenant, ex: 'vitrine' | 'banners' | 'associados' */
  pasta: string
  hint?: string
  alturaPreview?: string
}) {
  const { tenantId } = useAdminAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [modoUrl, setModoUrl] = useState(false)

  async function enviar(file: File) {
    setErro('')
    if (!file.type.startsWith('image/')) {
      setErro('Selecione um arquivo de imagem.')
      return
    }
    if (file.size > MAX_BYTES) {
      setErro('A imagem deve ter no máximo 5 MB.')
      return
    }

    setEnviando(true)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const base = slugify(file.name.replace(/\.[^.]+$/, ''), 40) || 'imagem'
    const caminho = `${tenantId}/${pasta}/${base}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const sb = getBrowserClient()
    const { error } = await sb.storage.from(BUCKET).upload(caminho, file, {
      cacheControl: '3600', upsert: false,
    })
    setEnviando(false)

    if (error) {
      setErro(error.message)
      return
    }
    const { data } = sb.storage.from(BUCKET).getPublicUrl(caminho)
    onChange(data.publicUrl)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) enviar(file)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <button
          type="button"
          onClick={() => setModoUrl((v) => !v)}
          className="text-xs text-gray-400 hover:text-primary flex items-center gap-1"
        >
          <Link2 className="w-3 h-3" /> {modoUrl ? 'enviar arquivo' : 'usar URL'}
        </button>
      </div>

      {modoUrl ? (
        <input
          type="url"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="https://..."
          className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      ) : value ? (
        <div className={`relative ${alturaPreview} rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group`}>
          <Image src={value} alt={label} fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            aria-label="Remover imagem"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          disabled={enviando}
          className={`w-full ${alturaPreview} rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary transition-colors disabled:opacity-60`}
        >
          {enviando ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Enviando...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">Clique ou arraste uma imagem</span>
              <span className="text-[11px] text-gray-400">JPG, PNG ou WEBP · máx. 5 MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) enviar(file)
          e.target.value = ''
        }}
      />

      {erro && <p className="text-xs text-red-500 mt-1">{erro}</p>}
      {hint && !erro && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

/** Miniatura simples para listagens. */
export function Thumb({ url, alt }: { url: string | null | undefined; alt: string }) {
  if (!url) {
    return (
      <span className="w-16 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">
        <ImageIcon className="w-4 h-4" />
      </span>
    )
  }
  return (
    <span className="relative w-16 h-10 rounded-lg overflow-hidden bg-gray-100 block shrink-0">
      <Image src={url} alt={alt} fill className="object-cover" unoptimized />
    </span>
  )
}
