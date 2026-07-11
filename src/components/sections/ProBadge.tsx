'use client'

import { Shield, Star, Award } from 'lucide-react'

interface Props {
  type?: 'associado' | 'exclusivo' | 'certificado'
  text?: string
}

const badges = {
  associado: { icon: Shield, label: 'Benefício para associados', color: 'bg-primary' },
  exclusivo: { icon: Star, label: 'Condições exclusivas', color: 'bg-secondary' },
  certificado: { icon: Award, label: 'Certificação reconhecida', color: 'bg-primary' },
}

export default function ProBadge({ type = 'associado', text }: Props) {
  const badge = badges[type]
  const Icon = badge.icon

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 ${badge.color} text-white text-xs font-semibold rounded-full animate-badge-pulse`}>
      <Icon className="w-4 h-4" />
      <span>{text || badge.label}</span>

      <style jsx>{`
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139, 26, 74, 0.3); }
          50% { box-shadow: 0 0 0 6px rgba(139, 26, 74, 0); }
        }
        .animate-badge-pulse {
          animation: badgePulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
