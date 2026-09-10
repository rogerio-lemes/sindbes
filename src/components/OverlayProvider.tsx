'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

/**
 * Controle central de quem pode aparecer flutuando na tela.
 *
 * O problema: botões, chat de atendimento, card do app, barra do celular e o
 * modal de saída disputam o mesmo canto. Ajustar z-index não resolve, porque a
 * colisão também é de posição. Aqui um único estado decide quem sai da frente,
 * e cada componente simplesmente não se renderiza quando não é a sua vez.
 *
 * Camadas em uso:
 *   30  barra de captura do celular
 *   40  botões flutuantes
 *   42  chat de atendimento
 *   45  card "Baixe nosso App"
 *   60  modal de saída
 */

export type Overlay = 'modal' | 'chat' | null

interface Ctx {
  overlay: Overlay
  /** Declara o overlay ativo. 'modal' tem prioridade sobre 'chat'. */
  ativar: (tipo: Exclude<Overlay, null>) => void
  desativar: (tipo: Exclude<Overlay, null>) => void
}

const OverlayCtx = createContext<Ctx>({ overlay: null, ativar: () => {}, desativar: () => {} })

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null)

  const ativar = useCallback((tipo: Exclude<Overlay, null>) => {
    // O modal cobre a tela toda, então nunca é substituído pelo chat
    setOverlay((atual) => (atual === 'modal' && tipo !== 'modal' ? atual : tipo))
  }, [])

  const desativar = useCallback((tipo: Exclude<Overlay, null>) => {
    setOverlay((atual) => (atual === tipo ? null : atual))
  }, [])

  return (
    <OverlayCtx.Provider value={{ overlay, ativar, desativar }}>
      {children}
    </OverlayCtx.Provider>
  )
}

export function useOverlay() {
  return useContext(OverlayCtx)
}

/**
 * Declara um overlay enquanto `ativo` for verdadeiro, liberando ao desmontar.
 */
export function useDeclararOverlay(tipo: Exclude<Overlay, null>, ativo: boolean) {
  const { ativar, desativar } = useOverlay()
  useEffect(() => {
    if (ativo) ativar(tipo)
    else desativar(tipo)
    return () => desativar(tipo)
  }, [ativo, tipo, ativar, desativar])
}

/** True quando o componente deve sair da frente. */
export function useDeveSumir(quando: { modal?: boolean; chat?: boolean }) {
  const { overlay } = useOverlay()
  if (overlay === 'modal') return quando.modal ?? false
  if (overlay === 'chat') return quando.chat ?? false
  return false
}
