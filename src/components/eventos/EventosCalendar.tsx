'use client'

import { useState } from 'react'
import { EVENTOS } from '@/lib/eventos'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

const MESES_LONGOS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

// Mapa 'YYYY-MM-DD' -> eventos
const eventosPorData: Record<string, typeof EVENTOS> = {}
EVENTOS.forEach((e) => {
  if (!eventosPorData[e.data]) eventosPorData[e.data] = []
  eventosPorData[e.data].push(e)
})

// Mês inicial = primeiro evento futuro (ou o primeiro da lista)
const primeiroFuturo = EVENTOS.find((e) => e.futuro) || EVENTOS[0]
const [iy, im] = primeiroFuturo.data.split('-').map(Number)

export default function EventosCalendar() {
  const [ano, setAno] = useState(iy)
  const [mes, setMes] = useState(im) // 1-12

  const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay()
  const diasNoMes = new Date(ano, mes, 0).getDate()

  const celulas: (number | null)[] = []
  for (let i = 0; i < primeiroDiaSemana; i++) celulas.push(null)
  for (let d = 1; d <= diasNoMes; d++) celulas.push(d)

  function navegar(delta: number) {
    let novoMes = mes + delta
    let novoAno = ano
    if (novoMes > 12) { novoMes = 1; novoAno++ }
    if (novoMes < 1) { novoMes = 12; novoAno-- }
    setMes(novoMes)
    setAno(novoAno)
  }

  function chave(d: number) {
    return `${ano}-${String(mes).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">{MESES_LONGOS[mes - 1]} {ano}</h3>
        </div>
        <div className="flex gap-1">
          <button onClick={() => navegar(-1)} className="w-9 h-9 rounded-lg bg-bg-alt hover:bg-primary hover:text-white text-gray-500 flex items-center justify-center transition-colors" aria-label="Mês anterior">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => navegar(1)} className="w-9 h-9 rounded-lg bg-bg-alt hover:bg-primary hover:text-white text-gray-500 flex items-center justify-center transition-colors" aria-label="Próximo mês">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DIAS.map((d, i) => (
          <div key={i} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celulas.map((d, i) => {
          if (d === null) return <div key={i} />
          const evs = eventosPorData[chave(d)]
          const temEvento = !!evs
          const futuro = temEvento && evs.some((e) => e.futuro)
          if (temEvento) {
            return (
              <a
                key={i}
                href={`#ev-${evs[0].slug}`}
                title={evs.map((e) => e.titulo).join(' · ')}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-transform hover:scale-105 ${futuro ? 'gradient-primary text-white shadow-md' : 'bg-secondary/20 text-secondary'}`}
              >
                {d}
              </a>
            )
          }
          return (
            <div key={i} className="aspect-square rounded-lg flex items-center justify-center text-sm text-gray-500">
              {d}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-5 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-500">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded gradient-primary" /> Evento futuro</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-secondary/30" /> Evento realizado</span>
      </div>
    </div>
  )
}
