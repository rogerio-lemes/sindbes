import { Eye } from 'lucide-react'

/** Faixa exibida no topo das páginas em modo de pré-visualização (painel admin). */
export default function FaixaPrevia() {
  return (
    <div role="status" className="bg-amber-400 text-amber-950 border-b-2 border-amber-500">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-center gap-2 text-sm font-bold text-center">
        <Eye className="w-5 h-5 shrink-0" />
        Pré-visualização: esta página ainda não está publicada no site
      </div>
    </div>
  )
}
