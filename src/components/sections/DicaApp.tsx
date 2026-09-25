'use client'

import Image from 'next/image'
import { Quote, ShieldCheck, Sparkles, FileText, BellRing, IdCard } from 'lucide-react'
import { useTenant } from '@/components/TenantProvider'

/** App indicado na dica. Trocar aqui muda a seção inteira. */
const APP = {
  id: 'mei',
  nome: 'MEI',
  autor: 'Receita Federal',
  android: 'https://play.google.com/store/apps/details?id=br.gov.fazenda.receita.mei&hl=pt_BR',
  ios: 'https://apps.apple.com/br/app/mei/id1040521803',
}

const RECURSOS = [
  { icon: FileText, texto: 'Emitir o DAS, a guia mensal do MEI' },
  { icon: IdCard, texto: 'Consultar os dados do seu CNPJ' },
  { icon: BellRing, texto: 'Acompanhar pendências e prazos' },
]

/** Registra o clique sem atrasar a ida para a loja. */
function registrarClique(loja: 'android' | 'ios') {
  try {
    const corpo = JSON.stringify({ app: APP.id, loja })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/app-clique', new Blob([corpo], { type: 'application/json' }))
      return
    }
    fetch('/api/app-clique', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: corpo,
      keepalive: true,
    }).catch(() => {})
  } catch {}
}

export default function DicaApp() {
  const { config } = useTenant()
  const atendente = config.atendente_nome || 'Wagner'

  return (
    <section className="py-20 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="relative bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden scroll-reveal">
          {/* Fio colorido no topo */}
          <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0">
            {/* ── A dica ── */}
            <div className="p-8 md:p-10 order-2">
              <p className="text-gray-600 text-lg leading-relaxed mb-1">
                <span className="text-3xl text-primary/30 font-serif leading-none align-[-0.2em] mr-1">“</span>
                Se você é <strong className="text-text font-semibold">MEI</strong>, instale o aplicativo
                oficial da Receita Federal no seu celular. Dá para emitir a guia mensal e conferir a
                situação do seu CNPJ em poucos toques, sem depender de computador.
                <span className="text-3xl text-primary/30 font-serif leading-none align-[-0.4em] ml-1">”</span>
              </p>

              <div className="flex items-center gap-2 mt-5 mb-6">
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> App oficial do Governo
                </span>
                <span className="text-xs text-gray-400 font-medium">Gratuito</span>
              </div>

              {/* O que dá para fazer */}
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
                {RECURSOS.map(({ icon: Icone, texto }) => (
                  <li
                    key={texto}
                    className="flex items-start gap-2.5 bg-bg-alt rounded-xl px-3.5 py-3"
                  >
                    <Icone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-[13px] text-gray-600 leading-snug">{texto}</span>
                  </li>
                ))}
              </ul>

              {/* Botões das lojas */}
              <div className="flex flex-col sm:flex-row gap-3">
                <BotaoLoja loja="android" href={APP.android} />
                <BotaoLoja loja="ios" href={APP.ios} />
              </div>

              <p className="text-[11px] text-gray-400 mt-4">
                Os links abrem na loja oficial do seu celular, em uma nova aba.
              </p>
            </div>

            {/* ── Quem dá a dica: retrato ocupando a coluna inteira ── */}
            <div className="relative order-1 min-h-[260px] lg:min-h-full bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
              {config.atendente_foto_url ? (
                <Image
                  src={config.atendente_foto_url}
                  alt={atendente}
                  fill
                  className="object-cover object-[center_20%]"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold">
                  {atendente[0]}
                </div>
              )}

              {/* Escurece o pé da foto para o nome ficar legível */}
              <span className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Etiqueta sobre a foto */}
              <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-white/95 text-primary text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" /> Dica do {atendente}
              </span>

              {/* Assinatura no rodapé da foto */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <Quote className="w-6 h-6 text-white/50 mb-1.5" />
                <p className="text-white font-bold text-lg leading-tight drop-shadow">{atendente}</p>
                <p className="text-white/80 text-xs mt-0.5 drop-shadow">
                  Atendimento do {config.nome}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function BotaoLoja({ loja, href }: { loja: 'android' | 'ios'; href: string }) {
  const ehAndroid = loja === 'android'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => registrarClique(loja)}
      className="group flex items-center gap-3 bg-[#1B2444] hover:bg-[#2A3560] text-white rounded-xl px-5 py-3 transition-colors shadow-lg hover:shadow-xl"
      aria-label={ehAndroid ? 'Baixar na Google Play' : 'Baixar na App Store'}
    >
      {ehAndroid ? <IconePlayStore /> : <IconeAppStore />}
      <span className="flex flex-col leading-none text-left">
        <span className="text-[10px] uppercase tracking-wide text-white/70">
          {ehAndroid ? 'Disponível no' : 'Baixar na'}
        </span>
        <span className="text-[15px] font-semibold mt-0.5">
          {ehAndroid ? 'Google Play' : 'App Store'}
        </span>
      </span>
    </a>
  )
}

/** Ícone da Google Play com as quatro cores oficiais. */
function IconePlayStore() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" aria-hidden="true">
      <path d="M3.6 1.8 13.2 12 3.6 22.2c-.4-.3-.6-.8-.6-1.4V3.2c0-.6.2-1.1.6-1.4z" fill="#00A0FF" />
      <path d="M16.8 8.6 13.2 12l3.6 3.4 4.2-2.4c.8-.5.8-1.5 0-2l-4.2-2.4z" fill="#FFBC00" />
      <path d="M16.8 15.4 13.2 12 3.6 22.2c.5.4 1.2.4 1.9 0l11.3-6.8z" fill="#FF3A44" />
      <path d="M16.8 8.6 5.5 1.8c-.7-.4-1.4-.4-1.9 0L13.2 12l3.6-3.4z" fill="#00D97E" />
    </svg>
  )
}

/** Maçã da Apple. */
function IconeAppStore() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0 fill-white" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}
