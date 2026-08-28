'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, ListFilter, type LucideIcon } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  icon: LucideIcon
  color?: 'primary' | 'secondary'
}

interface Props {
  options: SelectOption[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  /** ícone decorativo à esquerda do trigger (ex: Briefcase, Award) */
  triggerIcon?: LucideIcon
  className?: string
  /** 'sm' = compacto, sem altura fixa, para uso inline (ex: seletor de rede social) */
  size?: 'default' | 'sm'
  /** Quando definido, adiciona um item "limpar" no topo da lista com esse label */
  clearLabel?: string
}

export default function CustomSelect({
  options, value, onChange, placeholder = 'Selecione...', required,
  triggerIcon: TriggerIcon, className = '', size = 'default', clearLabel,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)
  const isSmall = size === 'sm'

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onScroll() { setOpen(false) }
    document.addEventListener('mousedown', onOut)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => {
      document.removeEventListener('mousedown', onOut)
      window.removeEventListener('scroll', onScroll, { capture: true })
    }
  }, [])

  const SelectedIcon = selected?.icon
  const selectedColor = selected?.color ?? 'primary'

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* campo oculto p/ validação nativa */}
      <input type="hidden" value={value} required={required} />

      {/* ── trigger ── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={[
          'w-full rounded-xl border text-sm text-left flex items-center gap-2 transition-colors',
          isSmall
            ? 'h-10 px-3'
            : TriggerIcon ? 'h-12 pl-11 pr-10' : 'h-12 pl-4 pr-10',
          open
            ? 'border-primary ring-1 ring-primary bg-primary/5'
            : 'border-gray-200 bg-white hover:border-primary/50',
          !selected ? 'text-gray-400' : 'text-text',
        ].join(' ')}
      >
        {/* ícone de campo (ex: Briefcase) — apenas no tamanho default */}
        {!isSmall && TriggerIcon && (
          <TriggerIcon className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
        )}

        {/* ícone da opção selecionada — mostrado no trigger do modo sm */}
        {isSmall && SelectedIcon && (
          <span className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0
            ${selectedColor === 'secondary' ? 'bg-secondary/10' : 'bg-primary/10'}`}>
            <SelectedIcon className={`w-3.5 h-3.5 ${selectedColor === 'secondary' ? 'text-secondary' : 'text-primary'}`} />
          </span>
        )}

        <span className="truncate flex-1">{selected ? selected.label : placeholder}</span>

        <ChevronDown className={[
          'w-4 h-4 text-secondary transition-transform flex-shrink-0',
          isSmall ? '' : 'absolute right-3',
          open ? 'rotate-180' : '',
        ].join(' ')} />
      </button>

      {/* ── dropdown ── */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-max bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 max-h-72 overflow-y-auto">
          {/* opção "limpar" opcional */}
          {clearLabel && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left mx-2',
                'w-[calc(100%-1rem)]',
                value === ''
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-500 hover:bg-bg-alt hover:text-primary',
              ].join(' ')}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${value === '' ? 'bg-primary/20' : 'bg-gray-100'}`}>
                <ListFilter className={`w-4 h-4 ${value === '' ? 'text-primary' : 'text-gray-400'}`} />
              </span>
              <span className="leading-snug">{clearLabel}</span>
              {value === '' && <Check className="w-3.5 h-3.5 text-primary ml-auto flex-shrink-0" />}
            </button>
          )}
          {options.map(opt => {
            const Icon = opt.icon
            const isSel = opt.value === value
            const color = opt.color ?? 'primary'
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left mx-2',
                  'w-[calc(100%-1rem)]',
                  isSel
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-text hover:bg-bg-alt hover:text-primary',
                ].join(' ')}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${color === 'secondary'
                    ? isSel ? 'bg-secondary/20' : 'bg-secondary/10'
                    : isSel ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                  <Icon className={`w-4 h-4 ${color === 'secondary' ? 'text-secondary' : 'text-primary'}`} />
                </span>
                <span className="leading-snug">{opt.label}</span>
                {isSel && <Check className="w-3.5 h-3.5 text-primary ml-auto flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
