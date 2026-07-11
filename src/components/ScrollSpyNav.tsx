'use client'

import { useState, useEffect } from 'react'

interface Section {
  id: string
  label: string
}

interface Props {
  sections: Section[]
}

export default function ScrollSpyNav({ sections }: Props) {
  const [activeId, setActiveId] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400)

      const scrollPos = window.scrollY + 200
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id)
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(sections[i].id)
          return
        }
      }
      setActiveId('')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sections])

  if (!visible || sections.length === 0) return null

  return (
    <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-2.5">
      {sections.map((s) => {
        const active = activeId === s.id
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center gap-2.5"
            title={s.label}
          >
            <span
              className={`block rounded-full transition-all duration-200 shrink-0 ${
                active
                  ? 'w-3.5 h-3.5 bg-primary ring-4 ring-primary/20'
                  : 'w-2.5 h-2.5 bg-primary/25 group-hover:bg-primary/60'
              }`}
            />
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-primary text-white shadow-md transition-all duration-200 ${
                active
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {s.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
