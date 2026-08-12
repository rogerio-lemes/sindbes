import { Metadata } from 'next'
import Link from 'next/link'
import LinkRow from '@/components/material/LinkRow'
import MessageBlock from '@/components/material/MessageBlock'
import { OpenButton } from '@/components/material/CopyButton'
import {
  LINKS, ANATOMIA,
  PARCEIRO_GANHA, PARCEIRO_CAMPOS, MSG_PARCEIRO_WHATSAPP, MSG_PARCEIRO_EMAIL,
  ASSOCIADO_GANHA, ASSOCIADO_CAMPOS, MSG_ASSOCIADO_WHATSAPP, MSG_ASSOCIADO_EMAIL,
} from '@/lib/material/parceiros-copy'
import { Handshake, UserCheck, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Material de captação — Parceiros e Associados | Sindibes',
  robots: 'noindex, nofollow',
}

export default function MaterialParceirosPage() {
  return (
    <div className="max-w-[880px] mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col gap-14">

      {/* ── Cabeçalho ── */}
      <header className="flex flex-col gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <Lock className="w-3.5 h-3.5" /> Material interno · Sindibes
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-text leading-tight text-balance">
          Página de Parceiros e os dois formulários de cadastro
        </h1>
        <div className="h-1 w-20 rounded-full bg-gradient-to-r from-primary via-primary to-secondary" />
        <p className="text-gray-500 leading-relaxed max-w-[42rem]">
          Um resumo do que a página de parceiros mostra e, abaixo, duas mensagens prontas — uma para
          empresas que querem virar parceiras, outra para profissionais que querem se associar.
          Cada uma com seu link próprio, pronta para copiar e enviar.
        </p>
      </header>

      {/* ── A página ── */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">A página</span>
          <h2 className="text-xl md:text-2xl font-bold text-text">
            O que o visitante encontra em /parceiros
          </h2>
          <p className="text-sm text-gray-400">Na ordem em que aparece, de cima para baixo.</p>
        </div>

        <ol className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {ANATOMIA.map((item, i) => (
            <li
              key={item.titulo}
              className="grid grid-cols-[2.5rem_1fr] gap-x-3 px-5 py-4 border-t border-gray-50 first:border-t-0"
            >
              <span className="font-mono text-xs font-bold text-primary tabular-nums pt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-semibold text-text text-[15px]">{item.titulo}</span>
              <span className="col-start-2 text-sm text-gray-500 leading-relaxed mt-0.5">
                {item.texto}
              </span>
            </li>
          ))}
        </ol>

        <LinkRow rotulo="Ver a página" url={LINKS.parceiros} />
      </section>

      {/* ── Formulário 1: Parceiro ── */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Formulário 1</span>
          <h2 className="text-xl md:text-2xl font-bold text-text">Quero ser Parceiro</h2>
        </div>

        <div className="rounded-2xl border border-gray-100 border-t-4 border-t-primary bg-white shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-5 bg-primary/[0.07] border-b border-gray-100 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
              <Handshake className="w-3.5 h-3.5" /> Para empresas e fornecedores
            </span>
            <p className="text-sm text-gray-500">
              Empresa que quer oferecer desconto aos associados e ganhar uma página na vitrine do site.
            </p>
          </div>

          <div className="px-5 sm:px-6 py-6 flex flex-col gap-6">
            <LinkRow rotulo="Link" url={LINKS.formParceiro} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-primary text-[15px] mb-2.5">O que a empresa ganha</h3>
                <ul className="flex flex-col gap-1.5">
                  {PARCEIRO_GANHA.map((b) => (
                    <li key={b} className="text-sm text-gray-500 pl-4 relative leading-relaxed">
                      <span className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full bg-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-primary text-[15px] mb-2.5">O que vai precisar preencher</h3>
                <ul className="flex flex-col gap-1.5">
                  {PARCEIRO_CAMPOS.map((c) => (
                    <li key={c.campo} className="text-sm text-gray-500 pl-4 relative leading-relaxed">
                      <span className="absolute left-0 top-0 text-gray-300 text-xs">▸</span>
                      <b className="text-text font-semibold">{c.campo}</b>
                      {c.detalhe && ` — ${c.detalhe}`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <MessageBlock
              rotulo="Mensagem para WhatsApp"
              texto={MSG_PARCEIRO_WHATSAPP}
              linkPrincipal={LINKS.formParceiro}
            />
            <MessageBlock
              rotulo="Mensagem para e-mail"
              texto={MSG_PARCEIRO_EMAIL}
              linkPrincipal={LINKS.formParceiro}
            />
          </div>
        </div>
      </section>

      {/* ── Formulário 2: Associado ── */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Formulário 2</span>
          <h2 className="text-xl md:text-2xl font-bold text-text">Quero ser Associado</h2>
        </div>

        <div className="rounded-2xl border border-gray-100 border-t-4 border-t-secondary bg-white shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-5 bg-secondary/[0.07] border-b border-gray-100 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-secondary">
              <UserCheck className="w-3.5 h-3.5" /> Para profissionais e estabelecimentos
            </span>
            <p className="text-sm text-gray-500">
              Quem trabalha no setor e quer acessar os benefícios negociados pelo sindicato.
            </p>
          </div>

          <div className="px-5 sm:px-6 py-6 flex flex-col gap-6">
            <LinkRow rotulo="Link" url={LINKS.formAssociado} cor="secondary" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-secondary text-[15px] mb-2.5">O que o associado ganha</h3>
                <ul className="flex flex-col gap-1.5">
                  {ASSOCIADO_GANHA.map((b) => (
                    <li key={b} className="text-sm text-gray-500 pl-4 relative leading-relaxed">
                      <span className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full bg-secondary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-secondary text-[15px] mb-2.5">O que vai precisar preencher</h3>
                <ul className="flex flex-col gap-1.5">
                  {ASSOCIADO_CAMPOS.map((c) => (
                    <li key={c.campo} className="text-sm text-gray-500 pl-4 relative leading-relaxed">
                      <span className="absolute left-0 top-0 text-gray-300 text-xs">▸</span>
                      <b className="text-text font-semibold">{c.campo}</b>
                      {c.detalhe && ` — ${c.detalhe}`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <MessageBlock
              rotulo="Mensagem para WhatsApp"
              texto={MSG_ASSOCIADO_WHATSAPP}
              cor="secondary"
              linkPrincipal={LINKS.formAssociado}
            />
            <MessageBlock
              rotulo="Mensagem para e-mail"
              texto={MSG_ASSOCIADO_EMAIL}
              cor="secondary"
              linkPrincipal={LINKS.formAssociado}
            />
          </div>
        </div>
      </section>

      {/* ── Acesso rápido ── */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Acesso rápido</span>
          <h2 className="text-xl md:text-2xl font-bold text-text">Abrir as páginas</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <OpenButton href={LINKS.parceiros} rotulo="Página de parceiros" />
          <OpenButton href={LINKS.formParceiro} rotulo="Formulário de parceiro" />
          <OpenButton href={LINKS.formAssociado} rotulo="Formulário de associado" cor="secondary" />
        </div>
      </section>

      {/* ── Observações ── */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Antes de enviar</span>
          <h2 className="text-xl md:text-2xl font-bold text-text">Três observações rápidas</h2>
        </div>
        <div className="border-l-[3px] border-gray-200 pl-4 flex flex-col gap-2.5 text-sm text-gray-500 leading-relaxed">
          <p>
            <b className="text-text font-semibold">Troque o que está entre colchetes.</b>{' '}
            Os campos <code className="font-mono text-[12.5px] text-primary">[SEU NOME]</code> e{' '}
            <code className="font-mono text-[12.5px] text-primary">[NOME DA EMPRESA]</code> existem
            para você personalizar antes de enviar.
          </p>
          <p>
            <b className="text-text font-semibold">Cada link é independente.</b>{' '}
            Mande o link de parceiro para empresas e o de associado para profissionais — cada
            formulário pede informações diferentes.
          </p>
          <p>
            <b className="text-text font-semibold">Se o site ganhar domínio próprio,</b>{' '}
            basta atualizar o endereço em{' '}
            <code className="font-mono text-[12.5px] text-primary">src/lib/material/parceiros-copy.ts</code>{' '}
            e as mensagens se ajustam sozinhas.
          </p>
        </div>
      </section>

      <footer className="border-t border-gray-200 pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
        <span>Sindibes — material de apoio para captação de parceiros e associados</span>
        <Link href="/" className="text-primary hover:underline font-medium">
          Ir para o site
        </Link>
      </footer>

    </div>
  )
}
