import { Fragment } from 'react'
import { CopyButton, OpenButton } from './CopyButton'

const URL_SPLIT = /(https?:\/\/[^\s]+)/g

/** Transforma URLs do texto em links clicáveis, preservando o resto intacto. */
function comLinks(texto: string, cor: 'primary' | 'secondary') {
  const classe = cor === 'secondary' ? 'text-secondary' : 'text-primary'

  // startsWith em vez de regex.test: regex global guarda lastIndex entre chamadas
  return texto.split(URL_SPLIT).map((parte, i) =>
    parte.startsWith('http') ? (
      <a
        key={i}
        href={parte}
        target="_blank"
        rel="noopener noreferrer"
        className={`${classe} underline decoration-1 underline-offset-2 hover:opacity-80 break-all`}
      >
        {parte}
      </a>
    ) : (
      <Fragment key={i}>{parte}</Fragment>
    ),
  )
}

/**
 * Mensagem pronta para envio: cabeçalho com ações e corpo monoespaçado.
 * O texto é copiado exatamente como está; os links ficam clicáveis na tela.
 */
export default function MessageBlock({
  rotulo, texto, cor = 'primary', linkPrincipal,
}: {
  rotulo: string
  texto: string
  cor?: 'primary' | 'secondary'
  /** Link que a mensagem divulga — ganha botão de abrir no cabeçalho. */
  linkPrincipal?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-t-xl border border-gray-200 border-b-0 bg-white">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          {rotulo}
        </span>
        <div className="flex items-center gap-2">
          {linkPrincipal && <OpenButton href={linkPrincipal} rotulo="Abrir link" cor={cor} />}
          <CopyButton texto={texto} rotulo="Copiar mensagem" cor={cor} />
        </div>
      </div>
      <pre className="m-0 px-4 py-4 rounded-b-xl border border-gray-200 bg-gray-50 font-mono text-[12.5px] leading-[1.75] text-text whitespace-pre-wrap break-words overflow-x-auto">
        {comLinks(texto, cor)}
      </pre>
    </div>
  )
}
