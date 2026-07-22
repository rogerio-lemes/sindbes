'use client'

import { useMemo, useState } from 'react'
import { CURRICULOS_EXEMPLO, FUNCOES, NIVEIS_EXPERIENCIA } from '@/lib/recrutamento'
import { useTenant } from '@/components/TenantProvider'
import { Search, MapPin, Award, CalendarClock, MessageCircle, Filter, X } from 'lucide-react'

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function CurriculosList() {
  const { config } = useTenant()
  const [busca, setBusca] = useState('')
  const [funcao, setFuncao] = useState('')
  const [exp, setExp] = useState('')

  const filtrados = useMemo(() => {
    return CURRICULOS_EXEMPLO.filter((c) => {
      const matchBusca = busca === '' || `${c.nome} ${c.funcao} ${c.sobre}`.toLowerCase().includes(busca.toLowerCase())
      const matchFuncao = funcao === '' || c.funcao === funcao
      const matchExp = exp === '' || c.experiencia === exp
      return matchBusca && matchFuncao && matchExp
    })
  }, [busca, funcao, exp])

  const temFiltro = busca || funcao || exp

  return (
    <>
      {/* Barra de filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-8 sticky top-24 z-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, função ou palavra-chave..."
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            />
          </div>
          <select value={funcao} onChange={(e) => setFuncao(e.target.value)} className="h-11 px-4 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm text-gray-600">
            <option value="">Todas as funções</option>
            {FUNCOES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={exp} onChange={(e) => setExp(e.target.value)} className="h-11 px-4 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm text-gray-600">
            <option value="">Qualquer experiência</option>
            {NIVEIS_EXPERIENCIA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {temFiltro && (
            <button onClick={() => { setBusca(''); setFuncao(''); setExp('') }} className="h-11 px-4 rounded-xl bg-bg-alt text-gray-600 text-sm font-medium hover:bg-gray-100 flex items-center gap-1.5">
              <X className="w-4 h-4" /> Limpar
            </button>
          )}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
          <Filter className="w-3.5 h-3.5" /> {filtrados.length} currículo(s) encontrado(s)
        </p>
      </div>

      {/* Grid de currículos */}
      {filtrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Nenhum currículo encontrado com esses filtros.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {iniciais(c.nome)}
                </div>
                <div>
                  <h3 className="font-bold text-text leading-tight">{c.nome}</h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mt-1 inline-block">{c.funcao}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{c.sobre}</p>
              <ul className="space-y-1.5 text-xs text-gray-500 mb-5">
                <li className="flex items-center gap-2"><Award className="w-3.5 h-3.5 text-secondary" /> {c.experiencia}</li>
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-secondary" /> {c.cidade}</li>
                <li className="flex items-center gap-2"><CalendarClock className="w-3.5 h-3.5 text-secondary" /> Disponibilidade: {c.disponibilidade}</li>
              </ul>
              <a
                href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Olá! Vi o currículo de ${c.nome} (${c.funcao}) no site e gostaria de mais informações.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" /> Entrar em contato
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
