'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollRevealProvider() {
  const pathname = usePathname()

  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-reveal')
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '50px' }
    )

    elements.forEach((el) => observer.observe(el))

    const fallback = setTimeout(() => {
      document.querySelectorAll('.scroll-reveal:not(.visible)').forEach((el) => {
        el.classList.add('visible')
      })
    }, 800)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [pathname])

  return null
}
