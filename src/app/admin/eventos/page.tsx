import EmBreve from '@/components/admin/EmBreve'

export default function EventosPage() {
  return (
    <EmBreve
      titulo="Eventos"
      descricao="Agenda de eventos, cursos e encontros do sindicato."
      permissao="eventos.ver"
      previsto="O cadastro de eventos com data, local, galeria de fotos e controle de inscrições chega na fase seguinte."
    />
  )
}
