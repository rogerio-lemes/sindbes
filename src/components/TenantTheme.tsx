// Componente server que injeta as cores do tenant como CSS vars
// Sobrescreve os defaults do @theme do Tailwind v4

import type { TenantConfig } from '@/lib/tenant/types'

export default function TenantTheme({ config }: { config: TenantConfig }) {
  // Só injeta o <style> se alguma cor for diferente dos defaults
  const css = `:root {
  --color-primary: ${config.cor_primaria};
  --color-primary-dark: ${config.cor_primaria_dark};
  --color-secondary: ${config.cor_secundaria};
  --color-secondary-dark: ${config.cor_secundaria_dark};
  --color-accent: ${config.cor_accent};
  --color-text: ${config.cor_text};
  --color-bg-alt: ${config.cor_bg_alt};
}`

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
