import { CopyButton, OpenButton } from './CopyButton'

/**
 * Linha de link: rótulo, URL clicável, botão de abrir e botão de copiar.
 * Usada em todos os pontos do material onde há um endereço para acessar/enviar.
 */
export default function LinkRow({
  rotulo, url, cor = 'primary',
}: {
  rotulo: string
  url: string
  cor?: 'primary' | 'secondary'
}) {
  const texto = cor === 'secondary' ? 'text-secondary' : 'text-primary'

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-gray-200 bg-gray-50">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 shrink-0">
        {rotulo}
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-mono text-[13px] ${texto} hover:underline break-all flex-1 min-w-[14rem]`}
      >
        {url}
      </a>
      <div className="flex items-center gap-2 shrink-0">
        <OpenButton href={url} cor={cor} />
        <CopyButton texto={url} rotulo="Copiar link" cor={cor} />
      </div>
    </div>
  )
}
