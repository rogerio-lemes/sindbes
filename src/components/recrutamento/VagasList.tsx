'use client'

import { useMemo, useState } from 'react'
import { VAGAS_EXEMPLO, FUNCOES, TIPOS_CONTRATO } from '@/lib/recrutamento'
import { SITE } from '@/lib/constants'
import { Search, MapPin, DollarSign, Briefcase, Store, Clock, MessageCircle, Filter, X } from 'lucide-react'

export default function VagasList() {
  const [busca, setBusca] = useState('')
  const [funcao, setFuncao] = useState('')
  const [tipo, setTipo] = useState('')

  const filtradas = useMemo(() => {
    return VAGAS_EXEMPLO.filter((v) => {
      const matchBusca = busca === '' || `${v.titulo} ${v.funcao} ${v.empresa} ${v.descricao}`.toLowerCase().includes(busca.toLowerCase())
      const matchFuncao = funcao === '' || v.funcao === funcao
      const matchTipo = tipo === '' || v.tipo === tipo
      return matchBusca && matchFuncao && matchTipo
    })
  }, [busca, funcao, tipo])

  const temFiltro = busca || funcao || tipo

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-8 sticky top-24 z-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar vaga por cargo, empresa ou palavra-chave..."
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            />
          </div>
          <select value={funcao} onChange={(e) => setFuncao(e.target.value)} className="h-11 px-4 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm text-gray-600">
            <option value="">Todas as funções</option>
            {FUNCOES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="h-11 px-4 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm text-gray-600">
            <option value="">Qualquer contrato</option>
            {TIPOS_CONTRATO.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {temFiltro && (
            <button onClick={() => { setBusca(''); setFuncao(''); setTipo('') }} className="h-11 px-4 rounded-xl bg-bg-alt text-gray-600 text-sm font-medium hover:bg-gray-100 flex items-center gap-1.5">
              <X className="w-4 h-4" /> Limpar
            </button>
          )}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
          <Filter className="w-3.5 h-3.5" /> {filtradas.length} vaga(s) encontrada(s)
        </p>
      </div>

      {filtradas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Nenhuma vaga encontrada com esses filtros.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtradas.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">{v.funcao}</span>
                  <h3 className="font-bold text-lg text-text mt-2 leading-tight">{v.titulo}</h3>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-gray-400 whitespace-nowrap"><Clock className="w-3 h-3" /> {v.publicada}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{v.descricao}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-5">
                <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-secondary" /> {v.empresa}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-secondary" /> {v.tipo}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-secondary" /> {v.local}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-secondary" /> {v.salario}</span>
              </div>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse na vaga "${v.titulo}" (${v.empresa}) divulgada no site do Sindbes.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" /> Candidatar-se
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
