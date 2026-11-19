/**
 * Slide especial da vitrine da Home: alerta da Lei Salão-Parceiro.
 *
 * Fica fixo em código (não depende dos slides do painel) porque tem layout
 * próprio de alerta: selo "Atenção", título forte, cartão com os 3 riscos e
 * dois botões (página interna e WhatsApp do Wagner com mensagem pronta).
 */
import Link from 'next/link'
import { AlertTriangle, ArrowRight, Gavel, Landmark, Scale, MessageCircle, ShieldCheck } from 'lucide-react'

export const ID_SLIDE_LEI = 'lei-salao-parceiro'
export const IMAGEM_SLIDE_LEI = '/images/lei-salao-parceiro/hero.jpg'

const WAGNER_WHATS = '5534984274161'
const MSG = 'Olá, Wagner! Vi o alerta da Lei Salão-Parceiro no site do Sindibes e quero saber se o meu salão está regularizado.'
const LINK_WHATS = `https://wa.me/${WAGNER_WHATS}?text=${encodeURIComponent(MSG)}`

const RISCOS = [
  { icone: Gavel, texto: 'Ação trabalhista com férias, 13º e FGTS retroativos' },
  { icone: Landmark, texto: 'Autuação fiscal e previdenciária com juros' },
  { icone: Scale, texto: 'Multa por profissional sem contrato homologado' },
]

export default function VitrineLeiSalaoParceiro() {
  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-center w-full">
      <div className="max-w-2xl">
        {/* h1 da Home continua sendo o nome do site para o Google */}
        <h1 className="sr-only">Sindibes - Sindicato da Beleza de Uberlândia</h1>

        <span className="inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-red-600 text-white text-xs md:text-sm font-bold uppercase tracking-widest shadow-lg shadow-red-900/40">
          <span className="relative flex w-6 h-6 items-center justify-center rounded-full bg-white/20">
            <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
            <AlertTriangle className="relative w-3.5 h-3.5" />
          </span>
          Atenção, dono de salão
        </span>

        <h2 className="text-[2rem] leading-[1.1] md:text-5xl lg:text-6xl font-bold text-white mt-5">
          Seu salão está <span className="text-[#FFC94D]">regularizado</span> na Lei Salão-Parceiro?
        </h2>

        <p className="text-base md:text-lg text-white/90 mt-5 leading-relaxed">
          Profissional sem contrato homologado, inclusive parente, pode virar <strong className="text-white">ação
          trabalhista</strong>. A Lei 13.352/2016 não é opcional, e o Sindibes regulariza com você em poucos dias.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/lei-salao-parceiro"
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#FFC94D] text-[#1B2444] font-bold text-base shadow-xl shadow-black/30 hover:bg-[#FFD872] transition"
          >
            Entenda a lei e os riscos
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={LINK_WHATS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#25D366] text-white font-bold text-base shadow-xl shadow-black/30 hover:bg-[#1FB959] transition"
          >
            <MessageCircle className="w-5 h-5" /> Falar com o Wagner
          </a>
        </div>
      </div>

      {/* Cartão de riscos (computador) */}
      <div className="hidden lg:block rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFC94D]">
          <AlertTriangle className="w-4 h-4" /> O que está em jogo
        </p>
        <ul className="mt-4 space-y-3">
          {RISCOS.map((r) => (
            <li key={r.texto} className="flex items-start gap-3 rounded-2xl bg-black/25 p-3.5">
              <span className="w-9 h-9 rounded-xl bg-red-500/25 flex items-center justify-center shrink-0">
                <r.icone className="w-4.5 h-4.5 text-red-300" />
              </span>
              <span className="text-sm text-white/90 leading-snug">{r.texto}</span>
            </li>
          ))}
        </ul>
        <p className="flex items-center gap-2 mt-5 text-sm text-white">
          <ShieldCheck className="w-5 h-5 text-[#8FD9CE]" />
          Contrato homologado pelo <strong>Sindibes</strong> protege o seu salão.
        </p>
      </div>
    </div>
  )
}
