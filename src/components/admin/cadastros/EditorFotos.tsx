'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import {
  Upload, Loader2, ArrowLeft, ArrowRight, Trash2, ImagePlus, Star, ImageIcon, RefreshCw,
} from 'lucide-react'
import { useAdminAuth } from '../AdminAuthProvider'
import { enviarImagem } from './comum'

/**
 * Capa + galeria do cadastro. Os arquivos vão para
 * `<tenant>/cadastros/<id>/...` no bucket público.
 */
export default function EditorFotos({
  registroId, capa, fotos, onCapa, onFotos,
}: {
  registroId: string
  capa: string | null
  fotos: string[]
  onCapa: (url: string | null) => void
  onFotos: (urls: string[]) => void
}) {
  const { tenantId } = useAdminAuth()
  const pasta = `cadastros/${registroId}`
  const capaRef = useRef<HTMLInputElement>(null)
  const galeriaRef = useRef<HTMLInputElement>(null)
  const [enviandoCapa, setEnviandoCapa] = useState(false)
  const [enviandoGaleria, setEnviandoGaleria] = useState(0)
  const [erro, setErro] = useState('')

  async function trocarCapa(file: File) {
    setErro('')
    setEnviandoCapa(true)
    try {
      onCapa(await enviarImagem(tenantId, pasta, file))
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível enviar a imagem.')
    } finally {
      setEnviandoCapa(false)
    }
  }

  async function adicionarFotos(files: File[]) {
    if (!files.length) return
    setErro('')
    setEnviandoGaleria(files.length)
    const novas: string[] = []
    const falhas: string[] = []
    for (const f of files) {
      try {
        novas.push(await enviarImagem(tenantId, pasta, f))
      } catch (e) {
        falhas.push(e instanceof Error ? e.message : f.name)
      }
      setEnviandoGaleria((n) => Math.max(0, n - 1))
    }
    if (novas.length) onFotos([...fotos, ...novas])
    if (falhas.length) setErro(falhas.join(' '))
  }

  function mover(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= fotos.length) return
    const nova = [...fotos]
    ;[nova[i], nova[j]] = [nova[j], nova[i]]
    onFotos(nova)
  }

  return (
    <div className="space-y-6">
      {/* Capa */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Foto de capa</span>
          <span className="text-xs text-gray-400">Aparece no topo da página e nas listagens</span>
        </div>
        {capa ? (
          <div className="relative h-52 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <Image src={capa} alt="Foto de capa" fill className="object-cover" unoptimized />
            {enviandoCapa && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                onClick={() => capaRef.current?.click()}
                className="h-9 px-3 rounded-lg bg-white/95 text-gray-800 text-xs font-semibold shadow flex items-center gap-1.5 hover:bg-white"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Trocar foto
              </button>
              <button
                type="button"
                onClick={() => onCapa(null)}
                className="h-9 px-3 rounded-lg bg-black/60 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remover
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => capaRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) trocarCapa(f) }}
            disabled={enviandoCapa}
            className="w-full h-52 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary transition-colors disabled:opacity-60"
          >
            {enviandoCapa ? (
              <><Loader2 className="w-6 h-6 animate-spin" /><span className="text-xs">Enviando...</span></>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs font-medium">Sem capa. Clique ou arraste uma imagem</span>
                <span className="text-[11px] text-gray-400">Sem capa, o site usa uma imagem padrão · JPG, PNG ou WEBP até 5 MB</span>
              </>
            )}
          </button>
        )}
        <input
          ref={capaRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) trocarCapa(f); e.target.value = '' }}
        />
      </div>

      {/* Galeria */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Galeria de fotos <span className="text-gray-400 font-normal">({fotos.length})</span>
          </span>
          <span className="text-xs text-gray-400">Use as setas para mudar a ordem</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {fotos.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" unoptimized />
              <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white text-[11px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              {url === capa && (
                <span className="absolute top-2 right-2 px-2 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" /> Capa
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center gap-1 bg-gradient-to-t from-black/70 to-transparent">
                <BotaoFoto rotulo="Mover para a esquerda" onClick={() => mover(i, -1)} disabled={i === 0}>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </BotaoFoto>
                <BotaoFoto rotulo="Mover para a direita" onClick={() => mover(i, 1)} disabled={i === fotos.length - 1}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </BotaoFoto>
                {url !== capa && (
                  <BotaoFoto rotulo="Usar como capa" onClick={() => onCapa(url)}>
                    <Star className="w-3.5 h-3.5" />
                  </BotaoFoto>
                )}
                <BotaoFoto rotulo="Remover foto" perigo onClick={() => onFotos(fotos.filter((_, j) => j !== i))} className="ml-auto">
                  <Trash2 className="w-3.5 h-3.5" />
                </BotaoFoto>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => galeriaRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); adicionarFotos(Array.from(e.dataTransfer.files ?? [])) }}
            disabled={enviandoGaleria > 0}
            className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 bg-gray-50 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-primary transition-colors disabled:opacity-60"
          >
            {enviandoGaleria > 0 ? (
              <><Loader2 className="w-5 h-5 animate-spin" /><span className="text-xs">Enviando {enviandoGaleria}...</span></>
            ) : (
              <><ImagePlus className="w-5 h-5" /><span className="text-xs font-medium">Adicionar fotos</span></>
            )}
          </button>
        </div>
        {fotos.length === 0 && (
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> Nenhuma foto na galeria. Você pode enviar várias de uma vez.
          </p>
        )}
        <input
          ref={galeriaRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { adicionarFotos(Array.from(e.target.files ?? [])); e.target.value = '' }}
        />
      </div>

      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  )
}

function BotaoFoto({
  children, rotulo, onClick, disabled, perigo, className = '',
}: {
  children: React.ReactNode
  rotulo: string
  onClick: () => void
  disabled?: boolean
  perigo?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={rotulo}
      aria-label={rotulo}
      className={`w-7 h-7 rounded-md bg-white/90 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        perigo ? 'hover:bg-red-600 hover:text-white' : 'hover:bg-primary hover:text-white'
      } ${className}`}
    >
      {children}
    </button>
  )
}
