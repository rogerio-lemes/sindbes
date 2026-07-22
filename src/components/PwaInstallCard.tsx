'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useTenant } from '@/components/TenantProvider'

export default function PwaInstallCard() {
  const { config } = useTenant()
  const [show, setShow] = useState(false)
  const deferredPrompt = useRef<any>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e
    }
    window.addEventListener('beforeinstallprompt', handler as EventListener)

    const dismissed = localStorage.getItem('pwa_dismissed_at')
    if (dismissed) {
      const elapsed = Date.now() - parseInt(dismissed, 10)
      if (elapsed < 48 * 60 * 60 * 1000) return
    }

    const timer = setTimeout(() => setShow(true), 5000)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', handler as EventListener)
    }
  }, [])

  function dismiss() {
    setShow(false)
    localStorage.setItem('pwa_dismissed_at', Date.now().toString())
  }

  async function install() {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt()
      await deferredPrompt.current.userChoice
      deferredPrompt.current = null
    }
    dismiss()
  }

  if (!show) return null

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

  return (
    <div className="fixed bottom-24 left-5 z-[45] w-[300px] max-w-[calc(100vw-2.5rem)] animate-fade-up">
      <div className="bg-white rounded-2xl shadow-2xl p-5 border-l-4 border-primary relative">
        <button
          onClick={dismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📲</span>
          <span className="font-bold text-text">Baixe nosso App</span>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Tenha o {config.nome} na palma da mão: agende, receba novidades e ofertas por notificação push.
        </p>

        {isIOS ? (
          <p className="text-xs text-gray-500 bg-bg-alt rounded-lg p-3">
            Toque em <strong>Compartilhar</strong> → <strong>Adicionar à Tela de Início</strong>
          </p>
        ) : (
          <button
            onClick={install}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary-dark transition-colors"
          >
            Instalar App
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-up {
          animation: fadeUp 0.4s ease-out both;
        }
      `}</style>
    </div>
  )
}
