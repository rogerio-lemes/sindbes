'use client'

export interface Coluna<T> {
  header: string
  cell: (row: T) => React.ReactNode
  /** Alinha à direita (útil para ações e valores) */
  align?: 'left' | 'right'
}

export default function DataTable<T>({
  colunas, dados, vazio, rowKey,
}: {
  colunas: Coluna<T>[]
  dados: T[]
  vazio: string
  rowKey: (row: T, i: number) => string
}) {
  return (
    <div className="overflow-x-auto -mx-5 -mb-5">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {colunas.map((c) => (
              <th
                key={c.header}
                className={`px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                  c.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {dados.map((row, i) => (
            <tr key={rowKey(row, i)} className="hover:bg-gray-50">
              {colunas.map((c) => (
                <td
                  key={c.header}
                  className={`px-5 py-4 text-sm ${c.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
          {dados.length === 0 && (
            <tr>
              <td colSpan={colunas.length} className="px-5 py-12 text-center text-gray-400 text-sm">
                {vazio}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function WhatsappLink({ telefone }: { telefone: string | null | undefined }) {
  if (!telefone) return <span className="text-gray-400">—</span>
  return (
    <a
      href={`https://wa.me/55${telefone.replace(/\D/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {telefone}
    </a>
  )
}

export function DataBr({ valor }: { valor: string | null | undefined }) {
  if (!valor) return <span className="text-gray-400">—</span>
  return <span className="text-gray-400">{new Date(valor).toLocaleDateString('pt-BR')}</span>
}
