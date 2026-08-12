import EmBreve from '@/components/admin/EmBreve'

export default function DiretoriaPage() {
  return (
    <EmBreve
      titulo="Diretoria"
      descricao="Membros da diretoria exibidos na página institucional."
      permissao="diretoria.ver"
      previsto="O cadastro de membros (cargo, foto, grupo e ordem de exibição) chega na fase seguinte."
    />
  )
}
