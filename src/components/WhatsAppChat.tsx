'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { SITE, IMAGES, whatsappUrl } from '@/lib/constants'

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  if (!open) return null

  return (
    <div className="hidden md:block fixed bottom-24 right-6 z-[42] w-[320px] animate-slide-in-right">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#075E54] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
            <Image
              src={IMAGES.atendente}
              alt="Atendente"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Wagner</p>
            <p className="text-green-200 text-xs">Online agora</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white"
            aria-label="Fechar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-[#ECE5DD] min-h-[120px]">
          <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[90%]">
            <p className="text-sm text-gray-800">
              Olá! 👋 Sou o Wagner, do {SITE.shortName}. Como posso ajudar você hoje?
            </p>
            <span className="text-[10px] text-gray-400 mt-1 block text-right">Agora</span>
          </div>
        </div>

        <div className="p-3 border-t border-gray-100">
          <a
            href={whatsappUrl(`Olá Wagner! Vim pelo site da ${SITE.name} e gostaria de mais informações.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 bg-[#25D366] text-white font-semibold rounded-xl text-sm hover:bg-[#1DA851] transition-colors"
          >
            Iniciar conversa
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
