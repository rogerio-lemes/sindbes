import EmBreve from '@/components/admin/EmBreve'

export default function BannersPage() {
  return (
    <EmBreve
      titulo="Banners de anunciantes"
      descricao="Espaços publicitários vendidos a anunciantes, começando pelo blog."
      permissao="banners.ver"
      previsto="O cadastro de banners (anunciante, período do contrato, posição, imagem e link) chega na próxima fase."
    />
  )
}
