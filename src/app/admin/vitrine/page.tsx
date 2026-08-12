import EmBreve from '@/components/admin/EmBreve'

export default function VitrinePage() {
  return (
    <EmBreve
      titulo="Vitrine da home"
      descricao="Slides de destaque do carrossel principal do site."
      permissao="vitrine.ver"
      previsto="O editor de slides (imagem, título, CTA, ordem e período de exibição) chega na próxima fase, junto com o upload de imagens."
    />
  )
}
