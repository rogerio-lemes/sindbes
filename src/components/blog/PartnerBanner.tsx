'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BadgePercent, ExternalLink, MessageCircle, Sparkles } from 'lucide-react'
import { PARCEIROS, type Parceiro } from '@/lib/parceiros'

// ── seleção de parceiro ──────────────────────────────────────────────────
// Pega parceiros reais (não exemplo) com capa. Rotaciona pelo slug do artigo.
function hashSlug(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return h
}

export function getParceiroBanner(articleSlug: string): Parceiro | null {
  const pool = PARCEIROS.filter(p => !p.exemplo && p.capa)
  if (!pool.length) return null
  return pool[hashSlug(articleSlug) % pool.length]
}

// ── Banner sidebar (coluna estreita ~260 px) ─────────────────────────────
export function PartnerBannerSidebar({ articleSlug }: { articleSlug: string }) {
  const p = getParceiroBanner(articleSlug)
  if (!p) return null

  const waMsg = encodeURIComponent(`Olá! Vi o anúncio da ${p.nome} no site do Sindibes e quero saber mais sobre as condições para associados.`)

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      {/* imagem de capa */}
      <div className="relative h-32 w-full">
        <Image src={p.capa} alt={p.nome} fill className="object-cover" sizes="260px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          <Sparkles className="w-2.5 h-2.5" /> Parceiro Oficial
        </span>
      </div>

      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">{p.categoria}</p>
        <h4 className="font-bold text-sm text-text mb-1 leading-snug">{p.nome}</h4>
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{p.resumo}</p>

        {/* desconto */}
        <div className="flex items-start gap-2 bg-primary/5 rounded-xl px-3 py-2 mb-3">
          <BadgePercent className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-primary leading-snug">{p.desconto}</p>
        </div>

        <div className="flex flex-col gap-2">
          {p.whatsapp && (
            <a
              href={`https://wa.me/${p.whatsapp}?text=${waMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-xl transition"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          )}
          <Link
            href={`/parceiros/${p.slug}`}
            className="flex items-center justify-center gap-1.5 py-2 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-semibold rounded-xl transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Ver oferta completa
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Banner inline (largura total do artigo) ───────────────────────────────
export function PartnerBannerInline({ articleSlug }: { articleSlug: string }) {
  const p = getParceiroBanner(articleSlug)
  if (!p) return null

  const waMsg = encodeURIComponent(`Olá! Vi o anúncio da ${p.nome} no site do Sindibes e quero saber mais sobre as condições para associados.`)

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white flex flex-col sm:flex-row">
      {/* imagem */}
      <div className="relative h-40 sm:h-auto sm:w-52 flex-shrink-0">
        <Image src={p.capa} alt={p.nome} fill className="object-cover" sizes="(max-width:640px) 100vw, 208px" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 hidden sm:block" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          <Sparkles className="w-2.5 h-2.5" /> Parceiro Sindibes
        </span>
      </div>

      {/* texto */}
      <div className="flex flex-col justify-between p-5 flex-1 gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">{p.categoria}</p>
          <h4 className="font-bold text-base text-text mb-1 leading-snug">{p.nome}</h4>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{p.resumo}</p>
        </div>

        {/* desconto + CTAs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-primary/5 rounded-xl px-3 py-2 flex-1 min-w-0">
            <BadgePercent className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-xs font-semibold text-primary leading-snug line-clamp-1">{p.desconto}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {p.whatsapp && (
              <a
                href={`https://wa.me/${p.whatsapp}?text=${waMsg}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-xl transition whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            )}
            <Link
              href={`/parceiros/${p.slug}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Ver oferta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
