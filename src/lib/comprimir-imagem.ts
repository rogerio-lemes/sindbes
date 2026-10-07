'use client'

/**
 * Compressão de imagens no navegador, antes do envio dos formulários.
 *
 * Motivo: a Vercel recusa corpo de requisição acima de ~4,5 MB, e um associado
 * pode mandar capa + 10 fotos. Aqui cada imagem vira JPEG com no máximo
 * 1600px no maior lado, reduzindo a qualidade até caber em ~350 KB.
 */

/** Tamanho máximo aceito do arquivo original escolhido pela pessoa. */
export const MAX_ORIGINAL_MB = 15

const LADO_MAX = 1600
const ALVO_BYTES = 350 * 1024
const QUALIDADE_INICIAL = 0.8
const QUALIDADE_MINIMA = 0.4

/** Abre o arquivo como imagem desenhável (createImageBitmap ou <img>). */
async function carregar(file: File): Promise<{ fonte: CanvasImageSource; w: number; h: number; liberar: () => void }> {
  if (typeof createImageBitmap === 'function') {
    try {
      // imageOrientation respeita a rotação EXIF das fotos de celular
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return { fonte: bmp, w: bmp.width, h: bmp.height, liberar: () => bmp.close() }
    } catch { /* cai no <img> abaixo */ }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((ok, falha) => {
      const i = new Image()
      i.onload = () => ok(i)
      i.onerror = () => falha(new Error('imagem inválida'))
      i.src = url
    })
    return { fonte: img, w: img.naturalWidth, h: img.naturalHeight, liberar: () => URL.revokeObjectURL(url) }
  } catch (e) {
    URL.revokeObjectURL(url)
    throw e
  }
}

function paraBlob(canvas: HTMLCanvasElement, qualidade: number) {
  return new Promise<Blob | null>(ok => canvas.toBlob(ok, 'image/jpeg', qualidade))
}

/** Troca a extensão do nome original por .jpg. */
function nomeJpg(nome: string) {
  const base = nome.replace(/\.[^.]+$/, '') || 'foto'
  return `${base}.jpg`
}

/**
 * Redimensiona e converte para JPEG. Se algo falhar (navegador antigo,
 * formato que o navegador não abre), devolve o arquivo original.
 */
export async function comprimirImagem(file: File, alvoBytes = ALVO_BYTES): Promise<File> {
  let img: Awaited<ReturnType<typeof carregar>>
  try {
    img = await carregar(file)
  } catch {
    return file
  }
  try {
    let escala = Math.min(1, LADO_MAX / Math.max(img.w, img.h))
    let qualidade = QUALIDADE_INICIAL
    let melhor: Blob | null = null

    // Reduz a qualidade e, se ainda não couber, a dimensão
    for (let tentativa = 0; tentativa < 8; tentativa++) {
      const w = Math.max(1, Math.round(img.w * escala))
      const h = Math.max(1, Math.round(img.h * escala))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return file
      // Fundo branco para PNG/WEBP com transparência não ficar preto no JPEG
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img.fonte, 0, 0, w, h)

      const blob = await paraBlob(canvas, qualidade)
      if (!blob) break
      if (!melhor || blob.size < melhor.size) melhor = blob
      if (blob.size <= alvoBytes) break

      if (qualidade > QUALIDADE_MINIMA) qualidade = Math.max(QUALIDADE_MINIMA, qualidade - 0.1)
      else escala *= 0.8
    }

    if (!melhor) return file
    // Se o original já era JPEG/PNG/WEBP menor que o resultado e cabe no alvo, mantém o original
    if (file.size <= melhor.size && file.size <= alvoBytes && /^image\/(jpeg|png|webp)$/.test(file.type)) {
      return file
    }
    return new File([melhor], nomeJpg(file.name), { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    return file
  } finally {
    img.liberar()
  }
}

/** Formata bytes para exibição (ex.: 320 KB, 1.4 MB). */
export const tamanhoLegivel = (b: number) =>
  b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`
