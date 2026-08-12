import EmBreve from '@/components/admin/EmBreve'

export default function ParceirosPage() {
  return (
    <EmBreve
      titulo="Parceiros"
      descricao="Empresas parceiras que oferecem benefícios aos associados."
      permissao="parceiros.ver"
      previsto="O cadastro de parceiros com descrição em parágrafos, lista de serviços e benefício ao associado chega na fase seguinte."
    />
  )
}
