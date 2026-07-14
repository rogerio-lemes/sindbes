'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { whatsappUrl } from '@/lib/constants'

interface Props {
  items: { q: string; a: string }[]
  serviceName: string
}

export default function ServiceFaq({ items, serviceName }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <div
            key={i}
            className={`rounded-xl overflow-hidden transition-all duration-300 ${open ? 'gradient-primary shadow-lg' : 'bg-white shadow-sm'}`}
          >
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className={`font-semibold text-sm pr-4 ${open ? 'text-white' : 'text-text'}`}>{item.q}</span>
              <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open ? 'rotate-180 text-white' : 'text-gray-400'}`} />
            </button>
            {open && (
              <div className="px-5 pb-5">
                <p className="text-sm text-white/90 leading-relaxed mb-3">{item.a}</p>
                <a
                  href={whatsappUrl(`Olá! Tenho uma dúvida sobre ${serviceName}: ${item.q}. 📍 Origem: ${serviceName}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-xs font-semibold text-white hover:text-white/80 underline underline-offset-2"
                >
                  Ainda tem dúvida? Fale conosco →
                </a>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
