import Image from 'next/image'

interface Props {
  variant?: 'dark' | 'light'
  className?: string
  // Dados do tenant (logo dinâmico)
  logoUrl?: string | null
  nome?: string
  tagline?: string | null
}

/**
 * Logomarca dinâmica por tenant.
 * Se o tenant tiver logo_url (imagem no Storage), renderiza <img>.
 * Senão, gera um wordmark SVG a partir do nome + tagline do tenant.
 * Fallback padrão: "SINDIBES" + "Beleza e Estética" (compatibilidade).
 */
export default function Logo({
  variant = 'dark',
  className = '',
  logoUrl,
  nome,
  tagline,
}: Props) {
  // Se o tenant tem logo (imagem), usa
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={nome || 'Logo'}
        width={200}
        height={64}
        className={className}
        priority
        unoptimized
      />
    )
  }

  // Fallback: wordmark SVG gerado a partir do nome do tenant
  // Se o nome contém " - ", usa só a parte antes como wordmark principal
  const rawName = nome || 'SINDIBES'
  const [shortName, nameSuffix] = rawName.includes(' - ')
    ? rawName.split(' - ', 2)
    : [rawName, null]
  const displayName = shortName
  const displayTagline = tagline || nameSuffix || 'Beleza e Estética'
  const wordColor = variant === 'light' ? '#FFFFFF' : 'var(--color-text, #1B2444)'
  const tagColor = variant === 'light' ? 'var(--color-accent, #DCEFEC)' : 'var(--color-secondary, #6E5A97)'
  const lineColor = variant === 'light' ? 'rgba(255,255,255,0.5)' : 'var(--color-text, #1B2444)'

  // Calcular largura com base no maior entre nome e tagline
  const nameWidth = 92 + displayName.length * 27
  const taglineWidth = 94 + displayTagline.length * 13
  const svgWidth = Math.max(340, nameWidth, taglineWidth)

  return (
    <svg viewBox={`0 0 ${svgWidth} 96`} className={className} role="img" aria-label={`${displayName} - ${displayTagline}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="swoosh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent, #A9D9D2)" />
          <stop offset="100%" stopColor="var(--color-primary, #6FBEB4)" />
        </linearGradient>
      </defs>

      {/* Swoosh em S */}
      <path
        d="M64 14 C 24 12, 18 40, 48 46 C 78 52, 74 78, 30 82"
        fill="none"
        stroke="url(#swoosh)"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M34 74 C 46 72, 56 66, 62 58"
        fill="none"
        stroke="url(#swoosh)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M36 82 C 50 80, 62 73, 70 63"
        fill="none"
        stroke="url(#swoosh)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Wordmark */}
      <text x="92" y="52" fontFamily="Montserrat, sans-serif" fontSize="40" fontWeight="700" letterSpacing="2" fill={wordColor}>
        {displayName.toUpperCase()}
      </text>
      <line x1="93" y1="63" x2={svgWidth - 12} y2="63" stroke={lineColor} strokeWidth="1.5" />
      <text x="94" y="86" fontFamily="Montserrat, sans-serif" fontSize="21" fontWeight="500" fill={tagColor}>
        {displayTagline}
      </text>
    </svg>
  )
}
