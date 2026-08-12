'use client'

import { Construction } from 'lucide-react'
import { PageHeader, Card, PermissionGuard } from './ui'

/** Placeholder das seções cujo CRUD será entregue nas próximas fases. */
export default function EmBreve({
  titulo, descricao, permissao, previsto,
}: {
  titulo: string
  descricao: string
  permissao: string
  previsto: string
}) {
  return (
    <PermissionGuard permissao={permissao}>
      <PageHeader titulo={titulo} descricao={descricao} />
      <Card>
        <div className="text-center py-12">
          <Construction className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <p className="font-bold text-gray-800">Em construção</p>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">{previsto}</p>
        </div>
      </Card>
    </PermissionGuard>
  )
}
