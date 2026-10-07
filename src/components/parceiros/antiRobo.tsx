'use client'

import { useRef, useState } from 'react'

/**
 * Proteção invisível contra robôs nos formulários de cadastro.
 * - Armadilha: campo fora da tela que pessoas não veem nem preenchem; robôs preenchem.
 * - Tempo: envia quantos milissegundos a pessoa ficou no formulário; robô envia na hora.
 * A rota de cadastro descarta em silêncio o que cair em uma das duas.
 */
export function useAntiRobo() {
  const [abertoEm] = useState(() => Date.now())
  const armadilha = useRef<HTMLInputElement>(null)

  const campo = (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
    >
      <label>
        Não preencha este campo
        <input ref={armadilha} type="text" name="website_confirmacao" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )

  const anexar = (fd: FormData) => {
    fd.append('_hp', armadilha.current?.value ?? '')
    fd.append('_t', String(Date.now() - abertoEm))
  }

  return { campo, anexar }
}
