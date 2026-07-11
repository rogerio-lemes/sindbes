'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  titulo: string
  mensagem: string
  ctaLabel?: string
  ctaHref?: string
}

export default function ConfirmModal({ open, onClose, titulo, mensagem, ctaLabel, ctaHref }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center animate-[modalPop_0.35s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-20 h-20 mx-auto mb-5">
          <span className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-60" />
          <span className="relative w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="w-11 h-11 text-white" />
          </span>
        </div>

        <h3 className="text-xl font-bold text-text mb-2">{titulo}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">{mensagem}</p>

        <div className="flex flex-col gap-3">
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              {ctaLabel}
            </Link>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 bg-bg-alt text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalPop { from { opacity: 0; transform: translateY(20px) scale(0.95) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}
