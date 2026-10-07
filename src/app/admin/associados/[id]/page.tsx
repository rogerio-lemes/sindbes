'use client'

import { useParams } from 'next/navigation'
import RevisaoCadastro from '@/components/admin/cadastros/RevisaoCadastro'

/** Revisão de um cadastro de associado: editar, pré-visualizar e publicar. */
export default function RevisaoAssociadoPage() {
  const { id } = useParams<{ id: string }>()
  return <RevisaoCadastro key={id} tipo="associado" id={id} />
}
