'use client'

import { useParams } from 'next/navigation'
import RevisaoCadastro from '@/components/admin/cadastros/RevisaoCadastro'

/** Revisão de um cadastro de parceiro: editar, pré-visualizar e publicar. */
export default function RevisaoParceiroPage() {
  const { id } = useParams<{ id: string }>()
  return <RevisaoCadastro key={id} tipo="parceiro" id={id} />
}
