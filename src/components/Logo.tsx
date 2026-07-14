interface Props {
  variant?: 'dark' | 'light'
  className?: string
}

/**
 * Logomarca SINDIBES - Beleza e Estética.
 * Recriação vetorial na identidade da marca (swoosh teal + wordmark).
 * Para usar a arte original, salve o arquivo em /public/logo.png e troque
 * este componente por <img src="/logo.png" ... />.
 */
export default function Logo({ variant = 'dark', className = '' }: Props) {
  const wordColor = variant === 'light' ? '#FFFFFF' : '#1B2444'
  const tagColor = variant === 'light' ? '#DCEFEC' : '#6E5A97'
  const lineColor = variant === 'light' ? 'rgba(255,255,255,0.5)' : '#1B2444'

  return (
    <svg viewBox="0 0 300 96" className={className} role="img" aria-label="SINDIBES - Beleza e Estética" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="swoosh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A9D9D2" />
          <stop offset="100%" stopColor="#6FBEB4" />
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
      <text x="92" y="52" fontFamily="Montserrat, sans-serif" fontSize="40" fontWeight="700" letterSpacing="2" fill={wordColor}>SINDIBES</text>
      <line x1="93" y1="63" x2="288" y2="63" stroke={lineColor} strokeWidth="1.5" />
      <text x="94" y="86" fontFamily="Montserrat, sans-serif" fontSize="21" fontWeight="500" fill={tagColor}>Beleza e Estética</text>
    </svg>
  )
}
