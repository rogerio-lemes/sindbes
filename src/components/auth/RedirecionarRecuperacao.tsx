'use client'

import { useEffect } from 'react'

export default function RedirecionarRecuperacao() {
  useEffect(() => {
    const { pathname, hash } = window.location
    if (pathname !== '/') return

    const parametros = new URLSearchParams(hash.slice(1))
    if (parametros.get('type') !== 'recovery' || !parametros.has('access_token') || !parametros.has('refresh_token')) return

    // O provedor pode devolver o link à página inicial. Mantenha o fragmento no navegador.
    window.location.replace(`/admin/redefinir-senha${hash}`)
  }, [])

  return null
}
